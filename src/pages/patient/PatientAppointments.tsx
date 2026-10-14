import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Plus, X, ChevronDown, Eye, Clock, Building2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store/appStore';
import { formatDate } from '../../utils/helpers';
import type { Appointment, AppointmentStatus } from '../../types';

type FilterTab = 'all' | AppointmentStatus;

function PatientAppointmentsContent() {
  const location = useLocation();
  const { currentUser, appointments, cancelAppointment } = useAppStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const myAppts = appointments.filter(a => a.patientId === currentUser?.id);
  const filtered = activeTab === 'all' ? myAppts : myAppts.filter(a => a.status === activeTab);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `All (${myAppts.length})` },
    { key: 'pending', label: `Pending (${myAppts.filter(a => a.status === 'pending').length})` },
    { key: 'accepted', label: 'Accepted' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const sidebarItems = [
    { label: 'Dashboard', icon: 'LayoutDashboard' as const, href: '/patient/dashboard', active: false },
    { label: 'Find Hospitals', icon: 'Search' as const, href: '/hospitals', active: false },
    { label: 'My Appointments', icon: 'Calendar' as const, href: '/patient/appointments', active: true },
    { label: 'Notifications', icon: 'Bell' as const, href: '/patient/notifications', active: false },
    { label: 'Transactions', icon: 'CreditCard' as const, href: '/patient/transactions', active: false },
    { label: 'My Profile', icon: 'User' as const, href: '/patient/profile', active: false },
  ];

  const handleCancel = (id: string) => {
    cancelAppointment(id, 'Cancelled by patient');
    setCancelConfirm(null);
    setSelectedAppt(null);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="My Appointments">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-DEFAULT font-display">Appointments</h2>
          <p className="text-medical-muted text-sm mt-1">{myAppts.length} total appointment requests</p>
        </div>
        <Link to="/hospitals" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Book New
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto hide-scrollbar mb-6 border-b border-gray-200 -mx-1 px-1 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-medical-muted hover:text-medical-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <h3 className="font-semibold text-medical-text mb-2">No appointments found</h3>
          <p className="text-sm text-medical-muted mb-4">
            {activeTab === 'all' ? "You haven't made any appointment requests yet." : `No ${activeTab} appointments.`}
          </p>
          <Link to="/hospitals" className="btn-primary">Find a Hospital</Link>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Reference</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Hospital</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden md:table-cell">Date & Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(appt => (
                  <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-mono text-xs text-primary-600 font-semibold">{appt.reference}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-medical-text text-xs">{appt.hospitalName.split('–')[0].trim()}</p>
                      <p className="text-xs text-medical-muted">{appt.specialty}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-xs text-medical-text font-medium">{formatDate(appt.preferredDate)}</p>
                      <p className="text-xs text-medical-muted flex items-center gap-1"><Clock className="w-3 h-3" />{appt.preferredTime}</p>
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={appt.status} /></td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAppt(appt)}
                          className="btn-secondary text-xs px-3 py-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        {(appt.status === 'pending' || appt.status === 'accepted') && (
                          <button
                            onClick={() => setCancelConfirm(appt.id)}
                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedAppt(null)} />
          <div className="relative bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-medical-text font-display">Appointment Details</h3>
                <p className="text-xs font-mono text-primary-600 mt-0.5">{selectedAppt.reference}</p>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="p-2 hover:bg-gray-50 rounded-lg">
                <X className="w-5 h-5 text-medical-muted" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-medical-muted">Status</span>
                <StatusBadge status={selectedAppt.status} />
              </div>
              {[
                ['Hospital', selectedAppt.hospitalName],
                ['Specialty', selectedAppt.specialty],
                ['Preferred Date', formatDate(selectedAppt.preferredDate)],
                ['Preferred Time', selectedAppt.preferredTime],
                ...(selectedAppt.queueNumber ? [['Queue Number', `#${selectedAppt.queueNumber}`]] : []),
                ...(selectedAppt.preferredDoctor ? [['Preferred Doctor', selectedAppt.preferredDoctor]] : []),
                ...(selectedAppt.reason ? [['Visit Reason', selectedAppt.reason]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-sm text-medical-muted">{label}</span>
                  <span className="text-sm font-medium text-medical-text text-right max-w-xs">{value}</span>
                </div>
              ))}

              {/* Status History */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-medical-text mb-3 font-display">Status History</p>
                <div className="space-y-3">
                  {selectedAppt.statusHistory.map((h, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-600 mt-1 flex-shrink-0" />
                        {i < selectedAppt.statusHistory.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 mt-1" />}
                      </div>
                      <div className="pb-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={h.status} />
                          <span className="text-xs text-medical-muted">{new Date(h.changedAt).toLocaleString('en-IN')}</span>
                        </div>
                        {h.note && <p className="text-xs text-medical-muted mt-1">{h.note}</p>}
                        <p className="text-xs text-gray-400">by {h.changedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedAppt.status === 'pending' || selectedAppt.status === 'accepted') && (
                <button
                  onClick={() => { setSelectedAppt(null); setCancelConfirm(selectedAppt.id); }}
                  className="btn-danger w-full mt-2"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm */}
      {cancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-modal max-w-sm w-full p-6 animate-slide-up text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-medical-text mb-2">Cancel Appointment?</h3>
            <p className="text-sm text-medical-muted mb-6">This action cannot be undone. The appointment will be marked as cancelled.</p>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setCancelConfirm(null)}>Keep it</button>
              <button className="btn-danger flex-1" onClick={() => handleCancel(cancelConfirm)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function PatientAppointments() {
  return (
    <ProtectedRoute requiredRole="patient">
      <PatientAppointmentsContent />
    </ProtectedRoute>
  );
}
