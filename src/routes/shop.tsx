import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { catalogQuery, useCatalog, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

type ShopSearch = {
  q?: string | undefined;
  cat?: string | undefined;
  size?: string | undefined;
  texture?: string | undefined;
  sort?: "name" | "price-asc" | "price-desc" | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s["q"] === "string" ? s["q"] : undefined,
    cat: typeof s["cat"] === "string" ? s["cat"] : undefined,
    size: typeof s["size"] === "string" ? s["size"] : undefined,
    texture: typeof s["texture"] === "string" ? s["texture"] : undefined,
    sort:
      s["sort"] === "name" || s["sort"] === "price-asc" || s["sort"] === "price-desc"
        ? s["sort"]
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Peanut Butter — Ant Peanut" },
      {
        name: "description",
        content: "Shop creamy Ant Peanut peanut butter in a 500 g jar.",
      },
      { property: "og:title", content: "Shop Peanut Butter — Ant Peanut" },
      {
        property: "og:description",
        content: "Creamy peanut butter in a 500 g jar. Order online, pay in person.",
      },
    ],
  }),
  loader: ({ context }: { context: RouterContext }) =>
    context.queryClient.ensureQueryData(catalogQuery),
  component: Shop,
});

function Shop() {
  const { products, categories } = useCatalog();
  const settings = useSettings();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Partial<ShopSearch>) =>
    navigate({ search: (s: ShopSearch) => ({ ...s, ...patch }), replace: true });

  const list = useMemo(() => {
    const q = (search.q ?? "").toLowerCase();
    let l = products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q)) &&
        (!search.cat || p.category?.slug === search.cat) &&
        (!search.size || p.variants.some((v) => v.label === search.size)) &&
        (!search.texture || p.texture === search.texture),
    );
    const minPrice = (p: (typeof l)[number]) => Math.min(...p.variants.map((v) => v.price_cents));
    if (search.sort === "name") l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    if (search.sort === "price-asc") l = [...l].sort((a, b) => minPrice(a) - minPrice(b));
    if (search.sort === "price-desc") l = [...l].sort((a, b) => minPrice(b) - minPrice(a));
    return l;
  }, [products, search]);

  const sizes = [...new Set(products.flatMap((p) => p.variants.map((v) => v.label)))];
  const textures = [...new Set(products.map((p) => p.texture).filter((t): t is string => !!t))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-5xl font-bold md:text-6xl">The Shop</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Creamy peanut butter in a 500 g jar. Pay in person when you receive it.
      </p>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {[{ slug: undefined, name: "All" }, ...categories].map((c) => (
            <button
              key={c.name}
              onClick={() => set({ cat: c.slug })}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${search.cat === c.slug ? "border-chocolate bg-chocolate text-cream" : "bg-card hover:border-chocolate"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => set({ size: undefined })}
            className={`rounded-full border px-4 py-2 text-sm ${!search.size ? "border-chocolate bg-chocolate text-cream" : "bg-card"}`}
          >
            Any size
          </button>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => set({ size })}
              className={`rounded-full border px-4 py-2 text-sm ${search.size === size ? "border-chocolate bg-chocolate text-cream" : "bg-card"}`}
            >
              {size}
            </button>
          ))}
          <button
            onClick={() => set({ texture: undefined })}
            className={`rounded-full border px-4 py-2 text-sm ${!search.texture ? "border-chocolate bg-chocolate text-cream" : "bg-card"}`}
          >
            Any texture
          </button>
          {textures.map((texture) => (
            <button
              key={texture}
              onClick={() => set({ texture })}
              className={`rounded-full border px-4 py-2 text-sm ${search.texture === texture ? "border-chocolate bg-chocolate text-cream" : "bg-card"}`}
            >
              {texture}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="relative">
            <span className="sr-only">Search products</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus={search.q !== undefined}
              value={search.q ?? ""}
              onChange={(e) => set({ q: e.target.value || undefined })}
              placeholder="Search…"
              className="h-10 w-48 rounded-full bg-card pl-9"
            />
          </label>
          <label>
            <span className="sr-only">Sort</span>
            <select
              value={search.sort ?? ""}
              onChange={(e) => set({ sort: (e.target.value || undefined) as ShopSearch["sort"] })}
              className="h-10 rounded-full border bg-card px-4 text-sm"
            >
              <option value="">Featured</option>
              <option value="name">Name</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No products match your search.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} currency={settings.currency} />
          ))}
        </div>
      )}
    </div>
  );
}
