import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import type { Hospital } from '../../types';

// Fix default marker icons for Vite/Webpack bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored markers — navy for govt, teal for private
function createColoredIcon(color: string, emoji = '🏥') {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:${color};border:3px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,0.25);
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="transform:rotate(45deg);font-size:13px;">${emoji}</div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

const govIcon  = createColoredIcon('#1e3a8a', '🏛️');
const privIcon = createColoredIcon('#0d9488', '🏥');

// Auto-fit map to markers
function FitBounds({ hospitals }: { hospitals: Hospital[] }) {
  const map = useMap();
  const valid = hospitals.filter(h => h.lat && h.lng);
  if (valid.length > 0) {
    const bounds = L.latLngBounds(valid.map(h => [h.lat!, h.lng!]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }
  return null;
}

interface Props {
  hospitals: Hospital[];
  height?: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
  singleHospital?: boolean;
}

export default function HospitalMap({ hospitals, height = '500px', selectedId, onSelect, singleHospital = false }: Props) {
  const valid = hospitals.filter(h => h.lat && h.lng);
  const center: [number, number] = valid.length > 0
    ? [valid[0].lat!, valid[0].lng!]
    : [20.5937, 78.9629]; // Center of India

  if (valid.length === 0) {
    return (
      <div className="flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200" style={{ height }}>
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Map coordinates not available</p>
          <p className="text-slate-400 text-sm mt-1">Demo data — fictional locations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-card" style={{ height }}>
      <MapContainer center={center} zoom={singleHospital ? 14 : 5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={!singleHospital}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!singleHospital && <FitBounds hospitals={valid} />}

        {valid.map(h => (
          <Marker
            key={h.id}
            position={[h.lat!, h.lng!]}
            icon={h.type === 'government' ? govIcon : privIcon}
            eventHandlers={{ click: () => onSelect?.(h.id) }}
          >
            <Popup maxWidth={260}>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                    h.type === 'government' ? 'bg-[#1e3a8a]' : 'bg-[#0d9488]'
                  }`}>
                    {h.type === 'government' ? '🏛️ Govt' : '🏥 Private'}
                  </span>
                  <span className="text-xs text-amber-600 font-semibold">DEMO</span>
                  {h.isHfrVerified && <span className="text-xs text-teal-600 font-semibold">✓ HFR</span>}
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{h.name}</h3>
                <p className="text-slate-500 text-xs mb-1 flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-teal-500" />{h.address}
                </p>
                {h.bedsAvailable !== undefined && (
                  <p className="text-slate-500 text-xs mb-1">🛏️ {h.bedsAvailable} beds free</p>
                )}
                {(h.opdTimings || h.openingHours) && (
                  <p className="text-slate-500 text-xs mb-2">⏰ {h.opdTimings || h.openingHours}</p>
                )}
                <div className="flex gap-2">
                  <Link to={`/hospitals/${h.id}`}
                    className="flex-1 text-center text-xs font-semibold text-white py-1.5 rounded-lg bg-[#1e3a8a] hover:bg-[#0f2056] transition-colors">
                    View Details
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(h.name + ' ' + h.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-teal-700 border border-teal-200 px-2 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <Navigation className="w-3 h-3" /> Go
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
