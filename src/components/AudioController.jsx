import { useState, useRef } from "react";
import { createAudioEngine, STORAGE_KEY } from "../core/audioEngine.js";

/**
 * AudioController
 * Soundwave visualizer with procedural audio mute/unmute toggle.
 * Lazy initialization on first user interaction prevents browser autoplay blocks.
 */
const AudioController = () => {
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });

  const engineRef = useRef(null);

  const handleToggle = () => {
    if (!engineRef.current) {
      engineRef.current = createAudioEngine({
        AudioContextImpl:
          typeof window !== "undefined"
            ? window.AudioContext || window.webkitAudioContext
            : undefined,
        localStorage: typeof window !== "undefined" ? window.localStorage : undefined,
      });
    }

    engineRef.current.toggle();
    setMuted(engineRef.current.isMuted());
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={muted}
      aria-label={muted ? "Enable terminal audio" : "Mute terminal audio"}
      title={muted ? "Audio: MUTED [Click to activate]" : "Audio: ONLINE [Click to mute]"}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-cyber-border bg-cyber-dark/80 hover:border-cyber-cyan/50 text-cyber-cyan text-xs font-mono transition-colors focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
    >
      <span className="flex items-end gap-0.5 h-3.5 w-4" aria-hidden="true">
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            muted
              ? "h-1 bg-cyber-border"
              : "h-3 bg-cyber-cyan animate-pulse [animation-delay:0ms]"
          }`}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            muted
              ? "h-1 bg-cyber-border"
              : "h-3.5 bg-cyber-cyan animate-pulse [animation-delay:150ms]"
          }`}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            muted
              ? "h-1 bg-cyber-border"
              : "h-2 bg-cyber-cyan animate-pulse [animation-delay:300ms]"
          }`}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            muted
              ? "h-1 bg-cyber-border"
              : "h-3 bg-cyber-cyan animate-pulse [animation-delay:450ms]"
          }`}
        />
        <span
          className={`w-0.5 rounded-full transition-all duration-300 ${
            muted
              ? "h-1 bg-cyber-border"
              : "h-2.5 bg-cyber-cyan animate-pulse [animation-delay:600ms]"
          }`}
        />
      </span>
      <span className="uppercase tracking-wider font-semibold">
        {muted ? "AUDIO: OFF" : "AUDIO: ON"}
      </span>
    </button>
  );
};

export default AudioController;
