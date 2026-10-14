import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, Calendar, Bell, CreditCard, User, Building2
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import StatusBadge from '../../components/ui/StatusBadge';
import { formatDate } from '../../utils/helpers';

function PatientDashboardContent() {
  const location = useLocation();
  const { currentUser, appointments, notifications, getUnreadCount } = useAppStore();
  const myAppts = appointments.filter(a => a.patientId === currentUser?.id);
  const pending = myAppts.filter(a => a.status === 'pending');
  const accepted = myAppts.filter(a => a.status === 'accepted');
  const completed = myAppts.filter(a => a.status === 'completed');
  const recent = myAppts.slice(0, 5);
  const upcoming = accepted.filter(a => new Date(a.preferredDate) >= new Date()).slice(0, 3);
  const myNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read).slice(0, 3);

  const sidebarItems = [
    { label: 'Dashboard', icon: 'LayoutDashboard' as const, href: '/patient/dashboard', active: location.pathname === '/patient/dashboard' },
    { label: 'Find Hospitals', icon: 'Search' as const, href: '/hospitals', active: false },
    { label: 'My Appointments', icon: 'Calendar' as const, href: '/patient/appointments', active: location.pathname === '/patient/appointments' },
    { label: 'Notifications', icon: 'Bell' as const, href: '/patient/notifications', active: location.pathname === '/patient/notifications' },
    { label: 'Transactions', icon: 'CreditCard' as const, href: '/patient/transactions', active: location.pathname === '/patient/transactions' },
    { label: 'My Profile', icon: 'User' as const, href: '/patient/profile', active: location.pathname === '/patient/profile' },
  ];

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Patient Dashboard" headerSubtitle={today}>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-DEFAULT font-display">
          Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-medical-muted mt-1">Here's an overview of your healthcare activity.</p>
      </div>

      {/* Quick Search */}
      <div className="card mb-8 bg-gradient-to-r from-primary-600 to-teal-600 text-white p-6">
        <h3 className="font-semibold text-white mb-1 font-display">Find a Hospital</h3>
        <p className="text-white/80 text-sm mb-4">Search hospitals and book appointments</p>
        <Link to="/hospitals" className="inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition-colors">
          <Search className="w-4 h-4" /> Search Hospitals
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Appointments', value: myAppts.length, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Pending', value: pending.length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Upcoming', value: accepted.length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Completed', value: completed.length, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(stat => (
          <div key={stat.label} className="card">
            <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-medical-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-medical-text font-display">Recent Appointments</h3>
              <Link to="/patient/appointments" className="text-sm text-primary-600 hover:underline">View All</Link>
            </div>
            {recent.length === 0 ? (
              <div className="text-center py-8 text-medical-muted">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                <p className="text-sm">No appointments yet.</p>
                <Link to="/hospitals" className="btn-primary mt-4 text-sm">Book Now</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide">Reference</th>
                      <th className="text-left py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide">Hospital</th>
                      <th className="text-left py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden sm:table-cell">Date</th>
                      <th className="text-left py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recent.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-mono text-xs text-medical-muted">{a.reference}</td>
                        <td className="py-3">
                          <p className="font-medium text-medical-text text-xs">{a.hospitalName.split('–')[0].trim()}</p>
                          <p className="text-xs text-medical-muted">{a.specialty}</p>
                        </td>
                        <td className="py-3 text-xs text-medical-muted hidden sm:table-cell">{formatDate(a.preferredDate)}</td>
                        <td className="py-3"><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Upcoming + Notifications */}
        <div className="space-y-6">
          {/* Upcoming */}
          <div className="card">
            <h3 className="font-semibold text-medical-text font-display mb-4">Upcoming</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-medical-muted text-center py-4">No upcoming confirmed appointments.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(a => (
                  <div key={a.id} className="p-3 rounded-xl bg-green-50 border border-green-100">
                    <p className="text-xs font-semibold text-green-700">{formatDate(a.preferredDate)} · {a.preferredTime}</p>
                    <p className="text-sm font-medium text-medical-text mt-0.5">{a.specialty}</p>
                    <p className="text-xs text-medical-muted">{a.hospitalName.split('–')[0].trim()}</p>
                    {a.queueNumber && (
                      <span className="badge badge-green text-xs mt-2">Queue #{a.queueNumber}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-medical-text font-display">Notifications</h3>
              <Link to="/patient/notifications" className="text-xs text-primary-600 hover:underline">View All</Link>
            </div>
            {myNotifs.length === 0 ? (
              <p className="text-sm text-medical-muted text-center py-4">No unread notifications.</p>
            ) : (
              <div className="space-y-3">
                {myNotifs.map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-primary-50 border border-primary-100">
                    <p className="text-xs font-semibold text-primary-700">{n.title}</p>
                    <p className="text-xs text-medical-muted mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PatientDashboard() {
  return (
    <ProtectedRoute requiredRole="patient">
      <PatientDashboardContent />
    </ProtectedRoute>
  );
}
