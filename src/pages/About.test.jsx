import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext.jsx";
import About from "./About";

describe("About Page - Warm Light Editorial Profile", () => {
  beforeAll(() => {
    if (!globalThis.IntersectionObserver) {
      globalThis.IntersectionObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
  });

  const renderAbout = () => {
    return render(
      <MemoryRouter>
        <LanguageProvider>
          <About />
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  it("renders the warm editorial header, kicker, human intro, and CV download link", () => {
    renderAbout();
    expect(screen.getByText(/tentang/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/raka fantino/i);
    expect(screen.queryByText(/\/\/\s*PERSONNEL_FILE/i)).not.toBeInTheDocument();

    const cvLink = screen.getByRole("link", { name: /unduh cv \(pdf\)|download cv \(pdf\)/i });
    expect(cvLink).toBeInTheDocument();
    expect(cvLink).toHaveAttribute("href", "/CV_Raka_Fantino.pdf");
    expect(cvLink).toHaveAttribute("download", "CV_Raka_Fantino.pdf");
  });

  it("renders Featured Awards list with all award titles and issuers", () => {
    renderAbout();
    expect(
      screen.getByText("PAN-SEA AI Developer Challenge 2025 - Winner")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Google - The Gemma 3n Impact Challenge (The Ollama Prize)")
    ).toBeInTheDocument();
    expect(screen.getByText("Top 50 Accelerate With Llama")).toBeInTheDocument();

    expect(screen.getByText("AI Singapore")).toBeInTheDocument();
    expect(screen.getByText("Kaggle")).toBeInTheDocument();
    expect(screen.getByText("Meta x Hacktiv8")).toBeInTheDocument();
    expect(screen.queryByText(/\[ PRIZE_VERIFIED \]/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HONOR: FIRST TIER/i)).not.toBeInTheDocument();
  });

  it("renders categorized skills grouped by category", () => {
    renderAbout();
    expect(screen.getByText("Frontend & UI")).toBeInTheDocument();
    expect(screen.getByText("Backend & Runtimes")).toBeInTheDocument();
    expect(screen.getByText("Database & ORM")).toBeInTheDocument();
    expect(screen.getByText("DevOps, Cloud & Automation")).toBeInTheDocument();
    expect(screen.getByText("Web3 & Design")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Hono")).toBeInTheDocument();
    expect(screen.getByText("Neon")).toBeInTheDocument();
    expect(screen.getByText("Drizzle ORM")).toBeInTheDocument();
    expect(screen.getByText("Dokploy")).toBeInTheDocument();
    expect(screen.getByText("Solana")).toBeInTheDocument();
  });

  it("renders authentic company names across tech and operations experiences", () => {
    renderAbout();
    expect(screen.getByText("Meraki Warna Teknologi")).toBeInTheDocument();
    expect(screen.getByText("Loka Mining")).toBeInTheDocument();
    expect(screen.getByText("PT Alga Jaya Solusi")).toBeInTheDocument();
    expect(screen.getByText("Pemerintah Kota Pekanbaru")).toBeInTheDocument();
    expect(screen.getByText("PT Mitra Cahaya Sentosa")).toBeInTheDocument();
  });

  it("strictly contains NO legacy fake corporate company names in experience", () => {
    renderAbout();
    expect(screen.queryByText(/Starbucks/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tesla/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Shopify/i)).not.toBeInTheDocument();
  });

  it("renders SubpageNav back link to '/' with Indonesian default text", () => {
    renderAbout();
    const backLink = screen.getByRole("link", { name: /kembali ke pulau|back to island/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("triggers exit roll-up when user clicks back to island", () => {
    renderAbout();
    const backLink = screen.getByRole("link", { name: /kembali ke pulau|back to island/i });
    fireEvent.click(backLink);

    const rollUpNode = document.querySelector(".animate-parchment-rollup");
    expect(rollUpNode).toBeInTheDocument();
  });

  it("renders the warm editorial contact callout linking to /contact with ParchmentRibbon tab", () => {
    renderAbout();
    const contactLinks = screen.getAllByRole("link", { name: /hubungi saya|kontak|contact/i });
    expect(contactLinks.length).toBeGreaterThan(0);
    const linkToContact = contactLinks.find((el) => el.getAttribute("href") === "/contact");
    expect(linkToContact).toBeDefined();
    expect(linkToContact).toHaveAttribute("href", "/contact");
    expect(linkToContact).toHaveAttribute("data-testid", "parchment-ribbon");
    expect(linkToContact).toHaveAttribute("data-variant", "tab");
  });
});
