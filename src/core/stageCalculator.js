/**
 * Pure mathematical core module for island rotation stage calculations (FCIS).
 * Zero side-effects, zero DOM/React dependencies.
 *
 * Stage centers (radians):
 * - Stage 1: 4.5  (~257.8°, default island orientation)
 * - Stage 2: 2.5  (~143.2°)
 * - Stage 3: 1.05 (~60.2°)
 * - Stage 4: 5.65 (~323.7°)
 *
 * Windows partition the full 2pi radian circle evenly into 4 contiguous quarter-windows:
 * - Stage 2: [1.775, 3.500)
 * - Stage 1: [3.500, 5.075)
 * - Stage 4: [5.075, 2pi) U [0, 0.275) (spans the 0/2pi wrap boundary)
 * - Stage 3: [0.275, 1.775)
 */

const TWO_PI = 2 * Math.PI;

export const STAGE_CENTERS = Object.freeze({
  1: 4.5,
  2: 2.5,
  3: 1.05,
  4: 5.65,
});

/**
 * Midpoint boundary between two angles on the circle [0, 2pi).
 * For a < b, midpoint is (a + b) / 2.
 * For wrap boundary (e.g. Stage 4 at 5.65 to Stage 3 at 1.05),
 * distance across 0 is (TWO_PI - 5.65) + 1.05 = 1.683185...
 * Midpoint is (5.65 + 1.683185... / 2) % TWO_PI = 0.275796...
 */
const B_3_2 = (STAGE_CENTERS[3] + STAGE_CENTERS[2]) / 2; // (1.05 + 2.5) / 2 = 1.775
const B_2_1 = (STAGE_CENTERS[2] + STAGE_CENTERS[1]) / 2; // (2.5 + 4.5) / 2 = 3.500
const B_1_4 = (STAGE_CENTERS[1] + STAGE_CENTERS[4]) / 2; // (4.5 + 5.65) / 2 = 5.075

// Boundary between Stage 4 and Stage 3 crossing 0:
// Stage 4 center: 5.65. Stage 3 center: 1.05 (or 1.05 + TWO_PI = 7.3331853...)
// Midpoint = (5.65 + 7.3331853...) / 2 = 6.4915926... % TWO_PI = 0.208407...
// Or using even quarter width from centers:
// Notice:
// B_2_1 - B_3_2 = 3.500 - 1.775 = 1.725 (Stage 2 window span)
// B_1_4 - B_2_1 = 5.075 - 3.500 = 1.575 (Stage 1 window span)
// With midpoint between 4 and 3:
const B_4_3 = ((STAGE_CENTERS[4] + (STAGE_CENTERS[3] + TWO_PI)) / 2) % TWO_PI;
// B_4_3 = (5.65 + 1.05 + 2*PI)/2 % (2*PI) = (6.7 + 6.2831853)/2 = 6.4915926... % 6.2831853 = 0.2084073...

export const STAGE_WINDOWS = Object.freeze({
  1: Object.freeze({
    stage: 1,
    center: STAGE_CENTERS[1],
    start: B_2_1, // 3.500
    end: B_1_4,   // 5.075
    span: B_1_4 - B_2_1,
  }),
  2: Object.freeze({
    stage: 2,
    center: STAGE_CENTERS[2],
    start: B_3_2, // 1.775
    end: B_2_1,   // 3.500
    span: B_2_1 - B_3_2,
  }),
  3: Object.freeze({
    stage: 3,
    center: STAGE_CENTERS[3],
    start: B_4_3, // ~0.2084
    end: B_3_2,   // 1.775
    span: B_3_2 - B_4_3,
  }),
  4: Object.freeze({
    stage: 4,
    center: STAGE_CENTERS[4],
    start: B_1_4, // 5.075
    end: B_4_3,   // ~0.2084 (wraps past 2pi)
    span: (TWO_PI - B_1_4) + B_4_3,
  }),
});

/**
 * Normalizes any angle (positive, negative, multi-wrap) into [0, 2pi).
 * Returns NaN if input is not a finite number.
 *
 * @param {number} angle - Angle in radians
 * @returns {number} Normalized angle in [0, 2pi)
 */
export function normalizeAngle(angle) {
  if (typeof angle !== "number" || Number.isNaN(angle) || !Number.isFinite(angle)) {
    return NaN;
  }
  const remainder = angle % TWO_PI;
  return remainder < 0 ? remainder + TWO_PI : remainder;
}

/**
 * Maps any rotation angle into a stage index (1..4) based on wide contiguous windows.
 * Returns null for invalid inputs.
 *
 * @param {number} angle - Angle in radians
 * @returns {1|2|3|4|null}
 */
export function getStageFromAngle(angle) {
  const norm = normalizeAngle(angle);
  if (Number.isNaN(norm)) {
    return null;
  }

  // Windows in [0, 2pi):
  // [B_4_3, B_3_2) -> Stage 3
  // [B_3_2, B_2_1) -> Stage 2
  // [B_2_1, B_1_4) -> Stage 1
  // [B_1_4, TWO_PI) U [0, B_4_3) -> Stage 4
  if (norm >= STAGE_WINDOWS[3].start && norm < STAGE_WINDOWS[3].end) {
    return 3;
  }
  if (norm >= STAGE_WINDOWS[2].start && norm < STAGE_WINDOWS[2].end) {
    return 2;
  }
  if (norm >= STAGE_WINDOWS[1].start && norm < STAGE_WINDOWS[1].end) {
    return 1;
  }
  return 4;
}

/**
 * Computes progress (0..1) through the current stage window.
 * 0 at window start, 0.5 at window center, 1 near window end. Clamped to [0, 1].
 *
 * @param {number} angle - Angle in radians
 * @returns {number} Progress value in [0, 1]
 */
export function getStageProgress(angle) {
  const norm = normalizeAngle(angle);
  if (Number.isNaN(norm)) {
    return 0;
  }

  const stage = getStageFromAngle(norm);
  if (stage === null) {
    return 0;
  }

  const window = STAGE_WINDOWS[stage];
  const center = window.center;
  const start = window.start;
  const end = window.end;

  let progress = 0;

  if (stage === 4) {
    if (norm >= start && norm < center) {
      progress = 0.5 * (norm - start) / (center - start);
    } else {
      const distFromCenter = norm >= center ? norm - center : (TWO_PI - center) + norm;
      const secondHalfSpan = (TWO_PI - center) + end;
      progress = 0.5 + 0.5 * (distFromCenter / secondHalfSpan);
    }
  } else {
    if (norm < center) {
      progress = 0.5 * (norm - start) / (center - start);
    } else {
      progress = 0.5 + 0.5 * (norm - center) / (end - center);
    }
  }

  return Math.min(Math.max(progress, 0), 1);
}

/**
 * Computes the circular shortest distance between two angles on [0, 2pi).
 *
 * @param {number} a - First angle in [0, 2pi)
 * @param {number} b - Second angle in [0, 2pi)
 * @returns {number} Distance in [0, pi]
 */
function circularDistance(a, b) {
  const diff = Math.abs(a - b) % TWO_PI;
  return diff > Math.PI ? TWO_PI - diff : diff;
}

/**
 * Returns the exact center constant of the nearest stage by circular distance.
 * Resolves window boundaries consistently with getStageFromAngle.
 * Returns STAGE_CENTERS[1] (4.5) for invalid inputs.
 *
 * @param {number} angle - Angle in radians
 * @returns {number} Exact center target in radians
 */
export function getNearestStageTarget(angle) {
  const norm = normalizeAngle(angle);
  if (Number.isNaN(norm)) {
    return STAGE_CENTERS[1];
  }

  // Consistent with stage boundary definition
  const stage = getStageFromAngle(norm);
  if (stage !== null && STAGE_CENTERS[stage] !== undefined) {
    return STAGE_CENTERS[stage];
  }

  // Fallback circular distance comparison
  let nearestStage = 1;
  let minDistance = Infinity;

  for (let s = 1; s <= 4; s += 1) {
    const dist = circularDistance(norm, STAGE_CENTERS[s]);
    if (dist < minDistance) {
      minDistance = dist;
      nearestStage = s;
    }
  }

  return STAGE_CENTERS[nearestStage];
}
