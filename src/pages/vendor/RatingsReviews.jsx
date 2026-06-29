import { useEffect, useState } from 'react';
import { vendorFeedbackAPI } from '../../services/feedback.service';
import { getList, getMessage } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { EmptyState, ErrorState, LoadingState, RatingStars, ReviewCard, ProductRatingDisplay } from '../../components/feedback';

const VendorRatingsReviews = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [tab, setTab] = useState('ratings');
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '', rating: '', sortBy: 'createdAt', sortOrder: 'desc' });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
      const [ratingsRes, reviewsRes] = await Promise.all([
        vendorFeedbackAPI.getProductRatings(params),
        vendorFeedbackAPI.getOwnReviews(params),
      ]);
      setRatings(getList(ratingsRes, ['ratings', 'data', 'items']));
      setReviews(getList(reviewsRes, ['reviews', 'data', 'items']));
    } catch (err) {
      setError(getMessage(err, 'Failed to load vendor feedback'));
      showToast(getMessage(err, 'Failed to load vendor feedback'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filters.page, filters.status, filters.rating, filters.sortBy, filters.sortOrder]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4 md:p-8`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-black">Product Ratings and Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">View buyer feedback connected to your products.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setTab('ratings')} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'ratings' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>Ratings</button>
            <button onClick={() => setTab('reviews')} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'reviews' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>Reviews</button>
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadData()} placeholder="Search" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">All status</option><option value="active">active</option><option value="hidden">hidden</option><option value="flagged">flagged</option>
            </select>
            <select value={filters.rating} onChange={(e) => updateFilter('rating', e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">All ratings</option>{[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </div>
        </div>

        {loading ? <LoadingState text="Loading vendor feedback..." /> : error ? <ErrorState message={error} onRetry={loadData} /> : tab === 'ratings' ? (
          ratings.length === 0 ? <EmptyState title="No product ratings yet" description="Ratings for your products will appear here." /> : (
            <div className="space-y-4">{ratings.map((rating) => {
              const product = rating.product || rating.productId || {};
              const buyer = rating.buyer || rating.buyerId || {};
              return (
                <div key={rating._id || rating.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <RatingStars value={rating.rating || rating.ratingValue} readOnly />
                  <h3 className="mt-2 font-bold">{product.name || 'Product rating'}</h3>
                  {product.ratingSummary && (
                    <ProductRatingDisplay
                      product={product}
                      size="text-xs"
                      starSize="text-xs"
                      className="mt-1"
                    />
                  )}
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{rating.comment || 'No comment'}</p>
                  <p className="mt-2 text-xs text-gray-400">{buyer.fullName || buyer.username || 'Buyer'}{rating.createdAt ? ` · ${new Date(rating.createdAt).toLocaleDateString()}` : ''}</p>
                </div>
              );
            })}</div>
          )
        ) : (
          reviews.length === 0 ? <EmptyState title="No product reviews yet" description="Reviews for your products will appear here." /> : (
            <div className="space-y-4">{reviews.map((review) => <ReviewCard key={review._id || review.id} review={review} />)}</div>
          )
        )}
      </div>
    </div>
  );
};

export default VendorRatingsReviews;
