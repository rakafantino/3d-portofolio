import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { projects } from "../constants";
import { arrow } from "../assets/icons";
import ProjectDrawer from "../components/ProjectDrawer";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const CATEGORY_LABELS = {
    all: "Semua",
    "web3-crypto": "Web3 & Crypto",
    "fullstack-saas": "Fullstack & SaaS",
    "ai-awards": "AI & Inovasi",
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
    <div className="min-h-[100dvh] bg-cream text-ink">
      <section className="max-w-5xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 pb-20 flex flex-col">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-sans font-semibold tracking-wider uppercase text-copper">
            Portofolio
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-ink leading-tight tracking-tight">
            Proyek Pilihan
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl mt-1">
            Koleksi sistem produksi, bot otomasi perdagangan, dan aplikasi terdesentralisasi multi-chain
            yang dibangun di atas ekosistem Solana, ICP, serta arsitektur fullstack modern.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-sans px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-ink text-cream border-ink font-medium"
                    : "bg-white/70 text-ink-soft border-ink/15 hover:border-ink/30 hover:text-ink"
                }`}
              >
                <span>{CATEGORY_LABELS[cat] || cat}</span>
                <span className="text-[11px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
          {filteredProjects.map((project, idx) => {
            const isFeatured = activeFilter === "all" && idx === 0;

            return (
              <div
                key={project.name}
                className={`bg-white/80 p-6 sm:p-7 rounded-2xl border border-ink/10 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-copper/40 hover:shadow-sm group ${
                  isFeatured ? "md:col-span-2 lg:col-span-2 bg-white" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-ink/10">
                    <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                      {CATEGORY_LABELS[project.category] || project.category || "Proyek"}
                    </span>
                    <span className="text-[11px] font-sans font-medium text-copper">
                      Produksi
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-left w-full focus:outline-none"
                    aria-label={`Detail proyek ${project.name}`}
                  >
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink group-hover:text-copper transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm font-sans text-ink-soft line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </button>

                  {Array.isArray(project.tags) && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] px-2.5 py-0.5 rounded-md bg-cream-deep text-ink-soft border border-ink/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-sans font-medium text-ink-soft hover:text-copper transition-colors flex items-center gap-1"
                  >
                    <span>Lihat Detail</span>
                    <span>→</span>
                  </button>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Buka tautan proyek"
                      className="text-xs font-sans font-medium text-copper hover:underline flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Kunjungi</span>
                      <img src={arrow} alt="Arrow" className="w-3 h-3 object-contain" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-cream-deep border border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-copper">
              Kolaborasi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mt-1">
              Punya proyek atau ide kolaborasi?
            </h2>
            <p className="font-sans text-sm text-ink-soft mt-1.5 max-w-xl leading-relaxed">
              Terbuka untuk konsultasi teknis, integrasi Web3, dan rekayasa antarmuka berbasis performa.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-ink text-cream hover:bg-ink-soft transition-colors font-sans text-sm font-medium shrink-0"
          >
            Hubungi saya →
          </Link>
        </div>

        <ProjectDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </section>
    </div>
  );
};

export default Projects;
