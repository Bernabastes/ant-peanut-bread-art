import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const GRIND_INTERVAL_MS = 50;
const PROGRESS_PER_TICK = 1.5;

export function PeanutGrindSimulator() {
  const [progress, setProgress] = useState(0);
  const [grinding, setGrinding] = useState(false);
  const [complete, setComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => {
      preference.removeEventListener("change", updatePreference);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function stopGrinding() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setGrinding(false);
  }

  function finishGrinding() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    progressRef.current = 100;
    setProgress(100);
    setGrinding(false);
    setComplete(true);
  }

  function startGrinding() {
    if (complete || timer.current) return;
    if (reducedMotion) {
      finishGrinding();
      return;
    }

    setGrinding(true);
    timer.current = setInterval(() => {
      const next = Math.min(100, progressRef.current + PROGRESS_PER_TICK);
      progressRef.current = next;
      setProgress(next);
      if (next === 100) finishGrinding();
    }, GRIND_INTERVAL_MS);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      startGrinding();
    }
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " " || event.key === "Enter") stopGrinding();
  }

  const fillHeight = (progress / 100) * 112;
  const particles = Array.from({ length: 10 }, (_, index) => index);

  return (
    <section
      aria-labelledby="grind-simulator-title"
      className="peanut-simulator mt-16 overflow-hidden rounded-[2rem] border border-beige/80 bg-gradient-to-br from-card via-cream to-accent/70 p-5 shadow-soft sm:p-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crust">
          From peanut to jar
        </p>
        <h2 id="grind-simulator-title" className="mt-2 text-3xl font-bold sm:text-4xl">
          Peanut Grind Simulator
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Hold the button and watch fresh peanuts become creamy Ant Peanut butter.
        </p>
      </div>

      <div
        className={`peanut-simulator__stage relative mx-auto mt-8 max-w-4xl rounded-3xl bg-cream/75 px-2 py-5 sm:px-8 sm:py-8 ${grinding ? "is-grinding" : ""} ${complete ? "is-complete" : ""}`}
      >
        <svg
          viewBox="0 0 800 300"
          role="img"
          aria-label="A bowl of peanuts, a peanut grinder, and an Ant Peanut jar"
          className="relative z-10 mx-auto h-auto w-full"
        >
          <defs>
            <clipPath id="simulator-jar-clip">
              <path d="M624 119h90v118a10 10 0 0 1-10 10h-70a10 10 0 0 1-10-10z" />
            </clipPath>
            <linearGradient id="simulator-butter" x1="0" x2="0.9" y1="0" y2="1">
              <stop offset="0" stopColor="#d99a36" />
              <stop offset="1" stopColor="#8b4e23" />
            </linearGradient>
            <linearGradient id="simulator-machine" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f5e6ca" />
              <stop offset="1" stopColor="#dfc7a2" />
            </linearGradient>
          </defs>

          <ellipse cx="145" cy="252" rx="102" ry="15" fill="#6b3f24" opacity=".1" />
          <path d="M47 186h196l-18 51a24 24 0 0 1-23 16H88a24 24 0 0 1-23-16z" fill="#b87936" />
          <path d="M58 187h174l-15 43a17 17 0 0 1-16 12H89a17 17 0 0 1-16-12z" fill="#e9d2ad" />
          <ellipse cx="145" cy="187" rx="87" ry="17" fill="#6b3f24" />
          <ellipse cx="145" cy="183" rx="79" ry="13" fill="#c8873d" />
          {[
            [91, 183],
            [115, 178],
            [139, 184],
            [163, 177],
            [188, 184],
            [211, 179],
          ].map(([x, y], index) => (
            <g key={index} transform={`translate(${x} ${y}) rotate(${index % 2 ? 35 : -25})`}>
              <ellipse rx="12" ry="7" fill="#8f552b" />
              <path d="M-7 0q7-7 14 0q-7 7-14 0" fill="#c9955d" opacity=".8" />
            </g>
          ))}
          <text x="145" y="278" textAnchor="middle" fill="#6b3f24" fontSize="13" fontWeight="600">
            Raw peanuts
          </text>

          <ellipse cx="432" cy="255" rx="94" ry="13" fill="#6b3f24" opacity=".1" />
          <g className="peanut-simulator__machine">
            <path d="M378 102h108l-14 48h-80z" fill="#8b4e23" />
            <path d="M387 105h90l-10 36h-70z" fill="#c8873d" />
            <rect
              x="365"
              y="145"
              width="136"
              height="101"
              rx="16"
              fill="url(#simulator-machine)"
              stroke="#8b6744"
              strokeWidth="4"
            />
            <rect
              x="385"
              y="162"
              width="96"
              height="59"
              rx="10"
              fill="#fdf7ec"
              stroke="#cfb48d"
              strokeWidth="3"
            />
            <circle cx="433" cy="190" r="17" fill="#6b3f24" />
            <path d="M424 190h18m-9-9v18" stroke="#f5e6ca" strokeWidth="3" strokeLinecap="round" />
            <circle cx="477" cy="232" r="5" fill="#697a52" />
            <rect x="408" y="243" width="50" height="8" rx="4" fill="#8b4e23" />
          </g>
          <text x="433" y="278" textAnchor="middle" fill="#6b3f24" fontSize="13" fontWeight="600">
            The grinder
          </text>

          <path
            className="peanut-simulator__butter-stream"
            d="M500 207C547 207 550 171 620 171"
            fill="none"
            stroke="url(#simulator-butter)"
            strokeWidth="11"
            strokeLinecap="round"
          />

          <ellipse cx="669" cy="255" rx="60" ry="12" fill="#6b3f24" opacity=".1" />
          <path d="M638 91h62v18h-62z" fill="#8b4e23" />
          <path d="M642 96h54v10h-54z" fill="#d99a36" />
          <path d="M633 109h82v12h-82z" fill="#c8a47a" />
          <path
            d="M624 119h90v118a10 10 0 0 1-10 10h-70a10 10 0 0 1-10-10z"
            fill="#fffdf8"
            fillOpacity=".85"
            stroke="#8b6744"
            strokeWidth="4"
          />
          <rect
            className="peanut-simulator__jar-fill"
            x="624"
            y={237 - fillHeight}
            width="90"
            height={fillHeight}
            fill="url(#simulator-butter)"
            clipPath="url(#simulator-jar-clip)"
          />
          <path d="M632 174h74v37h-74z" fill="#fff8ec" opacity=".92" />
          <text
            x="669"
            y="190"
            textAnchor="middle"
            fill="#6b3f24"
            fontSize="11"
            fontFamily="Georgia,serif"
            fontWeight="700"
          >
            ANT
          </text>
          <text
            x="669"
            y="203"
            textAnchor="middle"
            fill="#8b4e23"
            fontSize="9"
            fontFamily="Georgia,serif"
          >
            PEANUT
          </text>
          <text x="669" y="278" textAnchor="middle" fill="#6b3f24" fontSize="13" fontWeight="600">
            Your jar
          </text>
        </svg>

        <div className="peanut-simulator__travelers" aria-hidden="true">
          {particles.slice(0, 6).map((particle) => (
            <span key={particle} style={{ "--particle-index": particle } as React.CSSProperties}>
              🥜
            </span>
          ))}
        </div>

        <div
          className="mt-5 flex items-center justify-center gap-3"
          aria-label={`Jar filling: ${Math.round(progress)} percent`}
        >
          <div
            className="h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-beige"
            role="progressbar"
            aria-label="Jar fill level"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-honey to-crust transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-10 text-right text-xs font-semibold tabular-nums text-chocolate">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        {!complete ? (
          <Button
            type="button"
            variant="honey"
            size="xl"
            className="min-w-52 select-none shadow-soft"
            onPointerDown={(event) => {
              if (event.currentTarget.setPointerCapture) {
                event.currentTarget.setPointerCapture(event.pointerId);
              }
              startGrinding();
            }}
            onPointerUp={stopGrinding}
            onPointerCancel={stopGrinding}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onBlur={stopGrinding}
            onClick={(event) => {
              if (event.detail === 0 && !complete) finishGrinding();
            }}
          >
            {grinding
              ? "Grinding… keep holding!"
              : progress > 0
                ? "Keep Grinding!"
                : "Hold to Grind!"}
          </Button>
        ) : (
          <div className="text-center" role="status" aria-live="polite">
            {!reducedMotion && (
              <div className="peanut-simulator__confetti mb-2" aria-hidden="true">
                {particles.map((particle) => (
                  <span
                    key={particle}
                    style={{ "--particle-index": particle } as React.CSSProperties}
                  >
                    🥜
                  </span>
                ))}
              </div>
            )}
            <p className="font-display text-xl font-semibold text-chocolate">
              Freshly ground! Ready to order yours?
            </p>
            <Button variant="brand" className="mt-3" asChild>
              <Link to="/shop">Shop Peanut Butter</Link>
            </Button>
          </div>
        )}
        {!complete && (
          <p className="text-xs text-muted-foreground">Keep holding to fill your jar.</p>
        )}
      </div>
    </section>
  );
}
