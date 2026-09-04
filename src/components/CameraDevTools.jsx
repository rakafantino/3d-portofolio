import { useState } from "react";
import PropTypes from "prop-types";

/**
 * CameraDevTools (Temporary Development Tool)
 * Allows real-time interactive adjustment of camera position, lookAt target,
 * island rotation, and card alignment per zone.
 * Includes one-click copy to clipboard for easy handoff.
 */
const CameraDevTools = ({
  currentStage,
  onSelectStage,
  framings,
  onUpdateFraming,
  onResetFramings,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState("");

  const activeFraming = framings[currentStage] || framings[1];

  const updateParam = (key, index, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;

    const newFraming = { ...activeFraming };
    if (index !== null && Array.isArray(newFraming[key])) {
      const arr = [...newFraming[key]];
      arr[index] = Math.round(num * 100) / 100;
      newFraming[key] = arr;
    } else {
      newFraming[key] = Math.round(num * 100) / 100;
    }

    onUpdateFraming(currentStage, newFraming);
  };

  const setAlignment = (align) => {
    onUpdateFraming(currentStage, {
      ...activeFraming,
      cardAlignment: align,
    });
  };

  const handleCopyCurrent = () => {
    const text = `  ${currentStage}: {\n    pos: [${activeFraming.pos.join(", ")}],\n    target: [${activeFraming.target.join(", ")}],\n    islandRotY: ${activeFraming.islandRotY},\n    cardAlignment: "${activeFraming.cardAlignment}",\n  },`;
    navigator.clipboard.writeText(text);
    setCopyFeedback("Zone " + currentStage + " copied!");
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  const handleCopyAll = () => {
    const lines = Object.entries(framings).map(([stage, f]) => {
      return `  ${stage}: {\n    pos: [${f.pos.join(", ")}],\n    target: [${f.target.join(", ")}],\n    islandRotY: ${f.islandRotY},\n    cardAlignment: "${f.cardAlignment}",\n  },`;
    });
    const text = `const CAMERA_FRAMINGS = {\n${lines.join("\n")}\n};`;
    navigator.clipboard.writeText(text);
    setCopyFeedback("All 5 zones copied!");
    setTimeout(() => setCopyFeedback(""), 2000);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-[9999] px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs shadow-xl border border-amber-400/50 flex items-center gap-1.5 transition-transform hover:scale-105"
      >
        <span>🛠️</span>
        <span>Cam DevTools</span>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-[9999] w-80 max-h-[76vh] flex flex-col rounded-xl border border-island-border/90 bg-[#1A140E]/95 backdrop-blur-md p-3.5 text-cream font-mono text-xs shadow-2xl shadow-black/80 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-island-border/70 pb-2 mb-2.5 shrink-0">
        <div className="flex items-center gap-1.5 text-island-copper font-bold">
          <span>🛠️</span>
          <span>Camera Positioning Tool</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-cream/50 hover:text-cream px-1.5 py-0.5 rounded border border-island-border/50 text-[10px]"
        >
          Minimalkan
        </button>
      </div>

      <div className="overflow-y-auto flex-1 pr-1 space-y-3">
        {/* Zone Tabs */}
        <div>
          <div className="text-[10px] text-cream/50 uppercase tracking-wider mb-1">Pilih Zona:</div>
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 3, 4, 5].map((stg) => (
              <button
                key={stg}
                type="button"
                onClick={() => onSelectStage(stg)}
                className={`py-1 rounded text-center transition-colors ${
                  currentStage === stg
                    ? "bg-copper text-cream font-bold shadow"
                    : "bg-island-border/30 text-cream/70 hover:bg-island-border/70"
                }`}
              >
                Z{stg}
              </button>
            ))}
          </div>
        </div>

      {/* Sliders for Active Zone */}
      <div className="space-y-3 text-[11px]">
        {/* Camera Position */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="flex justify-between text-island-sand font-semibold">
            <span>Camera Position (X, Y, Z)</span>
            <span className="text-copper">[{activeFraming.pos.join(", ")}]</span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Pos X (Kiri/Kanan)</span>
              <span>{activeFraming.pos[0]}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.05"
              value={activeFraming.pos[0]}
              onChange={(e) => updateParam("pos", 0, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Pos Y (Tinggi/Rendah)</span>
              <span>{activeFraming.pos[1]}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.05"
              value={activeFraming.pos[1]}
              onChange={(e) => updateParam("pos", 1, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Pos Z (Zoom Dekat/Jauh)</span>
              <span>{activeFraming.pos[2]}</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="0.05"
              value={activeFraming.pos[2]}
              onChange={(e) => updateParam("pos", 2, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>

        {/* Camera LookAt Target */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="flex justify-between text-island-sand font-semibold">
            <span>Camera LookAt Target</span>
            <span className="text-copper">[{activeFraming.target.join(", ")}]</span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Target X</span>
              <span>{activeFraming.target[0]}</span>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.05"
              value={activeFraming.target[0]}
              onChange={(e) => updateParam("target", 0, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Target Y</span>
              <span>{activeFraming.target[1]}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="3"
              step="0.05"
              value={activeFraming.target[1]}
              onChange={(e) => updateParam("target", 1, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>

        {/* Island Rotation Y */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-1.5">
          <div className="flex justify-between text-island-sand font-semibold">
            <span>Island Rotation Y (Rad)</span>
            <span className="text-copper">{activeFraming.islandRotY}</span>
          </div>
          <input
            type="range"
            min="-3.14"
            max="3.14"
            step="0.05"
            value={activeFraming.islandRotY}
            onChange={(e) => updateParam("islandRotY", null, e.target.value)}
            className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
          />
        </div>

        {/* Card Alignment */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-1.5">
          <div className="text-island-sand font-semibold">Card Alignment:</div>
          <div className="grid grid-cols-3 gap-1">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => setAlignment(align)}
                className={`py-0.5 rounded text-[10px] uppercase ${
                  activeFraming.cardAlignment === align
                    ? "bg-copper text-white font-bold"
                    : "bg-island-border/40 text-cream/70 hover:bg-island-border"
                }`}
              >
                {align}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Copy Actions */}
      <div className="mt-2.5 pt-2.5 border-t border-island-border/60 space-y-1.5 shrink-0">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={handleCopyCurrent}
            className="flex-1 py-1.5 rounded bg-copper hover:bg-copper-deep text-cream text-[10px] font-semibold tracking-wider uppercase transition-colors"
          >
            📋 Copy Zona {currentStage}
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            className="flex-1 py-1.5 rounded bg-island-border hover:bg-island-border/80 text-cream text-[10px] font-semibold tracking-wider uppercase transition-colors"
          >
            📋 Copy Semua
          </button>
        </div>

        <button
          type="button"
          onClick={onResetFramings}
          className="w-full py-1 text-[10px] text-cream/50 hover:text-cream/80 text-center"
        >
          ↺ Reset ke Default
        </button>

        {copyFeedback && (
          <div className="text-center text-emerald-400 font-semibold text-[10px] animate-pulse">
            ✓ {copyFeedback}
          </div>
        )}
      </div>
    </div>
  );
};

CameraDevTools.propTypes = {
  currentStage: PropTypes.number.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  framings: PropTypes.object.isRequired,
  onUpdateFraming: PropTypes.func.isRequired,
  onResetFramings: PropTypes.func.isRequired,
};

export default CameraDevTools;
