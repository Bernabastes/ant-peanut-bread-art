import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PeanutRain } from "./PeanutRain";

function mockMediaQuery(matches: boolean) {
  return {
    matches,
    media: "",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => true),
  } satisfies MediaQueryList;
}

describe("PeanutRain", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("generates bounded decorative peanuts and stops for reduced motion", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (query: string) => mockMediaQuery(query.includes("max-width")));
    const first = render(<PeanutRain />);

    act(() => {
      vi.advanceTimersByTime(4_000);
    });

    const rain = first.container.querySelector(".peanut-rain");
    expect(rain).toHaveAttribute("aria-hidden", "true");
    expect(rain).toHaveStyle({ pointerEvents: "none" });
    expect(screen.getAllByText("🥜").length).toBeGreaterThan(0);
    expect(screen.getAllByText("🥜").length).toBeLessThanOrEqual(7);

    vi.stubGlobal("matchMedia", (query: string) =>
      mockMediaQuery(query.includes("prefers-reduced-motion")),
    );
    first.unmount();
    const reducedMotion = render(<PeanutRain />);
    expect(reducedMotion.container.querySelector(".peanut-rain")).toBeNull();
  });
});
