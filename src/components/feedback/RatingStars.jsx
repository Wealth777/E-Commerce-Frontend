import { FaStar } from 'react-icons/fa';

const RatingStars = ({ value = 0, onChange, size = 'text-lg', readOnly = false }) => {
  const rating = Number(value || 0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} ${size}`}
          aria-label={`${star} star`}
        >
          <FaStar className={star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
