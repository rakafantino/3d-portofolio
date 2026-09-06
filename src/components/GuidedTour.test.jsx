import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import GuidedTour from "./GuidedTour";
import { LanguageProvider } from "../context/LanguageContext";

const renderWithLanguage = (ui) => {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
};

describe("GuidedTour Component", () => {
  let target1;
  let target2;
  let target3;

  beforeEach(() => {
    target1 = document.createElement("div");
    target1.setAttribute("data-tour-target", "island-diorama");
    target1.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      width: 200,
      height: 200,
      bottom: 300,
      right: 300,
    });
    document.body.appendChild(target1);

    target2 = document.createElement("div");
    target2.setAttribute("data-tour-target", "astrolabe-nav");
    target2.getBoundingClientRect = () => ({
      top: 500,
      left: 200,
      width: 400,
      height: 80,
      bottom: 580,
      right: 600,
    });
    document.body.appendChild(target2);

    target3 = document.createElement("div");
    target3.setAttribute("data-tour-target", "brass-compass");
    target3.getBoundingClientRect = () => ({
      top: 20,
      left: 700,
      width: 60,
      height: 60,
      bottom: 80,
      right: 760,
    });
    document.body.appendChild(target3);
  });

  afterEach(() => {
    if (target1 && target1.parentNode) target1.parentNode.removeChild(target1);
    if (target2 && target2.parentNode) target2.parentNode.removeChild(target2);
    if (target3 && target3.parentNode) target3.parentNode.removeChild(target3);
    vi.clearAllMocks();
  });

  it("renders with role='dialog' and aria-modal='true'", () => {
    renderWithLanguage(<GuidedTour isOpen={true} onClose={vi.fn()} onComplete={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("does not render when isOpen is false", () => {
    renderWithLanguage(<GuidedTour isOpen={false} onClose={vi.fn()} onComplete={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates through steps 1 -> 2 -> 3 -> 4 when clicking next", () => {
    renderWithLanguage(<GuidedTour isOpen={true} onClose={vi.fn()} onComplete={vi.fn()} />);

    expect(screen.getByText("1 / 4")).toBeInTheDocument();
    expect(screen.getByText("Diorama Workshop")).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /lanjut →|next →/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText("2 / 4")).toBeInTheDocument();
    expect(screen.getByText("Navigasi Astrolabe")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /lanjut →|next →/i }));
    expect(screen.getByText("3 / 4")).toBeInTheDocument();
    expect(screen.getByText("Instrumen Kompas")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /lanjut →|next →/i }));
    expect(screen.getByText("4 / 4")).toBeInTheDocument();
    expect(screen.getByText("Tandai Peta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mulai ekspedisi →|start expedition →/i })).toBeInTheDocument();
  });

  it("calls onClose when skip button is clicked", () => {
    const handleClose = vi.fn();
    renderWithLanguage(<GuidedTour isOpen={true} onClose={handleClose} onComplete={vi.fn()} />);

    const skipBtn = screen.getByRole("button", { name: /lewati|skip/i });
    fireEvent.click(skipBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete when final finish button is clicked on Step 4", () => {
    const handleComplete = vi.fn();
    renderWithLanguage(<GuidedTour isOpen={true} onClose={vi.fn()} onComplete={handleComplete} />);

    fireEvent.click(screen.getByRole("button", { name: /lanjut →|next →/i }));
    fireEvent.click(screen.getByRole("button", { name: /lanjut →|next →/i }));
    fireEvent.click(screen.getByRole("button", { name: /lanjut →|next →/i }));

    const finishBtn = screen.getByRole("button", { name: /mulai ekspedisi →|start expedition →/i });
    fireEvent.click(finishBtn);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn();
    renderWithLanguage(<GuidedTour isOpen={true} onClose={handleClose} onComplete={vi.fn()} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("handles missing target element gracefully without crashing and centers card", () => {
    if (target1 && target1.parentNode) target1.parentNode.removeChild(target1);

    renderWithLanguage(<GuidedTour isOpen={true} onClose={vi.fn()} onComplete={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("1 / 4")).toBeInTheDocument();
    expect(screen.getByText("Diorama Workshop")).toBeInTheDocument();
  });
});
