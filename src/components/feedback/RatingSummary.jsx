import RatingStars from './RatingStars';

const RatingSummary = ({ summary = {} }) => {
  const average = Number(summary.averageRating || summary.average || summary.rating || 0);
  const total = Number(summary.totalRatings || summary.total || summary.count || 0);
  const breakdown = summary.ratingBreakdown || summary.breakdown || {};

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average rating</p>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-3xl font-black text-gray-900 dark:text-white">{average.toFixed(1)}</span>
            <RatingStars value={Math.round(average)} readOnly />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{total} rating{total === 1 ? '' : 's'}</p>
        </div>
        <div className="w-full sm:max-w-xs space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = Number(breakdown[star] || breakdown[`star${star}`] || 0);
            const width = total ? Math.min(100, Math.round((count / total) * 100)) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-8">{star}★</span>
                <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${width}%` }} />
                </div>
                <span className="w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
