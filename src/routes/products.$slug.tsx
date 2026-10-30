import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Minus, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { stockLabel } from "@/components/ProductCard";
import { catalogQuery, formatMoney, useCatalog, useSettings } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { clampQty } from "@/lib/cart-math";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const c = await context.queryClient.ensureQueryData(catalogQuery);
    const p = c.products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { name: p.name, desc: p.short_description };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Ant Peanut` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: `${loaderData.name} — Ant Peanut` },
          { property: "og:description", content: loaderData.desc },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Product unavailable — Ant Peanut" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block underline">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

function Info({ title, value }: { title: string; value: string | null }) {
  return (
    <div className="border-t py-4">
      <h3 className="font-sans text-sm font-semibold uppercase tracking-wider">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{value || "To be provided by Ant Peanut."}</p>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { products } = useCatalog();
  const settings = useSettings();
  const product = products.find((p) => p.slug === slug)!;
  const [vid, setVid] = useState(product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const v = product.variants.find((x) => x.id === vid) ?? product.variants[0];
  const s = v ? stockLabel(v.stock, v.is_available) : null;
  const canBuy = !!v && v.is_available && v.stock > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: product.variants.map((x) => ({
      "@type": "Offer",
      name: x.label,
      price: (x.price_cents / 100).toFixed(2),
      priceCurrency: settings.currency,
      availability: x.is_available && x.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    })),
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-2 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="overflow-hidden rounded-[2rem] bg-muted shadow-soft">
        {product.image_url && <img src={product.image_url} alt={`${product.name} jar`} width={1024} height={1024} className="aspect-square w-full object-cover" />}
      </div>
      <div className="reveal">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-chocolate">← Shop</Link>
        {product.texture && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-leaf">{product.texture}</p>}
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">{product.name}</h1>
        {v && <p className="mt-4 text-3xl font-semibold">{formatMoney(v.price_cents, settings.currency)}</p>}
        <p className="mt-5 text-lg text-muted-foreground">{product.description}</p>

        <div className="mt-8">
          <div className="mb-2 text-sm font-semibold">Jar size</div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Jar size">
            {product.variants.map((x) => (
              <button
                key={x.id}
                role="radio"
                aria-checked={x.id === v?.id}
                onClick={() => {
                  setVid(x.id);
                  setQty(1);
                }}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${x.id === v?.id ? "border-chocolate bg-chocolate text-cream" : "bg-card hover:border-chocolate"}`}
              >
                {x.label}
              </button>
            ))}
          </div>
          {s && <p className={`mt-3 text-sm font-medium ${s.tone}`}>{s.text}</p>}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border bg-card">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus /></Button>
            <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Increase quantity" onClick={() => v && setQty((q) => clampQty(q + 1, v.stock))}><Plus /></Button>
          </div>
          <Button
            variant="honey"
            size="xl"
            disabled={!canBuy}
            onClick={() => {
              if (!v) return;
              add({ variantId: v.id, slug: product.slug, name: product.name, label: v.label, image: product.image_url, quantity: qty });
              toast.success(`${qty} × ${product.name} (${v.label}) added`, { action: { label: "View cart", onClick: () => (window.location.href = "/cart") } });
            }}
          >
            {canBuy ? "Add to Cart" : "Out of stock"}
          </Button>
        </div>

        <div className="mt-8 flex gap-3 rounded-2xl bg-accent p-5 text-sm">
          <Truck className="h-5 w-5 shrink-0 text-primary" />
          <div>
            {settings.delivery_enabled && <p>Home delivery{settings.delivery_fee_cents ? ` · ${formatMoney(settings.delivery_fee_cents, settings.currency)}` : ""}. {settings.delivery_info}</p>}
            {settings.pickup_enabled && <p className="mt-1">Pickup available{settings.pickup_location ? ` at ${settings.pickup_location}` : ""}.</p>}
            <p className="mt-1 font-medium">Pay in person — no card needed.</p>
          </div>
        </div>

        <div className="mt-8">
          <Info title="Ingredients" value={product.ingredients} />
          <Info title="Allergens" value={product.allergens} />
          <Info title="Storage" value={product.storage_instructions} />
        </div>
      </div>
    </div>
  );
}
