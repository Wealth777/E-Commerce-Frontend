/**
 * Backend stores averageRating on a normalized 0–1 scale:
 * 0.20 = 1 star, 0.40 = 2 stars, … 1.00 = 5 stars.
 */

const STAR_STEP = 0.2;
const MAX_STARS = 5;

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

/**
 * Converts backend averageRating (0–1) to a 0–5 star value for display.
 * Also accepts legacy 1–5 individual rating values.
 */
export function convertAverageRatingToStars(value) {
  const num = toNumber(value);
  if (num === null || num <= 0) return 0;

  // Legacy individual rating records (1–5 integer scale)
  if (num > 1 && num <= MAX_STARS) {
    return Math.min(MAX_STARS, Math.max(0, num));
  }

  // Normalized backend aggregate (0–1)
  return Math.min(MAX_STARS, Math.max(0, num / STAR_STEP));
}

/**
 * Formats a star value for UI display (e.g. "4.2").
 */
export function formatStarRatingDisplay(value, { decimals = 1 } = {}) {
  const stars = convertAverageRatingToStars(value);
  if (!stars) return null;
  return stars.toFixed(decimals);
}

/**
 * Extracts rating/review aggregates from a product object.
 * Trusts backend-calculated Product.ratingSummary and Product.reviewSummary.
 */
export function getProductFeedbackSummaries(product = {}) {
  const ratingSummary = product.ratingSummary || {};
  const reviewSummary = product.reviewSummary || {};

  const averageRating = toNumber(ratingSummary.averageRating) ?? 0;
  const totalRatings = Math.max(0, toNumber(ratingSummary.totalRatings) ?? 0);
  const totalReviews = Math.max(
    0,
    toNumber(reviewSummary.totalReviews) ?? 0
  );

  const breakdown = ratingSummary.breakdown || {};
  const displayStars = convertAverageRatingToStars(averageRating);

  return {
    averageRating,
    totalRatings,
    totalReviews,
    breakdown,
    displayStars,
    hasRatings: totalRatings > 0,
    hasReviews: totalReviews > 0,
  };
}

/**
 * Builds a summary object compatible with RatingSummary from a product.
 */
export function getRatingSummaryFromProduct(product = {}) {
  const summaries = getProductFeedbackSummaries(product);
  return {
    averageRating: summaries.averageRating,
    totalRatings: summaries.totalRatings,
    breakdown: summaries.breakdown,
    totalReviews: summaries.totalReviews,
  };
}

/**
 * Resolves per-star fill state for decimal star rendering.
 * Returns { full, partial } where partial is 0–1 width for the current star.
 */
export function getStarFillState(starIndex, displayStars) {
  const stars = toNumber(displayStars) ?? 0;
  if (stars >= starIndex) return { full: true, partial: 1 };
  if (stars > starIndex - 1) return { full: false, partial: stars - (starIndex - 1) };
  return { full: false, partial: 0 };
}
