import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import SubpageNav from "./SubpageNav.jsx";
import { LanguageProvider } from "../context/LanguageContext.jsx";

describe("SubpageNav Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderSubpageNav = () => {
    return render(
      <MemoryRouter>
        <LanguageProvider>
          <SubpageNav />
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  it("renders back link with Indonesian default text 'Kembali ke Pulau' and href '/'", () => {
    renderSubpageNav();

    const backLink = screen.getByRole("link", {
      name: /kembali ke pulau/i,
    });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
    expect(backLink).toHaveTextContent("←");
    expect(backLink).toHaveTextContent("Kembali ke Pulau");
    expect(backLink.textContent).toContain("←");
    expect(backLink.textContent.replace(/\s+/g, "")).toBe("←KembalikePulau");
  });

  it("renders language switch toggle and audio controller in floating capsule", () => {
    renderSubpageNav();

    const langBtn = screen.getByTitle(/switch language/i);
    expect(langBtn).toBeInTheDocument();
    expect(langBtn).toHaveTextContent("EN");

    const audioBtn = screen.getByRole("button", {
      name: /enable terminal audio|mute terminal audio/i,
    });
    expect(audioBtn).toBeInTheDocument();
  });

  it("toggles language between ID and EN and updates back link text", () => {
    renderSubpageNav();

    const langBtn = screen.getByTitle(/switch language/i);
    expect(screen.getByText("Kembali ke Pulau")).toBeInTheDocument();

    fireEvent.click(langBtn);

    expect(langBtn).toHaveTextContent("ID");
    expect(screen.getByText("Back to Island")).toBeInTheDocument();
  });

  it("triggers onBack callback when provided and user clicks back to island", () => {
    const handleBack = vi.fn();
    render(
      <MemoryRouter>
        <LanguageProvider>
          <SubpageNav onBack={handleBack} />
        </LanguageProvider>
      </MemoryRouter>
    );

    const backLink = screen.getByRole("link", {
      name: /kembali ke pulau/i,
    });
    expect(backLink).toBeInTheDocument();

    fireEvent.click(backLink);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});
