import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Loader from "./Loader";

let mockProgress = 65;
vi.mock("@react-three/drei", () => ({
  Html: ({ children }) => <div data-testid="mock-html-loader">{children}</div>,
  useProgress: () => ({ progress: mockProgress }),
}));

describe("Loader Component", () => {
  it("renders atmospheric copper gauge and numeric percentage instead of generic blue spinner", () => {
    mockProgress = 65;
    render(<Loader />);

    expect(screen.getByTestId("mock-html-loader")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText(/Menyiapkan Atmosfer/i)).toBeInTheDocument();
    expect(screen.getByText(/Sunset Workshop Island/i)).toBeInTheDocument();

    expect(screen.queryByClassName?.("border-blue-500")).toBeFalsy();
  });
});
