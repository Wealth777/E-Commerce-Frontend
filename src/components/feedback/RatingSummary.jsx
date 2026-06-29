import RatingStars from './RatingStars';
import {
  formatStarRatingDisplay,
  getProductFeedbackSummaries,
  getRatingSummaryFromProduct,
} from '../../utils/rating';

const resolveSummary = (summary = {}, product = null) => {
  if (product) {
    return getRatingSummaryFromProduct(product);
  }

  const averageRating =
    summary.averageRating ?? summary.average ?? summary.rating ?? 0;
  const totalRatings =
    summary.totalRatings ?? summary.total ?? summary.count ?? 0;
  const totalReviews =
    summary.totalReviews ?? summary.reviewCount ?? 0;
  const breakdown = summary.breakdown ?? summary.ratingBreakdown ?? {};

  return { averageRating, totalRatings, totalReviews, breakdown };
};

const RatingSummary = ({ summary = {}, product = null, showReviews = true }) => {
  const resolved = resolveSummary(summary, product);
  const feedback = product
    ? getProductFeedbackSummaries(product)
    : getProductFeedbackSummaries({
        ratingSummary: {
          averageRating: resolved.averageRating,
          totalRatings: resolved.totalRatings,
          breakdown: resolved.breakdown,
        },
        reviewSummary: { totalReviews: resolved.totalReviews },
      });

  const { averageRating, totalRatings, totalReviews, breakdown, hasRatings, hasReviews } =
    feedback;
  const displayRating = formatStarRatingDisplay(averageRating);

  if (!hasRatings && !hasReviews) {
    return (
      <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">No ratings yet</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Be the first to rate this product.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average rating</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-3xl font-black text-gray-900 dark:text-white">
              {displayRating ?? '—'}
            </span>
            {hasRatings ? (
              <RatingStars value={averageRating} normalized readOnly />
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">No ratings yet</span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {hasRatings
              ? `${totalRatings} rating${totalRatings === 1 ? '' : 's'}`
              : 'No ratings yet'}
          </p>
          {showReviews && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {hasReviews
                ? `${totalReviews} review${totalReviews === 1 ? '' : 's'}`
                : 'No reviews yet'}
            </p>
          )}
        </div>

        {hasRatings && (
          <div className="w-full sm:max-w-xs space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = Number(breakdown[star] ?? breakdown[`star${star}`] ?? 0);
              const width = totalRatings
                ? Math.min(100, Math.round((count / totalRatings) * 100))
                : 0;

              return (
                <div
                  key={star}
                  className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                >
                  <span className="w-8">{star}★</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-yellow-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingSummary;
