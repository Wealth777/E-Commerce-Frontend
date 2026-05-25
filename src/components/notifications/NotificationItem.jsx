import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { isNotificationRead } from '../../store/notificationSlice';

const formatDate = (value) => {
  if (!value) return 'Now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Now';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const NotificationItem = ({ notification, onRead, onDelete, compact = false }) => {
  const isRead = isNotificationRead(notification);
  const title = notification?.title || notification?.type || 'Notification';
  const message = notification?.message || notification?.body || 'You have a new notification.';
  const type = notification?.type || notification?.category || 'general';

  return (
    <div className={`group border-b border-gray-100 dark:border-gray-700 p-4 ${isRead ? 'bg-white dark:bg-gray-800' : 'bg-green-50 dark:bg-green-900/20'}`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => !isRead && onRead(notification.id)}
          className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${isRead ? 'bg-gray-300 dark:bg-gray-600' : 'bg-green-600'}`}
          aria-label={isRead ? 'Notification already read' : 'Mark notification as read'}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-sm font-semibold ${isRead ? 'text-gray-800 dark:text-gray-100' : 'text-gray-950 dark:text-white'}`}>
                {title}
              </p>
              <p className={`mt-1 text-sm leading-5 ${compact ? 'line-clamp-2' : ''} text-gray-600 dark:text-gray-300`}>
                {message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="rounded-lg p-1.5 text-gray-400 opacity-100 md:opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30"
              aria-label="Delete notification"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="rounded-full bg-gray-100 px-2 py-1 capitalize text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {type.replaceAll('_', ' ')}
            </span>
            <span>{formatDate(notification?.createdAt || notification?.created_at || notification?.timestamp)}</span>
            {!isRead && (
              <button
                type="button"
                onClick={() => onRead(notification.id)}
                className="font-medium text-green-700 hover:text-green-800 dark:text-green-300"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
