import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUnreadCount,
  receiveNotification,
  setSocketConnected,
  setUnreadCount,
} from '../store/notificationSlice';
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
} from '../services/socketService';

const useNotificationSocket = () => {
  const dispatch = useDispatch();
  const { token, role, isAuthenticated } = useSelector((state) => state.auth);
  const shouldConnect = isAuthenticated && token && ['buyer', 'vendor'].includes(role);

  useEffect(() => {
    if (!shouldConnect) {
      disconnectNotificationSocket();
      dispatch(setSocketConnected(false));
      return undefined;
    }

    const socket = connectNotificationSocket(token);
    if (!socket) return undefined;

    const handleConnect = () => {
      dispatch(setSocketConnected(true));
      dispatch(fetchUnreadCount());
    };

    const handleDisconnect = () => {
      dispatch(setSocketConnected(false));
    };

    const handleNewNotification = (notification) => {
      dispatch(receiveNotification(notification));
    };

    const handleUnreadCount = (payload) => {
      dispatch(setUnreadCount(payload?.count ?? payload ?? 0));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('notification:new', handleNewNotification);
    socket.on('notification:unread-count', handleUnreadCount);

    if (socket.connected) handleConnect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:unread-count', handleUnreadCount);
      disconnectNotificationSocket();
    };
  }, [dispatch, shouldConnect, token]);
};

export default useNotificationSocket;
