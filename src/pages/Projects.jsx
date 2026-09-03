import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { projects } from "../constants";
import { arrow } from "../assets/icons";
import ProjectDrawer from "../components/ProjectDrawer";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  // Display labels for raw category slugs (labels derived from the data's keys)
  const CATEGORY_LABELS = {
    all: "ALL",
    "web3-crypto": "WEB3 & CRYPTO",
    "fullstack-saas": "FULLSTACK & SaaS",
    "ai-awards": "AI & AWARDS",
  };

  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ["all", ...rawCategories];
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: projects.length };
    projects.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="max-container">
      <div className="mb-2">
        <span className="telemetry-badge text-cyber-cyan">
          {"// PROJECT_LOG"}
        </span>
      </div>

      <h1 className="head-text text-white">
        Featured <span className="text-cyber-cyan font-semibold drop-shadow">Projects</span>
      </h1>

      <div className="mt-4 flex flex-col gap-3 text-slate-400 max-w-3xl">
        <p className="font-sans leading-relaxed">
          Production systems, autonomous trading tools, and multi-chain decentralized applications built across Solana, ICP, and modern fullstack architectures. Click any module to inspect technical specifications.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        {categories.map((cat) => {
          const isActive = activeFilter === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`font-mono text-xs uppercase px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-cyber-cyan text-cyber-black font-semibold shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                  : "bg-cyber-dark text-slate-400 border border-cyber-border hover:border-cyber-cyan/50 hover:text-slate-200"
              }`}
            >
              <span>[ {CATEGORY_LABELS[cat] || cat} ({count}) ]</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 my-12">
        {filteredProjects.map((project, idx) => {
          const isFeatured = activeFilter === "all" && idx === 0;

          return (
            <div
              key={project.name}
              className={`terminal-card p-6 flex flex-col justify-between transition-all duration-200 hover:border-cyber-cyan/70 hover:shadow-[0_0_16px_rgba(0,240,255,0.12)] group ${
                isFeatured ? "md:col-span-2 xl:col-span-2" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-cyber-border/60">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    {project.category || "MODULE"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/80 group-hover:bg-cyber-cyan animate-pulse" />
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      ACTIVE
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="text-left w-full group/btn focus:outline-none"
                  aria-label={`View details for ${project.name}`}
                >
                  <h3 className="text-xl font-poppins font-semibold text-white group-hover/btn:text-cyber-cyan transition-colors">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </button>

                {Array.isArray(project.tags) && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-cyber-slate/80 border border-cyber-border text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-cyber-border/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="font-mono text-xs text-slate-400 hover:text-cyber-cyan transition-colors flex items-center gap-1"
                >
                  <span>{"// SPEC"}</span>
                  <span className="text-cyber-cyan">→</span>
                </button>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-cyber-cyan hover:underline flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>LIVE LINK</span>
                    <img src={arrow} alt="Arrow" className="w-3 h-3 object-contain invert" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 terminal-card p-8 border border-cyber-border bg-gradient-to-r from-cyber-dark to-cyber-slate flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="telemetry-badge text-cyber-cyan block mb-2">
            {"// TRANSMISSION_OPEN"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-white">
            Have a project in orbit?
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Open for technical advisory, Web3 engineering, and full-cycle system architecture.
          </p>
        </div>

        <Link
          to="/contact"
          className="w-full md:w-auto font-mono text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 transition-all text-center shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
        >
          Initiate Contact →
        </Link>
      </div>

      <ProjectDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;
