import { useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, X, Calendar, AlertCircle, Clock, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppStore } from '../../store/appStore';
import type { Notification, NotificationType } from '../../types';

interface NotificationBellProps {
  userId: string;
}

const NOTIF_ICON: Record<NotificationType, React.ReactNode> = {
  appointment_submitted: <Calendar className="w-4 h-4 text-primary-600" />,
  appointment_accepted: <Check className="w-4 h-4 text-medical-success" />,
  appointment_rejected: <X className="w-4 h-4 text-medical-alert" />,
  appointment_cancelled: <X className="w-4 h-4 text-medical-muted" />,
  appointment_reminder: <Clock className="w-4 h-4 text-medical-warning" />,
  queue_update: <Clock className="w-4 h-4 text-teal-600" />,
  system_alert: <AlertCircle className="w-4 h-4 text-medical-alert" />,
};

const NOTIF_ICON_BG: Record<NotificationType, string> = {
  appointment_submitted: 'bg-blue-50',
  appointment_accepted: 'bg-green-50',
  appointment_rejected: 'bg-red-50',
  appointment_cancelled: 'bg-gray-100',
  appointment_reminder: 'bg-amber-50',
  queue_update: 'bg-teal-50',
  system_alert: 'bg-red-50',
};

function NotifItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const icon = NOTIF_ICON[notification.type] ?? <Info className="w-4 h-4 text-gray-400" />;
  const iconBg = NOTIF_ICON_BG[notification.type] ?? 'bg-gray-50';

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-default ${
        !notification.read ? 'bg-blue-50/40' : ''
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${iconBg} flex items-center justify-center mt-0.5`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs leading-snug ${
            notification.read
              ? 'text-medical-muted'
              : 'text-medical-text font-medium'
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-medical-muted mt-0.5 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      {!notification.read && (
        <button
          onClick={() => onRead(notification.id)}
          title="Mark as read"
          className="flex-shrink-0 p-1 hover:bg-blue-100 rounded-full transition-colors"
        >
          <Check className="w-3 h-3 text-primary-600" />
        </button>
      )}
    </div>
  );
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = useAppStore(s =>
    s.notifications.filter(n => n.userId === userId).slice(0, 15)
  );
  const unreadCount = useAppStore(s => s.getUnreadCount(userId));
  const markRead = useAppStore(s => s.markNotificationRead);
  const markAllRead = useAppStore(s => s.markAllNotificationsRead);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-medical-muted hover:text-medical-text"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-medical-alert text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-medical-text">Notifications</h3>
              {unreadCount > 0 && (
                <span className="badge badge-blue text-[10px] px-1.5 py-0.5">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead(userId)}
                className="flex items-center gap-1 text-[11px] text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell className="w-8 h-8 text-gray-200 mb-2" />
                <p className="text-sm text-medical-muted">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <NotifItem key={n.id} notification={n} onRead={markRead} />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
              <p className="text-[11px] text-center text-medical-muted">
                Showing last {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
