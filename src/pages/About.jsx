import { Link } from "react-router-dom";
import { awards, skills, experiences } from "../constants";

/**
 * About Page - Credibility Timeline & Systems Profile
 *
 * Sections:
 * 1. Header: Cyber kicker (// PERSONNEL_FILE) + authentic head-text with cyan accent.
 * 2. Featured Awards: Hero recognition banner (.terminal-card + .cyber-border-glow)
 *    featuring Pan-SEA AI Dev Challenge Winner, Google Gemma 3n Impact Challenge Winner,
 *    and Web foundations.
 * 3. Systems Profile (Skills): Categorized by type (Frontend, Backend, State Management,
 *    Animation, Version Control, Database) into labeled groups of icon tiles.
 * 4. Engineering Journey (Experiences):
 *    - Main Tech Timeline: custom lightweight timeline with cyan node dots and left border.
 *    - Origin Ops Sub-section: Compact cards for operational and creative roles.
 * 5. Inline Cyber Callout: Replaces legacy CTA with unified terminal callout.
 */
const About = () => {
  // Group skills by type
  const skillsByType = skills.reduce((acc, skill) => {
    const type = skill.type || "General";
    if (!acc[type]) acc[type] = [];
    acc[type].push(skill);
    return acc;
  }, {});

  // Separate tech engineering experiences from operations/creative
  const techExperiences = experiences.filter((exp) => exp.category === "tech");
  const originExperiences = experiences.filter(
    (exp) => exp.category === "operations" || exp.category === "creative"
  );

  return (
    <section className="max-container">
      {/* 1. Header */}
      <div className="flex flex-col gap-2">
        <div className="font-mono text-xs text-cyber-cyan tracking-widest uppercase telemetry-badge">
          {"// PERSONNEL_FILE"}
        </div>
        <h1 className="head-text text-white">
          Hello, I&apos;m{" "}
          <span className="font-bold text-cyber-cyan tracking-wide">
            Raka
          </span>
        </h1>
        <div className="mt-3 flex flex-col gap-3 text-slate-400 font-sans text-base max-w-3xl leading-relaxed">
          <p>
            Software engineer based in Indonesia specializing in full-stack web development,
            distributed Web3 systems, and edge AI applications. Experienced across high-throughput
            decentralized platforms, automated trading bots, and enterprise web solutions.
          </p>
        </div>
      </div>

      {/* 2. Featured Awards Banner (Hero Element) */}
      <div className="mt-12">
        <div className="terminal-card cyber-border-glow p-6 sm:p-8 rounded-xl relative overflow-hidden bg-cyber-dark">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-amber animate-pulse shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
              <h2 className="text-xl sm:text-2xl font-poppins font-bold text-white tracking-wide">
                Verified Credentials &amp; Honors
              </h2>
            </div>
            <span className="font-mono text-xs text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/30 px-3 py-1 rounded-full uppercase tracking-widest self-start sm:self-auto">
              [ PRIZE_VERIFIED ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((award, index) => {
              const isWin =
                award.date.includes("2025") ||
                award.title.toLowerCase().includes("winner") ||
                award.title.toLowerCase().includes("prize");

              return (
                <div
                  key={`award-${index}`}
                  className={`p-5 rounded-lg border flex flex-col justify-between transition-all ${
                    isWin
                      ? "bg-cyber-slate/70 border-cyber-amber/40 shadow-[0_0_15px_rgba(255,184,0,0.08)] border-l-4 border-l-cyber-amber"
                      : "bg-cyber-slate/40 border-cyber-border border-l-2 border-l-cyber-cyan"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 font-mono text-xs text-slate-400 mb-2">
                      <span className={isWin ? "text-cyber-amber font-semibold" : "text-cyber-cyan font-semibold"}>
                        {award.issuer}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{award.date}</span>
                    </div>
                    <h3 className="text-white font-semibold text-base leading-snug font-poppins mb-2">
                      {award.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">
                      {award.description}
                    </p>
                  </div>
                  {isWin && (
                    <div className="mt-4 pt-3 border-t border-cyber-border/50 flex items-center justify-between text-[10px] font-mono text-cyber-amber">
                      <span>HONOR: FIRST TIER</span>
                      <span>✓ VERIFIED</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Categorized Skills Radar / Systems Profile */}
      <div className="py-16 flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase telemetry-badge">
            {"// SYSTEMS_PROFILE"}
          </span>
        </div>
        <h2 className="subhead-text text-white">Technical Arsenal</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Core technical competencies categorized by architecture layer, tooling discipline, and runtime environment.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsByType).map(([category, categorySkills]) => (
            <div
              key={category}
              className="terminal-card p-5 rounded-lg border border-cyber-border bg-cyber-dark/80 flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-cyber-border pb-3 mb-4">
                <h3 className="font-mono text-sm font-semibold text-cyber-cyan tracking-wider uppercase">
                  {category}
                </h3>
                <span className="font-mono text-xs text-slate-500">
                  {categorySkills.length} MODULES
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex flex-col items-center justify-center p-3 rounded bg-cyber-slate/50 border border-cyber-border/80 hover:border-cyber-cyan/50 hover:bg-cyber-slate transition-all group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center mb-2">
                      <img
                        src={skill.imageUrl}
                        alt={skill.name}
                        className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 group-hover:text-cyber-cyan text-center truncate max-w-full">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Engineering Journey Timeline */}
      <div className="py-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase telemetry-badge">
            {"// ENGINEERING_LOGS"}
          </span>
        </div>
        <h2 className="subhead-text text-white">Engineering Timeline</h2>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Production software roles, decentralized system developments, and client deliverables.
        </p>

        {/* Custom lightweight timeline (Zero vertical-timeline library dependency) */}
        <div className="mt-12 relative border-l-2 border-cyber-border ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12">
          {techExperiences.map((exp, index) => (
            <div key={`tech-exp-${index}`} className="relative group">
              {/* Cyan node dot on timeline */}
              <div
                className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-cyber-dark border-2 border-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.7)] group-hover:bg-cyber-cyan transition-colors"
                aria-hidden="true"
              />

              {/* Experience Card */}
              <div className="terminal-card p-6 rounded-xl border border-cyber-border bg-cyber-dark/90 hover:border-cyber-cyan/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyber-border/80 pb-4 mb-4">
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-poppins font-semibold">
                      {exp.title}
                    </h3>
                    <p className="text-cyber-cyan font-mono text-sm tracking-wide mt-0.5">
                      {exp.company_name}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-slate-400 bg-cyber-slate/80 border border-cyber-border px-3 py-1 rounded self-start sm:self-auto">
                    {exp.date}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {exp.points.map((point, pIndex) => (
                    <li
                      key={`point-${pIndex}`}
                      className="text-slate-300 font-sans text-sm flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-cyber-cyan font-mono select-none mt-0.5">▸</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Origin & Operations Sub-section (Authentic non-tech story) */}
        {originExperiences.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-slate-500 tracking-widest uppercase telemetry-badge border-l-slate-600">
                {"// ORIGIN_OPS"}
              </span>
            </div>
            <h3 className="text-xl font-poppins font-semibold text-slate-300">
              Operations &amp; Creative Foundations
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              Field operational leadership, infrastructure logistics, and executive documentation before full-time engineering.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {originExperiences.map((exp, index) => (
                <div
                  key={`origin-exp-${index}`}
                  className="terminal-card p-5 rounded-lg border border-cyber-border/70 bg-cyber-dark/50"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-cyber-border/50 pb-3 mb-3">
                    <span className="font-mono text-[11px] text-slate-400">{exp.date}</span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase px-2 py-0.5 rounded bg-cyber-slate/50 border border-cyber-border">
                      {exp.category}
                    </span>
                  </div>
                  <h4 className="text-slate-200 font-semibold text-base font-poppins">
                    {exp.title}
                  </h4>
                  <p className="text-slate-400 font-mono text-xs mt-0.5 mb-3">
                    {exp.company_name}
                  </p>
                  <ul className="space-y-2">
                    {exp.points.map((point, pIndex) => (
                      <li
                        key={`origin-point-${pIndex}`}
                        className="text-slate-400 text-xs flex items-start gap-2 leading-relaxed"
                      >
                        <span className="text-slate-600 font-mono select-none">▪</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="border-cyber-border my-12" />

      {/* 5. Unified Inline Cyber Callout */}
      <section className="terminal-card p-8 sm:p-10 rounded-xl border border-cyber-border bg-cyber-dark flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-mono text-xs text-cyber-cyan tracking-widest uppercase mb-1">
            {"// TRANSMISSION_CHANNEL"}
          </div>
          <h3 className="text-2xl font-poppins font-bold text-white tracking-wide">
            Have a project in orbit?
          </h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Open for fullstack systems engineering, Web3 protocol integration, and specialized technical contracts.
          </p>
        </div>
        <Link
          to="/contact"
          className="btn !bg-none bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 font-mono font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0 text-center"
        >
          Initiate Contact &gt;
        </Link>
      </section>
    </section>
  );
};

export default About;
