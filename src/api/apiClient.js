// import axios from 'axios';

// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6778/api';
// // export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://new-e-commerce-backend-gwr5.onrender.com/api';
// // export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://new-e-commerce-backend-gwr5.onrender.com/api';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Accept: 'application/json',
//   },
// });

// export const clearAuthStorage = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('role');
//   localStorage.removeItem('user');
// };

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;

//     if (status === 401 || status === 403) {
//       clearAuthStorage();
//       window.dispatchEvent(new Event('auth:logout'));
//     }

//     return Promise.reject(error);
//   }
// );

// export const buyerAPI = {
//   getProfile: () => apiClient.get('/buyer/profile/me'),
//   updateProfile: (data) => apiClient.put('/buyer/profile/me', data),
//   getOrders: () => apiClient.get('/buyer/orders'),
//   placeOrder: (data) => apiClient.post('/buyer/orders', data),
//   requestRefund: (orderId, data) => apiClient.post(`/buyer/orders/${orderId}/refund-request`, data),
//   requestReturn: (orderId, data) => apiClient.post(`/buyer/orders/${orderId}/return-request`, data),
// };

// export const vendorAPI = {
//   getProfile: () => apiClient.get('/vendor/profile/me'),
//   updateProfile: (data) => apiClient.put('/vendor/profile/me', data),
//   getProducts: () => apiClient.get('/vendor/product/me'),
//   addProduct: (data, config = {}) => apiClient.post('/vendor/product/add', data, config),
//   updateProduct: (id, data, config = {}) => apiClient.put(`/vendor/product/${id}`, data, config),
//   deleteProduct: (id) => apiClient.delete(`/vendor/product/${id}`),
//   getOrders: () => apiClient.get('/vendor/orders'),
//   getRefundRequests: () => apiClient.get('/vendor/orders/refund-requests'),
//   getReturnRequests: () => apiClient.get('/vendor/orders/return-requests'),
//   reviewRefundRequest: (orderId, data) => apiClient.patch(`/vendor/orders/${orderId}/refund-request/review`, data),
//   reviewReturnRequest: (orderId, data) => apiClient.patch(`/vendor/orders/${orderId}/return-request/review`, data),
//   getVendorDetails: (vendorId) => apiClient.get(`/vendor/vendor/details/${vendorId}`),
//   getVendorProducts: (vendorId) => apiClient.get(`/vendor/vendor/products/${vendorId}`),
//   getVendorProductsByCategory: (vendorId, category) => apiClient.get(`/vendor/vendor/products/${vendorId}/category/${category}`),
// };

// export const founderAPI = {
//   getDashboard: () => apiClient.get('/founder/dashboard'),
//   getUsers: (role) => apiClient.get(`/founder/users${role ? `?role=${role}` : ''}`),
// };

// export default apiClient;

import axios from 'axios';

// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6778/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://new-e-commerce-backend-gwr5.onrender.com/api';
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://new-e-commerce-backend-gwr5.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (!data) return '';
  if (typeof data === 'string') return data.toLowerCase();

  return String(
    data.message ||
    data.error ||
    data.statusMessage ||
    data?.errors?.message ||
    ''
  ).toLowerCase();
};

const shouldLogoutForAuthError = (error) => {
  const status = error.response?.status;
  const message = getErrorMessage(error);

  if (status !== 401) return false;

  return (
    message.includes('token') ||
    message.includes('jwt') ||
    message.includes('expired') ||
    message.includes('unauthorized') ||
    message.includes('invalid credentials') ||
    message.includes('please login') ||
    message.includes('not authenticated')
  );
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (shouldLogoutForAuthError(error)) {
      clearAuthStorage();
      window.dispatchEvent(new Event('auth:logout'));
    }

    return Promise.reject(error);
  }
);

export const buyerAPI = {
  getProfile: () => apiClient.get('/buyer/profile/me'),
  updateProfile: (data) => apiClient.put('/buyer/profile/me', data),
  getOrders: () => apiClient.get('/buyer/orders'),
  placeOrder: (data) => apiClient.post('/buyer/orders', data),
  requestRefund: (orderId, data) => apiClient.post(`/buyer/orders/${orderId}/refund-request`, data),
  requestReturn: (orderId, data) => apiClient.post(`/buyer/orders/${orderId}/return-request`, data),
  createRating: (productId, data) => apiClient.post(`/buyer/products/${productId}/ratings`, data),
  updateRating: (ratingId, data) => apiClient.patch(`/buyer/ratings/${ratingId}`, data),
  deleteRating: (ratingId) => apiClient.delete(`/buyer/ratings/${ratingId}`),
  getMyRatings: (params = {}) => apiClient.get('/buyer/ratings/me', { params }),
  getProductRatings: (productId, params = {}) => apiClient.get(`/buyer/products/${productId}/ratings`, { params }),
  getProductRatingSummary: (productId, params = {}) => apiClient.get(`/buyer/products/${productId}/ratings/summary`, { params }),
  createReview: (productId, data) => apiClient.post(`/buyer/products/${productId}/reviews`, data),
  updateReview: (reviewId, data) => apiClient.patch(`/buyer/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => apiClient.delete(`/buyer/reviews/${reviewId}`),
  getMyReviews: (params = {}) => apiClient.get('/buyer/reviews/me', { params }),
  getProductReviews: (productId, params = {}) => apiClient.get(`/buyer/products/${productId}/reviews`, { params }),
  createReport: (data) => apiClient.post('/buyer/reports', data),
  getMyReports: (params = {}) => apiClient.get('/buyer/reports/me', { params }),
};

export const vendorAPI = {
  getProfile: () => apiClient.get('/vendor/profile/me'),
  updateProfile: (data) => apiClient.put('/vendor/profile/me', data),
  getProducts: () => apiClient.get('/vendor/product/me'),
  addProduct: (data, config = {}) => apiClient.post('/vendor/product/add', data, config),
  updateProduct: (id, data, config = {}) => apiClient.put(`/vendor/product/${id}`, data, config),
  deleteProduct: (id) => apiClient.delete(`/vendor/product/${id}`),
  getOrders: () => apiClient.get('/vendor/orders'),
  getRefundRequests: () => apiClient.get('/vendor/orders/refund-requests'),
  getReturnRequests: () => apiClient.get('/vendor/orders/return-requests'),
  reviewRefundRequest: (orderId, data) => apiClient.patch(`/vendor/orders/${orderId}/refund-request/review`, data),
  reviewReturnRequest: (orderId, data) => apiClient.patch(`/vendor/orders/${orderId}/return-request/review`, data),
  getVendorDetails: (vendorId) => apiClient.get(`/vendor/vendor/details/${vendorId}`),
  getVendorProducts: (vendorId) => apiClient.get(`/vendor/vendor/products/${vendorId}`),
  getVendorProductsByCategory: (vendorId, category) => apiClient.get(`/vendor/vendor/products/${vendorId}/category/${category}`),
  getProductRatings: (params = {}) => apiClient.get('/vendor/ratings/products', { params }),
  getOwnReviews: (params = {}) => apiClient.get('/vendor/reviews/me', { params }),
  getVendorReviews: (vendorId, params = {}) => apiClient.get(`/vendor/reviews/vendor/${vendorId}`, { params }),
  createReport: (data) => apiClient.post('/vendor/reports', data),
  getMyReports: (params = {}) => apiClient.get('/vendor/reports/me', { params }),
};

export const founderAPI = {
  getDashboard: () => apiClient.get('/founder/dashboard'),
  getUsers: (role) => apiClient.get(`/founder/users${role ? `?role=${role}` : ''}`),
};

export default apiClient;