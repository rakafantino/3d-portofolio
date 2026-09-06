import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";
import { arrow } from "../assets/icons";

const ProjectDrawer = ({ project, onClose }) => {
  const { t } = useLanguage();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!project) return;

    const previousActiveElement = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
    };
  }, [project, onClose]);

  if (!project) return null;

  const categoryLabels = {
    "web3-crypto": t("catWeb3"),
    "fullstack-saas": t("catFullstack"),
    "ai-awards": t("catAi"),
  };

  const localizedCategory =
    (project.category && categoryLabels[project.category]) ||
    project.category ||
    t("projectDefaultCategory") ||
    "General";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-end md:flex-row"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-project-title"
    >
      <div
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div
        ref={drawerRef}
        className="relative z-10 w-full md:max-w-lg h-[88dvh] md:h-full rounded-t-2xl md:rounded-none p-6 sm:p-8 flex flex-col justify-between overflow-y-auto filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] text-[#241407]"
        style={{
          backgroundColor: "#F2E5CD",
          backgroundImage: `
            radial-gradient(ellipse at 50% 0%, rgba(255, 252, 244, 0.9) 0%, rgba(242, 229, 205, 0.4) 60%, rgba(160, 115, 65, 0.25) 90%, rgba(75, 42, 18, 0.45) 100%),
            linear-gradient(180deg, #FAF1E0 0%, #EFE1C5 30%, #E3D1AE 75%, #D4BD91 100%)
          `,
          boxShadow: "inset 0 0 25px rgba(60,32,14,0.3), inset 6px 0 16px rgba(45,22,9,0.4), inset -6px 0 16px rgba(45,22,9,0.4)",
          borderLeft: "3px solid #6E4926",
          borderTop: "3px solid #6E4926",
        }}
      >
        <div>
          <div
            className="w-12 h-1.5 bg-[#8C5E32]/40 rounded-full mx-auto mb-4 md:hidden"
            aria-hidden="true"
          />

          <div className="flex items-center justify-between border-b border-[#8C5E32]/30 pb-4 mb-6">
            <span className="text-xs font-serif italic tracking-widest uppercase text-[#8C3E14] font-semibold">
              {t("drawerEyebrow")}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="text-xs font-serif font-semibold text-[#4A2F17] hover:text-[#8C3E14] border border-[#9E7345]/40 hover:border-[#8C3E14]/60 px-3 py-1 rounded-sm bg-[#F7EEDF] transition-colors"
              aria-label={t("drawerCloseAria")}
            >
              {t("drawerCloseBtn")}
            </button>
          </div>

          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7A5328] mb-1 block">
              {t("drawerCategoryLabel")} {localizedCategory}
            </span>
            <h2 id="drawer-project-title" className="text-2xl sm:text-3xl font-bold font-serif text-[#241407]">
              {project.name}
            </h2>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A5328] mb-2">
              {t("drawerOverviewHeading")}
            </h3>
            <p className="text-sm sm:text-base font-serif text-[#452B14] leading-relaxed bg-[#FAF2E2] p-4 rounded-sm border border-[#A67543]/30">
              {t(project.description)}
            </p>
          </div>

          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A5328] mb-2">
                {t("drawerTechHeading")}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-sm bg-[#ECDABA] border border-[#9E7345]/35 text-[#3D2511]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#7A5328] mb-2">
              {t("drawerStatusHeading")}
            </h3>
            <div className="text-xs font-mono text-[#4A2F17] bg-[#FAF2E2]/90 p-3.5 rounded-sm border border-[#A67543]/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#7A5328]">{t("drawerStatusLabel")}</span>
                <span className="text-[#8C3E14] font-bold">{t("drawerStatusValue")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A5328]">{t("drawerArchLabel")}</span>
                <span>{project.tags?.slice(0, 3).join(" · ") || t("drawerArchDefault")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#8C5E32]/30 flex flex-col gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("openProjectLinkAria")}
              className="relative w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md font-serif text-sm font-bold text-[#FFF5E6] hover:text-[#FFFFFF] transition-all filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 active:scale-98 text-center"
              style={{
                background: "linear-gradient(180deg, #A8481E 0%, #873210 50%, #632209 100%)",
                border: "1.5px solid #C96838",
                boxShadow: "inset 0 1px 1px rgba(255,200,160,0.5), inset 0 -1px 2px rgba(0,0,0,0.6)",
              }}
            >
              <span>{t("drawerOpenLink")}</span>
              <img src={arrow} alt="Arrow" className="w-3.5 h-3.5 object-contain brightness-200" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

ProjectDrawer.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        en: PropTypes.string,
      }),
    ]),
    tags: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ProjectDrawer;
