import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";

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
  component: Page,
});

function Page() {
  return (
    <InfoPage title="Frequently Asked Questions">
      <h2>How do I pay?</h2>
      <p>You pay in person when you collect your order. We never ask for card details online.</p>
      <h2>How do I know my order was received?</h2>
      <p>
        After checkout you get an order number and access code. Use them on the Order Status page.
      </p>
      <h2>Where can I get my order?</h2>
      <p>Orders are available for local pickup. We will confirm the pickup details with you.</p>
      <h2>What are the ingredients?</h2>
      <p>Ingredients and allergen details are listed on each product page.</p>
    </InfoPage>
  );
}
