import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import AudioController from "./AudioController";

/**
 * Navbar - Clean Architectural Header
 * Replaces the floating capsule dock with an elegant, grounded header
 * matching the warm editorial craftsmanship theme.
 */
const Navbar = ({ onOpenCommandPalette }) => {
  const linkClass = ({ isActive }) =>
    `text-xs sm:text-sm font-sans tracking-wide transition-colors py-1 relative ${
      isActive
        ? "text-island-sand font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-island-copper"
        : "text-cream/65 hover:text-cream"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-island-border/40 bg-island-black/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <NavLink
          to="/"
          className="flex flex-col group focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper rounded pr-2"
        >
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-cream group-hover:text-island-sand transition-colors leading-tight">
            Raka Fantino
          </span>
          <span className="text-[10px] font-sans text-cream/50 tracking-wider">
            Frontend &amp; Fullstack Engineer
          </span>
        </NavLink>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-sans" aria-label="Navigasi Utama">
          <NavLink to="/about" className={linkClass}>
            Tentang
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            Proyek
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Kontak
          </NavLink>
        </nav>

        {/* Action & Status Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-sans text-cream/60 px-2.5 py-1 rounded-full bg-island-dark/60 border border-island-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>Tersedia untuk kerja</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenCommandPalette?.()}
            aria-label="Open command palette"
            title="Buka Navigasi Cepat (Cmd+K)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-island-border/70 bg-island-dark/80 text-cream/70 hover:text-cream hover:border-island-copper/60 text-xs font-mono transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
          >
            <span className="text-[10px] text-cream/40">CMD</span>
            <span>⌘K</span>
          </button>

          <AudioController />
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  onOpenCommandPalette: PropTypes.func,
};

export default Navbar;
