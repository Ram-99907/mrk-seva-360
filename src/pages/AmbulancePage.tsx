import { useState, useEffect } from 'react';
import { Ambulance, Radio, Phone, MapPin, Activity, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import AmbulanceTracker from '../components/map/AmbulanceTracker';

const STATS = [
  { label: 'Total Ambulances',   value: '15',   icon: Ambulance, color: 'bg-blue-50 text-blue-700',   border: 'border-blue-100' },
  { label: 'Available Now',      value: '5',    icon: Shield,    color: 'bg-green-50 text-green-700', border: 'border-green-100' },
  { label: 'En Route / On Call', value: '7',    icon: Activity,  color: 'bg-red-50 text-red-700',     border: 'border-red-100' },
  { label: 'Avg Response Time',  value: '4 min',icon: Radio,     color: 'bg-amber-50 text-amber-700', border: 'border-amber-100' },
];

const LEGEND = [
  { color: '#16a34a', label: 'Available' },
  { color: '#dc2626', label: 'En Route' },
  { color: '#f59e0b', label: 'On Call' },
  { color: '#0d9488', label: 'Returning' },
];

const ALERTS = [
  { id: 1, time: '17:31', msg: 'AMB-001 dispatched to MG Road pickup', type: 'red' },
  { id: 2, time: '17:28', msg: 'AMB-003 picked up patient — heading to RIMS', type: 'amber' },
  { id: 3, time: '17:25', msg: 'AMB-005 completed drop-off at SVIMS Proddatur', type: 'green' },
  { id: 4, time: '17:22', msg: 'AMB-006 dispatched to Srinivasa Nagar', type: 'red' },
  { id: 5, time: '17:19', msg: 'AMB-002 patrol resumed — Kadapa zone', type: 'green' },
];

export default function AmbulancePage() {
  const [time, setTime] = useState(new Date());
  const [alerts, setAlerts] = useState(ALERTS);
  const [callSent, setCallSent] = useState(false);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate new alerts every 20s
  useEffect(() => {
    const RANDOM_ALERTS = [
      'AMB-004 responded to emergency call in Proddatur East',
      'New request: Patient pickup near Kadapa Bus Stand',
      'AMB-002 is now en route to Govt General Hospital',
      'AMB-001 arrived at destination — offloading patient',
      'Emergency call received — dispatching nearest unit',
    ];
    let i = 0;
    const t = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      setAlerts(prev => [
        { id: Date.now(), time: timeStr, msg: RANDOM_ALERTS[i % RANDOM_ALERTS.length], type: ['red','amber','green'][i % 3] as any },
        ...prev.slice(0, 7),
      ]);
      i++;
    }, 20000);
    return () => clearInterval(t);
  }, []);

  const handleEmergencyCall = () => {
    setCallSent(true);
    setTimeout(() => setCallSent(false), 4000);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="bg-slate-900/80 border-b border-white/10 px-4 py-3 sticky top-0 z-10 backdrop-blur">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg">
                <Ambulance className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">Live Ambulance Tracker</h1>
                <p className="text-slate-400 text-xs">Kadapa &amp; Proddatur District — Simulation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-xs font-semibold">LIVE</span>
              </div>
              <span className="text-slate-400 text-sm font-mono tabular-nums">
                {time.toLocaleTimeString('en-IN')}
              </span>
              <button
                onClick={handleEmergencyCall}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-red-500/30 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                {callSent ? '📞 Dispatching...' : 'Call 108'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-5 space-y-5">

          {/* ── Notice ───────────────────────────────────────────── */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-xs">
              <strong>Simulation:</strong> Ambulance positions and movements are simulated. This is not a real dispatch system. For real emergencies, call <strong>108</strong>.
            </p>
          </div>

          {/* ── Stats row ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color} ${s.border} border`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl leading-none">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Map + Sidebar ──────────────────────────────────────────── */}
          <div className="grid lg:grid-cols-[1fr_300px] gap-4">

            {/* Map */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Legend overlay */}
              <div className="absolute bottom-4 left-4 z-[999] bg-slate-900/90 backdrop-blur rounded-xl px-3 py-2.5 border border-white/10">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Status</p>
                <div className="flex flex-col gap-1.5">
                  {LEGEND.map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                      <span className="text-white text-xs">{l.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-1 pt-1 border-t border-white/10">
                    <span className="text-lg">🏥</span>
                    <span className="text-white text-xs">Hospital</span>
                  </div>
                </div>
              </div>

              {/* Tap hint */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] bg-slate-900/80 backdrop-blur rounded-full px-3 py-1 border border-white/10">
                <p className="text-slate-300 text-[11px]">🚑 Click any ambulance for details</p>
              </div>

              <AmbulanceTracker height="520px" />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-3">

              {/* Live Alert Feed */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex-1">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-400" />
                    <span className="text-white font-semibold text-sm">Dispatch Feed</span>
                  </div>
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                </div>
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                  {alerts.map(a => (
                    <div key={a.id} className="px-4 py-3 flex gap-3 items-start hover:bg-white/5 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        a.type === 'red' ? 'bg-red-400' : a.type === 'amber' ? 'bg-amber-400' : 'bg-green-400'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-slate-300 text-xs leading-snug">{a.msg}</p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick emergency call card */}
              <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-white font-semibold text-sm">Emergency</span>
                </div>
                <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                  For real medical emergencies, call 108 immediately. Nearest ambulance will be dispatched.
                </p>
                <button
                  onClick={handleEmergencyCall}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  {callSent ? '✅ Dispatching nearest unit...' : '📞 Call 108 — Free Emergency'}
                </button>
                <div className="mt-3 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-500 text-[10px]">Covers Kadapa &amp; Proddatur districts</span>
                </div>
              </div>

              {/* Refresh note */}
              <div className="flex items-center gap-2 text-slate-500 text-xs px-1">
                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Positions update every 80ms (simulated)</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
