// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import chatAPI from '../api/chatAPI';
// import { getList, getMessage, getPayload } from '../utils/apiResponse';

// const getId = (item) => item?._id || item?.id || item?.userId;

// const getConversationId = (item) => getId(item) || item?.conversationId;

// const normalizeConversation = (conversation = {}) => ({
//   ...conversation,
//   id: getId(conversation),
// });

// const normalizeMessage = (message = {}) => ({
//   ...message,
//   id: getId(message),
// });

// const extractPagination = (response, fallbackPage = 1, fallbackLimit = 20) => {
//   const payload = getPayload(response, {});
//   const pagination = payload?.pagination || payload?.meta || response?.data?.pagination || {};
//   return {
//     page: Number(pagination.page || payload?.page || fallbackPage),
//     limit: Number(pagination.limit || payload?.limit || fallbackLimit),
//     totalPages: Number(pagination.totalPages || pagination.pages || payload?.totalPages || 1),
//     total: Number(pagination.total || payload?.total || 0),
//   };
// };

// export const fetchConversations = createAsyncThunk(
//   'chat/fetchConversations',
//   async ({ page = 1, limit = 20, search = '', archived = '', unread = '' } = {}, { rejectWithValue }) => {
//     try {
//       const response = await chatAPI.getConversations({ page, limit, search, archived, unread });
//       return {
//         conversations: getList(response, ['conversations', 'docs', 'items']).map(normalizeConversation),
//         pagination: extractPagination(response, page, limit),
//         replace: page === 1,
//       };
//     } catch (error) {
//       return rejectWithValue(getMessage(error, 'Failed to load conversations'));
//     }
//   }
// );

// export const startConversation = createAsyncThunk(
//   'chat/startConversation',
//   async ({ targetUserId, targetRole }, { rejectWithValue }) => {
//     try {
//       const response = await chatAPI.startConversation({ targetUserId, targetRole });
//       return normalizeConversation(getPayload(response, {}));
//     } catch (error) {
//       return rejectWithValue(getMessage(error, 'Failed to start conversation'));
//     }
//   }
// );

// export const fetchMessages = createAsyncThunk(
//   'chat/fetchMessages',
//   async ({ conversationId, page = 1, limit = 30, q = '' }, { rejectWithValue }) => {
//     try {
//       const response = q
//         ? await chatAPI.searchMessages(conversationId, q)
//         : await chatAPI.getMessages(conversationId, { page, limit });
//       return {
//         conversationId,
//         messages: getList(response, ['messages', 'docs', 'items']).map(normalizeMessage),
//         pagination: extractPagination(response, page, limit),
//         replace: page === 1 || Boolean(q),
//       };
//     } catch (error) {
//       return rejectWithValue(getMessage(error, 'Failed to load messages'));
//     }
//   }
// );

// export const sendChatMessage = createAsyncThunk(
//   'chat/sendChatMessage',
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await chatAPI.sendMessage(data);
//       const payload = getPayload(response, {});
//       return normalizeMessage(payload?.message || payload);
//     } catch (error) {
//       return rejectWithValue(getMessage(error, 'Failed to send message'));
//     }
//   }
// );

// export const markConversationRead = createAsyncThunk(
//   'chat/markConversationRead',
//   async (conversationId, { rejectWithValue }) => {
//     try {
//       await chatAPI.markRead(conversationId);
//       return conversationId;
//     } catch (error) {
//       return rejectWithValue(getMessage(error, 'Failed to mark conversation as read'));
//     }
//   }
// );

// export const archiveConversation = createAsyncThunk('chat/archiveConversation', async (conversationId, { rejectWithValue }) => {
//   try {
//     await chatAPI.archiveConversation(conversationId);
//     return conversationId;
//   } catch (error) {
//     return rejectWithValue(getMessage(error, 'Failed to archive conversation'));
//   }
// });

// export const unarchiveConversation = createAsyncThunk('chat/unarchiveConversation', async (conversationId, { rejectWithValue }) => {
//   try {
//     await chatAPI.unarchiveConversation(conversationId);
//     return conversationId;
//   } catch (error) {
//     return rejectWithValue(getMessage(error, 'Failed to unarchive conversation'));
//   }
// });

// export const deleteConversation = createAsyncThunk('chat/deleteConversation', async (conversationId, { rejectWithValue }) => {
//   try {
//     await chatAPI.deleteConversation(conversationId);
//     return conversationId;
//   } catch (error) {
//     return rejectWithValue(getMessage(error, 'Failed to delete conversation'));
//   }
// });

// export const blockChatUser = createAsyncThunk('chat/blockChatUser', async (data, { rejectWithValue }) => {
//   try {
//     await chatAPI.blockUser(data);
//     return data;
//   } catch (error) {
//     return rejectWithValue(getMessage(error, 'Failed to block user'));
//   }
// });

// export const unblockChatUser = createAsyncThunk('chat/unblockChatUser', async (data, { rejectWithValue }) => {
//   try {
//     await chatAPI.unblockUser(data);
//     return data;
//   } catch (error) {
//     return rejectWithValue(getMessage(error, 'Failed to unblock user'));
//   }
// });

// export const reportChatUser = createAsyncThunk('chat/reportChatUser', async (data, { rejectWithValue }) => {
//   try {
//     await chatAPI.reportUser(data);
//     return true;
//   } catch (error) {
//     return rejectWithValue(getMessage(error, 'Failed to report user'));
//   }
// });

// export const reportConversation = createAsyncThunk('chat/reportConversation', async ({ conversationId, reason }, { rejectWithValue }) => {
//   try {
//     await chatAPI.reportConversation(conversationId, { reason });
//     return true;
//   } catch (error) {
//     return rejectWithValue(getMessage(error, 'Failed to report conversation'));
//   }
// });

// const initialState = {
//   conversations: [],
//   activeConversationId: null,
//   messagesByConversation: {},
//   messagePagination: {},
//   conversationPagination: { page: 1, limit: 20, totalPages: 1, total: 0 },
//   loadingConversations: false,
//   loadingMessages: false,
//   sending: false,
//   actionLoading: false,
//   socketConnected: false,
//   onlineUsers: {},
//   typingByConversation: {},
//   filters: { search: '', archived: '', unread: '' },
//   error: null,
// };

// const upsertConversation = (state, conversation) => {
//   const normalized = normalizeConversation(conversation);
//   if (!normalized.id) return;
//   const index = state.conversations.findIndex((item) => item.id === normalized.id);
//   if (index >= 0) state.conversations[index] = { ...state.conversations[index], ...normalized };
//   else state.conversations.unshift(normalized);
// };

// const upsertMessage = (state, message) => {
//   const normalized = normalizeMessage(message);
//   const conversationId = normalized.conversationId || normalized.conversation?._id || normalized.conversation?.id;
//   if (!conversationId || !normalized.id) return;
//   const list = state.messagesByConversation[conversationId] || [];
//   const exists = list.some((item) => item.id === normalized.id);
//   state.messagesByConversation[conversationId] = exists
//     ? list.map((item) => (item.id === normalized.id ? { ...item, ...normalized } : item))
//     : [...list, normalized];
// };

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     setActiveConversation: (state, action) => {
//       state.activeConversationId = action.payload;
//     },
//     setChatSocketConnected: (state, action) => {
//       state.socketConnected = Boolean(action.payload);
//     },
//     receiveSocketMessage: (state, action) => {
//       upsertMessage(state, action.payload);
//     },
//     updateSocketConversation: (state, action) => {
//       upsertConversation(state, action.payload);
//     },
//     setTypingStatus: (state, action) => {
//       const { conversationId, userId, isTyping } = action.payload || {};
//       if (!conversationId || !userId) return;
//       state.typingByConversation[conversationId] = {
//         ...(state.typingByConversation[conversationId] || {}),
//         [userId]: Boolean(isTyping),
//       };
//     },
//     setUserOnlineStatus: (state, action) => {
//       const { userId, role, online } = action.payload || {};
//       if (!userId) return;

//       const key = String(userId);
//       state.onlineUsers[key] = Boolean(online);

//       if (role) {
//         state.onlineUsers[`${role}:${key}`] = Boolean(online);
//         state.onlineUsers[`${key}:${role}`] = Boolean(online);
//       }
//     },
//     markSocketRead: (state, action) => {
//       const { conversationId, readerId, readAt } = action.payload || {};
//       const messages = state.messagesByConversation[conversationId] || [];
//       state.messagesByConversation[conversationId] = messages.map((message) => ({
//         ...message,
//         readBy: message.readBy || [],
//         readAt: message.readAt || readAt,
//         status: message.receiverId === readerId ? 'read' : message.status,
//       }));
//     },
//     removeSocketMessage: (state, action) => {
//       const { conversationId, messageId } = action.payload || {};
//       const messages = state.messagesByConversation[conversationId] || [];
//       state.messagesByConversation[conversationId] = messages.filter((message) => message.id !== messageId && message._id !== messageId);
//     },
//     clearChatState: () => initialState,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchConversations.pending, (state) => { state.loadingConversations = true; state.error = null; })
//       .addCase(fetchConversations.fulfilled, (state, action) => {
//         state.conversations = action.payload.replace ? action.payload.conversations : [...state.conversations, ...action.payload.conversations.filter((next) => !state.conversations.some((item) => item.id === next.id))];
//         state.conversationPagination = action.payload.pagination;
//         state.loadingConversations = false;
//       })
//       .addCase(fetchConversations.rejected, (state, action) => { state.loadingConversations = false; state.error = action.payload; })
//       .addCase(startConversation.fulfilled, (state, action) => { upsertConversation(state, action.payload); state.activeConversationId = action.payload.id; })
//       .addCase(fetchMessages.pending, (state) => { state.loadingMessages = true; state.error = null; })
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         const current = state.messagesByConversation[action.payload.conversationId] || [];
//         const incoming = action.payload.messages;
//         state.messagesByConversation[action.payload.conversationId] = action.payload.replace ? incoming : [...incoming.filter((next) => !current.some((item) => item.id === next.id)), ...current];
//         state.messagePagination[action.payload.conversationId] = action.payload.pagination;
//         state.loadingMessages = false;
//       })
//       .addCase(fetchMessages.rejected, (state, action) => { state.loadingMessages = false; state.error = action.payload; })
//       .addCase(sendChatMessage.pending, (state) => { state.sending = true; state.error = null; })
//       .addCase(sendChatMessage.fulfilled, (state, action) => { upsertMessage(state, action.payload); state.sending = false; })
//       .addCase(sendChatMessage.rejected, (state, action) => { state.sending = false; state.error = action.payload; })
//       .addCase(markConversationRead.fulfilled, (state, action) => {
//         const item = state.conversations.find((conversation) => conversation.id === action.payload);
//         if (item) item.unreadCount = 0;
//       })
//       .addCase(archiveConversation.fulfilled, (state, action) => {
//         const item = state.conversations.find((conversation) => conversation.id === action.payload);
//         if (item) item.archived = true;
//       })
//       .addCase(unarchiveConversation.fulfilled, (state, action) => {
//         const item = state.conversations.find((conversation) => conversation.id === action.payload);
//         if (item) item.archived = false;
//       })
//       .addCase(deleteConversation.fulfilled, (state, action) => {
//         state.conversations = state.conversations.filter((conversation) => conversation.id !== action.payload);
//         if (state.activeConversationId === action.payload) state.activeConversationId = null;
//       })
//       .addMatcher((action) => action.type.startsWith('chat/') && action.type.endsWith('/pending'), (state) => { state.actionLoading = true; })
//       .addMatcher((action) => action.type.startsWith('chat/') && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')), (state) => { state.actionLoading = false; });
//   },
// });

// export const {
//   setActiveConversation,
//   setChatSocketConnected,
//   receiveSocketMessage,
//   updateSocketConversation,
//   setTypingStatus,
//   setUserOnlineStatus,
//   markSocketRead,
//   removeSocketMessage,
//   clearChatState,
// } = chatSlice.actions;

// export default chatSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import chatAPI from '../api/chatAPI';
import { getList, getMessage, getPayload } from '../utils/apiResponse';

const getId = (item) => {
  if (typeof item === 'string' || typeof item === 'number') return String(item);
  return item?._id || item?.id || item?.userId || '';
};

const getConversationId = (item = {}) => getId(item?.conversationId || item?.conversation || item) || item?.conversationId;

const unwrapSocketPayload = (payload = {}) => payload?.message || payload?.data?.message || payload?.data || payload;

const normalizeConversation = (conversation = {}) => ({
  ...conversation,
  id: getId(conversation),
});

const normalizeMessage = (message = {}) => {
  const raw = unwrapSocketPayload(message);
  return {
    ...raw,
    id: getId(raw),
    conversationId: getConversationId(raw),
  };
};

const extractPagination = (response, fallbackPage = 1, fallbackLimit = 20) => {
  const payload = getPayload(response, {});
  const pagination = payload?.pagination || payload?.meta || response?.data?.pagination || {};
  return {
    page: Number(pagination.page || payload?.page || fallbackPage),
    limit: Number(pagination.limit || payload?.limit || fallbackLimit),
    totalPages: Number(pagination.totalPages || pagination.pages || payload?.totalPages || 1),
    total: Number(pagination.total || payload?.total || 0),
  };
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async ({ page = 1, limit = 20, search = '', archived = '', unread = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getConversations({ page, limit, search, archived, unread });
      return {
        conversations: getList(response, ['conversations', 'docs', 'items']).map(normalizeConversation),
        pagination: extractPagination(response, page, limit),
        replace: page === 1,
      };
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to load conversations'));
    }
  }
);

export const startConversation = createAsyncThunk(
  'chat/startConversation',
  async ({ targetUserId, targetRole }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.startConversation({ targetUserId, targetRole });
      return normalizeConversation(getPayload(response, {}));
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to start conversation'));
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ conversationId, page = 1, limit = 30, q = '' }, { rejectWithValue }) => {
    try {
      const response = q
        ? await chatAPI.searchMessages(conversationId, q)
        : await chatAPI.getMessages(conversationId, { page, limit });
      return {
        conversationId,
        messages: getList(response, ['messages', 'docs', 'items']).map(normalizeMessage),
        pagination: extractPagination(response, page, limit),
        replace: page === 1 || Boolean(q),
      };
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to load messages'));
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (data, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(data);
      const payload = getPayload(response, {});
      return payload?.message ? { message: normalizeMessage(payload.message), conversation: payload.conversation } : normalizeMessage(payload);
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to send message'));
    }
  }
);

export const markConversationRead = createAsyncThunk(
  'chat/markConversationRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      await chatAPI.markRead(conversationId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to mark conversation as read'));
    }
  }
);

export const archiveConversation = createAsyncThunk('chat/archiveConversation', async (conversationId, { rejectWithValue }) => {
  try {
    await chatAPI.archiveConversation(conversationId);
    return conversationId;
  } catch (error) {
    return rejectWithValue(getMessage(error, 'Failed to archive conversation'));
  }
});

export const unarchiveConversation = createAsyncThunk('chat/unarchiveConversation', async (conversationId, { rejectWithValue }) => {
  try {
    await chatAPI.unarchiveConversation(conversationId);
    return conversationId;
  } catch (error) {
    return rejectWithValue(getMessage(error, 'Failed to unarchive conversation'));
  }
});

export const deleteConversation = createAsyncThunk('chat/deleteConversation', async (conversationId, { rejectWithValue }) => {
  try {
    await chatAPI.deleteConversation(conversationId);
    return conversationId;
  } catch (error) {
    return rejectWithValue(getMessage(error, 'Failed to delete conversation'));
  }
});

export const blockChatUser = createAsyncThunk('chat/blockChatUser', async (data, { rejectWithValue }) => {
  try {
    await chatAPI.blockUser(data);
    return data;
  } catch (error) {
    return rejectWithValue(getMessage(error, 'Failed to block user'));
  }
});

export const unblockChatUser = createAsyncThunk('chat/unblockChatUser', async (data, { rejectWithValue }) => {
  try {
    await chatAPI.unblockUser(data);
    return data;
  } catch (error) {
    return rejectWithValue(getMessage(error, 'Failed to unblock user'));
  }
});

export const reportChatUser = createAsyncThunk('chat/reportChatUser', async (data, { rejectWithValue }) => {
  try {
    await chatAPI.reportUser(data);
    return true;
  } catch (error) {
    return rejectWithValue(getMessage(error, 'Failed to report user'));
  }
});

export const reportConversation = createAsyncThunk('chat/reportConversation', async ({ conversationId, reason }, { rejectWithValue }) => {
  try {
    await chatAPI.reportConversation(conversationId, { reason });
    return true;
  } catch (error) {
    return rejectWithValue(getMessage(error, 'Failed to report conversation'));
  }
});

const initialState = {
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  messagePagination: {},
  conversationPagination: { page: 1, limit: 20, totalPages: 1, total: 0 },
  loadingConversations: false,
  loadingMessages: false,
  sending: false,
  actionLoading: false,
  socketConnected: false,
  onlineUsers: {},
  typingByConversation: {},
  filters: { search: '', archived: '', unread: '' },
  error: null,
};

const upsertConversation = (state, conversation) => {
  const normalized = normalizeConversation(conversation?.conversation || conversation?.data?.conversation || conversation);
  if (!normalized.id) return;
  const index = state.conversations.findIndex((item) => item.id === normalized.id);
  if (index >= 0) {
    state.conversations[index] = { ...state.conversations[index], ...normalized };
    const [updated] = state.conversations.splice(index, 1);
    state.conversations.unshift(updated);
  } else {
    state.conversations.unshift(normalized);
  }
};

const syncConversationFromMessage = (state, message, conversationFromPayload = null) => {
  const conversationId = message.conversationId;
  if (!conversationId) return;

  const index = state.conversations.findIndex((item) => item.id === conversationId);
  const nextPatch = {
    ...(conversationFromPayload || {}),
    id: conversationId,
    lastMessage: message,
    lastMessageText: message.text || message.attachments?.[0]?.filename || message.attachments?.[0]?.name || 'Attachment',
    lastMessageAt: message.createdAt || new Date().toISOString(),
    updatedAt: message.createdAt || new Date().toISOString(),
  };

  if (index >= 0) {
    const existing = state.conversations[index];
    const unreadCount = state.activeConversationId === conversationId ? 0 : Number(existing.unreadCount || existing.unread || 0) + 1;
    state.conversations[index] = { ...existing, ...nextPatch, unreadCount };
    const [updated] = state.conversations.splice(index, 1);
    state.conversations.unshift(updated);
  } else if (conversationFromPayload) {
    state.conversations.unshift({ ...conversationFromPayload, ...nextPatch, unreadCount: state.activeConversationId === conversationId ? 0 : 1 });
  }
};

const upsertMessage = (state, payload) => {
  const message = normalizeMessage(payload);
  const conversation = payload?.conversation || payload?.data?.conversation || null;
  const conversationId = message.conversationId;
  if (!conversationId || !message.id) return;

  const list = state.messagesByConversation[conversationId] || [];
  const exists = list.some((item) => item.id === message.id || item._id === message.id);
  state.messagesByConversation[conversationId] = exists
    ? list.map((item) => (item.id === message.id || item._id === message.id ? { ...item, ...message } : item))
    : [...list, message];

  syncConversationFromMessage(state, message, conversation);
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    setChatSocketConnected: (state, action) => {
      state.socketConnected = Boolean(action.payload);
    },
    receiveSocketMessage: (state, action) => {
      upsertMessage(state, action.payload);
    },
    updateSocketConversation: (state, action) => {
      upsertConversation(state, action.payload);
    },
    setTypingStatus: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload || {};
      if (!conversationId || !userId) return;
      state.typingByConversation[conversationId] = {
        ...(state.typingByConversation[conversationId] || {}),
        [userId]: Boolean(isTyping),
      };
    },
    setUserOnlineStatus: (state, action) => {
      const { userId, role, online } = action.payload || {};
      if (!userId) return;

      const key = String(userId);
      state.onlineUsers[key] = Boolean(online);

      if (role) {
        state.onlineUsers[`${role}:${key}`] = Boolean(online);
        state.onlineUsers[`${key}:${role}`] = Boolean(online);
      }
    },
    markSocketRead: (state, action) => {
      const { conversationId, readerId, readAt } = action.payload || {};
      const messages = state.messagesByConversation[conversationId] || [];
      state.messagesByConversation[conversationId] = messages.map((message) => ({
        ...message,
        readBy: message.readBy || [],
        readAt: message.readAt || readAt,
        status: message.receiverId === readerId ? 'read' : message.status,
      }));
    },
    removeSocketMessage: (state, action) => {
      const { conversationId, messageId } = action.payload || {};
      const messages = state.messagesByConversation[conversationId] || [];
      state.messagesByConversation[conversationId] = messages.filter((message) => message.id !== messageId && message._id !== messageId);
    },
    clearChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => { state.loadingConversations = true; state.error = null; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.replace ? action.payload.conversations : [...state.conversations, ...action.payload.conversations.filter((next) => !state.conversations.some((item) => item.id === next.id))];
        state.conversationPagination = action.payload.pagination;
        state.loadingConversations = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => { state.loadingConversations = false; state.error = action.payload; })
      .addCase(startConversation.fulfilled, (state, action) => { upsertConversation(state, action.payload); state.activeConversationId = action.payload.id; })
      .addCase(fetchMessages.pending, (state) => { state.loadingMessages = true; state.error = null; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const current = state.messagesByConversation[action.payload.conversationId] || [];
        const incoming = action.payload.messages;
        state.messagesByConversation[action.payload.conversationId] = action.payload.replace ? incoming : [...incoming.filter((next) => !current.some((item) => item.id === next.id)), ...current];
        state.messagePagination[action.payload.conversationId] = action.payload.pagination;
        state.loadingMessages = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => { state.loadingMessages = false; state.error = action.payload; })
      .addCase(sendChatMessage.pending, (state) => { state.sending = true; state.error = null; })
      .addCase(sendChatMessage.fulfilled, (state, action) => { upsertMessage(state, action.payload); state.sending = false; })
      .addCase(sendChatMessage.rejected, (state, action) => { state.sending = false; state.error = action.payload; })
      .addCase(markConversationRead.fulfilled, (state, action) => {
        const item = state.conversations.find((conversation) => conversation.id === action.payload);
        if (item) item.unreadCount = 0;
      })
      .addCase(archiveConversation.fulfilled, (state, action) => {
        const item = state.conversations.find((conversation) => conversation.id === action.payload);
        if (item) item.archived = true;
      })
      .addCase(unarchiveConversation.fulfilled, (state, action) => {
        const item = state.conversations.find((conversation) => conversation.id === action.payload);
        if (item) item.archived = false;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter((conversation) => conversation.id !== action.payload);
        if (state.activeConversationId === action.payload) state.activeConversationId = null;
      })
      .addMatcher((action) => action.type.startsWith('chat/') && action.type.endsWith('/pending'), (state) => { state.actionLoading = true; })
      .addMatcher((action) => action.type.startsWith('chat/') && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')), (state) => { state.actionLoading = false; });
  },
});

export const {
  setActiveConversation,
  setChatSocketConnected,
  receiveSocketMessage,
  updateSocketConversation,
  setTypingStatus,
  setUserOnlineStatus,
  markSocketRead,
  removeSocketMessage,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;