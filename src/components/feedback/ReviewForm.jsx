import { useState } from 'react';
import RatingStars from './RatingStars';

const ReviewForm = ({ initialData = {}, onSubmit, onCancel, loading = false, submitText = 'Save review' }) => {
  const [comment, setComment] = useState(initialData.comment || '');
  const [rating, setRating] = useState(Number(initialData.rating || initialData.ratingValue || 0));
  const [orderId, setOrderId] = useState(initialData.orderId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const data = { comment: comment.trim() };
    if (rating) {
      data.rating = rating;
      data.ratingValue = rating;
    }
    if (orderId.trim()) data.orderId = orderId.trim();
    onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Review</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" maxLength="1000" className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Write your review" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Rating, optional</label>
        <RatingStars value={rating} onChange={setRating} size="text-2xl" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">Order ID, optional</label>
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="Use completed order ID when available" />
      </div>
      <div className="flex flex-wrap gap-3">
        <button disabled={loading || !comment.trim()} className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
          {loading ? 'Saving...' : submitText}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 dark:border-gray-700 dark:text-gray-200">Cancel</button>}
      </div>
    </form>
  );
};

export default ReviewForm;
