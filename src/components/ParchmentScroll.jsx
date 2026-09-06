import PropTypes from "prop-types";

const ParchmentScroll = ({
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
      data-testid="parchment-scroll"
      data-is-open={isOpen ? "true" : "false"}
      className={`relative w-full max-w-[22rem] sm:max-w-[24rem] mx-auto filter drop-shadow-[0_12px_24px_rgba(15,10,5,0.75)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${className}`}
    >
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
        <defs>
          <filter id="paperFiber" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.04" numOctaves="4" result="noise" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.38
                      0 0 0 0 0.26
                      0 0 0 0 0.14
                      0 0 0 0.35 0"
              result="coloredNoise"
            />
            <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      <div
        className={`relative w-full h-4 sm:h-5 z-20 -mb-1 ${
          isOpen ? "animate-parchment-top-roll" : "animate-parchment-top-roll-rise"
        }`}
      >
        <svg
          viewBox="0 0 360 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block overflow-visible"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="scrollRollGradTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7B5E3C" />
              <stop offset="30%" stopColor="#CBB48A" />
              <stop offset="55%" stopColor="#F4E9D6" />
              <stop offset="85%" stopColor="#BBA072" />
              <stop offset="100%" stopColor="#694C2B" />
            </linearGradient>

            <linearGradient id="scrollRollKnobLeft" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#51381E" />
              <stop offset="50%" stopColor="#A78759" />
              <stop offset="100%" stopColor="#4A321B" />
            </linearGradient>
            
            <linearGradient id="scrollRollKnobRight" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#4A321B" />
              <stop offset="50%" stopColor="#A78759" />
              <stop offset="100%" stopColor="#51381E" />
            </linearGradient>

            <linearGradient id="innerCurlShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A1B0E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2A1B0E" stopOpacity="0" />
            </linearGradient>
          </defs>

          <ellipse cx="6" cy="11" rx="5" ry="7" fill="url(#scrollRollKnobLeft)" stroke="#382414" strokeWidth="1" />
          <ellipse cx="354" cy="11" rx="5" ry="7" fill="url(#scrollRollKnobRight)" stroke="#382414" strokeWidth="1" />

          <path
            d="M 6,11 C 6,4 12,2 24,2 L 336,2 C 348,2 354,4 354,11 C 354,18 348,20 336,20 L 24,20 C 12,20 6,18 6,11 Z"
            fill="url(#scrollRollGradTop)"
            stroke="#5A4026"
            strokeWidth="1.2"
          />

          <path
            d="M 10,12 C 40,7 180,8 350,12"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeOpacity="0.5"
            fill="none"
          />

          <path
            d="M 12,20 C 60,23 300,23 348,20"
            stroke="#2F1C0D"
            strokeWidth="1.5"
            strokeOpacity="0.75"
            fill="none"
          />
        </svg>
      </div>

      <div
        data-testid="parchment-scroll-unroll-body"
        onAnimationEnd={handleAnimationEnd}
        className={`relative z-10 w-full ${
          isOpen ? "animate-parchment-unroll" : "animate-parchment-rollup"
        }`}
      >
        <div className="w-full px-1.5 sm:px-2">
          <div
            className="relative w-full rounded-[2px] transition-all overflow-hidden"
            style={{
              backgroundColor: "#ECDDC0",
              backgroundImage: `
                radial-gradient(ellipse at 50% 0%, rgba(255, 250, 238, 0.85) 0%, rgba(236, 221, 192, 0.35) 55%, rgba(139, 92, 43, 0.3) 88%, rgba(60, 32, 12, 0.5) 100%),
                radial-gradient(circle at 100% 50%, rgba(95, 58, 25, 0.45) 0%, transparent 45%),
                radial-gradient(circle at 0% 50%, rgba(95, 58, 25, 0.45) 0%, transparent 45%),
                radial-gradient(circle at 50% 100%, rgba(85, 48, 20, 0.5) 0%, transparent 70%),
                linear-gradient(180deg, #F3E6D0 0%, #E7D5B6 35%, #DDC69E 75%, #CCA870 100%)
              `,
              boxShadow: `
                inset 0 16px 20px -8px rgba(40, 20, 8, 0.78),
                inset 0 -16px 20px -8px rgba(40, 20, 8, 0.72),
                inset 14px 0 18px -8px rgba(65, 35, 15, 0.65),
                inset -14px 0 18px -8px rgba(65, 35, 15, 0.65),
                0 1px 3px rgba(35, 18, 8, 0.5)
              `,
              borderLeft: "2px solid #6E4926",
              borderRight: "2px solid #6E4926",
            }}
          >
            <div
              data-testid="paper-fiber-layer"
              className="absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply overflow-hidden rounded-[2px]"
              aria-hidden="true"
            >
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <rect width="100%" height="100%" filter="url(#paperFiber)" fill="#E6D3B1" />
              </svg>
            </div>

            <div
              data-testid="parchment-tea-stains"
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2px]"
              aria-hidden="true"
            >
              <div
                className="absolute -top-3 -right-5 w-24 h-24 rounded-full border-[2.5px] border-[#69421D]/20 opacity-40 blur-[0.5px]"
                style={{
                  background: "radial-gradient(circle, transparent 65%, rgba(105, 66, 29, 0.12) 75%, rgba(105, 66, 29, 0.02) 100%)",
                  transform: "rotate(-12deg) scaleX(1.15)",
                }}
              />
              <div
                className="absolute top-1/4 -left-6 w-28 h-20 rounded-[45%_55%_60%_40%/50%_40%_60%_50%] opacity-35 blur-[1.5px]"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(122, 80, 40, 0.28) 0%, rgba(145, 96, 48, 0.12) 55%, transparent 80%)",
                  transform: "rotate(18deg)",
                }}
              />
              <div
                className="absolute bottom-2 right-6 w-24 h-16 rounded-[55%_45%_40%_60%/45%_60%_40%_55%] opacity-30 blur-[1.2px]"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(108, 68, 32, 0.25) 0%, rgba(135, 88, 44, 0.1) 60%, transparent 80%)",
                  transform: "rotate(-25deg)",
                }}
              />
            </div>

            <svg
              data-testid="deckled-edge-left"
              className="absolute left-0 top-0 bottom-0 h-full w-2 pointer-events-none z-10 opacity-70"
              viewBox="0 0 8 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 0,0 L 5,0 Q 2,12 6,24 T 3,48 T 7,72 T 2,90 T 5,100 L 0,100 Z"
                fill="#4A2E16"
              />
              <path
                d="M 5,0 Q 2,12 6,24 T 3,48 T 7,72 T 2,90 T 5,100"
                stroke="#2E180A"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>

            <svg
              data-testid="deckled-edge-right"
              className="absolute right-0 top-0 bottom-0 h-full w-2 pointer-events-none z-10 opacity-70"
              viewBox="0 0 8 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 8,0 L 3,0 Q 6,12 2,24 T 5,48 T 1,72 T 6,90 T 3,100 L 8,100 Z"
                fill="#4A2E16"
              />
              <path
                d="M 3,0 Q 6,12 2,24 T 5,48 T 1,72 T 6,90 T 3,100"
                stroke="#2E180A"
                strokeWidth="0.8"
                fill="none"
              />
            </svg>

            <div
              data-testid="burnished-edge-left"
              className="absolute left-0 top-0 bottom-0 w-[5px] pointer-events-none opacity-50 mix-blend-multiply"
              style={{
                backgroundImage: "linear-gradient(90deg, #381E09 0%, rgba(89, 60, 32, 0.6) 40%, transparent 100%)",
              }}
            />
            <div
              data-testid="burnished-edge-right"
              className="absolute right-0 top-0 bottom-0 w-[5px] pointer-events-none opacity-50 mix-blend-multiply"
              style={{
                backgroundImage: "linear-gradient(270deg, #381E09 0%, rgba(89, 60, 32, 0.6) 40%, transparent 100%)",
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-color-burn"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 30%, #704724 1px, transparent 1px), radial-gradient(circle at 80% 70%, #704724 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div
              data-testid="parchment-scroll-content-container"
              className={`relative z-10 px-4 py-3.5 sm:px-5 sm:py-4.5 text-left text-[#2A180B] ${
                isOpen ? "animate-parchment-content" : "animate-parchment-content-exit"
              }`}
            >
              {children}
            </div>
          </div>
        </div>

        <div className="relative w-full h-4 sm:h-5 z-20 -mt-1">
          <svg
            viewBox="0 0 360 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block overflow-visible"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="scrollRollGradBottom" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#553A1F" />
                <stop offset="25%" stopColor="#9E8357" />
                <stop offset="60%" stopColor="#E6D5B9" />
                <stop offset="85%" stopColor="#B19467" />
                <stop offset="100%" stopColor="#4A311A" />
              </linearGradient>
            </defs>

            <ellipse cx="6" cy="11" rx="5" ry="7" fill="url(#scrollRollKnobLeft)" stroke="#382414" strokeWidth="1" />
            <ellipse cx="354" cy="11" rx="5" ry="7" fill="url(#scrollRollKnobRight)" stroke="#382414" strokeWidth="1" />

            <path
              d="M 6,11 C 6,4 12,2 24,2 L 336,2 C 348,2 354,4 354,11 C 354,18 348,20 336,20 L 24,20 C 12,20 6,18 6,11 Z"
              fill="url(#scrollRollGradBottom)"
              stroke="#4F361F"
              strokeWidth="1.2"
            />

            <path
              d="M 12,14 C 60,17 300,17 348,14"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeOpacity="0.45"
              fill="none"
            />

            <path
              d="M 14,3 C 70,1 290,1 346,3"
              stroke="#26170A"
              strokeWidth="1.2"
              strokeOpacity="0.8"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

ParchmentScroll.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onRollComplete: PropTypes.func,
};

export default ParchmentScroll;


