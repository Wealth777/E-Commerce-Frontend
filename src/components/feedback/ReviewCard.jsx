import RatingStars from './RatingStars';

const ReviewCard = ({ review, allowEdit = false, allowDelete = false, onEdit, onDelete, allowReport = false, onReport }) => {
  const reviewer = review?.reviewer || review?.reviewerId || review?.buyer || {};
  const product = review?.product || review?.productId || {};
  const vendor = review?.vendor || review?.vendorId || {};
  const rating = review?.rating || review?.ratingValue;

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {rating ? <RatingStars value={rating} readOnly /> : null}
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">{review?.status || 'active'}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-200">{review?.comment || 'No comment'}</p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{reviewer?.fullName || reviewer?.username || 'Buyer'}</span>
            {product?.name && <span> · {product.name}</span>}
            {vendor?.storeName && <span> · {vendor.storeName}</span>}
            {review?.createdAt && <span> · {new Date(review.createdAt).toLocaleDateString()}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {allowEdit && <button onClick={() => onEdit?.(review)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200">Edit</button>}
          {allowDelete && <button onClick={() => onDelete?.(review)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Delete</button>}
          {allowReport && <button onClick={() => onReport?.(review)} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white">Report</button>}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
