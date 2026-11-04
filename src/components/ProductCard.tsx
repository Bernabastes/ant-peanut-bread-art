import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { resolveProductImage } from "@/lib/images";
import { formatMoney, type Product } from "@/lib/queries";
import { useCart } from "@/lib/cart";

export function stockLabel(stock: number, available: boolean) {
  if (!available || stock <= 0) return { text: "Out of stock", tone: "text-destructive" };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: "text-honey" };
  return { text: "In stock", tone: "text-leaf" };
}

export function ProductCard({ product, currency }: { product: Product; currency: string }) {
  const [vid, setVid] = useState(product.variants[0]?.id);
  const [quick, setQuick] = useState(false);
  const v = product.variants.find((x) => x.id === vid) ?? product.variants[0];
  const { add } = useCart();
  if (!v) return null;
  const s = stockLabel(v.stock, v.is_available);
  const canBuy = v.is_available && v.stock > 0;
  const image = resolveProductImage(product.image_url);
  const alt = `${product.name} jar. Illustrated placeholder until a photograph of the real jar is added.`;

  function addCurrent(variant: NonNullable<typeof v>) {
    add({
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      label: variant.label,
      image,
      quantity: 1,
    });
    toast.success(`${product.name} (${variant.label}) added to cart`);
    setQuick(false);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to="/products/$slug" params={{ slug: product.slug }} className="block h-full">
          <img
            src={image}
            alt={alt}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {product.texture && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-chocolate">
            {product.texture}
          </span>
        )}
        <button
          type="button"
          onClick={() => setQuick(true)}
          className="absolute bottom-4 right-4 rounded-full bg-chocolate px-4 py-2 text-xs font-semibold text-cream transition-all md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          Quick view
        </button>
      </div>
      <Dialog open={quick} onOpenChange={setQuick}>
        <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0 sm:rounded-3xl">
          <div className="grid md:grid-cols-2">
            <img
              src={image}
              alt={alt}
              width={800}
              height={800}
              className="aspect-square w-full bg-muted object-cover"
            />
            <div className="flex flex-col p-6">
              <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                {product.short_description}
              </DialogDescription>
              <p className="mt-4 text-2xl font-semibold">{formatMoney(v.price_cents, currency)}</p>
              <p className={`mt-1 text-sm font-medium ${s.tone}`}>
                {v.label} · {s.text}
              </p>
              {product.variants.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Jar size">
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
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <Button variant="honey" disabled={!canBuy} onClick={() => addCurrent(v)}>
                  {canBuy ? "Add to cart" : "Out of stock"}
                </Button>
                <Button variant="soft" asChild>
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    onClick={() => setQuick(false)}
                  >
                    Full details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
            <div className={`text-xs font-medium ${s.tone}`}>
              {v.label} · {s.text}
            </div>
          </div>
          <Button variant="brand" disabled={!canBuy} onClick={() => addCurrent(v)}>
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
