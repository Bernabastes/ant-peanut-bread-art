import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="Ant Peanut home">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
        <circle cx="20" cy="20" r="19" fill="var(--chocolate)" />
        <path
          d="M14 12c-5 3-5 9-1 12-3 4 0 10 6 9 4 0 6-3 6-6 5-1 7-7 4-11-2-4-8-6-12-4-1 0-2 0-3 0z"
          fill="var(--honey)"
        />
        <path d="M17 16c2-1 5-1 7 1M15 25c2 1 5 1 7-1" stroke="var(--chocolate)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight text-chocolate">
        Ant <span className="italic text-primary">Peanut</span>
      </span>
    </Link>
  );
}
