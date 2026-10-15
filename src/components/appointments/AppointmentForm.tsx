import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { generateTimeSlots, getMinDate, getMaxDate } from '../../utils/helpers';
import type { Appointment } from '../../types';

interface AppointmentFormProps {
  hospitalId: string;
  hospitalName: string;
  specialties: string[];
  onSuccess?: (appt: Appointment) => void;
  compact?: boolean;
}

const TIME_SLOTS = generateTimeSlots();

export default function AppointmentForm({ hospitalId, hospitalName, specialties, onSuccess }: AppointmentFormProps) {
  const { currentUser, isAuthenticated, submitAppointment } = useAppStore();

  const [form, setForm] = useState({
    specialty: '',
    preferredDoctor: '',
    preferredDate: '',
    preferredTime: '',
    patientName: currentUser?.name || '',
    patientPhone: currentUser?.phone || '',
    patientEmail: currentUser?.email || '',
    reason: '',
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successAppt, setSuccessAppt] = useState<Appointment | null>(null);

  const set = (field: string, value: any) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  if (!isAuthenticated) {
    return (
      <div className="card max-w-lg mx-auto text-center py-12">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7 text-primary-600" />
        </div>
        <h3 className="font-semibold text-medical-text mb-2 font-display">Login Required</h3>
        <p className="text-sm text-medical-muted mb-6">Please log in to request an appointment.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login" className="btn-primary">Login</Link>
          <Link to="/register" className="btn-secondary">Register</Link>
        </div>
      </div>
    );
  }

  if (successAppt) {
    return (
      <div className="card max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-medical-text mb-2 font-display">Request Submitted!</h3>
        <p className="text-sm text-medical-muted mb-6">
          Your appointment request has been received. The hospital receptionist will review and update the status.
        </p>
        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
          <p className="text-xs text-primary-600 mb-1">Appointment Reference</p>
          <p className="text-xl font-bold text-primary-700 font-mono">{successAppt.reference}</p>
          <p className="text-xs text-medical-muted mt-2">{successAppt.hospitalName} · {successAppt.specialty} · {successAppt.preferredDate}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-left">
          <p className="text-xs text-amber-700 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span><strong>Demo Mode:</strong> This appointment request is not transmitted to a real hospital. This is a demonstration only.</span>
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/patient/appointments" className="btn-primary">View My Appointments</Link>
          <button className="btn-secondary" onClick={() => setSuccessAppt(null)}>Book Another</button>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.specialty) errs.specialty = 'Please select a specialty';
    if (!form.preferredDate) errs.preferredDate = 'Please select a date';
    if (!form.preferredTime) errs.preferredTime = 'Please select a time slot';
    if (!form.patientName.trim()) errs.patientName = 'Name is required';
    if (!form.patientPhone.trim()) errs.patientPhone = 'Phone is required';
    if (!form.patientEmail.trim()) errs.patientEmail = 'Email is required';
    if (!form.consent) errs.consent = 'Please accept the demo consent';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs as any);
      return;
    }
    setIsLoading(true);

    // Try real API first; fall back to local demo store
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: currentUser!.id,
          patientName: form.patientName,
          patientPhone: form.patientPhone,
          patientEmail: form.patientEmail,
          hospitalId,
          hospitalName,
          department: form.specialty,
          preferredDate: form.preferredDate,
          preferredTime: form.preferredTime,
          reason: form.reason || undefined,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        // Map DB row to Appointment shape used by local store
        const dbRow = json.data as Record<string, unknown>;
        const appt: Appointment = {
          id: String(dbRow.id),
          reference: `MS360-${String(dbRow.id).slice(0, 8).toUpperCase()}`,
          patientId: currentUser!.id,
          patientName: form.patientName,
          patientPhone: form.patientPhone,
          patientEmail: form.patientEmail,
          hospitalId,
          hospitalName,
          specialty: form.specialty,
          preferredDoctor: form.preferredDoctor || undefined,
          preferredDate: form.preferredDate,
          preferredTime: form.preferredTime,
          reason: form.reason || undefined,
          status: 'pending',
          queueNumber: Number(dbRow.token_number),
          createdAt: String(dbRow.created_at),
          updatedAt: String(dbRow.updated_at),
          statusHistory: [],
        };
        setIsLoading(false);
        setSuccessAppt(appt);
        if (onSuccess) onSuccess(appt);
        return;
      }
    } catch {
      // API unavailable (local dev without DB) — fall through to demo store
    }

    // Demo store fallback
    const appt = submitAppointment({
      patientId: currentUser!.id,
      patientName: form.patientName,
      patientPhone: form.patientPhone,
      patientEmail: form.patientEmail,
      hospitalId,
      hospitalName,
      specialty: form.specialty,
      preferredDoctor: form.preferredDoctor || undefined,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      reason: form.reason || undefined,
      status: 'pending',
    });
    setIsLoading(false);
    setSuccessAppt(appt);
    if (onSuccess) onSuccess(appt);
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="font-bold text-medical-text font-display">Request Appointment</h2>
          <p className="text-sm text-medical-muted">{hospitalName}</p>
        </div>
      </div>

      <div className="demo-banner mb-6">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Demo mode — requests are stored locally only and not sent to any real hospital.</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hospital (read-only) */}
        <div>
          <label className="label">Hospital</label>
          <div className="input-field bg-gray-50 text-medical-muted cursor-default">{hospitalName}</div>
        </div>

        {/* Specialty */}
        <div>
          <label className="label">Specialty / Service *</label>
          <select className={`input-field ${errors.specialty ? 'border-red-400' : ''}`} value={form.specialty} onChange={e => set('specialty', e.target.value)}>
            <option value="">Select specialty</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
        </div>

        {/* Doctor */}
        <div>
          <label className="label">Preferred Doctor <span className="text-medical-muted font-normal">(optional)</span></label>
          <input type="text" className="input-field" placeholder="Doctor name (subject to hospital confirmation)" value={form.preferredDoctor} onChange={e => set('preferredDoctor', e.target.value)} />
        </div>

        {/* Date + Time */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Preferred Date *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted pointer-events-none" />
              <input
                type="date"
                className={`input-field pl-9 ${errors.preferredDate ? 'border-red-400' : ''}`}
                min={getMinDate()}
                max={getMaxDate()}
                value={form.preferredDate}
                onChange={e => set('preferredDate', e.target.value)}
              />
            </div>
            {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>}
          </div>
          <div>
            <label className="label">Preferred Time *</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted pointer-events-none" />
              <select className={`input-field pl-9 ${errors.preferredTime ? 'border-red-400' : ''}`} value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)}>
                <option value="">Select time</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {errors.preferredTime && <p className="text-red-500 text-xs mt-1">{errors.preferredTime}</p>}
          </div>
        </div>

        {/* Patient info */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm font-semibold text-medical-text mb-4 font-display">Patient Information</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                <input type="text" className={`input-field pl-9 ${(errors as any).patientName ? 'border-red-400' : ''}`} value={form.patientName} onChange={e => set('patientName', e.target.value)} />
              </div>
              {(errors as any).patientName && <p className="text-red-500 text-xs mt-1">{(errors as any).patientName}</p>}
            </div>
            <div>
              <label className="label">Mobile Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
                <input type="tel" className={`input-field pl-9 ${(errors as any).patientPhone ? 'border-red-400' : ''}`} value={form.patientPhone} onChange={e => set('patientPhone', e.target.value)} />
              </div>
              {(errors as any).patientPhone && <p className="text-red-500 text-xs mt-1">{(errors as any).patientPhone}</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="label">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-muted" />
              <input type="email" className={`input-field pl-9 ${(errors as any).patientEmail ? 'border-red-400' : ''}`} value={form.patientEmail} onChange={e => set('patientEmail', e.target.value)} />
            </div>
            {(errors as any).patientEmail && <p className="text-red-500 text-xs mt-1">{(errors as any).patientEmail}</p>}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="label">Reason for Visit <span className="text-medical-muted font-normal">(optional)</span></label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-medical-muted" />
            <textarea
              className="input-field pl-9 h-24 resize-none"
              placeholder="Brief description only. Do not share sensitive medical information."
              value={form.reason}
              onChange={e => set('reason', e.target.value)}
            />
          </div>
        </div>

        {/* Consent */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 rounded text-primary-600"
              checked={form.consent}
              onChange={e => set('consent', e.target.checked)}
            />
            <span className="text-sm text-amber-800">
              I confirm this is a <strong>demo appointment request</strong> and understand it will <strong>not be transmitted to a real hospital</strong>. This platform is for demonstration purposes only.
            </span>
          </label>
          {(errors as any).consent && <p className="text-red-500 text-xs mt-2">{(errors as any).consent}</p>}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </span>
          ) : 'Submit Appointment Request'}
        </button>
      </form>
    </div>
  );
}
