import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SubpageNav from "../components/SubpageNav";
import ParchmentPage from "../components/ParchmentPage";
import ParchmentRibbon from "../components/ParchmentRibbon";
import { useLanguage } from "../context/LanguageContext";
import { projects } from "../constants";
import { arrow } from "../assets/icons";
import ProjectDrawer from "../components/ProjectDrawer";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const Projects = () => {
  const { t } = useLanguage();
  useDocumentTitle(t("projectsEyebrow"));
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const handleBack = () => {
    if (isExiting) return;
    setIsExiting(true);
  };

  const handleRollComplete = (isOpen) => {
    if (!isOpen) {
      navigate("/");
    }
  };

  const CATEGORY_LABELS = {
    all: t("filterAll"),
    "web3-crypto": t("catWeb3"),
    "fullstack-saas": t("catFullstack"),
    "ai-awards": t("catAi"),
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
    <ParchmentPage isOpen={!isExiting} onRollComplete={handleRollComplete}>
      <SubpageNav onBack={handleBack} />
      <div className="max-w-5xl mx-auto flex flex-col pt-8 sm:pt-6">
        <div className="flex flex-col gap-2.5 border-b border-[#8C5E32]/25 pb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#A66D38]" aria-hidden="true" />
            <span className="text-xs font-serif italic tracking-widest uppercase text-[#8C3E14] font-medium">
              {t("projectsEyebrow")}
            </span>
            <span className="w-8 h-px bg-[#A66D38]" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#241407] leading-tight tracking-tight">
            {t("projectsTitle")}
          </h1>
          <p className="font-serif text-base sm:text-lg text-[#4A2F17] leading-relaxed max-w-2xl mt-1">
            {t("projectsIntro")}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-2.5">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-serif px-3.5 py-1.5 rounded-sm transition-all flex items-center gap-1.5 border filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${
                  isActive
                    ? "bg-[#3D2511] text-[#F9F1E2] border-[#221307] font-semibold shadow-inner"
                    : "bg-[#F7EEDF]/90 text-[#4A2E16] border-[#A87948]/35 hover:border-[#8C3E14]/60 hover:text-[#241407] hover:bg-[#FFFBF5]"
                }`}
              >
                <span>{CATEGORY_LABELS[cat] || cat}</span>
                <span className="font-mono text-[11px] opacity-75">({count})</span>
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
                className={`p-6 sm:p-7 rounded-md border border-[#966C3E]/35 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-[#8C3E14]/60 hover:shadow-md group filter drop-shadow-[0_2px_6px_rgba(40,20,8,0.12)] ${
                  isFeatured
                    ? "md:col-span-2 lg:col-span-2 bg-[#FAF2E3]/95"
                    : "bg-[#F6EBD8]/80"
                }`}
                style={{
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 8px rgba(35,18,8,0.12)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#966C3E]/25">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#7A5328]">
                      {CATEGORY_LABELS[project.category] || project.category || t("projectDefaultCategory")}
                    </span>
                    <span className="text-xs font-serif font-semibold text-[#8C3E14] border border-[#A86438]/30 bg-[#ECD7B5]/60 px-2 py-0.5 rounded-sm">
                      {t("productionBadge")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-left w-full focus:outline-none"
                    aria-label={t("projectDetailAria").replace("{name}", project.name)}
                  >
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241407] group-hover:text-[#8C3E14] transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm font-serif text-[#452B14] line-clamp-3 leading-relaxed">
                      {t(project.description)}
                    </p>
                  </button>

                  {Array.isArray(project.tags) && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] px-2 py-0.5 rounded-sm bg-[#ECDABA] text-[#4A2F17] border border-[#9E7345]/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#966C3E]/25 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-serif font-semibold text-[#3D2511] hover:text-[#8C3E14] transition-colors flex items-center gap-1.5"
                  >
                    <span>{t("viewDetails")}</span>
                    <span>→</span>
                  </button>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("openProjectLinkAria")}
                      className="text-xs font-serif font-semibold text-[#8C3E14] hover:underline flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>{t("visitProject")}</span>
                      <img src={arrow} alt="Arrow" className="w-3 h-3 object-contain opacity-80" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-8 p-8 sm:p-10 rounded-md border-2 border-[#8C5E32]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          style={{
            background: "linear-gradient(135deg, #EFE2C8 0%, #E3D1AF 100%)",
            boxShadow: "inset 0 1px 3px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(60,34,16,0.2)",
          }}
        >
          <div>
            <span className="text-xs font-serif italic tracking-widest uppercase text-[#8C3E14] font-semibold">
              {t("collabEyebrow")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241407] mt-1">
              {t("collabProjectsTitle")}
            </h2>
            <p className="font-serif text-sm text-[#4E331B] mt-1.5 max-w-xl leading-relaxed">
              {t("collabProjectsDesc")}
            </p>
          </div>

          <ParchmentRibbon
            variant="tab"
            to="/contact"
            ariaLabel={t("collabCta")}
            className="shrink-0"
          >
            <span>{t("collabCta")}</span>
            <span aria-hidden="true" className="ml-1.5">
              →
            </span>
          </ParchmentRibbon>
        </div>

        <ProjectDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </ParchmentPage>
  );
};

export default Projects;
