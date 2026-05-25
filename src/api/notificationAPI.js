import apiClient from './apiClient';

const notificationAPI = {
  getNotifications: ({ page = 1, limit = 10 } = {}) =>
    apiClient.get('/notifications', { params: { page, limit } }),

  getUnreadCount: () => apiClient.get('/notifications/unread-count'),

  markAsRead: (notificationId, channel = 'inApp') =>
    apiClient.patch(`/notifications/${notificationId}/read`, { channel }),

  markAllAsRead: (channel = 'inApp') =>
    apiClient.patch('/notifications/read-all', { channel }),

  deleteNotification: (notificationId) =>
    apiClient.delete(`/notifications/${notificationId}`),
};

export default notificationAPI;
