import RatingStars from './RatingStars';
import {
  formatStarRatingDisplay,
  getProductFeedbackSummaries,
} from '../../utils/rating';

/**
 * Compact rating + review count for product cards, lists, and grids.
 */
const ProductRatingDisplay = ({
  product,
  size = 'text-sm',
  starSize = 'text-sm',
  className = '',
  showReviews = true,
}) => {
  const {
    averageRating,
    totalRatings,
    totalReviews,
    hasRatings,
    hasReviews,
  } = getProductFeedbackSummaries(product || {});

  if (!hasRatings && !hasReviews) {
    return (
      <span className={`text-gray-400 dark:text-gray-500 ${size} ${className}`}>
        No ratings yet
      </span>
    );
  }

  const displayRating = formatStarRatingDisplay(averageRating);

  return (
    <div className={`flex items-center gap-1 ${size} ${className}`}>
      {hasRatings ? (
        <>
          <RatingStars
            value={averageRating}
            normalized
            readOnly
            size={starSize}
            showEmpty={false}
          />
          <span className="ml-0.5 font-medium text-yellow-600 dark:text-yellow-400">
            {displayRating}
          </span>
          <span className="text-gray-400 dark:text-gray-500">
            ({totalRatings})
          </span>
        </>
      ) : (
        <span className="text-gray-400 dark:text-gray-500">No ratings yet</span>
      )}
      {showReviews && (
        <span className="text-gray-400 dark:text-gray-500">
          {hasReviews
            ? ` · ${totalReviews} review${totalReviews === 1 ? '' : 's'}`
            : ' · No reviews yet'}
        </span>
      )}
    </div>
  );
};

export default ProductRatingDisplay;
