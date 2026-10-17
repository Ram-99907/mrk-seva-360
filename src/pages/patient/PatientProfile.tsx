import { useState } from 'react';
import { User, Mail, Phone, Shield, AlertCircle, Check } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';

function PatientProfileContent() {
  const { currentUser } = useAppStore();
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
  });
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', icon: 'LayoutDashboard' as const, href: '/patient/dashboard', active: false },
    { label: 'Find Hospitals', icon: 'Search' as const, href: '/hospitals', active: false },
    { label: 'My Appointments', icon: 'Calendar' as const, href: '/patient/appointments', active: false },
    { label: 'Notifications', icon: 'Bell' as const, href: '/patient/notifications', active: false },
    { label: 'Transactions', icon: 'CreditCard' as const, href: '/patient/transactions', active: false },
    { label: 'My Profile', icon: 'User' as const, href: '/patient/profile', active: true },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePw = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
    setPwForm({ current: '', next: '', confirm: '' });
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="My Profile">
      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
              {currentUser?.avatarInitials || currentUser?.name?.[0]}
            </div>
            <div>
              <h2 className="font-bold text-navy-DEFAULT font-display text-lg">{currentUser?.name}</h2>
              <span className="badge badge-blue capitalize">{currentUser?.role}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                <input
                  type="text"
                  className="input-field pl-9"
                  value={editForm.name}
                  onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                <input type="email" className="input-field pl-9 bg-gray-50" value={currentUser?.email} disabled />
              </div>
              <p className="text-xs text-medical-muted mt-1">Email cannot be changed in Live.</p>
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                <input
                  type="tel"
                  className="input-field pl-9"
                  value={editForm.phone}
                  onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary">Save Changes</button>
              {saved && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <Check className="w-4 h-4" /> Saved (demo only)
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Password */}
        <div className="card">
          <h3 className="font-semibold text-medical-text font-display mb-4">Change Password</h3>
          
          <form onSubmit={handlePw} className="space-y-4">
            {[['current', 'Current Password'], ['next', 'New Password'], ['confirm', 'Confirm New Password']].map(([field, label]) => (
              <div key={field}>
                <label className="label">{label}</label>
                <input
                  type="password"
                  className="input-field"
                  value={(pwForm as any)[field]}
                  onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                />
              </div>
            ))}
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-secondary">Update Password</button>
              {pwSaved && <span className="text-green-600 text-sm flex items-center gap-1"><Check className="w-4 h-4" />Updated</span>}
            </div>
          </form>
        </div>

        {/* Privacy */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-medical-text font-display">Privacy & Consent</h3>
          </div>
          <div className="space-y-3">
            {[
              'I consent to my appointment data being managed by MEDI SEVA 360',
              'I understand this is a demonstration platform with fictional data',
              'I have read and understood the Privacy Notice',
            ].map(text => (
              <label key={text} className="flex items-start gap-3">
                <input type="checkbox" defaultChecked className="mt-0.5 text-primary-600 rounded" />
                <span className="text-sm text-medical-text">{text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border border-red-100">
          <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-medical-muted mb-4">Deleting your account removes all local VERIFIED. This cannot be undone.</p>
          <button
            className="btn-danger text-sm"
            onClick={() => alert('This is a demo — account deletion is simulated and not available in this mode.')}
          >
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PatientProfile() {
  return (
    <ProtectedRoute requiredRole="patient">
      <PatientProfileContent />
    </ProtectedRoute>
  );
}
