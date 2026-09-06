import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ParchmentRibbon from "./ParchmentRibbon";

describe("ParchmentRibbon Component", () => {
  it("renders as a container div by default with children content", () => {
    render(
      <ParchmentRibbon className="custom-ribbon-class">
        <span>Cartographer Banner</span>
      </ParchmentRibbon>
    );

    const ribbonRoot = screen.getByTestId("parchment-ribbon");
    expect(ribbonRoot).toBeInTheDocument();
    expect(ribbonRoot.tagName.toLowerCase()).toBe("div");
    expect(ribbonRoot).toHaveClass("custom-ribbon-class");
    expect(screen.getByText("Cartographer Banner")).toBeInTheDocument();
  });

  it("renders split curled ribbon tails on both ends with SVG elements", () => {
    render(
      <ParchmentRibbon>
        <span>Imperial Decree</span>
      </ParchmentRibbon>
    );

    expect(screen.getByTestId("ribbon-tail-left")).toBeInTheDocument();
    expect(screen.getByTestId("ribbon-tail-right")).toBeInTheDocument();
  });

  it("renders as a React Router Link when 'to' prop is provided", () => {
    render(
      <MemoryRouter>
        <ParchmentRibbon to="/" ariaLabel="Return to Island">
          <span>← Kembali ke Pulau</span>
        </ParchmentRibbon>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /return to island/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
    expect(screen.getByText("← Kembali ke Pulau")).toBeInTheDocument();
  });

  it("renders as an accessible button with type='button' when onClick is passed without 'to'", () => {
    const handleClick = vi.fn();

    render(
      <ParchmentRibbon onClick={handleClick} ariaLabel="Mulai Tur Pemandu">
        <span>Mulai Tur</span>
      </ParchmentRibbon>
    );

    const button = screen.getByRole("button", { name: /mulai tur pemandu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("focus-visible:ring-2");
    expect(screen.getByTestId("ribbon-tail-left")).toBeInTheDocument();
    expect(screen.getByTestId("ribbon-tail-right")).toBeInTheDocument();
    expect(screen.getByText("Mulai Tur")).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    button.focus();
    expect(button).toHaveFocus();
    fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("preserves Link rendering when both 'to' and 'onClick' are provided", () => {
    const handleClick = vi.fn();

    render(
      <MemoryRouter>
        <ParchmentRibbon to="/projects" onClick={handleClick} ariaLabel="Lihat Proyek">
          <span>Ke Proyek</span>
        </ParchmentRibbon>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /lihat proyek/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/projects");

    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports variant='banner' and variant='pill' with responsive styling", () => {
    const { rerender } = render(
      <ParchmentRibbon variant="banner">
        <span>Curled Banner</span>
      </ParchmentRibbon>
    );

    expect(screen.getByTestId("parchment-ribbon")).toHaveAttribute("data-variant", "banner");

    rerender(
      <ParchmentRibbon variant="tab">
        <span>Folder Tab</span>
      </ParchmentRibbon>
    );

    expect(screen.getByTestId("parchment-ribbon")).toHaveAttribute("data-variant", "tab");
  });
});
