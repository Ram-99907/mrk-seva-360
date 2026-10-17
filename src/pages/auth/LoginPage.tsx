import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye, EyeOff, ShieldCheck, Building2, Users, User,
  Stethoscope, HeartPulse, ArrowRight, Phone,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const DEMO_ROLES = [
  {
    role: 'Patient',
    email: 'patient@mediseva',
    password: 'Medi@360',
    icon: User,
    color: 'border-[#1e3a8a]/30 bg-[#1e3a8a]/5 hover:border-[#1e3a8a]/60',
    iconColor: 'text-[#1e3a8a] bg-[#1e3a8a]/10',
    desc: 'Find hospitals, book appointments, track status',
  },
  {
    role: 'Receptionist',
    email: 'receptionist@mediseva',
    password: 'Medi@360',
    icon: Stethoscope,
    color: 'border-[#0d9488]/30 bg-[#0d9488]/5 hover:border-[#0d9488]/60',
    iconColor: 'text-[#0d9488] bg-[#0d9488]/10',
    desc: 'Manage OPD queue & appointment requests',
  },
  {
    role: 'Admin',
    email: 'admin@mediseva',
    password: 'Medi@360',
    icon: ShieldCheck,
    color: 'border-red-200 bg-red-50/50 hover:border-red-400',
    iconColor: 'text-red-600 bg-red-100',
    desc: 'System-wide hospital & user management',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError, isLoading, clearAuthError } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const returnTo = (location.state as any)?.returnTo || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    const ok = await login(email, password);
    if (ok) {
      const store = useAppStore.getState();
      const role = store.currentUser?.role;
      const dest = returnTo
        ? returnTo
        : role === 'admin' ? '/admin/dashboard'
        : role === 'receptionist' ? '/receptionist/dashboard'
        : '/patient/dashboard';
      navigate(dest, { replace: true });
    }
  };

  const fillCreds = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    clearAuthError();
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4ff' }}>
      {/* ── Left Hero Panel ─────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f2056 0%, #1e3a8a 50%, #0d9488 100%)' }}
      >
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3">
          <img src="/logo.jpg" alt="Mediseva360" className="size-10 shrink-0 rounded-lg object-contain" />
          <div>
            <p className="text-lg font-extrabold tracking-tight">MEDI SEVA <span className="text-[#0d9488]">360</span></p>
            <p className="text-xs text-white/60">Pan-India Healthcare Portal</p>
          </div>
        </Link>

        {/* Hero content */}
        <div className="relative space-y-6">
          <div>
            <p className="text-sm font-semibold text-[#fbbf24] mb-2 flex items-center gap-2">
              <ShieldCheck className="size-4" /> ABDM Integrated · HFR Verified
            </p>
            <h1 className="text-3xl font-extrabold leading-tight">
              One grid for every hospital, queue and ambulance in India.
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { val: '36',      label: 'States & UTs' },
              { val: '5.26L+',  label: 'Empaneled hospitals' },
              { val: '54,000+', label: 'Govt facilities' },
              { val: 'Free',    label: 'OPD booking' },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-white/8 p-3 ring-1 ring-white/15">
                <p className="font-mono text-xl font-bold">{s.val}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Emergency helplines */}
          <div className="flex flex-wrap gap-2">
            {[{ num: '112', label: 'Emergency' }, { num: '108', label: 'Ambulance' }, { num: '104', label: 'Health Helpline' }].map(h => (
              <a key={h.num} href={`tel:${h.num}`}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold ring-1 ring-red-400/30 hover:bg-red-500/30 transition-colors">
                <Phone className="size-3" /> {h.num} {h.label}
              </a>
            ))}
          </div>
        </div>

        {/* Tricolor stripe */}
        <div className="relative h-1 rounded-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #f59e0b 0% 33.3%, #ffffff 33.3% 66.6%, #059669 66.6% 100%)' }} />
      </div>

      {/* ── Right: Login Form ───────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/logo.jpg" alt="Mediseva360" className="size-8 rounded-lg object-contain" />
            <span className="text-lg font-extrabold text-[#1e3a8a]">MEDI SEVA <span className="text-[#0d9488]">360</span></span>
          </Link>

          <h2 className="text-2xl font-extrabold text-[#1e3a8a] mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to your portal</p>

          {/* Quick Login */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Quick Login — Select a role
            </p>
            <div className="grid gap-2">
              {DEMO_ROLES.map(({ role, email: e, password: p, icon: Icon, color, iconColor, desc }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillCreds(e, p)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${color} ${email === e ? 'ring-2 ring-offset-1 ring-[#1e3a8a]' : ''}`}
                >
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconColor}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700">{role}</p>
                    <p className="text-xs text-slate-500 truncate">{desc}</p>
                  </div>
                  <ArrowRight className="size-4 ml-auto shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-600">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="input-field h-11"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-600">Password</label>
                <button type="button" className="text-xs text-[#0d9488] hover:underline" tabIndex={-1}
                  onClick={() => alert('Live — use the credentials above')}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className="input-field h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {authError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {authError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-navy h-12 rounded-xl text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-5 flex flex-col items-center gap-3 text-sm text-slate-500">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-[#1e3a8a] font-semibold hover:underline">
                Register free
              </Link>
            </p>
            <Link to="/hospitals" className="text-slate-400 hover:text-slate-600 hover:underline text-xs">
              Continue as Guest — Browse hospitals without login →
            </Link>
          </div>

          {/* Notice */}
          <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700 text-center">
            🧪 <strong>Live</strong> — No real data is stored or transmitted.
          </div>
        </div>
      </div>
    </div>
  );
}
