import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ZONE_DATA = {
  1: {
    eyebrow: "Diorama Pulau",
    title: "Raka Fantino",
    actionLabel: "Lihat Proyek",
    to: "/projects",
  },
  2: {
    eyebrow: "Kabin Kerja",
    title: "Tentang Saya",
    actionLabel: "Buka Halaman",
    to: "/about",
  },
  3: {
    eyebrow: "Observatorium",
    title: "Riset & Awards",
    actionLabel: "Lihat Awards",
    to: "/about",
  },
  4: {
    eyebrow: "Reaktor Mesin",
    title: "Proyek & Lab",
    actionLabel: "Buka Proyek",
    to: "/projects",
  },
  5: {
    eyebrow: "Mercusuar",
    title: "Kontak",
    actionLabel: "Kirim Pesan",
    to: "/contact",
  },
};

/**
 * MobileSmartDock
 * Ultra-compact unified dock for mobile viewports.
 * Features an unmissable call-to-action banner that invites users to tap and enter.
 */
const MobileSmartDock = ({ currentStage, onSelectStage, isCameraMoving }) => {
  const currentZone = ZONE_DATA[currentStage] || ZONE_DATA[1];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 pb-[max(0.6rem,env(safe-area-inset-bottom))] px-3 pointer-events-auto select-none">
      <div className="w-full max-w-md mx-auto flex flex-col gap-1.5 p-2 rounded-2xl border border-island-border/90 bg-[#16120D]/95 backdrop-blur-md shadow-2xl shadow-black/90">
        {/* Row 1: High-Affordance Tap Banner */}
        <Link
          to={currentZone.to}
          aria-label={`Buka ${currentZone.title}`}
          className={`flex items-center justify-between px-3.5 py-2 rounded-xl border border-island-border/70 bg-gradient-to-r from-island-dark/90 to-island-dusk/90 active:scale-98 hover:border-island-copper transition-all duration-200 group ${
            isCameraMoving ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="flex flex-col truncate pr-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-copper font-semibold">
              {currentZone.eyebrow}
            </span>
            <span className="font-serif text-sm font-bold text-cream truncate">
              {currentZone.title}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-copper hover:bg-copper-deep text-cream text-xs font-semibold shadow-md shadow-black/30 shrink-0">
            <span>{currentZone.actionLabel}</span>
            <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </Link>

        {/* Row 2: Carousel Navigation (Prev / Counter / Next) */}
        <nav aria-label="Navigasi zona mobile" className="flex items-center justify-between gap-2 w-full pt-0.5">
          <button
            type="button"
            onClick={() => onSelectStage(currentStage === 1 ? 5 : currentStage - 1)}
            aria-label="Zona Sebelumnya"
            className="flex-1 py-1.5 text-xs font-sans rounded-lg bg-island-border/30 hover:bg-island-border/60 text-cream/75 flex items-center justify-center gap-1 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Sebelumnya</span>
          </button>

          <div className="px-3 py-1 rounded-md bg-black/40 border border-island-border/50 font-mono text-xs flex items-center gap-1.5 shrink-0">
            <span className="text-copper font-bold">{`0${currentStage}`}</span>
            <span className="text-cream/30">/</span>
            <span className="text-cream/60">05</span>
          </div>

          <button
            type="button"
            onClick={() => onSelectStage(currentStage === 5 ? 1 : currentStage + 1)}
            aria-label="Zona Selanjutnya"
            className="flex-1 py-1.5 text-xs font-sans rounded-lg bg-island-border/30 hover:bg-island-border/60 text-cream/75 flex items-center justify-center gap-1 transition-colors"
          >
            <span>Selanjutnya</span>
            <span aria-hidden="true">→</span>
          </button>
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
