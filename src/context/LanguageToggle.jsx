import PropTypes from "prop-types";
import { useLanguage, LANGUAGES } from "./LanguageContext.jsx";

const LanguageToggle = ({ variant = "island", className = "" }) => {
  const { lang, toggleLang } = useLanguage();

  const targetLang = lang === "id" ? "en" : "id";
  const displayLabel = LANGUAGES[targetLang] || targetLang.toUpperCase();

  const isPaper = variant === "paper";

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label="Switch language"
      title={`Switch language: ${displayLabel}`}
      className={`group relative inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-serif text-xs font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] cursor-pointer select-none active:scale-95 ${
        isPaper
          ? "text-[#4A2F17] hover:text-[#8C3E14] text-ink-soft hover:text-copper"
          : "text-[#EBD6B0] hover:text-[#FFF0D4] text-cream/70 hover:text-cream"
      } ${className}`.trim()}
      style={{
        background: isPaper
          ? "radial-gradient(circle at 35% 35%, #FFF6E5 0%, #ECDDC0 55%, #C2A378 100%)"
          : "radial-gradient(circle at 35% 30%, #51381E 0%, #3A2514 45%, #241407 85%, #140C06 100%)",
        border: isPaper ? "1.5px solid #8C6A43" : "1.5px solid #9E7A43",
        boxShadow: isPaper
          ? "inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -1.5px 2px rgba(60,34,16,0.35), 0 2px 4px rgba(0,0,0,0.2)"
          : "inset 0 1px 1.5px rgba(255,215,140,0.45), inset 0 -1.5px 2px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.45)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[1.5px] rounded-full pointer-events-none border border-[#E6C687]/30"
      />

      <span
        className="relative z-10 font-serif tracking-wider font-extrabold text-[11px] sm:text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
        style={{
          textShadow: isPaper
            ? "0 1px 0 rgba(255,255,255,0.6)"
            : "0 1px 2px rgba(0,0,0,0.9)",
        }}
      >
        {displayLabel}
      </span>
    </button>
  );
};

LanguageToggle.propTypes = {
  variant: PropTypes.oneOf(["island", "paper"]),
  className: PropTypes.string,
};

export default LanguageToggle;
