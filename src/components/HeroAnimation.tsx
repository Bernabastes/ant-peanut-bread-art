/**
 * Code-drawn hero animation: a spoon pours a ribbon of peanut butter onto a
 * slice of toast, then a knife spreads it across the bread. Loops every 8s.
 * Pure SVG + CSS (see .pb-* in styles.css) — no video file needed.
 */
export function HeroAnimation() {
  const crumb =
    "M145 255 C145 190 185 158 235 166 C265 140 335 140 365 166 C415 158 455 190 455 255 L447 492 Q447 502 437 502 L163 502 Q153 502 153 492 Z";
  return (
    <svg
      viewBox="0 0 600 600"
      className="pb-scene h-full w-full"
      role="img"
      aria-label="Peanut butter being poured onto a slice of toast and spread smoothly"
    >
      <defs>
        <linearGradient id="pbG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--pb-light)" />
          <stop offset="1" stopColor="var(--pb)" />
        </linearGradient>
        <radialGradient id="crumbG" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="var(--crumb)" />
          <stop offset="1" stopColor="color-mix(in oklab, var(--crumb) 75%, var(--crust))" />
        </radialGradient>
        <linearGradient id="woodG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="color-mix(in oklab, var(--crust) 80%, var(--beige))" />
          <stop offset="1" stopColor="var(--crust)" />
        </linearGradient>
        <clipPath id="crumbClip">
          <path d={crumb} />
        </clipPath>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="var(--chocolate)" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* plate shadow */}
      <ellipse cx="300" cy="540" rx="210" ry="26" fill="var(--chocolate)" opacity="0.12" />

      {/* floating peanuts */}
      <g className="pb-float" fill="var(--pb-light)" stroke="var(--crust)" strokeWidth="2">
        <path d="M70 160 c-14 -18 6 -40 24 -28 c10 -14 36 -6 30 14 c-2 10 -10 14 -18 14 c-6 10 -28 12 -36 0z" />
      </g>
      <g className="pb-float-2" fill="var(--pb-light)" stroke="var(--crust)" strokeWidth="2">
        <path d="M510 360 c-14 -18 6 -40 24 -28 c10 -14 36 -6 30 14 c-2 10 -10 14 -18 14 c-6 10 -28 12 -36 0z" />
      </g>

      {/* toast */}
      <g transform="rotate(-5 300 340)" filter="url(#soft)">
        <path
          d="M120 250 C120 170 170 128 230 140 C262 108 338 108 370 140 C430 128 480 170 480 250 L470 500 Q470 524 446 524 L154 524 Q130 524 130 500 Z"
          fill="var(--crust)"
        />
        <path d={crumb} fill="url(#crumbG)" />
        {/* crumb pores */}
        <g fill="var(--crust)" opacity="0.18">
          <circle cx="210" cy="240" r="4" /><circle cx="390" cy="230" r="3" />
          <circle cx="250" cy="420" r="5" /><circle cx="360" cy="450" r="3" />
          <circle cx="190" cy="350" r="3" /><circle cx="410" cy="360" r="4" />
          <circle cx="300" cy="210" r="3" /><circle cx="320" cy="390" r="4" />
        </g>

        {/* spread layer revealed left→right */}
        <g clipPath="url(#crumbClip)">
          <g className="pb-spread">
            <path
              d="M150 210 C200 190 260 205 300 192 C350 178 410 200 452 215 L452 470 C410 490 360 476 300 488 C240 500 190 480 150 492 Z"
              fill="url(#pbG)"
            />
            <path d="M175 260 C240 240 320 275 425 248" stroke="var(--pb)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M170 340 C250 320 330 362 430 330" stroke="var(--pb)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.55" />
            <path d="M175 420 C250 400 340 440 425 410" stroke="var(--pb)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.5" />
            <g className="pb-shine" stroke="var(--cream)" strokeLinecap="round" fill="none">
              <path d="M200 250 C230 240 260 245 285 238" strokeWidth="6" opacity="0.7" />
              <path d="M330 360 C355 352 380 354 400 348" strokeWidth="5" opacity="0.6" />
            </g>
          </g>
        </g>

        {/* dollop */}
        <g className="pb-blob">
          <path
            d="M235 330 C235 290 270 280 300 284 C335 280 368 295 365 330 C362 360 330 370 300 368 C265 370 235 360 235 330 Z"
            fill="url(#pbG)"
          />
          <path d="M262 312 C278 300 300 300 318 306" stroke="var(--cream)" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
        </g>
      </g>

      {/* ribbon pouring from spoon */}
      <path
        className="pb-stream"
        d="M318 92 C316 140 290 170 302 214 C310 246 296 276 300 318"
        stroke="url(#pbG)"
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
      />

      {/* spoon */}
      <g className="pb-spoon">
        <path d="M330 78 L540 10" stroke="url(#woodG)" strokeWidth="16" strokeLinecap="round" />
        <ellipse cx="318" cy="80" rx="44" ry="24" transform="rotate(-18 318 80)" fill="url(#woodG)" />
        <ellipse cx="318" cy="76" rx="34" ry="15" transform="rotate(-18 318 76)" fill="url(#pbG)" />
      </g>

      {/* butter knife */}
      <g className="pb-knife">
        <g transform="translate(150 230)">
          <rect x="0" y="0" width="120" height="26" rx="13" fill="var(--muted)" stroke="var(--border)" strokeWidth="2" />
          <path d="M8 6 L110 6 Q118 13 110 20 L8 20 Z" fill="url(#pbG)" opacity="0.85" />
          <rect x="118" y="5" width="120" height="16" rx="8" fill="url(#woodG)" />
        </g>
      </g>
    </svg>
  );
}
