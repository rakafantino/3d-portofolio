import { useState } from "react";
import PropTypes from "prop-types";

/**
 * UltimatePlacementDevTools
 * Unified calibration tool for Camera (Pos, LookAt, Island Rotation)
 * and Card Free-Placement (X%, Y%) across Desktop & Mobile modes.
 * Features 1-click full export to clipboard.
 */
const UltimatePlacementDevTools = ({
  currentStage,
  onSelectStage,
  config,
  onUpdateConfig,
  onResetConfig,
  defaultCollapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);
  const [deviceMode, setDeviceMode] = useState("desktop"); // 'desktop' | 'mobile'
  const [copyFeedback, setCopyFeedback] = useState("");

  const activeModeConfig = config[deviceMode] || config.desktop;
  const activeFraming = activeModeConfig[currentStage] || activeModeConfig[1];

  const updateParam = (key, index, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;

    const newModeConfig = { ...activeModeConfig };
    const newFraming = { ...activeFraming };

    if (index !== null && Array.isArray(newFraming[key])) {
      const arr = [...newFraming[key]];
      arr[index] = Math.round(num * 100) / 100;
      newFraming[key] = arr;
    } else {
      newFraming[key] = Math.round(num * 100) / 100;
    }

    newModeConfig[currentStage] = newFraming;

    onUpdateConfig({
      ...config,
      [deviceMode]: newModeConfig,
    });
  };

  const handleCopyAll = () => {
    const text = `export const CALIBRATED_CONFIG = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(text);
    setCopyFeedback("Semua Config (Desktop & Mobile) Tersalin!");
    setTimeout(() => setCopyFeedback(""), 3000);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-[9999] px-3.5 py-2 rounded-lg bg-copper hover:bg-copper-deep text-cream font-mono text-xs shadow-2xl border border-island-copper/60 flex items-center gap-2 transition-transform hover:scale-105"
      >
        <span>🎯</span>
        <span>Placement DevTool</span>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-[9999] w-84 max-h-[82vh] flex flex-col rounded-xl border border-island-border/90 bg-[#1A140E]/95 backdrop-blur-md p-3.5 text-cream font-mono text-xs shadow-2xl shadow-black/80 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-island-border/70 pb-2 mb-2.5 shrink-0">
        <div className="flex items-center gap-1.5 text-island-copper font-bold">
          <span>🎯</span>
          <span>Placement &amp; Card Tuner</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-cream/50 hover:text-cream px-1.5 py-0.5 rounded border border-island-border/50 text-[10px]"
        >
          Minimalkan
        </button>
      </div>

      {/* Device Mode Switcher (Desktop vs Mobile) */}
      <div className="flex gap-1 mb-2.5 p-1 rounded-lg bg-black/40 border border-island-border/50 shrink-0">
        <button
          type="button"
          onClick={() => setDeviceMode("desktop")}
          className={`flex-1 py-1 rounded text-center font-bold text-[11px] transition-colors ${
            deviceMode === "desktop"
              ? "bg-copper text-cream shadow"
              : "text-cream/60 hover:text-cream"
          }`}
        >
          💻 Desktop
        </button>
        <button
          type="button"
          onClick={() => setDeviceMode("mobile")}
          className={`flex-1 py-1 rounded text-center font-bold text-[11px] transition-colors ${
            deviceMode === "mobile"
              ? "bg-copper text-cream shadow"
              : "text-cream/60 hover:text-cream"
          }`}
        >
          📱 Mobile
        </button>
      </div>

      {/* Zone Switcher */}
      <div className="mb-2 shrink-0">
        <div className="flex justify-between text-[10px] text-cream/50 uppercase tracking-wider mb-1">
          <span>Pilih Zona:</span>
          <span className="text-copper">Mode: {deviceMode.toUpperCase()}</span>
        </div>
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

      {/* Scrollable Sliders */}
      <div className="overflow-y-auto flex-1 pr-1 space-y-3 text-[11px]">
        {/* 1. Camera Position */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-1.5">
          <div className="flex justify-between text-island-sand font-semibold">
            <span>📹 Posisi Kamera (X, Y, Z)</span>
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
              <span>Pos Y (Ketinggian)</span>
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
              <span>Pos Z (Jarak / Zoom)</span>
              <span>{activeFraming.pos[2]}</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="10"
              step="0.05"
              value={activeFraming.pos[2]}
              onChange={(e) => updateParam("pos", 2, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Camera LookAt Target */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-1.5">
          <div className="flex justify-between text-island-sand font-semibold">
            <span>🎯 Target LookAt (X, Y)</span>
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

        {/* 3. Island Rotation Y */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-1">
          <div className="flex justify-between text-island-sand font-semibold">
            <span>🔄 Rotasi Pulau Y (Rad)</span>
            <span className="text-copper">{activeFraming.islandRotY}</span>
          </div>
          <input
            type="range"
            min="-3.14"
            max="3.14"
            step="0.02"
            value={activeFraming.islandRotY}
            onChange={(e) => updateParam("islandRotY", null, e.target.value)}
            className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
          />
        </div>

        {/* 4. Card Free-Placement (Posisi Kartu Bebas X% & Y%) */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="flex justify-between text-island-sand font-semibold">
            <span>📍 Posisi Kartu Bebas (X%, Y%)</span>
            <span className="text-copper">
              {activeFraming.cardPos ? `${activeFraming.cardPos[0]}%, ${activeFraming.cardPos[1]}%` : "Auto"}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Horisontal X (0% Kiri → 100% Kanan)</span>
              <span>{activeFraming.cardPos ? activeFraming.cardPos[0] : 50}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={activeFraming.cardPos ? activeFraming.cardPos[0] : 50}
              onChange={(e) => updateParam("cardPos", 0, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Vertikal Y (0% Atas → 100% Bawah)</span>
              <span>{activeFraming.cardPos ? activeFraming.cardPos[1] : 50}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              step="1"
              value={activeFraming.cardPos ? activeFraming.cardPos[1] : 50}
              onChange={(e) => updateParam("cardPos", 1, e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Copy Actions */}
      <div className="mt-2.5 pt-2.5 border-t border-island-border/60 space-y-1.5 shrink-0">
        <button
          type="button"
          onClick={handleCopyAll}
          className="w-full py-2 rounded bg-copper hover:bg-copper-deep text-cream text-[11px] font-bold tracking-wider uppercase transition-colors shadow-lg flex items-center justify-center gap-1.5"
        >
          <span>📋</span>
          <span>Copy Semua Config</span>
        </button>

        <button
          type="button"
          onClick={onResetConfig}
          className="w-full py-1 text-[10px] text-cream/50 hover:text-cream/80 text-center"
        >
          ↺ Reset ke Default
        </button>

        {copyFeedback && (
          <div className="text-center text-emerald-400 font-bold text-[10px] animate-pulse">
            ✓ {copyFeedback}
          </div>
        )}
      </div>
    </div>
  );
};

UltimatePlacementDevTools.propTypes = {
  currentStage: PropTypes.number.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  onUpdateConfig: PropTypes.func.isRequired,
  onResetConfig: PropTypes.func.isRequired,
  defaultCollapsed: PropTypes.bool,
};

export default UltimatePlacementDevTools;
