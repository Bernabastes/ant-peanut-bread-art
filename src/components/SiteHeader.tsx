import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/our-story", label: "Our Story" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ announcement }: { announcement: string }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const prev = useRef(count);
  const navigate = useNavigate();

  useEffect(() => {
    if (count > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 450);
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count]);
  useEffect(() => {
    prev.current = count;
  });

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-chocolate px-4 py-2 text-center text-xs tracking-wide text-cream">{announcement}</div>
      <div className="border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm font-medium text-chocolate/75 transition-colors hover:text-chocolate"
                activeProps={{ className: "text-chocolate" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Search products" onClick={() => navigate({ to: "/shop", search: { q: "" } })}>
              <Search />
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart" aria-label={`Cart, ${count} items`} className="relative">
                <ShoppingBag />
                {count > 0 && (
                  <span
                    className={`absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-honey px-1 text-[10px] font-bold text-honey-foreground ${bump ? "animate-bump" : ""}`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="honey" className="ml-2 hidden sm:inline-flex" asChild>
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open && (
          <nav className="border-t bg-background px-4 py-4 md:hidden" aria-label="Mobile">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-display text-lg text-chocolate hover:bg-muted">
                {n.label}
              </Link>
            ))}
            <Link to="/order-status" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted">
              Check order status
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
