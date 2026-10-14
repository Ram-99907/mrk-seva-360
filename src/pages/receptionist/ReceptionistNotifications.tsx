import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { CheckCheck } from 'lucide-react';

const NOTIF_ICONS: Record<string, string> = {
  appointment_submitted: '📋',
  appointment_accepted: '✅',
  appointment_rejected: '❌',
  appointment_cancelled: '🚫',
  appointment_reminder: '⏰',
  queue_update: '🔢',
  system_alert: '⚠️',
};

function ReceptionistNotificationsContent() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const filtered = filter === 'all' ? myNotifs : filter === 'unread' ? myNotifs.filter(n => !n.read) : myNotifs.filter(n => n.read);
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const sidebarItems = [
    { label: 'Overview', icon: 'LayoutDashboard' as const, href: '/receptionist/dashboard', active: false },
    { label: 'Appointment Requests', icon: 'ClipboardList' as const, href: '/receptionist/appointments', active: false },
    { label: "Today's Queue", icon: 'ListOrdered' as const, href: '/receptionist/queue', active: false },
    { label: 'Notifications', icon: 'Bell' as const, href: '/receptionist/notifications', active: true },
    { label: 'Hospital Profile', icon: 'Building2' as const, href: '/receptionist/hospital', active: false },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Notifications">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-DEFAULT font-display">Notifications</h2>
          <p className="text-medical-muted text-sm">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllNotificationsRead(currentUser!.id)} className="btn-secondary text-sm">
            <CheckCheck className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>
      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-medical-muted border border-gray-200 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-medical-muted">No notifications.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`card cursor-pointer hover:shadow-card-hover transition-all ${!n.read ? 'border-l-4 border-primary-600' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-lg flex-shrink-0">{NOTIF_ICONS[n.type] || '🔔'}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.read ? 'text-medical-text' : 'text-medical-muted'}`}>{n.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary-600" />}
                      <p className="text-xs text-medical-muted">{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <p className="text-sm text-medical-muted mt-1">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default function ReceptionistNotifications() {
  return (
    <ProtectedRoute requiredRole="receptionist">
      <ReceptionistNotificationsContent />
    </ProtectedRoute>
  );
}
