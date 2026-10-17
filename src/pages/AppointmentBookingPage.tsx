import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import AppointmentForm from '../components/appointments/AppointmentForm';
import { DEMO_HOSPITALS } from '../data/demoData';
import { useAppStore } from '../store/appStore';

export default function AppointmentBookingPage() {
  const { isAuthenticated } = useAppStore();
  const [selectedHospitalId, setSelectedHospitalId] = useState('');

  const bookableHospitals = DEMO_HOSPITALS.filter(h => h.bookingAvailable);
  const selectedHospital = DEMO_HOSPITALS.find(h => h.id === selectedHospitalId);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-DEFAULT font-display">Book an Appointment</h1>
          <p className="text-medical-muted mt-2">Select a hospital and fill in your preferred details.</p>
        </div>

        {!isAuthenticated && (
          <div className="card text-center py-12 mb-6">
            <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-4" />
            <h3 className="font-semibold text-medical-text mb-2 font-display">Login Required</h3>
            <p className="text-sm text-medical-muted mb-5">Please log in to request an appointment.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-secondary">Register</Link>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <>
            {/* Hospital Selector */}
            <div className="card mb-6">
              <label className="label text-base font-semibold font-display">Select Hospital</label>
              <p className="text-sm text-medical-muted mb-4">Only hospitals with online booking enabled are listed.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {bookableHospitals.map(h => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHospitalId(h.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedHospitalId === h.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        h.type === 'government' ? 'bg-blue-100' : 'bg-teal-100'
                      }`}>
                        <Building2 className={`w-4 h-4 ${h.type === 'government' ? 'text-blue-600' : 'text-teal-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-medical-text leading-snug">{h.name}</p>
                        <p className="text-xs text-medical-muted mt-0.5">{h.city} · {h.type}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {h.specialties.slice(0, 2).map(s => (
                            <span key={s} className="badge badge-blue text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {bookableHospitals.length === 0 && (
                <p className="text-sm text-medical-muted text-center py-6">No hospitals with online booking available in </p>
              )}
            </div>

            {/* Appointment Form */}
            {selectedHospital && (
              <AppointmentForm
                hospitalId={selectedHospital.id}
                hospitalName={selectedHospital.name}
                specialties={selectedHospital.specialties}
              />
            )}

            {!selectedHospitalId && (
              <div className="text-center py-8 text-medical-muted text-sm">
                ↑ Select a hospital above to continue.
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
