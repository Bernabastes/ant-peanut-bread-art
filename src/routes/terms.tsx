import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — Ant Peanut" },
      { name: "description", content: "Terms for ordering from Ant Peanut." },
      { property: "og:title", content: "Terms and Conditions — Ant Peanut" },
      { property: "og:description", content: "Terms for ordering from Ant Peanut." },
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
    <InfoPage title="Terms and Conditions" draft>
      <p>
        Orders placed online are requests until confirmed by {s.business_name}. Prices are shown in{" "}
        {s.currency}. Payment is made in person on delivery or collection.
      </p>
      <h2>Cancellations and refunds</h2>
      <p>
        You may cancel before your order is prepared by contacting us. Refund terms for food
        products will be confirmed by the owner.
      </p>
    </InfoPage>
  );
}
