import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Building2, Building, ShieldCheck, MapPin, BedDouble,
  Ambulance, Star, Eye, Edit2, PowerOff, X, Check, AlertCircle,
  Navigation, Phone, Filter,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import { DEMO_HOSPITALS, INDIAN_STATES } from '../../data/demoData';
import type { Hospital } from '../../types';

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

// ─── Add/Edit Modal ──────────────────────────────────────────────────────────
function HospitalModal({
  isOpen, onClose, onSave, initial
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (h: Partial<Hospital>) => void;
  initial?: Partial<Hospital>;
}) {
  const [form, setForm] = useState<Partial<Hospital>>(initial || {
    name: '', type: 'government', category: 'general',
    city: '', district: '', state: '', pincode: '',
    phone: '', address: '', opdTimings: '', opdFee: 'Free',
    bookingAvailable: true, emergencyAvailable: false,
  });

  const set = (k: keyof Hospital, v: any) => setForm(f => ({ ...f, [k]: v }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-[#1e3a8a]">
              {initial ? 'Edit Hospital' : 'Add New Hospital'}
            </h2>
            <p className="text-xs text-slate-400">Demo only — changes stored locally</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X className="size-5" />
          </button>
        </div>

        <form
          className="p-6 flex flex-col gap-5"
          onSubmit={e => { e.preventDefault(); onSave(form); onClose(); }}
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">Hospital Name *</label>
            <input className="input-field" value={form.name || ''} onChange={e => set('name', e.target.value)} required placeholder="e.g. AIIMS New Delhi" />
          </div>

          {/* Type + Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Facility Type *</label>
              <select className="select-field" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="government">Government</option>
                <option value="private">Empaneled Private</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Category *</label>
              <select className="select-field" value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="general">General Hospital</option>
                <option value="multi-specialty">Multi-Specialty</option>
                <option value="teaching">Teaching Hospital</option>
                <option value="specialty-clinic">Specialty Clinic</option>
                <option value="district">District Hospital</option>
              </select>
            </div>
          </div>

          {/* State + District */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">State / UT *</label>
              <select className="select-field" value={form.state} onChange={e => set('state', e.target.value)} required>
                <option value="">Select state…</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">District *</label>
              <input className="input-field" value={form.district || ''} onChange={e => set('district', e.target.value)} required placeholder="e.g. South Delhi" />
            </div>
          </div>

          {/* City + Pincode */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">City *</label>
              <input className="input-field" value={form.city || ''} onChange={e => set('city', e.target.value)} required placeholder="e.g. New Delhi" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">PIN Code</label>
              <input className="input-field" value={form.pincode || ''} onChange={e => set('pincode', e.target.value)} placeholder="6-digit PIN" />
            </div>
          </div>

          {/* Address + Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Address</label>
              <input className="input-field" value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="Full address" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Phone</label>
              <input className="input-field" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="Phone number" />
            </div>
          </div>

          {/* OPD Timings + Fee */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">OPD Timings</label>
              <input className="input-field" value={form.opdTimings || ''} onChange={e => set('opdTimings', e.target.value)} placeholder="e.g. 8:00 AM – 1:00 PM" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">OPD Fee</label>
              <select className="select-field" value={form.opdFee === 'Free' ? 'Free' : 'Paid'} onChange={e => set('opdFee', e.target.value === 'Free' ? 'Free' : 0)}>
                <option value="Free">Free</option>
                <option value="Paid">Paid (enter below)</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!form.emergencyAvailable} onChange={e => set('emergencyAvailable', e.target.checked)} className="size-4 rounded accent-red-600" />
              24×7 Emergency / Casualty
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!form.bookingAvailable} onChange={e => set('bookingAvailable', e.target.checked)} className="size-4 rounded accent-[#1e3a8a]" />
              Online Booking Available
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!form.isHfrVerified} onChange={e => set('isHfrVerified', e.target.checked)} className="size-4 rounded accent-[#0d9488]" />
              HFR Verified
            </label>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p>This is a <strong>demo</strong> operation. Changes are stored locally and will not persist on page refresh.</p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-outline rounded-lg px-5 py-2.5 text-sm">Cancel</button>
            <button type="submit" className="btn-navy rounded-lg px-5 py-2.5 text-sm">
              <Check className="size-4" />
              {initial ? 'Save Changes' : 'Add Hospital'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function AdminHospitalsContent() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'' | 'government' | 'private'>('');
  const [stateFilter, setStateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Hospital | null>(null);
  const [deactivated, setDeactivated] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState('');
  const [localHospitals, setLocalHospitals] = useState<Hospital[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const hospitals = useMemo(() => {
    return DEMO_HOSPITALS.filter(h => {
      if (typeFilter && h.type !== typeFilter) return false;
      if (stateFilter && h.state !== stateFilter) return false;
      if (search && !h.name.toLowerCase().includes(search.toLowerCase()) &&
          !h.city.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, typeFilter, stateFilter]);

  const availableStates = useMemo(() =>
    Array.from(new Set(DEMO_HOSPITALS.map(h => h.state))).sort(), []);

  const handleSave = (data: Partial<Hospital>) => {
    if (editTarget) {
      showToast(`✅ ${data.name} updated (demo only)`);
    } else {
      const newH: Hospital = {
        ...data,
        id: `h-admin-${Date.now()}`,
        departments: data.departments || [],
        dataSource: 'Admin Added — Demo',
        lastUpdated: new Date().toISOString().split('T')[0],
      } as Hospital;
      setLocalHospitals(prev => [newH, ...prev]);
      showToast(`✅ ${data.name} added successfully`);
    }
    setEditTarget(null);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast success animate-slide-down">
          <Check className="size-4 shrink-0" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1e3a8a]">Hospital Registry</h2>
          <p className="text-sm text-slate-400">{DEMO_HOSPITALS.length} facilities registered · HFR Verified</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="btn-navy rounded-xl px-4 py-2.5 text-sm"
        >
          <Plus className="size-4" /> Add Hospital
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Facilities', val: DEMO_HOSPITALS.length, color: 'text-[#1e3a8a]', bg: 'bg-[#1e3a8a]/8' },
          { label: 'Government',       val: DEMO_HOSPITALS.filter(h => h.type === 'government').length, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Private',          val: DEMO_HOSPITALS.filter(h => h.type === 'private').length, color: 'text-[#0d9488]', bg: 'bg-[#0d9488]/8' },
          { label: 'HFR Verified',     val: DEMO_HOSPITALS.filter(h => h.isHfrVerified).length, color: 'text-green-700', bg: 'bg-green-50' },
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
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or city…"
            className="input-field pl-9"
          />
        </div>
        <select className="select-field w-44" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
          <option value="">All Types</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
        </select>
        <select className="select-field w-44" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
          <option value="">All States</option>
          {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Hospital registry">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Hospital</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Location</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">OPD</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 hidden lg:table-cell">Beds</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hospitals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No hospitals match the filter.</td>
                </tr>
              ) : hospitals.map(h => {
                const inactive = deactivated.has(h.id);
                return (
                  <tr key={h.id} className={`hover:bg-slate-50 transition-colors ${inactive ? 'opacity-50' : ''}`}>
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={h.type === 'government' ? 'badge-govt' : 'badge-private'}>{h.type}</span>
                          {h.isHfrVerified && <span className="badge-verified"><ShieldCheck className="size-3" />HFR</span>}
                          {h.emergencyAvailable && <span className="badge-emergency-tag">24×7</span>}
                        </div>
                        <p className="font-semibold text-slate-800 text-sm leading-snug">{h.name}</p>
                      </div>
                    </td>
                    {/* Location */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-slate-600 text-xs">{h.district}</p>
                      <p className="text-slate-400 text-xs">{h.state}</p>
                    </td>
                    {/* OPD */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-slate-600">{h.opdTimings || '—'}</p>
                      <p className="text-xs font-semibold text-[#0d9488]">
                        {h.opdFee === 'Free' ? 'Free' : `₹${h.opdFee}`}
                      </p>
                    </td>
                    {/* Beds */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <BedDouble className="size-3.5 text-slate-400" />
                        {h.bedsAvailable ?? '—'} free
                        {h.icuBeds !== undefined && <span className="text-slate-400">· {h.icuBeds} ICU</span>}
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${inactive ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-700'}`}>
                        {inactive ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/hospitals/${h.id}`}
                          className="rounded-md bg-slate-100 p-1.5 text-slate-600 hover:bg-[#1e3a8a] hover:text-white transition-colors"
                          title="View"
                        >
                          <Eye className="size-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setEditTarget(h); setShowModal(true); }}
                          className="rounded-md bg-slate-100 p-1.5 text-slate-600 hover:bg-[#0d9488] hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeactivated(prev => {
                              const next = new Set(prev);
                              next.has(h.id) ? next.delete(h.id) : next.add(h.id);
                              return next;
                            });
                            showToast(`${h.name} ${deactivated.has(h.id) ? 'reactivated' : 'deactivated'}`);
                          }}
                          className="rounded-md bg-slate-100 p-1.5 text-slate-600 hover:bg-red-500 hover:text-white transition-colors"
                          title="Toggle active"
                        >
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

      {/* Modal */}
      <HospitalModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget || undefined}
      />
    </div>
  );
}

export default function AdminHospitals() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout sidebarItems={ADMIN_SIDEBAR} headerTitle="Hospital Registry" headerSubtitle="Manage all registered facilities">
        <AdminHospitalsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
