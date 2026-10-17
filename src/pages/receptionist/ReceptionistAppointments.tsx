import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, X, Eye, Check, XCircle, Clock, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store/appStore';
import { formatDate } from '../../utils/helpers';
import type { Appointment, AppointmentStatus } from '../../types';

const HOSPITAL_ID = 'h001';

function ReceptionistAppointmentsContent() {
  const location = useLocation();
  const { appointments, updateAppointmentStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | AppointmentStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [feedback, setFeedback] = useState('');

  const hospitalAppts = appointments.filter(a => a.hospitalId === HOSPITAL_ID);
  const filtered = hospitalAppts.filter(a => {
    if (activeTab !== 'all' && a.status !== activeTab) return false;
    if (search && !a.patientName.toLowerCase().includes(search.toLowerCase()) && !a.reference.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs: { key: 'all' | AppointmentStatus; label: string }[] = [
    { key: 'all', label: `All (${hospitalAppts.length})` },
    { key: 'pending', label: `Pending (${hospitalAppts.filter(a => a.status === 'pending').length})` },
    { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'completed', label: 'Completed' },
  ];

  const sidebarItems = [
    { label: 'Overview', icon: 'LayoutDashboard' as const, href: '/receptionist/dashboard', active: false },
    { label: 'Appointment Requests', icon: 'ClipboardList' as const, href: '/receptionist/appointments', active: true },
    { label: "Today's Queue", icon: 'ListOrdered' as const, href: '/receptionist/queue', active: false },
    { label: 'Notifications', icon: 'Bell' as const, href: '/receptionist/notifications', active: false },
    { label: 'Hospital Profile', icon: 'Building2' as const, href: '/receptionist/hospital', active: false },
  ];

  const handleAccept = (id: string) => {
    updateAppointmentStatus(id, 'accepted', 'Appointment accepted by receptionist', 'Receptionist');
    setFeedback('Appointment accepted successfully!');
    setSelectedAppt(null);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleReject = () => {
    if (!rejectModal) return;
    updateAppointmentStatus(rejectModal.id, 'rejected', rejectReason || 'Not accepted', 'Receptionist');
    setFeedback('Appointment rejected.');
    setRejectModal(null);
    setRejectReason('');
    setSelectedAppt(null);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleMarkComplete = (id: string) => {
    updateAppointmentStatus(id, 'completed', 'Consultation completed', 'Receptionist');
    setSelectedAppt(null);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Appointment Requests">
      {feedback && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-modal animate-slide-in">
          {feedback}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-DEFAULT font-display">Appointment Requests</h2>
        <p className="text-medical-muted text-sm">AIIMS Hospital — all VERIFIED</p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar border-b border-gray-200 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-medical-muted hover:text-medical-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
          <input
            type="text"
            className="input-field pl-9 text-sm w-56"
            placeholder="Search patient or ref..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-medical-muted">No appointments found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Reference</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden md:table-cell">Date & Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden lg:table-cell">Specialty</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(appt => (
                  <tr key={appt.id} className={`hover:bg-gray-50/50 transition-colors ${appt.status === 'pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-4 font-mono text-xs text-primary-600 font-semibold">{appt.reference}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-medical-text text-xs">{appt.patientName}</p>
                      <p className="text-xs text-medical-muted">{appt.patientPhone}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="text-xs font-medium text-medical-text">{formatDate(appt.preferredDate)}</p>
                      <p className="text-xs text-medical-muted flex items-center gap-1"><Clock className="w-3 h-3" />{appt.preferredTime}</p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-xs text-medical-muted">{appt.specialty}</td>
                    <td className="px-4 py-4"><StatusBadge status={appt.status} /></td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedAppt(appt)} className="btn-secondary text-xs px-2 py-1.5">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {appt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAccept(appt.id)}
                              className="bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Accept
                            </button>
                            <button
                              onClick={() => setRejectModal({ id: appt.id })}
                              className="bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}
                        {appt.status === 'accepted' && (
                          <button
                            onClick={() => handleMarkComplete(appt.id)}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            Complete
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
                <p className="text-xs font-mono text-primary-600">{selectedAppt.reference}</p>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="p-2 hover:bg-gray-50 rounded-lg">
                <X className="w-5 h-5 text-medical-muted" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-medical-muted">Status</span><StatusBadge status={selectedAppt.status} /></div>
              {[
                ['Patient', selectedAppt.patientName],
                ['Phone', selectedAppt.patientPhone],
                ['Email', selectedAppt.patientEmail],
                ['Specialty', selectedAppt.specialty],
                ['Date', formatDate(selectedAppt.preferredDate)],
                ['Time', selectedAppt.preferredTime],
                ...(selectedAppt.preferredDoctor ? [['Preferred Doctor', selectedAppt.preferredDoctor]] : []),
                ...(selectedAppt.reason ? [['Visit Reason', selectedAppt.reason]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-sm text-medical-muted">{k}</span><span className="text-sm font-medium text-medical-text">{v}</span></div>
              ))}

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold mb-3 font-display">Status History</p>
                {selectedAppt.statusHistory.map((h, i) => (
                  <div key={i} className="text-xs text-medical-muted mb-2 flex gap-2">
                    <span className="font-medium capitalize">{h.status}</span>·<span>{new Date(h.changedAt).toLocaleString('en-IN')}</span>·<span>{h.note}</span>
                  </div>
                ))}
              </div>

              {selectedAppt.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { handleAccept(selectedAppt.id); }} className="btn-teal flex-1">Accept</button>
                  <button onClick={() => { setRejectModal({ id: selectedAppt.id }); setSelectedAppt(null); }} className="btn-danger flex-1">Reject</button>
                </div>
              )}
              {selectedAppt.status === 'accepted' && (
                <button onClick={() => handleMarkComplete(selectedAppt.id)} className="btn-primary w-full">Mark as Completed</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-modal max-w-sm w-full p-6 animate-slide-up">
            <h3 className="font-bold text-medical-text font-display mb-4">Reject Appointment</h3>
            <div>
              <label className="label">Reason for Rejection (optional)</label>
              <textarea
                className="input-field h-24 resize-none"
                placeholder="e.g. Doctor unavailable on that date, please choose another slot..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn-secondary flex-1" onClick={() => setRejectModal(null)}>Cancel</button>
              <button className="btn-danger flex-1" onClick={handleReject}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function ReceptionistAppointments() {
  return (
    <ProtectedRoute requiredRole="receptionist">
      <ReceptionistAppointmentsContent />
    </ProtectedRoute>
  );
}
