import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { settingsQuery, useSettings } from "@/lib/queries";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ant Peanut" },
      { name: "description", content: "Get in touch with Ant Peanut." },
      { property: "og:title", content: "Contact — Ant Peanut" },
      { property: "og:description", content: "Get in touch with Ant Peanut." },
    ],
  }),
  loader: ({ context }: { context: RouterContext }) =>
    context.queryClient.ensureQueryData(settingsQuery),
  component: Page,
});

function Page() {
  const s = useSettings();
  const phone = s.phone || "+251923139185";
  const address = s.address || "Jemo, Addis Ababa, Ethiopia";
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=Jemo%2C+Addis+Ababa%2C+Ethiopia";
  const embedUrl =
    "https://maps.google.com/maps?q=Jemo%2C%20Addis%20Ababa%2C%20Ethiopia&output=embed";
  return (
    <InfoPage title="Contact Us">
      <p>We would love to hear from you.</p>
      <p>
        <b className="text-chocolate">Call Anteneh:</b>{" "}
        <a className="underline underline-offset-4" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
          {phone}
        </a>
      </p>
      {s.email && (
        <p>
          <b className="text-chocolate">Email:</b> {s.email}
        </p>
      )}
      <p>
        <b className="text-chocolate">Location:</b> Around {address}{" "}
        <a className="underline underline-offset-4" href={mapUrl} target="_blank" rel="noreferrer">
          (Open map)
        </a>
      </p>
      <iframe
        title="Map showing Jemo, Addis Ababa"
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="mt-6 h-80 w-full rounded-2xl border-0"
      />
    </InfoPage>
  );
}
