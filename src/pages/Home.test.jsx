import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

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
}));

// Mock AudioController
vi.mock("../components/AudioController", () => ({
  default: () => <div data-testid="audio-controller">AUDIO_CONTROLLER_MOCK</div>,
}));

// Mock WorkshopIsland
vi.mock("../models/WorkshopIsland", () => ({
  default: (props) => (
    <div data-testid="workshop-island-model" data-props={JSON.stringify(props)} />
  ),
}));

import Home from "./Home";

describe("Home Page - Workshop Island 3D World & Zone Story Cards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1024;
  });

  const renderHome = () => {
    return render(
      <MemoryRouter>
        <Home />
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
    renderHome();

    expect(screen.getAllByText(/Raka Fantino/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Frontend & Fullstack Engineer/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Semua Proyek/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tentang Saya/i })).toBeInTheDocument();

    // No legacy cyber strings
    expect(screen.queryByText(/SYS_INIT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/TELEMETRY_FEED/i)).not.toBeInTheDocument();
  });

  it("renders carousel navigation controls with previous and next buttons", () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    expect(within(desktopNav).getByRole("button", { name: /Sebelumnya/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("button", { name: /Selanjutnya/i })).toBeInTheDocument();
    expect(within(desktopNav).getByText(/01/i)).toBeInTheDocument();
  });

  it("advances to Zone 2 on next button click, displaying link to /about", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const nextBtn = within(desktopNav).getByRole("button", { name: /Selanjutnya/i });
    fireEvent.click(nextBtn);

    const aboutLink = await screen.findByRole("link", { name: /Buka Halaman Tentang Saya/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("advances through zones sequentially on repeated next button clicks", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const nextBtn = within(desktopNav).getByRole("button", { name: /Selanjutnya/i });

    fireEvent.click(nextBtn);
    expect(await screen.findByRole("link", { name: /Buka Halaman Tentang Saya/i })).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(await screen.findByRole("link", { name: /Lihat Kredensial & Penghargaan/i })).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(await screen.findByRole("link", { name: /Jelajahi Arsip Proyek Lengkap/i })).toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(await screen.findByRole("link", { name: /Kirim Pesan Sekarang/i })).toBeInTheDocument();
  });

  it("wraps around to Zone 5 on previous button click from Zone 1", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const prevBtn = within(desktopNav).getByRole("button", { name: /Sebelumnya/i });
    fireEvent.click(prevBtn);

    const contactLink = await screen.findByRole("link", { name: /Kirim Pesan Sekarang/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders MobileSmartDock with micro-pill and carousel buttons on mobile viewport", () => {
    window.innerWidth = 375;
    renderHome();

    const mobileNav = screen.getByRole("navigation", { name: /Navigasi zona mobile/i });
    expect(mobileNav).toBeInTheDocument();
    expect(within(mobileNav).getByRole("button", { name: /Sebelumnya/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("button", { name: /Selanjutnya/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Buka Raka Fantino/i })).toBeInTheDocument();
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

  it("does not mount a duplicate AudioController in Home (navbar owns audio control)", () => {
    renderHome();

    expect(screen.queryByTestId("audio-controller")).not.toBeInTheDocument();
  });
});
