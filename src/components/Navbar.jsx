import { NavLink } from "react-router-dom";
import AudioController from "./AudioController";

/**
 * Navbar - Floating Cyber Dock with Status Telemetry
 * Fixed floating dock layout per Cyber-Industrial aesthetic.
 *
 * Mobile navigation note: Primary nav links are hidden below md viewport
 * (hidden md:flex) because mobile navigation routes through Homeinfo stage cards
 * and the Command Palette (Task 8).
 */
const Navbar = ({ onOpenCommandPalette }) => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(56rem,calc(100vw-2rem))]">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-cyber-border bg-cyber-dark/70 backdrop-blur-md px-5 py-2.5 shadow-lg shadow-black/20">
        {/* Brand Monogram */}
        <NavLink
          to="/"
          className="font-mono font-bold text-cyber-cyan tracking-wider flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyber-cyan rounded transition-opacity hover:opacity-90"
        >
          <span>RF</span>
          <span className="text-slate-500 font-normal text-xs">{"// 01"}</span>
        </NavLink>

        {/* Primary Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-cyber-cyan border-b border-cyber-cyan pb-0.5 font-semibold"
                : "text-slate-400 hover:text-cyber-cyan transition-colors"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "text-cyber-cyan border-b border-cyber-cyan pb-0.5 font-semibold"
                : "text-slate-400 hover:text-cyber-cyan transition-colors"
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-cyber-cyan border-b border-cyber-cyan pb-0.5 font-semibold"
                : "text-slate-400 hover:text-cyber-cyan transition-colors"
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Controls: Telemetry Pill + CmdK + Audio */}
        <div className="flex items-center gap-3">
          {/* Status Telemetry Badge */}
          <span className="telemetry-badge hidden md:inline-flex items-center gap-2 text-slate-300 text-[11px]">
            <span
              className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shrink-0"
              aria-hidden="true"
            />
            <span>{"STATUS: OPERATIONAL // AVAILABLE FOR WORK"}</span>
          </span>

          {/* Quick Launcher / Command Palette Trigger */}
          <button
            type="button"
            onClick={() => onOpenCommandPalette?.()}
            aria-label="Open command palette"
            className="hidden sm:inline-flex items-center gap-1 font-mono text-xs border border-cyber-border rounded-md px-2 py-1 text-slate-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyber-cyan"
          >
            <span className="text-[10px] text-slate-500">CMD</span>
            <span>⌘K</span>
          </button>

          {/* Procedural Audio Controller */}
          <AudioController />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
