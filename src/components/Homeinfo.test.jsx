import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { LanguageProvider } from "../context/LanguageContext";
import Homeinfo from "./Homeinfo";

describe("Homeinfo Component", () => {
  const renderHomeinfo = (stage, props = {}) => {
    return render(
      <MemoryRouter>
        <LanguageProvider>
          <Homeinfo currentStage={stage} {...props} />
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  it("renders Zone 1 with a single prominent Start Tour action button and no secondary link", () => {
    const handleStartTour = vi.fn();
    renderHomeinfo(1, { onStartTour: handleStartTour });

    expect(screen.getByTestId("parchment-scroll")).toBeInTheDocument();
    expect(screen.getByText(/Sebuah pulau kecil di waktu senja\.|A small workshop island at dusk\./i)).toBeInTheDocument();

    const startTourBtn = screen.getByRole("button", { name: /Mulai Tur|Start Tour/i });
    expect(startTourBtn).toBeInTheDocument();

    expect(screen.queryByRole("link", { name: /Baca Profil|Read Profile/i })).not.toBeInTheDocument();

    fireEvent.click(startTourBtn);
    expect(handleStartTour).toHaveBeenCalledTimes(1);
  });

  it("renders Zone 2 StoryCard with ParchmentRibbon tab and no wax seals", () => {
    renderHomeinfo(2);

    expect(screen.getByTestId("parchment-scroll")).toBeInTheDocument();
    expect(screen.getByText(/Tentang Saya|About Me/i)).toBeInTheDocument();
    
    const ribbonLink = screen.getByRole("link", { name: /Kenalan Lebih Dekat|Get to Know Me/i });
    expect(ribbonLink).toBeInTheDocument();
    expect(ribbonLink).toHaveAttribute("href", "/about");
    expect(ribbonLink).toHaveAttribute("data-variant", "tab");
    expect(screen.queryByTestId("wax-seal-svg")).not.toBeInTheDocument();
  });

  it("renders Zone 3 StoryCard with ParchmentRibbon tab to about awards", () => {
    renderHomeinfo(3);

    expect(screen.getByTestId("parchment-scroll")).toBeInTheDocument();
    expect(screen.getByText(/Riset & Prestasi|Research & Awards/i)).toBeInTheDocument();
    
    const ribbonLink = screen.getByRole("link", { name: /Lihat Penghargaan|View Awards/i });
    expect(ribbonLink).toBeInTheDocument();
    expect(ribbonLink).toHaveAttribute("href", "/about#awards");
    expect(ribbonLink).toHaveAttribute("data-variant", "tab");
    expect(screen.queryByTestId("wax-seal-svg")).not.toBeInTheDocument();
  });

  it("renders Zone 4 StoryCard with ParchmentRibbon tab to projects", () => {
    renderHomeinfo(4);

    expect(screen.getByTestId("parchment-scroll")).toBeInTheDocument();
    expect(screen.getByText(/Proyek & Lab|Projects & Lab/i)).toBeInTheDocument();
    
    const ribbonLink = screen.getByRole("link", { name: /Lihat Semua Proyek|View All Projects/i });
    expect(ribbonLink).toBeInTheDocument();
    expect(ribbonLink).toHaveAttribute("href", "/projects");
    expect(ribbonLink).toHaveAttribute("data-variant", "tab");
    expect(screen.queryByTestId("wax-seal-svg")).not.toBeInTheDocument();
  });

  it("renders Zone 5 StoryCard with ParchmentRibbon tab to contact", () => {
    renderHomeinfo(5);

    expect(screen.getByTestId("parchment-scroll")).toBeInTheDocument();
    expect(screen.getByText(/Ngobrol Yuk|Let's Connect/i)).toBeInTheDocument();
    
    const ribbonLink = screen.getByRole("link", { name: /Kirim Pesan|Send a Message/i });
    expect(ribbonLink).toBeInTheDocument();
    expect(ribbonLink).toHaveAttribute("href", "/contact");
    expect(ribbonLink).toHaveAttribute("data-variant", "tab");
    expect(screen.queryByTestId("wax-seal-svg")).not.toBeInTheDocument();
  });

  it("passes isOpen={false} to ParchmentScroll and handles onRollComplete callback", () => {
    const handleRollComplete = vi.fn();
    renderHomeinfo(2, { isOpen: false, onRollComplete: handleRollComplete });

    const scroll = screen.getByTestId("parchment-scroll");
    expect(scroll).toHaveAttribute("data-is-open", "false");
  });

  it("does not render wax seals in any storycard zone", () => {
    for (const stage of [1, 2, 3, 4, 5]) {
      const { unmount } = renderHomeinfo(stage);
      expect(screen.queryByTestId("wax-seal-svg")).not.toBeInTheDocument();
      unmount();
    }
  });

  it("returns null when currentStage is invalid", () => {
    const { container } = renderHomeinfo(999);
    expect(container).toBeEmptyDOMElement();
  });
});
