import React, { useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin, Search, Filter, X, Navigation, Phone, ShieldCheck, Clock,
  BedDouble, Ambulance, Building2, Building, ChevronRight, Map,
  LocateFixed, Crosshair, Star, SlidersHorizontal, RefreshCcw,
} from 'lucide-react';
import { DEMO_HOSPITALS, INDIAN_STATES, INSURANCE_SCHEMES, SPECIALTIES } from '../data/demoData';
import type { Hospital } from '../types';
import PageLayout from '../components/layout/PageLayout';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SCHEME_CLASS: Record<string, string> = {
  'PM-JAY (Ayushman Bharat)': 'badge-pmjay',
  'CGHS': 'badge-cghs',
  'ECHS': 'badge-cghs',
};

function schemeClass(scheme: string) {
  return SCHEME_CLASS[scheme] || 'badge-state';
}

function OpdFeeLabel({ fee }: { fee: Hospital['opdFee'] }) {
  if (fee === 'Free' || fee === undefined || fee === 0) {
    return <span className="text-lg font-bold tabular-nums text-[#0d9488]">Free</span>;
  }
  return <span className="text-lg font-bold tabular-nums text-[#1e3a8a]">₹{fee}</span>;
}

// ─── Hospital Card ────────────────────────────────────────────────────────────

function HospitalCard({ h }: { h: Hospital }) {
  const mapsUrl = h.lat && h.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(h.name + ' ' + h.city)}`;

  return (
    <article className="hospital-card">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {h.type === 'government' ? (
              <span className="badge-govt">Government</span>
            ) : (
              <span className="badge-private">Private</span>
            )}
            {h.isHfrVerified && (
              <span className="badge-verified">
                <ShieldCheck className="size-3" aria-hidden="true" />
                HFR Verified
              </span>
            )}
            {h.emergencyAvailable && (
              <span className="badge-emergency-tag">24×7 Casualty</span>
            )}
            {h.nhsEmrCode && (
              <span className="text-[10px] text-slate-400 font-mono">{h.nhsEmrCode}</span>
            )}
          </div>

          {/* Name */}
          <h3 className="mt-1.5 text-pretty text-base font-bold leading-snug text-[#1e3a8a]">
            {h.name}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {h.district}, {h.state}
          </p>
        </div>

        {/* OPD Fee */}
        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">OPD from</p>
          <OpdFeeLabel fee={h.opdFee} />
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <dl className="stat-grid">
        <div>
          <dt className="stat-grid dt"><Clock className="size-3" aria-hidden="true" />OPD</dt>
          <dd className="stat-grid dd">{h.opdTimings || h.openingHours || '—'}</dd>
        </div>
        <div>
          <dt className="stat-grid dt"><BedDouble className="size-3" aria-hidden="true" />Beds free</dt>
          <dd className="stat-grid dd">
            {h.bedsAvailable ?? '—'}
            {h.icuBeds !== undefined && (
              <span className="font-sans font-normal text-slate-500"> · ICU {h.icuBeds}</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="stat-grid dt"><Ambulance className="size-3" aria-hidden="true" />Ambulances</dt>
          <dd className="stat-grid dd">{h.ambulances ?? '—'}</dd>
        </div>
      </dl>

      {/* ── Departments ── */}
      {h.departments && h.departments.length > 0 && (
        <p className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Depts: </span>
          {h.departments.slice(0, 4).join(' · ')}
          {h.departments.length > 4 && ` +${h.departments.length - 4} more`}
        </p>
      )}

      {/* ── Insurance Schemes ── */}
      {h.insuranceSchemes && h.insuranceSchemes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {h.insuranceSchemes.map((s) => (
            <span key={s} className={`badge-scheme ${schemeClass(s)}`}>{s}</span>
          ))}
        </div>
      )}

      {/* ── Rating ── */}
      {h.rating && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                className={`size-3 ${i <= Math.round(h.rating!) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
              />
            ))}
          </div>
          <span className="font-semibold text-slate-700">{h.rating?.toFixed(1)}</span>
          <span className="text-slate-400">({h.reviewCount?.toLocaleString() ?? '0'} reviews)</span>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <Link
          to={`/hospitals/${h.id}?tab=book`}
          className="flex-1 btn-navy rounded-lg text-sm py-2"
        >
          Book OPD Token
        </Link>

        <Link
          to={`/hospitals/map?focus=${h.id}`}
          className="btn-outline rounded-lg px-3 py-2 text-sm"
          title="View on map"
        >
          <MapPin className="size-4" />
          <span className="sr-only sm:not-sr-only">Map</span>
        </Link>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-outline rounded-lg px-3 py-2 text-sm"
          title="Navigate with Google Maps"
        >
          <Navigation className="size-4" />
          <span className="sr-only sm:not-sr-only">Navigate</span>
        </a>

        {h.phone && (
          <a
            href={`tel:${h.phone}`}
            className="btn-outline rounded-lg px-3 py-2 text-sm"
            title={`Call ${h.name}`}
          >
            <Phone className="size-4" />
            <span className="sr-only">Call {h.name}</span>
          </a>
        )}
      </div>

      <Link
        to={`/hospitals/${h.id}`}
        className="text-xs text-[#1e3a8a] font-medium hover:underline text-center"
      >
        View full profile →
      </Link>
    </article>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HospitalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [nameQuery, setNameQuery] = useState(searchParams.get('q') || '');
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || '');
  const [districtFilter, setDistrictFilter] = useState(searchParams.get('district') || '');
  const [typeFilter, setTypeFilter] = useState<'' | 'government' | 'private'>(
    (searchParams.get('type') as '' | 'government' | 'private') || ''
  );
  const [schemeFilter, setSchemeFilter] = useState(searchParams.get('scheme') || '');
  const [specialtyFilter, setSpecialtyFilter] = useState(searchParams.get('specialty') || '');
  const [emergencyOnly, setEmergencyOnly] = useState(searchParams.get('emergency') === 'true');
  const [bookableOnly, setBookableOnly] = useState(searchParams.get('bookable') === 'true');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMsg, setLocationMsg] = useState('');

  // States derived from hospitals
  const availableStates = useMemo(() =>
    Array.from(new Set(DEMO_HOSPITALS.map(h => h.state))).sort(), []);
  const availableDistricts = useMemo(() =>
    stateFilter
      ? Array.from(new Set(DEMO_HOSPITALS.filter(h => h.state === stateFilter).map(h => h.district))).sort()
      : [],
    [stateFilter]);

  // Quick location demo spots
  const DEMO_LOCATIONS = [
    { label: 'YSR Kadapa, AP', state: 'Andhra Pradesh', district: 'YSR Kadapa' },
    { label: 'Hyderabad, TS', state: 'Telangana', district: 'Hyderabad' },
    { label: 'New Delhi', state: 'Delhi', district: '' },
    { label: 'Bengaluru, KA', state: 'Karnataka', district: 'Bengaluru Urban' },
    { label: 'Chennai, TN', state: 'Tamil Nadu', district: 'Chennai' },
    { label: 'Mumbai, MH', state: 'Maharashtra', district: 'Mumbai City' },
  ];

  // Filtering
  const filtered = useMemo(() => {
    return DEMO_HOSPITALS.filter(h => {
      if (nameQuery && !h.name.toLowerCase().includes(nameQuery.toLowerCase()) &&
          !h.city.toLowerCase().includes(nameQuery.toLowerCase()) &&
          !h.address.toLowerCase().includes(nameQuery.toLowerCase())) return false;
      if (stateFilter && h.state !== stateFilter) return false;
      if (districtFilter && h.district !== districtFilter) return false;
      if (typeFilter && h.type !== typeFilter) return false;
      if (schemeFilter && !h.insuranceSchemes?.includes(schemeFilter)) return false;
      if (specialtyFilter && !h.specialties.includes(specialtyFilter)) return false;
      if (emergencyOnly && !h.emergencyAvailable) return false;
      if (bookableOnly && !h.bookingAvailable) return false;
      return true;
    });
  }, [nameQuery, stateFilter, districtFilter, typeFilter, schemeFilter, specialtyFilter, emergencyOnly, bookableOnly]);

  const resetFilters = useCallback(() => {
    setNameQuery('');
    setStateFilter('');
    setDistrictFilter('');
    setTypeFilter('');
    setSchemeFilter('');
    setSpecialtyFilter('');
    setEmergencyOnly(false);
    setBookableOnly(false);
    setSearchParams({});
    setLocationMsg('');
  }, [setSearchParams]);

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setLocationMsg('Geolocation not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationMsg('Detecting your location…');
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationLoading(false);
        setLocationMsg('📍 Showing hospitals near your location.');
        // In a real app, would filter by actual distance
      },
      () => {
        setLocationLoading(false);
        setLocationMsg('⚠️ Unable to access location. Please allow browser permission.');
      },
      { timeout: 8000 }
    );
  };

  const hasFilters = nameQuery || stateFilter || districtFilter || typeFilter || schemeFilter || specialtyFilter || emergencyOnly || bookableOnly;

  return (
    <PageLayout>
      {/* ─── Page Header ─────────────────────────────────────── */}
      <section className="bg-[#1e3a8a] text-white" aria-labelledby="page-title">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fbbf24]">
              <ShieldCheck className="size-4" />
              HFR Verified Facility Registry · ABDM Integrated
            </p>
            <h1 id="page-title" className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Discover & Book Verified Hospitals
            </h1>
            <p className="max-w-xl text-base text-white/75 leading-relaxed">
              Filter from the national registry, search directly on the map, or share your live GPS location to find nearest facilities.
            </p>
          </div>

          {/* Stats */}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Building2, value: DEMO_HOSPITALS.filter(h => h.type === 'government').length, label: 'Govt Facilities' },
              { icon: Building, value: DEMO_HOSPITALS.filter(h => h.type === 'private').length, label: 'Empaneled Private' },
              { icon: BedDouble, value: DEMO_HOSPITALS.reduce((s, h) => s + (h.bedsAvailable ?? 0), 0), label: 'Beds Available' },
              { icon: Ambulance, value: DEMO_HOSPITALS.reduce((s, h) => s + (h.ambulances ?? 0), 0), label: 'Ambulances Ready' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/15">
                <Icon className="size-5 text-[#fbbf24]" aria-hidden="true" />
                <dd className="mt-2 font-mono text-2xl font-bold">{value}</dd>
                <dt className="mt-0.5 text-xs text-white/65">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className="tricolor-stripe" aria-hidden="true" />
      </section>

      {/* ─── Content ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">

          {/* ── Left Sidebar ─────────────────────────────────── */}
          <aside className="flex flex-col gap-4">

            {/* GPS Location Box */}
            <div className="rounded-xl border border-[#0d9488]/30 bg-[#f0fdfa] p-4">
              <button
                type="button"
                onClick={handleGPS}
                disabled={locationLoading}
                className="btn-teal w-full rounded-lg py-3 text-sm font-bold"
              >
                <LocateFixed className="size-4" aria-hidden="true" />
                {locationLoading ? 'Detecting…' : 'Share My Live Location'}
              </button>
              {locationMsg && (
                <p className="mt-2 text-xs text-[#0f766e]">{locationMsg}</p>
              )}
              <p className="mt-2 text-xs text-[#0f766e]">
                Finds HFR-verified hospitals within 10 km radius using browser GPS.
              </p>

              {/* Demo Spots */}
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#0f766e]/80">
                Quick Location Shortcuts
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {DEMO_LOCATIONS.map(loc => (
                  <button
                    key={loc.label}
                    type="button"
                    onClick={() => {
                      setStateFilter(loc.state);
                      setDistrictFilter(loc.district);
                    }}
                    className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium ring-1 ring-[#0d9488]/25 hover:ring-[#0d9488] text-[#0f766e] transition-all"
                  >
                    <Crosshair className="size-3 text-[#0d9488]" aria-hidden="true" />
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Registry Filters */}
            <form
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4"
              onSubmit={e => e.preventDefault()}
              aria-label="Hospital filters"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <SlidersHorizontal className="size-4 text-[#1e3a8a]" aria-hidden="true" />
                Registry Filters
              </p>

              {/* Name search */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-name" className="text-xs font-medium text-slate-500">Search by Name / City</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    id="f-name"
                    type="text"
                    value={nameQuery}
                    onChange={e => setNameQuery(e.target.value)}
                    placeholder="e.g. AIIMS, Cardiology…"
                    className="input-field pl-9"
                  />
                </div>
              </div>

              {/* State */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-state" className="text-xs font-medium text-slate-500">State / UT</label>
                <select
                  id="f-state"
                  value={stateFilter}
                  onChange={e => { setStateFilter(e.target.value); setDistrictFilter(''); }}
                  className="select-field"
                >
                  <option value="">All States & UTs</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              {availableDistricts.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-district" className="text-xs font-medium text-slate-500">District</label>
                  <select
                    id="f-district"
                    value={districtFilter}
                    onChange={e => setDistrictFilter(e.target.value)}
                    className="select-field"
                  >
                    <option value="">All Districts</option>
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Facility Type */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-type" className="text-xs font-medium text-slate-500">Facility Type</label>
                <select
                  id="f-type"
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as '' | 'government' | 'private')}
                  className="select-field"
                >
                  <option value="">Government + Private</option>
                  <option value="government">Government (AIIMS, GGH, CHC, PHC)</option>
                  <option value="private">Empaneled Private</option>
                </select>
              </div>

              {/* Insurance Scheme */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-scheme" className="text-xs font-medium text-slate-500">Insurance Scheme</label>
                <select
                  id="f-scheme"
                  value={schemeFilter}
                  onChange={e => setSchemeFilter(e.target.value)}
                  className="select-field"
                >
                  <option value="">Any Scheme</option>
                  {INSURANCE_SCHEMES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Specialty */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-specialty" className="text-xs font-medium text-slate-500">Specialty / Department</label>
                <select
                  id="f-specialty"
                  value={specialtyFilter}
                  onChange={e => setSpecialtyFilter(e.target.value)}
                  className="select-field"
                >
                  <option value="">All Specialties</option>
                  {SPECIALTIES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700">24×7 Emergency Only</p>
                  <p className="text-xs text-slate-400">Show only casualty facilities</p>
                </div>
                <input
                  type="checkbox"
                  checked={emergencyOnly}
                  onChange={e => setEmergencyOnly(e.target.checked)}
                  className="size-4 rounded accent-[#dc2626]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700">Online Booking Available</p>
                  <p className="text-xs text-slate-400">OPD token via MEDI SEVA 360</p>
                </div>
                <input
                  type="checkbox"
                  checked={bookableOnly}
                  onChange={e => setBookableOnly(e.target.checked)}
                  className="size-4 rounded accent-[#1e3a8a]"
                />
              </label>

              {hasFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <RefreshCcw className="size-3.5" />
                  Reset All Filters
                </button>
              )}
            </form>
          </aside>

          {/* ── Results Area ───────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Results header */}
            <div className="flex flex-wrap items-center justify-between gap-2" aria-live="polite">
              <p className="text-sm">
                <span className="font-bold text-[#1e3a8a]">{filtered.length}</span>{' '}
                <span className="text-slate-500">
                  verified {filtered.length === 1 ? 'facility' : 'facilities'}
                  {stateFilter ? ` in ${districtFilter ? districtFilter + ', ' : ''}${stateFilter}` : ''}
                </span>
              </p>
              <div className="flex gap-2">
                <Link
                  to="/hospitals/map"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                >
                  <Map className="size-3.5" />
                  View All on Map
                </Link>
              </div>
            </div>

            {/* Live sync indicator */}
            <div className="flex items-center gap-2 rounded-lg bg-[#0d9488]/8 border border-[#0d9488]/20 px-3 py-2 text-xs font-medium text-[#0f766e]">
              <span className="live-dot" aria-hidden="true" />
              <span>HFR Sync Active</span>
              <span className="text-[#0d9488]/60">·</span>
              <span>National Health Facility Registry · ABDM Integrated · Last synced: Today 12:00 IST</span>
            </div>

            {/* Cards Grid */}
            {filtered.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map(h => (
                  <HospitalCard key={h.id} h={h} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
                <Building2 className="size-12 text-slate-300 mb-3" aria-hidden="true" />
                <p className="text-base font-semibold text-slate-600">No facilities match your filters</p>
                <p className="mt-1 text-sm text-slate-400">Try removing some filters or selecting a different state.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 btn-navy rounded-lg px-4 py-2 text-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
