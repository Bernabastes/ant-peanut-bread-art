import { useEffect, useState } from "react";

/**
 * Illustrated hero: peanut butter lands on toast and a knife eases across the crumb.
 * If /videos/peanut-butter-hero.mp4 is present it plays instead. Nothing here is filmed footage.
 */
const crumb =
  "M168 250 C168 168 214 132 268 148 C304 112 392 112 428 148 C482 132 528 168 528 250 L516 548 Q516 582 482 582 L214 582 Q180 582 180 548 Z";

export function HeroAnimation() {
  return (
    <svg
      viewBox="0 0 640 700"
      className="pb-scene h-full w-full"
      role="img"
      aria-label="Peanut butter poured onto toast and spread with a knife"
    >
      <defs>
        <linearGradient id="pbG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8B85A" />
          <stop offset="1" stopColor="#C9842A" />
        </linearGradient>
        <radialGradient id="crumbG" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#F8E7C8" />
          <stop offset="1" stopColor="#E7C99A" />
        </radialGradient>
        <linearGradient id="woodG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C4925C" />
          <stop offset="1" stopColor="#8A5A32" />
        </linearGradient>
        <clipPath id="crumbClip">
          <path d={crumb} />
        </clipPath>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#352116" floodOpacity="0.22" />
        </filter>
      </defs>

      <ellipse cx="350" cy="640" rx="230" ry="28" fill="#352116" opacity="0.1" />

      <g className="pb-float" fill="#E8B85A" stroke="#8A5A32" strokeWidth="3">
        <path d="M78 150 c-16 -20 6 -44 26 -30 c12 -16 40 -6 32 16 c-2 12 -12 16 -20 16 c-6 12 -30 14 -38 -2z" />
      </g>
      <g className="pb-float-2" fill="#E8B85A" stroke="#8A5A32" strokeWidth="3">
        <path d="M560 430 c-16 -20 6 -44 26 -30 c12 -16 40 -6 32 16 c-2 12 -12 16 -20 16 c-6 12 -30 14 -38 -2z" />
      </g>

      <g transform="rotate(-8 360 400)" filter="url(#soft)">
        <path
          d="M140 246 C140 150 196 104 262 124 C304 78 412 78 454 124 C520 104 576 150 576 246 L562 560 Q562 604 518 604 L188 604 Q144 604 154 560 Z"
          fill="#8A5A32"
        />
        <path d={crumb} fill="url(#crumbG)" />
        <g fill="#8A5A32" opacity="0.16">
          <circle cx="230" cy="230" r="5" />
          <circle cx="470" cy="220" r="4" />
          <circle cx="260" cy="430" r="6" />
          <circle cx="450" cy="480" r="4" />
          <circle cx="200" cy="340" r="3" />
          <circle cx="500" cy="360" r="5" />
          <circle cx="340" cy="200" r="3" />
          <circle cx="380" cy="430" r="4" />
        </g>
        <g clipPath="url(#crumbClip)">
          <g className="pb-spread">
            <path
              d="M190 250 C250 220 330 250 380 230 C440 210 500 240 530 250 L520 520 C460 545 380 520 320 540 C250 555 200 520 190 500 Z"
              fill="url(#pbG)"
              opacity="0.95"
            />
          </g>
        </g>
        <g className="pb-blob">
          <ellipse cx="360" cy="390" rx="78" ry="46" fill="url(#pbG)" />
          <path
            d="M320 372 C345 352 390 354 418 370"
            stroke="#FFF8EC"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>
        <g className="pb-knife">
          <g transform="translate(150 248) rotate(-8)">
            <rect x="150" y="10" width="250" height="22" rx="11" fill="url(#woodG)" />
            <rect
              x="0"
              y="0"
              width="175"
              height="42"
              rx="10"
              fill="#F3E6CF"
              stroke="#E9D2AD"
              strokeWidth="3"
            />
            <rect x="14" y="14" width="145" height="12" rx="6" fill="url(#pbG)" />
          </g>
        </g>
      </g>

      <path
        className="pb-stream"
        d="M300 40 C298 90 270 130 292 190 C306 230 286 270 300 330"
        stroke="url(#pbG)"
        strokeWidth="26"
        strokeLinecap="round"
        fill="none"
      />
      <g className="pb-spoon">
        <path d="M318 70 L560 8" stroke="url(#woodG)" strokeWidth="16" strokeLinecap="round" />
        <ellipse
          cx="304"
          cy="74"
          rx="48"
          ry="26"
          transform="rotate(-16 304 74)"
          fill="url(#woodG)"
        />
        <ellipse cx="304" cy="70" rx="36" ry="16" transform="rotate(-16 304 70)" fill="url(#pbG)" />
      </g>
    </svg>
  );
}

export function HeroVisual() {
  const [showVideo, setShowVideo] = useState(false);
  const [reduce, setReduce] = useState(false);
  const videoUrl = import.meta.env["VITE_HERO_VIDEO_URL"];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative h-full w-full">
      <HeroAnimation />
      {!reduce && videoUrl && (
        <video
          className={`absolute inset-0 h-full w-full rounded-[2rem] object-cover ${showVideo ? "opacity-100" : "pointer-events-none opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/jar-creamy.svg"
          onCanPlay={() => setShowVideo(true)}
          onError={() => setShowVideo(false)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
