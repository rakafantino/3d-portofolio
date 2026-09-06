import sunsetDreamTrack from "../assets/audio/sunset-dream.mp3";

export const STORAGE_KEY = "cyber-audio-muted";
export const AUDIO_STATE_CHANGE_EVENT = "island-audio-state-changed";
export const DEFAULT_VOLUME = 0.35;

export function createAudioEngine(options = {}) {
  const AudioImpl = "AudioImpl" in options
    ? options.AudioImpl
    : (typeof window !== "undefined" ? window.Audio : undefined);

  const audioSrc = "audioSrc" in options
    ? options.audioSrc
    : sunsetDreamTrack;

  const storage = "localStorage" in options
    ? options.localStorage
    : (typeof window !== "undefined" ? window.localStorage : undefined);

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

  let audioElement = null;
  let isDisposed = false;
  const listeners = new Set();

  function notifyListeners() {
    listeners.forEach((fn) => {
      try {
        fn(muted);
      } catch {
        // Safe ignore
      }
    });

    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      try {
        window.dispatchEvent(
          new CustomEvent(AUDIO_STATE_CHANGE_EVENT, { detail: { muted } })
        );
      } catch {
        // Safe ignore
      }
    }
  }

  function initAudio() {
    if (audioElement || isDisposed) return;
    if (!AudioImpl) {
      throw new Error("HTML5 Audio is not supported in this environment");
    }

    audioElement = new AudioImpl(audioSrc);
    audioElement.loop = true;
    audioElement.volume = DEFAULT_VOLUME;
  }

  function persist(newMuted) {
    if (storage) {
      try {
        storage.setItem(STORAGE_KEY, String(newMuted));
      } catch {
        // Safe ignore
      }
    }
  }

  function play() {
    if (isDisposed) return;
    try {
      if (!audioElement) {
        initAudio();
      }

      if (audioElement && typeof audioElement.play === "function") {
        const playPromise = audioElement.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      }
      muted = false;
      persist(false);
      notifyListeners();
    } catch {
      muted = true;
      notifyListeners();
    }
  }

  function pause() {
    if (isDisposed) return;
    muted = true;
    persist(true);

    if (audioElement && typeof audioElement.pause === "function") {
      try {
        audioElement.pause();
      } catch {
        // Safe ignore
      }
    }
    notifyListeners();
  }

  function toggle() {
    if (isDisposed) return;

    if (muted) {
      play();
    } else {
      pause();
    }
  }

  function playClick() {
    // Safe no-op or click hook
  }

  function subscribe(listener) {
    if (typeof listener === "function") {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
    return () => {};
  }

  function dispose() {
    if (isDisposed) return;
    isDisposed = true;
    listeners.clear();

    try {
      if (audioElement) {
        if (typeof audioElement.pause === "function") {
          audioElement.pause();
        }
        if ("currentTime" in audioElement) {
          audioElement.currentTime = 0;
        }
      }
    } catch {
      // Safe ignore
    } finally {
      audioElement = null;
    }
  }

  return {
    isMuted: () => muted,
    play,
    pause,
    toggle,
    playClick,
    subscribe,
    dispose,
    getAudioElement: () => audioElement,
  };
}

let sharedAudioEngine = null;

export function getSharedAudioEngine(options = {}) {
  if (!sharedAudioEngine) {
    sharedAudioEngine = createAudioEngine(options);
  }
  return sharedAudioEngine;
}

export function resetSharedAudioEngine() {
  if (sharedAudioEngine) {
    sharedAudioEngine.dispose();
    sharedAudioEngine = null;
  }
}

