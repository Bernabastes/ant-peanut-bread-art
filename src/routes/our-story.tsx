import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Ant Peanut" },
      { name: "description", content: "The story behind Ant Peanut artisan peanut butter." },
      { property: "og:title", content: "Our Story — Ant Peanut" },
      { property: "og:description", content: "The story behind Ant Peanut artisan peanut butter." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Page,
});

function Page() {
  const s = useSettings();
  void s;
  return (
    <InfoPage title="Our Story"><img src="/images/jar-creamy.jpg" alt="Ant Peanut jar" width={1024} height={1024} className="mb-8 w-full rounded-3xl" /><p className="whitespace-pre-line text-lg">{s.story}</p></InfoPage>
  );
}
