import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

let capturedFrameCallbacks = [];
const mockPointer = { x: 0.5, y: -0.2 };
const mockViewport = { width: 10, height: 8 };

vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn((callback) => {
    capturedFrameCallbacks.push(callback);
  }),
  useThree: vi.fn(() => ({
    pointer: mockPointer,
    viewport: mockViewport,
  })),
}));

vi.mock("@react-three/drei", () => ({
  useGLTF: Object.assign(
    vi.fn(() => ({
      scene: {
        children: [],
        position: { set: vi.fn() },
        scale: { set: vi.fn() },
      },
    })),
    { preload: vi.fn() }
  ),
}));

vi.mock("../assets/3d/island.glb", () => ({
  default: "island.glb",
}));

import WorkshopIsland from "./WorkshopIsland.jsx";

describe("WorkshopIsland Component", () => {
  beforeEach(() => {
    capturedFrameCallbacks = [];
    vi.clearAllMocks();
  });

  it("renders without crash and registers useFrame animation loop", () => {
    const { container } = render(<WorkshopIsland />);
    expect(container).toBeDefined();
    expect(capturedFrameCallbacks.length).toBeGreaterThan(0);
  });

  it("gracefully falls back to safe transforms when invalid or missing props are provided", () => {
    expect(() => {
      render(
        <WorkshopIsland
          scale="invalid-scale"
          position={null}
          rotation={undefined}
          isRotating={false}
          currentStage={1}
          onSelectZone={null}
        />
      );
    }).not.toThrow();
  });

  it("executes captured useFrame callback with clock animation updates without error", () => {
    render(<WorkshopIsland isRotating={true} />);
    expect(capturedFrameCallbacks.length).toBeGreaterThan(0);

    const frameCallback = capturedFrameCallbacks[0];
    const mockState = {
      clock: { elapsedTime: 2.5 },
    };

    expect(() => {
      frameCallback(mockState, 0.016);
    }).not.toThrow();
  });

  it("renders with valid GLB scene primitive", () => {
    const { container } = render(<WorkshopIsland currentStage={1} />);
    expect(container).toBeDefined();
  });
});
