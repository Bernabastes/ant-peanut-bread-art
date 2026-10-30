import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import type { Settings } from "@/lib/queries";

export function SiteFooter({ settings }: { settings: Settings }) {
  const col = "space-y-2 text-sm text-cream/75";
  const a = "hover:text-cream transition-colors";
  return (
    <footer className="mt-24 bg-chocolate text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-cream px-3 py-1.5"><Logo /></div>
          <p className="max-w-xs text-sm text-cream/70">Rich, creamy peanut butter made with care and packed in jars, ready for your table.</p>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg">Shop</h3>
          <ul className={col}>
            <li><Link to="/shop" className={a}>All peanut butter</Link></li>
            <li><Link to="/cart" className={a}>Your cart</Link></li>
            <li><Link to="/order-status" className={a}>Order status</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg">Information</h3>
          <ul className={col}>
            <li><Link to="/our-story" className={a}>Our Story</Link></li>
            <li><Link to="/faq" className={a}>FAQ</Link></li>
            <li><Link to="/delivery-policy" className={a}>Delivery & collection</Link></li>
            <li><Link to="/privacy" className={a}>Privacy Policy</Link></li>
            <li><Link to="/terms" className={a}>Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg">Contact</h3>
          <ul className={col}>
            {settings.phone ? <li>{settings.phone}</li> : null}
            {settings.email ? <li>{settings.email}</li> : null}
            {settings.address ? <li>{settings.address}</li> : null}
            {!settings.phone && !settings.email && <li className="italic">Contact details coming soon.</li>}
            <li><Link to="/contact" className={a}>Contact page →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-4 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {settings.business_name}. All rights reserved.
      </div>
    </footer>
  );
}
