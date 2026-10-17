import { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  MapPin, Phone, Globe, Clock, Building2, ChevronRight, Star,
  Stethoscope, ShieldCheck, Navigation, CalendarPlus, AlertCircle,
  Bed, Calendar, CheckCircle, Activity, Users, Ambulance, HeartPulse,
  BadgeCheck, Banknote, ClipboardList, IndianRupee, Wifi,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import AppointmentForm from '../components/appointments/AppointmentForm';
import HospitalMap from '../components/map/HospitalMap';
import { DEMO_HOSPITALS, DEMO_REVIEWS } from '../data/demoData';

const TABS = ['overview', 'map', 'services', 'reviews', 'book'] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  overview: '📋 Overview',
  map:      '🗺️ Live Map',
  services: '🏥 Services',
  reviews:  '⭐ Reviews',
  book:     '📅 Book OPD Token',
};

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    (searchParams.get('tab') as Tab) || 'overview'
  );

  const hospital = DEMO_HOSPITALS.find(h => h.id === id);
  const reviews  = DEMO_REVIEWS.filter(r => r.hospitalId === id);

  if (!hospital) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-20">
            <Building2 className="w-20 h-20 text-navy-light/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#1e293b] font-display mb-2">Hospital Not Found</h2>
            <p className="text-slate-500 mb-6">This hospital doesn't exist in our demo directory.</p>
            <Link to="/hospitals" className="btn-primary">← Back to Hospitals</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : (hospital.rating?.toFixed(1) ?? '4.2');

  const isGovt = hospital.type === 'government';
  const opdFeeDisplay = hospital.opdFee === 'Free' || hospital.opdFee === 0
    ? 'Free OPD'
    : hospital.opdFee ? `₹${hospital.opdFee} OPD Fee` : 'Contact Hospital';

  return (
    <PageLayout>
      {/* ── Hero Banner ───────────────────────────────── */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {hospital.image ? (
          <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-DEFAULT to-[#0d9488]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/40 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 flex items-center gap-2 text-white/75 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/hospitals" className="hover:text-white transition-colors">Hospitals</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-medium truncate max-w-xs">{hospital.name.split('–')[0].trim()}</span>
        </div>

        {/* Demo badge */}
        <div className="absolute top-6 right-6">
          <span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">🧪 DEMO DATA</span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${isGovt ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {isGovt ? '🏛️ Government' : '🏥 Private'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white capitalize">
              {hospital.category.replace('-', ' ')}
            </span>
            {hospital.emergencyAvailable && (
              <span className="badge-emergency-tag">🚨 24×7 Casualty</span>
            )}
            {hospital.isHfrVerified && (
              <span className="badge-verified flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> HFR Verified
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white font-display leading-tight mb-2">{hospital.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hospital.city}, {hospital.state}</span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {avgRating}
              {hospital.reviewCount && <span className="text-white/60"> ({hospital.reviewCount.toLocaleString()} reviews)</span>}
            </span>
            {hospital.bedCount && <span>🛏️ {hospital.bedCount.toLocaleString()} Beds</span>}
            {hospital.nhsEmrCode && <span className="text-white/60 font-mono text-xs">HFR: {hospital.nhsEmrCode}</span>}
          </div>
        </div>
      </div>

      {/* ── Quick Stats Bar ───────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Live capacity chips */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {hospital.bedsAvailable !== undefined && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs ${hospital.bedsAvailable > 20 ? 'bg-emerald-100 text-emerald-700' : hospital.bedsAvailable > 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  <Bed className="w-3.5 h-3.5" />
                  {hospital.bedsAvailable} Beds Free
                  <span className="live-dot ml-1" />
                </div>
              )}
              {hospital.icuBeds !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs">
                  <HeartPulse className="w-3.5 h-3.5" />
                  {hospital.icuBeds} ICU
                </div>
              )}
              {hospital.ambulances !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
                  <Ambulance className="w-3.5 h-3.5" />
                  {hospital.ambulances} Ambulances
                </div>
              )}
              <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {hospital.opdTimings || hospital.openingHours || 'Hours not listed'}
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2">
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
              {hospital.bookingAvailable && (
                <button onClick={() => setActiveTab('book')} className="btn-primary text-xs py-2">
                  <CalendarPlus className="w-3.5 h-3.5" /> Book OPD Token
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Tabs ──────────────────────────────────── */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl mb-8 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-navy-DEFAULT shadow-md'
                  : 'text-slate-500 hover:text-navy-DEFAULT hover:bg-white/60'
              }`}>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ──────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
            {/* Left — Info */}
            <div className="md:col-span-2 space-y-6">

              {/* Key Stats Grid */}
              <div className="stat-grid">
                {[
                  { icon: Bed,        label: 'Total Beds',    val: hospital.bedCount?.toLocaleString() ?? 'N/A',           color: 'text-blue-600',   bg: 'bg-blue-50'   },
                  { icon: Bed,        label: 'Beds Available',val: hospital.bedsAvailable?.toString() ?? 'N/A',             color: 'text-emerald-600',bg: 'bg-emerald-50'},
                  { icon: HeartPulse, label: 'ICU Beds',      val: hospital.icuBeds?.toString() ?? 'N/A',                  color: 'text-purple-600', bg: 'bg-purple-50' },
                  { icon: Ambulance,  label: 'Ambulances',    val: hospital.ambulances?.toString() ?? 'N/A',               color: 'text-teal-600',   bg: 'bg-teal-50'   },
                  { icon: IndianRupee,label: 'OPD Fee',        val: opdFeeDisplay,                                          color: 'text-saffron-600',bg: 'bg-amber-50'  },
                  { icon: Calendar,   label: 'Established',   val: hospital.established?.toString() ?? 'N/A',              color: 'text-navy-DEFAULT',bg: 'bg-slate-50' },
                ].map(({ icon: Icon, label, val, color, bg }) => (
                  <div key={label} className={`rounded-xl p-4 ${bg} border border-white shadow-sm`}>
                    <Icon className={`w-5 h-5 ${color} mb-1`} />
                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                    <p className={`font-bold ${color} capitalize text-sm`}>{val}</p>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="card">
                <h2 className="font-bold text-navy-DEFAULT font-display text-lg mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" /> About This Hospital
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{hospital.description}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className={`badge-${isGovt ? 'govt' : 'private'}`}>{isGovt ? '🏛️ Government' : '🏥 Private'}</span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-xs capitalize">{hospital.category.replace('-', ' ')}</span>
                  {hospital.accreditedBy && <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-medium text-xs">✅ {hospital.accreditedBy}</span>}
                </div>
              </div>

              {/* OPD Timings & Insurance */}
              <div className="card">
                <h2 className="font-bold text-navy-DEFAULT font-display text-lg mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-teal-600" /> OPD Info & Insurance
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-teal-50 rounded-xl p-4">
                    <p className="text-xs text-teal-600 font-semibold mb-1">OPD Timings</p>
                    <p className="font-bold text-navy-DEFAULT text-sm">{hospital.opdTimings || hospital.openingHours || 'Contact Hospital'}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-xs text-amber-600 font-semibold mb-1">OPD Fee</p>
                    <p className="font-bold text-navy-DEFAULT text-sm">{opdFeeDisplay}</p>
                  </div>
                </div>
                {hospital.insuranceSchemes && hospital.insuranceSchemes.length > 0 && (
                  <>
                    <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Accepted Insurance Schemes</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.insuranceSchemes.map(s => (
                        <span key={s} className={s.includes('PMJAY') || s.includes('Ayushman') ? 'badge-pmjay' : s.includes('CGHS') ? 'badge-cghs' : 'badge-state'}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Departments */}
              {hospital.departments && hospital.departments.length > 0 && (
                <div className="card">
                  <h2 className="font-bold text-navy-DEFAULT font-display text-lg mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-teal-600" /> Departments
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {hospital.departments.map(d => (
                      <div key={d} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5">
                        <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialties */}
              <div className="card">
                <h2 className="font-bold text-navy-DEFAULT font-display text-lg mb-4 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" /> Specialties
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-full text-sm font-medium bg-navy-DEFAULT/8 text-navy-DEFAULT border border-navy-DEFAULT/20"
                      style={{ background: 'rgba(30,58,138,0.07)' }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Mini map preview */}
              <div className="card p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                  <h2 className="font-bold text-navy-DEFAULT font-display text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-600" /> Location
                  </h2>
                </div>
                {hospital.lat && hospital.lng ? (
                  <HospitalMap hospitals={[hospital]} height="220px" singleHospital />
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">Map coordinates not available for this demo hospital.</p>
                  </div>
                )}
                <div className="p-4 bg-slate-50 text-sm text-slate-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{hospital.address}, {hospital.city}, {hospital.state} – {hospital.pincode}</span>
                </div>
              </div>
            </div>

            {/* Right — Sidebar */}
            <div className="space-y-4">

              {/* HFR Verification Card */}
              {hospital.isHfrVerified && (
                <div className="card bg-teal-50 border-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck className="w-5 h-5 text-teal-600" />
                    <h3 className="font-bold text-teal-800 font-display text-sm">HFR Verified Facility</h3>
                  </div>
                  <p className="text-xs text-teal-700 leading-relaxed">
                    This facility is registered under the National Health Authority's Health Facility Registry (HFR).
                  </p>
                  {hospital.nhsEmrCode && (
                    <p className="text-xs text-teal-600 font-mono mt-2 bg-white rounded px-2 py-1">{hospital.nhsEmrCode}</p>
                  )}
                </div>
              )}

              {/* Contact Info */}
              <div className="card">
                <h3 className="font-bold text-navy-DEFAULT font-display mb-4">Contact Info</h3>
                <div className="space-y-3">
                  {hospital.phone && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 bg-navy-DEFAULT/10 rounded-lg flex items-center justify-center"><Phone className="w-4 h-4 text-navy-DEFAULT" /></div>
                      <div><p className="text-xs text-slate-400">Phone</p><p className="text-sm font-medium text-slate-700">{hospital.phone}</p></div>
                    </div>
                  )}
                  {hospital.website && (
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-teal-50 transition-colors">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center"><Globe className="w-4 h-4 text-teal-600" /></div>
                      <div><p className="text-xs text-slate-400">Website</p><p className="text-sm font-medium text-teal-600">Official Website ↗</p></div>
                    </a>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-navy-DEFAULT/10 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-navy-DEFAULT" /></div>
                    <div><p className="text-xs text-slate-400">OPD Hours</p><p className="text-xs font-medium text-slate-700">{hospital.opdTimings || hospital.openingHours || 'Not available'}</p></div>
                  </div>
                </div>
              </div>

              {/* Booking Status */}
              <div className={`card border-2 ${hospital.bookingAvailable ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  {hospital.bookingAvailable
                    ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                    : <AlertCircle className="w-5 h-5 text-orange-500" />}
                  <h3 className="font-bold text-navy-DEFAULT font-display text-sm">
                    {hospital.bookingAvailable ? 'Online OPD Booking Available' : 'Online Booking Unavailable'}
                  </h3>
                </div>
                {hospital.bookingAvailable ? (
                  <button onClick={() => setActiveTab('book')} className="btn-primary w-full justify-center text-sm mt-2">
                    <CalendarPlus className="w-4 h-4" /> Book OPD Token
                  </button>
                ) : (
                  <p className="text-xs text-orange-700 mt-1">Online booking not available via MEDI SEVA 360 for this hospital. Contact the hospital directly.</p>
                )}
              </div>

              {/* Rating */}
              <div className="card">
                <h3 className="font-bold text-navy-DEFAULT font-display mb-3">Patient Rating</h3>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-black text-amber-500">{avgRating}</div>
                  <div>
                    <div className="flex mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">
                      {hospital.reviewCount ? `${hospital.reviewCount.toLocaleString()} ratings` : `${reviews.length} demo ratings`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="card bg-amber-50 border border-amber-200">
                <ShieldCheck className="w-5 h-5 text-amber-600 mb-2" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Demo Notice:</strong> This is fictional sample data. Not a real hospital listing. All contact details are masked or fictional.
                </p>
                <p className="text-xs text-amber-600 mt-1">Source: {hospital.dataSource} · Updated: {hospital.lastUpdated}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Map Tab ───────────────────────────────── */}
        {activeTab === 'map' && (
          <div className="animate-fade-in space-y-4">
            <div className="card p-4">
              <h2 className="font-bold text-navy-DEFAULT font-display text-lg mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" /> Live Map — {hospital.name}
              </h2>
              <p className="text-xs text-slate-400 mb-4">Powered by OpenStreetMap · Free · No API key required · Demo coordinates</p>
              <HospitalMap hospitals={[hospital]} height="500px" singleHospital />
              <div className="mt-4 flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2 text-sm text-slate-600 flex-1">
                  <MapPin className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span>{hospital.address}, {hospital.city}, {hospital.state} – {hospital.pincode}</span>
                </div>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
                  target="_blank" rel="noopener noreferrer" className="btn-teal text-sm shrink-0">
                  <Navigation className="w-4 h-4" /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Services Tab ──────────────────────────── */}
        {activeTab === 'services' && (
          <div className="animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospital.services.map(s => (
                <div key={s} className="card flex items-center gap-3 hover:border-teal-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="font-semibold text-navy-DEFAULT text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Reviews Tab ───────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in space-y-4">
            <div className="card bg-amber-50 border border-amber-200 mb-2">
              <p className="text-xs text-amber-800 font-medium">⚠️ All reviews below are fictional demo content for demonstration purposes only.</p>
            </div>

            {/* Rating Summary */}
            <div className="card flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-black text-amber-500">{avgRating}</div>
                <div className="flex mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">Demo Rating</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3,2,1].map(n => (
                  <div key={n} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-slate-500 text-right">{n}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${reviews.filter(r => r.rating === n).length / Math.max(reviews.length, 1) * 100}%` }} />
                    </div>
                    <span className="w-4 text-slate-400">{reviews.filter(r => r.rating === n).length}</span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length === 0 && (
              <div className="card text-center py-12">
                <Star className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500">No demo reviews for this hospital yet.</p>
              </div>
            )}
            {reviews.map(r => (
              <div key={r.id} className="card hover:border-teal-200 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-navy-DEFAULT to-teal-600">
                      {r.patientName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-navy-DEFAULT text-sm">{r.patientName}</p>
                      <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Book OPD Token Tab ────────────────────── */}
        {activeTab === 'book' && (
          <div className="animate-fade-in">
            {/* OPD timing banner */}
            {(hospital.opdTimings || hospital.openingHours) && (
              <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 mb-6">
                <Clock className="w-5 h-5 text-teal-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">OPD Timings</p>
                  <p className="text-sm font-bold text-teal-800">{hospital.opdTimings || hospital.openingHours}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">Fee</p>
                  <p className="text-sm font-bold text-teal-800">{opdFeeDisplay}</p>
                </div>
              </div>
            )}

            {hospital.bookingAvailable ? (
              <AppointmentForm
                hospitalId={hospital.id}
                hospitalName={hospital.name}
                specialties={hospital.specialties}
              />
            ) : (
              <div className="card text-center py-16 border-2 border-orange-200 bg-orange-50">
                <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="font-bold text-navy-DEFAULT font-display text-xl mb-2">Online Booking Not Available</h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                  Online booking is not available through MEDI SEVA 360 for this hospital. Please use the hospital's official booking channel or contact the hospital directly.
                </p>
                {hospital.phone && (
                  <p className="text-teal-700 font-semibold mt-4">📞 {hospital.phone}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
