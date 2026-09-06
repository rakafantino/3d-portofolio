import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext.jsx";
import Projects from "./Projects";

describe("Projects Page - Warm Editorial Bento Grid & Project Drawer", () => {
  const renderProjects = () => {
    return render(
      <MemoryRouter>
        <LanguageProvider>
          <Projects />
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  it("renders the warm editorial header and human kicker", () => {
    renderProjects();
    expect(screen.getByText("Portofolio")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/proyek pilihan|featured projects/i);
    expect(screen.queryByText(/\/\/ PROJECT_LOG/i)).not.toBeInTheDocument();
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

  it("renders category filter pills with display labels and live counts from data", () => {
    renderProjects();
    expect(screen.getByRole("button", { name: /semua\s*\(7\)|all\s*\(7\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /web3 & crypto\s*\(5\)/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fullstack & saas\s*\(2\)/i })).toBeInTheDocument();
  });

  it("filters projects when category pills are clicked and restores when ALL is clicked", () => {
    renderProjects();
    expect(screen.getByText("Diklik.co")).toBeInTheDocument();
    expect(screen.getByText("NinjaPump.ai")).toBeInTheDocument();

    const web3Filter = screen.getByRole("button", { name: /web3 & crypto\s*\(5\)/i });
    fireEvent.click(web3Filter);

    expect(screen.queryByText("Diklik.co")).not.toBeInTheDocument();
    expect(screen.queryByText("Feedly App")).not.toBeInTheDocument();
    expect(screen.getByText("NinjaPump.ai")).toBeInTheDocument();

    const allFilter = screen.getByRole("button", { name: /semua\s*\(7\)|all\s*\(7\)/i });
    fireEvent.click(allFilter);

    expect(screen.getByText("Diklik.co")).toBeInTheDocument();
    expect(screen.getByText("Feedly App")).toBeInTheDocument();
    expect(screen.getByText("NinjaPump.ai")).toBeInTheDocument();
  });

  it("opens the ProjectDrawer on card click showing project details", () => {
    renderProjects();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const cardButton = screen.getByRole("button", { name: /detail proyek ninjapump\.ai|view details for ninjapump\.ai/i });
    fireEvent.click(cardButton);

    const drawer = screen.getByRole("dialog");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("aria-modal", "true");

    const drawerScope = within(drawer);
    expect(drawerScope.getByText("NinjaPump.ai")).toBeInTheDocument();
    expect(
      drawerScope.getByText(
        /toolkit dan dashboard trading solana|solana trading toolkit and dashboard/i
      )
    ).toBeInTheDocument();
    expect(drawerScope.getByRole("link", { name: /buka tautan|open in new tab/i })).toHaveAttribute("href", "https://ninjapump.ai");
  });

  it("closes the ProjectDrawer when Escape key is pressed", () => {
    renderProjects();
    const cardButton = screen.getByRole("button", { name: /detail proyek ninjapump\.ai|view details for ninjapump\.ai/i });
    fireEvent.click(cardButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the ProjectDrawer when backdrop is clicked", () => {
    renderProjects();
    const cardButton = screen.getByRole("button", { name: /detail proyek ninjapump\.ai|view details for ninjapump\.ai/i });
    fireEvent.click(cardButton);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const backdrop = screen.getByTestId("drawer-backdrop");
    fireEvent.click(backdrop);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders SubpageNav back link to '/' and does NOT render a header with nav link 'Tentang'", () => {
    renderProjects();

    const backLink = screen.getByRole("link", { name: /kembali ke pulau|back to island/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");

    expect(screen.queryByRole("link", { name: /^Tentang$/i })).not.toBeInTheDocument();
  });

  it("triggers exit roll-up when user clicks back to island", () => {
    renderProjects();
    const backLink = screen.getByRole("link", { name: /kembali ke pulau|back to island/i });
    fireEvent.click(backLink);

    const rollUpNode = document.querySelector(".animate-parchment-rollup");
    expect(rollUpNode).toBeInTheDocument();
  });

  it("renders the warm editorial callout linking to /contact with ParchmentRibbon tab", () => {
    renderProjects();
    expect(screen.getByText(/punya ide seru yang pengen diwujudin\?|punya proyek atau ide kolaborasi\?|have an exciting idea to bring to life\?|have a project or collaboration in mind\?/i)).toBeInTheDocument();
    const contactLink = screen.getByRole("link", { name: /hubungi saya|kontak/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(contactLink).toHaveAttribute("data-testid", "parchment-ribbon");
    expect(contactLink).toHaveAttribute("data-variant", "tab");
  });
});
