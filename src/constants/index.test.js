import {
  skills,
  experiences,
  projects,
  awards,
  socialLinks,
} from "./index.js";

describe("src/constants/index schema and authentic CV data", () => {
  describe("skills", () => {
    it("exports skills array with at least 10 items conforming to schema", () => {
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThanOrEqual(10);

      skills.forEach((skill) => {
        expect(typeof skill.name).toBe("string");
        expect(skill.name.trim().length).toBeGreaterThan(0);
        expect(typeof skill.type).toBe("string");
        expect(skill.type.trim().length).toBeGreaterThan(0);
        expect(skill.imageUrl).toBeDefined();
        expect(typeof skill.imageUrl).toBe("string");
      });
    });
  });

  describe("experiences", () => {
    const ALLOWED_CATEGORIES = new Set(["tech", "operations", "creative"]);

    it("exports experiences array with at least 4 items conforming to schema", () => {
      expect(Array.isArray(experiences)).toBe(true);
      expect(experiences.length).toBeGreaterThanOrEqual(4);

      experiences.forEach((experience) => {
        expect(typeof experience.title).toBe("string");
        expect(experience.title.trim().length).toBeGreaterThan(0);
        expect(typeof experience.company_name).toBe("string");
        expect(experience.company_name.trim().length).toBeGreaterThan(0);
        expect(experience.icon).toBeDefined();
        expect(typeof experience.iconBg).toBe("string");
        expect(typeof experience.date).toBe("string");
        expect(Array.isArray(experience.points)).toBe(true);
        expect(experience.points.length).toBeGreaterThan(0);
        experience.points.forEach((point) => {
          expect(typeof point).toBe("string");
          expect(point.trim().length).toBeGreaterThan(0);
        });
        expect(ALLOWED_CATEGORIES.has(experience.category)).toBe(true);
      });
    });

    it("contains all required companies from CV", () => {
      const companyNames = experiences.map((exp) => exp.company_name);
      const expectedCompanies = [
        "Meraki Warna Teknologi",
        "Loka Mining",
        "Pemerintah Kota Pekanbaru",
        "PT Alga Jaya Solusi",
        "PT Mitra Cahaya Sentosa",
      ];

      expectedCompanies.forEach((company) => {
        expect(companyNames).toContain(company);
      });
    });
  });

  describe("projects", () => {
    const ALLOWED_PROJECT_CATEGORIES = new Set([
      "ai-awards",
      "web3-crypto",
      "fullstack-saas",
    ]);

    it("exports projects array with at least 5 items conforming to schema", () => {
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThanOrEqual(5);

      projects.forEach((project) => {
        expect(project.iconUrl).toBeDefined();
        expect(typeof project.theme).toBe("string");
        expect(typeof project.name).toBe("string");
        expect(project.name.trim().length).toBeGreaterThan(0);
        expect(typeof project.description).toBe("string");
        expect(project.description.trim().length).toBeGreaterThan(0);
        expect(typeof project.link).toBe("string");
        expect(project.link.startsWith("https://")).toBe(true);
        expect(Array.isArray(project.tags)).toBe(true);
        expect(project.tags.length).toBeGreaterThan(0);
        project.tags.forEach((tag) => {
          expect(typeof tag).toBe("string");
          expect(tag.trim().length).toBeGreaterThan(0);
        });
        expect(ALLOWED_PROJECT_CATEGORIES.has(project.category)).toBe(true);
      });
    });

    it("contains all required project names from CV", () => {
      const requiredSubstrings = [
        "NinjaPump",
        "Roshambo",
        "PupsBot",
        "Diklik",
        "Feedly",
      ];

      requiredSubstrings.forEach((sub) => {
        const found = projects.some((p) => p.name.includes(sub));
        expect(found).toBe(true);
      });
    });
  });

  describe("awards", () => {
    it("exports awards array with at least 3 items conforming to schema", () => {
      expect(Array.isArray(awards)).toBe(true);
      expect(awards.length).toBeGreaterThanOrEqual(3);

      awards.forEach((award) => {
        expect(typeof award.title).toBe("string");
        expect(award.title.trim().length).toBeGreaterThan(0);
        expect(typeof award.issuer).toBe("string");
        expect(award.issuer.trim().length).toBeGreaterThan(0);
        expect(typeof award.date).toBe("string");
        expect(award.date.trim().length).toBeGreaterThan(0);
        expect(typeof award.description).toBe("string");
        expect(award.description.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe("socialLinks", () => {
    it("exports exactly 3 social links", () => {
      expect(Array.isArray(socialLinks)).toBe(true);
      expect(socialLinks.length).toBe(3);

      socialLinks.forEach((link) => {
        expect(typeof link.name).toBe("string");
        expect(link.iconUrl).toBeDefined();
        expect(typeof link.link).toBe("string");
      });
    });
  });

  describe("no placeholder hash links", () => {
    it("ensures no exported link in projects, socialLinks, or elsewhere starts with or equals '#'", () => {
      projects.forEach((project) => {
        expect(project.link).not.toBe("#");
        expect(project.link.startsWith("#")).toBe(false);
      });

      socialLinks.forEach((social) => {
        expect(social.link).not.toBe("#");
        expect(social.link.startsWith("#")).toBe(false);
      });
    });
  });
});
