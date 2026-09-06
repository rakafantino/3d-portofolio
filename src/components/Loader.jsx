import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();
  const rounded = Math.min(100, Math.max(0, Math.round(progress || 0)));
  const formatted = String(rounded).padStart(2, "0");

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-island-black/80 backdrop-blur-xl border border-island-border/70 shadow-2xl min-w-[220px] select-none text-center space-y-4">
        {/* Glowing Copper Gauge */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              className="text-island-border/50"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              className="text-copper transition-all duration-300 ease-out"
              strokeWidth="2.5"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (125.6 * rounded) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs font-semibold text-copper">
              {formatted}%
            </span>
          </div>
        </div>

        {/* Serif & Monospace Atmospheric Prompt */}
        <div className="space-y-1">
          <p className="font-serif text-sm font-medium text-cream tracking-wide">
            Menyiapkan Atmosfer
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-copper/80">
            Sunset Workshop Island
          </p>
        </div>
      </div>
    </Html>
  );
};

export default Loader;
