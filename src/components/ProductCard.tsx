import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { formatMoney, type Product } from "@/lib/queries";
import { useCart } from "@/lib/cart";

export function stockLabel(stock: number, available: boolean) {
  if (!available || stock <= 0) return { text: "Out of stock", tone: "text-destructive" };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: "text-honey" };
  return { text: "In stock", tone: "text-leaf" };
}

export function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const [vid, setVid] = useState(product.variants[0]?.id);
  const v = product.variants.find((x) => x.id === vid) ?? product.variants[0];
  const { add } = useCart();
  if (!v) return null;
  const s = stockLabel(v.stock, v.is_available);
  const canBuy = v.is_available && v.stock > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-muted">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={`${product.name} jar`}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {product.texture && (
          <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-chocolate">{product.texture}</span>
        )}
        <span className="absolute bottom-4 right-4 translate-y-2 rounded-full bg-chocolate px-4 py-2 text-xs font-semibold text-cream opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          Quick view
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="font-display text-xl font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.short_description}</p>
        </div>
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Jar size">
            {product.variants.map((x) => (
              <button
                key={x.id}
                role="radio"
                aria-checked={x.id === v.id}
                onClick={() => setVid(x.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${x.id === v.id ? "border-chocolate bg-chocolate text-cream" : "hover:border-chocolate"}`}
              >
                {x.label}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-lg font-semibold">{formatMoney(v.price_cents, currency)}</div>
            <div className={`text-xs font-medium ${s.tone}`}>{v.label} · {s.text}</div>
          </div>
          <Button
            variant="brand"
            disabled={!canBuy}
            onClick={() => {
              add({ variantId: v.id, slug: product.slug, name: product.name, label: v.label, image: product.image_url, quantity: 1 });
              toast.success(`${product.name} (${v.label}) added to cart`);
            }}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
