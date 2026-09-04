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
    expect(screen.getByRole("link", { name: /Lihat Proyek/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Hubungi/i })).toBeInTheDocument();

    // No legacy cyber strings
    expect(screen.queryByText(/SYS_INIT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/TELEMETRY_FEED/i)).not.toBeInTheDocument();
  });

  it("renders 5 zone navigator buttons matching story landmarks", () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    expect(within(desktopNav).getByRole("button", { name: /Awal/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("button", { name: /Tentang/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("button", { name: /Riset & Awards/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("button", { name: /Proyek & Lab/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("button", { name: /Kontak/i })).toBeInTheDocument();
  });

  it("switches to Zone 2 (Tentang / Kabin Kerja) on button click, displaying link to /about", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const aboutBtn = within(desktopNav).getByRole("button", { name: /Tentang/i });
    fireEvent.click(aboutBtn);

    const aboutLink = await screen.findByRole("link", { name: /Selengkapnya/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("switches to Zone 3 (Riset & Awards / Observatorium) on button click, displaying awards link", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const awardsBtn = within(desktopNav).getByRole("button", { name: /Riset & Awards/i });
    fireEvent.click(awardsBtn);

    const awardsLink = await screen.findByRole("link", { name: /Selengkapnya/i });
    expect(awardsLink).toBeInTheDocument();
    expect(awardsLink).toHaveAttribute("href", "/about");
  });

  it("switches to Zone 4 (Proyek & Lab / Reaktor) on button click, displaying projects link", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const projectsBtn = within(desktopNav).getByRole("button", { name: /Proyek & Lab/i });
    fireEvent.click(projectsBtn);

    const projectsLink = await screen.findByRole("link", { name: /Selengkapnya/i });
    expect(projectsLink).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });

  it("switches to Zone 5 (Mercusuar / Kontak) on button click, displaying contact link", async () => {
    renderHome();

    const desktopNav = screen.getByRole("navigation", { name: /Navigasi zona pulau/i });
    const contactBtn = within(desktopNav).getByRole("button", { name: /Kontak/i });
    fireEvent.click(contactBtn);

    const contactLink = await screen.findByRole("link", { name: /Selengkapnya/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders MobileSmartDock with micro-pill and 5 mobile buttons on mobile viewport", () => {
    window.innerWidth = 375;
    renderHome();

    const mobileNav = screen.getByRole("navigation", { name: /Navigasi zona mobile/i });
    expect(mobileNav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Buka Fullstack & Web3/i })).toBeInTheDocument();
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
