import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import notificationAPI from '../api/notificationAPI';
import { getList, getMessage, getPayload } from '../utils/apiResponse';

const normalizeNotificationId = (notification) => ({
  ...notification,
  id: notification?._id || notification?.id,
});

const readState = (notification) => {
  if (typeof notification?.read === 'boolean') return notification.read;
  if (typeof notification?.isRead === 'boolean') return notification.isRead;
  if (typeof notification?.inAppRead === 'boolean') return notification.inAppRead;
  if (notification?.channels?.inApp?.read !== undefined) return Boolean(notification.channels.inApp.read);
  if (notification?.readAt || notification?.inAppReadAt) return true;
  return false;
};

const extractPagination = (response, fallbackPage = 1, fallbackLimit = 10) => {
  const payload = getPayload(response, {});
  const pagination = payload?.pagination || payload?.meta || response?.data?.pagination || {};

  return {
    page: Number(pagination.page || payload?.page || fallbackPage),
    limit: Number(pagination.limit || payload?.limit || fallbackLimit),
    totalPages: Number(pagination.totalPages || pagination.pages || payload?.totalPages || 1),
    total: Number(pagination.total || payload?.total || 0),
  };
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getNotifications({ page, limit });
      return {
        notifications: getList(response, ['notifications', 'docs', 'items']).map(normalizeNotificationId),
        pagination: extractPagination(response, page, limit),
        replace: page === 1,
      };
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to load notifications'));
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getUnreadCount();
      const payload = getPayload(response, {});
      return Number(payload?.count ?? response?.data?.count ?? 0);
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to load unread notification count'));
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationAPI.markAsRead(notificationId, 'inApp');
      return notificationId;
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to mark notification as read'));
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationAPI.markAllAsRead('inApp');
      return true;
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to mark notifications as read'));
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to delete notification'));
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  },
  loading: false,
  unreadLoading: false,
  actionLoading: false,
  error: null,
  socketConnected: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    receiveNotification: (state, action) => {
      const notification = normalizeNotificationId(action.payload);
      if (!notification.id) return;

      const exists = state.items.some((item) => item.id === notification.id);
      if (!exists) {
        state.items.unshift(notification);
      }

      if (!readState(notification)) {
        state.unreadCount += exists ? 0 : 1;
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = Math.max(0, Number(action.payload || 0));
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = Boolean(action.payload);
    },
    clearNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const incoming = action.payload.notifications;
        state.items = action.payload.replace
          ? incoming
          : [...state.items, ...incoming.filter((next) => !state.items.some((item) => item.id === next.id))];
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadCount.pending, (state) => {
        state.unreadLoading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
        state.unreadLoading = false;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.unreadLoading = false;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const item = state.items.find((notification) => notification.id === action.payload);
        if (item && !readState(item)) {
          item.read = true;
          item.isRead = true;
          item.readAt = item.readAt || new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.actionLoading = false;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({
          ...item,
          read: true,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        }));
        state.unreadCount = 0;
        state.actionLoading = false;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const item = state.items.find((notification) => notification.id === action.payload);
        state.items = state.items.filter((notification) => notification.id !== action.payload);
        if (item && !readState(item)) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const {
  receiveNotification,
  setUnreadCount,
  setSocketConnected,
  clearNotificationState,
} = notificationSlice.actions;

export { readState as isNotificationRead };
export default notificationSlice.reducer;