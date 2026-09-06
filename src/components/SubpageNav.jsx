import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import AudioController from "./AudioController";
import LanguageToggle from "../context/LanguageToggle";
import ParchmentRibbon from "./ParchmentRibbon";

const SubpageNav = ({ onBack }) => {
  const { t } = useLanguage();

  const handleBackClick = (e) => {
    if (typeof onBack === "function") {
      e.preventDefault();
      onBack();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-3 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between pointer-events-auto">
        {typeof onBack === "function" ? (
          <ParchmentRibbon
            to="/"
            onClick={handleBackClick}
            ariaLabel={t("backToIsland")}
            className="group"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-1 text-[#8C3E14] font-bold text-xs sm:text-sm select-none"
            >
              ←
            </span>
            <span className="tracking-wide">{t("backToIsland")}</span>
          </ParchmentRibbon>
        ) : (
          <Link
            to="/"
            className="relative inline-flex items-center gap-2 font-serif text-xs sm:text-sm font-semibold text-[#3D2511] hover:text-[#7A3614] transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] rounded-md px-3 sm:px-4 py-2 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]"
            style={{
              background: "linear-gradient(180deg, #F9F1E2 0%, #EBD8B8 50%, #DCBE91 100%)",
              borderTop: "1.5px solid #F5E8D0",
              borderBottom: "2px solid #5C3A1E",
              borderLeft: "2px solid #8A5D33",
              borderRight: "2px solid #8A5D33",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -2px 4px rgba(60,34,16,0.3)",
            }}
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-1 text-[#8C3E14] font-bold text-sm sm:text-base select-none"
            >
              ←
            </span>
            <span className="tracking-wide">{t("backToIsland")}</span>
          </Link>
        )}

        <div
          className="relative inline-flex items-center gap-2.5 px-3 py-1.5 filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-all select-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, #51381E 0%, #3A2514 50%, #201309 85%, #140C06 100%)",
            border: "1.5px solid #9E7A43",
            borderRadius: "4px",
            boxShadow:
              "inset 0 1px 1.5px rgba(255,215,140,0.4), inset 0 -2px 3px rgba(0,0,0,0.9), 0 0 14px rgba(184,135,70,0.25)",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />

          <span
            aria-hidden="true"
            className="absolute inset-[3px] border border-[#B88746]/25 rounded-[2px] pointer-events-none"
          />

          <LanguageToggle variant="island" />

          <div
            className="h-4 w-px bg-gradient-to-b from-transparent via-[#B88746]/60 to-transparent"
            aria-hidden="true"
          />

          <AudioController variant="brass" />
        </div>
      </div>
    </header>
  );
};

SubpageNav.propTypes = {
  onBack: PropTypes.func,
};

export default SubpageNav;
