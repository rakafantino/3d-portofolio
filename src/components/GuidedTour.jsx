import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";

const STEP_CONFIGS = [
  {
    targetId: "island-diorama",
    titleKey: "tourStep1Title",
    descKey: "tourStep1Desc",
  },
  {
    targetId: "astrolabe-nav",
    titleKey: "tourStep2Title",
    descKey: "tourStep2Desc",
  },
  {
    targetId: "brass-compass",
    titleKey: "tourStep3Title",
    descKey: "tourStep3Desc",
  },
  {
    targetId: null,
    titleKey: "tourStep4Title",
    descKey: "tourStep4Desc",
  },
];

const GuidedTour = ({ isOpen, onClose, onComplete }) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const currentStepConfig = STEP_CONFIGS[currentStepIndex];
  const currentStep = {
    targetId: currentStepConfig.targetId,
    title: t(currentStepConfig.titleKey),
    desc: t(currentStepConfig.descKey),
  };

  const updateTargetRect = useCallback(() => {
    const targetId = STEP_CONFIGS[currentStepIndex]?.targetId;
    if (!targetId) {
      setTargetRect(null);
      return;
    }

    const targetEls = Array.from(
      document.querySelectorAll(`[data-tour-target="${targetId}"]`)
    );
    if (!targetEls.length) {
      setTargetRect(null);
      return;
    }

    const targetEl =
      targetEls.find((el) => {
        const r = el.getBoundingClientRect();
        return r && r.width > 0 && r.height > 0;
      }) || targetEls[0];

    const rect = targetEl.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
      setTargetRect(null);
      return;
    }

    setTargetRect(rect);
  }, [currentStepIndex]);

  useEffect(() => {
    if (!isOpen) return;

    updateTargetRect();

    const handleResize = () => {
      updateTargetRect();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [isOpen, updateTargetRect]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (typeof onClose === "function") {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isLastStep = currentStepIndex === STEP_CONFIGS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      if (typeof onComplete === "function") {
        onComplete();
      }
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const getCardStyle = () => {
    if (!targetRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "fixed",
      };
    }

    const padding = 16;
    const cardWidth = 340;
    const cardHeight = 220;
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 768;

    if (targetRect.width >= windowWidth * 0.8 && targetRect.height >= windowHeight * 0.8) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        position: "fixed",
      };
    }

    if (targetRect.bottom + cardHeight + padding < windowHeight) {
      const idealLeft = targetRect.left + targetRect.width / 2 - cardWidth / 2;
      const clampedLeft = Math.max(
        padding,
        Math.min(idealLeft, windowWidth - cardWidth - padding)
      );
      return {
        top: `${targetRect.bottom + padding}px`,
        left: `${clampedLeft}px`,
        position: "fixed",
      };
    }

    if (targetRect.top - cardHeight - padding > 0) {
      const idealLeft = targetRect.left + targetRect.width / 2 - cardWidth / 2;
      const clampedLeft = Math.max(
        padding,
        Math.min(idealLeft, windowWidth - cardWidth - padding)
      );
      return {
        top: `${Math.max(padding, targetRect.top - cardHeight - padding)}px`,
        left: `${clampedLeft}px`,
        position: "fixed",
      };
    }

    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      position: "fixed",
    };
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Guided Tour"
      className="fixed inset-0 z-[60] overflow-hidden select-none"
    >
      {/* Dim overlay without global blur so spotlight hole remains 100% sharp and crystal-clear */}
      {!targetRect && <div className="absolute inset-0 bg-[#140C06]/75" />}

      {targetRect && (
        <div
          data-testid="tour-spotlight"
          className="fixed rounded-md pointer-events-none transition-all duration-300 border-2 border-[#B88746] shadow-[0_0_24px_rgba(184,135,70,0.6)]"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
            boxShadow:
              "0 0 0 9999px rgba(20, 12, 6, 0.75), 0 0 24px rgba(184, 135, 70, 0.55)",
          }}
        />
      )}

      <div
        className="w-full max-w-[21.5rem] sm:max-w-sm transition-all duration-300 pointer-events-auto"
        style={getCardStyle()}
      >
        <div className="relative bg-[#ECDDC0] border border-[#8C6A43] text-[#241407] rounded-sm p-4 sm:p-5 shadow-2xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage:
                "radial-gradient(#241407 1px, transparent 1px), radial-gradient(#8C6A43 1px, transparent 1px)",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 4px 4px",
            }}
          />

          <div className="relative z-10 flex items-start justify-between gap-2 border-b border-[#8C6A43]/30 pb-2 mb-3">
            <div>
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#8C6A43] font-semibold">
                {currentStepIndex + 1} / {STEP_CONFIGS.length}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#241407] tracking-tight leading-tight mt-0.5">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <div className="relative z-10 text-xs sm:text-sm text-[#422B18] leading-relaxed mb-4">
            {currentStep.desc}
          </div>

          <div className="relative z-10 flex items-center justify-between gap-3 pt-2 border-t border-[#8C6A43]/20">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-mono tracking-wider text-[#6A4B29] hover:text-[#241407] transition-colors py-1 px-2 rounded hover:bg-[#8C6A43]/10"
            >
              {t("tourSkip")}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center text-xs font-mono font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-sm bg-[#8C6A43] text-[#F4E8D1] hover:bg-[#6E4F2D] active:scale-[0.98] transition-all shadow-md border border-[#5C3E1F]"
            >
              {isLastStep ? t("tourFinish") : t("tourNext")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

GuidedTour.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default GuidedTour;
