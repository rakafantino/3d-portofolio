import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar.jsx";

describe("Navbar (Cyber Dock)", () => {
  const renderNavbar = (props = {}) => {
    return render(
      <MemoryRouter>
        <Navbar {...props} />
      </MemoryRouter>
    );
  };

  it("renders brand monogram linking to home page with RF // 01 text", () => {
    renderNavbar();
    const brandLink = screen.getByRole("link", { name: /RF/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute("href", "/");
    expect(brandLink).toHaveTextContent(/RF\s*\/\/\s*01/i);
  });

  it("renders primary navigation links to about, projects, and contact", () => {
    renderNavbar();
    const aboutLink = screen.getByRole("link", { name: /about/i });
    const projectsLink = screen.getByRole("link", { name: /projects/i });
    const contactLink = screen.getByRole("link", { name: /contact/i });

    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute("href", "/about");

    expect(projectsLink).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute("href", "/projects");

    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders live status telemetry pill with operational indicator text", () => {
    renderNavbar();
    const telemetryPill = screen.getByText(/STATUS:\s*OPERATIONAL/i);
    expect(telemetryPill).toBeInTheDocument();
  });

  it("renders command palette quick launcher button and triggers onOpenCommandPalette", () => {
    const handleOpen = vi.fn();
    renderNavbar({ onOpenCommandPalette: handleOpen });

    const cmdKBtn = screen.getByRole("button", {
      name: /command palette|quick launch/i,
    });
    expect(cmdKBtn).toBeInTheDocument();

    fireEvent.click(cmdKBtn);
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });

  it("does not throw when clicking command palette button without prop", () => {
    renderNavbar();

    const cmdKBtn = screen.getByRole("button", {
      name: /command palette|quick launch/i,
    });
    expect(() => fireEvent.click(cmdKBtn)).not.toThrow();
  });

  it("renders the AudioController soundwave button", () => {
    renderNavbar();
    const audioBtn = screen.getByRole("button", { name: /terminal audio/i });
    expect(audioBtn).toBeInTheDocument();
  });
});
