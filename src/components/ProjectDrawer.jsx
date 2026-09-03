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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-md h-full bg-cream border-l border-ink/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-xl text-ink"
      >
        <div>
          <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-6">
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-copper">
              Spesifikasi Proyek
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="text-xs font-sans text-ink-faint hover:text-ink border border-ink/15 hover:border-ink/40 px-2.5 py-1 rounded transition-colors"
              aria-label="Tutup detail proyek"
            >
              Tutup (ESC)
            </button>
          </div>

          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-1 block">
              Kategori: {project.category || "General"}
            </span>
            <h2 id="drawer-project-title" className="text-2xl sm:text-3xl font-semibold font-serif text-ink">
              {project.name}
            </h2>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-ink-faint mb-2">
              Ikhtisar &amp; Sasaran
            </h3>
            <p className="text-sm font-sans text-ink-soft leading-relaxed bg-white/70 p-4 rounded-xl border border-ink/10">
              {project.description}
            </p>
          </div>

          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-ink-faint mb-2">
                Teknologi &amp; Modul
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-cream-deep border border-ink/10 text-ink-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-ink-faint mb-2">
              Status Implementasi
            </h3>
            <div className="text-xs font-mono text-ink-soft bg-white/50 p-3.5 rounded-xl border border-ink/10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-ink-faint">Status:</span>
                <span className="text-copper font-medium">Tersedia di Produksi</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-faint">Arsitektur:</span>
                <span>{project.tags?.slice(0, 3).join(" · ") || "Modular"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-ink/10 flex flex-col gap-3">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka tautan proyek"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-sans text-sm font-medium bg-ink text-cream hover:bg-ink-soft transition-colors text-center"
            >
              <span>Buka Tautan Langsung</span>
              <img src={arrow} alt="Arrow" className="w-3.5 h-3.5 object-contain" />
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
