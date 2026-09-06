import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import WaxSealButton from "./WaxSealButton";

describe("WaxSealButton Component - Pure Circular Wax Seal Medallion", () => {
  it("renders ONLY a pure standalone irregular circular wax seal medallion with data-variant='seal' by default", () => {
    const handleClick = vi.fn();
    render(
      <WaxSealButton onClick={handleClick} ariaLabel="Buka Segel Pulau">
        <span>Buka Segel</span>
      </WaxSealButton>
    );

    const btn = screen.getByRole("button", { name: /buka segel pulau/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("data-variant", "seal");
    expect(btn).toHaveAttribute("type", "button");

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders wax-seal-svg, wax-melted-rim, and wax-embossed-insignia within the SVG", () => {
    render(
      <WaxSealButton ariaLabel="Seal Details">
        <span>Inspect Seal</span>
      </WaxSealButton>
    );

    const svg = screen.getByTestId("wax-seal-svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 100 100");
    expect(screen.getByTestId("wax-melted-rim")).toBeInTheDocument();
    expect(screen.getByTestId("wax-embossed-insignia")).toBeInTheDocument();
  });

  it("does NOT contain rectangular button box styles, parchment tab styles, or right arrows", () => {
    render(
      <WaxSealButton ariaLabel="Pure Seal">
        <span>Kirim Surat</span>
      </WaxSealButton>
    );

    const btn = screen.getByRole("button", { name: /pure seal/i });
    // Must NOT have rectangular box styles
    expect(btn.className).not.toContain("rounded-sm");
    expect(btn).not.toHaveStyle({ borderTop: "1.5px solid #FFF8ED" });
    // No legacy arrow icon
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });

  it("supports tactile press physics via active:scale-95", () => {
    render(
      <WaxSealButton ariaLabel="Tactile Seal">
        <span>Tekan Segel</span>
      </WaxSealButton>
    );

    const btn = screen.getByRole("button", { name: /tactile seal/i });
    expect(btn.className).toContain("active:scale-95");
  });

  it("renders as <button type='submit'> when type='submit' (Contact form contract)", () => {
    render(
      <WaxSealButton type="submit" ariaLabel="Kirim Pesan">
        <span>Kirim</span>
      </WaxSealButton>
    );

    const btn = screen.getByRole("button", { name: /kirim pesan/i });
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("renders as a React Router Link when 'to' prop is provided", () => {
    render(
      <MemoryRouter>
        <WaxSealButton to="/projects" ariaLabel="Explore Projects">
          <span>Proyek Unggulan</span>
        </WaxSealButton>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /explore projects/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).toHaveAttribute("data-variant", "seal");
    expect(screen.getByText("Proyek Unggulan")).toBeInTheDocument();
  });

  it("respects disabled state when disabled is true", () => {
    const handleClick = vi.fn();
    render(
      <WaxSealButton disabled onClick={handleClick} ariaLabel="Sealed Archive">
        <span>Terkunci</span>
      </WaxSealButton>
    );

    const btn = screen.getByRole("button", { name: /sealed archive/i });
    expect(btn).toBeDisabled();
    expect(btn.className).toContain("opacity-60");
    expect(btn.className).toContain("cursor-not-allowed");

    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders optional caption below the circular seal medallion", () => {
    render(
      <WaxSealButton ariaLabel="Unseal Map">
        <span>Buka Peta Navigasi</span>
      </WaxSealButton>
    );

    const caption = screen.getByText("Buka Peta Navigasi");
    expect(caption).toBeInTheDocument();
    // Medallion SVG and caption are rendered together
    expect(screen.getByTestId("wax-seal-svg")).toBeInTheDocument();
  });

  it("renders without caption when children is not provided", () => {
    render(<WaxSealButton ariaLabel="Standalone Seal" />);

    const btn = screen.getByRole("button", { name: /standalone seal/i });
    expect(btn).toBeInTheDocument();
    expect(screen.getByTestId("wax-seal-svg")).toBeInTheDocument();
  });

  it("applies correct size classes for sm (w-12 h-12), md (w-16 h-16), and lg (w-20 h-20)", () => {
    const { rerender } = render(<WaxSealButton size="sm" ariaLabel="Small Seal" />);
    const svgSm = screen.getByTestId("wax-seal-svg");
    expect(svgSm.getAttribute("class")).toContain("w-12");
    expect(svgSm.getAttribute("class")).toContain("h-12");

    rerender(<WaxSealButton size="md" ariaLabel="Medium Seal" />);
    const svgMd = screen.getByTestId("wax-seal-svg");
    expect(svgMd.getAttribute("class")).toContain("w-16");
    expect(svgMd.getAttribute("class")).toContain("h-16");

    rerender(<WaxSealButton size="lg" ariaLabel="Large Seal" />);
    const svgLg = screen.getByTestId("wax-seal-svg");
    expect(svgLg.getAttribute("class")).toContain("w-20");
    expect(svgLg.getAttribute("class")).toContain("h-20");
  });

  it("has accessible focus outline using wax-gold tokens", () => {
    render(
      <WaxSealButton ariaLabel="Focus Test">
        <span>Fokus</span>
      </WaxSealButton>
    );

    const btn = screen.getByRole("button", { name: /focus test/i });
    expect(btn.className).toContain("focus-visible:ring-[#C27D38]");
  });

  it("always enforces pure circular medallion even if legacy variant is passed", () => {
    render(
      <WaxSealButton variant="badge" ariaLabel="Legacy Badge Test">
        <span>Legacy Badge</span>
      </WaxSealButton>
    );

    const btn = screen.getByRole("button", { name: /legacy badge test/i });
    expect(btn).toHaveAttribute("data-variant", "seal");
    expect(btn.className).not.toContain("rounded-sm");
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });
});
