import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/admin";
import { formatMoney, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Overview });

function Overview() {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchOrders });
  const { data: s } = useQuery(settingsQuery);
  const c = (st: string) => orders.filter((o) => o.status === st).length;
  const active = orders.filter((o) => o.status !== "Cancelled" && o.status !== "Rejected");
  const stats = [
    ["Total orders", orders.length],
    ["Pending", c("Pending Confirmation")],
    ["Confirmed", c("Confirmed")],
    ["Preparing", c("Preparing")],
    ["Ready / out", c("Ready for Pickup") + c("Out for Delivery")],
    ["Completed", c("Completed")],
    ["Unpaid (active)", active.filter((o) => o.payment_status === "Unpaid").length],
    ["Order value", formatMoney(active.reduce((n, o) => n + o.total_cents, 0), s?.currency)],
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold">Overview</h1>
      {isLoading ? <p className="mt-6 text-muted-foreground">Loading…</p> : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-card p-5 shadow-soft"><div className="text-xs text-muted-foreground">{l}</div><div className="mt-1 text-2xl font-semibold">{v}</div></div>
            ))}
          </div>
          <h2 className="mt-10 text-xl font-semibold">Recent orders</h2>
          <ul className="mt-4 divide-y rounded-2xl bg-card shadow-soft">
            {orders.slice(0, 8).map((o) => (
              <li key={o.id} className="flex flex-wrap justify-between gap-2 p-4 text-sm">
                <span className="font-mono font-semibold">{o.order_number}</span><span>{o.customer_name}</span>
                <span>{o.status}</span><span className={o.payment_status === "Paid" ? "text-leaf" : "text-honey"}>{o.payment_status}</span>
                <span className="font-semibold">{formatMoney(o.total_cents, o.currency)}</span>
              </li>
            ))}
            {orders.length === 0 && <li className="p-6 text-sm text-muted-foreground">No orders yet.</li>}
          </ul>
          <Link to="/admin/orders" className="mt-4 inline-block text-sm underline">Manage all orders →</Link>
        </>
      )}
    </div>
  );
}
