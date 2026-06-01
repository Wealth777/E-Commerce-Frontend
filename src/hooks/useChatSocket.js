// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getNotificationSocket } from '../services/socketService';
// import {
//   markSocketRead,
//   receiveSocketMessage,
//   removeSocketMessage,
//   setChatSocketConnected,
//   setTypingStatus,
//   setUserOnlineStatus,
//   updateSocketConversation,
// } from '../store/chatSlice';

// const getCurrentUserId = (user) => (
//   user?.userId ||
//   user?.accountId ||
//   user?.authUserId ||
//   user?.user?._id ||
//   user?.user?.id ||
//   user?._id ||
//   user?.id ||
//   user?.profile?._id ||
//   user?.profile?.id ||
//   user?.buyer?._id ||
//   user?.buyer?.id ||
//   user?.vendor?._id ||
//   user?.vendor?.id ||
//   user?.vendorInfo?._id ||
//   user?.vendorInfo?.id ||
//   user?.buyerInfo?._id ||
//   user?.buyerInfo?.id
// );

// const getOnlinePayload = (payload, online) => {
//   const userId = (
//     payload?.userId ||
//     payload?.accountId ||
//     payload?.authUserId ||
//     payload?.user?._id ||
//     payload?.user?.id ||
//     payload?._id ||
//     payload?.id ||
//     payload
//   );
//   const role = payload?.role || payload?.userRole || payload?.targetRole || payload?.participantRole || payload?.user?.role;

//   return { userId, role, online };
// };

// const useChatSocket = (activeConversationId = null) => {
//   const dispatch = useDispatch();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const userId = getCurrentUserId(user);

//   useEffect(() => {
//     const socket = getNotificationSocket();

//     if (!isAuthenticated || !socket) {
//       dispatch(setChatSocketConnected(false));
//       return undefined;
//     }

//     const handleConnect = () => dispatch(setChatSocketConnected(true));
//     const handleDisconnect = () => dispatch(setChatSocketConnected(false));
//     const handleReceiveMessage = (message) => dispatch(receiveSocketMessage(message));
//     const handleConversationUpdated = (conversation) => dispatch(updateSocketConversation(conversation));
//     const handleTypingStart = (payload) => dispatch(setTypingStatus({ ...payload, isTyping: true }));
//     const handleTypingStop = (payload) => dispatch(setTypingStatus({ ...payload, isTyping: false }));
//     const handleUserOnline = (payload) => dispatch(setUserOnlineStatus(getOnlinePayload(payload, true)));
//     const handleUserOffline = (payload) => dispatch(setUserOnlineStatus(getOnlinePayload(payload, false)));
//     const handleMessageRead = (payload) => dispatch(markSocketRead(payload));
//     const handleMessageDeleted = (payload) => dispatch(removeSocketMessage(payload));

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);
//     socket.on('receive_message', handleReceiveMessage);
//     socket.on('conversation_updated', handleConversationUpdated);
//     socket.on('typing_start', handleTypingStart);
//     socket.on('typing_stop', handleTypingStop);
//     socket.on('user_online', handleUserOnline);
//     socket.on('user_offline', handleUserOffline);
//     socket.on('message_read', handleMessageRead);
//     socket.on('message_deleted', handleMessageDeleted);
//     socket.on('conversation_archived', handleConversationUpdated);

//     if (socket.connected) handleConnect();

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//       socket.off('receive_message', handleReceiveMessage);
//       socket.off('conversation_updated', handleConversationUpdated);
//       socket.off('typing_start', handleTypingStart);
//       socket.off('typing_stop', handleTypingStop);
//       socket.off('user_online', handleUserOnline);
//       socket.off('user_offline', handleUserOffline);
//       socket.off('message_read', handleMessageRead);
//       socket.off('message_deleted', handleMessageDeleted);
//       socket.off('conversation_archived', handleConversationUpdated);
//     };
//   }, [dispatch, isAuthenticated, userId]);

//   useEffect(() => {
//     const socket = getNotificationSocket();
//     if (!socket || !activeConversationId) return undefined;

//     socket.emit('join_chat', { conversationId: activeConversationId });

//     return () => {
//       socket.emit('leave_chat', { conversationId: activeConversationId });
//     };
//   }, [activeConversationId]);
// };

// export const emitTypingStart = (conversationId) => {
//   const socket = getNotificationSocket();
//   if (socket && conversationId) socket.emit('typing_start', { conversationId });
// };

// export const emitTypingStop = (conversationId) => {
//   const socket = getNotificationSocket();
//   if (socket && conversationId) socket.emit('typing_stop', { conversationId });
// };

// export const emitMessageRead = (conversationId) => {
//   const socket = getNotificationSocket();
//   if (socket && conversationId) socket.emit('message_read', { conversationId });
// };

// export default useChatSocket;

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationSocket } from '../services/socketService';
import {
  markSocketRead,
  receiveSocketMessage,
  removeSocketMessage,
  setChatSocketConnected,
  setTypingStatus,
  setUserOnlineStatus,
  updateSocketConversation,
} from '../store/chatSlice';

const getId = (value = {}) => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return String(
    value?.userId ||
      value?.accountId ||
      value?.authUserId ||
      value?.user?._id ||
      value?.user?.id ||
      value?._id ||
      value?.id ||
      ''
  );
};

const getOnlinePayload = (payload, online) => {
  const userId = getId(payload?.userId || payload?.user || payload?.accountId || payload);
  const role = payload?.role || payload?.userRole || payload?.targetRole || payload?.participantRole || payload?.user?.role;
  return { userId, role, online };
};

const normalizeTypingPayload = (payload = {}, isTyping) => ({
  conversationId: payload?.conversationId || payload?.conversation?._id || payload?.conversation?.id,
  userId: getId(payload?.userId || payload?.user || payload?.senderId || payload?.sender),
  isTyping,
});

const getPayloadConversationId = (payload = {}) => (
  payload?.conversationId ||
  payload?.conversation?._id ||
  payload?.conversation?.id ||
  payload?.message?.conversationId ||
  payload?.message?.conversation?._id ||
  payload?.data?.conversationId ||
  payload?.data?.message?.conversationId ||
  ''
);

const useChatSocket = ({ activeConversationId = null, conversationIds = [] } = {}) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const joinedConversationIds = useMemo(
    () => [...new Set([activeConversationId, ...conversationIds].filter(Boolean).map(String))],
    [activeConversationId, conversationIds]
  );

  useEffect(() => {
    const socket = getNotificationSocket();

    if (!isAuthenticated || !socket) {
      dispatch(setChatSocketConnected(false));
      return undefined;
    }

    const joinRooms = () => {
      joinedConversationIds.forEach((conversationId) => {
        socket.emit('join_chat', { conversationId });
      });
    };

    const handleConnect = () => {
      dispatch(setChatSocketConnected(true));
      joinRooms();
    };

    const handleDisconnect = () => dispatch(setChatSocketConnected(false));
    const handleReceiveMessage = (payload) => {
      dispatch(receiveSocketMessage(payload));
      const conversationId = getPayloadConversationId(payload);
      if (conversationId) socket.emit('message_delivered', { conversationId });
    };
    const handleConversationUpdated = (conversation) => dispatch(updateSocketConversation(conversation));
    const handleTypingStart = (payload) => dispatch(setTypingStatus(normalizeTypingPayload(payload, true)));
    const handleTypingStop = (payload) => dispatch(setTypingStatus(normalizeTypingPayload(payload, false)));
    const handleUserOnline = (payload) => dispatch(setUserOnlineStatus(getOnlinePayload(payload, true)));
    const handleUserOffline = (payload) => dispatch(setUserOnlineStatus(getOnlinePayload(payload, false)));
    const handleMessageRead = (payload) => dispatch(markSocketRead(payload));
    const handleMessageDeleted = (payload) => dispatch(removeSocketMessage(payload));

    socket.off('receive_message', handleReceiveMessage);
    socket.off('new_message', handleReceiveMessage);
    socket.off('message_sent', handleReceiveMessage);
    socket.off('chat_message', handleReceiveMessage);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive_message', handleReceiveMessage);
    socket.on('new_message', handleReceiveMessage);
    socket.on('message_sent', handleReceiveMessage);
    socket.on('chat_message', handleReceiveMessage);
    socket.on('conversation_updated', handleConversationUpdated);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('message_read', handleMessageRead);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('conversation_archived', handleConversationUpdated);

    if (socket.connected) handleConnect();

    return () => {
      joinedConversationIds.forEach((conversationId) => socket.emit('leave_chat', { conversationId }));
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('new_message', handleReceiveMessage);
      socket.off('message_sent', handleReceiveMessage);
      socket.off('chat_message', handleReceiveMessage);
      socket.off('conversation_updated', handleConversationUpdated);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
      socket.off('message_read', handleMessageRead);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('conversation_archived', handleConversationUpdated);
    };
  }, [dispatch, isAuthenticated, joinedConversationIds]);
};

export const emitTypingStart = (conversationId) => {
  const socket = getNotificationSocket();
  if (socket && conversationId) socket.emit('typing_start', { conversationId });
};

export const emitTypingStop = (conversationId) => {
  const socket = getNotificationSocket();
  if (socket && conversationId) socket.emit('typing_stop', { conversationId });
};

export const emitMessageRead = (conversationId) => {
  const socket = getNotificationSocket();
  if (socket && conversationId) socket.emit('message_read', { conversationId });
};

export default useChatSocket;