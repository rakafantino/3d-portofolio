import { NavLink } from "react-router-dom";
import AudioController from "./AudioController";

/**
 * Floating dark-glass navigation dock.
 * Dark glass stays intentional on both the dark hero and light content pages.
 * No terminal costume: brand is a plain serif wordmark, links are human labels,
 * ⌘K is the only "system" affordance (functional, not decorative).
 *
 * Mobile: links hidden below md — primary mobile nav flows through the island
 * zones (Home) and the ⌘K palette.
 */
const Navbar = ({ onOpenCommandPalette }) => {
  const linkClass = ({ isActive }) =>
    `text-[0.95rem] transition-colors pb-0.5 border-b ${
      isActive
        ? "text-island-sand border-island-copper font-medium"
        : "text-cream/60 border-transparent hover:text-cream hover:border-island-copper/40"
    }`;

  return (
    <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[min(56rem,calc(100vw-1.25rem))] px-1.5">
      <div className="flex items-center justify-between gap-3 sm:gap-5 rounded-full border border-white/10 bg-[#1B150E]/80 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-lg shadow-black/30">
        {/* Wordmark */}
        <NavLink
          to="/"
          className="flex items-baseline gap-2 group focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper rounded"
        >
          <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-cream leading-none group-hover:text-island-sand transition-colors">
            Raka Fantino
          </span>
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.2em] text-copper/80">
            Riau · ID
          </span>
        </NavLink>

        {/* Primary links */}
        <nav className="hidden md:flex items-center gap-6 font-sans" aria-label="Primary">
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden lg:inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cream/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7BC87F]" aria-hidden="true" />
            Available for work
          </span>

          <button
            type="button"
            onClick={() => onOpenCommandPalette?.()}
            aria-label="Open quick navigation"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-[11px] font-mono text-cream/60 hover:text-cream hover:border-white/25 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
          >
            <span className="hidden xs:inline sm:inline">⌘K</span>
            <span className="sm:hidden">⌘</span>
          </button>

          <AudioController />
        </div>
      </div>
    </header>
  );
};

export default Navbar;