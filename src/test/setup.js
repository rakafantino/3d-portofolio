import "@testing-library/jest-dom/vitest";

if (typeof window.matchMedia !== "function") {
  const makeQuery = (query) => ({
    matches:
      query.includes("max-width") &&
      window.innerWidth < parseInt(query.match(/\(max-width: (\d+)px\)/)?.[1] || "768", 10),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  window.matchMedia = makeQuery;
}

if (typeof globalThis.AnimationEvent === "undefined") {
  class MockAnimationEvent extends Event {
    constructor(type, eventInitDict = {}) {
      super(type, eventInitDict);
      this.animationName = eventInitDict.animationName || "";
      this.elapsedTime = eventInitDict.elapsedTime || 0;
      this.pseudoElement = eventInitDict.pseudoElement || "";
    }
  }
  globalThis.AnimationEvent = MockAnimationEvent;
  if (typeof window !== "undefined") {
    window.AnimationEvent = MockAnimationEvent;
  }
}

// Minimal Web Audio API mock for jsdom environment (consumed by audioEngine in Task 6)
if (typeof globalThis.AudioContext === "undefined") {
  class MockAudioContext {
    constructor() {
      this.state = "running";
      this.destination = {
        channelCount: 2,
        connect: () => {},
        disconnect: () => {},
      };
    }

    createOscillator() {
      return {
        type: "sine",
        frequency: {
          value: 440,
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
          linearRampToValueAtTime: () => {},
        },
        connect: () => {},
        disconnect: () => {},
        start: () => {},
        stop: () => {},
      };
    }

    createGain() {
      return {
        gain: {
          value: 1,
          setValueAtTime: () => {},
          exponentialRampToValueAtTime: () => {},
          linearRampToValueAtTime: () => {},
        },
        connect: () => {},
        disconnect: () => {},
      };
    }

    createBuffer(channels, length, sampleRate) {
      return {
        numberOfChannels: channels,
        length,
        sampleRate,
        duration: length / sampleRate,
        getChannelData: () => new Float32Array(length),
      };
    }

    createBufferSource() {
      return {
        buffer: null,
        playbackRate: {
          value: 1,
          setValueAtTime: () => {},
        },
        loop: false,
        connect: () => {},
        disconnect: () => {},
        start: () => {},
        stop: () => {},
      };
    }

    resume() {
      this.state = "running";
      return Promise.resolve();
    }

    close() {
      this.state = "closed";
      return Promise.resolve();
    }
  }

  globalThis.AudioContext = MockAudioContext;
}

if (typeof HTMLMediaElement !== "undefined") {
  if (!HTMLMediaElement.prototype.play || String(HTMLMediaElement.prototype.play).includes("Not implemented")) {
    HTMLMediaElement.prototype.play = function () {
      return Promise.resolve();
    };
  }
  if (!HTMLMediaElement.prototype.pause) {
    HTMLMediaElement.prototype.pause = function () {};
  }
}

// Minimal WebGLRenderingContext mock for jsdom canvas (prevents crashes when 3D contexts are probed)
if (typeof HTMLCanvasElement !== "undefined") {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (contextId, ...args) {
    if (contextId === "webgl" || contextId === "webgl2" || contextId === "experimental-webgl") {
      return {
        canvas: this,
        drawingBufferWidth: this.width || 300,
        drawingBufferHeight: this.height || 150,
        getParameter: () => "WebKit WebGL",
        getExtension: () => null,
        enable: () => {},
        disable: () => {},
        clear: () => {},
        clearColor: () => {},
        viewport: () => {},
      };
    }

    return originalGetContext ? originalGetContext.call(this, contextId, ...args) : null;
  };
}
