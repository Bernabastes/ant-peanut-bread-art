import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchOrders, STATUSES, type AdminOrder } from "@/lib/admin";
import { formatMoney } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/orders")({ component: Orders });

function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });
  const [q, setQ] = useState("");
  const [st, setSt] = useState("");
  const [pay, setPay] = useState("");
  const [date, setDate] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => {
    const s = q.toLowerCase();
    return orders.filter(
      (o) =>
        (!s ||
          o.order_number.toLowerCase().includes(s) ||
          o.customer_name.toLowerCase().includes(s) ||
          o.phone.includes(s)) &&
        (!st || o.status === st) &&
        (!pay || o.payment_status === pay) &&
        (!date || o.created_at.startsWith(date)),
    );
  }, [orders, q, st, pay, date]);
  const sel = "h-9 rounded-md border bg-card px-3 text-sm";

  return (
    <div>
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Input
          placeholder="Order #, name or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-60 bg-card"
        />
        <select
          className={sel}
          value={st}
          onChange={(e) => setSt(e.target.value)}
          aria-label="Status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className={sel}
          value={pay}
          onChange={(e) => setPay(e.target.value)}
          aria-label="Payment"
        >
          <option value="">Any payment</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>
        <input
          type="date"
          className={sel}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date"
        />
      </div>
      {isLoading && <p className="mt-6 text-muted-foreground">Loading…</p>}
      <ul className="mt-6 space-y-3">
        {list.map((o) => (
          <li key={o.id} className="rounded-2xl bg-card shadow-soft">
            <button
              onClick={() => setOpen(open === o.id ? null : o.id)}
              className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-left text-sm"
            >
              <span className="font-mono font-semibold">{o.order_number}</span>
              <span>
                {o.customer_name} · {o.phone}
              </span>
              <span className="rounded-full bg-accent px-3 py-1 text-xs">{o.status}</span>
              <span className={o.payment_status === "Paid" ? "text-leaf" : "text-honey"}>
                {o.payment_status}
              </span>
              <span className="font-semibold">{formatMoney(o.total_cents, o.currency)}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()}
              </span>
            </button>
            {open === o.id && <OrderDetail o={o} />}
          </li>
        ))}
        {!isLoading && list.length === 0 && (
          <li className="text-sm text-muted-foreground">No orders found.</li>
        )}
      </ul>
    </div>
  );
}

function OrderDetail({ o }: { o: AdminOrder }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(o.admin_notes ?? "");
  const m = useMutation({
    mutationFn: async (patch: {
      status?: string;
      payment_status?: string;
      admin_notes?: string;
    }) => {
      const { error } = await supabase.rpc("admin_update_order", {
        _order_id: o.id,
        _status: patch.status ?? null,
        _payment_status: patch.payment_status ?? null,
        _admin_notes: patch.admin_notes ?? null,
        _update_notes: patch.admin_notes !== undefined,
      });
      if (error) {
        if (error.code === "PGRST202") {
          throw new Error(
            "The order-update database function is missing or its schema cache is stale. Run drizzle/migrations/0002_atomic_order_admin.sql in the Supabase SQL Editor, then retry.",
          );
        }
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Order updated");
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const next: Record<string, string[]> = {
    "Pending Confirmation": ["Confirmed", "Rejected"],
    Confirmed: ["Preparing", "Cancelled"],
    Preparing: [o.fulfillment === "pickup" ? "Ready for Pickup" : "Out for Delivery", "Cancelled"],
    "Ready for Pickup": ["Completed", "Cancelled"],
    "Out for Delivery": ["Completed", "Cancelled"],
  };
  return (
    <div className="grid gap-6 border-t p-4 text-sm md:grid-cols-2">
      <div className="space-y-1">
        <p>
          <b>Fulfilment:</b> {o.fulfillment === "delivery" ? "Home delivery" : "Pickup"}
        </p>
        {o.address && (
          <p>
            <b>Address:</b> {o.address}
            {o.city ? `, ${o.city}` : ""}
          </p>
        )}
        {o.delivery_instructions && (
          <p>
            <b>Instructions:</b> {o.delivery_instructions}
          </p>
        )}
        {o.email && (
          <p>
            <b>Email:</b> {o.email}
          </p>
        )}
        {o.customer_note && (
          <p>
            <b>Customer note:</b> {o.customer_note}
          </p>
        )}
        <ul className="mt-3 space-y-1 border-t pt-3">
          {o.items.map((i) => (
            <li key={i.id}>
              {i.quantity} × {i.product_name} ({i.variant_label}) —{" "}
              {formatMoney(i.unit_price_cents * i.quantity, o.currency)}
            </li>
          ))}
        </ul>
        <p className="pt-2">
          Subtotal {formatMoney(o.subtotal_cents, o.currency)} · Delivery{" "}
          {formatMoney(o.delivery_fee_cents, o.currency)} ·{" "}
          <b>Total {formatMoney(o.total_cents, o.currency)}</b>
        </p>
        <ul className="mt-3 space-y-0.5 border-t pt-3 text-xs text-muted-foreground">
          {[...o.history]
            .sort((a, b) => a.created_at.localeCompare(b.created_at))
            .map((h) => (
              <li key={h.id}>
                {new Date(h.created_at).toLocaleString()} —{" "}
                {h.field === "payment" ? "Payment" : "Status"}: {h.value}
              </li>
            ))}
        </ul>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(next[o.status] ?? []).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={s === "Rejected" || s === "Cancelled" ? "outline" : "brand"}
              disabled={m.isPending}
              onClick={() => m.mutate({ status: s })}
            >
              {s}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant={o.payment_status === "Paid" ? "outline" : "honey"}
          disabled={m.isPending}
          onClick={() =>
            m.mutate({ payment_status: o.payment_status === "Paid" ? "Unpaid" : "Paid" })
          }
        >
          {o.payment_status === "Paid" ? "Mark as unpaid" : "Mark payment received"}
        </Button>
        <div>
          <label className="text-xs font-semibold" htmlFor={`n-${o.id}`}>
            Internal notes
          </label>
          <Textarea
            id={`n-${o.id}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="bg-background"
          />
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => m.mutate({ admin_notes: notes })}
          >
            Save notes
          </Button>
        </div>
      </div>
    </div>
  );
}
