import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Story Zone Callout Card for Workshop Island.
 * Warm, human-language storytelling overlay.
 * Uses warm dusk palette: island-dark/island-border/island-sand/island-copper.
 * No cyber/cyan, no mono system labels, no "//", no "[01]" brackets.
 */
const StoryCard = ({ title, tag, headline, subline, links }) => (
  <div className="w-full rounded-2xl border border-island-border/80 bg-island-dark/95 backdrop-blur-md px-4 sm:px-5 py-3.5 shadow-2xl shadow-black/50 text-left">
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-serif font-medium text-island-sand">{title}</span>
      {tag && (
        <span className="text-[10px] font-mono text-copper/80 tracking-wider shrink-0">{tag}</span>
      )}
    </div>

    <p className="text-cream text-sm leading-snug mt-1">{headline}</p>
    {subline && (
      <p className="text-cream/60 text-xs leading-snug mt-0.5">{subline}</p>
    )}

    {links && links.length > 0 && (
      <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
        {links.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper ${
              action.primary
                ? "bg-copper hover:bg-copper-deep text-cream shadow-sm shadow-black/30"
                : "border border-island-border/70 text-cream/70 hover:text-cream hover:border-island-copper/60"
            }`}
          >
            <span>{action.label}</span>
            <span aria-hidden="true" className="text-island-sand">→</span>
          </Link>
        ))}
      </div>
    )}
  </div>
);

StoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  tag: PropTypes.string,
  headline: PropTypes.string.isRequired,
  subline: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      primary: PropTypes.bool,
    })
  ),
};

const renderContent = {
  // Zone 1: Intro / Identity
  1: (
    <div className="w-full rounded-2xl border border-island-border/80 bg-island-dark/95 backdrop-blur-md px-4 sm:px-5 py-3.5 shadow-2xl shadow-black/50 text-left">
      <p className="text-[10px] font-mono tracking-widest uppercase text-copper/90">
        Workshop Island
      </p>
      <h1 className="font-serif text-xl sm:text-2xl text-cream font-semibold tracking-tight leading-tight mt-0.5">
        Raka Fantino
      </h1>
      <p className="text-island-sand/90 text-sm mt-0.5">
        Frontend &amp; Fullstack Engineer · AI &amp; Web3 Builder
      </p>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-cream/55 text-[11px]">Putar dunia untuk menjelajahi karyaku.</span>
        <div className="flex items-center gap-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-copper hover:bg-copper-deep text-cream text-xs font-medium transition-colors shadow-sm shadow-black/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
          >
            <span>Lihat Proyek</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-island-border/70 text-cream/70 hover:text-cream hover:border-island-copper/60 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
          >
            Hubungi
          </Link>
        </div>
      </div>
    </div>
  ),

  // Zone 2: AI & Awards (Observatory Tower)
  2: (
    <StoryCard
      title="AI & Awards"
      tag="2025 · Prestasi Global"
      headline="Pemenang kompetisi internasional AI Singapore & Google Gemma Challenge."
      subline="Eksplorasi mendalam arsitektur model on-device, validasi prompt, dan aplikasi bertenaga LLM yang scalable."
      links={[
        { to: "/about", label: "Buka halaman About", primary: true },
        { to: "/projects", label: "Lihat karya AI" },
      ]}
    />
  ),

  // Zone 3: Web3 & Crypto (Reactor Lab)
  3: (
    <StoryCard
      title="Web3 & Crypto"
      tag="Solana · ICP · On-chain"
      headline="Perangkat trading presisi tinggi & game desentralisasi dengan on-chain randomness."
      subline="Membangun ekosistem NinjaPump.ai, game multi-chain Roshambo, hingga trading bot di jaringan Bitcoin Runes."
      links={[
        { to: "/projects", label: "Lihat Proyek Web3", primary: true },
      ]}
    />
  ),

  // Zone 4: Fullstack & Client (Workshop Barn)
  4: (
    <StoryCard
      title="Fullstack & Client Systems"
      tag="Produksi · Skalabilitas"
      headline="Membawa produk dari sketsa ide dan purwarupa hingga deployment produksi."
      subline="Pengalaman membangun sistem fullstack berkinerja tinggi, integrasi database serverless, dan UI responsif."
      links={[
        { to: "/projects", label: "Lihat Portofolio", primary: true },
        { to: "/contact", label: "Diskusi Proyek" },
      ]}
    />
  ),

  // Zone 5: Lighthouse (Contact Outcropping)
  5: (
    <StoryCard
      title="Mercusuar Kontak"
      tag="Siap Kolaborasi"
      headline="Tertarik membangun proyek bersama atau membuka peluang kerja baru?"
      subline="Pintu komunikasi selalu terbuka untuk diskusi teknis, kontrak lepas, maupun peran tim penuh waktu."
      links={[
        { to: "/contact", label: "Kirim Pesan", primary: true },
      ]}
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
