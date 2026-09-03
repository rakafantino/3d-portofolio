import { Link } from "react-router-dom";
import { awards, skills, experiences } from "../constants";

const About = () => {
  // Group skills by type
  const skillsByType = skills.reduce((acc, skill) => {
    const type = skill.type || "General";
    if (!acc[type]) acc[type] = [];
    acc[type].push(skill);
    return acc;
  }, {});

  // Separate tech engineering experiences from operations/creative
  const techExperiences = experiences.filter((exp) => exp.category === "tech");
  const originExperiences = experiences.filter(
    (exp) => exp.category === "operations" || exp.category === "creative"
  );

  return (
    <div className="min-h-[100dvh] bg-cream text-ink">
      <section className="max-w-4xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 pb-20 flex flex-col">
        {/* 1. Intro Header */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-sans font-semibold tracking-wider uppercase text-copper">
            Tentang
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-ink leading-tight tracking-tight">
            Raka Fantino
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl mt-1">
            Software engineer yang berfokus pada pengembangan antarmuka web modern,
            sistem terdesentralisasi (Web3), dan aplikasi berbasis edge AI. Berpengalaman membangun
            platform berkinerja tinggi, bot otomasi, serta solusi web menyeluruh dari tahap perancangan
            hingga produksi.
          </p>
        </div>

        {/* 2. Awards Section (Pengakuan / Recognition) */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-ink/10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8">
            <div>
              <span className="text-xs font-sans font-semibold tracking-wider uppercase text-ink-faint">
                Pengakuan
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mt-1">
                Prestasi &amp; Penghargaan
              </h2>
            </div>
            <p className="font-sans text-xs text-ink-faint max-w-xs sm:text-right">
              Kompetisi internasional dan sertifikasi fondasi rekayasa web.
            </p>
          </div>

          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {awards.map((award, index) => {
              const isWin =
                award.date.includes("2025") ||
                award.title.toLowerCase().includes("winner") ||
                award.title.toLowerCase().includes("prize");

              return (
                <div
                  key={`award-${index}`}
                  className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-mono text-xs text-ink-faint">
                        {award.issuer}
                      </span>
                      {isWin && (
                        <span className="inline-flex items-center text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-copper/10 text-copper">
                          Pemenang
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink leading-snug">
                      {award.title}
                    </h3>
                    <p className="font-sans text-sm text-ink-soft mt-1 leading-relaxed">
                      {award.description}
                    </p>
                  </div>
                  <div className="font-mono text-xs text-ink-faint shrink-0 pt-0.5 sm:text-right">
                    {award.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Categorized Skills */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-ink/10">
          <div className="mb-8">
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-ink-faint">
              Keahlian
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mt-1">
              Perangkat &amp; Ekosistem
            </h2>
            <p className="font-sans text-sm text-ink-soft mt-1 max-w-xl">
              Teknologi inti yang digunakan untuk merancang arsitektur antarmuka dan layanan server.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skillsByType).map(([category, categorySkills]) => (
              <div
                key={category}
                className="bg-white/60 p-5 sm:p-6 rounded-xl border border-ink/10 flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-ink/10 pb-3 mb-4">
                  <h3 className="font-sans text-sm font-semibold text-ink uppercase tracking-wider">
                    {category}
                  </h3>
                  <span className="font-mono text-xs text-ink-faint">
                    {categorySkills.length} teknologi
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-transparent hover:border-ink/10 hover:bg-white transition-all group text-center"
                    >
                      <div className="w-9 h-9 flex items-center justify-center mb-1.5">
                        <img
                          src={skill.imageUrl}
                          alt={skill.name}
                          className="w-7 h-7 object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                      <span className="text-xs font-sans text-ink-soft group-hover:text-ink truncate max-w-full">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Engineering Journey Timeline */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-ink/10">
          <div className="mb-8">
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-ink-faint">
              Perjalanan
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mt-1">
              Pengalaman Rekayasa
            </h2>
            <p className="font-sans text-sm text-ink-soft mt-1 max-w-xl">
              Rekam jejak kontribusi produksi, integrasi Web3, dan rekayasa perangkat lunak klien.
            </p>
          </div>

          <div className="relative border-l border-ink/15 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-10 sm:space-y-12">
            {techExperiences.map((exp, index) => (
              <div key={`tech-exp-${index}`} className="relative group">
                {/* Node dot on timeline */}
                <div
                  className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-cream border-2 border-copper"
                  aria-hidden="true"
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-ink">
                      {exp.title}
                    </h3>
                    <p className="font-sans text-sm text-copper font-medium mt-0.5">
                      {exp.company_name}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-ink-faint">
                    {exp.date}
                  </span>
                </div>

                <ul className="space-y-2 mt-3">
                  {exp.points.map((point, pIndex) => (
                    <li
                      key={`point-${pIndex}`}
                      className="font-sans text-sm text-ink-soft flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-copper select-none mt-1 text-xs">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Origin & Operations Sub-section */}
          {originExperiences.length > 0 && (
            <div className="mt-16 pt-8 border-t border-ink/10">
              <div className="mb-6">
                <span className="text-xs font-sans font-semibold tracking-wider uppercase text-ink-faint">
                  Fondasi Operasional
                </span>
                <h3 className="font-serif text-xl font-semibold text-ink mt-1">
                  Kepemimpinan Lapangan &amp; Kreatif
                </h3>
                <p className="font-sans text-xs text-ink-faint mt-1">
                  Pengalaman kepemimpinan operasional, infrastruktur jaringan, dan dokumentasi eksekutif.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {originExperiences.map((exp, index) => (
                  <div
                    key={`origin-exp-${index}`}
                    className="p-5 rounded-xl border border-ink/10 bg-white/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 font-mono text-xs text-ink-faint mb-2">
                        <span>{exp.date}</span>
                        <span className="text-[10px] font-sans uppercase px-2 py-0.5 rounded bg-cream-deep text-ink-soft">
                          {exp.category}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-semibold text-ink">
                        {exp.title}
                      </h4>
                      <p className="font-sans text-xs font-medium text-copper mt-0.5 mb-3">
                        {exp.company_name}
                      </p>
                      <ul className="space-y-1.5">
                        {exp.points.map((point, pIndex) => (
                          <li
                            key={`origin-point-${pIndex}`}
                            className="font-sans text-xs text-ink-soft flex items-start gap-2 leading-relaxed"
                          >
                            <span className="text-ink-faint select-none">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. Inline Warm Editorial Callout */}
        <div className="mt-20 p-8 sm:p-10 rounded-2xl bg-cream-deep border border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-copper">
              Kolaborasi
            </span>
            <h3 className="font-serif text-2xl font-semibold text-ink mt-1">
              Tertarik membangun sesuatu bersama?
            </h3>
            <p className="font-sans text-sm text-ink-soft mt-1.5 max-w-lg leading-relaxed">
              Terbuka untuk diskusi proyek rekayasa antarmuka, arsitektur Web3, atau konsultasi teknis.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-ink text-cream hover:bg-ink-soft transition-colors font-sans text-sm font-medium shrink-0"
          >
            Hubungi saya →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
