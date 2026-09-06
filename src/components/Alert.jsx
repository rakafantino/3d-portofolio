import PropTypes from "prop-types";

const Alert = ({ type, text }) => {
  const isDanger = type === "danger";

  return (
    <div
      role="alert"
      className="fixed top-20 sm:top-24 left-4 right-4 z-50 flex justify-center items-center pointer-events-none transition-all duration-300 animate-fade-in"
    >
      <div
        className="pointer-events-auto relative max-w-md w-full px-4 py-3 rounded-[4px] filter drop-shadow-[0_8px_24px_rgba(20,12,6,0.7)] flex items-center gap-3 border"
        style={{
          background: isDanger
            ? "linear-gradient(180deg, #3A1512 0%, #200B09 100%)"
            : "linear-gradient(180deg, #241407 0%, #150B04 100%)",
          borderColor: isDanger ? "#A83226" : "#B88746",
          boxShadow: isDanger
            ? "inset 0 1px 2px rgba(255,140,140,0.3), inset 0 -2px 4px rgba(0,0,0,0.9), 0 0 16px rgba(168,50,38,0.3)"
            : "inset 0 1px 2px rgba(230,198,135,0.4), inset 0 -2px 4px rgba(0,0,0,0.9), 0 0 16px rgba(184,135,70,0.25)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
        />

        <div
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-serif font-bold text-xs shadow-inner"
          style={{
            background: isDanger
              ? "radial-gradient(circle at 35% 35%, #C23828 0%, #8C271E 60%, #4D120B 100%)"
              : "radial-gradient(circle at 35% 35%, #D4A75E 0%, #B88746 55%, #5E3E17 100%)",
            color: "#FFF5E0",
            border: isDanger ? "1px solid #E65C4F" : "1px solid #F0D49E",
          }}
        >
          {isDanger ? "✕" : "✓"}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-serif text-xs sm:text-sm font-medium text-[#F4E9D6] leading-snug">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
};

export default Alert;
