import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buyerFeedbackAPI } from '../../services/feedback.service';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { EmptyState, ErrorState, LoadingState, RatingForm, RatingStars, ReviewCard, ReviewForm } from '../../components/feedback';

const BuyerRatingsReviews = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [tab, setTab] = useState('ratings');
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRating, setEditingRating] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', status: '', rating: '', sortBy: 'createdAt', sortOrder: 'desc' });

  const loadData = async () => {
    setError('');
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
      const [ratingsRes, reviewsRes] = await Promise.all([
        buyerFeedbackAPI.getMyRatings(params),
        buyerFeedbackAPI.getMyReviews(params),
      ]);
      setRatings(getList(ratingsRes, ['ratings', 'data', 'items']));
      setReviews(getList(reviewsRes, ['reviews', 'data', 'items']));
    } catch (err) {
      setError(getMessage(err, 'Failed to load ratings and reviews'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filters.page, filters.status, filters.rating, filters.sortBy, filters.sortOrder]);

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }));

  const handleUpdateRating = async (data) => {
    if (!editingRating?._id && !editingRating?.id) return;
    setSaving(true);
    try {
      await buyerFeedbackAPI.updateRating(editingRating._id || editingRating.id, data);
      showToast('Rating updated', 'success');
      setEditingRating(null);
      loadData();
    } catch (err) {
      showToast(getMessage(err, 'Failed to update rating'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateReview = async (data) => {
    if (!editingReview?._id && !editingReview?.id) return;
    setSaving(true);
    try {
      await buyerFeedbackAPI.updateReview(editingReview._id || editingReview.id, data);
      showToast('Review updated', 'success');
      setEditingReview(null);
      loadData();
    } catch (err) {
      showToast(getMessage(err, 'Failed to update review'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteRating = async (rating) => {
    if (!confirm('Delete this rating?')) return;
    try {
      await buyerFeedbackAPI.deleteRating(rating._id || rating.id);
      showToast('Rating deleted', 'success');
      loadData();
    } catch (err) {
      showToast(getMessage(err, 'Failed to delete rating'), 'error');
    }
  };

  const deleteReview = async (review) => {
    if (!confirm('Delete this review?')) return;
    try {
      await buyerFeedbackAPI.deleteReview(review._id || review.id);
      showToast('Review deleted', 'success');
      loadData();
    } catch (err) {
      showToast(getMessage(err, 'Failed to delete review'), 'error');
    }
  };

  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4 md:p-8`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black">My Ratings and Reviews</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage product feedback you submitted.</p>
          </div>
          <Link to="/buyer/reports" className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white">View reports</Link>
        </div>

        <div className={`rounded-2xl border ${cardBg} p-4`}>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setTab('ratings')} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'ratings' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>Ratings</button>
            <button onClick={() => setTab('reviews')} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === 'reviews' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>Reviews</button>
            <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadData()} placeholder="Search" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">All status</option><option value="active">active</option><option value="hidden">hidden</option><option value="deleted">deleted</option>
            </select>
            <select value={filters.rating} onChange={(e) => updateFilter('rating', e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">All ratings</option>{[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </div>
        </div>

        {loading ? <LoadingState text="Loading feedback..." /> : error ? <ErrorState message={error} onRetry={loadData} /> : tab === 'ratings' ? (
          <div className="space-y-4">
            {editingRating && <RatingForm initialData={editingRating} onSubmit={handleUpdateRating} onCancel={() => setEditingRating(null)} loading={saving} submitText="Update rating" />}
            {ratings.length === 0 ? <EmptyState title="No ratings yet" description="Your product ratings will appear here." /> : ratings.map((rating) => {
              const product = rating.product || rating.productId || {};
              return (
                <div key={rating._id || rating.id} className={`rounded-2xl border ${cardBg} p-5 shadow-sm`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <RatingStars value={rating.rating || rating.ratingValue} readOnly />
                      <h3 className="mt-2 font-bold">{product.name || 'Product rating'}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{rating.comment || 'No comment'}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.storeName || 'CampusTrade Vendor'}</p>
                      {rating.createdAt && <p className="mt-2 text-xs text-gray-400">{new Date(rating.createdAt).toLocaleDateString()}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingRating(rating)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold dark:border-gray-700">Edit</button>
                      <button onClick={() => deleteRating(rating)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {editingReview && <ReviewForm initialData={editingReview} onSubmit={handleUpdateReview} onCancel={() => setEditingReview(null)} loading={saving} submitText="Update review" />}
            {reviews.length === 0 ? <EmptyState title="No reviews yet" description="Your product reviews will appear here." /> : reviews.map((review) => (
              <ReviewCard key={review._id || review.id} review={review} allowEdit allowDelete onEdit={setEditingReview} onDelete={deleteReview} />
            ))}
          </div>
        )}

        <div className="flex justify-between">
          <button disabled={filters.page <= 1} onClick={() => updateFilter('page', Math.max(1, filters.page - 1))} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold disabled:opacity-50 dark:border-gray-700">Previous</button>
          <span className="text-sm text-gray-500">Page {filters.page}</span>
          <button onClick={() => updateFilter('page', filters.page + 1)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold dark:border-gray-700">Next</button>
        </div>
      </div>
    </div>
  );
};

export default BuyerRatingsReviews;
