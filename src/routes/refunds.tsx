import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refunds and cancellations — Ant Peanut" },
      { name: "description", content: "How Ant Peanut handles cancellations and refunds." },
      { property: "og:title", content: "Refunds and cancellations — Ant Peanut" },
      {
        property: "og:description",
        content: "Draft cancellation and refund policy for Ant Peanut.",
      },
    ],
  }),
  loader: ({ context }: { context: RouterContext }) =>
    context.queryClient.ensureQueryData(settingsQuery),
  component: Page,
});

function Page() {
  const s = useSettings();
  return (
    <InfoPage title="Refunds and Cancellations" draft>
      <p>
        This draft explains how {s.business_name} handles changes to an order. Replace it with the
        policy you actually follow before launch.
      </p>
      <h2>Before the order is prepared</h2>
      <p>
        Contact us with your order number if you need to cancel or change a jar size. We can cancel
        an order that is still waiting for confirmation.
      </p>
      <h2>After payment in person</h2>
      <p>
        Payment is collected when the order is picked up. If a jar is damaged when you collect it,
        contact us the same day so we can decide on a replacement or refund.
      </p>
      <h2>Food products</h2>
      <p>
        Opened jars cannot be returned. This page does not promise a refund that the business has
        not agreed to.
      </p>
    </InfoPage>
  );
}
