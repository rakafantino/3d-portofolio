import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";

const MobileSmartDock = ({ currentStage, onSelectStage, isVisible = true, className = "" }) => {
  const { t } = useLanguage();

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-30 pb-[max(0.8rem,env(safe-area-inset-bottom))] px-4 flex justify-center select-none transition-opacity duration-1000 ease-out ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      } ${className}`}
    >
      <nav
        aria-label={t("mobileNavAria")}
        data-tour-target="astrolabe-nav"
        className="relative inline-flex items-center justify-between gap-3 px-3.5 py-1.5 filter drop-shadow-[0_10px_24px_rgba(0,0,0,0.9)] mx-auto"
        style={{
          background: "linear-gradient(180deg, #3A2514 0%, #201309 60%, #140C06 100%)",
          borderTop: "2px solid #B88746",
          borderBottom: "2px solid #51381E",
          borderLeft: "2px solid #78531E",
          borderRight: "2px solid #78531E",
          borderRadius: "6px",
          boxShadow:
            "inset 0 1px 2px rgba(230,198,135,0.45), inset 0 -2px 4px rgba(0,0,0,0.9), 0 0 16px rgba(184,135,70,0.25)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
        />
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
        />

        <button
          type="button"
          onClick={() => onSelectStage(currentStage === 1 ? 5 : currentStage - 1)}
          aria-label={t("mobilePrevAria")}
          className="group relative w-8 h-8 flex items-center justify-center text-[#D4B688] hover:text-[#FFE3A8] active:text-[#FFDF9E] rounded-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] shrink-0 active:scale-95"
          style={{
            background: "radial-gradient(circle at 35% 30%, #51381E 0%, #3A2514 50%, #1D1208 100%)",
            border: "1px solid #9E7A43",
            boxShadow: "inset 0 1px 1px rgba(255,215,140,0.35), 0 1px 3px rgba(0,0,0,0.7)",
          }}
        >
          <span
            aria-hidden="true"
            className="font-serif font-extrabold text-base leading-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] transition-transform group-hover:-translate-x-0.5"
          >
            ‹
          </span>
        </button>

        <div
          className="relative flex items-center gap-1.5 px-4 py-1 rounded-[3px] font-mono text-xs shrink-0 tracking-wider shadow-inner select-none"
          style={{
            background: "linear-gradient(180deg, #241407 0%, #150B04 100%)",
            border: "1px solid #8C6A43",
            boxShadow: "inset 0 1.5px 3px rgba(0,0,0,0.95), 0 1px 0 rgba(255,215,140,0.15)",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
          />
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
          />

          <span className="text-[#E6C687] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{`0${currentStage}`}</span>
          <span className="text-[#947247]/60 font-semibold">/</span>
          <span className="text-[#C2A378] font-medium">05</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectStage(currentStage === 5 ? 1 : currentStage + 1)}
          aria-label={t("mobileNextAria")}
          className="group relative w-8 h-8 flex items-center justify-center text-[#D4B688] hover:text-[#FFE3A8] active:text-[#FFDF9E] rounded-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] shrink-0 active:scale-95"
          style={{
            background: "radial-gradient(circle at 35% 30%, #51381E 0%, #3A2514 50%, #1D1208 100%)",
            border: "1px solid #9E7A43",
            boxShadow: "inset 0 1px 1px rgba(255,215,140,0.35), 0 1px 3px rgba(0,0,0,0.7)",
          }}
        >
          <span
            aria-hidden="true"
            className="font-serif font-extrabold text-base leading-none select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] transition-transform group-hover:translate-x-0.5"
          >
            ›
          </span>
        </button>
      </nav>
    </div>
  );
};

MobileSmartDock.propTypes = {
  currentStage: PropTypes.number.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  isCameraMoving: PropTypes.bool,
  isVisible: PropTypes.bool,
  className: PropTypes.string,
};

export default MobileSmartDock;
