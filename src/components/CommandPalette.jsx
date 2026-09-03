import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * CommandPalette - Cyber Terminal Quick Launcher
 *
 * Supported features:
 * - Triggered via Cmd+K / Ctrl+K global shortcut or Navbar launcher button.
 * - Navigation: Home, About, Projects, Contact via React Router useNavigate.
 * - External: GitHub, LinkedIn via window.open.
 * - Quick actions: Copy Email (to clipboard), View CV on GitHub.
 * - Accessible focus trap: Tab cycles through focusable elements inside dialog.
 * - Keyboard navigation: ArrowUp/ArrowDown wrap active index, Enter executes.
 * - Keyboard isolation: preventDefault on Arrow keys, Enter, Escape so background
 *   listeners (and 3D Canvas) do not react while palette is active.
 * - Telemetry contract: sets document.body.dataset.paletteOpen to "true"/"false".
 */
const CommandPalette = ({ open, onClose, onOpen }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const wasOpenRef = useRef(false);

  // Command definitions
  const commands = useMemo(
    () => [
      {
        id: "nav-home",
        label: "Home",
        category: "NAVIGATE",
        hint: "/",
        action: () => navigate("/"),
      },
      {
        id: "nav-about",
        label: "About",
        category: "NAVIGATE",
        hint: "/about",
        action: () => navigate("/about"),
      },
      {
        id: "nav-projects",
        label: "Projects",
        category: "NAVIGATE",
        hint: "/projects",
        action: () => navigate("/projects"),
      },
      {
        id: "nav-contact",
        label: "Contact",
        category: "NAVIGATE",
        hint: "/contact",
        action: () => navigate("/contact"),
      },
      {
        id: "ext-github",
        label: "GitHub",
        category: "EXTERNAL",
        hint: "github.com/rakafantino",
        action: () => window.open("https://github.com/rakafantino", "_blank", "noopener,noreferrer"),
      },
      {
        id: "ext-linkedin",
        label: "LinkedIn",
        category: "EXTERNAL",
        hint: "linkedin.com/in/rakafantino",
        action: () => window.open("https://www.linkedin.com/in/rakafantino", "_blank", "noopener,noreferrer"),
      },
      {
        id: "act-copy-email",
        label: "Copy Email",
        category: "ACTION",
        hint: "rakafantinoo@gmail.com",
        action: async () => {
          try {
            await navigator.clipboard?.writeText("rakafantinoo@gmail.com");
          } catch (err) {
            console.error("Failed to copy email to clipboard:", err);
          }
        },
      },
      {
        id: "act-view-cv",
        label: "View CV on GitHub",
        category: "ACTION",
        hint: "GitHub Profile / CV",
        action: () => window.open("https://github.com/rakafantino", "_blank", "noopener,noreferrer"),
      },
    ],
    [navigate]
  );

  // Filter commands by query string
  const filteredCommands = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(trimmed) ||
        cmd.category.toLowerCase().includes(trimmed) ||
        cmd.hint.toLowerCase().includes(trimmed)
    );
  }, [commands, query]);

  // Keep active index in bounds when filtered list changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Global keydown listener for Cmd+K / Ctrl+K toggle
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (open) {
          onClose?.();
        } else {
          onOpen?.();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open, onClose, onOpen]);

  // Sync dataset.paletteOpen to document.body for Canvas / background isolation
  useEffect(() => {
    if (open) {
      document.body.dataset.paletteOpen = "true";
      inputRef.current?.focus();
      wasOpenRef.current = true;
      return () => {
        document.body.dataset.paletteOpen = "false";
      };
    }

    document.body.dataset.paletteOpen = "false";
    setQuery("");
    setActiveIndex(0);

    // Restore keyboard focus to the opener button on close (mirrors the
    // ProjectDrawer focus-restore pattern). Skipped on initial mount and
    // guarded: the trigger may be absent (unit tests / pure Cmd+K usage).
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      document.querySelector('[aria-label="Open command palette"]')?.focus();
    }
  }, [open]);

  // Handle keyboard navigation inside the palette
  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose?.();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      if (filteredCommands.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      if (filteredCommands.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const activeCmd = filteredCommands[activeIndex];
      if (activeCmd) {
        activeCmd.action();
        onClose?.();
      }
      return;
    }

    // Accessible Focus Trap on Tab
    if (e.key === "Tab" && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusable = Array.from(focusableElements).filter(
        (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
      );

      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        data-testid="command-palette-backdrop"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => onClose?.()}
        aria-hidden="true"
      />

      {/* Modal Dialog Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg mt-[10vh] bg-[#1B150E]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans backdrop-blur-md text-cream"
      >
        {/* Header / Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <span className="text-copper text-sm select-none" aria-hidden="true">
            {">"}
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-list"
            aria-activedescendant={filteredCommands[activeIndex]?.id}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands (e.g. Projects, Copy Email)..."
            className="flex-1 bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close palette"
            className="text-xs text-cream/50 hover:text-cream border border-white/10 hover:border-white/20 rounded px-1.5 py-0.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-copper font-mono"
          >
            ESC
          </button>
        </div>

        {/* Command List / Results */}
        <div
          id="command-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-72 overflow-y-auto p-2 divide-y divide-white/5"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-cream/40 font-mono">
              NO MATCHING COMMANDS
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isActive = idx === activeIndex;
              const formattedIndex = `[${String(idx + 1).padStart(2, "0")}]`;

              return (
                <div
                  key={cmd.id}
                  id={cmd.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    cmd.action();
                    onClose?.();
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                    isActive
                      ? "bg-white/10 text-copper font-medium"
                      : "text-cream/70 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono text-cream/40 select-none">
                      {formattedIndex}
                    </span>
                    <span className={isActive ? "text-cream font-semibold" : "text-cream/80"}>
                      {cmd.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cream/50">
                      {cmd.category}
                    </span>
                    <span className="text-[10px] font-mono text-cream/30 hidden sm:inline">
                      {cmd.hint}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Telemetry hints */}
        <div className="flex items-center justify-between px-4 py-2 text-[10px] text-cream/40 border-t border-white/10 bg-black/20 select-none font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-copper/80">Raka Fantino</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
