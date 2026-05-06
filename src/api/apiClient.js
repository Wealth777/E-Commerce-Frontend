import axios from 'axios';

const API_BASE_URL = 'http://localhost:6778/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const buyerAPI = {
  getProfile: () => apiClient.get('/buyer/profile/me'),
  updateProfile: (data) => apiClient.put('/buyer/profile/me', data),
  getOrders: () => apiClient.get('/buyer/orders'),
  placeOrder: (data) => apiClient.post('/buyer/orders', data),
  
  // Refund and Return Requests
  requestRefund: (orderId, data) => apiClient.post(`/buyer/orders/${orderId}/refund-request`, data),
  requestReturn: (orderId, data) => apiClient.post(`/buyer/orders/${orderId}/return-request`, data),
  // Add more as needed
};

export const vendorAPI = {
  getProfile: () => apiClient.get('/vendor/profile/me'),
  updateProfile: (data) => apiClient.put('/vendor/profile', data),
  getProducts: () => apiClient.get('/vendor/products'),
  addProduct: (data) => apiClient.post('/vendor/products', data),
  updateProduct: (id, data) => apiClient.put(`/vendor/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/vendor/products/${id}`),
  getOrders: () => apiClient.get('/vendor/orders'),
  
  // Refund and Return Requests
  getRefundRequests: () => apiClient.get('/vendor/orders/refund-requests'),
  getReturnRequests: () => apiClient.get('/vendor/orders/return-requests'),
  reviewRefundRequest: (orderId, data) => apiClient.patch(`/vendor/orders/${orderId}/refund-request/review`, data),
  reviewReturnRequest: (orderId, data) => apiClient.patch(`/vendor/orders/${orderId}/return-request/review`, data),
  
  // Vendor Details - Public endpoints
  getVendorDetails: (vendorId) => apiClient.get(`/vendor/details/${vendorId}`),
  getVendorProducts: (vendorId) => apiClient.get(`/vendor/products/${vendorId}`),
  getVendorProductsByCategory: (vendorId, category) => apiClient.get(`/vendor/products/${vendorId}/category/${category}`),
  // Add more as needed
};

export const founderAPI = {
  getDashboard: () => apiClient.get('/founder/dashboard'),
  getUsers: () => apiClient.get('/founder/users'),
  // Add more as needed
};

export default apiClient;