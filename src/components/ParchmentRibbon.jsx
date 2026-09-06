import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * ParchmentRibbon
 * Antique curled parchment ribbon banner component for links, headings, and tabs.
 * Features tea-stained parchment gradient, fine sepia border lines, and curled split swallowtail ends.
 */
const ParchmentRibbon = ({
  children,
  to,
  className = "",
  variant = "banner",
  ariaLabel,
  onClick,
}) => {
  const isLink = Boolean(to);
  const isButton = !isLink && Boolean(onClick);

  // Curled split swallowtail SVG for left end
  const leftTail = (
    <svg
      data-testid="ribbon-tail-left"
      viewBox="0 0 28 36"
      className="w-5 sm:w-6 h-full flex-shrink-0 -mr-1.5 overflow-visible select-none pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="ribbonTailGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFCCA8" />
          <stop offset="50%" stopColor="#ECDDC0" />
          <stop offset="100%" stopColor="#D4BC90" />
        </linearGradient>
        <linearGradient id="ribbonFoldShadowLeft" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#3A2412" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#5C3A1E" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Underside fold shadow */}
      <polygon points="28,2 28,34 22,36 22,0" fill="url(#ribbonFoldShadowLeft)" />

      {/* Swallowtail banner projecting left with V-notch */}
      <path
        d="M 28,2 L 6,2 L 14,18 L 6,34 L 28,34 Z"
        fill="url(#ribbonTailGradLeft)"
        stroke="#8C6A43"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Top highlight line */}
      <path d="M 7,3 L 28,3" stroke="#FFF8EB" strokeWidth="1" strokeOpacity="0.65" />

      {/* Bottom shadow line */}
      <path d="M 7,33 L 28,33" stroke="#4A301A" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );

  // Curled split swallowtail SVG for right end
  const rightTail = (
    <svg
      data-testid="ribbon-tail-right"
      viewBox="0 0 28 36"
      className="w-5 sm:w-6 h-full flex-shrink-0 -ml-1.5 overflow-visible select-none pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="ribbonTailGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4BC90" />
          <stop offset="50%" stopColor="#ECDDC0" />
          <stop offset="100%" stopColor="#DFCCA8" />
        </linearGradient>
        <linearGradient id="ribbonFoldShadowRight" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#3A2412" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#5C3A1E" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Underside fold shadow */}
      <polygon points="0,2 0,34 6,36 6,0" fill="url(#ribbonFoldShadowRight)" />

      {/* Swallowtail banner projecting right with V-notch */}
      <path
        d="M 0,2 L 22,2 L 14,18 L 22,34 L 0,34 Z"
        fill="url(#ribbonTailGradRight)"
        stroke="#8C6A43"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Top highlight line */}
      <path d="M 0,3 L 21,3" stroke="#FFF8EB" strokeWidth="1" strokeOpacity="0.65" />

      {/* Bottom shadow line */}
      <path d="M 0,33 L 21,33" stroke="#4A301A" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  );

  const baseStyles =
    "inline-flex items-center justify-center transition-all duration-200 filter drop-shadow-[0_4px_10px_rgba(25,14,6,0.6)] group select-none";

  const contentClasses =
    "relative z-10 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 font-serif text-xs sm:text-sm font-semibold text-[#3D2511] group-hover:text-[#7A3614] tracking-wide";

  const centerBodyStyle = {
    background: "linear-gradient(180deg, #F9F1E2 0%, #EBD8B8 50%, #DCBE91 100%)",
    borderTop: "1.5px solid #F5E8D0",
    borderBottom: "2px solid #5C3A1E",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -2px 4px rgba(60,34,16,0.3)",
  };

  const ribbonCore = (
    <div className="inline-flex items-center flex-nowrap shrink-0">
      {leftTail}
      <div className={contentClasses} style={centerBodyStyle}>
        {children}
      </div>
      {rightTail}
    </div>
  );

  if (isLink) {
    return (
      <Link
        to={to}
        data-testid="parchment-ribbon"
        data-variant={variant}
        aria-label={ariaLabel}
        onClick={onClick}
        className={`${baseStyles} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] focus-visible:ring-offset-1 active:translate-y-0.5 ${className}`}
      >
        {ribbonCore}
      </Link>
    );
  }

  if (isButton) {
    return (
      <button
        type="button"
        data-testid="parchment-ribbon"
        data-variant={variant}
        aria-label={ariaLabel}
        onClick={onClick}
        className={`${baseStyles} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] focus-visible:ring-offset-1 active:translate-y-0.5 ${className}`}
      >
        {ribbonCore}
      </button>
    );
  }

  return (
    <div
      data-testid="parchment-ribbon"
      data-variant={variant}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${baseStyles} ${className}`}
    >
      {ribbonCore}
    </div>
  );
};

ParchmentRibbon.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  ariaLabel: PropTypes.string,
  onClick: PropTypes.func,
};

export default ParchmentRibbon;
