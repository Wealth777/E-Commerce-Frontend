import apiClient from './apiClient';

const buildQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.append(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : '';
};

const chatAPI = {
  startConversation: (data) => apiClient.post('/chat/conversations', data),
  getConversations: (params = {}) => apiClient.get(`/chat/conversations${buildQuery(params)}`),
  searchConversations: (q) => apiClient.get(`/chat/conversations/search${buildQuery({ q })}`),
  getMessages: (conversationId, params = {}) => apiClient.get(`/chat/conversations/${conversationId}/messages${buildQuery(params)}`),
  searchMessages: (conversationId, q) => apiClient.get(`/chat/conversations/${conversationId}/messages/search${buildQuery({ q })}`),
  sendMessage: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'attachments') {
        Array.from(value || []).forEach((file) => formData.append('attachments', file));
        return;
      }
      if (value !== undefined && value !== null && value !== '') formData.append(key, value);
    });
    return apiClient.post('/chat/messages', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  markRead: (conversationId) => apiClient.patch(`/chat/conversations/${conversationId}/read`),
  archiveConversation: (conversationId) => apiClient.patch(`/chat/conversations/${conversationId}/archive`),
  unarchiveConversation: (conversationId) => apiClient.patch(`/chat/conversations/${conversationId}/unarchive`),
  deleteConversation: (conversationId) => apiClient.delete(`/chat/conversations/${conversationId}`),
  deleteMessage: (messageId, forEveryone = false) => apiClient.delete(`/chat/messages/${messageId}`, { data: { forEveryone } }),
  blockUser: (data) => apiClient.post('/chat/block', data),
  unblockUser: (data) => apiClient.post('/chat/unblock', data),
  reportUser: (data) => apiClient.post('/chat/reports/user', data),
  reportConversation: (conversationId, data) => apiClient.post(`/chat/conversations/${conversationId}/report`, data),
};

export default chatAPI;