import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Noticeable & Clear StoryCard for Workshop Island.
 * Features prominent, high-contrast action buttons so visitors instantly
 * understand how to navigate deeper into the portfolio without confusion.
 */
const StoryCard = ({ eyebrow, title, description, to, ctaText }) => (
  <div className="w-full rounded-2xl border border-island-border bg-[#18120C]/95 backdrop-blur-md p-4 sm:p-5 text-left shadow-2xl shadow-black/80 transition-all">
    {/* Eyebrow / Landmark indicator */}
    <div className="flex items-center gap-2 mb-1">
      <span className="w-1.5 h-1.5 rounded-full bg-copper" aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-wider text-copper font-medium">
        {eyebrow}
      </span>
    </div>

    {/* Title */}
    <h2 className="font-serif text-lg sm:text-xl font-bold text-cream tracking-tight leading-snug">
      {title}
    </h2>

    {/* Crisp description */}
    {description && (
      <p className="mt-1 text-xs text-cream/75 leading-relaxed">
        {description}
      </p>
    )}

    {/* Prominent Action Button (Unmissable affordance) */}
    {to && ctaText && (
      <div className="mt-3.5 pt-2.5 border-t border-island-border/50">
        <Link
          to={to}
          className="w-full inline-flex items-center justify-between px-3.5 py-2 rounded-lg bg-copper hover:bg-copper-deep text-cream text-xs font-medium tracking-wide shadow-md shadow-black/40 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-island-copper"
        >
          <span>{ctaText}</span>
          <span
            aria-hidden="true"
            className="text-island-sand text-sm transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    )}
  </div>
);

StoryCard.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  to: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
};

const renderContent = {
  // Zone 1: Overview Awal
  1: (
    <div className="w-full rounded-2xl border border-island-border bg-[#18120C]/95 backdrop-blur-md p-4 sm:p-5 text-left shadow-2xl shadow-black/80">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-copper" aria-hidden="true" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-copper font-medium">
          Diorama Pulau
        </span>
      </div>

      <h1 className="font-serif text-xl sm:text-2xl font-bold text-cream tracking-tight leading-snug">
        Raka Fantino
      </h1>

      <p className="mt-1 text-xs text-cream/75 leading-relaxed">
        Frontend &amp; Fullstack Engineer · Spesialis AI &amp; Web3 Systems.
      </p>

      <div className="mt-3.5 pt-2.5 border-t border-island-border/50 grid grid-cols-2 gap-2">
        <Link
          to="/projects"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-copper hover:bg-copper-deep text-cream text-xs font-medium shadow-md shadow-black/40 transition-all duration-200 group"
        >
          <span>Semua Proyek</span>
          <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-island-border/80 bg-island-dark/60 hover:bg-island-dark text-cream/80 hover:text-cream text-xs font-medium transition-all duration-200"
        >
          <span>Tentang Saya</span>
        </Link>
      </div>
    </div>
  ),

  // Zone 2: Kabin Kerja -> Tentang Saya
  2: (
    <StoryCard
      eyebrow="Kabin Kerja"
      title="Tentang Saya"
      description="Profil lengkap, perjalanan rekayasa sistem, pengalaman kerja, dan etos kerja di balik workshop ini."
      to="/about"
      ctaText="Buka Halaman Tentang Saya"
    />
  ),

  // Zone 3: Observatorium -> Riset AI & Penghargaan
  3: (
    <StoryCard
      eyebrow="Observatorium"
      title="Riset & Awards"
      description="Eksplorasi kecerdasan buatan, pemenang AI Singapore 2025 dan Google Gemma 3n Challenge di Kaggle."
      to="/about"
      ctaText="Lihat Kredensial & Penghargaan"
    />
  ),

  // Zone 4: Reaktor Mesin -> Proyek Unggulan
  4: (
    <StoryCard
      eyebrow="Reaktor Mesin"
      title="Proyek & Lab"
      description="Arsitektur trading bot Solana NinjaPump.ai, game desentralisasi multi-chain, dan aplikasi produksi."
      to="/projects"
      ctaText="Jelajahi Arsip Proyek Lengkap"
    />
  ),

  // Zone 5: Mercusuar -> Kontak
  5: (
    <StoryCard
      eyebrow="Mercusuar Pantai"
      title="Hubungi Saya"
      description="Saluran komunikasi terbuka untuk peluang kerja, kontrak proyek, atau kolaborasi teknis baru."
      to="/contact"
      ctaText="Kirim Pesan Sekarang"
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
