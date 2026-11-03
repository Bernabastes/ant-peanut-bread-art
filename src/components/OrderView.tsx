import { formatMoney } from "@/lib/queries";

export type PublicOrder = {
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string;
  fulfillment: string;
  customer_name: string;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  currency: string;
  created_at: string;
  items: { product_name: string; variant_label: string; unit_price_cents: number; quantity: number }[];
};

export function OrderView({ o }: { o: PublicOrder }) {
  const m = (c: number) => formatMoney(c, o.currency);
  return (
    <div className="rounded-3xl bg-card p-6 text-left shadow-soft">
      <div className="flex flex-wrap justify-between gap-2">
        <div><div className="text-xs uppercase text-muted-foreground">Order number</div><div className="font-display text-2xl font-bold">{o.order_number}</div></div>
        <div className="text-right"><div className="text-xs uppercase text-muted-foreground">Status</div><div className="font-semibold">{o.status}</div></div>
      </div>
      <ul className="mt-6 space-y-2 border-t pt-4 text-sm">
        {o.items.map((i, n) => (
          <li key={n} className="flex justify-between"><span>{i.quantity} × {i.product_name} ({i.variant_label})</span><span>{m(i.unit_price_cents * i.quantity)}</span></li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1 border-t pt-4 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{m(o.subtotal_cents)}</dd></div>
        <div className="flex justify-between"><dt>{o.fulfillment === "delivery" ? "Delivery" : "Pickup"}</dt><dd>{m(o.delivery_fee_cents)}</dd></div>
        <div className="flex justify-between text-lg font-semibold"><dt>Amount due</dt><dd>{m(o.total_cents)}</dd></div>
        <div className="flex justify-between text-muted-foreground"><dt>Payment</dt><dd>{o.payment_method} · {o.payment_status}</dd></div>
      </dl>
    </div>
  );
}
