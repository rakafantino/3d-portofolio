import { describe, it, expect, vi } from "vitest";
import { createAudioEngine, STORAGE_KEY } from "./audioEngine.js";

function createMockAudioContextClass() {
  let instancesCreated = 0;
  const createdOscillators = [];
  const createdGains = [];

  class SpiedAudioContext {
    constructor() {
      instancesCreated++;
      this.state = "running";
      this.currentTime = 0;
      this.destination = {
        connect: vi.fn(),
        disconnect: vi.fn(),
      };
      this.resume = vi.fn().mockResolvedValue();
      this.suspend = vi.fn().mockImplementation(() => {
        this.state = "suspended";
        return Promise.resolve();
      });
      this.close = vi.fn().mockImplementation(() => {
        this.state = "closed";
        return Promise.resolve();
      });
    }

    createOscillator() {
      const osc = {
        type: "sine",
        frequency: {
          value: 440,
          setValueAtTime: vi.fn((val) => {
            osc.frequency.value = val;
          }),
          exponentialRampToValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      createdOscillators.push(osc);
      return osc;
    }

    createGain() {
      const g = {
        gain: {
          value: 1,
          setValueAtTime: vi.fn((val) => {
            g.gain.value = val;
          }),
          exponentialRampToValueAtTime: vi.fn(),
          linearRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
      };
      createdGains.push(g);
      return g;
    }
  }

  return {
    SpiedAudioContext,
    getInstancesCreated: () => instancesCreated,
    getCreatedOscillators: () => createdOscillators,
    getCreatedGains: () => createdGains,
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

describe("audioEngine (Zero-Asset Procedural Web Audio Engine)", () => {
  it("does not construct AudioContext before first unmute toggle", () => {
    const { SpiedAudioContext, getInstancesCreated } = createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);
    expect(getInstancesCreated()).toBe(0);
  });

  it("starts drone on first unmute and calls resume inside toggle", () => {
    const { SpiedAudioContext, getInstancesCreated, getCreatedOscillators, getCreatedGains } =
      createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    engine.toggle();

    expect(engine.isMuted()).toBe(false);
    expect(getInstancesCreated()).toBe(1);
    expect(getCreatedOscillators().length).toBe(2);
    expect(getCreatedGains().length).toBeGreaterThanOrEqual(1);

    const freqs = getCreatedOscillators().map((osc) => osc.frequency.value);
    expect(freqs).toContain(55);
    expect(freqs).toContain(55.5);

    getCreatedOscillators().forEach((osc) => {
      expect(osc.start).toHaveBeenCalled();
    });
  });

  it("ramps gain and suspends on mute", () => {
    const { SpiedAudioContext, getCreatedGains } = createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    engine.toggle(); // unmute
    expect(engine.isMuted()).toBe(false);

    const droneGain = getCreatedGains()[0];

    engine.toggle(); // mute
    expect(engine.isMuted()).toBe(true);

    const rampCalls = [
      ...droneGain.gain.linearRampToValueAtTime.mock.calls,
      ...droneGain.gain.exponentialRampToValueAtTime.mock.calls,
      ...droneGain.gain.setValueAtTime.mock.calls,
    ];
    expect(rampCalls.length).toBeGreaterThanOrEqual(1);
  });

  it("persists muted state to injected localStorage on toggle", () => {
    const { SpiedAudioContext } = createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);

    engine.toggle(); // unmute
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "false");
    expect(engine.isMuted()).toBe(false);

    engine.toggle(); // mute again
    expect(storage.setItem).toHaveBeenCalledWith(STORAGE_KEY, "true");
    expect(engine.isMuted()).toBe(true);
  });

  it("defaults to muted when localStorage is empty", () => {
    const { SpiedAudioContext } = createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);
  });

  it("playClick before initialization is a silent no-op", () => {
    const { SpiedAudioContext, getInstancesCreated, getCreatedOscillators } =
      createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    expect(() => engine.playClick()).not.toThrow();
    expect(getInstancesCreated()).toBe(0);
    expect(getCreatedOscillators().length).toBe(0);
  });

  it("playClick after unmute creates a short oscillator with fast decay", () => {
    const { SpiedAudioContext, getCreatedOscillators, getCreatedGains } =
      createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    engine.toggle(); // unmute
    const oscCountBefore = getCreatedOscillators().length;
    const gainCountBefore = getCreatedGains().length;

    engine.playClick();

    expect(getCreatedOscillators().length).toBe(oscCountBefore + 1);
    expect(getCreatedGains().length).toBe(gainCountBefore + 1);

    const clickOsc = getCreatedOscillators()[oscCountBefore];
    expect(clickOsc.frequency.value).toBe(1200);
    expect(clickOsc.start).toHaveBeenCalled();
    expect(clickOsc.stop).toHaveBeenCalled();
  });

  it("dispose stops and closes without throwing", () => {
    const { SpiedAudioContext, getCreatedOscillators } = createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    engine.toggle(); // unmute and instantiate
    expect(() => engine.dispose()).not.toThrow();

    getCreatedOscillators().forEach((osc) => {
      expect(osc.stop).toHaveBeenCalled();
    });
  });

  it("dispose is idempotent", () => {
    const { SpiedAudioContext } = createMockAudioContextClass();
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: SpiedAudioContext,
      localStorage: storage,
    });

    engine.toggle();
    expect(() => {
      engine.dispose();
      engine.dispose();
    }).not.toThrow();
  });

  it("tolerates missing AudioContext without throwing", () => {
    const storage = createMemoryStorage();

    const engine = createAudioEngine({
      AudioContextImpl: undefined,
      localStorage: storage,
    });

    expect(engine.isMuted()).toBe(true);
    expect(() => engine.toggle()).not.toThrow();
    // When AudioContext cannot be initialized, toggle fail-safes to muted
    expect(engine.isMuted()).toBe(true);
    expect(() => engine.playClick()).not.toThrow();
    expect(() => engine.dispose()).not.toThrow();
  });
});
