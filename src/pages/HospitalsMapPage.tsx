import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, List, Map } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import HospitalMap from '../components/map/HospitalMap';
import { DEMO_HOSPITALS } from '../data/demoData';

export default function HospitalsMapPage() {
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = typeFilter ? DEMO_HOSPITALS.filter(h => h.type === typeFilter) : DEMO_HOSPITALS;
  const selected = selectedId ? DEMO_HOSPITALS.find(h => h.id === selectedId) : null;

  return (
    <PageLayout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-DEFAULT to-[#0d9488] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/hospitals" className="hover:text-white transition-colors">Hospitals</Link>
            <span>/</span>
            <span className="text-white">Map View</span>
          </div>
          <h1 className="text-3xl font-bold font-display">Hospital Map — India</h1>
          <p className="text-white/70 mt-2">
            Live interactive map of all {DEMO_HOSPITALS.length} hospitals. Click any marker for details.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            {[
              { val: '', label: 'All Hospitals' },
              { val: 'government', label: '🏛️ Government' },
              { val: 'private', label: '🏥 Private' },
            ].map(({ val, label }) => (
              <button key={val} onClick={() => setTypeFilter(val)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  typeFilter === val
                    ? 'bg-white text-navy-DEFAULT shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}>
                {label}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <Link to="/hospitals" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all">
                <List className="w-4 h-4" /> List View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Map + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6 flex-col lg:flex-row">

          {/* Map */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-slate-200" style={{ minHeight: '580px' }}>
            <HospitalMap
              hospitals={filtered}
              height="580px"
              onSelect={(id) => setSelectedId(id)}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-3 max-h-[580px] overflow-y-auto pr-1">
            <div className="sticky top-0 bg-white/95 backdrop-blur py-2 z-10">
              <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                <Map className="w-4 h-4 text-teal-600" /> {filtered.length} Hospitals
              </p>
            </div>
            {filtered.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  selectedId === h.id
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-navy-DEFAULT/30 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    h.type === 'government' ? 'bg-blue-100' : 'bg-emerald-100'
                  }`}>
                    <Building2 className={`w-5 h-5 ${h.type === 'government' ? 'text-blue-600' : 'text-emerald-600'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy-DEFAULT text-sm leading-tight mb-1 truncate">{h.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {h.city}, {h.state}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        h.type === 'government' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {h.type === 'government' ? 'Govt' : 'Private'}
                      </span>
                      {h.emergencyAvailable && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-600">🚨 Emergency</span>
                      )}
                      {h.isHfrVerified && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-100 text-teal-700">✓ HFR</span>
                      )}
                    </div>
                  </div>
                </div>
                {selectedId === h.id && (
                  <div className="mt-3 pt-3 border-t border-teal-200">
                    <Link
                      to={`/hospitals/${h.id}`}
                      className="btn-primary w-full justify-center text-xs py-2"
                      onClick={e => e.stopPropagation()}
                    >
                      View Details →
                    </Link>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected hospital detail strip */}
        {selected && (
          <div className="mt-6 card bg-gradient-to-r from-navy-DEFAULT/5 to-teal-600/5 border-teal-200">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div>
                <h3 className="font-bold text-navy-DEFAULT font-display">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.address}, {selected.city}</p>
              </div>
              <div className="flex gap-3">
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(selected.name + ' ' + selected.address)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-sm py-2"
                >
                  Get Directions
                </a>
                <Link to={`/hospitals/${selected.id}`} className="btn-primary text-sm py-2">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
