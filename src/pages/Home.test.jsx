import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageProvider } from "../context/LanguageContext";

// Mock @react-three/fiber Canvas & hooks
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children, className, ...props }) => (
    <div data-testid="mock-canvas" className={className} {...props}>
      {children}
    </div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    pointer: { x: 0, y: 0 },
    viewport: { width: 10, height: 8 },
  })),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }) => <div data-testid="mock-html">{children}</div>,
  useGLTF: vi.fn(() => ({ nodes: {}, materials: {} })),
  useAnimations: vi.fn(() => ({ actions: {}, ref: { current: null } })),
  useProgress: vi.fn(() => ({ progress: 100 })),
  Clouds: ({ children, ...props }) => (
    <div data-testid="mock-clouds" {...props}>
      {children}
    </div>
  ),
  Cloud: (props) => <div data-testid="mock-cloud" data-props={JSON.stringify(props)} />,
}));

// Mock AudioController
vi.mock("../components/AudioController", () => ({
  default: () => <div data-testid="audio-controller">AUDIO_CONTROLLER_MOCK</div>,
}));

vi.mock("../context/LanguageToggle", () => ({
  default: () => <div data-testid="lang-toggle">LANG_TOGGLE_MOCK</div>,
}));

// Mock WorkshopIsland
vi.mock("../models/WorkshopIsland", () => ({
  default: (props) => (
    <div data-testid="workshop-island-model" data-props={JSON.stringify(props)} />
  ),
}));

import Home, { SPLASH_STORAGE_KEY, LAST_ZONE_KEY } from "./Home";

describe("Home Page - Workshop Island 3D World & Zone Story Cards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    sessionStorage.setItem(LAST_ZONE_KEY, "1");
    window.innerWidth = 1024;
  });

  const renderHome = () => {
    return render(
      <MemoryRouter>
        <LanguageProvider>
          <Home />
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  it("renders full-viewport h-[100dvh] section layout and mounts WorkshopIsland & Sunset Sky in Canvas", () => {
    renderHome();

    const homeSection = screen.getByRole("region", { name: /workshop-island/i });
    expect(homeSection).toBeInTheDocument();
    expect(homeSection.className).toMatch(/h-\[100dvh\]/);

    expect(screen.getByTestId("mock-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("workshop-island-model")).toBeInTheDocument();
  });

  it("renders Zone 1 intro card by default on initial mount with human language", () => {
    sessionStorage.setItem(LAST_ZONE_KEY, "1");
    renderHome();

    expect(screen.getByText(/Sebuah pulau kecil di waktu senja|A small workshop island at dusk/i)).toBeInTheDocument();
    expect(screen.getByText(/Selamat datang! Saya Raka/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mulai Tur|Start Tour/i })).toBeInTheDocument();

    // No legacy cyber strings
    expect(screen.queryByText(/SYS_INIT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/TELEMETRY_FEED/i)).not.toBeInTheDocument();
  });

  it("has NO top-level navigation bar with link 'Tentang' or other header menus", () => {
    renderHome();

    expect(screen.queryByRole("link", { name: /^Tentang$/i })).not.toBeInTheDocument();
  });

  it("renders carousel navigation controls with previous and next buttons", () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    expect(within(desktopNav).getByRole("button", { name: /Zona Sebelumnya|Previous Zone/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("button", { name: /Zona Selanjutnya|Next Zone/i })).toBeInTheDocument();
    expect(within(desktopNav).getByText(/01/i)).toBeInTheDocument();
  });

  it("advances to Zone 2 on next button click, displaying link to /about", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const nextBtn = within(desktopNav).getByRole("button", { name: /Zona Selanjutnya|Next Zone/i });
    fireEvent.click(nextBtn);

    const aboutLink = await screen.findByRole("link", { name: /Kenalan Lebih Dekat|Baca Profil Lengkap|Get to Know Me/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("advances through zones sequentially on repeated next button clicks", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const nextBtn = within(desktopNav).getByRole("button", { name: /Zona Selanjutnya|Next Zone/i });

    fireEvent.click(nextBtn);
    expect(await screen.findByRole("link", { name: /Kenalan Lebih Dekat|Baca Profil Lengkap|Get to Know Me/i })).toBeInTheDocument();

    fireEvent.click(nextBtn);
    const awardsLink = await screen.findByRole("link", { name: /Lihat Penghargaan|View Awards/i });
    expect(awardsLink).toBeInTheDocument();
    expect(awardsLink).toHaveAttribute("href", "/about#awards");

    fireEvent.click(nextBtn);
    expect(await screen.findByRole("link", { name: /Lihat Semua Proyek|Explore All Projects/i })).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(await screen.findByRole("link", { name: /Kirim Pesan|Drop a Message/i })).toBeInTheDocument();
  });

  it("wraps around to Zone 5 on previous button click from Zone 1", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const prevBtn = within(desktopNav).getByRole("button", { name: /Zona Sebelumnya|Previous Zone/i });
    fireEvent.click(prevBtn);

    const contactLink = await screen.findByRole("link", { name: /Kirim Pesan|Drop a Message/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders MobileSmartDock and floating story card on mobile viewport", () => {
    window.innerWidth = 375;
    renderHome();

    const mobileNav = screen.getByRole("navigation", { name: /Navigasi zona mobile/i });
    expect(mobileNav).toBeInTheDocument();
    expect(within(mobileNav).getByRole("button", { name: /Sebelumnya|Previous/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("button", { name: /Selanjutnya|Next/i })).toBeInTheDocument();
    expect(within(mobileNav).getByText(/01/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mulai Tur|Start Tour/i })).toBeInTheDocument();
  });

  it("orchestrates two-phase roll-up/roll-down on zone change", async () => {
    renderHome();

    const initialScroll = screen.getByTestId("parchment-scroll");
    expect(initialScroll).toHaveAttribute("data-is-open", "true");

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const nextBtn = within(desktopNav).getByRole("button", { name: /Zona Selanjutnya|Next Zone/i });
    fireEvent.click(nextBtn);

    expect(initialScroll).toHaveAttribute("data-is-open", "false");

    const aboutLink = await screen.findByRole("link", {
      name: /Kenalan Lebih Dekat|Baca Profil Lengkap|Get to Know Me/i,
    });
    expect(aboutLink).toBeInTheDocument();

    const newScroll = screen.getByTestId("parchment-scroll");
    expect(newScroll).toHaveAttribute("data-is-open", "true");
  });

  it("uses mobile island scale on small viewport", () => {
    window.innerWidth = 375;
    renderHome();

    const islandMock = screen.getByTestId("workshop-island-model");
    const props = JSON.parse(islandMock.getAttribute("data-props"));
    expect(props.scale).toEqual([0.72, 0.72, 0.72]);
  });

  it("uses desktop island scale on wide viewport", () => {
    window.innerWidth = 1280;
    renderHome();

    const islandMock = screen.getByTestId("workshop-island-model");
    const props = JSON.parse(islandMock.getAttribute("data-props"));
    expect(props.scale).toEqual([1.2, 1.2, 1.2]);
  });

  it("does not mount duplicate audio controls on Home (navbar is removed)", () => {
    renderHome();

    const audioControls = screen.queryAllByTestId("audio-controller");
    expect(audioControls.length).toBeLessThanOrEqual(1);
  });

  it("renders SplashGate on first visit when sessionStorage has not recorded visited gate", async () => {
    sessionStorage.removeItem(SPLASH_STORAGE_KEY);
    renderHome();

    expect(screen.getByRole("dialog", { name: /Island Welcome Gate/i })).toBeInTheDocument();
    expect(await screen.findByText(/Sebuah pulau kecil di waktu senja\./i)).toBeInTheDocument();
  });

  it("does not render SplashGate when user has already visited the island gate", () => {
    sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    renderHome();

    expect(screen.queryByRole("dialog", { name: /Island Welcome Gate/i })).not.toBeInTheDocument();
  });

  it("mounts 3D volumetric sunset clouds layer inside Canvas for fly-through atmosphere", () => {
    renderHome();

    expect(screen.getByTestId("mock-clouds")).toBeInTheDocument();
    const clouds = screen.getAllByTestId("mock-cloud");
    expect(clouds.length).toBeGreaterThanOrEqual(2);
  });

  it("triggers audio play and marks sessionStorage when clicking 'Menuju Pulau' on SplashGate", async () => {
    sessionStorage.removeItem(SPLASH_STORAGE_KEY);
    renderHome();

    const enterBtn = await screen.findByRole("button", { name: /Menuju Pulau/i });
    fireEvent.click(enterBtn);

    expect(sessionStorage.getItem(SPLASH_STORAGE_KEY)).toBe("true");
  });

  it("hides top and bottom navigation controls while gate is visible and fades them in when gate is closed", () => {
    sessionStorage.removeItem(SPLASH_STORAGE_KEY);
    const { unmount } = renderHome();

    const langToggle = screen.getByTestId("lang-toggle");
    const topPillContainer = langToggle.closest(".absolute.top-3");
    expect(topPillContainer).toHaveClass("opacity-0");
    expect(topPillContainer).toHaveClass("pointer-events-none");

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const desktopNavContainer = desktopNav.closest(".bottom-0");
    expect(desktopNavContainer).toHaveClass("opacity-0");
    expect(desktopNavContainer).toHaveClass("pointer-events-none");

    unmount();
    sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    renderHome();

    const updatedLangToggle = screen.getByTestId("lang-toggle");
    const updatedTopPillContainer = updatedLangToggle.closest(".absolute.top-3");
    expect(updatedTopPillContainer).toHaveClass("opacity-100");
    expect(updatedTopPillContainer).toHaveClass("pointer-events-auto");

    const updatedDesktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const updatedDesktopNavContainer = updatedDesktopNav.closest(".bottom-0");
    expect(updatedDesktopNavContainer).toHaveClass("opacity-100");
    expect(updatedDesktopNavContainer).toHaveClass("pointer-events-auto");
  });

  describe("Guided Tour Integration in Home", () => {
    it("renders GuidedTour dialog when clicking 'Mulai Tur' in Zone 1", () => {
      renderHome();

      expect(screen.queryByRole("dialog", { name: /Interactive Guided Tour/i })).not.toBeInTheDocument();

      const startTourBtn = screen.getByRole("button", { name: /Mulai Tur|Start Tour/i });
      fireEvent.click(startTourBtn);

      const tourDialog = screen.getByRole("dialog", { name: /Interactive Guided Tour/i });
      expect(tourDialog).toBeInTheDocument();
      expect(screen.getByText("1 / 4")).toBeInTheDocument();
      expect(screen.getByText(/Diorama Workshop/i)).toBeInTheDocument();
    });

    it("dismisses GuidedTour when skipping without changing the zone", () => {
      renderHome();

      const startTourBtn = screen.getByRole("button", { name: /Mulai Tur|Start Tour/i });
      fireEvent.click(startTourBtn);

      expect(screen.getByRole("dialog", { name: /Interactive Guided Tour/i })).toBeInTheDocument();

      const skipBtn = screen.getByRole("button", { name: /Lewati|Skip/i });
      fireEvent.click(skipBtn);

      expect(screen.queryByRole("dialog", { name: /Interactive Guided Tour/i })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Mulai Tur|Start Tour/i })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /Kenalan Lebih Dekat|Baca Profil Lengkap|Get to Know Me/i })).not.toBeInTheDocument();
    });

    it("completes tour at step 4, dismisses dialog, and initiates transition to Zone 2", async () => {
      renderHome();

      const startTourBtn = screen.getByRole("button", { name: /Mulai Tur|Start Tour/i });
      fireEvent.click(startTourBtn);

      expect(screen.getByText("1 / 4")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Lanjut →|Next →/i }));

      expect(screen.getByText("2 / 4")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Lanjut →|Next →/i }));

      expect(screen.getByText("3 / 4")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Lanjut →|Next →/i }));

      expect(screen.getByText("4 / 4")).toBeInTheDocument();
      expect(screen.getByText(/Tandai Peta/i)).toBeInTheDocument();

      const finishBtn = screen.getByRole("button", { name: /Mulai Ekspedisi →|Start Expedition →/i });
      fireEvent.click(finishBtn);

      expect(screen.queryByRole("dialog", { name: /Interactive Guided Tour/i })).not.toBeInTheDocument();

      const aboutLink = await screen.findByRole("link", {
        name: /Kenalan Lebih Dekat|Baca Profil Lengkap|Get to Know Me/i,
      });
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute("href", "/about");
    });
  });
});
