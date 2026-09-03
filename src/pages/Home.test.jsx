import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @react-three/fiber Canvas & hooks to test DOM orchestration without WebGL crash in jsdom
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

// Mock AudioController to isolate Home DOM testing
vi.mock("../components/AudioController", () => ({
  default: () => <div data-testid="audio-controller">AUDIO_CONTROLLER_MOCK</div>,
}));

// Mock TechCore to verify it is mounted inside Canvas with expected props
vi.mock("../models/TechCore", () => ({
  default: (props) => <div data-testid="tech-core-model" data-props={JSON.stringify(props)} />,
}));

import Home from "./Home";

describe("Home Page - Hero Canvas & Dual-Control Orbit Scrubber HUD", () => {
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

  it("renders with mobile-friendly min-h-[100dvh] section layout and mounts TechCore in Canvas", () => {
    renderHome();

    const homeSection = screen.getByRole("region", { name: /hero-terminal|home/i }) || document.querySelector("section");
    expect(homeSection).toBeInTheDocument();
    expect(homeSection.className).toMatch(/min-h-\[100dvh\]/);

    expect(screen.getByTestId("mock-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("tech-core-model")).toBeInTheDocument();
  });

  it("renders Stage 1 intro telemetry callout by default on initial mount", () => {
    renderHome();

    // Raka Fantino / Fullstack Engineer / AI & Web3 Builder
    expect(screen.getByText(/Raka Fantino/i)).toBeInTheDocument();
    expect(screen.getByText(/Fullstack Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/SYSTEM_READY/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SYS_INIT/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders 4 HUD scrubber buttons matching the required stage nodes", () => {
    renderHome();

    expect(screen.getByRole("button", { name: /01 \/\/ SYS_INIT/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /02 \/\/ AI_AWARDS/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /03 \/\/ WEB3_ARSENAL/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /04 \/\/ COMMS_LINK/i })).toBeInTheDocument();
  });

  it("switches to Stage 2 (AI_AWARDS) on button click, displaying link to /about", () => {
    renderHome();

    const stage2Btn = screen.getByRole("button", { name: /02 \/\/ AI_AWARDS/i });
    fireEvent.click(stage2Btn);

    const aboutLink = screen.getByRole("link", { name: /VIEW PERSONNEL FILE/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("switches to Stage 3 (WEB3_ARSENAL) on button click, displaying link to /projects", () => {
    renderHome();

    const stage3Btn = screen.getByRole("button", { name: /03 \/\/ WEB3_ARSENAL/i });
    fireEvent.click(stage3Btn);

    const projectsLink = screen.getByRole("link", { name: /VIEW PROJECT LOG/i });
    expect(projectsLink).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("href", "/projects");
  });

  it("switches to Stage 4 (COMMS_LINK) on button click, displaying link to /contact", () => {
    renderHome();

    const stage4Btn = screen.getByRole("button", { name: /04 \/\/ COMMS_LINK/i });
    fireEvent.click(stage4Btn);

    const commsLink = screen.getByRole("link", { name: /OPEN COMMS CHANNEL/i });
    expect(commsLink).toBeInTheDocument();
    expect(commsLink).toHaveAttribute("href", "/contact");
  });

  it("mounts AudioController in bottom left zone without legacy audio elements or sound icons", () => {
    renderHome();

    expect(screen.getByTestId("audio-controller")).toBeInTheDocument();
    expect(screen.queryByAltText(/sound/i)).not.toBeInTheDocument();
  });
});
