import React, { useState, useMemo } from 'react';
import {
  Users, UserPlus, Search, Shield, Stethoscope, User as UserIcon,
  Edit2, PowerOff, Check, X, AlertCircle, Mail, Phone,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import { DEMO_HOSPITALS, DEMO_USERS } from '../../data/demoData';
import type { User } from '../../types';

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

const ROLE_COLORS: Record<string, string> = {
  admin:        'bg-red-50 text-red-700 border-red-200',
  receptionist: 'bg-[#0d9488]/10 text-[#0d9488] border-[#0d9488]/25',
  patient:      'bg-[#1e3a8a]/8 text-[#1e3a8a] border-[#1e3a8a]/20',
};

const ROLE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  admin: Shield, receptionist: Stethoscope, patient: UserIcon,
};

function AdminUsersContent() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [toast, setToast] = useState('');
  const [deactivated, setDeactivated] = useState<Set<string>>(new Set());

  // Use DEMO_USERS directly (store doesn't expose users array)
  const allUsers: User[] = DEMO_USERS;

  const filtered = useMemo(() => allUsers.filter((u: User) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [allUsers, search, roleFilter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const counts = {
    total:        allUsers.length,
    patients:     allUsers.filter((u: User) => u.role === 'patient').length,
    receptionists:allUsers.filter((u: User) => u.role === 'receptionist').length,
    admins:       allUsers.filter((u: User) => u.role === 'admin').length,
  };

  return (
    <div className="flex flex-col gap-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast info animate-slide-down">
          <Check className="size-4 shrink-0" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1e3a8a]">User Management</h2>
          <p className="text-sm text-slate-400">{counts.total} registered users</p>
        </div>
        <button type="button" className="btn-navy rounded-xl px-4 py-2.5 text-sm" onClick={() => showToast('Add User — use the Register page (demo)')}>
          <UserPlus className="size-4" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Users',    val: counts.total,         color: 'text-[#1e3a8a]', bg: 'bg-[#1e3a8a]/8' },
          { label: 'Patients',       val: counts.patients,      color: 'text-blue-700',   bg: 'bg-blue-50' },
          { label: 'Receptionists',  val: counts.receptionists, color: 'text-[#0d9488]',  bg: 'bg-[#0d9488]/8' },
          { label: 'Admins',         val: counts.admins,        color: 'text-red-700',    bg: 'bg-red-50' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`rounded-xl border border-slate-200 ${bg} p-4 text-center`}>
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…" className="input-field pl-9" />
        </div>
        <select className="select-field w-40" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="patient">Patient</option>
          <option value="receptionist">Receptionist</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="User list">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">User</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Role</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">Hospital</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No users match the filter.</td></tr>
              ) : filtered.map((u: User) => {
                const RIcon = ROLE_ICON[u.role] || UserIcon;
                const inactive = deactivated.has(u.id);
                const hospital = u.hospitalId ? DEMO_HOSPITALS.find(h => h.id === u.hospitalId) : null;
                return (
                  <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${inactive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #1e3a8a, #0d9488)' }}>
                          {u.avatarInitials || u.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs flex items-center gap-1 text-slate-600"><Mail className="size-3" />{u.email}</p>
                        {u.phone && <p className="text-xs flex items-center gap-1 text-slate-400"><Phone className="size-3" />{u.phone}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${ROLE_COLORS[u.role] || ROLE_COLORS.patient}`}>
                        <RIcon className="size-3" /> {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">
                      {hospital ? hospital.name : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${inactive ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-700'}`}>
                        {inactive ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button type="button"
                          className="rounded-md bg-slate-100 p-1.5 text-slate-600 hover:bg-[#0d9488] hover:text-white transition-colors"
                          onClick={() => showToast('Edit user — demo, changes not persisted')}
                          title="Edit role">
                          <Edit2 className="size-3.5" />
                        </button>
                        <button type="button"
                          className="rounded-md bg-slate-100 p-1.5 text-slate-600 hover:bg-red-500 hover:text-white transition-colors"
                          onClick={() => {
                            setDeactivated(prev => { const n = new Set(prev); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; });
                            showToast(`${u.name} ${deactivated.has(u.id) ? 'reactivated' : 'deactivated'} (demo)`);
                          }}
                          title="Toggle active">
                          <PowerOff className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo notice */}
      <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-700">
        <AlertCircle className="size-4 shrink-0 mt-0.5" />
        <p><strong>Demo Mode:</strong> New users can be added via the <a href="/register" className="underline">Register</a> page. All changes here are display-only and not persisted.</p>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout sidebarItems={ADMIN_SIDEBAR} headerTitle="User Management" headerSubtitle="Manage patients, receptionists and admins">
        <AdminUsersContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
