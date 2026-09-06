import { describe, it, expect, vi } from "vitest";
import { createAudioEngine, STORAGE_KEY, DEFAULT_VOLUME } from "./audioEngine.js";

function createMockAudioClass() {
  let instancesCreated = 0;
  const instances = [];

  class MockAudio {
    constructor(src) {
      instancesCreated++;
      this.src = src;
      this.loop = false;
      this.volume = 1;
      this.currentTime = 0;
      this.paused = true;
      this.play = vi.fn().mockImplementation(() => {
        this.paused = false;
        return Promise.resolve();
      });
      this.pause = vi.fn().mockImplementation(() => {
        this.paused = true;
      });
      instances.push(this);
    }
  }

  return {
    MockAudio,
    getInstancesCreated: () => instancesCreated,
    getInstances: () => instances,
  };
}

function createMemoryStorage(initialStore = {}) {
  const store = { ...initialStore };
  return {
    getItem: vi.fn((key) => (key in store ? store[key] : null)),
    setItem: vi.fn((key, val) => {
      store[key] = String(val);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    _store: store,
  };
}

describe("audioEngine (HTML5 Audio Soundtrack Engine)", () => {
  it("does not construct Audio element before first unmute toggle", () => {
    const { MockAudio, getInstancesCreated } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);
    expect(getInstancesCreated()).toBe(0);
  });

  it("instantiates Audio with audioSrc, sets loop=true, volume ~0.35, and calls play() on unmute", () => {
    const { MockAudio, getInstancesCreated, getInstances } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
      audioSrc: "custom-soundtrack.mp3",
    });

    engine.toggle();

    expect(engine.isMuted()).toBe(false);
    expect(getInstancesCreated()).toBe(1);

    const audio = getInstances()[0];
    expect(audio.src).toBe("custom-soundtrack.mp3");
    expect(audio.loop).toBe(true);
    expect(audio.volume).toBeCloseTo(0.35, 2);
    expect(audio.play).toHaveBeenCalled();
  });

  it("defaults to sunset-dream.mp3 as audioSrc when not provided", () => {
    const { MockAudio, getInstances } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    engine.toggle();

    const audio = getInstances()[0];
    expect(audio.src).toBeDefined();
    expect(typeof audio.src).toBe("string");
    expect(audio.src).toContain("sunset-dream.mp3");
  });

  it("pauses audio when muted after being unmuted", () => {
    const { MockAudio, getInstances } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    engine.toggle();
    expect(engine.isMuted()).toBe(false);

    const audio = getInstances()[0];
    expect(audio.play).toHaveBeenCalledTimes(1);

    engine.toggle();
    expect(engine.isMuted()).toBe(true);
    expect(audio.pause).toHaveBeenCalledTimes(1);
  });

  it("persists muted state to injected localStorage on toggle", () => {
    const { MockAudio } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);

    engine.toggle();
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "false");
    expect(engine.isMuted()).toBe(false);

    engine.toggle();
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "true");
    expect(engine.isMuted()).toBe(true);
  });

  it("defaults to muted when localStorage is empty", () => {
    const { MockAudio } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);
  });

  it("reads stored mute preference from localStorage on initialization", () => {
    const { MockAudio } = createMockAudioClass();
    const storage = createMemoryStorage({ [STORAGE_KEY]: "false" });

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(false);
  });

  it("playClick is a safe no-op that does not throw", () => {
    const { MockAudio, getInstancesCreated } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    expect(() => engine.playClick()).not.toThrow();
    expect(getInstancesCreated()).toBe(0);
  });

  it("dispose pauses audio, resets currentTime, and does not throw", () => {
    const { MockAudio, getInstances } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    engine.toggle();
    const audio = getInstances()[0];

    expect(engine.getAudioElement()).toBe(audio);
    expect(() => engine.dispose()).not.toThrow();
    expect(audio.pause).toHaveBeenCalled();
    expect(engine.getAudioElement()).toBeNull();
  });

  it("dispose is idempotent", () => {
    const { MockAudio } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    engine.toggle();
    expect(() => {
      engine.dispose();
      engine.dispose();
    }).not.toThrow();
  });

  it("tolerates missing Audio implementation without throwing and fail-safes to muted", () => {
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: undefined,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);
    expect(() => engine.toggle()).not.toThrow();
    expect(engine.isMuted()).toBe(true);
    expect(() => engine.playClick()).not.toThrow();
    expect(() => engine.dispose()).not.toThrow();
  });

  it("handles Audio play rejection without throwing", () => {
    class RejectingAudio {
      constructor(src) {
        this.src = src;
        this.loop = false;
        this.volume = 1;
        this.play = vi.fn().mockRejectedValue(new Error("NotAllowedError: play() failed"));
        this.pause = vi.fn();
      }
    }

    const storage = createMemoryStorage();
    const engine = createAudioEngine({
      AudioImpl: RejectingAudio,
      localStorage: storage,
    });

    expect(() => engine.toggle()).not.toThrow();
    expect(engine.isMuted()).toBe(false);
  });

  it("exports DEFAULT_VOLUME as approximately 0.35", () => {
    expect(DEFAULT_VOLUME).toBeCloseTo(0.35, 2);
  });

  it("supports play() and pause() directly and triggers listeners", () => {
    const { MockAudio, getInstances } = createMockAudioClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioImpl: MockAudio,
      localStorage: storage,
    });

    const listener = vi.fn();
    const unsubscribe = engine.subscribe(listener);

    engine.play();
    expect(engine.isMuted()).toBe(false);
    expect(listener).toHaveBeenCalledWith(false);
    expect(getInstances()[0].play).toHaveBeenCalled();

    engine.pause();
    expect(engine.isMuted()).toBe(true);
    expect(listener).toHaveBeenCalledWith(true);
    expect(getInstances()[0].pause).toHaveBeenCalled();

    unsubscribe();
    engine.play();
    expect(listener).toHaveBeenCalledTimes(2); // not called again after unsubscribe
  });
});
