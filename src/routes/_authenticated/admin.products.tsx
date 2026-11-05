import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { resolveProductImage } from "@/lib/images";
import { formatMoney, settingsQuery } from "@/lib/queries";
import { useLanguage } from "@/lib/language-context";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsAdmin,
});

type VariantDraft = {
  id?: string;
  label: string;
  price: string;
  stock: string;
  is_available: boolean;
};
type ProductRow = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  texture: string | null;
  ingredients: string | null;
  allergens: string | null;
  storage_instructions: string | null;
  image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  variants: {
    id: string;
    label: string;
    price_cents: number;
    stock: number;
    is_available: boolean;
    sort_order: number;
  }[];
};

const emptyVariant = (): VariantDraft => ({
  label: "500 g",
  price: "",
  stock: "0",
  is_available: true,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data: settings } = useQuery(settingsQuery);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const [{ data: products, error: pErr }, { data: categories, error: cErr }] =
        await Promise.all([
          supabase.from("products").select("*, variants:product_variants(*)").order("sort_order"),
          supabase.from("categories").select("id, name, slug").order("sort_order"),
        ]);
      if (pErr) throw pErr;
      if (cErr) throw cErr;
      return { products: (products ?? []) as ProductRow[], categories: categories ?? [] };
    },
  });
  const [editing, setEditing] = useState<string | "new" | null>(null);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["catalog"] });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Sample prices already in the catalog are placeholders. Set your real prices, stock, and
            jar photos before you take orders.
          </p>
        </div>
        <Button variant="brand" onClick={() => setEditing("new")}>
          New product
        </Button>
      </div>
      {isLoading && <p className="mt-6 text-muted-foreground">Loading…</p>}
      {error && <p className="mt-6 text-destructive">{(error as Error).message}</p>}
      <ul className="mt-6 space-y-3">
        {data?.products.map((p) => (
          <li key={p.id} className="rounded-2xl bg-card p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={resolveProductImage(p.image_url)}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.is_published ? "Published" : "Hidden"}
                    {p.is_featured ? " · Featured" : ""} ·{" "}
                    {p.variants
                      .map(
                        (v) =>
                          `${v.label} ${formatMoney(v.price_cents, settings?.currency)} (${v.stock})`,
                      )
                      .join(" · ")}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setEditing(p.id)}>
                Edit
              </Button>
            </div>
            {editing === p.id && data && (
              <ProductForm
                product={p}
                categories={data.categories}
                currency={settings?.currency ?? "ETB"}
                onDone={() => {
                  setEditing(null);
                  refresh();
                }}
              />
            )}
          </li>
        ))}
      </ul>
      {editing === "new" && data && (
        <div className="mt-6 rounded-2xl bg-card p-4 shadow-soft">
          <h2 className="text-xl font-semibold">New product</h2>
          <ProductForm
            categories={data.categories}
            currency={settings?.currency ?? "ETB"}
            onDone={() => {
              setEditing(null);
              refresh();
            }}
          />
        </div>
      )}
    </div>
  );
}

function ProductForm({
  product,
  categories,
  currency,
  onDone,
}: {
  product?: ProductRow;
  categories: { id: string; name: string; slug: string }[];
  currency: string;
  onDone: () => void;
}) {
  const { language } = useLanguage();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [short, setShort] = useState(product?.short_description ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [texture, setTexture] = useState(product?.texture ?? "Creamy");
  const [ingredients, setIngredients] = useState(product?.ingredients ?? "");
  const [allergens, setAllergens] = useState(product?.allergens ?? "");
  const [storage, setStorage] = useState(product?.storage_instructions ?? "");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "/images/jar-creamy.svg");
  const [published, setPublished] = useState(product?.is_published ?? true);
  const [featured, setFeatured] = useState(product?.is_featured ?? false);
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants.length
      ? [...product.variants]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((v) => ({
            id: v.id,
            label: v.label,
            price: (v.price_cents / 100).toFixed(2),
            stock: String(v.stock),
            is_available: v.is_available,
          }))
      : [emptyVariant()],
  );
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    const path = `${product?.id ?? crypto.randomUUID()}/${file.name.replace(/[^\w.-]+/g, "-")}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });
    if (error) {
      toast.error(
        `${error.message} If the bucket is missing, run drizzle/migrations/0001_admin_extras.sql.`,
      );
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    toast.success("Photo uploaded");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Enter a product name.");
      return;
    }
    const finalSlug = slugify(slug || name);
    if (!finalSlug) {
      toast.error("Enter a web address slug.");
      return;
    }
    const parsed = variants.map((v, i) => {
      const price = Math.round(Number(v.price) * 100);
      const stock = Number.parseInt(v.stock, 10);
      if (
        !v.label.trim() ||
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isInteger(stock) ||
        stock < 0
      )
        return null;
      return { ...v, label: v.label.trim(), price, stock, sort_order: i };
    });
    if (parsed.some((v) => !v)) {
      toast.error("Every jar size needs a label, a price, and a stock quantity of zero or more.");
      return;
    }
    const rows = parsed.filter((v): v is NonNullable<typeof v> => !!v);
    setBusy(true);
    let cat = categoryId;
    if (newCategory.trim()) {
      const cslug = slugify(newCategory);
      const { data: created, error } = await supabase
        .from("categories")
        .insert({ name: newCategory.trim(), slug: cslug })
        .select("id")
        .single();
      if (error || !created) {
        setBusy(false);
        toast.error(error?.message ?? "Could not add the category.");
        return;
      }
      cat = created.id;
    }
    const body = {
      name: name.trim(),
      slug: finalSlug,
      short_description: short.trim(),
      description: description.trim(),
      texture: texture.trim() || null,
      ingredients: ingredients.trim() || null,
      allergens: allergens.trim() || null,
      storage_instructions: storage.trim() || null,
      image_url: imageUrl.trim() || null,
      is_published: published,
      is_featured: featured,
      category_id: cat || null,
    };
    const saved = product
      ? await supabase.from("products").update(body).eq("id", product.id).select("id").single()
      : await supabase.from("products").insert(body).select("id").single();
    if (saved.error || !saved.data) {
      setBusy(false);
      toast.error(saved.error?.message ?? "Could not save the product.");
      return;
    }
    const id = saved.data.id;
    const keep = rows.filter((v) => v.id).map((v) => v.id as string);
    if (product) {
      const gone = product.variants.filter((v) => !keep.includes(v.id));
      if (gone.length) {
        const { error } = await supabase
          .from("product_variants")
          .delete()
          .in(
            "id",
            gone.map((v) => v.id),
          );
        if (error) {
          setBusy(false);
          toast.error(error.message);
          return;
        }
      }
    }
    for (const v of rows) {
      const payload = {
        product_id: id,
        label: v.label,
        price_cents: v.price,
        stock: v.stock,
        is_available: v.is_available,
        sort_order: v.sort_order,
      };
      const res = v.id
        ? await supabase.from("product_variants").update(payload).eq("id", v.id)
        : await supabase.from("product_variants").insert(payload);
      if (res.error) {
        setBusy(false);
        toast.error(res.error.message);
        return;
      }
    }
    setBusy(false);
    toast.success("Product saved");
    onDone();
  }

  async function remove() {
    const confirmation =
      language === "am"
        ? `የ${product?.name ?? ""} ምርትን ሰርዝ? ቀደም ያሉ ትዕዛዞች የምርት ስሞቻቸውን ይጠብቃሉ።`
        : `Delete ${product?.name ?? ""}? Past orders keep their item names.`;
    if (!product || !confirm(confirmation)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product deleted");
    onDone();
  }

  const field = "bg-background";
  return (
    <form onSubmit={save} className="mt-4 grid gap-4 border-t pt-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!product) setSlug(slugify(e.target.value));
            }}
            className={field}
            required
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={field}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Short description</Label>
          <Input value={short} onChange={(e) => setShort(e.target.value)} className={field} />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={field}
            rows={3}
          />
        </div>
        <div>
          <Label>Texture</Label>
          <select
            value={texture}
            onChange={(e) => setTexture(e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="Creamy">Creamy</option>
            <option value="Smooth">Smooth</option>
          </select>
        </div>
        <div>
          <Label>Category</Label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Or add a category</Label>
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Optional new category name"
            className={field}
          />
        </div>
        <div>
          <Label>Ingredients</Label>
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className={field}
            rows={2}
            placeholder="Only what you actually use"
          />
        </div>
        <div>
          <Label>Allergens</Label>
          <Textarea
            value={allergens}
            onChange={(e) => setAllergens(e.target.value)}
            className={field}
            rows={2}
            placeholder="Only verified allergen information"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Storage</Label>
          <Input value={storage} onChange={(e) => setStorage(e.target.value)} className={field} />
        </div>
        <div className="sm:col-span-2">
          <Label>Photo</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={field} />
          <input
            type="file"
            accept="image/*"
            className="mt-2 text-sm"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Illustrations are placeholders. Upload a photo of your real jar when you have one.
          </p>
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />{" "}
          Available in the shop
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />{" "}
          Feature on the homepage
        </label>
      </div>
      <div>
        <div className="mb-2 text-sm font-semibold">Jar sizes — prices in {currency}</div>
        <div className="space-y-2">
          {variants.map((v, i) => (
            <div
              key={v.id ?? i}
              className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto_auto]"
            >
              <Input
                aria-label="Size"
                value={v.label}
                readOnly
                placeholder="500 g"
                className={field}
              />
              <Input
                aria-label="Price"
                value={v.price}
                onChange={(e) =>
                  setVariants(
                    variants.map((x, n) => (n === i ? { ...x, price: e.target.value } : x)),
                  )
                }
                placeholder="0.00"
                inputMode="decimal"
                className={field}
              />
              <Input
                aria-label="Stock"
                value={v.stock}
                onChange={(e) =>
                  setVariants(
                    variants.map((x, n) => (n === i ? { ...x, stock: e.target.value } : x)),
                  )
                }
                inputMode="numeric"
                className={field}
              />
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={v.is_available}
                  onChange={(e) =>
                    setVariants(
                      variants.map((x, n) =>
                        n === i ? { ...x, is_available: e.target.checked } : x,
                      ),
                    )
                  }
                />{" "}
                On sale
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="brand" disabled={busy}>
          {busy ? "Saving…" : "Save product"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Close
        </Button>
        {product && (
          <Button type="button" variant="outline" onClick={remove}>
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
