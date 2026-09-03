import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Cyber Telemetry Callout Card for Stage Navigation.
 * Formatted with .terminal-card and .cyber-border-glow with font-mono metadata headers.
 */
const CyberInfoBox = ({ nodeCode, label, headline, subline, link, btnText }) => (
  <div className="terminal-card cyber-border-glow px-5 py-4 max-w-lg mx-4 text-left font-mono relative backdrop-blur-md bg-cyber-black/85 transition-all duration-300">
    <div className="flex items-center justify-between border-b border-cyber-border/70 pb-2 mb-2.5 text-xs text-cyber-cyan">
      <span className="flex items-center gap-1.5 font-semibold tracking-wider">
        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
        {`[${nodeCode} // ${label}]`}
      </span>
      <span className="text-[10px] text-gray-400 uppercase tracking-widest">TELEMETRY_FEED</span>
    </div>

    <p className="text-gray-200 text-sm sm:text-base font-medium font-sans mb-1 leading-snug">
      {headline}
    </p>

    {subline && (
      <p className="text-gray-400 text-xs font-mono mb-3 leading-relaxed">
        {subline}
      </p>
    )}

    {link && btnText && (
      <div className="pt-2 border-t border-cyber-border/50 flex justify-end">
        <Link
          to={link}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-slate/90 hover:bg-cyber-cyan/20 border border-cyber-border hover:border-cyber-cyan text-cyber-cyan text-xs font-mono font-semibold tracking-wider uppercase transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
        >
          {btnText}
          <span aria-hidden="true" className="text-cyber-amber">→</span>
        </Link>
      </div>
    )}
  </div>
);

CyberInfoBox.propTypes = {
  nodeCode: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  subline: PropTypes.string,
  link: PropTypes.string,
  btnText: PropTypes.string,
};

const renderContent = {
  1: (
    <div className="terminal-card cyber-border-glow px-6 py-4 max-w-lg mx-4 text-center font-mono backdrop-blur-md bg-cyber-black/85">
      <div className="flex items-center justify-center gap-2 mb-2 text-xs text-cyber-cyan">
        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
        <span className="tracking-widest font-semibold">{"[01 // SYS_INIT]"}</span>
        <span className="text-[10px] text-gray-400 uppercase">SYSTEM_READY</span>
      </div>
      <h1 className="text-base sm:text-lg text-gray-100 font-sans font-bold leading-tight">
        Raka Fantino
      </h1>
      <p className="text-cyber-cyan text-xs sm:text-sm font-mono mt-0.5 tracking-wide">
        Fullstack Engineer / AI & Web3 Builder
      </p>
      <p className="text-gray-400 text-xs font-mono mt-2 pt-2 border-t border-cyber-border/70">
        Drag canvas or click HUD scrubber nodes below to navigate orbit.
      </p>
    </div>
  ),
  2: (
    <CyberInfoBox
      nodeCode="02"
      label="AI_AWARDS"
      headline="Awarded in Google Gemma 3n Challenge & Pan-SEA AI Challenge."
      subline="Deep credentials across engineering roles, blockchain games, and fullstack client systems."
      link="/about"
      btnText="VIEW PERSONNEL FILE"
    />
  ),
  3: (
    <CyberInfoBox
      nodeCode="03"
      label="WEB3_ARSENAL"
      headline="High-throughput Solana trading toolkits & ICP on-chain randomness games."
      subline="Production architectures spanning NinjaPump.ai, Roshambo, PupsBot, and client platforms."
      link="/projects"
      btnText="VIEW PROJECT LOG"
    />
  ),
  4: (
    <CyberInfoBox
      nodeCode="04"
      label="COMMS_LINK"
      headline="Direct transmission line open for technical roles & project contracts."
      subline="Dispatch inquiries, architecture requests, or secure messaging channel."
      link="/contact"
      btnText="OPEN COMMS CHANNEL"
    />
  ),
};

const Homeinfo = ({ currentStage }) => {
  return renderContent[currentStage] || null;
};

Homeinfo.propTypes = {
  currentStage: PropTypes.number,
};

export default Homeinfo;
