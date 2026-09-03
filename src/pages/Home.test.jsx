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
  Sky: (props) => <div data-testid="mock-sky" data-props={JSON.stringify(props)} />,
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

  it("renders with mobile-friendly min-h-[100dvh] section layout and mounts WorkshopIsland & Sunset Sky in Canvas", () => {
    renderHome();

    const homeSection = screen.getByRole("region", { name: /workshop-island/i });
    expect(homeSection).toBeInTheDocument();
    expect(homeSection.className).toMatch(/min-h-\[100dvh\]/);

    expect(screen.getByTestId("mock-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("mock-sky")).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: /AI & Awards/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Web3 & Kripto/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Fullstack/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kontak/i })).toBeInTheDocument();
  });

  it("switches to Zone 2 (AI & Awards) on button click, displaying link to /about", () => {
    renderHome();

    const aiAwardsBtn = screen.getByRole("button", { name: /AI & Awards/i });
    fireEvent.click(aiAwardsBtn);

    const aboutLink = screen.getByRole("link", { name: /Buka halaman About/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(screen.getByText(/AI Singapore & Google Gemma Challenge/i)).toBeInTheDocument();
  });

  it("switches to Zone 3 (Web3 & Kripto) on button click, displaying link to /projects", () => {
    renderHome();

    const web3Btn = screen.getByRole("button", { name: /Web3 & Kripto/i });
    fireEvent.click(web3Btn);

    const projectsLink = screen.getByRole("link", { name: /Lihat Proyek Web3/i });
    expect(projectsLink).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("href", "/projects");
    expect(screen.getByText(/NinjaPump\.ai/i)).toBeInTheDocument();
  });

  it("switches to Zone 4 (Fullstack) on button click, displaying portofolio link", () => {
    renderHome();

    const fullstackBtn = screen.getByRole("button", { name: /Fullstack/i });
    fireEvent.click(fullstackBtn);

    const projectsLink = screen.getByRole("link", { name: /Lihat Portofolio/i });
    expect(projectsLink).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });

  it("switches to Zone 5 (Mercusuar Kontak) on button click, displaying contact link", () => {
    renderHome();

    const contactBtn = screen.getByRole("button", { name: /Kontak/i });
    fireEvent.click(contactBtn);

    const contactLink = screen.getByRole("link", { name: /Kirim Pesan/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("mounts AudioController in bottom left zone", () => {
    renderHome();

    expect(screen.getByTestId("audio-controller")).toBeInTheDocument();
  });
});
