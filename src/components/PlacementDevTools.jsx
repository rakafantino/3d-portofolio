import { useState } from "react";
import PropTypes from "prop-types";

const ZONE_NAMES = {
  1: "Awal",
  2: "Tentang",
  3: "Riset & Awards",
  4: "Proyek & Lab",
  5: "Kontak",
};

const CARD_TEMPLATES = [
  { id: "bottom", label: "Bawah" },
  { id: "left", label: "Kiri" },
  { id: "right", label: "Kanan" },
];

const rounded = (value, decimals = 2) =>
  Math.round(parseFloat(value) * 10 ** decimals) / 10 ** decimals;

const RangeRow = ({ label, value, min, max, step, onChange, unit = "" }) => (
  <div>
    <div className="flex justify-between text-[10px] text-cream/60">
      <span>{label}</span>
      <span className="text-copper">
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-1 bg-island-border rounded accent-copper cursor-pointer"
    />
  </div>
);

RangeRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.string,
};

const PlacementDevTools = ({ device, config, onUpdate, onReset }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [zone, setZone] = useState(1);
  const [copyFeedback, setCopyFeedback] = useState("");

  const active = config[device].zones[zone];
  const activeFov = config[device].fov[zone];

  const updateZone = (patch) => {
    onUpdate(device, {
      ...config[device],
      zones: {
        ...config[device].zones,
        [zone]: { ...active, ...patch },
      },
    });
  };

  const updateFov = (value) => {
    onUpdate(device, {
      ...config[device],
      fov: { ...config[device].fov, [zone]: rounded(value) },
    });
  };

  const updateCard = (patch) => {
    updateZone({ card: { ...active.card, ...patch } });
  };

  const setAxis = (key, axis, value) => {
    const arr = [...active[key]];
    arr[axis] = rounded(value);
    updateZone({ [key]: arr });
  };

  const setTemplate = (templateId) => {
    const templates = {
      bottom: { vAlign: "bottom", hAlign: "center" },
      left: { vAlign: "center", hAlign: "left" },
      right: { vAlign: "center", hAlign: "right" },
    };
    updateZone({
      card: { ...active.card, ...templates[templateId], offsetX: 0, offsetY: 0 },
    });
  };

  const handleCopyAll = () => {
    const text = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(text);
    setCopyFeedback("Seluruh konfigurasi tersalin!");
    window.setTimeout(() => setCopyFeedback(""), 2500);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-[9999] px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs shadow-xl border border-amber-400/50 flex items-center gap-1.5 transition-transform hover:scale-105"
      >
        <span>🎥</span>
        <span>Placement DevTools</span>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-3 z-[9999] w-80 max-h-[80vh] flex flex-col rounded-xl border border-island-border/90 bg-[#1A140E]/95 backdrop-blur-md p-3 text-cream font-mono text-xs shadow-2xl shadow-black/80 select-none">
      <div className="flex items-center justify-between border-b border-island-border/70 pb-2 mb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-island-copper font-bold">
          <span>🎥</span>
          <span>Placement Tool</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-cream/50 hover:text-cream px-1.5 py-0.5 rounded border border-island-border/50 text-[10px]"
        >
          Tutup
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1 mb-2 shrink-0">
        {[
          { id: "desktop", label: "🖥 Desktop" },
          { id: "mobile", label: "📱 Mobile" },
        ].map((d) => (
          <div
            key={d.id}
            className={`py-1 rounded text-center transition-colors ${
              device === d.id
                ? "bg-copper/20 text-copper font-bold border border-copper/60"
                : "bg-island-border/20 text-cream/40 border border-transparent"
            }`}
          >
            {d.label}
            {device === d.id && " ●"}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1 mb-2 shrink-0">
        {[1, 2, 3, 4, 5].map((z) => (
          <button
            key={z}
            type="button"
            onClick={() => setZone(z)}
            title={ZONE_NAMES[z]}
            className={`py-1 rounded text-center transition-colors ${
              zone === z
                ? "bg-copper text-cream font-bold shadow"
                : "bg-island-border/30 text-cream/70 hover:bg-island-border/70"
            }`}
          >
            Z{z}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto flex-1 pr-1 space-y-3 text-[11px]">
        <div className="px-1 text-cream/40">
          Zona {zone}: {ZONE_NAMES[zone]}
        </div>

        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="text-island-sand font-semibold">📷 Kamera</div>
          <RangeRow
            label="FOV (zoom lens)"
            value={activeFov}
            min={20}
            max={90}
            step={1}
            unit="°"
            onChange={updateFov}
          />
          <RangeRow
            label="Posisi X"
            value={active.pos[0]}
            min={-5}
            max={5}
            step={0.05}
            onChange={(v) => setAxis("pos", 0, v)}
          />
          <RangeRow
            label="Posisi Y (tinggi)"
            value={active.pos[1]}
            min={0}
            max={5}
            step={0.05}
            onChange={(v) => setAxis("pos", 1, v)}
          />
          <RangeRow
            label="Posisi Z (zoom)"
            value={active.pos[2]}
            min={1}
            max={10}
            step={0.05}
            onChange={(v) => setAxis("pos", 2, v)}
          />
        </div>

        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="text-island-sand font-semibold">🎯 Titik Pandang</div>
          <RangeRow
            label="Target X"
            value={active.target[0]}
            min={-4}
            max={4}
            step={0.05}
            onChange={(v) => setAxis("target", 0, v)}
          />
          <RangeRow
            label="Target Y"
            value={active.target[1]}
            min={-1}
            max={4}
            step={0.05}
            onChange={(v) => setAxis("target", 1, v)}
          />
          <RangeRow
            label="Rotasi Pulau (Y)"
            value={active.islandRotY}
            min={-3.14}
            max={3.14}
            step={0.01}
            onChange={(v) => updateZone({ islandRotY: rounded(v) })}
          />
        </div>

        <div className="p-2 rounded bg-black/30 border border-island-border/40 space-y-2">
          <div className="text-island-sand font-semibold">🃏 Posisi Kartu</div>
          <div className="grid grid-cols-3 gap-1">
            {CARD_TEMPLATES.map((t) => {
              const isActive =
                active.card.hAlign ===
                  (t.id === "bottom"
                    ? "center"
                    : t.id === "left"
                    ? "left"
                    : "right") &&
                ((t.id === "bottom" && active.card.vAlign === "bottom") ||
                  (t.id !== "bottom" && active.card.vAlign === "center"));
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`py-1 rounded text-[10px] transition-colors ${
                    isActive
                      ? "bg-copper text-white font-bold"
                      : "bg-island-border/40 text-cream/70 hover:bg-island-border"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <RangeRow
            label="Offset X"
            value={active.card.offsetX}
            min={-200}
            max={200}
            step={1}
            unit="px"
            onChange={(v) => updateCard({ offsetX: rounded(v, 0) })}
          />
          <RangeRow
            label="Offset Y"
            value={active.card.offsetY}
            min={-200}
            max={200}
            step={1}
            unit="px"
            onChange={(v) => updateCard({ offsetY: rounded(v, 0) })}
          />
        </div>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-island-border/60 space-y-1.5 shrink-0">
        <button
          type="button"
          onClick={handleCopyAll}
          className="w-full py-1.5 rounded bg-copper hover:bg-copper-deep text-cream text-[10px] font-semibold tracking-wider uppercase transition-colors shadow"
        >
          📋 Copy Semua Konfigurasi
        </button>
        <button
          type="button"
          onClick={onReset}
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

PlacementDevTools.propTypes = {
  device: PropTypes.oneOf(["desktop", "mobile"]).isRequired,
  config: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default PlacementDevTools;
