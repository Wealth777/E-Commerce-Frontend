import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiBell } from 'react-icons/fi';
import NotificationItem from './NotificationItem';
import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../store/notificationSlice';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { items, unreadCount, loading, error, actionLoading } = useSelector((state) => state.notifications);
  const { role } = useSelector((state) => state.auth);
  const enabled = ['buyer', 'vendor'].includes(role);

  useEffect(() => {
    if (!enabled) return;
    dispatch(fetchUnreadCount());
  }, [dispatch, enabled]);

  useEffect(() => {
    if (open && enabled) {
      dispatch(fetchNotifications({ page: 1, limit: 5 }));
    }
  }, [dispatch, enabled, open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!enabled) return null;

  const notificationPath = role === 'vendor' ? '/vendor/notifications' : '/buyer/notifications';
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label="Open notifications"
        aria-expanded={open}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {displayCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              disabled={actionLoading || unreadCount === 0}
              onClick={() => dispatch(markAllNotificationsAsRead())}
              className="text-xs font-semibold text-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-green-300"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading && <div className="p-6 text-center text-sm text-gray-500">Loading notifications...</div>}
            {!loading && error && <div className="p-6 text-center text-sm text-red-600">{error}</div>}
            {!loading && !error && items.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">No notifications yet.</div>
            )}
            {!loading && !error && items.slice(0, 5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                compact
                onRead={(id) => dispatch(markNotificationAsRead(id))}
                onDelete={(id) => dispatch(deleteNotification(id))}
              />
            ))}
          </div>

          <Link
            to={notificationPath}
            onClick={() => setOpen(false)}
            className="block border-t border-gray-100 px-4 py-3 text-center text-sm font-semibold text-green-700 hover:bg-green-50 dark:border-gray-700 dark:text-green-300 dark:hover:bg-gray-700"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
