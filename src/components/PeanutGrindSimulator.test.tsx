import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PeanutGrindSimulator } from "./PeanutGrindSimulator";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));

function mockMediaQuery(matches: boolean): MediaQueryList {
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

describe("PeanutGrindSimulator", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("fills the jar while grinding and offers a link to the shop", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => mockMediaQuery(false));
    render(<PeanutGrindSimulator />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "Hold to Grind!" }));
    act(() => {
      vi.advanceTimersByTime(4_000);
    });

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByRole("status")).toHaveTextContent("Freshly ground! Ready to order yours?");
    expect(screen.getByRole("link", { name: "Shop Peanut Butter" })).toHaveAttribute(
      "href",
      "/shop",
    );
  }, 30_000);

  it("finishes immediately without animation when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", () => mockMediaQuery(true));
    render(<PeanutGrindSimulator />);

    fireEvent.pointerDown(screen.getByRole("button", { name: "Hold to Grind!" }));

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByRole("status")).toHaveTextContent("Freshly ground! Ready to order yours?");
    expect(document.querySelector(".peanut-simulator__confetti")).toBeNull();
  }, 30_000);
});
