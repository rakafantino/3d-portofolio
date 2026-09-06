import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Alert from "./Alert";

describe("Alert Component", () => {
  it("renders success alert with brass badge styling and checkmark", () => {
    render(<Alert type="success" text="Warkat berhasil terkirim" />);

    const alertEl = screen.getByRole("alert");
    expect(alertEl).toBeInTheDocument();
    expect(screen.getByText("Warkat berhasil terkirim")).toBeInTheDocument();
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("renders danger alert with crimson wax badge styling and cross mark", () => {
    render(<Alert type="danger" text="Pengiriman warkat gagal" />);

    const alertEl = screen.getByRole("alert");
    expect(alertEl).toBeInTheDocument();
    expect(screen.getByText("Pengiriman warkat gagal")).toBeInTheDocument();
    expect(screen.getByText("✕")).toBeInTheDocument();
  });
});
