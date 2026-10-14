import React, { useState, useMemo } from 'react';
import {
  Search, Calendar, CheckCircle2, Clock, XCircle,
  AlertCircle, Eye, Filter, RefreshCcw, Download,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import type { Appointment } from '../../types';

const ADMIN_SIDEBAR = [
  { label: 'Overview',          icon: 'LayoutDashboard', href: '/admin/dashboard' },
  { label: 'Hospital Registry', icon: 'Building2',        href: '/admin/hospitals' },
  { label: 'User Management',   icon: 'Users',            href: '/admin/users' },
  { label: 'All Appointments',  icon: 'Calendar',         href: '/admin/appointments' },
  { label: 'Reports & Analytics',icon: 'BarChart2',       href: '/admin/reports' },
  { label: 'Notifications',     icon: 'Bell',             href: '/admin/notifications' },
  { label: 'Audit Logs',        icon: 'Shield',           href: '/admin/audit' },
  { label: 'System Settings',   icon: 'Settings',         href: '/admin/settings' },
];

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  accepted:  'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  rejected:  'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[status] || STATUS_STYLES.cancelled}`}>
      {status}
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#0d9488] px-6 py-5 text-white">
          <p className="text-xs font-semibold opacity-70 mb-1">Appointment Details</p>
          <h2 className="text-lg font-black">{appt.reference}</h2>
          <StatusBadge status={appt.status} />
        </div>
        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Patient', value: appt.patientName },
              { label: 'Hospital', value: appt.hospitalName },
              { label: 'Specialty', value: appt.specialty },
              { label: 'Date', value: appt.preferredDate },
              { label: 'Time', value: appt.preferredTime },
              { label: 'Queue #', value: appt.queueNumber ?? '—' },
              { label: 'Email', value: appt.patientEmail },
              { label: 'Phone', value: appt.patientPhone },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</dt>
                <dd className="mt-0.5 font-medium text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
          {appt.reason && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{appt.reason}</p>
            </div>
          )}
          {/* Status History */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Status History</p>
            <ol className="relative border-l border-slate-200 pl-4 flex flex-col gap-3">
              {appt.statusHistory.map((h, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.125rem] flex size-3.5 items-center justify-center rounded-full bg-[#1e3a8a] ring-2 ring-white" />
                  <p className="text-xs font-semibold capitalize text-slate-700">{h.status}</p>
                  <p className="text-[11px] text-slate-400">{new Date(h.changedAt).toLocaleString('en-IN')} · {h.changedBy}</p>
                  {h.note && <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="border-t border-slate-100 px-6 py-4">
          <button type="button" onClick={onClose} className="btn-navy w-full rounded-xl py-2.5 text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function AdminAppointmentsContent() {
  const { appointments } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const filtered = useMemo(() => {
    return [...appointments]
      .filter(a => {
        if (statusFilter && a.status !== statusFilter) return false;
        if (search && !a.patientName.toLowerCase().includes(search.toLowerCase()) &&
            !a.reference.toLowerCase().includes(search.toLowerCase()) &&
            !a.hospitalName.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [appointments, search, statusFilter]);

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    accepted:  appointments.filter(a => a.status === 'accepted').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    rejected:  appointments.filter(a => a.status === 'rejected').length,
  };

  const TABS = ['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'] as const;

  return (
    <div className="flex flex-col gap-5">

      {selectedAppt && <DetailModal appt={selectedAppt} onClose={() => setSelectedAppt(null)} />}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1e3a8a]">All Appointments</h2>
          <p className="text-sm text-slate-400">{appointments.length} total appointments across all hospitals</p>
        </div>
        <button type="button" onClick={() => alert('Export — demo only')} className="btn-outline rounded-xl px-4 py-2.5 text-sm">
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      {/* Status stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Total',     val: counts.all,       icon: Calendar,      cls: 'text-[#1e3a8a] bg-[#1e3a8a]/8' },
          { label: 'Pending',   val: counts.pending,   icon: Clock,         cls: 'text-amber-600 bg-amber-50' },
          { label: 'Accepted',  val: counts.accepted,  icon: CheckCircle2,  cls: 'text-green-600 bg-green-50' },
          { label: 'Completed', val: counts.completed, icon: CheckCircle2,  cls: 'text-blue-600 bg-blue-50' },
          { label: 'Rejected',  val: counts.rejected,  icon: XCircle,       cls: 'text-red-600 bg-red-50' },
        ].map(({ label, val, icon: Icon, cls }) => (
          <div key={label} className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col items-center gap-1.5 text-center cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => setStatusFilter(label === 'Total' ? '' : label.toLowerCase())}>
            <div className={`flex size-8 items-center justify-center rounded-lg ${cls}`}>
              <Icon className="size-4" />
            </div>
            <p className="text-xl font-black tabular-nums text-slate-800">{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search patient, reference, hospital…" className="input-field pl-9" />
        </div>
        <select className="select-field w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {TABS.slice(1).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        {(search || statusFilter) && (
          <button type="button" onClick={() => { setSearch(''); setStatusFilter(''); }}
            className="btn-outline rounded-lg px-3 py-2 text-sm">
            <RefreshCcw className="size-3.5" /> Reset
          </button>
        )}
        <span className="text-sm text-slate-400">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="All appointments">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Reference</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Hospital</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Date · Time</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <Calendar className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No appointments found</p>
                  </td>
                </tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[#1e3a8a]">{a.reference}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{a.patientName}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell max-w-[160px] truncate">{a.hospitalName}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{a.specialty}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-slate-700 font-medium">{a.preferredDate}</p>
                    <p className="text-xs text-slate-400">{a.preferredTime}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelectedAppt(a)}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-[#1e3a8a] hover:text-white transition-colors">
                      <Eye className="size-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminAppointments() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout sidebarItems={ADMIN_SIDEBAR} headerTitle="All Appointments" headerSubtitle="System-wide appointment management">
        <AdminAppointmentsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
