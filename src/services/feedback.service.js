import apiClient from '../api/apiClient';

const withParams = (params = {}) => ({ params });

export const buyerFeedbackAPI = {
  createRating: (productId, data) => apiClient.post(`/buyer/products/${productId}/ratings`, data),
  updateRating: (ratingId, data) => apiClient.patch(`/buyer/ratings/${ratingId}`, data),
  deleteRating: (ratingId) => apiClient.delete(`/buyer/ratings/${ratingId}`),
  getMyRatings: (params) => apiClient.get('/buyer/ratings/me', withParams(params)),
  getProductRatings: (productId, params) => apiClient.get(`/buyer/products/${productId}/ratings`, withParams(params)),
  getProductRatingSummary: (productId, params) => apiClient.get(`/buyer/products/${productId}/ratings/summary`, withParams(params)),
  createReview: (productId, data) => apiClient.post(`/buyer/products/${productId}/reviews`, data),
  updateReview: (reviewId, data) => apiClient.patch(`/buyer/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => apiClient.delete(`/buyer/reviews/${reviewId}`),
  getMyReviews: (params) => apiClient.get('/buyer/reviews/me', withParams(params)),
  getProductReviews: (productId, params) => apiClient.get(`/buyer/products/${productId}/reviews`, withParams(params)),
  createReport: (data) => apiClient.post('/buyer/reports', data),
  getMyReports: (params) => apiClient.get('/buyer/reports/me', withParams(params)),
};

export const vendorFeedbackAPI = {
  getProductRatings: (params) => apiClient.get('/vendor/ratings/products', withParams(params)),
  getOwnReviews: (params) => apiClient.get('/vendor/reviews/me', withParams(params)),
  getVendorReviews: (vendorId, params) => apiClient.get(`/vendor/reviews/vendor/${vendorId}`, withParams(params)),
  createReport: (data) => apiClient.post('/vendor/reports', data),
  getMyReports: (params) => apiClient.get('/vendor/reports/me', withParams(params)),
};
