import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Ant Peanut" },
      { name: "description", content: "Frequently asked questions about ordering Ant Peanut." },
      { property: "og:title", content: "FAQ — Ant Peanut" },
      {
        property: "og:description",
        content: "Frequently asked questions about ordering Ant Peanut.",
      },
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
    <InfoPage title="Frequently Asked Questions">
      <h2>How do I pay?</h2>
      <p>
        You pay in person when your order is delivered or when you collect it. We never ask for card
        details online.
      </p>
      <h2>How do I know my order was received?</h2>
      <p>
        After checkout you get an order number and access code. Use them on the Order Status page.
      </p>
      <h2>Do you deliver?</h2>
      <p>{s.delivery_enabled ? s.delivery_info : "We currently offer pickup only."}</p>
      <h2>What are the ingredients?</h2>
      <p>Ingredients and allergen details are listed on each product page.</p>
    </InfoPage>
  );
}
