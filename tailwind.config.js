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
        "cyber-black": "#0A0B0E",
        "cyber-dark": "#12141A",
        "cyber-slate": "#1A1D26",
        "cyber-border": "#262A36",
        "cyber-cyan": "#00F0FF",
        "cyber-amber": "#FFB800",
        cyber: {
          black: "#0A0B0E",
          dark: "#12141A",
          slate: "#1A1D26",
          border: "#262A36",
          cyan: "#00F0FF",
          amber: "#FFB800",
        },
      },
      fontFamily: {
        worksans: ["Work Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Plus Jakarta Sans", "Work Sans", "sans-serif"],
      },
      boxShadow: {
        card: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
