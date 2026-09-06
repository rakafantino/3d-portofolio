import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * WaxSealButton
 * Standalone circular imperial wax seal medallion component.
 *
 * Implements pure tactile wax seal aesthetics:
 * - Organic irregular melted wax perimeter contour path (#C44335 -> #5C140E).
 * - Central stamped recess with 8-point compass star insignia in gold leaf (#E6C687 / #C27D38).
 * - Pure circular medallion with active:scale-95 tactile press physics.
 * - No rectangular box / parchment tab wrappers.
 */
const WaxSealButton = ({
  children,
  to,
  onClick,
  type = "button",
  className = "",
  ariaLabel,
  disabled = false,
  size = "md",
  id,
  ...props
}) => {
  const isLink = Boolean(to) && !disabled;

  const sizeDimensions = {
    sm: { seal: "w-12 h-12", text: "text-xs" },
    md: { seal: "w-16 h-16", text: "text-xs sm:text-sm" },
    lg: { seal: "w-20 h-20", text: "text-sm sm:text-base" },
  };

  const currentSize = sizeDimensions[size] || sizeDimensions.md;

  // Handcrafted Scalable Vector Wax Seal Medallion SVG
  const sealSvg = (
    <svg
      data-testid="wax-seal-svg"
      viewBox="0 0 100 100"
      className={`${currentSize.seal} flex-shrink-0 filter drop-shadow-[0_4px_8px_rgba(40,10,6,0.65)] select-none transition-transform duration-200 group-hover:scale-105`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Irregular outer wax puddle gradient */}
        <radialGradient id="waxOuterPuddle" cx="45%" cy="40%" r="55%" fx="35%" fy="30%">
          <stop offset="0%" stopColor="#C44335" />
          <stop offset="35%" stopColor="#A83226" />
          <stop offset="70%" stopColor="#8C271E" />
          <stop offset="92%" stopColor="#5C140E" />
          <stop offset="100%" stopColor="#3D0B07" />
        </radialGradient>

        {/* Central stamped recess gradient */}
        <radialGradient id="waxMedallionCore" cx="50%" cy="48%" r="48%" fx="45%" fy="40%">
          <stop offset="0%" stopColor="#87221A" />
          <stop offset="60%" stopColor="#6E1912" />
          <stop offset="100%" stopColor="#4A0E0A" />
        </radialGradient>

        {/* Embossed gold leaf insignia gradient */}
        <linearGradient id="goldInsigniaGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFF3D1" />
          <stop offset="30%" stopColor="#E6C687" />
          <stop offset="70%" stopColor="#C27D38" />
          <stop offset="100%" stopColor="#784C19" />
        </linearGradient>

        {/* Highlight rim shimmer */}
        <linearGradient id="waxGlossHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Irregular melted wax rim with organic lobes and drips */}
      <path
        data-testid="wax-melted-rim"
        d="M 50,4
           C 64,3 74,8 84,18
           C 93,27 97,40 96,52
           C 95,65 91,73 83,83
           C 74,92 63,97 50,96
           C 36,97 25,93 16,84
           C 7,74 3,63 4,50
           C 3,37 8,26 17,16
           C 27,6 37,3 50,4 Z"
        fill="url(#waxOuterPuddle)"
        stroke="#4A0E0A"
        strokeWidth="1.5"
      />

      {/* Second organic drip distortion lobe overlay */}
      <path
        d="M 48,7
           C 62,6 72,11 81,20
           C 89,28 93,39 92,49
           C 92,61 88,70 81,79
           C 72,87 62,92 49,92
           C 37,92 27,88 19,80
           C 11,70 7,61 8,49
           C 7,37 12,28 20,19
           C 28,10 38,7 48,7 Z"
        fill="none"
        stroke="url(#waxGlossHighlight)"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />

      {/* Recessed stamp bed inner ring */}
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="url(#waxMedallionCore)"
        stroke="#440B07"
        strokeWidth="2"
      />

      {/* Fine inner stamped beaded/crenelated ring */}
      <circle
        cx="50"
        cy="50"
        r="27"
        fill="none"
        stroke="#A83226"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        strokeOpacity="0.75"
      />

      {/* Embossed royal/mariner seal insignia: 8-point compass star & fleur-de-lis core */}
      <g
        data-testid="wax-embossed-insignia"
        className="filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
      >
        {/* Compass Cardinal Points */}
        {/* North */}
        <polygon points="50,26 53,46 50,48" fill="url(#goldInsigniaGrad)" />
        <polygon points="50,26 47,46 50,48" fill="#784C19" />
        {/* South */}
        <polygon points="50,74 53,54 50,52" fill="#784C19" />
        <polygon points="50,74 47,54 50,52" fill="url(#goldInsigniaGrad)" />
        {/* East */}
        <polygon points="74,50 54,47 52,50" fill="url(#goldInsigniaGrad)" />
        <polygon points="74,50 54,53 52,50" fill="#784C19" />
        {/* West */}
        <polygon points="26,50 46,47 48,50" fill="#784C19" />
        <polygon points="26,50 46,53 48,50" fill="url(#goldInsigniaGrad)" />

        {/* Ordinal Corner Points (NE, NW, SE, SW) */}
        <polygon points="67,33 53,47 50,50" fill="url(#goldInsigniaGrad)" />
        <polygon points="33,33 47,47 50,50" fill="#784C19" />
        <polygon points="67,67 53,53 50,50" fill="#784C19" />
        <polygon points="33,67 47,53 50,50" fill="url(#goldInsigniaGrad)" />

        {/* Central Emperor Gem / Compass Pivot */}
        <circle cx="50" cy="50" r="4.5" fill="url(#goldInsigniaGrad)" stroke="#3D0B07" strokeWidth="0.8" />
        <circle cx="48.5" cy="48.5" r="1.5" fill="#FFFFFF" fillOpacity="0.8" />
      </g>
    </svg>
  );

  const baseClasses = `relative inline-flex flex-col items-center justify-center gap-1.5 transition-all duration-200 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C27D38] focus-visible:ring-offset-2 active:scale-95 active:translate-y-0.5 rounded-full ${
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
  } ${className}`;

  if (isLink) {
    return (
      <Link
        id={id}
        to={to}
        aria-label={ariaLabel}
        data-variant="seal"
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {sealSvg}
        {children && (
          <span
            className={`font-serif font-semibold text-[#3D2511] group-hover:text-[#8C271E] transition-colors tracking-wide text-center ${currentSize.text}`}
          >
            {children}
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      data-variant="seal"
      className={baseClasses}
      {...props}
    >
      {sealSvg}
      {children && (
        <span
          className={`font-serif font-semibold text-[#3D2511] group-hover:text-[#8C271E] transition-colors tracking-wide text-center ${currentSize.text}`}
        >
          {children}
        </span>
      )}
    </button>
  );
};

WaxSealButton.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  id: PropTypes.string,
};

export default WaxSealButton;
