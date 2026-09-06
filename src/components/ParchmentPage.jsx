import PropTypes from "prop-types";

/**
 * ParchmentPage
 * Enormous full-page unrolling ancient parchment scroll container.
 * Frames inner subpages (/about, /projects, /contact) against a deep walnut
 * leather cartographer table, unrolling downwards majestically.
 */
const ParchmentPage = ({
  children,
  className = "",
  isOpen = true,
  onRollComplete,
}) => {
  const handleAnimationEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (
      !e.animationName ||
      e.animationName === "parchmentUnroll" ||
      e.animationName === "parchmentRollUp"
    ) {
      if (typeof onRollComplete === "function") {
        onRollComplete(isOpen);
      }
    }
  };

  return (
    <div
      data-testid="parchment-page-root"
      className="min-h-[100dvh] w-full relative text-[#241407] selection:bg-[#c56b3b]/30 selection:text-[#180d04] overflow-x-clip"
      style={{
        backgroundColor: "#140C06",
        backgroundImage: `
          radial-gradient(ellipse at 50% 15%, rgba(68, 42, 22, 0.45) 0%, rgba(20, 12, 6, 0.95) 75%, #0B0603 100%),
          radial-gradient(circle at 10% 80%, rgba(55, 30, 12, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(55, 30, 12, 0.3) 0%, transparent 50%)
        `,
      }}
    >
      {/* Paper Fiber SVG Filter for natural papyrus irregularities */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
        <defs>
          <filter id="pagePaperFiber" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.035" numOctaves="4" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.35
                      0 0 0 0 0.24
                      0 0 0 0 0.12
                      0 0 0 0 0.28 0"
              result="coloredNoise"
            />
            <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Main Parchment Scroll Wrapper with generous mobile top clearance */}
      <div className={`relative w-full max-w-5xl mx-auto pt-28 sm:pt-32 md:pt-36 pb-20 px-3 sm:px-6 md:px-8 ${className}`}>
        {/* Top Carved Wooden Scroll Roller */}
        <div
          data-testid="scroll-roller-top"
          className={`relative w-full h-7 sm:h-9 z-30 -mb-2 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] ${
            isOpen ? "animate-parchment-top-roll" : "animate-parchment-top-roll-rise"
          }`}
        >
          <svg
            viewBox="0 0 800 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block overflow-visible"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pageScrollRollWoodTop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4A2E16" />
                <stop offset="25%" stopColor="#7E5632" />
                <stop offset="50%" stopColor="#BA8E5C" />
                <stop offset="75%" stopColor="#6C4524" />
                <stop offset="100%" stopColor="#321B0B" />
              </linearGradient>

              <linearGradient id="pageBrassCapLeft" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#4A3414" />
                <stop offset="40%" stopColor="#C99C48" />
                <stop offset="70%" stopColor="#E6C87C" />
                <stop offset="100%" stopColor="#5D4019" />
              </linearGradient>

              <linearGradient id="pageBrassCapRight" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#5D4019" />
                <stop offset="30%" stopColor="#E6C87C" />
                <stop offset="60%" stopColor="#C99C48" />
                <stop offset="100%" stopColor="#4A3414" />
              </linearGradient>
            </defs>

            {/* Left Brass Knob Cap */}
            <ellipse cx="14" cy="16" rx="12" ry="14" fill="url(#pageBrassCapLeft)" stroke="#2F1C0B" strokeWidth="1.5" />
            <circle cx="14" cy="16" r="4" fill="#3B2610" />

            {/* Right Brass Knob Cap */}
            <ellipse cx="786" cy="16" rx="12" ry="14" fill="url(#pageBrassCapRight)" stroke="#2F1C0B" strokeWidth="1.5" />
            <circle cx="786" cy="16" r="4" fill="#3B2610" />

            {/* Main Cylindrical Roller Body */}
            <rect
              x="14"
              y="3"
              width="772"
              height="26"
              rx="4"
              fill="url(#pageScrollRollWoodTop)"
              stroke="#2B1608"
              strokeWidth="1.5"
            />

            {/* Highlight Gleam */}
            <path
              d="M 24,11 L 776,11"
              stroke="#F0DEBA"
              strokeWidth="1.2"
              strokeOpacity="0.45"
              strokeLinecap="round"
            />

            {/* Brass Ring Bands */}
            <rect x="42" y="3" width="10" height="26" fill="url(#pageBrassCapLeft)" stroke="#2F1C0B" strokeWidth="0.8" />
            <rect x="748" y="3" width="10" height="26" fill="url(#pageBrassCapRight)" stroke="#2F1C0B" strokeWidth="0.8" />

            {/* Bottom Dark Crease Shadow */}
            <path
              d="M 20,29 C 150,33 650,33 780,29"
              stroke="#180C05"
              strokeWidth="2.5"
              strokeOpacity="0.9"
            />
          </svg>
        </div>

        {/* Unrolling Parchment Body */}
        <div
          data-testid="parchment-page-unroll-body"
          onAnimationEnd={handleAnimationEnd}
          className={`relative z-10 w-full ${
            isOpen ? "animate-parchment-unroll" : "animate-parchment-rollup"
          }`}
        >
          <div className="w-full px-2 sm:px-3">
            <main
              className="relative w-full rounded-[3px] transition-all overflow-hidden filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)]"
              style={{
                backgroundColor: "#F2E5CD",
                backgroundImage: `
                  radial-gradient(ellipse at 50% 0%, rgba(255, 252, 244, 0.9) 0%, rgba(242, 229, 205, 0.4) 60%, rgba(160, 115, 65, 0.25) 90%, rgba(75, 42, 18, 0.45) 100%),
                  radial-gradient(circle at 100% 35%, rgba(120, 75, 35, 0.35) 0%, transparent 45%),
                  radial-gradient(circle at 0% 35%, rgba(120, 75, 35, 0.35) 0%, transparent 45%),
                  radial-gradient(circle at 50% 100%, rgba(95, 55, 25, 0.45) 0%, transparent 65%),
                  linear-gradient(180deg, #FAF1E0 0%, #EFE1C5 25%, #E3D1AE 70%, #D4BD91 100%)
                `,
                boxShadow: `
                  inset 0 24px 28px -12px rgba(45, 22, 9, 0.85),
                  inset 0 -24px 28px -12px rgba(45, 22, 9, 0.8),
                  inset 20px 0 26px -12px rgba(70, 38, 16, 0.7),
                  inset -20px 0 26px -12px rgba(70, 38, 16, 0.7),
                  0 2px 8px rgba(35, 18, 8, 0.6)
                `,
                borderLeft: "2px solid #6E4926",
                borderRight: "2px solid #6E4926",
              }}
            >
              {/* Paper Fiber Texture Layer */}
              <div
                data-testid="page-paper-fiber"
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply overflow-hidden"
                aria-hidden="true"
              >
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <rect width="100%" height="100%" filter="url(#pagePaperFiber)" fill="#E9D7B8" />
                </svg>
              </div>

              {/* Watermarks & Aged Map Stains */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div
                  className="absolute top-12 -right-8 w-44 h-44 rounded-full border-[3px] border-[#69421D]/20 opacity-35 blur-[0.6px]"
                  style={{
                    background: "radial-gradient(circle, transparent 65%, rgba(105, 66, 29, 0.14) 78%, transparent 100%)",
                    transform: "rotate(-15deg)",
                  }}
                />
                <div
                  className="absolute top-1/3 -left-12 w-56 h-36 rounded-[45%_55%_60%_40%/50%_40%_60%_50%] opacity-30 blur-[2px]"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(135, 90, 45, 0.3) 0%, rgba(150, 100, 50, 0.1) 55%, transparent 80%)",
                    transform: "rotate(22deg)",
                  }}
                />
                <div
                  className="absolute bottom-32 -right-10 w-64 h-40 rounded-[55%_45%_40%_60%/45%_60%_40%_55%] opacity-25 blur-[2.5px]"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(120, 75, 35, 0.28) 0%, rgba(140, 90, 45, 0.1) 60%, transparent 85%)",
                    transform: "rotate(-20deg)",
                  }}
                />
              </div>

              {/* Deckled Torn Paper Edges */}
              <svg
                data-testid="page-deckled-left"
                className="absolute left-0 top-0 bottom-0 h-full w-2 sm:w-2.5 pointer-events-none z-10 opacity-75"
                viewBox="0 0 10 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 0,0 L 7,0 Q 2,10 8,20 T 3,40 T 8,60 T 2,80 T 7,100 L 0,100 Z"
                  fill="#4A2E16"
                />
                <path
                  d="M 7,0 Q 2,10 8,20 T 3,40 T 8,60 T 2,80 T 7,100"
                  stroke="#2E180A"
                  strokeWidth="0.8"
                  fill="none"
                />
              </svg>

              <svg
                data-testid="page-deckled-right"
                className="absolute right-0 top-0 bottom-0 h-full w-2 sm:w-2.5 pointer-events-none z-10 opacity-75"
                viewBox="0 0 10 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M 10,0 L 3,0 Q 8,10 2,20 T 7,40 T 2,60 T 8,80 T 3,100 L 10,100 Z"
                  fill="#4A2E16"
                />
                <path
                  d="M 3,0 Q 8,10 2,20 T 7,40 T 2,60 T 8,80 T 3,100"
                  stroke="#2E180A"
                  strokeWidth="0.8"
                  fill="none"
                />
              </svg>

              {/* Edge Burn Shading */}
              <div
                className="absolute left-0 top-0 bottom-0 w-2 sm:w-3 pointer-events-none opacity-60 mix-blend-multiply"
                style={{
                  backgroundImage: "linear-gradient(90deg, #381E09 0%, rgba(89, 60, 32, 0.6) 45%, transparent 100%)",
                }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 w-2 sm:w-3 pointer-events-none opacity-60 mix-blend-multiply"
                style={{
                  backgroundImage: "linear-gradient(270deg, #381E09 0%, rgba(89, 60, 32, 0.6) 45%, transparent 100%)",
                }}
              />

              {/* Parchment Inner Content */}
              <div
                data-testid="parchment-page-content-container"
                className={`relative z-10 px-5 sm:px-10 md:px-14 pt-14 pb-10 sm:py-12 md:py-16 text-[#241407] ${
                  isOpen ? "animate-parchment-content" : "animate-parchment-content-exit"
                }`}
              >
                {children}
              </div>
            </main>
          </div>

          {/* Bottom Carved Wooden Scroll Roller */}
          <div
            data-testid="scroll-roller-bottom"
            className="relative w-full h-7 sm:h-9 z-30 -mt-2 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)]"
          >
            <svg
              viewBox="0 0 800 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full block overflow-visible"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="pageScrollRollWoodBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#321B0B" />
                  <stop offset="25%" stopColor="#6C4524" />
                  <stop offset="50%" stopColor="#BA8E5C" />
                  <stop offset="75%" stopColor="#7E5632" />
                  <stop offset="100%" stopColor="#4A2E16" />
                </linearGradient>
              </defs>

              {/* Left Brass Knob Cap */}
              <ellipse cx="14" cy="16" rx="12" ry="14" fill="url(#pageBrassCapLeft)" stroke="#2F1C0B" strokeWidth="1.5" />
              <circle cx="14" cy="16" r="4" fill="#3B2610" />

              {/* Right Brass Knob Cap */}
              <ellipse cx="786" cy="16" rx="12" ry="14" fill="url(#pageBrassCapRight)" stroke="#2F1C0B" strokeWidth="1.5" />
              <circle cx="786" cy="16" r="4" fill="#3B2610" />

              {/* Main Cylindrical Roller Body */}
              <rect
                x="14"
                y="3"
                width="772"
                height="26"
                rx="4"
                fill="url(#pageScrollRollWoodBottom)"
                stroke="#2B1608"
                strokeWidth="1.5"
              />

              {/* Highlight Gleam */}
              <path
                d="M 24,18 L 776,18"
                stroke="#F0DEBA"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />

              {/* Brass Ring Bands */}
              <rect x="42" y="3" width="10" height="26" fill="url(#pageBrassCapLeft)" stroke="#2F1C0B" strokeWidth="0.8" />
              <rect x="748" y="3" width="10" height="26" fill="url(#pageBrassCapRight)" stroke="#2F1C0B" strokeWidth="0.8" />

              {/* Top Dark Crease Shadow */}
              <path
                d="M 20,3 C 150,1 650,1 780,3"
                stroke="#180C05"
                strokeWidth="2.5"
                strokeOpacity="0.9"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

ParchmentPage.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onRollComplete: PropTypes.func,
};

export default ParchmentPage;
