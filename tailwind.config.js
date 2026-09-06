/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          200: "#D5DAE1",
        },
        black: {
          DEFAULT: "#000",
          500: "#1D2235",
        },
        blue: {
          500: "#2b77e7",
        },
        /* Warm "Workshop Island" palette — replaces cyber cyan/dark tokens */
        "island-black": "#17130E",
        "island-dark": "#211B14",
        "island-dusk": "#2A2119",
        "island-border": "#3A2F24",
        "island-copper": "#C56B3B",
        "island-sand": "#E7D9BF",
        /* Light editorial page tokens */
        cream: {
          DEFAULT: "#FAF5EC",
          deep: "#F3EADB",
        },
        ink: {
          DEFAULT: "#241D15",
          soft: "#4A4034",
          faint: "#7A6E5E",
        },
        copper: {
          DEFAULT: "#B4552D",
          deep: "#8F3E1F",
        },
        parchment: {
          DEFAULT: "#ECDDC0",
          light: "#F9F1E2",
          deep: "#DFCCA8",
          dark: "#D4BC90",
          border: "#8C6A43",
          shadow: "#2A1B0E",
        },
        walnut: {
          DEFAULT: "#241407",
          sepia: "#4A301A",
          faint: "#7A5328",
        },
        wax: {
          DEFAULT: "#A83226",
          crimson: "#8C271E",
          dark: "#5C140E",
          gold: "#C27D38",
        },
        brass: {
          DEFAULT: "#B88746",
          light: "#E6C687",
          dark: "#78531E",
          shadow: "#3A2514",
        },
        wood: {
          DEFAULT: "#140C06",
          desk: "#1A0F08",
          grain: "#24150A",
        },
      },
      fontFamily: {
        worksans: ["Work Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Plus Jakarta Sans", "Work Sans", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};