import {
  STAGE_CENTERS,
  STAGE_WINDOWS,
  normalizeAngle,
  getStageFromAngle,
  getStageProgress,
  getNearestStageTarget,
} from "./stageCalculator.js";

const TWO_PI = 2 * Math.PI;

describe("src/core/stageCalculator", () => {
  describe("STAGE_CENTERS and STAGE_WINDOWS source of truth", () => {
    it("exports frozen stage center constants matching design targets", () => {
      expect(STAGE_CENTERS[1]).toBe(4.5);
      expect(STAGE_CENTERS[2]).toBe(2.5);
      expect(STAGE_CENTERS[3]).toBe(1.05);
      expect(STAGE_CENTERS[4]).toBe(5.65);
      expect(Object.isFrozen(STAGE_CENTERS)).toBe(true);
    });

    it("derives non-overlapping, contiguous windows with no dead zones", () => {
      expect(STAGE_WINDOWS[1].center).toBe(STAGE_CENTERS[1]);
      expect(STAGE_WINDOWS[2].center).toBe(STAGE_CENTERS[2]);
      expect(STAGE_WINDOWS[3].center).toBe(STAGE_CENTERS[3]);
      expect(STAGE_WINDOWS[4].center).toBe(STAGE_CENTERS[4]);

      // Contiguous boundaries
      expect(STAGE_WINDOWS[2].end).toBe(STAGE_WINDOWS[1].start);
      expect(STAGE_WINDOWS[3].end).toBe(STAGE_WINDOWS[2].start);
      expect(STAGE_WINDOWS[1].end).toBe(STAGE_WINDOWS[4].start);

      for (let s = 1; s <= 4; s += 1) {
        const span = STAGE_WINDOWS[s].span;
        expect(span).toBeGreaterThan(1.35);
        expect(span).toBeLessThan(1.85);
      }
    });
  });

  describe("normalizeAngle", () => {
    it("keeps angles already within [0, 2pi) unchanged", () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(1.5)).toBeCloseTo(1.5, 10);
      expect(normalizeAngle(4.5)).toBeCloseTo(4.5, 10);
      expect(normalizeAngle(6.28)).toBeCloseTo(6.28, 10);
    });

    it("wraps 2pi and exact multiples of 2pi to 0", () => {
      expect(normalizeAngle(TWO_PI)).toBeCloseTo(0, 10);
      expect(normalizeAngle(4 * Math.PI)).toBeCloseTo(0, 10);
      expect(normalizeAngle(10 * Math.PI)).toBeCloseTo(0, 10);
    });

    it("wraps angles greater than 2pi into [0, 2pi)", () => {
      expect(normalizeAngle(TWO_PI + 4.5)).toBeCloseTo(4.5, 10);
      expect(normalizeAngle(10 * Math.PI + 2.5)).toBeCloseTo(2.5, 10);
    });

    it("wraps negative angles correctly into [0, 2pi)", () => {
      expect(normalizeAngle(-0.5)).toBeCloseTo(TWO_PI - 0.5, 10);
      expect(normalizeAngle(-TWO_PI)).toBeCloseTo(0, 10);
      expect(normalizeAngle(-TWO_PI - 1.0)).toBeCloseTo(TWO_PI - 1.0, 10);
      expect(normalizeAngle(-10 * Math.PI + 1.05)).toBeCloseTo(1.05, 10);
    });

    it("returns NaN for invalid non-numeric inputs", () => {
      expect(Number.isNaN(normalizeAngle(NaN))).toBe(true);
      expect(Number.isNaN(normalizeAngle(undefined))).toBe(true);
      expect(Number.isNaN(normalizeAngle("abc"))).toBe(true);
      expect(Number.isNaN(normalizeAngle(null))).toBe(true);
      expect(Number.isNaN(normalizeAngle({}))).toBe(true);
    });
  });

  describe("getStageFromAngle", () => {
    it("maps exact stage centers to their respective stage index", () => {
      expect(getStageFromAngle(4.5)).toBe(1);
      expect(getStageFromAngle(2.5)).toBe(2);
      expect(getStageFromAngle(1.05)).toBe(3);
      expect(getStageFromAngle(5.65)).toBe(4);
    });

    it("maps interior angles for each stage including legacy island default 4.7", () => {
      expect(getStageFromAngle(4.7)).toBe(1);
      expect(getStageFromAngle(4.0)).toBe(1);
      expect(getStageFromAngle(2.8)).toBe(2);
      expect(getStageFromAngle(1.2)).toBe(3);
      expect(getStageFromAngle(6.0)).toBe(4);
      expect(getStageFromAngle(0.1)).toBe(4); // Stage 4 wraps past 0 rad
    });

    it("handles boundary edges deterministically using half-open [start, end) intervals", () => {
      const eps = 1e-6;

      // Stage 1: [STAGE_WINDOWS[1].start, STAGE_WINDOWS[1].end)
      expect(getStageFromAngle(STAGE_WINDOWS[1].start)).toBe(1);
      expect(getStageFromAngle(STAGE_WINDOWS[1].start - eps)).toBe(2);

      // Stage 2: [STAGE_WINDOWS[2].start, STAGE_WINDOWS[2].end)
      expect(getStageFromAngle(STAGE_WINDOWS[2].start)).toBe(2);
      expect(getStageFromAngle(STAGE_WINDOWS[2].start - eps)).toBe(3);

      // Stage 3: [STAGE_WINDOWS[3].start, STAGE_WINDOWS[3].end)
      expect(getStageFromAngle(STAGE_WINDOWS[3].start)).toBe(3);
      expect(getStageFromAngle(STAGE_WINDOWS[3].start - eps)).toBe(4);

      // Stage 4: [STAGE_WINDOWS[4].start, end)
      expect(getStageFromAngle(STAGE_WINDOWS[4].start)).toBe(4);
      expect(getStageFromAngle(STAGE_WINDOWS[4].start - eps)).toBe(1);
    });

    it("normalizes negative and multi-wrap angles to the same stage", () => {
      expect(getStageFromAngle(-0.5)).toBe(getStageFromAngle(TWO_PI - 0.5));
      expect(getStageFromAngle(TWO_PI + 4.5)).toBe(1);
      expect(getStageFromAngle(10 * Math.PI + 2.5)).toBe(2);
      expect(getStageFromAngle(-TWO_PI + 1.05)).toBe(3);
      expect(getStageFromAngle(-10 * Math.PI + 5.65)).toBe(4);
    });

    it("returns null gracefully for invalid inputs without throwing", () => {
      expect(getStageFromAngle(NaN)).toBeNull();
      expect(getStageFromAngle(undefined)).toBeNull();
      expect(getStageFromAngle("abc")).toBeNull();
      expect(getStageFromAngle(null)).toBeNull();
      expect(getStageFromAngle({})).toBeNull();
      expect(getStageFromAngle([])).toBeNull();
    });

    it("covers the full 360-degree circle with no dead zones", () => {
      // Step through 0 to 2pi at 0.05 rad increments (~125 points)
      for (let angle = 0; angle < TWO_PI; angle += 0.05) {
        const stage = getStageFromAngle(angle);
        expect([1, 2, 3, 4]).toContain(stage);
      }
    });
  });

  describe("getStageProgress", () => {
    it("returns 0 at window start for all stages", () => {
      expect(getStageProgress(STAGE_WINDOWS[1].start)).toBeCloseTo(0, 5);
      expect(getStageProgress(STAGE_WINDOWS[2].start)).toBeCloseTo(0, 5);
      expect(getStageProgress(STAGE_WINDOWS[3].start)).toBeCloseTo(0, 5);
      expect(getStageProgress(STAGE_WINDOWS[4].start)).toBeCloseTo(0, 5);
    });

    it("returns 0.5 at exact center for all stages", () => {
      expect(getStageProgress(STAGE_CENTERS[1])).toBeCloseTo(0.5, 5);
      expect(getStageProgress(STAGE_CENTERS[2])).toBeCloseTo(0.5, 5);
      expect(getStageProgress(STAGE_CENTERS[3])).toBeCloseTo(0.5, 5);
      expect(getStageProgress(STAGE_CENTERS[4])).toBeCloseTo(0.5, 5);
    });

    it("approaches 1.0 near window end for all stages", () => {
      const eps = 1e-4;
      expect(getStageProgress(STAGE_WINDOWS[1].end - eps)).toBeCloseTo(1, 2);
      expect(getStageProgress(STAGE_WINDOWS[2].end - eps)).toBeCloseTo(1, 2);
      expect(getStageProgress(STAGE_WINDOWS[3].end - eps)).toBeCloseTo(1, 2);
      expect(getStageProgress(STAGE_WINDOWS[4].end - eps)).toBeCloseTo(1, 2);
    });

    it("clamps values to [0, 1]", () => {
      for (let angle = 0; angle < TWO_PI; angle += 0.1) {
        const progress = getStageProgress(angle);
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThanOrEqual(1);
      }
    });

    it("handles wrapping and negative angles", () => {
      expect(getStageProgress(TWO_PI + 4.5)).toBeCloseTo(0.5, 5);
      expect(getStageProgress(-TWO_PI + 2.5)).toBeCloseTo(0.5, 5);
    });

    it("returns 0 gracefully for invalid inputs without throwing", () => {
      expect(getStageProgress(NaN)).toBe(0);
      expect(getStageProgress(undefined)).toBe(0);
      expect(getStageProgress("abc")).toBe(0);
      expect(getStageProgress(null)).toBe(0);
    });
  });

  describe("getNearestStageTarget", () => {
    it("returns the exact center constant for angles near each stage", () => {
      expect(getNearestStageTarget(4.7)).toBe(STAGE_CENTERS[1]);
      expect(getNearestStageTarget(4.2)).toBe(STAGE_CENTERS[1]);
      expect(getNearestStageTarget(2.4)).toBe(STAGE_CENTERS[2]);
      expect(getNearestStageTarget(2.6)).toBe(STAGE_CENTERS[2]);
      expect(getNearestStageTarget(1.1)).toBe(STAGE_CENTERS[3]);
      expect(getNearestStageTarget(0.9)).toBe(STAGE_CENTERS[3]);
      expect(getNearestStageTarget(5.7)).toBe(STAGE_CENTERS[4]);
      expect(getNearestStageTarget(0.05)).toBe(STAGE_CENTERS[4]);
    });

    it("matches exact center constants by circular distance across wrapping", () => {
      expect(getNearestStageTarget(TWO_PI + 4.5)).toBe(STAGE_CENTERS[1]);
      expect(getNearestStageTarget(-TWO_PI + 2.5)).toBe(STAGE_CENTERS[2]);
      expect(getNearestStageTarget(-0.1)).toBe(STAGE_CENTERS[4]);
    });

    it("resolves boundary ties consistently with half-open intervals", () => {
      expect(getNearestStageTarget(STAGE_WINDOWS[1].start)).toBe(STAGE_CENTERS[1]);
      expect(getNearestStageTarget(STAGE_WINDOWS[2].start)).toBe(STAGE_CENTERS[2]);
      expect(getNearestStageTarget(STAGE_WINDOWS[3].start)).toBe(STAGE_CENTERS[3]);
      expect(getNearestStageTarget(STAGE_WINDOWS[4].start)).toBe(STAGE_CENTERS[4]);
    });

    it("returns stage 1 center gracefully for invalid inputs without throwing", () => {
      expect(getNearestStageTarget(NaN)).toBe(STAGE_CENTERS[1]);
      expect(getNearestStageTarget(undefined)).toBe(STAGE_CENTERS[1]);
      expect(getNearestStageTarget("abc")).toBe(STAGE_CENTERS[1]);
      expect(getNearestStageTarget(null)).toBe(STAGE_CENTERS[1]);
    });
  });
});
