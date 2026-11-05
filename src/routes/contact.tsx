import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { useState } from "react";
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
  const [pickupCardOpen, setPickupCardOpen] = useState(false);
  return (
    <InfoPage title="Contact Us">
      <p className="text-muted-foreground">We would love to hear from you.</p>

      <section
        aria-labelledby="pickup-location-title"
        className="mt-8 overflow-hidden rounded-3xl border border-crust/30 bg-card shadow-soft"
      >
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-crust">
              Ant Peanut · Jemo
            </p>
            <h2 id="pickup-location-title" className="mt-1 text-2xl font-bold text-chocolate">
              Pickup Location
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-crust" />
              {address}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <a
              className="inline-flex items-center gap-2 font-semibold text-chocolate underline-offset-4 hover:underline"
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-crust" />
              {phone}
            </a>
            {s.email && (
              <a className="underline underline-offset-4" href={`mailto:${s.email}`}>
                {s.email}
              </a>
            )}
            <a
              className="font-semibold text-crust underline underline-offset-4"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <div className="pickup-map relative isolate h-[21rem] overflow-hidden border-t border-crust/20 bg-beige sm:h-[26rem]">
          <iframe
            title="Map showing Jemo, Addis Ababa"
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
          <svg
            className="pickup-map__trail absolute inset-0 h-full w-full"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="pickup-map__trail-line"
              d="M95 440 C 180 360, 185 300, 310 325 S 455 290, 565 245 S 635 225, 680 230"
            />
            <text className="pickup-map__ant" aria-hidden="true">
              🐜
              <animateMotion
                dur="8s"
                repeatCount="indefinite"
                path="M95 440 C 180 360, 185 300, 310 325 S 455 290, 565 245 S 635 225, 680 230"
              />
            </text>
            <text className="pickup-map__ant pickup-map__ant--second" aria-hidden="true">
              🐜
              <animateMotion
                dur="8s"
                begin="-4s"
                repeatCount="indefinite"
                path="M95 440 C 180 360, 185 300, 310 325 S 455 290, 565 245 S 635 225, 680 230"
              />
            </text>
          </svg>

          <div
            className="pickup-map__marker absolute z-10"
            style={{ left: "68%", top: "46%" }}
            onMouseEnter={() => setPickupCardOpen(true)}
            onMouseLeave={() => setPickupCardOpen(false)}
            onFocus={() => setPickupCardOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPickupCardOpen(false);
            }}
          >
            <button
              type="button"
              className="grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-cream bg-chocolate text-cream shadow-lift transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey/70"
              aria-label="Pickup location in Jemo. Show pickup details."
              aria-expanded={pickupCardOpen}
              aria-controls="pickup-location-card"
              onClick={() => setPickupCardOpen(true)}
            >
              <MapPin aria-hidden="true" className="h-6 w-6" />
            </button>
            <div
              id="pickup-location-card"
              role="status"
              className={`pickup-map__tooltip absolute left-1/2 top-0 w-64 -translate-x-1/2 -translate-y-[calc(100%+1rem)] rounded-2xl border border-crust/25 bg-cream p-4 text-sm text-chocolate shadow-lift transition duration-200 sm:w-72 ${pickupCardOpen ? "visible translate-y-[calc(-100%-1rem)] opacity-100" : "invisible translate-y-[calc(-100%-0.5rem)] opacity-0"}`}
            >
              <p className="font-semibold">Pick up your fresh jar here in Jemo! 🥜</p>
              <a
                className="mt-2 inline-block font-semibold underline underline-offset-4"
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              >
                Call Anteneh: +251 92 313 9185
              </a>
            </div>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}
