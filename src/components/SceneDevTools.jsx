import { useState } from "react";
import PropTypes from "prop-types";

/**
 * SceneDevTools
 * Real-time development tool for tuning Lighting & Camera framings.
 * Allows interactive adjustment of Ambient, Directional (Sun), Hemisphere, and Fill lights.
 */
const SceneDevTools = ({
  currentStage,
  onSelectStage,
  lighting,
  onUpdateLighting,
  onResetLighting,
  defaultCollapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);
  const [copyFeedback, setCopyFeedback] = useState("");

  const updateLight = (lightType, key, value) => {
    const num = parseFloat(value);
    const newLighting = { ...lighting };

    if (key === "pos") {
      // value is [index, val]
      const [idx, v] = value;
      const arr = [...newLighting[lightType].position];
      arr[idx] = Math.round(parseFloat(v) * 10) / 10;
      newLighting[lightType].position = arr;
    } else if (typeof newLighting[lightType][key] === "number") {
      newLighting[lightType][key] = Math.round(num * 100) / 100;
    } else {
      newLighting[lightType][key] = value;
    }

    onUpdateLighting(newLighting);
  };

  const handleCopyLighting = () => {
    const text = `export const LIGHTING_CONFIG = ${JSON.stringify(lighting, null, 2)};`;
    navigator.clipboard.writeText(text);
    setCopyFeedback("Lighting config copied!");
    setTimeout(() => setCopyFeedback(""), 2500);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-[9999] px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs shadow-xl border border-amber-400/50 flex items-center gap-1.5 transition-transform hover:scale-105"
      >
        <span>💡</span>
        <span>Lighting DevTools</span>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-[9999] w-80 max-h-[78vh] flex flex-col rounded-xl border border-island-border/90 bg-[#1A140E]/95 backdrop-blur-md p-3.5 text-cream font-mono text-xs shadow-2xl shadow-black/80 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-island-border/70 pb-2 mb-2.5 shrink-0">
        <div className="flex items-center gap-1.5 text-island-copper font-bold">
          <span>💡</span>
          <span>Studio Lighting Tool</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-cream/50 hover:text-cream px-1.5 py-0.5 rounded border border-island-border/50 text-[10px]"
        >
          Minimalkan
        </button>
      </div>

      {/* Zone Switcher */}
      <div className="mb-2 shrink-0">
        <div className="text-[10px] text-cream/50 uppercase tracking-wider mb-1">Cek di Zona:</div>
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

      {/* Scrollable Lighting Sliders */}
      <div className="overflow-y-auto flex-1 pr-1 space-y-3 text-[11px]">
        {/* 1. Main Sun Directional Light */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="flex justify-between items-center text-island-sand font-semibold">
            <span>☀️ Main Sun Light</span>
            <input
              type="color"
              value={lighting.sun.color}
              onChange={(e) => updateLight("sun", "color", e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              title="Pilih warna matahari"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Intensitas Matahari</span>
              <span className="text-copper">{lighting.sun.intensity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.1"
              value={lighting.sun.intensity}
              onChange={(e) => updateLight("sun", "intensity", e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Arah X (Kiri/Kanan Matahari)</span>
              <span>{lighting.sun.position[0]}</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={lighting.sun.position[0]}
              onChange={(e) => updateLight("sun", "pos", [0, e.target.value])}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Tinggi Y (Ketinggian Matahari)</span>
              <span>{lighting.sun.position[1]}</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={lighting.sun.position[1]}
              onChange={(e) => updateLight("sun", "pos", [1, e.target.value])}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Jarak Z (Depan/Belakang)</span>
              <span>{lighting.sun.position[2]}</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={lighting.sun.position[2]}
              onChange={(e) => updateLight("sun", "pos", [2, e.target.value])}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Ambient Light (Kecerahan Dasar Ruangan) */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="flex justify-between items-center text-island-sand font-semibold">
            <span>💡 Ambient Light (Dasar)</span>
            <input
              type="color"
              value={lighting.ambient.color}
              onChange={(e) => updateLight("ambient", "color", e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              title="Warna ambient"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Intensitas Ambient</span>
              <span className="text-copper">{lighting.ambient.intensity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.05"
              value={lighting.ambient.intensity}
              onChange={(e) => updateLight("ambient", "intensity", e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Hemisphere Sky/Ground Light */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="flex justify-between items-center text-island-sand font-semibold">
            <span>🌍 Hemisphere (Langit & Tanah)</span>
            <div className="flex gap-1">
              <input
                type="color"
                value={lighting.hemi.skyColor}
                onChange={(e) => updateLight("hemi", "skyColor", e.target.value)}
                className="w-4 h-4 rounded cursor-pointer bg-transparent border-0"
                title="Warna langit"
              />
              <input
                type="color"
                value={lighting.hemi.groundColor}
                onChange={(e) => updateLight("hemi", "groundColor", e.target.value)}
                className="w-4 h-4 rounded cursor-pointer bg-transparent border-0"
                title="Warna tanah"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Intensitas Hemisphere</span>
              <span className="text-copper">{lighting.hemi.intensity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.05"
              value={lighting.hemi.intensity}
              onChange={(e) => updateLight("hemi", "intensity", e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Fill/Rim Backlight */}
        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="flex justify-between items-center text-island-sand font-semibold">
            <span>✨ Fill / Rim Light</span>
            <input
              type="color"
              value={lighting.fill.color}
              onChange={(e) => updateLight("fill", "color", e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              title="Warna fill light"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Intensitas Fill</span>
              <span className="text-copper">{lighting.fill.intensity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.05"
              value={lighting.fill.intensity}
              onChange={(e) => updateLight("fill", "intensity", e.target.value)}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-cream/60">
              <span>Posisi X</span>
              <span>{lighting.fill.position[0]}</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="0.5"
              value={lighting.fill.position[0]}
              onChange={(e) => updateLight("fill", "pos", [0, e.target.value])}
              className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Copy Actions */}
      <div className="mt-2.5 pt-2.5 border-t border-island-border/60 space-y-1.5 shrink-0">
        <button
          type="button"
          onClick={handleCopyLighting}
          className="w-full py-1.5 rounded bg-copper hover:bg-copper-deep text-cream text-[10px] font-semibold tracking-wider uppercase transition-colors shadow"
        >
          📋 Copy Config Lighting
        </button>

        <button
          type="button"
          onClick={onResetLighting}
          className="w-full py-1 text-[10px] text-cream/50 hover:text-cream/80 text-center"
        >
          ↺ Reset Lighting ke Default
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

SceneDevTools.propTypes = {
  currentStage: PropTypes.number.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  lighting: PropTypes.object.isRequired,
  onUpdateLighting: PropTypes.func.isRequired,
  onResetLighting: PropTypes.func.isRequired,
  defaultCollapsed: PropTypes.bool,
};

export default SceneDevTools;
