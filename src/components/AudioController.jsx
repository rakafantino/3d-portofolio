import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getSharedAudioEngine, AUDIO_STATE_CHANGE_EVENT, STORAGE_KEY } from "../core/audioEngine.js";

const AudioController = ({ variant = "brass", className = "" }) => {
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const engine = getSharedAudioEngine();
    setMuted(engine.isMuted());

    const unsubscribe = engine.subscribe((newMuted) => {
      setMuted(newMuted);
    });

    const handleCustomEvent = (e) => {
      if (e.detail && typeof e.detail.muted === "boolean") {
        setMuted(e.detail.muted);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(AUDIO_STATE_CHANGE_EVENT, handleCustomEvent);
    }

    return () => {
      unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener(AUDIO_STATE_CHANGE_EVENT, handleCustomEvent);
      }
    };
  }, []);

  const handleToggle = () => {
    const engine = getSharedAudioEngine();
    engine.toggle();
    setMuted(engine.isMuted());
  };

  const isParchment = variant === "parchment";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={muted}
      aria-label={muted ? "Enable terminal audio" : "Mute terminal audio"}
      title={muted ? "Suara: Mati (Klik untuk menyalakan)" : "Suara: Aktif (Klik untuk mematikan)"}
      className={`group relative inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] select-none active:scale-95 ${className}`.trim()}
      style={{
        background: isParchment
          ? "radial-gradient(circle at 35% 35%, #F4E8D1 0%, #DFCCA8 60%, #B89B6C 100%)"
          : "radial-gradient(circle at 35% 30%, #51381E 0%, #3A2514 45%, #201309 85%, #140C06 100%)",
        border: isParchment ? "1.5px solid #8C6A43" : "1.5px solid #9E7A43",
        boxShadow: isParchment
          ? "inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(60,34,16,0.35), 0 2px 4px rgba(0,0,0,0.2)"
          : "inset 0 1px 1.5px rgba(255,215,140,0.45), inset 0 -1.5px 2px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.45)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-[1.5px] rounded-full pointer-events-none border border-[#E6C687]/25"
      />

      <span className="relative z-10 flex items-end justify-center gap-[2.5px] h-3.5 w-3.5" aria-hidden="true">
        <span
          className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${
            muted
              ? isParchment
                ? "h-1 bg-[#8C6A43]/50"
                : "h-1 bg-[#78531E]/70"
              : isParchment
              ? "h-2.5 bg-[#8C3E14] group-hover:bg-[#B4552D] animate-pulse [animation-delay:0ms]"
              : "h-2.5 bg-[#B88746] group-hover:bg-[#E6C687] animate-pulse [animation-delay:0ms]"
          }`}
          style={{
            boxShadow: muted
              ? "none"
              : isParchment
              ? "0 0 3px rgba(180,85,45,0.5)"
              : "0 0 3px rgba(230,198,135,0.6)",
          }}
        />
        <span
          className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${
            muted
              ? isParchment
                ? "h-1.5 bg-[#8C6A43]/50"
                : "h-1.5 bg-[#78531E]/70"
              : isParchment
              ? "h-3.5 bg-[#B4552D] group-hover:bg-[#C56B3B] animate-pulse [animation-delay:150ms]"
              : "h-3.5 bg-[#E6C687] group-hover:bg-[#FFF3D1] animate-pulse [animation-delay:150ms]"
          }`}
          style={{
            boxShadow: muted
              ? "none"
              : isParchment
              ? "0 0 4px rgba(180,85,45,0.6)"
              : "0 0 4px rgba(255,243,209,0.7)",
          }}
        />
        <span
          className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${
            muted
              ? isParchment
                ? "h-1 bg-[#8C6A43]/50"
                : "h-1 bg-[#78531E]/70"
              : isParchment
              ? "h-2 bg-[#8C3E14] group-hover:bg-[#B4552D] animate-pulse [animation-delay:300ms]"
              : "h-2 bg-[#B88746] group-hover:bg-[#E6C687] animate-pulse [animation-delay:300ms]"
          }`}
          style={{
            boxShadow: muted
              ? "none"
              : isParchment
              ? "0 0 3px rgba(180,85,45,0.5)"
              : "0 0 3px rgba(230,198,135,0.6)",
          }}
        />
        <span
          className={`w-[2.5px] rounded-t-sm transition-all duration-300 ${
            muted
              ? isParchment
                ? "h-1.5 bg-[#8C6A43]/50"
                : "h-1.5 bg-[#78531E]/70"
              : isParchment
              ? "h-3 bg-[#B4552D] group-hover:bg-[#C56B3B] animate-pulse [animation-delay:450ms]"
              : "h-3 bg-[#E6C687] group-hover:bg-[#FFF3D1] animate-pulse [animation-delay:450ms]"
          }`}
          style={{
            boxShadow: muted
              ? "none"
              : isParchment
              ? "0 0 4px rgba(180,85,45,0.6)"
              : "0 0 4px rgba(255,243,209,0.7)",
          }}
        />
      </span>
    </button>
  );
};

AudioController.propTypes = {
  variant: PropTypes.oneOf(["brass", "parchment"]),
  className: PropTypes.string,
};

export default AudioController;


