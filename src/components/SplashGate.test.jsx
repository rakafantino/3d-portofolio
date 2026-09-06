import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import SplashGate from "./SplashGate";
import { LanguageProvider } from "../context/LanguageContext";

let mockProgress = 100;
vi.mock("@react-three/drei", () => ({
  useProgress: () => ({ progress: mockProgress }),
}));

describe("SplashGate Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockProgress = 100;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const renderGate = (props = {}) => {
    return render(
      <LanguageProvider>
        <SplashGate {...props} />
      </LanguageProvider>
    );
  };

  it("shows loading indicator when progress < 100 on initial mount", () => {
    mockProgress = 42;
    renderGate();

    expect(screen.getByText(/Memuat aset pulau\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("transitions to welcoming card after progress completes or graceful grace timer", () => {
    mockProgress = 100;
    renderGate();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText(/Sebuah pulau kecil di waktu senja\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/Langit senja dan diorama pulau sudah siap untuk dijelajahi\./i)
    ).toBeInTheDocument();

    const enterBtn = screen.getByRole("button", { name: /Menuju Pulau/i });
    expect(enterBtn).toBeInTheDocument();
    expect(enterBtn).toHaveAttribute("data-variant", "seal");
    expect(enterBtn).toHaveAttribute("id", "enter-island-seal-btn");

    const parchmentScroll = screen.getByTestId("parchment-scroll");
    expect(parchmentScroll).toBeInTheDocument();
    expect(parchmentScroll).toHaveAttribute("data-is-open", "true");

    expect(screen.getByTestId("wax-seal-svg")).toBeInTheDocument();
    expect(screen.getByTestId("wax-melted-rim")).toBeInTheDocument();
    expect(screen.getByTestId("wax-embossed-insignia")).toBeInTheDocument();
  });

  it("renders pure circular wax seal medallion with compassionate gold compass star and caption", () => {
    mockProgress = 100;
    renderGate();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const enterBtn = screen.getByRole("button", { name: /Menuju Pulau/i });
    expect(enterBtn).toHaveAttribute("data-variant", "seal");
    expect(enterBtn).toHaveAttribute("id", "enter-island-seal-btn");
    expect(enterBtn.className).toContain("rounded-full");
    expect(enterBtn.className).not.toContain("w-full");

    const caption = screen.getByText(/Menuju Pulau →/i);
    expect(caption).toBeInTheDocument();
    expect(caption.className).toContain("font-serif");
    expect(caption.className).toContain("italic");
    expect(caption.className).toContain("text-[#8C3E14]");
  });

  it("triggers roll-up sequence on button click, calling onEnter immediately, changing isOpen to false then unmounting", () => {
    const handleEnter = vi.fn();
    renderGate({ onEnter: handleEnter });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const enterBtn = screen.getByRole("button", { name: /Menuju Pulau/i });
    expect(enterBtn).toBeInTheDocument();

    const parchmentScroll = screen.getByTestId("parchment-scroll");
    expect(parchmentScroll).toHaveAttribute("data-is-open", "true");

    fireEvent.click(enterBtn);

    expect(handleEnter).toHaveBeenCalledTimes(1);
    expect(parchmentScroll).toHaveAttribute("data-is-open", "false");

    act(() => {
      vi.advanceTimersByTime(630);
    });

    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("triggers unmount when parchment unroll body fires animationEnd for parchmentRollUp", () => {
    const handleEnter = vi.fn();
    renderGate({ onEnter: handleEnter });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    const enterBtn = screen.getByRole("button", { name: /Menuju Pulau/i });
    fireEvent.click(enterBtn);

    expect(handleEnter).toHaveBeenCalledTimes(1);

    const unrollBody = screen.getByTestId("parchment-scroll-unroll-body");
    fireEvent.animationEnd(unrollBody, { animationName: "parchmentRollUp" });

    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
