import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Ant Peanut" },
      { name: "description", content: "The story behind Ant Peanut artisan peanut butter." },
      { property: "og:title", content: "Our Story — Ant Peanut" },
      { property: "og:description", content: "The story behind Ant Peanut artisan peanut butter." },
    ],
  }),
  loader: ({ context }: { context: RouterContext }) =>
    context.queryClient.ensureQueryData(settingsQuery),
  component: Page,
});

function Page() {
  const s = useSettings();
  const defaultStory = `We make our peanut butter at home, using our machine to turn peanuts into a smooth, creamy spread. We keep the recipe simple and pure.

1. Start with peanuts. Peanuts are the only ingredient in our peanut butter.
2. Add them to the machine. We put the peanuts into our grinding machine.
3. Grind until creamy. The machine grinds the peanuts into the smooth, creamy texture we love.
4. Keep it pure. We do not add sugar, water, or anything else—just peanuts.
5. Pack into jars. We put the creamy peanut butter into jars, ready for you to enjoy.`;
  const story =
    s.story &&
    !s.story.toLowerCase().includes("our story is coming soon") &&
    !s.story.startsWith("We make our peanut butter at home, using our machine to grind")
      ? s.story
      : defaultStory;
  const lines = story
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const intro = lines.find((line) => !/^\d+\.\s/.test(line));
  const steps = lines.filter((line) => /^\d+\.\s/.test(line));
  return (
    <InfoPage title="Our Story">
      <img
        src="/images/peanut.jpg"
        alt="Illustrated placeholder of an Ant Peanut jar"
        width={800}
        height={800}
        className="mb-8 w-full rounded-3xl"
      />
      {intro && <p className="text-lg">{intro}</p>}
      {steps.length > 0 ? (
        <ol className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-4 rounded-2xl bg-card p-5 text-base shadow-soft">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent font-semibold text-chocolate">
                {index + 1}
              </span>
              <span>{step.replace(/^\d+\.\s*/, "")}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="whitespace-pre-line text-lg">{story}</p>
      )}
    </InfoPage>
  );
}
