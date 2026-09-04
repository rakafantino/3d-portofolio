import { render, screen, fireEvent } from "@testing-library/react";
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

    expect(screen.getByText(/Raka Fantino/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend & Fullstack Engineer/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Lihat Proyek/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Hubungi/i })).toBeInTheDocument();

    // No legacy cyber strings
    expect(screen.queryByText(/SYS_INIT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/TELEMETRY_FEED/i)).not.toBeInTheDocument();
  });

  it("renders 5 zone navigator buttons matching story landmarks", () => {
    renderHome();

    expect(screen.getByRole("button", { name: /Awal/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tentang/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Riset & Awards/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Proyek & Lab/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kontak/i })).toBeInTheDocument();
  });

  it("switches to Zone 2 (Tentang / Kabin Kerja) on button click, displaying link to /about", async () => {
    renderHome();

    const aboutBtn = screen.getByRole("button", { name: /Tentang/i });
    fireEvent.click(aboutBtn);

    const aboutLink = await screen.findByRole("link", { name: /Buka halaman Tentang Saya/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(await screen.findByText(/Tempat ide dirancang/i)).toBeInTheDocument();
  });

  it("switches to Zone 3 (Riset & Awards / Observatorium) on button click, displaying awards link", async () => {
    renderHome();

    const awardsBtn = screen.getByRole("button", { name: /Riset & Awards/i });
    fireEvent.click(awardsBtn);

    const awardsLink = await screen.findByRole("link", { name: /Lihat Penghargaan/i });
    expect(awardsLink).toBeInTheDocument();
    expect(awardsLink).toHaveAttribute("href", "/about");
    expect(await screen.findByText(/Observatorium \/ Riset & Awards/i)).toBeInTheDocument();
  });

  it("switches to Zone 4 (Proyek & Lab / Reaktor) on button click, displaying projects link", async () => {
    renderHome();

    const projectsBtn = screen.getByRole("button", { name: /Proyek & Lab/i });
    fireEvent.click(projectsBtn);

    const projectsLink = await screen.findByRole("link", { name: /Jelajahi Semua Proyek/i });
    expect(projectsLink).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("href", "/projects");
    expect(await screen.findByText(/NinjaPump\.ai/i)).toBeInTheDocument();
  });

  it("switches to Zone 5 (Mercusuar / Kontak) on button click, displaying contact link", async () => {
    renderHome();

    const contactBtn = screen.getByRole("button", { name: /Kontak/i });
    fireEvent.click(contactBtn);

    const contactLink = await screen.findByRole("link", { name: /Kirim Pesan Sekarang/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("does not mount a duplicate AudioController in Home (navbar owns audio control)", () => {
    renderHome();

    expect(screen.queryByTestId("audio-controller")).not.toBeInTheDocument();
  });
});
