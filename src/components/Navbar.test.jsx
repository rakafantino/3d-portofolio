import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar.jsx";

describe("Navbar", () => {
  const renderNavbar = (props = {}) => {
    return render(
      <MemoryRouter>
        <Navbar {...props} />
      </MemoryRouter>
    );
  };

  it("renders brand monogram / wordmark linking to home page with Raka Fantino text", () => {
    renderNavbar();
    const brandLink = screen.getByRole("link", { name: /Raka Fantino/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute("href", "/");
    expect(brandLink).toHaveTextContent(/Raka Fantino/i);
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

  it("renders available for work status pill indicator", () => {
    renderNavbar();
    const statusPill = screen.getByText(/Available for work/i);
    expect(statusPill).toBeInTheDocument();
  });

  it("renders quick navigation command palette button and triggers onOpenCommandPalette", () => {
    const handleOpen = vi.fn();
    renderNavbar({ onOpenCommandPalette: handleOpen });

    const cmdKBtn = screen.getByRole("button", {
      name: /open quick navigation/i,
    });
    expect(cmdKBtn).toBeInTheDocument();

    fireEvent.click(cmdKBtn);
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });

  it("does not throw when clicking command palette button without prop", () => {
    renderNavbar();

    const cmdKBtn = screen.getByRole("button", {
      name: /open quick navigation/i,
    });
    expect(() => fireEvent.click(cmdKBtn)).not.toThrow();
  });

  it("renders the AudioController soundwave button", () => {
    renderNavbar();
    const audioBtn = screen.getByRole("button", { name: /terminal audio/i });
    expect(audioBtn).toBeInTheDocument();
  });
});
