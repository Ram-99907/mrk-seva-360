import React, { useMemo } from 'react';
import {
  BarChart3, TrendingUp, Building2, Users, Calendar,
  CheckCircle2, Clock, XCircle, AlertCircle, BedDouble,
  Ambulance, Star, Activity, Download,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import { DEMO_HOSPITALS, DEMO_USERS } from '../../data/demoData';

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

// ─── Mini Bar ─────────────────────────────────────────────────────────────────
function MiniBar({ val, max, color }: { val: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((val / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>{val}</span>
    </div>
  );
}

function AdminReportsContent() {
  const { appointments } = useAppStore();
  const users = DEMO_USERS;

  const apptByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    appointments.forEach(a => { map[a.status] = (map[a.status] || 0) + 1; });
    return map;
  }, [appointments]);

  const apptByHospital = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    appointments.forEach(a => {
      if (!map[a.hospitalId]) map[a.hospitalId] = { name: a.hospitalName, count: 0 };
      map[a.hospitalId].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [appointments]);

  const apptBySpecialty = useMemo(() => {
    const map: Record<string, number> = {};
    appointments.forEach(a => { map[a.specialty] = (map[a.specialty] || 0) + 1; });
    return Object.entries(map).sort(([,a],[,b]) => b - a);
  }, [appointments]);

  const totalBeds    = DEMO_HOSPITALS.reduce((s, h) => s + (h.bedsAvailable ?? 0), 0);
  const totalBedCap  = DEMO_HOSPITALS.reduce((s, h) => s + (h.bedCount ?? 0), 0);
  const totalAmb     = DEMO_HOSPITALS.reduce((s, h) => s + (h.ambulances ?? 0), 0);
  const totalIcu     = DEMO_HOSPITALS.reduce((s, h) => s + (h.icuBeds ?? 0), 0);
  const avgRating    = (DEMO_HOSPITALS.reduce((s, h) => s + (h.rating ?? 0), 0) / DEMO_HOSPITALS.length).toFixed(1);

  const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b', accepted: '#059669', completed: '#1e3a8a',
    rejected: '#dc2626', cancelled: '#94a3b8',
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1e3a8a]">Reports & Analytics</h2>
          <p className="text-sm text-slate-400">Demo data summary · Not real hospital statistics</p>
        </div>
        <button type="button" className="btn-outline rounded-xl px-4 py-2.5 text-sm" onClick={() => alert('Export — demo only')}>
          <Download className="size-4" /> Export PDF
        </button>
      </div>

      {/* ── Overview Stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Hospitals',     val: DEMO_HOSPITALS.length,  icon: Building2,     color: 'text-[#1e3a8a]', bg: 'bg-[#1e3a8a]/8' },
          { label: 'Users',         val: users.length || 5,      icon: Users,         color: 'text-[#0d9488]', bg: 'bg-[#0d9488]/8' },
          { label: 'Appointments',  val: appointments.length,    icon: Calendar,      color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Avg Rating',    val: avgRating,              icon: Star,          color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-xl border border-slate-200 ${bg} p-4 text-center`}>
            <Icon className={`size-5 ${color} mx-auto mb-1`} />
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Grid: Status + Capacity ─────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* Appointment Status Breakdown */}
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <BarChart3 className="size-4 text-[#1e3a8a]" />
            Appointment Status Breakdown
          </h3>
          {appointments.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No appointments yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="capitalize font-medium">{status}</span>
                    <span className="font-bold" style={{ color }}>{apptByStatus[status] || 0}</span>
                  </div>
                  <MiniBar val={apptByStatus[status] || 0} max={appointments.length} color={color} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Capacity Summary */}
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Activity className="size-4 text-[#1e3a8a]" />
            Facility Capacity Summary
          </h3>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Available Beds',   val: totalBeds,   total: totalBedCap, icon: BedDouble,  color: '#1e3a8a', suffix: `of ${totalBedCap} total` },
              { label: 'ICU Beds',         val: totalIcu,    total: 300,         icon: Activity,   color: '#7c3aed', suffix: 'across all facilities' },
              { label: 'Ambulances Ready', val: totalAmb,    total: totalAmb,    icon: Ambulance,  color: '#0d9488', suffix: 'operational' },
              { label: 'HFR Verified',     val: DEMO_HOSPITALS.filter(h=>h.isHfrVerified).length, total: DEMO_HOSPITALS.length, icon: Building2, color: '#059669', suffix: `of ${DEMO_HOSPITALS.length} hospitals` },
            ].map(({ label, val, total, icon: Icon, color, suffix }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Icon className="size-3.5" style={{ color }} />
                    <span className="font-medium">{label}</span>
                  </span>
                  <span className="text-slate-400">{suffix}</span>
                </div>
                <MiniBar val={val} max={total || val} color={color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid: By Hospital + By Specialty ─────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* By Hospital */}
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">Appointments by Hospital</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {apptByHospital.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No appointment data</p>
            ) : apptByHospital.map(({ name, count }) => (
              <div key={name} className="flex items-center gap-4 px-5 py-3">
                <p className="flex-1 text-sm text-slate-700 font-medium truncate">{name}</p>
                <MiniBar val={count} max={Math.max(...apptByHospital.map(h=>h.count), 1)} color="#1e3a8a" />
              </div>
            ))}
            {/* Demo hospitals with 0 appointments */}
            {DEMO_HOSPITALS.filter(h => !apptByHospital.find(a => a.name === h.name)).slice(0, 4).map(h => (
              <div key={h.id} className="flex items-center gap-4 px-5 py-3 opacity-40">
                <p className="flex-1 text-sm text-slate-500 truncate">{h.name}</p>
                <MiniBar val={0} max={1} color="#1e3a8a" />
              </div>
            ))}
          </div>
        </div>

        {/* By Specialty */}
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-700">Appointments by Specialty</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {apptBySpecialty.length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">No appointment data</p>
            ) : apptBySpecialty.map(([specialty, count]) => (
              <div key={specialty} className="flex items-center gap-4 px-5 py-3">
                <p className="flex-1 text-sm text-slate-700 font-medium">{specialty}</p>
                <MiniBar val={count} max={Math.max(...apptBySpecialty.map(([,c])=>c), 1)} color="#0d9488" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hospital Ratings Table ─────────────────────────────── */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">Hospital Ratings Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hospital</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Rating</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">Reviews</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden lg:table-cell">Beds Free</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...DEMO_HOSPITALS].sort((a,b)=>(b.rating??0)-(a.rating??0)).map(h => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700 text-sm">{h.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={h.type === 'government' ? 'badge-govt' : 'badge-private'}>{h.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700">{h.rating?.toFixed(1) ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{h.reviewCount?.toLocaleString() ?? '0'}</td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{h.bedsAvailable ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-700">
        <AlertCircle className="size-4 shrink-0 mt-0.5" />
        <p><strong>Demo Report:</strong> All data shown is fictional sample data from the demo store. Not connected to real hospitals or patient records.</p>
      </div>
    </div>
  );
}

export default function AdminReports() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout sidebarItems={ADMIN_SIDEBAR} headerTitle="Reports & Analytics" headerSubtitle="System-wide data summary">
        <AdminReportsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
