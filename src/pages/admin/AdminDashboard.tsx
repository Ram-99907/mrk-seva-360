import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, Calendar, Activity, TrendingUp, ShieldCheck,
  AlertCircle, CheckCircle2, Clock, XCircle, BarChart3, Building,
  BedDouble, Ambulance, Star, ArrowRight, Eye, Settings,
  UserPlus, MapPin, RefreshCcw,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import { DEMO_HOSPITALS, DEMO_USERS } from '../../data/demoData';
import { useTranslation } from 'react-i18next';

// Sidebar items will be built inside the component with t()

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  title, value, sub, icon: Icon, color, bg, trend
}: {
  title: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; bg: string; trend?: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
          <p className={`mt-1 text-2xl font-black tabular-nums ${color}`}>{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`flex size-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`size-5 ${color}`} />
        </div>
      </div>
      {trend && (
        <p className="text-xs font-medium text-[#0d9488] flex items-center gap-1">
          <TrendingUp className="size-3" /> {trend}
        </p>
      )}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:   'bg-amber-50 text-amber-700 border-amber-200',
    accepted:  'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    rejected:  'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${map[status] || map.cancelled}`}>
      {status}
    </span>
  );
}

// ─── Mini Ring Chart ──────────────────────────────────────────────────────────
function MiniRingChart({ govt, pvt }: { govt: number; pvt: number }) {
  const total = govt + pvt;
  const govtPct = total ? Math.round((govt / total) * 100) : 0;
  const pvtPct = 100 - govtPct;
  const r = 36, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  const govtDash = (govtPct / 100) * circ;
  return (
    <svg viewBox="0 0 88 88" className="size-20" aria-label={`Government ${govtPct}%, Private ${pvtPct}%`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#1e3a8a" strokeWidth="12"
        strokeDasharray={`${govtDash} ${circ - govtDash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#0d9488" strokeWidth="12"
        strokeDasharray={`${circ - govtDash} ${govtDash}`}
        strokeDashoffset={-govtDash}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="800" fill="#1e3a8a">
        {total}
      </text>
    </svg>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboardContent() {
  const { appointments, notifications, currentUser } = useAppStore();
  const users = DEMO_USERS;

  const govtHospitals = DEMO_HOSPITALS.filter(h => h.type === 'government');
  const pvtHospitals  = DEMO_HOSPITALS.filter(h => h.type === 'private');

  const apptStats = useMemo(() => ({
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    accepted:  appointments.filter(a => a.status === 'accepted').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    rejected:  appointments.filter(a => a.status === 'rejected').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }), [appointments]);

  const totalBeds      = DEMO_HOSPITALS.reduce((s, h) => s + (h.bedsAvailable ?? 0), 0);
  const totalAmbulance = DEMO_HOSPITALS.reduce((s, h) => s + (h.ambulances ?? 0), 0);
  const totalBedCap    = DEMO_HOSPITALS.reduce((s, h) => s + (h.bedCount ?? 0), 0);

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const topHospitals = [...DEMO_HOSPITALS]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 5);

  const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col gap-6">

      {/* ── Welcome Banner ──────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl text-white p-6"
        style={{ background: 'linear-gradient(135deg, #0f2056 0%, #1e3a8a 50%, #0d9488 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">{now}</p>
            <h2 className="text-xl font-black mt-1">Welcome back, {currentUser?.name?.split(' ')[0]} 👋</h2>
            <p className="text-sm text-white/70 mt-1">
              MEDI SEVA 360 Admin Panel · {DEMO_HOSPITALS.length} facilities registered · {appointments.length} total appointments
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to="/admin/hospitals" className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/25 transition-colors">
              <Building2 className="size-4" /> Manage Hospitals
            </Link>
            <Link to="/admin/users" className="flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors">
              <UserPlus className="size-4" /> Add User
            </Link>
          </div>
        </div>
      </div>

      {/* ── Primary Stats ────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Hospitals"    value={DEMO_HOSPITALS.length}     sub={`${govtHospitals.length} Govt · ${pvtHospitals.length} Private`} icon={Building2}    color="text-[#1e3a8a]" bg="bg-[#1e3a8a]/8"  trend="+2 this month" />
        <StatCard title="Registered Users"   value={users.length + 3}          sub="Patients + Staff"                                                  icon={Users}        color="text-[#0d9488]" bg="bg-[#0d9488]/8"  trend="+5 this week" />
        <StatCard title="Total Appointments" value={apptStats.total}           sub={`${apptStats.pending} pending review`}                             icon={Calendar}     color="text-purple-600" bg="bg-purple-50"    trend="+3 today" />
        <StatCard title="System Status"      value="Live"                      sub="All services operational"                                          icon={Activity}     color="text-green-600"  bg="bg-green-50"    trend="99.9% uptime" />
      </div>

      {/* ── Appointment Stats Row ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Pending',   val: apptStats.pending,   icon: Clock,         cls: 'text-amber-600 bg-amber-50' },
          { label: 'Accepted',  val: apptStats.accepted,  icon: CheckCircle2,  cls: 'text-green-600 bg-green-50' },
          { label: 'Completed', val: apptStats.completed, icon: CheckCircle2,  cls: 'text-blue-600 bg-blue-50' },
          { label: 'Rejected',  val: apptStats.rejected,  icon: XCircle,       cls: 'text-red-600 bg-red-50' },
          { label: 'Cancelled', val: apptStats.cancelled, icon: AlertCircle,   cls: 'text-slate-600 bg-slate-100' },
        ].map(({ label, val, icon: Icon, cls }) => (
          <div key={label} className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col items-center text-center gap-1">
            <div className={`flex size-9 items-center justify-center rounded-lg ${cls}`}>
              <Icon className="size-5" />
            </div>
            <p className="text-xl font-black tabular-nums text-slate-800">{val}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Grid: Hospital Mix + Capacity ─────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Hospital Type Mix */}
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Hospital Mix</h3>
          <div className="flex items-center gap-6">
            <MiniRingChart govt={govtHospitals.length} pvt={pvtHospitals.length} />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#1e3a8a]" />
                <span className="text-xs text-slate-500">Government</span>
                <span className="ml-auto text-sm font-bold text-[#1e3a8a]">{govtHospitals.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#0d9488]" />
                <span className="text-xs text-slate-500">Private</span>
                <span className="ml-auto text-sm font-bold text-[#0d9488]">{pvtHospitals.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-slate-200" />
                <span className="text-xs text-slate-500">Total</span>
                <span className="ml-auto text-sm font-bold text-slate-700">{DEMO_HOSPITALS.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bed & Ambulance Capacity */}
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Capacity Overview</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Available Beds', val: totalBeds, total: totalBedCap, icon: BedDouble, color: '#1e3a8a' },
              { label: 'Ambulances', val: totalAmbulance, total: totalAmbulance, icon: Ambulance, color: '#0d9488' },
              { label: 'ICU Beds', val: DEMO_HOSPITALS.reduce((s,h)=>s+(h.icuBeds??0),0), total: 200, icon: Activity, color: '#7c3aed' },
            ].map(({ label, val, total, icon: Icon, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Icon className="size-3.5" style={{ color }} />
                    {label}
                  </span>
                  <span className="font-bold" style={{ color }}>{val}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (val/total)*100)}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-white border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Add Hospital',     to: '/admin/hospitals',    icon: Building2, color: 'text-[#1e3a8a] bg-[#1e3a8a]/8' },
              { label: 'Add User',         to: '/admin/users',        icon: UserPlus,  color: 'text-[#0d9488] bg-[#0d9488]/8' },
              { label: 'View Reports',     to: '/admin/reports',      icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
              { label: 'All Appointments', to: '/admin/appointments', icon: Calendar,  color: 'text-amber-600 bg-amber-50' },
              { label: 'Live Map',         to: '/hospitals/map',      icon: MapPin,    color: 'text-rose-600 bg-rose-50' },
              { label: 'System Settings',  to: '/admin/settings',     icon: Settings,  color: 'text-slate-600 bg-slate-100' },
            ].map(({ label, to, icon: Icon, color }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors group"
              >
                <div className={`flex size-7 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="size-4" />
                </div>
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <ArrowRight className="size-3.5 ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Appointments Table ──────────────────────── */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">Recent Appointments</h3>
          <Link to="/admin/appointments" className="text-xs font-semibold text-[#1e3a8a] hover:underline flex items-center gap-1">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Recent appointments">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Reference</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Hospital</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">Specialty</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Date</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                    No appointments yet.
                  </td>
                </tr>
              ) : recentAppointments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#1e3a8a] font-semibold">{a.reference}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{a.patientName}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell max-w-[160px] truncate">{a.hospitalName}</td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{a.specialty}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{a.preferredDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <Link to="/admin/appointments" className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-[#1e3a8a] hover:text-white transition-colors">
                      <Eye className="size-3" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Top Hospitals by Rating ────────────────────────── */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">Top Rated Hospitals</h3>
          <Link to="/admin/hospitals" className="text-xs font-semibold text-[#1e3a8a] hover:underline flex items-center gap-1">
            All hospitals <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {topHospitals.map((h, i) => (
            <div key={h.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700 truncate">{h.name}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="size-3" />{h.district}, {h.state}
                  <span className="mx-1">·</span>
                  <span className={h.type === 'government' ? 'badge-govt' : 'badge-private'}>{h.type}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-slate-700">{h.rating?.toFixed(1)}</span>
                <span className="text-xs text-slate-400 hidden sm:block">({h.reviewCount?.toLocaleString()})</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <BedDouble className="size-3.5" />
                <span>{h.bedsAvailable ?? '—'} free</span>
              </div>
              <Link
                to={`/hospitals/${h.id}`}
                className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── System Health ───────────────────────────────────── */}
      <div className="rounded-xl bg-white border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-4">System Health</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'HFR Sync',       status: 'Operational', color: 'text-green-600 bg-green-50' },
            { label: 'OPD Booking API',status: 'Operational', color: 'text-green-600 bg-green-50' },
            { label: 'ABDM Integration',status: 'Demo Mode',  color: 'text-amber-600 bg-amber-50' },
            { label: 'SMS Alerts',     status: 'Demo Mode',  color: 'text-amber-600 bg-amber-50' },
          ].map(({ label, status, color }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-3">
              <span className={`flex size-2 rounded-full ${status === 'Operational' ? 'bg-green-500' : 'bg-amber-400'}`} />
              <div>
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className={`text-[10px] font-semibold ${color} px-1.5 py-0.5 rounded-full w-fit mt-0.5`}>{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const adminSidebar = [
    { label: t('admin.dashboard'),    icon: 'LayoutDashboard', href: '/admin/dashboard' },
    { label: t('admin.hospitals'),    icon: 'Building2',       href: '/admin/hospitals' },
    { label: t('admin.users'),        icon: 'Users',           href: '/admin/users' },
    { label: t('admin.appointments'), icon: 'Calendar',        href: '/admin/appointments' },
    { label: t('admin.reports'),      icon: 'BarChart2',       href: '/admin/reports' },
    { label: t('patient.notifications'), icon: 'Bell',         href: '/admin/notifications' },
    { label: t('admin.auditLogs'),    icon: 'Shield',          href: '/admin/audit' },
    { label: t('admin.settings'),     icon: 'Settings',        href: '/admin/settings' },
  ];
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout
        sidebarItems={adminSidebar}
        headerTitle={t('admin.dashboard')}
        headerSubtitle="MEDI SEVA 360 System Overview"
      >
        <AdminDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
