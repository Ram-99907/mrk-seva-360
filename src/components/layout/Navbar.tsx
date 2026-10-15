import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Phone, Menu, X, ChevronDown, LayoutDashboard, LogOut, User,
  Bell, Siren, Building2, Users, Shield, HeartPulse,
  Search, MapPin, Calendar, Stethoscope, Microscope,
  Heart, Brain, Bone, Eye, Baby,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { EMERGENCY_HELPLINES } from '../../data/demoData';

const SPECIALTIES_MENU = [
  { icon: Heart,       label: 'Cardiology',     link: '/hospitals?specialty=Cardiology' },
  { icon: Brain,       label: 'Neurology',      link: '/hospitals?specialty=Neurology' },
  { icon: Bone,        label: 'Orthopaedics',   link: '/hospitals?specialty=Orthopaedics' },
  { icon: Microscope,  label: 'Oncology',       link: '/hospitals?specialty=Oncology' },
  { icon: Eye,         label: 'Ophthalmology',  link: '/hospitals?specialty=Ophthalmology' },
  { icon: Baby,        label: 'Paediatrics',    link: '/hospitals?specialty=Paediatrics' },
  { icon: Stethoscope, label: 'General Medicine',link: '/hospitals?specialty=General+Medicine' },
  { icon: HeartPulse,  label: 'Pulmonology',    link: '/hospitals?specialty=Pulmonology' },
];

const getDashboardPath = (role: string) => {
  if (role === 'receptionist') return '/receptionist/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/patient/dashboard';
};

export default function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen]     = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQ, setSearchQ]           = useState('');

  const dropRef      = useRef<HTMLDivElement>(null);
  const specRef      = useRef<HTMLDivElement>(null);
  const searchRef    = useRef<HTMLInputElement>(null);
  const isHome = location.pathname === '/';

  /* Scroll + outside click effects */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setUserDropOpen(false);
      if (specRef.current && !specRef.current.contains(e.target as Node)) setSpecialtyOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setSpecialtyOpen(false); }, [location.pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  const handleLogout = () => { logout(); setUserDropOpen(false); navigate('/'); };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) { navigate(`/hospitals?q=${encodeURIComponent(searchQ)}`); setSearchOpen(false); setSearchQ(''); }
  };

  const unreadCount = useAppStore(s =>
    s.notifications.filter(n => !n.read && n.userId === s.currentUser?.id).length
  );

  /* Always solid white navbar — coloured text on every page */
  const navBg           = 'bg-white border-slate-200 shadow-md';
  const logoColor       = 'text-[#1e3a8a]';
  const logoSub         = 'text-slate-500';
  const linkColor       = 'text-slate-600 hover:text-[#1e3a8a] hover:bg-slate-100';
  const activeLinkColor = 'bg-[#1e3a8a]/8 text-[#1e3a8a] font-semibold';

  return (
    <>
      {/* â”€â”€â”€ Emergency Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="emergency-bar" role="region" aria-label="Emergency helplines">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2 scrollbar-none">
          <span className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <Siren className="size-4" /> <span className="hidden sm:inline">24/7 Emergency</span>
          </span>
          <ul className="flex items-center gap-2" role="list">
            {EMERGENCY_HELPLINES.map(h => (
              <li key={h.number}>
                <a href={`tel:${h.number}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-md bg-white/12 px-2.5 py-1 text-xs font-medium ring-1 ring-white/25 transition-colors hover:bg-white hover:text-red-700">
                  <Phone className="size-3" />
                  <span className="font-mono text-sm font-bold">{h.number}</span>
                  <span className="hidden whitespace-nowrap opacity-90 md:inline text-white/80">{h.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* â”€â”€â”€ Tricolor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="tricolor-stripe" aria-hidden="true" />

      {/* â”€â”€â”€ Main Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${navBg}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <svg viewBox="0 0 44 44" className="size-10 shrink-0">
              <rect width="44" height="44" rx="10" fill="#1e3a8a" />
              <rect x="17" y="9"  width="10" height="26" rx="2.5" fill="#ffffff" />
              <rect x="9"  y="17" width="26" height="10" rx="2.5" fill="#ffffff" />
              <rect x="20" y="20" width="4"  height="4"  rx="1"   fill="#0d9488" />
            </svg>
            <div className="min-w-0">
              <p className={`text-base font-extrabold tracking-tight leading-tight sm:text-lg transition-colors ${logoColor}`}>
                MRK SEVA <span className="text-[#0d9488]">360</span>
              </p>
              <p className={`hidden text-[10px] sm:block leading-tight transition-colors ${logoSub}`}>
                Pan-India Healthcare Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-all ${isActive ? activeLinkColor : linkColor}`}>
              Home
            </NavLink>

            {/* Specialties dropdown */}
            <div className="relative" ref={specRef}>
              <button
                onClick={() => setSpecialtyOpen(v => !v)}
                className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${linkColor}`}>
                Specialties <ChevronDown className={`size-3.5 transition-transform ${specialtyOpen ? 'rotate-180' : ''}`} />
              </button>
              {specialtyOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-slate-100 p-4 z-50 animate-slide-down">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Browse by Specialty</p>
                  <div className="grid grid-cols-2 gap-1">
                    {SPECIALTIES_MENU.map(({ icon: Icon, label, link }) => (
                      <Link key={label} to={link} onClick={() => setSpecialtyOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl p-2.5 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-all group">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center flex-shrink-0 transition-colors">
                          <Icon className="w-4 h-4 text-slate-500 group-hover:text-teal-600" />
                        </div>
                        <span className="font-medium text-xs">{label}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <Link to="/hospitals" onClick={() => setSpecialtyOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-navy-DEFAULT text-white text-xs font-bold hover:bg-[#0f2056] transition-colors">
                      View All Specialties â†’
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/hospitals"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-all ${isActive ? activeLinkColor : linkColor}`}>
              Find Hospitals
            </NavLink>

            <NavLink to="/hospitals/map"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-all ${isActive ? activeLinkColor : linkColor}`}>
              Live Map
            </NavLink>

            <NavLink to="/ambulance"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${isActive ? activeLinkColor : linkColor}`}>
              <span>🚑</span> Ambulance
            </NavLink>

            <NavLink to="/consult"
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-all ${isActive ? activeLinkColor : 'text-teal-600 hover:text-teal-700 hover:bg-teal-50'}`}>
              <span className="relative flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Video Consult
              </span>
            </NavLink>

            <a href="#packages"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all ${linkColor}`}>
              Health Packages
            </a>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">

            {/* Search button */}
            <button onClick={() => setSearchOpen(v => !v)}
              className={`rounded-full p-2 transition-all ${isHome && !scrolled ? 'text-white/80 hover:bg-white/15' : 'text-slate-500 hover:bg-slate-100'}`}>
              <Search className="size-4" />
            </button>

            {isAuthenticated && currentUser ? (
              <>
                <Link to={`/${currentUser.role}/notifications`}
                  className={`relative rounded-full p-2 transition-colors ${isHome && !scrolled ? 'text-white/80 hover:bg-white/15' : 'text-slate-500 hover:bg-slate-100'}`}>
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setUserDropOpen(v => !v)}
                    className={`flex items-center gap-2 rounded-full border px-2 py-1.5 text-sm font-medium shadow-sm transition-all ${
                      isHome && !scrolled
                        ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}>
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#1e3a8a] text-xs font-bold text-white">
                      {currentUser.avatarInitials || currentUser.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="hidden sm:block max-w-[120px] truncate">{currentUser.name}</span>
                    <ChevronDown className="size-4 shrink-0 opacity-60" />
                  </button>
                  {userDropOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-2xl z-50 animate-slide-down overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-navy-DEFAULT to-teal-600">
                        <p className="text-sm font-bold text-white">{currentUser.name}</p>
                        <p className="text-xs text-white/70 capitalize">{currentUser.role} Portal</p>
                      </div>
                      <div className="py-1">
                        <Link to={getDashboardPath(currentUser.role)} onClick={() => setUserDropOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <LayoutDashboard className="size-4 text-teal-500" /> Dashboard
                        </Link>
                        <Link to={`/${currentUser.role}/profile`} onClick={() => setUserDropOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <User className="size-4 text-slate-400" /> My Profile
                        </Link>
                        {currentUser.role === 'admin' && (
                          <Link to="/admin/dashboard" onClick={() => setUserDropOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                            <Shield className="size-4 text-slate-400" /> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-slate-100 py-1">
                        <button onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          <LogOut className="size-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isHome && !scrolled ? 'text-white/90 hover:bg-white/15' : 'text-slate-600 hover:bg-slate-100'
                  }`}>
                  Sign In
                </Link>
                <Link to="/book-appointment"
                  className="rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold px-4 py-2 text-sm transition-all shadow-lg hover:shadow-xl">
                  Book Appointment
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(v => !v)}
              className={`lg:hidden rounded-lg p-2 transition-colors ${
                isHome && !scrolled ? 'text-white hover:bg-white/15' : 'text-slate-500 hover:bg-slate-100'
              }`}>
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* â”€â”€ Global Search Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 animate-slide-down">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search hospitals, doctors, specialties, cityâ€¦"
                  className="flex-1 bg-transparent outline-none text-slate-800 text-sm placeholder-slate-400"
                />
                {searchQ && (
                  <button type="button" onClick={() => setSearchQ('')}>
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
              </div>
              <button type="submit"
                className="bg-navy-DEFAULT hover:bg-[#0f2056] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2">
                <X className="w-4 h-4" />
              </button>
            </form>
            <div className="max-w-2xl mx-auto mt-2 flex flex-wrap gap-2">
              {['Cardiology', 'AIIMS Delhi', 'Government Hospital', 'Mumbai'].map(s => (
                <button key={s} onClick={() => { setSearchQ(s); }}
                  className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 px-3 py-1 rounded-full transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* â”€â”€ Mobile Drawer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white animate-slide-down">
            <nav className="px-4 py-4 flex flex-col gap-1">
              {[
                { to: '/', label: 'Home', end: true },
                { to: '/hospitals', label: 'Find Hospitals' },
                { to: '/hospitals/map', label: 'Live Map' },
                { to: '/ambulance', label: '🚑 Ambulance Tracker' },
                { to: '/consult', label: '🟢 Video Consult' },
              ].map(link => (
                <NavLink key={link.label} to={link.to} end={link.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-[#1e3a8a]/8 text-[#1e3a8a] font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}>
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Specialties</p>
                <div className="grid grid-cols-2 gap-1">
                  {SPECIALTIES_MENU.slice(0, 6).map(({ icon: Icon, label, link }) => (
                    <Link key={label} to={link}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">
                      <Icon className="w-3.5 h-3.5 text-teal-600" /> {label}
                    </Link>
                  ))}
                </div>
              </div>

              {!isAuthenticated && (
                <div className="mt-3 flex gap-2">
                  <Link to="/login" className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-600">
                    Sign In
                  </Link>
                  <Link to="/book-appointment" className="flex-1 rounded-lg bg-[#f59e0b] py-2.5 text-center text-sm font-bold text-white">
                    Book Now
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}


