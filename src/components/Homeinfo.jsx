import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Story Zone Callout Card for Workshop Island.
 * Warm, human-language storytelling overlay.
 * Uses warm dusk palette: island-dark/island-border/island-sand/island-copper.
 * No cyber/cyan, no mono system labels, no "//", no "[01]" brackets.
 */
const StoryCard = ({ title, tag, headline, subline, links }) => (
  <div className="w-[min(32rem,calc(100vw-2rem))] mx-auto rounded-2xl border border-island-border/80 bg-island-dark/85 backdrop-blur-md px-5 sm:px-6 py-4 sm:py-5 shadow-2xl shadow-black/50 text-left transition-all duration-300">
    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-island-border/60 text-xs">
      <span className="font-serif font-medium text-island-sand text-sm">
        {title}
      </span>
      {tag && (
        <span className="text-[11px] font-mono text-copper/80 tracking-wider">
          {tag}
        </span>
      )}
    </div>

    <p className="text-cream text-sm sm:text-base font-normal leading-snug mb-1.5">
      {headline}
    </p>

    {subline && (
      <p className="text-cream/65 text-xs sm:text-[13px] leading-relaxed mb-3">
        {subline}
      </p>
    )}

    {links && links.length > 0 && (
      <div className="pt-2.5 border-t border-island-border/50 flex flex-wrap items-center justify-end gap-2.5">
        {links.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper ${
              action.primary
                ? "bg-copper hover:bg-copper-deep text-cream shadow-md shadow-black/20"
                : "border border-island-border text-cream/70 hover:text-cream hover:border-island-copper/60 bg-island-black/40"
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
    <div className="w-[min(32rem,calc(100vw-2rem))] mx-auto rounded-2xl border border-island-border/80 bg-island-dark/85 backdrop-blur-md px-6 py-5 shadow-2xl shadow-black/50 text-center">
      <p className="text-xs font-mono tracking-widest uppercase text-copper/90 mb-1">
        Workshop Island · Riau, ID
      </p>
      <h1 className="font-serif text-2xl sm:text-3xl text-cream font-semibold tracking-tight leading-tight">
        Raka Fantino
      </h1>
      <p className="text-island-sand/90 text-sm sm:text-base font-normal mt-1 leading-relaxed">
        Frontend & Fullstack Engineer · AI & Web3 Builder
      </p>
      <p className="text-cream/55 text-xs mt-2.5 pt-2.5 border-t border-island-border/60">
        Putar dunia ini untuk menjelajahi karya, atau langsung kunjungi halaman di bawah.
      </p>
      <div className="mt-3.5 flex items-center justify-center gap-2.5">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-copper hover:bg-copper-deep text-cream text-xs font-medium transition-colors shadow-md shadow-black/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
        >
          <span>Lihat Proyek</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-island-border text-cream/70 hover:text-cream hover:border-island-copper/60 bg-island-black/40 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
        >
          <span>Hubungi</span>
        </Link>
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
