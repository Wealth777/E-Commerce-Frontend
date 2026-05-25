import { io } from 'socket.io-client';
import { API_BASE_URL } from '../api/apiClient';

const SOCKET_URL = API_BASE_URL.replace(/\/api\/?$/, '');

let socket = null;

export const connectNotificationSocket = (token) => {
  if (!token) return null;

  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  return socket;
};

export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export const getNotificationSocket = () => socket;
