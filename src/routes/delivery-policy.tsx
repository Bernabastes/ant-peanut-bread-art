import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/delivery-policy")({
  head: () => ({
    meta: [
      { title: "Delivery and Collection — Ant Peanut" },
      { name: "description", content: "Ant Peanut delivery and pickup information." },
      { property: "og:title", content: "Delivery and Collection — Ant Peanut" },
      { property: "og:description", content: "Ant Peanut delivery and pickup information." },
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
    <InfoPage title="Delivery and Collection" draft>
      {s.delivery_enabled && (
        <>
          <h2>Home delivery</h2>
          <p>{s.delivery_info}</p>
          {s.delivery_regions && <p>Areas: {s.delivery_regions}</p>}
        </>
      )}
      {s.pickup_enabled && (
        <>
          <h2>Pickup</h2>
          <p>{s.pickup_location || "Pickup location is shared when we confirm your order."}</p>
          {s.pickup_instructions && <p>{s.pickup_instructions}</p>}
        </>
      )}
      <h2>Payment</h2>
      <p>Pay in person when you receive or collect your order.</p>
    </InfoPage>
  );
}
