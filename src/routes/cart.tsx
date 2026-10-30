import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogQuery, formatMoney, useCatalog, useSettings } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { cartTotals, clampQty } from "@/lib/cart-math";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Ant Peanut" },
      { name: "description", content: "Review the peanut butter jars in your cart." },
      { property: "og:title", content: "Your Cart — Ant Peanut" },
      { property: "og:description", content: "Review your Ant Peanut order." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQuery),
  component: CartPage,
});

export function useLiveCart() {
  const { items } = useCart();
  const { products } = useCatalog();
  const variants = products.flatMap((p) => p.variants);
  const rows = items.map((i) => ({ item: i, variant: variants.find((v) => v.id === i.variantId) }));
  return { rows, variants };
}

function CartPage() {
  const { items, setQty, remove } = useCart();
  const settings = useSettings();
  const { rows, variants } = useLiveCart();
  const t = cartTotals(items, variants, 0);
  const problems = rows.some((r) => !r.variant || !r.variant.is_available || r.variant.stock < r.item.quantity);

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-accent"><ShoppingBag className="h-10 w-10 text-primary" /></div>
        <h1 className="mt-6 text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Let's find you a jar of something delicious.</p>
        <Button variant="honey" size="xl" className="mt-8" asChild><Link to="/shop">Start shopping</Link></Button>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_360px] md:px-8">
      <div>
        <h1 className="text-4xl font-bold md:text-5xl">Your Cart</h1>
        <ul className="mt-8 divide-y rounded-3xl bg-card shadow-soft">
          {rows.map(({ item, variant }) => {
            const ok = variant && variant.is_available;
            return (
              <li key={item.variantId} className="flex gap-4 p-5">
                {item.image && <img src={item.image} alt="" width={96} height={96} className="h-24 w-24 rounded-2xl object-cover" />}
                <div className="flex flex-1 flex-col">
                  <Link to="/products/$slug" params={{ slug: item.slug }} className="font-display text-lg font-semibold hover:underline">{item.name}</Link>
                  <span className="text-sm text-muted-foreground">{item.label}{variant ? ` · ${formatMoney(variant.price_cents, settings.currency)} each` : ""}</span>
                  {!ok && <span className="text-sm text-destructive">No longer available — please remove.</span>}
                  {ok && variant.stock < item.quantity && <span className="text-sm text-destructive">Only {variant.stock} left.</span>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Decrease" onClick={() => setQty(item.variantId, item.quantity - 1)}><Minus /></Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" aria-label="Increase" onClick={() => setQty(item.variantId, clampQty(item.quantity + 1, variant?.stock ?? 1))}><Plus /></Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{variant ? formatMoney(variant.price_cents * item.quantity, settings.currency) : "—"}</span>
                      <Button variant="ghost" size="icon" aria-label={`Remove ${item.name}`} onClick={() => remove(item.variantId)}><Trash2 /></Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <Link to="/shop" className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline">← Continue shopping</Link>
      </div>
      <aside className="h-fit rounded-3xl bg-card p-6 shadow-soft md:sticky md:top-32">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{formatMoney(t.subtotal, settings.currency)}</dd></div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Delivery</dt>
            <dd>{settings.delivery_enabled ? (settings.delivery_fee_cents ? `${formatMoney(settings.delivery_fee_cents, settings.currency)} if delivered` : "Free") : "Pickup only"}</dd>
          </div>
        </dl>
        <p className="mt-6 rounded-2xl bg-accent p-4 text-xs">Pay in person when you receive or collect your order.</p>
        <Button variant="honey" size="xl" className="mt-6 w-full" disabled={problems} asChild={!problems}>
          {problems ? <span>Fix cart to continue</span> : <Link to="/checkout">Proceed to checkout</Link>}
        </Button>
      </aside>
    </div>
  );
}
