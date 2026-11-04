import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { catalogQuery, formatMoney, useSettings } from "@/lib/queries";
import { useCart } from "@/lib/cart";
import { cartTotals } from "@/lib/cart-math";
import { useLiveCart } from "./cart";
import { supabase } from "@/integrations/supabase/client";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Ant Peanut" },
      { name: "description", content: "Place your Ant Peanut order and pay in person." },
      { property: "og:title", content: "Checkout — Ant Peanut" },
      { property: "og:description", content: "Place your order online, pay in person." },
    ],
  }),
  loader: ({ context }: { context: RouterContext }) =>
    context.queryClient.ensureQueryData(catalogQuery),
  component: Checkout,
});

function Checkout() {
  const settings = useSettings();
  const { items, clear } = useCart();
  const { rows, variants } = useLiveCart();
  const navigate = useNavigate();
  const [ful, setFul] = useState<"delivery" | "pickup">(
    settings.delivery_enabled ? "delivery" : "pickup",
  );
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const key = useRef(crypto.randomUUID());
  const fee = ful === "delivery" ? settings.delivery_fee_cents : 0;
  const t = cartTotals(items, variants, fee);
  const problems = rows.some(
    (r) => !r.variant || !r.variant.is_available || r.variant.stock < r.item.quantity,
  );
  const noFulfilment = !settings.delivery_enabled && !settings.pickup_enabled;
  const m = (c: number) => formatMoney(c, settings.currency);

  if (items.length === 0)
    return (
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link to="/shop" className="mt-4 inline-block underline">
          Go to shop
        </Link>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || problems || noFulfilment) return;
    setErr(null);
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    if (!g("customer_name") || !g("phone"))
      return setErr("Please enter your name and phone number.");
    if (ful === "delivery" && !g("address")) return setErr("Please enter your delivery address.");
    setBusy(true);
    const { data, error } = await supabase.rpc("place_order", {
      payload: {
        idempotency_key: key.current,
        customer_name: g("customer_name"),
        phone: g("phone"),
        email: g("email"),
        fulfillment: ful,
        address: g("address"),
        city: g("city"),
        delivery_instructions: g("delivery_instructions"),
        customer_note: g("customer_note"),
        items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      },
    });
    setBusy(false);
    if (error || !data)
      return setErr(error?.message ?? "We couldn't save your order. Please try again.");
    const r = data as { order_number: string; token: string };
    localStorage.setItem(`ap-order-${r.order_number}`, r.token);
    clear();
    navigate({ to: "/order-confirmation/$id", params: { id: r.order_number } });
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_380px] md:px-8"
    >
      <div className="space-y-8">
        <h1 className="text-4xl font-bold md:text-5xl">Checkout</h1>
        <section className="space-y-4 rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="text-2xl font-semibold">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="n">Full name *</Label>
              <Input id="n" name="customer_name" required maxLength={120} />
            </div>
            <div>
              <Label htmlFor="p">Phone number *</Label>
              <Input id="p" name="phone" type="tel" required maxLength={30} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="e">Email (optional)</Label>
              <Input id="e" name="email" type="email" />
            </div>
          </div>
        </section>
        <section className="space-y-4 rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="text-2xl font-semibold">Delivery or pickup</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {settings.delivery_enabled && (
              <button
                type="button"
                onClick={() => setFul("delivery")}
                className={`rounded-2xl border-2 p-4 text-left ${ful === "delivery" ? "border-chocolate bg-accent" : ""}`}
              >
                <div className="font-semibold">Home delivery</div>
                <div className="text-sm text-muted-foreground">
                  {settings.delivery_fee_cents ? m(settings.delivery_fee_cents) : "Free"} ·{" "}
                  {settings.delivery_info}
                </div>
              </button>
            )}
            {settings.pickup_enabled && (
              <button
                type="button"
                onClick={() => setFul("pickup")}
                className={`rounded-2xl border-2 p-4 text-left ${ful === "pickup" ? "border-chocolate bg-accent" : ""}`}
              >
                <div className="font-semibold">Local pickup</div>
                <div className="text-sm text-muted-foreground">
                  {settings.pickup_location || "Location shared when we confirm your order."}
                </div>
              </button>
            )}
          </div>
          {ful === "delivery" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="a">Delivery address *</Label>
                <Input id="a" name="address" required />
              </div>
              <div>
                <Label htmlFor="c">City / area</Label>
                <Input id="c" name="city" />
              </div>
              <div>
                <Label htmlFor="di">Delivery instructions</Label>
                <Input id="di" name="delivery_instructions" />
              </div>
            </div>
          ) : (
            settings.pickup_instructions && (
              <p className="text-sm text-muted-foreground">{settings.pickup_instructions}</p>
            )
          )}
          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" name="customer_note" rows={2} />
          </div>
        </section>
        <section className="rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="text-2xl font-semibold">Payment</h2>
          <div className="mt-4 rounded-2xl border-2 border-chocolate bg-accent p-4">
            <div className="font-semibold">Pay in Person</div>
            <div className="text-sm text-muted-foreground">
              Place your order online and pay when you receive your order or collect it.
            </div>
          </div>
        </section>
      </div>
      <aside className="h-fit rounded-3xl bg-card p-6 shadow-soft md:sticky md:top-32">
        <h2 className="text-2xl font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {rows.map(({ item, variant }) => (
            <li key={item.variantId} className="flex justify-between gap-2">
              <span>
                {item.quantity} × {item.name}{" "}
                <span className="text-muted-foreground">({item.label})</span>
              </span>
              <span>{variant ? m(variant.price_cents * item.quantity) : "—"}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{m(t.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{ful === "delivery" ? "Delivery" : "Pickup"}</dt>
            <dd>{m(fee)}</dd>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <dt>Total due</dt>
            <dd>{m(t.total)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Payment</dt>
            <dd>Pay in Person</dd>
          </div>
        </dl>
        {problems && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
          >
            A jar in your cart is unavailable or there isn't enough left. Update the cart before
            placing the order.
          </p>
        )}
        {noFulfilment && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
          >
            Delivery and pickup are both turned off. The shop can't accept this order yet.
          </p>
        )}
        {err && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
          >
            {err}
          </p>
        )}
        <Button
          type="submit"
          variant="honey"
          size="xl"
          className="mt-6 w-full"
          disabled={busy || problems || noFulfilment}
        >
          {busy ? "Placing order…" : "Place My Order"}
        </Button>
      </aside>
    </form>
  );
}
