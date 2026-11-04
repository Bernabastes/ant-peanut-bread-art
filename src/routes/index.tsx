import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, HandHeart, Package, ShoppingBasket, Wheat } from "lucide-react";
import { HeroVisual } from "@/components/HeroAnimation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { resolveProductImage } from "@/lib/images";
import { catalogQuery, settingsQuery, useCatalog, useSettings } from "@/lib/queries";
import storyImg from "@/assets/story.svg";
import textureImg from "@/assets/texture.svg";
import type { RouterContext } from "@/lib/router-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ant Peanut — Goodness You Can Taste" },
      {
        name: "description",
        content:
          "Rich, creamy artisan peanut butter in jars. Order online and pay in person on delivery or pickup.",
      },
      { property: "og:title", content: "Ant Peanut — Goodness You Can Taste" },
      {
        property: "og:description",
        content: "Rich, creamy artisan peanut butter. Order online, pay in person.",
      },
    ],
  }),
  loader: ({ context }: { context: RouterContext }) =>
    Promise.all([
      context.queryClient.ensureQueryData(catalogQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]),
  component: Home,
});

const highlights = [
  { icon: HandHeart, title: "Made with Care", text: "A little care in every jar." },
  {
    icon: Wheat,
    title: "Rich Peanut Flavor",
    text: "A pantry favorite for toast, snacks, and more.",
  },
  { icon: Package, title: "Carefully Packed", text: "Sealed in jars, ready to enjoy." },
  { icon: ShoppingBasket, title: "Easy Local Ordering", text: "Order online, pay in person." },
];

function Home() {
  const { products } = useCatalog();
  const settings = useSettings();
  const featured = products.filter((p) => p.is_featured);
  const list = featured.length ? featured : products;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid min-h-[calc(100svh-6.5rem)] max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-8">
          <div className="reveal max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-chocolate/80">
              Artisan peanut butter
            </p>
            <h1 className="text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              Goodness <em className="font-medium italic">You</em>
              <br />
              Can Taste.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Rich, creamy peanut butter made with care, packed with goodness, and ready to make
              every bite special.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="honey" size="xl" asChild>
                <Link to="/shop">Shop Our Peanut Butter</Link>
              </Button>
              <Button variant="soft" size="xl" asChild>
                <Link to="/our-story">Our Story</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[640px]">
            <HeroVisual />
          </div>
        </div>
        <a
          href="#highlights"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-muted-foreground md:flex"
          aria-label="Scroll down"
        >
          Scroll <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
      </section>

      {/* HIGHLIGHTS */}
      <section id="highlights" className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:px-8">
          {highlights.map((h) => (
            <div key={h.title} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-primary">
                <h.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-base font-semibold">{h.title}</div>
                <div className="text-sm text-muted-foreground">{h.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold md:text-5xl">Your New Pantry Favorite.</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Meet the peanut butter that makes simple moments taste better.
            </p>
          </div>
          <Button variant="soft" asChild>
            <Link to="/shop">View all</Link>
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} currency={settings.currency} />
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
        <img
          src={storyImg}
          alt="Peanut butter being spread on toast"
          loading="lazy"
          width={1200}
          height={1408}
          className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift"
        />
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">Our story</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Simple Ingredients. Unforgettable Flavor.
          </h2>
          <p className="mt-6 whitespace-pre-line text-lg text-muted-foreground">{settings.story}</p>
          <Button variant="brand" size="xl" className="mt-8" asChild>
            <Link to="/our-story">Discover Our Story</Link>
          </Button>
        </div>
      </section>

      {/* TEXTURE */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem]">
          <img
            src={textureImg}
            alt="A swirl of creamy peanut butter on a wooden spoon"
            loading="lazy"
            width={1200}
            height={912}
            className="h-[420px] w-full object-cover md:h-[520px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-chocolate/80 via-chocolate/30 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-8 md:p-14">
            <h2 className="text-4xl font-bold text-cream md:text-5xl">
              Made for the Moments You Love.
            </h2>
            <p className="mt-4 text-cream/85">
              On warm toast in the morning, swirled into oats, or straight from the spoon.
            </p>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="bg-secondary/60 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-center text-4xl font-bold md:text-5xl">How to Order</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["Choose Your Favorite", "Explore the available peanut butter jars and sizes."],
              [
                "Place Your Order",
                "Add products to your cart and enter your contact and delivery details.",
              ],
              ["Pay in Person", "Pay when your order is delivered or when you collect it."],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-3xl bg-card p-8 shadow-soft">
                <span className="font-display text-6xl font-bold text-honey">0{i + 1}</span>
                <h3 className="mt-4 text-2xl font-semibold">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS placeholder */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="text-4xl font-bold">What Our Customers Say</h2>
        <div className="mt-8 rounded-3xl border-2 border-dashed p-10 text-muted-foreground">
          Customer reviews will appear here once they've been collected. We only share real
          feedback.
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-chocolate p-10 md:grid-cols-[1.2fr_1fr] md:p-16">
          <div>
            <h2 className="text-4xl font-bold text-cream md:text-6xl">
              Spread a Little Happiness.
            </h2>
            <p className="mt-4 text-lg text-cream/75">
              Your next favorite jar is just a few clicks away.
            </p>
            <Button variant="honey" size="xl" className="mt-8" asChild>
              <Link to="/shop">Shop Now</Link>
            </Button>
          </div>
          <img
            src={resolveProductImage("/images/jar-creamy.jpg")}
            alt="Illustrated placeholder of an Ant Peanut creamy jar. Replace with a photo of the real jar."
            loading="lazy"
            width={800}
            height={800}
            className="mx-auto w-64 rounded-3xl md:w-80"
          />
        </div>
      </section>
    </>
  );
}
