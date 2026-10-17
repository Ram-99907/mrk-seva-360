import { MapPin, Phone, Clock, Globe, Building2, CheckCircle, Shield } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { DEMO_HOSPITALS } from '../../data/demoData';

const HOSPITAL_ID = 'h001';

function ReceptionistHospitalContent() {
  const hospital = DEMO_HOSPITALS.find(h => h.id === HOSPITAL_ID)!;

  const sidebarItems = [
    { label: 'Overview', icon: 'LayoutDashboard' as const, href: '/receptionist/dashboard', active: false },
    { label: 'Appointment Requests', icon: 'ClipboardList' as const, href: '/receptionist/appointments', active: false },
    { label: "Today's Queue", icon: 'ListOrdered' as const, href: '/receptionist/queue', active: false },
    { label: 'Notifications', icon: 'Bell' as const, href: '/receptionist/notifications', active: false },
    { label: 'Hospital Profile', icon: 'Building2' as const, href: '/receptionist/hospital', active: true },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Hospital Profile">
      <div className="max-w-3xl space-y-6">
        <div className="card">
          <div className="relative h-40 rounded-xl overflow-hidden mb-5">
            <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-DEFAULT/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className={`badge font-semibold text-white ${hospital.type === 'government' ? 'bg-blue-600' : 'bg-teal-600'}`}>
                {hospital.type === 'government' ? 'Government' : 'Private'}
              </span>
            </div>
          </div>
          <h2 className="font-bold text-navy-DEFAULT font-display text-xl mb-1">{hospital.name}</h2>
          <p className="text-sm text-medical-muted mb-4">{hospital.description}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-medical-muted">Address</p>
                <p className="text-sm text-medical-text">{hospital.address}, {hospital.city}, {hospital.state}</p>
              </div>
            </div>
            {hospital.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-medical-muted">Phone</p>
                  <p className="text-sm text-medical-text">{hospital.phone}</p>
                </div>
              </div>
            )}
            {hospital.openingHours && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-medical-muted">Hours</p>
                  <p className="text-sm text-medical-text">{hospital.openingHours}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-medical-muted">Beds / Est.</p>
                <p className="text-sm text-medical-text">{hospital.bedCount?.toLocaleString()} beds · Est. {hospital.established}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-medical-text font-display mb-4">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {hospital.specialties.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-medical-text font-display mb-4">Services</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {hospital.services.map(s => (
              <div key={s} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-medical-text">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-700">Note</p>
          </div>
          <p className="text-xs text-amber-700">Hospital profile edits are managed by the Administrator. Contact your system admin to update hospital information.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ReceptionistHospital() {
  return (
    <ProtectedRoute requiredRole="receptionist">
      <ReceptionistHospitalContent />
    </ProtectedRoute>
  );
}
