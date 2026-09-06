import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ParchmentScroll from "./ParchmentScroll";

describe("ParchmentScroll Component", () => {
  it("renders children content inside the parchment scroll wrapper", () => {
    render(
      <ParchmentScroll className="custom-scroll-class">
        <div data-testid="scroll-content">Scroll Narrative Content</div>
      </ParchmentScroll>
    );

    const scrollRoot = screen.getByTestId("parchment-scroll");
    expect(scrollRoot).toBeInTheDocument();
    expect(scrollRoot).toHaveClass("custom-scroll-class");
    expect(screen.getByTestId("scroll-content")).toHaveTextContent("Scroll Narrative Content");
  });

  it("renders medieval paper fiber filter, aged tea stains, deckled edges, and burnished edge overlays", () => {
    render(
      <ParchmentScroll>
        <div>Medieval Texture Verification</div>
      </ParchmentScroll>
    );

    expect(screen.getByTestId("paper-fiber-layer")).toBeInTheDocument();
    expect(screen.getByTestId("parchment-tea-stains")).toBeInTheDocument();
    expect(screen.getByTestId("deckled-edge-left")).toBeInTheDocument();
    expect(screen.getByTestId("deckled-edge-right")).toBeInTheDocument();
    expect(screen.getByTestId("burnished-edge-left")).toBeInTheDocument();
    expect(screen.getByTestId("burnished-edge-right")).toBeInTheDocument();
  });

  it("applies unroll animation classes for downward opening roll effect when isOpen is true", () => {
    const { container } = render(
      <ParchmentScroll isOpen={true}>
        <div>Unroll Animation Check</div>
      </ParchmentScroll>
    );

    const unrollContainer = container.querySelector(".animate-parchment-unroll");
    const topRoll = container.querySelector(".animate-parchment-top-roll");
    const content = container.querySelector(".animate-parchment-content");

    expect(unrollContainer).toBeInTheDocument();
    expect(topRoll).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it("applies roll-up animation classes when isOpen is false", () => {
    const { container } = render(
      <ParchmentScroll isOpen={false}>
        <div>Roll Up Animation Check</div>
      </ParchmentScroll>
    );

    const rollUpContainer = container.querySelector(".animate-parchment-rollup");
    const topRollRise = container.querySelector(".animate-parchment-top-roll-rise");
    const contentExit = container.querySelector(".animate-parchment-content-exit");

    expect(rollUpContainer).toBeInTheDocument();
    expect(topRollRise).toBeInTheDocument();
    expect(contentExit).toBeInTheDocument();
  });

  it("triggers onRollComplete callback with isOpen boolean on animation end", () => {
    const handleRollComplete = vi.fn();
    render(
      <ParchmentScroll isOpen={true} onRollComplete={handleRollComplete}>
        <div>Callback Test</div>
      </ParchmentScroll>
    );

    const unrollBody = screen.getByTestId("parchment-scroll-unroll-body");
    fireEvent.animationEnd(unrollBody, { animationName: "parchmentUnroll" });

    expect(handleRollComplete).toHaveBeenCalledTimes(1);
    expect(handleRollComplete).toHaveBeenCalledWith(true);
  });

  it("triggers onRollComplete callback when rollup animation ends", () => {
    const handleRollComplete = vi.fn();
    render(
      <ParchmentScroll isOpen={false} onRollComplete={handleRollComplete}>
        <div>Callback Test</div>
      </ParchmentScroll>
    );

    const rollUpBody = screen.getByTestId("parchment-scroll-unroll-body");
    fireEvent.animationEnd(rollUpBody, { animationName: "parchmentRollUp" });

    expect(handleRollComplete).toHaveBeenCalledTimes(1);
    expect(handleRollComplete).toHaveBeenCalledWith(false);
  });
});


