import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ant Peanut" },
      { name: "description", content: "How Ant Peanut handles your personal information." },
      { property: "og:title", content: "Privacy Policy — Ant Peanut" },
      { property: "og:description", content: "How Ant Peanut handles your personal information." },
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
    <InfoPage title="Privacy Policy" draft>
      <p>
        We collect only the details needed to fulfil your order: your name, phone number, optional
        email, and any information needed to arrange local pickup.
      </p>
      <p>
        We use this information to confirm and prepare your order, arrange local pickup, and contact
        you about it. We do not sell your information.
      </p>
      <p>To ask about or delete your data, contact us using the details on the Contact page.</p>
    </InfoPage>
  );
}
