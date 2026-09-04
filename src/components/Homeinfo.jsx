import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Minimal StoryCard for Workshop Island zones.
 * Structure: eyebrow (landmark) -> title -> one-line description -> slim arrow link.
 * Uses warm dusk palette tokens only (island-dark/island-border/copper/cream).
 */
const StoryCard = ({ eyebrow, title, description, to, cta }) => (
  <div className="w-full rounded-xl border border-island-border/60 bg-island-dark/85 backdrop-blur-md px-4 py-3 text-left shadow-lg shadow-black/20">
    {eyebrow && (
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-copper/90">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-0.5 font-serif text-lg leading-tight text-cream">
      {title}
    </h2>
    {description && (
      <p className="mt-1 text-xs leading-relaxed text-cream/70">{description}</p>
    )}
    {to && cta && (
      <Link
        to={to}
        className="group mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-copper hover:text-copper-deep transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper rounded-sm"
      >
        <span>{cta}</span>
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    )}
  </div>
);

StoryCard.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  to: PropTypes.string,
  cta: PropTypes.string,
};

const ArrowLink = ({ to, children, primary = false }) => (
  <Link
    to={to}
    className={`group inline-flex items-center gap-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper rounded-sm ${
      primary ? "text-copper hover:text-copper-deep" : "text-cream/70 hover:text-cream"
    }`}
  >
    <span>{children}</span>
    <span
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-0.5"
    >
      →
    </span>
  </Link>
);

ArrowLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  primary: PropTypes.bool,
};

const renderContent = {
  1: (
    <div className="w-full rounded-xl border border-island-border/60 bg-island-dark/85 backdrop-blur-md px-4 py-3 text-left shadow-lg shadow-black/20">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-copper/90">
        Workshop Island
      </p>
      <h1 className="mt-0.5 font-serif text-lg leading-tight text-cream">
        Raka Fantino
      </h1>
      <p className="mt-1 text-xs leading-relaxed text-cream/70">
        Frontend &amp; Fullstack Engineer · AI &amp; Web3 Builder
      </p>
      <div className="mt-2 flex items-center gap-3">
        <ArrowLink to="/projects" primary>
          Lihat Proyek
        </ArrowLink>
        <ArrowLink to="/contact">Hubungi</ArrowLink>
      </div>
    </div>
  ),

  2: (
    <StoryCard
      eyebrow="Kabin Kerja"
      title="Tentang Saya"
      description="Perjalanan, pengalaman & etos kerja di balik workshop ini."
      to="/about"
      cta="Selengkapnya"
    />
  ),

  3: (
    <StoryCard
      eyebrow="Observatorium"
      title="Riset & Awards"
      description="Pemenang kompetisi AI Singapore & Google Gemma 3n Impact."
      to="/about"
      cta="Selengkapnya"
    />
  ),

  4: (
    <StoryCard
      eyebrow="Reaktor Mesin"
      title="Proyek & Lab"
      description="NinjaPump, Roshambo & proyek pilihan lainnya."
      to="/projects"
      cta="Selengkapnya"
    />
  ),

  5: (
    <StoryCard
      eyebrow="Mercusuar"
      title="Kontak"
      description="Terbuka untuk diskusi, kolaborasi, atau peran baru."
      to="/contact"
      cta="Selengkapnya"
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
