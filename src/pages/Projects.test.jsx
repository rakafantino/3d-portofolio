import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects from "./Projects";

describe("Projects Page - Cyber Bento Grid & Mission Drawer", () => {
  const renderProjects = () => {
    return render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    );
  };

  it("renders the cyber header and telemetry kicker", () => {
    renderProjects();
    expect(screen.getByText(/\/\/ PROJECT_LOG/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/projects/i);
  });

  it("renders all 7 projects from constants on initial load", () => {
    renderProjects();
    const expectedProjects = [
      "NinjaPump.ai",
      "Ninja Suite",
      "Roshambo (DragonEyes)",
      "Goat of Gamblers",
      "PupsBot",
      "Diklik.co",
      "Feedly App",
    ];

    expectedProjects.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders category filter pills with live counts from data", () => {
    renderProjects();
    expect(screen.getByRole("button", { name: /all\s*\(7\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /web3-crypto\s*\(5\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fullstack-saas\s*\(2\)/i })).toBeInTheDocument();
  });

  it("filters projects when category pills are clicked and restores when ALL is clicked", () => {
    renderProjects();
    expect(screen.getByText("Diklik.co")).toBeInTheDocument();
    expect(screen.getByText("NinjaPump.ai")).toBeInTheDocument();

    const web3Filter = screen.getByRole("button", { name: /web3-crypto\s*\(5\)/i });
    fireEvent.click(web3Filter);

    expect(screen.queryByText("Diklik.co")).not.toBeInTheDocument();
    expect(screen.queryByText("Feedly App")).not.toBeInTheDocument();
    expect(screen.getByText("NinjaPump.ai")).toBeInTheDocument();

    const allFilter = screen.getByRole("button", { name: /all\s*\(7\)/i });
    fireEvent.click(allFilter);

    expect(screen.getByText("Diklik.co")).toBeInTheDocument();
    expect(screen.getByText("Feedly App")).toBeInTheDocument();
    expect(screen.getByText("NinjaPump.ai")).toBeInTheDocument();
  });

  it("opens the ProjectDrawer on card click showing project details", () => {
    renderProjects();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const cardButton = screen.getByRole("button", { name: /view details for ninjapump\.ai/i });
    fireEvent.click(cardButton);

    const drawer = screen.getByRole("dialog");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("aria-modal", "true");

    const drawerScope = within(drawer);
    expect(drawerScope.getByText("NinjaPump.ai")).toBeInTheDocument();
    expect(drawerScope.getByText(/solana trading toolkit and dashboard/i)).toBeInTheDocument();
    expect(drawerScope.getByRole("link", { name: /open in new tab/i })).toHaveAttribute("href", "https://ninjapump.ai");
  });

  it("closes the ProjectDrawer when Escape key is pressed", () => {
    renderProjects();
    const cardButton = screen.getByRole("button", { name: /view details for ninjapump\.ai/i });
    fireEvent.click(cardButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the ProjectDrawer when backdrop is clicked", () => {
    renderProjects();
    const cardButton = screen.getByRole("button", { name: /view details for ninjapump\.ai/i });
    fireEvent.click(cardButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const backdrop = screen.getByTestId("drawer-backdrop");
    fireEvent.click(backdrop);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the unified inline cyber callout linking to /contact", () => {
    renderProjects();
    expect(screen.getByText(/have a project in orbit\?/i)).toBeInTheDocument();
    const contactLink = screen.getByRole("link", { name: /initiate contact/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
  });
});
