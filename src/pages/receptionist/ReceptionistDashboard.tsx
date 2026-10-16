import { useLocation, Link } from 'react-router-dom';
import { Calendar, Clock, User, Activity } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store/appStore';
import { formatDate } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

const HOSPITAL_ID = 'h001'; // Demo receptionist manages h001

function ReceptionistDashboardContent() {
  const location = useLocation();
  const { appointments, queue, updateAppointmentStatus } = useAppStore();
  const { t } = useTranslation();

  const hospitalAppts = appointments.filter(a => a.hospitalId === HOSPITAL_ID);
  const pending = hospitalAppts.filter(a => a.status === 'pending');
  const accepted = hospitalAppts.filter(a => a.status === 'accepted');
  const completed = hospitalAppts.filter(a => a.status === 'completed');
  const rejected = hospitalAppts.filter(a => a.status === 'rejected' || a.status === 'cancelled');
  const todayQueue = queue.filter(q => q.hospitalId === HOSPITAL_ID);
  const recentActivity = hospitalAppts.slice(0, 5);

  const sidebarItems = [
    { label: t('nav.dashboard'), icon: 'LayoutDashboard' as const, href: '/receptionist/dashboard', active: location.pathname === '/receptionist/dashboard' },
    { label: t('receptionist.requests'), icon: 'ClipboardList' as const, href: '/receptionist/appointments', active: location.pathname === '/receptionist/appointments' },
    { label: t('receptionist.queue'), icon: 'ListOrdered' as const, href: '/receptionist/queue', active: location.pathname === '/receptionist/queue' },
    { label: t('patient.notifications'), icon: 'Bell' as const, href: '/receptionist/notifications', active: location.pathname === '/receptionist/notifications' },
    { label: t('receptionist.hospital'), icon: 'Building2' as const, href: '/receptionist/hospital', active: location.pathname === '/receptionist/hospital' },
  ];

  const handleQuickAccept = (id: string) => {
    updateAppointmentStatus(id, 'accepted', 'Accepted by receptionist', 'Demo Receptionist');
  };

  const handleQuickReject = (id: string) => {
    updateAppointmentStatus(id, 'rejected', 'Rejected — capacity full (demo)', 'Demo Receptionist');
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle={t('receptionist.dashboard')} headerSubtitle="AIIMS Demo — Demo Hospital">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-DEFAULT font-display">Overview</h2>
        <p className="text-medical-muted text-sm mt-1">All India Institute of Medical Sciences – Demo</p>
        <div className="demo-banner mt-3">
          🧪 All data shown is <strong>fictional demo content</strong>. Not connected to a real hospital.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Requests', value: pending.length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-l-amber-400' },
          { label: 'Accepted', value: accepted.length, color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-400' },
          { label: 'Queue Today', value: todayQueue.length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-400' },
          { label: 'Completed', value: completed.length, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-l-gray-400' },
        ].map(stat => (
          <div key={stat.label} className={`card border-l-4 ${stat.border}`}>
            <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-medical-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-medical-text font-display">Recent Appointment Requests</h3>
              <Link to="/receptionist/appointments" className="text-sm text-primary-600 hover:underline">Manage All</Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-medical-muted text-center py-8">No appointment requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide">Patient</th>
                      <th className="text-left py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden sm:table-cell">Date</th>
                      <th className="text-left py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide">Status</th>
                      <th className="text-right py-2 text-xs font-semibold text-medical-muted uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentActivity.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50/50">
                        <td className="py-3">
                          <p className="font-medium text-medical-text text-xs">{a.patientName}</p>
                          <p className="text-xs text-medical-muted">{a.specialty}</p>
                        </td>
                        <td className="py-3 text-xs text-medical-muted hidden sm:table-cell">{formatDate(a.preferredDate)}</td>
                        <td className="py-3"><StatusBadge status={a.status} /></td>
                        <td className="py-3 text-right">
                          {a.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleQuickAccept(a.id)}
                                className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded-lg font-medium transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleQuickReject(a.id)}
                                className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded-lg font-medium transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Queue Preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-medical-text font-display">Today's Queue</h3>
            <Link to="/receptionist/queue" className="text-xs text-primary-600 hover:underline">Manage</Link>
          </div>
          {todayQueue.length === 0 ? (
            <p className="text-sm text-medical-muted text-center py-6">No queue entries today.</p>
          ) : (
            <div className="space-y-2">
              {todayQueue.slice(0, 5).map(q => (
                <div key={q.id} className={`p-3 rounded-xl border ${
                  q.status === 'in-consultation' ? 'bg-blue-50 border-blue-100' :
                  q.status === 'completed' ? 'bg-gray-50 border-gray-100' :
                  'bg-amber-50 border-amber-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        q.status === 'in-consultation' ? 'bg-blue-600 text-white' :
                        q.status === 'completed' ? 'bg-gray-400 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {q.queueNumber}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-medical-text">{q.patientName}</p>
                        <p className="text-xs text-medical-muted">{q.scheduledTime}</p>
                      </div>
                    </div>
                    <span className="text-xs capitalize text-medical-muted">{q.status.replace('-', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ReceptionistDashboard() {
  return (
    <ProtectedRoute requiredRole="receptionist">
      <ReceptionistDashboardContent />
    </ProtectedRoute>
  );
}
