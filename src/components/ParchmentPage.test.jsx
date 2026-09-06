import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ParchmentPage from "./ParchmentPage";

describe("ParchmentPage Component", () => {
  it("renders children content inside the full-page unrolling scroll wrapper", () => {
    render(
      <ParchmentPage className="custom-page-class">
        <div data-testid="subpage-content">Scholar Field Notes</div>
      </ParchmentPage>
    );

    const root = screen.getByTestId("parchment-page-root");
    expect(root).toBeInTheDocument();
    expect(screen.getByTestId("subpage-content")).toHaveTextContent("Scholar Field Notes");
  });

  it("renders wooden rollers at top and bottom with brass end knobs", () => {
    render(
      <ParchmentPage>
        <div>Scroll Roller Test</div>
      </ParchmentPage>
    );

    expect(screen.getByTestId("scroll-roller-top")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-roller-bottom")).toBeInTheDocument();
  });

  it("renders medieval deckled torn edges and paper fiber texture filter", () => {
    render(
      <ParchmentPage>
        <div>Texture Filter Test</div>
      </ParchmentPage>
    );

    expect(screen.getByTestId("page-paper-fiber")).toBeInTheDocument();
    expect(screen.getByTestId("page-deckled-left")).toBeInTheDocument();
    expect(screen.getByTestId("page-deckled-right")).toBeInTheDocument();
  });

  it("applies unroll animation classes for dramatic page roll-down when isOpen is true", () => {
    const { container } = render(
      <ParchmentPage isOpen={true}>
        <div>Animation Test</div>
      </ParchmentPage>
    );

    const unrollNode = container.querySelector(".animate-parchment-unroll");
    const topRollNode = container.querySelector(".animate-parchment-top-roll");
    const contentNode = container.querySelector(".animate-parchment-content");

    expect(unrollNode).toBeInTheDocument();
    expect(topRollNode).toBeInTheDocument();
    expect(contentNode).toBeInTheDocument();
  });

  it("applies roll-up animation classes when isOpen is false", () => {
    const { container } = render(
      <ParchmentPage isOpen={false}>
        <div>Roll Up Test</div>
      </ParchmentPage>
    );

    const rollUpNode = container.querySelector(".animate-parchment-rollup");
    const topRollRiseNode = container.querySelector(".animate-parchment-top-roll-rise");
    const contentExitNode = container.querySelector(".animate-parchment-content-exit");

    expect(rollUpNode).toBeInTheDocument();
    expect(topRollRiseNode).toBeInTheDocument();
    expect(contentExitNode).toBeInTheDocument();
  });

  it("triggers onRollComplete callback when unroll animation completes", () => {
    const handleRollComplete = vi.fn();
    render(
      <ParchmentPage isOpen={true} onRollComplete={handleRollComplete}>
        <div>Callback Test</div>
      </ParchmentPage>
    );

    const unrollBody = screen.getByTestId("parchment-page-unroll-body");
    fireEvent.animationEnd(unrollBody, { animationName: "parchmentUnroll" });

    expect(handleRollComplete).toHaveBeenCalledTimes(1);
    expect(handleRollComplete).toHaveBeenCalledWith(true);
  });

  it("triggers onRollComplete callback when rollup animation completes", () => {
    const handleRollComplete = vi.fn();
    render(
      <ParchmentPage isOpen={false} onRollComplete={handleRollComplete}>
        <div>Callback Test</div>
      </ParchmentPage>
    );

    const rollUpBody = screen.getByTestId("parchment-page-unroll-body");
    fireEvent.animationEnd(rollUpBody, { animationName: "parchmentRollUp" });

    expect(handleRollComplete).toHaveBeenCalledTimes(1);
    expect(handleRollComplete).toHaveBeenCalledWith(false);
  });
});

