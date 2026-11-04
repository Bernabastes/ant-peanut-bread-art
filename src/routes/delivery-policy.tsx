import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/delivery-policy")({
  head: () => ({
    meta: [
      { title: "Local Pickup — Ant Peanut" },
      { name: "description", content: "Local pickup information for Ant Peanut orders." },
      { property: "og:title", content: "Local Pickup — Ant Peanut" },
      { property: "og:description", content: "How to collect your Ant Peanut order." },
    ],
  }),
  loader: ({ context }: { context: RouterContext }) =>
    context.queryClient.ensureQueryData(settingsQuery),
  component: Page,
});

function Page() {
  const s = useSettings();
  void s;
  return (
    <InfoPage title="Local Pickup" draft>
      <h2>Pickup location</h2>
      <p>{s.pickup_location || "Pickup location is shared when we confirm your order."}</p>
      {s.pickup_instructions && <p>{s.pickup_instructions}</p>}
      <h2>Payment</h2>
      <p>Pay in person when you collect your order.</p>
    </InfoPage>
  );
}
