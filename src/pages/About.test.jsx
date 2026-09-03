import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import About from "./About";

describe("About Page - Credibility Timeline & System Profile", () => {
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
        <About />
      </MemoryRouter>
    );
  };

  it("renders the personnel file cyber header and intro", () => {
    renderAbout();
    expect(screen.getByText(/\/\/\s*PERSONNEL_FILE/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello,\s*I'm/i)).toBeInTheDocument();
    expect(screen.getByText(/Raka/i)).toBeInTheDocument();
  });

  it("renders Featured Awards banner with all award titles and issuers", () => {
    renderAbout();
    expect(
      screen.getByText("PAN-SEA AI Developer Challenge 2025 - Winner")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Google - The Gemma 3n Impact Challenge (The Ollama Prize)")
    ).toBeInTheDocument();
    expect(screen.getByText("Basic Web Programming")).toBeInTheDocument();

    expect(screen.getByText("AI Singapore")).toBeInTheDocument();
    expect(screen.getByText("Kaggle")).toBeInTheDocument();
    expect(screen.getByText("Dicoding")).toBeInTheDocument();
  });

  it("renders categorized skills grouped by type", () => {
    renderAbout();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("renders authentic company names across tech and operations experiences", () => {
    renderAbout();
    expect(screen.getByText("Meraki Warna Teknologi")).toBeInTheDocument();
    expect(screen.getByText("Loka Mining")).toBeInTheDocument();
    expect(screen.getByText("PT Alga Jaya Solusi")).toBeInTheDocument();
    expect(screen.getByText("Pemerintah Kota Pekanbaru")).toBeInTheDocument();
    expect(screen.getByText("PT Mitra Cahaya Sentosa")).toBeInTheDocument();
  });

  it("strictly contains NO legacy fake corporate company names", () => {
    renderAbout();
    expect(screen.queryByText(/Starbucks/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tesla/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Shopify/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Meta/i)).not.toBeInTheDocument();
  });

  it("renders the cyber contact callout linking to /contact", () => {
    renderAbout();
    const contactLinks = screen.getAllByRole("link", { name: /initiate contact|contact/i });
    expect(contactLinks.length).toBeGreaterThan(0);
    const linkToContact = contactLinks.find((el) => el.getAttribute("href") === "/contact");
    expect(linkToContact).toBeDefined();
    expect(linkToContact).toHaveAttribute("href", "/contact");
  });
});
