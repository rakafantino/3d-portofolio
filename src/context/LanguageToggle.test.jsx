import { render, screen, fireEvent } from "@testing-library/react";
import LanguageToggle from "./LanguageToggle.jsx";
import { LanguageProvider } from "./LanguageContext.jsx";

describe("LanguageToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderToggle = (props = {}) => {
    return render(
      <LanguageProvider>
        <LanguageToggle {...props} />
      </LanguageProvider>
    );
  };

  it("renders with aria-label 'Switch language' and default language text", () => {
    renderToggle();
    const button = screen.getByRole("button", { name: /switch language/i });
    expect(button).toBeInTheDocument();
    expect(button.textContent.trim()).toBe("EN");
  });

  it("toggles language between ID and EN on click", () => {
    renderToggle();
    const button = screen.getByRole("button", { name: /switch language/i });

    expect(button.textContent.trim()).toBe("EN");

    fireEvent.click(button);
    expect(button.textContent.trim()).toBe("ID");

    fireEvent.click(button);
    expect(button.textContent.trim()).toBe("EN");
  });

  it("renders island variant styling by default or when variant='island'", () => {
    const { rerender } = renderToggle({ variant: "island" });
    let button = screen.getByRole("button", { name: /switch language/i });
    expect(button.className).toContain("text-cream/70");
    expect(button.className).toContain("hover:text-cream");

    rerender(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    );
    button = screen.getByRole("button", { name: /switch language/i });
    expect(button.className).toContain("text-cream/70");
    expect(button.className).toContain("hover:text-cream");
  });

  it("renders paper variant styling when variant='paper'", () => {
    renderToggle({ variant: "paper" });
    const button = screen.getByRole("button", { name: /switch language/i });
    expect(button.className).toContain("text-ink-soft");
    expect(button.className).toContain("hover:text-copper");
  });
});
