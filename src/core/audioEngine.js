export const STORAGE_KEY = "cyber-audio-muted";

/**
 * Creates a zero-asset procedural Web Audio engine for ambient sci-fi drone
 * and mechanical click SFX with lazy AudioContext instantiation on user gesture.
 *
 * @param {Object} options
 * @param {typeof AudioContext} [options.AudioContextImpl] - AudioContext constructor (injected for testing/SSR)
 * @param {Storage} [options.localStorage] - Storage interface for persisting mute state
 */
export function createAudioEngine(options = {}) {
  const AudioContextImpl = "AudioContextImpl" in options
    ? options.AudioContextImpl
    : (typeof window !== "undefined"
        ? window.AudioContext || window.webkitAudioContext
        : undefined);
  const storage = "localStorage" in options
    ? options.localStorage
    : (typeof window !== "undefined"
        ? window.localStorage
        : undefined);
  let muted = true;

  if (storage) {
    try {
      const stored = storage.getItem(STORAGE_KEY);
      if (stored !== null) {
        muted = stored === "true";
      }
    } catch {
      muted = true;
    }
  }

  let ctx = null;
  let droneGain = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let isDisposed = false;

  const DRONE_VOLUME = 0.04;
  const MUTED_VOLUME = 0.0001;

  function initContext() {
    if (ctx || isDisposed) return;
    if (!AudioContextImpl) {
      throw new Error("AudioContext is not supported in this environment");
    }

    ctx = new AudioContextImpl();

    // Create shared drone gain
    droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(DRONE_VOLUME, ctx.currentTime || 0);
    droneGain.connect(ctx.destination);

    // Create 2 detuned low-frequency sine oscillators for sci-fi ambient drone
    droneOsc1 = ctx.createOscillator();
    droneOsc1.type = "sine";
    droneOsc1.frequency.setValueAtTime(55, ctx.currentTime || 0);
    droneOsc1.connect(droneGain);

    droneOsc2 = ctx.createOscillator();
    droneOsc2.type = "sine";
    droneOsc2.frequency.setValueAtTime(55.5, ctx.currentTime || 0);
    droneOsc2.connect(droneGain);

    droneOsc1.start();
    droneOsc2.start();
  }

  function persist(newMuted) {
    if (storage) {
      try {
        storage.setItem(STORAGE_KEY, String(newMuted));
      } catch {
        // Ignore storage errors (e.g. quota or security in private mode)
      }
    }
  }

  function toggle() {
    if (isDisposed) return;

    if (muted) {
      // Unmuting: instantiate if first time, then resume and ramp gain up
      try {
        if (!ctx) {
          initContext();
        }
        if (ctx && typeof ctx.resume === "function") {
          ctx.resume();
        }
        if (droneGain && droneGain.gain) {
          const now = ctx ? ctx.currentTime || 0 : 0;
          if (typeof droneGain.gain.linearRampToValueAtTime === "function") {
            droneGain.gain.linearRampToValueAtTime(DRONE_VOLUME, now + 0.1);
          } else {
            droneGain.gain.setValueAtTime(DRONE_VOLUME, now);
          }
        }
        muted = false;
        persist(false);
      } catch {
        // Fail-safe: if AudioContext cannot be initialized/resumed, stay muted
        muted = true;
      }
    } else {
      // Muting: ramp gain down and suspend if supported
      muted = true;
      persist(true);

      if (droneGain && droneGain.gain) {
        const now = ctx ? ctx.currentTime || 0 : 0;
        if (typeof droneGain.gain.linearRampToValueAtTime === "function") {
          droneGain.gain.linearRampToValueAtTime(MUTED_VOLUME, now + 0.1);
        } else {
          droneGain.gain.setValueAtTime(MUTED_VOLUME, now);
        }
      }

      // If AudioContext implementation lacks suspend() (such as mock setup),
      // volume ramp to ~0.0001 simulates silence safely.
      if (ctx && typeof ctx.suspend === "function") {
        try {
          ctx.suspend();
        } catch {
          // Ignore suspend failure
        }
      }
    }
  }

  function playClick() {
    if (isDisposed || muted || !ctx) return;

    try {
      const now = ctx.currentTime || 0;
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      clickOsc.type = "sine";
      clickOsc.frequency.setValueAtTime(1200, now);

      clickGain.gain.setValueAtTime(0.08, now);
      if (typeof clickGain.gain.exponentialRampToValueAtTime === "function") {
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      } else if (typeof clickGain.gain.linearRampToValueAtTime === "function") {
        clickGain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
      }

      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(now);
      const stopTime = now + 0.08;
      clickOsc.stop(stopTime);

      // Clean up nodes after click finishes
      setTimeout(() => {
        try {
          clickOsc.disconnect();
          clickGain.disconnect();
        } catch {
          // Ignore disconnect error
        }
      }, 100);
    } catch {
      // Safe no-op on audio error
    }
  }

  function dispose() {
    if (isDisposed) return;
    isDisposed = true;

    try {
      if (droneOsc1) {
        droneOsc1.stop();
        droneOsc1.disconnect();
      }
      if (droneOsc2) {
        droneOsc2.stop();
        droneOsc2.disconnect();
      }
      if (droneGain) {
        droneGain.disconnect();
      }
      if (ctx && typeof ctx.close === "function") {
        ctx.close();
      }
    } catch {
      // Idempotent safe cleanup without throwing
    } finally {
      droneOsc1 = null;
      droneOsc2 = null;
      droneGain = null;
      ctx = null;
    }
  }

  return {
    isMuted: () => muted,
    toggle,
    playClick,
    dispose,
  };
}
