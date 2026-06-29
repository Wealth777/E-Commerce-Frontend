import { FaStar } from 'react-icons/fa';
import {
  convertAverageRatingToStars,
  getStarFillState,
} from '../../utils/rating';

/**
 * @param {number} value - Normalized average (0–1), legacy aggregate, or individual 1–5 rating
 * @param {boolean} normalized - When true, value is treated as backend averageRating (0–1)
 */
const RatingStars = ({
  value = 0,
  onChange,
  size = 'text-lg',
  readOnly = false,
  normalized = false,
  showEmpty = true,
}) => {
  const displayStars =
    readOnly || normalized
      ? convertAverageRatingToStars(value)
      : Math.min(5, Math.max(0, Number(value) || 0));

  const interactiveValue = Math.round(displayStars) || 0;

  if (!showEmpty && displayStars <= 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-0.5" aria-label={readOnly ? `${displayStars.toFixed(1)} out of 5 stars` : 'Rate this item'}>
      {[1, 2, 3, 4, 5].map((star) => {
        const { full, partial } = getStarFillState(star, displayStars);

        if (readOnly) {
          return (
            <span key={star} className={`relative inline-flex ${size}`} aria-hidden="true">
              <FaStar className="text-gray-300 dark:text-gray-600" />
              {(full || partial > 0) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: full ? '100%' : `${partial * 100}%` }}
                >
                  <FaStar className="text-yellow-400" />
                </span>
              )}
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={`cursor-pointer ${size}`}
            aria-label={`${star} star`}
          >
            <FaStar
              className={
                star <= interactiveValue
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
