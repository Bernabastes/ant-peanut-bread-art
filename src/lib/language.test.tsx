import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LanguageProvider, LanguageToggle, LocalizedContent } from "./language";

function LanguageExample() {
  return (
    <LanguageProvider>
      <LocalizedContent>
        <h1>The Shop</h1>
        <p>
          I found the peanut butter absolutely delicious. It has a wonderful taste, and to me it was
          just perfect—such a lovely peanut butter to enjoy.
        </p>
        <LanguageToggle />
      </LocalizedContent>
    </LanguageProvider>
  );
}

describe("language selection", () => {
  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "en";
  });

  it("translates the page and persists the selected language across mounts", async () => {
    const first = render(<LanguageExample />);
    fireEvent.click(screen.getByRole("button", { name: "አማርኛ" }));

    expect(await screen.findByRole("heading", { name: "ሱቁ" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "የኦቾሎኒ ቅቤው በጣም ጣፋጭ ነበር። ድንቅ ጣዕም አለው፣ ለእኔም ፍጹም ነበር፤ ለመደሰት የሚያስደስት የኦቾሎኒ ቅቤ ነው።",
      ),
    ).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.lang).toBe("am"));
    expect(window.localStorage.getItem("ant-peanut-language")).toBe("am");

    first.unmount();
    render(<LanguageExample />);

    expect(await screen.findByRole("heading", { name: "ሱቁ" })).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.lang).toBe("am"));
    expect(screen.getByRole("button", { name: "አማርኛ" })).toHaveAttribute("aria-pressed", "true");
  });
});
