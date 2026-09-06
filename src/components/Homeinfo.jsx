import PropTypes from "prop-types";
import { useLanguage } from "../context/LanguageContext";
import ParchmentRibbon from "./ParchmentRibbon";
import ParchmentScroll from "./ParchmentScroll";

const StoryCard = ({
  eyebrow,
  title,
  description,
  to,
  ctaText,
  isOpen = true,
  onRollComplete,
}) => (
  <ParchmentScroll isOpen={isOpen} onRollComplete={onRollComplete}>
    <div className="mb-1 flex items-center gap-2">
      <span className="w-5 h-px bg-[#8C6A43]/50" aria-hidden="true" />
      <span className="font-serif italic text-xs tracking-wider uppercase text-[#8C3E14] font-semibold">
        {eyebrow}
      </span>
      <span className="w-5 h-px bg-[#8C6A43]/50" aria-hidden="true" />
    </div>

    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2A1608] tracking-tight leading-snug">
      {title}
    </h2>

    {description && (
      <p className="mt-1.5 text-xs sm:text-[13px] text-[#4A301A] font-sans leading-relaxed">
        {description}
      </p>
    )}

    {to && ctaText && (
      <div className="mt-3.5 pt-2.5 border-t border-[#8C6A43]/40 flex justify-center">
        <ParchmentRibbon
          variant="tab"
          to={to}
          ariaLabel={ctaText}
          className="w-full justify-center"
        >
          <span>{ctaText}</span>
          <span aria-hidden="true" className="ml-1.5">
            →
          </span>
        </ParchmentRibbon>
      </div>
    )}
  </ParchmentScroll>
);

StoryCard.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  to: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onRollComplete: PropTypes.func,
};

const Homeinfo = ({
  currentStage,
  isOpen = true,
  onRollComplete,
  onStartTour = () => {},
}) => {
  const { t } = useLanguage();

  const renderContent = {
    1: (
      <ParchmentScroll isOpen={isOpen} onRollComplete={onRollComplete}>
        <div className="mb-1 flex items-center gap-2">
          <span className="w-5 h-px bg-[#8C6A43]/50" aria-hidden="true" />
          <span className="font-serif italic text-xs tracking-wider uppercase text-[#8C3E14] font-semibold">
            {t("homeEyebrow")}
          </span>
          <span className="w-5 h-px bg-[#8C6A43]/50" aria-hidden="true" />
        </div>

        <h1 className="font-serif text-lg sm:text-xl font-bold text-[#2A1608] tracking-tight leading-snug">
          {t("zone1Title")}
        </h1>

        <p className="mt-1.5 text-xs sm:text-[13px] text-[#4A301A] font-sans leading-relaxed">
          {t("zone1Sub")}
        </p>

        <div className="mt-3.5 pt-2.5 border-t border-[#8C6A43]/40">
          <ParchmentRibbon
            variant="tab"
            onClick={() => {
              if (typeof onStartTour === "function") {
                onStartTour();
              }
            }}
            ariaLabel={t("zone1Action")}
            className="w-full justify-center"
          >
            <span>{t("zone1Action")}</span>
            <span aria-hidden="true" className="ml-1.5">
              →
            </span>
          </ParchmentRibbon>
        </div>
      </ParchmentScroll>
    ),

    2: (
      <StoryCard
        eyebrow={t("zone2Eyebrow")}
        title={t("zone2Title")}
        description={t("zone2Desc")}
        to="/about"
        ctaText={t("zone2Cta")}
        isOpen={isOpen}
        onRollComplete={onRollComplete}
      />
    ),

    3: (
      <StoryCard
        eyebrow={t("zone3Eyebrow")}
        title={t("zone3Title")}
        description={t("zone3Desc")}
        to="/about#awards"
        ctaText={t("zone3Cta")}
        isOpen={isOpen}
        onRollComplete={onRollComplete}
      />
    ),

    4: (
      <StoryCard
        eyebrow={t("zone4Eyebrow")}
        title={t("zone4Title")}
        description={t("zone4Desc")}
        to="/projects"
        ctaText={t("zone4Cta")}
        isOpen={isOpen}
        onRollComplete={onRollComplete}
      />
    ),

    5: (
      <StoryCard
        eyebrow={t("zone5Eyebrow")}
        title={t("zone5Title")}
        description={t("zone5Desc")}
        to="/contact"
        ctaText={t("zone5Cta")}
        isOpen={isOpen}
        onRollComplete={onRollComplete}
      />
    ),
  };

  return renderContent[currentStage] || null;
};

Homeinfo.propTypes = {
  currentStage: PropTypes.number,
  isOpen: PropTypes.bool,
  onRollComplete: PropTypes.func,
  onStartTour: PropTypes.func,
};

export default Homeinfo;
