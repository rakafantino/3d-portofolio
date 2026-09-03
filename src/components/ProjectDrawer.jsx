import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { arrow } from "../assets/icons";

const ProjectDrawer = ({ project, onClose }) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-project-title"
    >
      <div
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-cyber-black/70 backdrop-blur-sm transition-opacity"
      />

      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-md h-full bg-cyber-dark border-l border-cyber-border p-6 flex flex-col justify-between overflow-y-auto shadow-2xl text-slate-200"
      >
        <div>
          <div className="flex items-center justify-between border-b border-cyber-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-cyber-cyan">
                {"// MISSION_SPEC"}
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="font-mono text-xs text-slate-400 hover:text-cyber-cyan border border-cyber-border hover:border-cyber-cyan px-2.5 py-1 rounded transition-colors"
              aria-label="Close project details"
            >
              [ ESC / CLOSE ]
            </button>
          </div>

          <div className="mb-6">
            <div className="telemetry-badge text-slate-400 mb-2">
              CATEGORY: {project.category || "GENERAL"}
            </div>
            <h2 id="drawer-project-title" className="text-2xl font-bold font-poppins text-white">
              {project.name}
            </h2>
          </div>

          <div className="mb-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2">
              {"// BRIEF & OBJECTIVES"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-cyber-slate/50 p-4 rounded-lg border border-cyber-border">
              {project.description}
            </p>
          </div>

          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2">
                {"// TECH STACK & MODULES"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-cyber-slate border border-cyber-border text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2">
              {"// ARCHITECTURE BREAKDOWN"}
            </h3>
            <div className="text-xs font-mono text-slate-400 bg-cyber-slate/30 p-3 rounded border border-cyber-border/70 space-y-1">
              <div>STATUS: VERIFIED_DEPLOYMENT</div>
              <div>STACK_PROFILE: {project.tags?.join(" · ") || "MODULAR"}</div>
              <div>ACCESS_MODE: LIVE_PRODUCTION</div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-cyber-border flex flex-col gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded font-mono text-xs font-semibold uppercase tracking-wider bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan/90 transition-all"
            >
              <span>OPEN IN NEW TAB</span>
              <img src={arrow} alt="Arrow" className="w-3.5 h-3.5 object-contain invert" />
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
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ProjectDrawer;
