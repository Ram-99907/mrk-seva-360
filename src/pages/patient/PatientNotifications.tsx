import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import type { Notification } from '../../types';

const NOTIF_ICONS: Record<string, string> = {
  appointment_submitted: '📋',
  appointment_accepted: '✅',
  appointment_rejected: '❌',
  appointment_cancelled: '🚫',
  appointment_reminder: '⏰',
  queue_update: '🔢',
  system_alert: '⚠️',
};

function PatientNotificationsContent() {
  const location = useLocation();
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const filtered = filter === 'all' ? myNotifs : filter === 'unread' ? myNotifs.filter(n => !n.read) : myNotifs.filter(n => n.read);
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const sidebarItems = [
    { label: 'Dashboard', icon: 'LayoutDashboard' as const, href: '/patient/dashboard', active: false },
    { label: 'Find Hospitals', icon: 'Search' as const, href: '/hospitals', active: false },
    { label: 'My Appointments', icon: 'Calendar' as const, href: '/patient/appointments', active: false },
    { label: 'Notifications', icon: 'Bell' as const, href: '/patient/notifications', active: true },
    { label: 'Transactions', icon: 'CreditCard' as const, href: '/patient/transactions', active: false },
    { label: 'My Profile', icon: 'User' as const, href: '/patient/profile', active: false },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Notifications">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-DEFAULT font-display">Notifications</h2>
          <p className="text-medical-muted text-sm mt-1">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead(currentUser!.id)}
            className="btn-secondary text-sm"
          >
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white text-medical-muted hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-medical-muted">No {filter === 'all' ? '' : filter} notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              className={`card cursor-pointer hover:shadow-card-hover transition-all ${!notif.read ? 'border-l-4 border-primary-600' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${!notif.read ? 'bg-primary-50' : 'bg-gray-50'}`}>
                  {NOTIF_ICONS[notif.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!notif.read ? 'text-medical-text' : 'text-medical-muted'}`}>{notif.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0" />}
                      <p className="text-xs text-medical-muted whitespace-nowrap">{new Date(notif.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-medical-muted mt-1 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default function PatientNotifications() {
  return (
    <ProtectedRoute requiredRole="patient">
      <PatientNotificationsContent />
    </ProtectedRoute>
  );
}
