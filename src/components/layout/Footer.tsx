import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, ShieldCheck, Heart, ArrowRight,
} from 'lucide-react';
import { EMERGENCY_HELPLINES } from '../../data/demoData';

// ─── Social icon SVGs (lucide doesn't have these) ────────────────────────────
function IconTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function IconYoutube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── Social links ────────────────────────────────────────────────────────────
const SOCIALS = [
  { icon: IconTwitter,   href: '#', label: 'Twitter'   },
  { icon: IconFacebook,  href: '#', label: 'Facebook'  },
  { icon: IconInstagram, href: '#', label: 'Instagram' },
  { icon: IconLinkedin,  href: '#', label: 'LinkedIn'  },
  { icon: IconYoutube,   href: '#', label: 'YouTube'   },
];

// ─── Nav columns ─────────────────────────────────────────────────────────────
const COLS = [
  {
    heading: 'Services',
    links: [
      { label: 'Find Hospitals',       to: '/hospitals' },
      { label: 'Live Hospital Map',    to: '/hospitals/map' },
      { label: 'Book OPD Appointment', to: '/hospitals' },
      { label: 'Emergency Services',   to: '/hospitals?emergency=true' },
      { label: 'Health Packages',      to: '/hospitals' },
      { label: 'Specialist Consult',   to: '/hospitals' },
    ],
  },
  {
    heading: 'For Patients',
    links: [
      { label: 'How It Works',          to: '/#how-it-works' },
      { label: 'Insurance Schemes',     to: '/hospitals?scheme=' },
      { label: 'Govt Hospitals',        to: '/hospitals?type=government' },
      { label: 'My Appointments',       to: '/patient/appointments' },
      { label: 'Patient Dashboard',     to: '/patient/dashboard' },
      { label: 'Register Free',         to: '/register' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'About MRK SEVA 360',   to: '/' },
      { label: 'Admin Portal',         to: '/admin/dashboard' },
      { label: 'Receptionist Portal',  to: '/receptionist/dashboard' },
      { label: 'Privacy Policy',       to: '/privacy' },
      { label: 'Terms of Service',     to: '/terms' },
      { label: 'Contact Us',           to: '/' },
    ],
  },
];

// ─── Trust badges ─────────────────────────────────────────────────────────────
const BADGES = [
  { label: 'ISO 9001:2015', sub: 'Certified' },
  { label: 'NABH',          sub: 'Accredited' },
  { label: 'NHA',           sub: 'Partner' },
  { label: 'HFR',           sub: 'Verified' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  }

  return (
    <footer className="bg-[#0f2056] text-white" aria-label="Site footer">
      {/* Tricolor stripe */}
      <div className="tricolor-stripe" aria-hidden="true" />

      {/* ── Emergency strip ── */}
      <div className="border-b border-white/10 bg-[#1e3a8a]/50 py-4">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#fbbf24]">
            🚨 24/7 Emergency Helplines
          </p>
          <div className="flex flex-wrap gap-2">
            {EMERGENCY_HELPLINES.map(h => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="flex items-center gap-1.5 rounded-md bg-red-500/20 px-2.5 py-1.5 text-xs font-bold ring-1 ring-red-400/30 hover:bg-red-500/30 transition-colors"
                aria-label={`Emergency: ${h.number} – ${h.label}`}
              >
                <Phone className="size-3" />
                <span className="font-mono">{h.number}</span>
                <span className="hidden sm:inline font-normal opacity-80">· {h.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Brand column — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 44 44" className="size-11 shrink-0" aria-hidden="true">
                <rect width="44" height="44" rx="10" fill="#1e3a8a" />
                <rect x="17" y="9"  width="10" height="26" rx="2.5" fill="#ffffff" />
                <rect x="9"  y="17" width="26" height="10" rx="2.5" fill="#ffffff" />
                <rect x="20" y="20" width="4"  height="4"  rx="1"   fill="#0d9488" />
              </svg>
              <div>
                <p className="text-lg font-extrabold tracking-tight leading-tight">
                  MRK SEVA <span className="text-[#0d9488]">360</span>
                </p>
                <p className="text-[11px] text-white/50 font-medium">Pan-India Healthcare Portal</p>
              </div>
            </div>

            <p className="text-sm text-white/60 leading-relaxed mb-5">
              A unified digital platform connecting patients to verified government and empanelled private hospitals across India. Powered by ABDM, HFR & NHA frameworks.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {BADGES.map(b => (
                <div
                  key={b.label}
                  className="flex flex-col items-center rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-center"
                >
                  <span className="text-[11px] font-extrabold text-[#fbbf24]">{b.label}</span>
                  <span className="text-[9px] text-white/50 font-medium">{b.sub}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 mb-6">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/60 hover:bg-[#0d9488] hover:text-white hover:border-[#0d9488] transition-all"
                >
                  <s.icon className="size-3.5" />
                </a>
              ))}
            </div>

            {/* Newsletter */}
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#0d9488]/40 bg-[#0d9488]/10 px-4 py-3 text-sm text-[#0d9488] font-medium">
                ✓ You're subscribed to health updates!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                  Health tips & updates
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] transition-all"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-lg bg-[#0d9488] px-3 py-2 text-sm font-semibold hover:bg-teal-600 transition-colors"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Nav columns */}
          {COLS.map(col => (
            <div key={col.heading}>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#fbbf24]">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-white/60 hover:text-white transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Download App + Demo Creds ── */}
        <div className="mt-10 border-t border-white/10 pt-8 grid gap-6 sm:grid-cols-2">
          {/* App download */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#fbbf24]">
              Download App
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Google Play */}
              <a
                href="#"
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors"
              >
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.33.19.71.22 1.07.09L15.5 12 4.25.15A1.4 1.4 0 0 0 3.18.06C2.55.4 2.16 1.08 2.16 1.9v20.2c0 .82.39 1.5 1.02 1.66z"/>
                  <path d="M19.65 10.22L17 8.73 13.83 12 17 15.27l2.65-1.49a1.9 1.9 0 0 0 0-3.56z"/>
                  <path d="M4.25.15l11.25 11.85L4.25 23.85"/>
                </svg>
                <div>
                  <p className="text-[9px] text-white/50">Get it on</p>
                  <p className="text-xs font-semibold">Google Play</p>
                </div>
              </a>
              {/* App Store */}
              <a
                href="#"
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors"
              >
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.79.03 3.02 2.65 4.03 2.68 4.04l-.07.29zM13 3.5C13.73 2.67 14.94 2.04 15.94 2c.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-[9px] text-white/50">Download on the</p>
                  <p className="text-xs font-semibold">App Store</p>
                </div>
              </a>
            </div>
          </div>

          {/* Demo Credentials */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#fbbf24]">
              Demo Credentials
            </p>
            <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
              {[
                { role: 'Patient',        email: 'patient@demo.mrkseva',      pass: 'Demo@123' },
                { role: 'Receptionist',   email: 'receptionist@demo.mrkseva', pass: 'Demo@123' },
                { role: 'Admin',          email: 'admin@demo.mrkseva',         pass: 'Demo@123' },
              ].map(c => (
                <div key={c.role} className="flex items-center gap-2 border-b border-white/10 pb-1.5 last:border-0 last:pb-0">
                  <span className="w-20 font-semibold text-white shrink-0">{c.role}</span>
                  <span className="text-white/50 font-mono truncate">{c.email}</span>
                  <span className="ml-auto text-white/40 font-mono shrink-0">{c.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10 py-5">
        <div className="mx-auto max-w-7xl px-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-white/40">
          <div className="flex flex-col gap-1">
            <p>© {new Date().getFullYear()} MRK SEVA 360. All rights reserved.</p>
            <p>
              All data shown is{' '}
              <strong className="font-semibold text-white/60">fictional demo data</strong>{' '}
              — not connected to real hospitals or real patients.
            </p>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-white/70 transition-colors">Terms of Service</Link>
            <Link to="/"        className="hover:text-white/70 transition-colors">Sitemap</Link>
            <span className="flex items-center gap-1">
              Made with <Heart className="size-3 text-red-400 fill-red-400" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
