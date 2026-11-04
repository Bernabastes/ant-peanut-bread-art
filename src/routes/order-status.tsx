import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OrderView, type PublicOrder } from "@/components/OrderView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order-status")({
  head: () => ({
    meta: [
      { title: "Order Status — Ant Peanut" },
      { name: "description", content: "Check the status of your Ant Peanut order." },
      { property: "og:title", content: "Order Status — Ant Peanut" },
      {
        property: "og:description",
        content: "Look up your order with your order number and access code.",
      },
    ],
  }),
  component: Status,
});

function Status() {
  const [o, setO] = useState<PublicOrder | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const num = String(f.get("n")).trim();
    const tok =
      String(f.get("t")).trim() || localStorage.getItem(`ap-order-${num.toUpperCase()}`) || "";
    setBusy(true);
    setErr("");
    try {
      const { data, error } = await supabase.rpc("get_order_public", {
        _order_number: num,
        _token: tok,
      });
      if (error) {
        setO(null);
        setErr("We couldn't check your order right now. Please try again.");
      } else {
        setErr(data ? "" : "We couldn't find an order with those details.");
        setO((data as PublicOrder) ?? null);
      }
    } catch {
      setO(null);
      setErr("We couldn't check your order right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-4xl font-bold">Check your order</h1>
      <p className="mt-2 text-muted-foreground">
        Enter the order number and access code shown after checkout.
      </p>
      <form onSubmit={go} className="mt-8 space-y-4 rounded-3xl bg-card p-6 shadow-soft">
        <div>
          <Label htmlFor="n">Order number</Label>
          <Input id="n" name="n" placeholder="AP-261030-XXXXX" required />
        </div>
        <div>
          <Label htmlFor="t">Access code</Label>
          <Input id="t" name="t" placeholder="Saved automatically on this device" />
        </div>
        <Button variant="brand" type="submit" disabled={busy}>
          {busy ? "Checking…" : "Check status"}
        </Button>
        {err && <p className="text-sm text-destructive">{err}</p>}
      </form>
      {o && (
        <div className="mt-8">
          <OrderView o={o} />
        </div>
      )}
    </div>
  );
}
