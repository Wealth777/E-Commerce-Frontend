import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:6778/api';
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
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
};

export const founderAPI = {
  getDashboard: () => apiClient.get('/founder/dashboard'),
  getUsers: (role) => apiClient.get(`/founder/users${role ? `?role=${role}` : ''}`),
};

export default apiClient;