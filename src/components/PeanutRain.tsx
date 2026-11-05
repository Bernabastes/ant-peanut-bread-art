import { useEffect, useRef, useState, type CSSProperties } from "react";

type Peanut = {
  id: number;
  left: number;
  size: number;
  duration: number;
  drift: number;
  rotation: number;
};

const DESKTOP_LIMIT = 18;
const MOBILE_LIMIT = 7;

export function PeanutRain() {
  const [peanuts, setPeanuts] = useState<Peanut[]>([]);
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      setMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };

    updatePreferences();
    mobileQuery.addEventListener("change", updatePreferences);
    motionQuery.addEventListener("change", updatePreferences);
    return () => {
      mobileQuery.removeEventListener("change", updatePreferences);
      motionQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPeanuts([]);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const limit = mobile ? MOBILE_LIMIT : DESKTOP_LIMIT;
    setPeanuts((current) => current.slice(0, limit));

    const schedule = () => {
      if (document.visibilityState === "visible") {
        timer = setTimeout(
          () => {
            setPeanuts((current) => {
              if (current.length >= limit) return current;
              const peanut: Peanut = {
                id: nextId.current++,
                left: Math.random() * 100,
                size: 16 + Math.random() * (mobile ? 9 : 15),
                duration: 7 + Math.random() * 7,
                drift: (Math.random() - 0.5) * (mobile ? 90 : 160),
                rotation: Math.random() * 90 - 45,
              };
              return [...current, peanut];
            });
            schedule();
          },
          (mobile ? 800 : 450) + Math.random() * 650,
        );
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (timer !== undefined) clearTimeout(timer);
      } else {
        schedule();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    schedule();
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [mobile, reducedMotion]);

  if (reducedMotion || peanuts.length === 0) return null;

  return (
    <div className="peanut-rain" aria-hidden="true" style={{ pointerEvents: "none" }}>
      {peanuts.map((peanut) => (
        <span
          key={peanut.id}
          className="peanut-rain__peanut"
          style={
            {
              left: `${peanut.left}%`,
              fontSize: `${peanut.size}px`,
              animationDuration: `${peanut.duration}s`,
              "--peanut-drift": `${peanut.drift}px`,
              "--peanut-rotation": `${peanut.rotation}deg`,
            } as CSSProperties & {
              "--peanut-drift": string;
              "--peanut-rotation": string;
            }
          }
          onAnimationEnd={() =>
            setPeanuts((current) => current.filter((item) => item.id !== peanut.id))
          }
        >
          🥜
        </span>
      ))}
    </div>
  );
}
