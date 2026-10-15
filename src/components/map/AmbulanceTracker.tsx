import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';

// ── Hospitals ───────────────────────────────────────────────────────────────
const HOSPITALS_PINS = [
  { name: 'RIMS Kadapa',             lat: 14.4673, lng: 78.8242, beds: 12 },
  { name: 'Govt General Hospital',   lat: 14.4726, lng: 78.8166, beds: 8  },
  { name: 'Rajiv Gandhi Hospital',   lat: 14.4790, lng: 78.8300, beds: 6  },
  { name: 'SVIMS Proddatur',         lat: 14.7502, lng: 78.5480, beds: 10 },
  { name: 'Proddatur Govt Hospital', lat: 14.7455, lng: 78.5525, beds: 5  },
  { name: 'Mydukur PHC',             lat: 14.6900, lng: 78.6540, beds: 3  },
  { name: 'Jammalamadugu Hosp',      lat: 14.8500, lng: 78.3850, beds: 4  },
  { name: 'Badvel Govt Hospital',    lat: 14.7480, lng: 79.0620, beds: 4  },
];

// ── 15 routes covering Kadapa district ─────────────────────────────────────
const ROUTES: [number, number][][] = [
  // AMB-001 Kadapa city center loop
  [[14.4673,78.8242],[14.4720,78.8180],[14.4780,78.8120],[14.4830,78.8200],
   [14.4780,78.8300],[14.4700,78.8320],[14.4650,78.8270],[14.4610,78.8210],[14.4673,78.8242]],
  // AMB-002 Kadapa west outskirts
  [[14.4726,78.8166],[14.4680,78.8100],[14.4620,78.8050],[14.4560,78.8090],
   [14.4530,78.8160],[14.4580,78.8230],[14.4640,78.8260],[14.4726,78.8166]],
  // AMB-003 Kadapa south loop
  [[14.4550,78.8300],[14.4500,78.8260],[14.4460,78.8200],[14.4490,78.8130],
   [14.4540,78.8080],[14.4600,78.8100],[14.4620,78.8180],[14.4580,78.8250],[14.4550,78.8300]],
  // AMB-004 Proddatur city loop
  [[14.7502,78.5480],[14.7540,78.5430],[14.7580,78.5390],[14.7610,78.5450],
   [14.7590,78.5530],[14.7540,78.5570],[14.7490,78.5540],[14.7470,78.5480],[14.7502,78.5480]],
  // AMB-005 Proddatur south
  [[14.7455,78.5525],[14.7410,78.5480],[14.7380,78.5430],[14.7410,78.5370],
   [14.7460,78.5340],[14.7500,78.5380],[14.7520,78.5450],[14.7455,78.5525]],
  // AMB-006 Kadapa north fast
  [[14.4790,78.8300],[14.4840,78.8250],[14.4870,78.8180],[14.4840,78.8110],
   [14.4780,78.8080],[14.4720,78.8110],[14.4700,78.8200],[14.4740,78.8290],[14.4790,78.8300]],
  // AMB-007 Mydukur zone
  [[14.6900,78.6540],[14.6940,78.6480],[14.6980,78.6420],[14.7020,78.6470],
   [14.7000,78.6560],[14.6950,78.6600],[14.6900,78.6540]],
  // AMB-008 Jammalamadugu route
  [[14.8500,78.3850],[14.8540,78.3790],[14.8590,78.3730],[14.8640,78.3800],
   [14.8610,78.3880],[14.8560,78.3920],[14.8500,78.3850]],
  // AMB-009 Badvel area
  [[14.7480,79.0620],[14.7520,79.0560],[14.7560,79.0510],[14.7600,79.0580],
   [14.7570,79.0660],[14.7520,79.0690],[14.7480,79.0620]],
  // AMB-010 Kadapa–Mydukur corridor
  [[14.5500,78.7700],[14.5700,78.7400],[14.5900,78.7200],[14.6200,78.7000],
   [14.6500,78.6800],[14.6700,78.6600],[14.6900,78.6540],[14.6500,78.6800],[14.5500,78.7700]],
  // AMB-011 Proddatur–Mydukur link
  [[14.7500,78.5480],[14.7350,78.5700],[14.7200,78.5900],[14.7050,78.6100],
   [14.6900,78.6300],[14.6900,78.6540],[14.7200,78.5900],[14.7500,78.5480]],
  // AMB-012 Kadapa east
  [[14.4650,78.8500],[14.4700,78.8600],[14.4750,78.8680],[14.4800,78.8600],
   [14.4760,78.8520],[14.4710,78.8460],[14.4650,78.8500]],
  // AMB-013 Rajampet area
  [[14.1900,79.1500],[14.1950,79.1440],[14.2000,79.1380],[14.2050,79.1450],
   [14.2020,79.1530],[14.1960,79.1570],[14.1900,79.1500]],
  // AMB-014 Pulivendula zone
  [[14.4250,78.2250],[14.4300,78.2180],[14.4360,78.2120],[14.4410,78.2200],
   [14.4380,78.2300],[14.4310,78.2340],[14.4250,78.2250]],
  // AMB-015 Kadapa–Proddatur highway
  [[14.5800,78.7000],[14.6000,78.6800],[14.6200,78.6600],[14.6400,78.6350],
   [14.6600,78.6100],[14.6800,78.5850],[14.7200,78.5650],[14.7455,78.5525],
   [14.7200,78.5650],[14.6800,78.5850],[14.6400,78.6350],[14.5800,78.7000]],
];

export type AmbStatus = 'available' | 'en-route' | 'on-call' | 'returning';

export interface AmbulanceUnit {
  id: string; name: string; driver: string; phone: string;
  status: AmbStatus; lat: number; lng: number; speed: number;
  routeIdx: number; waypointIdx: number; progress: number;
  trail: [number, number][]; destination?: string; eta?: string;
}

const INITIAL_AMBULANCES: AmbulanceUnit[] = [
  { id:'AMB-001', name:'MRK-K01', driver:'Ravi Kumar',       phone:'108', status:'en-route',  lat:ROUTES[0][0][0],  lng:ROUTES[0][0][1],  speed:62, routeIdx:0,  waypointIdx:0, progress:0, trail:[], destination:'RIMS Kadapa',            eta:'4 min' },
  { id:'AMB-002', name:'MRK-K02', driver:'Suresh Babu',      phone:'108', status:'available', lat:ROUTES[1][0][0],  lng:ROUTES[1][0][1],  speed:45, routeIdx:1,  waypointIdx:0, progress:0, trail:[], destination:undefined,                eta:undefined },
  { id:'AMB-003', name:'MRK-K03', driver:'Nagaraju',         phone:'108', status:'on-call',   lat:ROUTES[2][0][0],  lng:ROUTES[2][0][1],  speed:78, routeIdx:2,  waypointIdx:0, progress:0, trail:[], destination:'Pickup: Gandhinagar',      eta:'2 min' },
  { id:'AMB-004', name:'MRK-P04', driver:'Krishnaiah',       phone:'108', status:'available', lat:ROUTES[3][0][0],  lng:ROUTES[3][0][1],  speed:40, routeIdx:3,  waypointIdx:0, progress:0, trail:[], destination:undefined,                eta:undefined },
  { id:'AMB-005', name:'MRK-P05', driver:'Venkateswara',     phone:'108', status:'returning', lat:ROUTES[4][0][0],  lng:ROUTES[4][0][1],  speed:55, routeIdx:4,  waypointIdx:0, progress:0, trail:[], destination:'SVIMS Proddatur',         eta:'6 min' },
  { id:'AMB-006', name:'MRK-K06', driver:'Srinivasa Rao',    phone:'108', status:'en-route',  lat:ROUTES[5][0][0],  lng:ROUTES[5][0][1],  speed:70, routeIdx:5,  waypointIdx:0, progress:0, trail:[], destination:'Govt General',            eta:'3 min' },
  { id:'AMB-007', name:'MRK-M07', driver:'Tirupathi Reddy',  phone:'108', status:'available', lat:ROUTES[6][0][0],  lng:ROUTES[6][0][1],  speed:38, routeIdx:6,  waypointIdx:0, progress:0, trail:[], destination:undefined,                eta:undefined },
  { id:'AMB-008', name:'MRK-J08', driver:'Anjaneyulu',       phone:'108', status:'on-call',   lat:ROUTES[7][0][0],  lng:ROUTES[7][0][1],  speed:66, routeIdx:7,  waypointIdx:0, progress:0, trail:[], destination:'Jammalamadugu Hospital',  eta:'5 min' },
  { id:'AMB-009', name:'MRK-B09', driver:'Mallikarjuna',     phone:'108', status:'returning', lat:ROUTES[8][0][0],  lng:ROUTES[8][0][1],  speed:51, routeIdx:8,  waypointIdx:0, progress:0, trail:[], destination:'Badvel Govt Hospital',    eta:'7 min' },
  { id:'AMB-010', name:'MRK-C10', driver:'Gangadhara Rao',   phone:'108', status:'en-route',  lat:ROUTES[9][0][0],  lng:ROUTES[9][0][1],  speed:73, routeIdx:9,  waypointIdx:0, progress:0, trail:[], destination:'Mydukur PHC',             eta:'8 min' },
  { id:'AMB-011', name:'MRK-C11', driver:'Subramanyam',      phone:'108', status:'available', lat:ROUTES[10][0][0], lng:ROUTES[10][0][1], speed:42, routeIdx:10, waypointIdx:0, progress:0, trail:[], destination:undefined,                eta:undefined },
  { id:'AMB-012', name:'MRK-K12', driver:'Prasad Babu',      phone:'108', status:'en-route',  lat:ROUTES[11][0][0], lng:ROUTES[11][0][1], speed:58, routeIdx:11, waypointIdx:0, progress:0, trail:[], destination:'RIMS Kadapa',            eta:'5 min' },
  { id:'AMB-013', name:'MRK-R13', driver:'Chandrasekhar',    phone:'108', status:'on-call',   lat:ROUTES[12][0][0], lng:ROUTES[12][0][1], speed:60, routeIdx:12, waypointIdx:0, progress:0, trail:[], destination:'Pickup: Rajampet',        eta:'3 min' },
  { id:'AMB-014', name:'MRK-U14', driver:'Lakshmaiah',       phone:'108', status:'available', lat:ROUTES[13][0][0], lng:ROUTES[13][0][1], speed:35, routeIdx:13, waypointIdx:0, progress:0, trail:[], destination:undefined,                eta:undefined },
  { id:'AMB-015', name:'MRK-H15', driver:'Veeranjaneyulu',   phone:'108', status:'en-route',  lat:ROUTES[14][0][0], lng:ROUTES[14][0][1], speed:80, routeIdx:14, waypointIdx:0, progress:0, trail:[], destination:'Proddatur Govt Hospital', eta:'10 min' },
];

const STATUS_COLORS: Record<AmbStatus, string> = {
  'available': '#16a34a',
  'en-route':  '#dc2626',
  'on-call':   '#f59e0b',
  'returning': '#0d9488',
};
const STATUS_LABELS: Record<AmbStatus, string> = {
  'available': '✅ Available',
  'en-route':  '🚨 En Route',
  'on-call':   '📞 On Call',
  'returning': '↩️ Returning',
};

function makeAmbIcon(status: AmbStatus, selected: boolean) {
  const color = STATUS_COLORS[status];
  const size = selected ? 44 : 36;
  const pulse = (status === 'en-route' || status === 'on-call')
    ? `<span style="position:absolute;inset:-6px;border-radius:50%;border:3px solid ${color};opacity:0.5;animation:ambPulse 1.2s ease-in-out infinite;"></span>`
    : '';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:${size}px;height:${size}px">
        ${pulse}
        <div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};border:${selected ? 4 : 3}px solid white;
          box-shadow:0 4px 16px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
          font-size:${selected ? 20 : 16}px;
        ">🚑</div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2) - 6],
  });
}

const hospIcon = L.divIcon({
  className: '',
  html: `<div style="width:30px;height:30px;border-radius:6px;background:#1e3a8a;border:2px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:15px;">🏥</div>`,
  iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -18],
});

function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export default function AmbulanceTracker({ height = '600px' }: { height?: string }) {
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>(INITIAL_AMBULANCES);
  const [selected, setSelected] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAmbulances(prev => prev.map(amb => {
        const route = ROUTES[amb.routeIdx];
        const step = 0.010 + Math.random() * 0.008;
        let newProgress = amb.progress + step;
        let newWpIdx = amb.waypointIdx;
        if (newProgress >= 1) {
          newProgress = 0;
          newWpIdx = (amb.waypointIdx + 1) % route.length;
        }
        const from = route[newWpIdx] as [number, number];
        const to   = route[(newWpIdx + 1) % route.length] as [number, number];
        const [lat, lng] = lerp(from, to, newProgress);
        const trail: [number, number][] = [...amb.trail, [amb.lat, amb.lng] as [number, number]].slice(-14);
        return { ...amb, lat, lng, waypointIdx: newWpIdx, progress: newProgress, trail };
      }));
    }, 80);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div style={{ position: 'relative', height }}>
      <style>{`
        @keyframes ambPulse {
          0%,100% { transform:scale(1); opacity:0.6; }
          50%      { transform:scale(1.7); opacity:0; }
        }
      `}</style>

      <MapContainer
        center={[14.5500, 78.7000]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hospital markers */}
        {HOSPITALS_PINS.map(h => (
          <Marker key={h.name} position={[h.lat, h.lng]} icon={hospIcon}>
            <Popup>
              <div style={{ padding:'8px', minWidth:'160px' }}>
                <p style={{ fontWeight:700, fontSize:13, color:'#1e3a8a', marginBottom:4 }}>🏥 {h.name}</p>
                <p style={{ fontSize:12, color:'#64748b' }}>🛏️ {h.beds} bays available</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ambulance markers */}
        {ambulances.map(amb => {
          const isSelected = selected === amb.id;
          const color = STATUS_COLORS[amb.status];
          const icon = makeAmbIcon(amb.status, isSelected);
          return (
            <div key={amb.id}>
              {amb.trail.length > 1 && (
                <Polyline
                  positions={[...amb.trail, [amb.lat, amb.lng] as [number, number]]}
                  pathOptions={{ color, weight: isSelected ? 3 : 2, opacity: 0.45, dashArray:'4 6' }}
                />
              )}
              {isSelected && (
                <Circle
                  center={[amb.lat, amb.lng]} radius={400}
                  pathOptions={{ color, fillColor:color, fillOpacity:0.07, weight:1.5, opacity:0.4 }}
                />
              )}
              <Marker
                position={[amb.lat, amb.lng]}
                icon={icon}
                zIndexOffset={isSelected ? 1000 : 0}
                eventHandlers={{ click: () => setSelected(isSelected ? null : amb.id) }}
              >
                <Popup>
                  <div style={{ padding:'10px', minWidth:'210px', fontFamily:'Inter,sans-serif' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      <span style={{ fontSize:22 }}>🚑</span>
                      <div>
                        <p style={{ fontWeight:700, fontSize:14, color:'#1e293b', margin:0 }}>{amb.id} — {amb.name}</p>
                        <span style={{ display:'inline-block', background:color+'20', color, borderRadius:5, fontSize:11, fontWeight:700, padding:'2px 7px', marginTop:3 }}>
                          {STATUS_LABELS[amb.status]}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize:12, color:'#475569', lineHeight:1.8 }}>
                      <div>👤 <strong>{amb.driver}</strong></div>
                      <div>📞 Emergency: <strong>{amb.phone}</strong></div>
                      <div>⚡ Speed: <strong>{amb.speed} km/h</strong></div>
                      {amb.destination && <div>📍 → <strong>{amb.destination}</strong></div>}
                      {amb.eta && <div>⏱️ ETA: <strong style={{color:'#dc2626'}}>{amb.eta}</strong></div>}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
