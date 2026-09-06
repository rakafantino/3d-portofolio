import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useProgress } from "@react-three/drei";
import { useLanguage } from "../context/LanguageContext";
import ParchmentScroll from "./ParchmentScroll";
import WaxSealButton from "./WaxSealButton";

const SplashGate = ({ onEnter }) => {
  const { t } = useLanguage();
  const { progress } = useProgress();

  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isParting, setIsParting] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const hasTriggeredEnterRef = useRef(false);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 400);
      return () => clearTimeout(timer);
    }

    const graceTimer = setTimeout(() => {
      setIsReady(true);
    }, 1500);

    return () => clearTimeout(graceTimer);
  }, [progress]);

  const triggerParting = () => {
    if (hasTriggeredEnterRef.current) return;
    hasTriggeredEnterRef.current = true;

    setIsParting(true);

    setTimeout(() => {
      setIsUnmounted(true);
    }, 700);
  };

  const handleEnterClick = () => {
    if (isParting || isUnmounted || !isOpen) return;

    if (typeof onEnter === "function") {
      onEnter();
    }

    setIsOpen(false);

    setTimeout(() => {
      triggerParting();
    }, 620);
  };

  const handleRollComplete = (openState) => {
    if (openState === false) {
      triggerParting();
    }
  };

  if (isUnmounted) {
    return null;
  }

  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress || 0)));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Island Welcome Gate"
      className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto"
    >
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-700 ease-out bg-island-black/50 backdrop-blur-[2px] ${
          isParting ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />

      <div
        className={`relative z-30 h-full w-full flex flex-col items-center justify-center p-4 transition-all duration-700 ease-out ${
          isParting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {!isReady ? (
          <div className="flex flex-col items-center max-w-xs text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full border border-island-border/80 flex items-center justify-center relative bg-island-dark/60">
              <span className="w-2 h-2 rounded-full bg-copper animate-ping" />
              <div
                className="absolute inset-0 rounded-full border-t-2 border-copper transition-all duration-300"
                style={{ transform: `rotate(${roundedProgress * 3.6}deg)` }}
              />
            </div>

            <div className="space-y-1">
              <p className="font-mono text-xs tracking-widest uppercase text-copper font-medium">
                {t("gateLoading")}
              </p>
              <p className="font-mono text-xs text-cream/50">
                {roundedProgress}%
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-md w-full mx-auto">
            <ParchmentScroll
              isOpen={isOpen}
              onRollComplete={handleRollComplete}
              className="max-w-md sm:max-w-[28rem]"
            >
              <div className="text-center space-y-4 py-2 sm:py-3">
                <div className="flex items-center justify-center gap-3">
                  <span className="w-6 sm:w-10 h-px bg-[#8C5E32]/40" aria-hidden="true" />
                  <span className="font-serif italic text-xs tracking-widest uppercase text-[#8C3E14] font-medium">
                    {t("gateKicker")}
                  </span>
                  <span className="w-6 sm:w-10 h-px bg-[#8C5E32]/40" aria-hidden="true" />
                </div>

                <div className="space-y-2">
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#2A1608] font-bold leading-snug tracking-tight">
                    {t("gateTitle")}
                  </h1>
                  <p className="font-sans text-sm sm:text-base text-[#4A301A] leading-relaxed max-w-sm mx-auto">
                    {t("gateSubtitle")}
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  <WaxSealButton
                    id="enter-island-seal-btn"
                    variant="seal"
                    size="lg"
                    onClick={handleEnterClick}
                    ariaLabel={t("gateButton")}
                  >
                    <span className="font-serif italic text-xs tracking-wider text-[#8C3E14] block mt-1.5">
                      {t("gateButton")}
                    </span>
                  </WaxSealButton>
                </div>
              </div>
            </ParchmentScroll>
          </div>
        )}
      </div>
    </div>
  );
};

SplashGate.propTypes = {
  onEnter: PropTypes.func,
};

export default SplashGate;
