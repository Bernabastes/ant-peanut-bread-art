import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { OrderView, type PublicOrder } from "@/components/OrderView";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order-confirmation/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ t: typeof s["t"] === "string" ? s["t"] : "" }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Ant Peanut" },
      { name: "description", content: "Your Ant Peanut order confirmation." },
      { property: "og:title", content: "Order Confirmed — Ant Peanut" },
      { property: "og:description", content: "Thanks for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  ssr: false,
  component: Confirm,
});

function Confirm() {
  const { id } = Route.useParams();
  const [o, setO] = useState<PublicOrder | null | undefined>(undefined);
  const [failed, setFailed] = useState(false);
  const token = typeof window !== "undefined" ? (localStorage.getItem(`ap-order-${id}`) ?? "") : "";

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const { data, error } = await supabase.rpc("get_order_public", {
          _order_number: id,
          _token: token,
        });
        if (!active) return;
        if (error) {
          setFailed(true);
          setO(null);
          return;
        }
        setO((data as PublicOrder) ?? null);
      } catch {
        if (!active) return;
        setFailed(true);
        setO(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, token]);

  if (o === undefined)
    return <p className="py-32 text-center text-muted-foreground">Loading your order…</p>;
  if (o === null)
    return (
      <div className="py-32 text-center">
        <h1 className="text-3xl font-bold">
          {failed ? "Unable to load your order" : "Order not found"}
        </h1>
        {failed && <p className="mt-2 text-muted-foreground">Please try again in a moment.</p>}
        <Link to="/order-status" className="mt-4 inline-block underline">
          Look up an order
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-leaf" />
      <h1 className="mt-4 text-4xl font-bold md:text-5xl">
        Thank you, {o.customer_name.split(" ")[0]}!
      </h1>
      <p className="mt-3 text-muted-foreground">
        Your order has been received. We'll contact you to confirm. Pay in person when you{" "}
        {o.fulfillment === "delivery" ? "receive it" : "collect it"}.
      </p>
      <div className="mt-10">
        <OrderView o={o} />
      </div>
      <div className="mt-6 rounded-2xl bg-accent p-4 text-sm">
        Save this to check your order later — order number <b>{o.order_number}</b> and access code{" "}
        <code className="break-all font-mono">{token}</code>
      </div>
      <Link to="/shop" className="mt-8 inline-block underline">
        Continue shopping
      </Link>
    </div>
  );
}
