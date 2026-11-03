import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ant Peanut" },
      { name: "description", content: "Get in touch with Ant Peanut." },
      { property: "og:title", content: "Contact — Ant Peanut" },
      { property: "og:description", content: "Get in touch with Ant Peanut." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Page,
});

function Page() {
  const s = useSettings();
  void s;
  return (
    <InfoPage title="Contact Us"><p>We would love to hear from you.</p>{s.phone && <p><b className="text-chocolate">Phone:</b> {s.phone}</p>}{s.email && <p><b className="text-chocolate">Email:</b> {s.email}</p>}{s.address && <p><b className="text-chocolate">Address:</b> {s.address}</p>}{!s.phone && !s.email && <p className="italic">Contact details will be added by the owner soon.</p>}</InfoPage>
  );
}
