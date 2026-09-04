import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ZONE_DATA = {
  1: {
    eyebrow: "Raka Fantino",
    title: "Fullstack & Web3",
    actionLabel: "Lihat Proyek",
    to: "/projects",
  },
  2: {
    eyebrow: "Kabin Kerja",
    title: "Tentang Saya",
    actionLabel: "Buka",
    to: "/about",
  },
  3: {
    eyebrow: "Observatorium",
    title: "Riset & Awards",
    actionLabel: "Buka",
    to: "/about",
  },
  4: {
    eyebrow: "Reaktor Mesin",
    title: "Proyek & Lab",
    actionLabel: "Buka",
    to: "/projects",
  },
  5: {
    eyebrow: "Mercusuar",
    title: "Kontak",
    actionLabel: "Buka",
    to: "/contact",
  },
};

const ZONE_BUTTONS = [
  { stage: 1, name: "Awal" },
  { stage: 2, name: "Tentang" },
  { stage: 3, name: "Riset" },
  { stage: 4, name: "Proyek" },
  { stage: 5, name: "Kontak" },
];

/**
 * MobileSmartDock
 * Ultra-compact unified dock for mobile viewports.
 * Combines a 1-line interactive micro-pill and horizontal zone selector,
 * using less than 12% of vertical screen real estate.
 */
const MobileSmartDock = ({ currentStage, onSelectStage, isCameraMoving }) => {
  const currentZone = ZONE_DATA[currentStage] || ZONE_DATA[1];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 pb-[max(0.6rem,env(safe-area-inset-bottom))] px-3 pointer-events-auto select-none">
      <div className="w-full max-w-md mx-auto flex flex-col gap-1.5 p-2 rounded-2xl border border-island-border/90 bg-[#16120D]/95 backdrop-blur-md shadow-2xl shadow-black/90">
        {/* Row 1: Interactive 1-Line Micro-Pill */}
        <Link
          to={currentZone.to}
          aria-label={`Buka ${currentZone.title}`}
          className={`flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-island-border/60 bg-island-dark/80 hover:bg-island-dark hover:border-island-copper/60 transition-all duration-300 ${
            isCameraMoving ? "opacity-30 scale-98" : "opacity-100 scale-100"
          }`}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-copper shrink-0">
              {currentZone.eyebrow}
            </span>
            <span className="text-island-border/80 text-xs">·</span>
            <span className="font-serif text-xs font-semibold text-cream truncate">
              {currentZone.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-copper text-xs font-medium pl-1">
            <span className="text-[11px] font-sans">{currentZone.actionLabel}</span>
            <span aria-hidden="true" className="text-xs">→</span>
          </div>
        </Link>

        {/* Row 2: Compact 5-Zone Button Selector */}
        <nav aria-label="Navigasi zona mobile" className="flex items-center justify-between gap-1 w-full">
          {ZONE_BUTTONS.map((btn) => {
            const isActive = currentStage === btn.stage;
            return (
              <button
                key={btn.stage}
                type="button"
                onClick={() => onSelectStage(btn.stage)}
                aria-current={isActive ? "step" : undefined}
                className={`flex-1 py-1 text-[11px] font-sans rounded-lg transition-all duration-200 text-center ${
                  isActive
                    ? "bg-copper text-cream font-bold shadow-md shadow-black/40"
                    : "text-cream/60 hover:text-cream hover:bg-island-border/30"
                }`}
              >
                {btn.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

MobileSmartDock.propTypes = {
  currentStage: PropTypes.number.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  isCameraMoving: PropTypes.bool,
};

export default MobileSmartDock;
