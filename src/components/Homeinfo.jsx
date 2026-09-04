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

  2: (
    <StoryCard
      title="Kabin Kerja / Tentang Saya"
      tag="Profil · Perjalanan · Etos Kerja"
      headline="Tempat ide dirancang, dibangun, dan diuji hingga ke detail terkecil."
      subline="Eksplorasi perjalanan rekayasa perangkat lunak, peran tim, dan dedikasi membangun produk berkinerja tinggi."
      links={[
        { to: "/about", label: "Buka halaman Tentang Saya", primary: true },
        { to: "/projects", label: "Lihat Proyek" },
      ]}
    />
  ),

  3: (
    <StoryCard
      title="Observatorium / Riset & Awards"
      tag="2025 · Google Gemma & AI Singapore"
      headline="Menembus batas eksplorasi kecerdasan buatan dan edge AI."
      subline="Pemenang kompetisi internasional AI Singapore dan Google Gemma 3n Impact Challenge (The Ollama Prize di Kaggle)."
      links={[
        { to: "/about", label: "Lihat Penghargaan", primary: true },
        { to: "/projects", label: "Karya AI" },
      ]}
    />
  ),

  4: (
    <StoryCard
      title="Laboratorium / Proyek Unggulan"
      tag="Solana · Web3 · Fullstack SaaS"
      headline="Mesin produksi teruji dengan throughput tinggi dan integrasi on-chain."
      subline="Membangun ekosistem trading NinjaPump.ai, game desentralisasi Roshambo (ICP/Solana), hingga platform berita Diklik.co."
      links={[
        { to: "/projects", label: "Jelajahi Semua Proyek", primary: true },
        { to: "/contact", label: "Diskusi Proyek" },
      ]}
    />
  ),

  5: (
    <StoryCard
      title="Mercusuar / Terhubung"
      tag="Kolaborasi · Peluang Terbuka"
      headline="Tertarik membangun proyek bersama atau membuka peluang kerja baru?"
      subline="Suar pemandu selalu aktif untuk diskusi teknis, kontrak lepas, maupun peran tim penuh waktu."
      links={[
        { to: "/contact", label: "Kirim Pesan Sekarang", primary: true },
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
