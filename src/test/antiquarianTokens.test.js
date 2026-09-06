import { describe, it, expect } from "vitest";
import tailwindConfig from "../../tailwind.config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Antiquarian Design Tokens & CSS Utilities", () => {
  it("defines formal parchment color tokens in tailwind.config.js", () => {
    const { colors } = tailwindConfig.theme.extend;
    expect(colors.parchment).toBeDefined();
    expect(colors.parchment.DEFAULT).toBe("#ECDDC0");
    expect(colors.parchment.light).toBe("#F9F1E2");
    expect(colors.parchment.deep).toBe("#DFCCA8");
    expect(colors.parchment.dark).toBe("#D4BC90");
    expect(colors.parchment.border).toBe("#8C6A43");
    expect(colors.parchment.shadow).toBe("#2A1B0E");
  });

  it("defines formal walnut, wax, brass, and wood tokens in tailwind.config.js", () => {
    const { colors } = tailwindConfig.theme.extend;
    expect(colors.walnut).toEqual({
      DEFAULT: "#241407",
      sepia: "#4A301A",
      faint: "#7A5328",
    });

    expect(colors.wax).toEqual({
      DEFAULT: "#A83226",
      crimson: "#8C271E",
      dark: "#5C140E",
      gold: "#C27D38",
    });

    expect(colors.brass).toEqual({
      DEFAULT: "#B88746",
      light: "#E6C687",
      dark: "#78531E",
      shadow: "#3A2514",
    });

    expect(colors.wood).toEqual({
      DEFAULT: "#140C06",
      desk: "#1A0F08",
      grain: "#24150A",
    });
  });

  it("preserves legacy and editorial tokens for backwards compatibility", () => {
    const { colors } = tailwindConfig.theme.extend;
    expect(colors["island-black"]).toBe("#17130E");
    expect(colors["island-dark"]).toBe("#211B14");
    expect(colors["island-copper"]).toBe("#C56B3B");
    expect(colors.cream.DEFAULT).toBe("#FAF5EC");
    expect(colors.ink.DEFAULT).toBe("#241D15");
    expect(colors.copper.DEFAULT).toBe("#B4552D");
  });

  it("includes .bg-cartographer-desk and parchment keyframes in src/index.css", () => {
    const cssPath = path.resolve(__dirname, "../index.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    expect(cssContent).toContain(".bg-cartographer-desk");
    expect(cssContent).toContain("@keyframes parchmentRollUp");
    expect(cssContent).toContain(".animate-parchment-rollup");
    expect(cssContent).toContain(".animate-parchment-content-exit");
    expect(cssContent).toContain(".animate-parchment-top-roll-rise");
    expect(cssContent).toContain("--parchment: #ecddc0");
    expect(cssContent).toContain("--walnut: #241407");
    expect(cssContent).toContain("--wax: #a83226");
    expect(cssContent).toContain("--brass: #b88746");
    expect(cssContent).toContain("--wood: #140c06");
  });
});
