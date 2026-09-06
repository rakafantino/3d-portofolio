import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as DevIcons from "developer-icons";
import SubpageNav from "../components/SubpageNav";
import ParchmentPage from "../components/ParchmentPage";
import ParchmentRibbon from "../components/ParchmentRibbon";
import { useLanguage } from "../context/LanguageContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { awards, skills, experiences } from "../constants";
import {
  HonoIcon,
  NeonIcon,
  DrizzleIcon,
  DokployIcon,
  SolanaIcon,
} from "../components/icons/CustomTechIcons";

const CUSTOM_ICONS = {
  Hono: HonoIcon,
  Neon: NeonIcon,
  Drizzle: DrizzleIcon,
  Dokploy: DokployIcon,
  Solana: SolanaIcon,
};

const renderSkillIcon = (iconKey) => {
  if (CUSTOM_ICONS[iconKey]) {
    const CustomIcon = CUSTOM_ICONS[iconKey];
    return <CustomIcon size={26} className="w-6.5 h-6.5" />;
  }

  const IconComponent = DevIcons[iconKey];
  if (IconComponent) {
    return <IconComponent size={26} className="w-6.5 h-6.5" />;
  }

  return null;
};

const CATEGORY_ORDER = [
  "Frontend & UI",
  "Backend & Runtimes",
  "Database & ORM",
  "DevOps, Cloud & Automation",
  "Web3 & Design",
];

const About = () => {
  const { t } = useLanguage();
  useDocumentTitle(t("aboutEyebrow"));
  const navigate = useNavigate();
  const location = useLocation();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (location.hash === "#awards") {
      const el = document.getElementById("awards");
      if (el) {
        // Allow parchment roll animation to unfold slightly before scrolling
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [location.hash]);

  const handleBack = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      navigate("/");
    }, 850);
  };

  const handleRollComplete = (isOpen) => {
    if (!isOpen) {
      navigate("/");
    }
  };

  const skillsByCategory = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  // Separate tech engineering experiences from operations/creative
  const techExperiences = experiences.filter((exp) => exp.category === "tech");
  const originExperiences = experiences.filter(
    (exp) => exp.category === "operations" || exp.category === "creative"
  );

  return (
    <ParchmentPage isOpen={!isExiting} onRollComplete={handleRollComplete}>
      <SubpageNav onBack={handleBack} />
      <div className="max-w-4xl mx-auto flex flex-col pt-8 sm:pt-6">
        <div className="flex flex-col gap-2.5 border-b border-[#8C5E32]/25 pb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#A66D38]" aria-hidden="true" />
            <span className="text-xs font-serif italic tracking-widest uppercase text-[#8C3E14] font-medium">
              {t("aboutEyebrow")}
            </span>
            <span className="w-8 h-px bg-[#A66D38]" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#241407] leading-tight tracking-tight">
            Raka Fantino
          </h1>
          <p className="font-serif text-base sm:text-lg text-[#4A2F17] leading-relaxed max-w-2xl mt-1">
            {t("aboutIntro")}
          </p>
          <div className="mt-4 pt-1 flex items-center gap-4 flex-wrap">
            <ParchmentRibbon
              href="/CV_Raka_Fantino.pdf"
              download="CV_Raka_Fantino.pdf"
              ariaLabel={t("downloadCvBtn")}
              variant="tab"
            >
              <span aria-hidden="true" className="font-bold text-xs sm:text-sm">
                ↓
              </span>
              <span>{t("downloadCvBtn")}</span>
            </ParchmentRibbon>
          </div>
        </div>

        <div id="awards" className="mt-14 sm:mt-16 pt-2 scroll-mt-6">
          <div className="mb-6 border-b border-[#8C5E32]/25 pb-4">
            <span className="text-xs font-mono tracking-wider uppercase text-[#8C5E32]">
              {t("awardsKicker")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241407] mt-0.5">
              {t("awardsTitle")}
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-[#6E4B28] mt-1.5 max-w-xl">
              {t("awardsSub")}
            </p>
          </div>

          <div className="divide-y divide-[#8C5E32]/15 border-b border-[#8C5E32]/25">
            {awards.map((award, index) => {
              const isWin =
                award.date.includes("2025") ||
                award.title.toLowerCase().includes("winner") ||
                award.title.toLowerCase().includes("prize");

              return (
                <div
                  key={`award-${index}`}
                  className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6 group transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-mono text-xs text-[#7A5328] tracking-wide">
                        {award.issuer}
                      </span>
                      {isWin && (
                        <span className="inline-flex items-center text-xs font-serif font-semibold text-[#8C3E14] tracking-wide border-b border-[#8C3E14]/40">
                          {t("awardWinnerBadge")}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241407] leading-snug group-hover:text-[#7A3614] transition-colors">
                      {award.title}
                    </h3>
                    <p className="font-serif text-sm text-[#4E331B] mt-1 leading-relaxed">
                      {t(award.description)}
                    </p>
                  </div>
                  <div className="font-mono text-xs text-[#7A5328] shrink-0 pt-0.5 sm:text-right">
                    {award.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 sm:mt-16 pt-2">
          <div className="mb-8 border-b border-[#8C5E32]/25 pb-4">
            <span className="text-xs font-mono tracking-wider uppercase text-[#8C5E32]">
              {t("skillsKicker")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241407] mt-0.5">
              {t("skillsHeading")}
            </h2>
            <p className="font-serif text-sm text-[#4E331B] mt-1 max-w-xl">
              {t("skillsSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div
                key={category}
                className="p-5 sm:p-6 rounded-md border border-[#946A3D]/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(40,20,8,0.15)] flex flex-col"
                style={{
                  background: "linear-gradient(180deg, rgba(247, 238, 222, 0.7) 0%, rgba(236, 221, 196, 0.55) 100%)",
                }}
              >
                <div className="flex items-center justify-between border-b border-[#946A3D]/25 pb-2.5 mb-4">
                  <h3 className="font-serif text-xs font-bold text-[#351E0D] uppercase tracking-wider">
                    {category}
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2.5 p-2.5 rounded-sm border border-[#A3784A]/30 bg-[#F9F2E4]/80 hover:bg-[#FFFBF2] hover:border-[#8C3E14]/50 hover:shadow-sm transition-all group cursor-default"
                    >
                      <div className="w-7 h-7 shrink-0 flex items-center justify-center text-[#3D2511] transition-transform group-hover:scale-105">
                        {renderSkillIcon(skill.iconKey)}
                      </div>
                      <span className="text-xs font-serif font-medium text-[#3D2511] group-hover:text-[#8C3E14] truncate">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 sm:mt-16 pt-2">
          <div className="mb-8 border-b border-[#8C5E32]/25 pb-4">
            <span className="text-xs font-mono tracking-wider uppercase text-[#8C5E32]">
              {t("expKicker")}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#241407] mt-0.5">
              {t("expHeading")}
            </h2>
            <p className="font-serif text-sm text-[#4E331B] mt-1 max-w-xl">
              {t("expSub")}
            </p>
          </div>

          <div className="relative border-l-2 border-dashed border-[#A6713D]/45 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-10 sm:space-y-12">
            {techExperiences.map((exp, index) => (
              <div key={`tech-exp-${index}`} className="relative group">
                <div
                  className="absolute -left-[32px] sm:-left-[40px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#8C3E14] border-2 border-[#ECD9BA] shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                  aria-hidden="true"
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#241407]">
                      {t(exp.title)}
                    </h3>
                    <p className="font-serif text-sm text-[#8C3E14] font-semibold mt-0.5">
                      {exp.company_name}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#7A5328]">
                    {exp.date}
                  </span>
                </div>

                <ul className="space-y-2 mt-3 pl-1">
                  {exp.points.map((point, pIndex) => (
                    <li
                      key={`point-${pIndex}`}
                      className="font-serif text-sm text-[#452B14] leading-relaxed border-l-2 border-[#8C5E32]/20 pl-3 hover:border-[#8C3E14]/60 transition-colors"
                    >
                      <span>{t(point)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {originExperiences.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[#8C5E32]/25">
              <div className="mb-6">
                <span className="text-xs font-mono tracking-wider uppercase text-[#8C5E32]">
                  {t("originOpsKicker")}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#241407] mt-0.5">
                  {t("originOpsHeading")}
                </h3>
                <p className="font-serif italic text-xs text-[#6E4B28] mt-1">
                  {t("originOpsSub")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {originExperiences.map((exp, index) => (
                  <div
                    key={`origin-exp-${index}`}
                    className="p-5 rounded-md border border-[#9E7345]/30 bg-[#F4E8D1]/60 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#785127] mb-2">
                        <span>{exp.date}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border border-[#A67543]/30 bg-[#E8D4B2] text-[#4A2F17]">
                          {exp.category}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#241407]">
                        {t(exp.title)}
                      </h4>
                      <p className="font-serif text-xs font-semibold text-[#8C3E14] mt-0.5 mb-3">
                        {exp.company_name}
                      </p>
                      <ul className="space-y-2 pl-1">
                        {exp.points.map((point, pIndex) => (
                          <li
                            key={`origin-point-${pIndex}`}
                            className="font-serif text-xs text-[#452B14] leading-relaxed border-l-2 border-[#8C5E32]/20 pl-2.5"
                          >
                            <span>{t(point)}</span>
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

        <div
          className="mt-16 p-8 sm:p-10 rounded-md border-2 border-[#8C5E32]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          style={{
            background: "linear-gradient(135deg, #EFE2C8 0%, #E3D1AF 100%)",
            boxShadow: "inset 0 1px 3px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(60,34,16,0.2)",
          }}
        >
          <div>
            <span className="text-xs font-serif italic tracking-widest uppercase text-[#8C3E14] font-semibold">
              {t("collabEyebrow")}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#241407] mt-1">
              {t("collabAboutTitle")}
            </h3>
            <p className="font-serif text-sm text-[#4E331B] mt-1.5 max-w-lg leading-relaxed">
              {t("collabAboutDesc")}
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
      </div>
    </ParchmentPage>
  );
};

export default About;
