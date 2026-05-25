import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import NotificationItem from '../../components/notifications/NotificationItem';
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../store/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const { items, unreadCount, pagination, loading, error, actionLoading } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (['buyer', 'vendor'].includes(role)) {
      dispatch(fetchNotifications({ page: 1, limit: pagination.limit }));
    }
  }, [dispatch, role]);

  if (!['buyer', 'vendor'].includes(role)) {
    return <Navigate to="/" replace />;
  }

  const loadMore = () => {
    if (pagination.page < pagination.totalPages && !loading) {
      dispatch(fetchNotifications({ page: pagination.page + 1, limit: pagination.limit }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track your order, return, refund, profile, and stock alerts.
            </p>
          </div>
          <button
            type="button"
            disabled={actionLoading || unreadCount === 0}
            onClick={() => dispatch(markAllNotificationsAsRead())}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all as read
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </p>
          </div>

          {loading && items.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-500">Loading notifications...</div>
          )}

          {!loading && error && (
            <div className="p-10 text-center text-sm text-red-600">{error}</div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="p-10 text-center">
              <p className="font-semibold text-gray-800 dark:text-gray-100">No notifications yet</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                New buyer and vendor alerts will appear here.
              </p>
            </div>
          )}

          {items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={(id) => dispatch(markNotificationAsRead(id))}
              onDelete={(id) => dispatch(deleteNotification(id))}
            />
          ))}
        </div>

        {pagination.page < pagination.totalPages && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={loadMore}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
