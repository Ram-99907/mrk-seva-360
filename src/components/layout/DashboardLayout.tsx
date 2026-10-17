import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, LogOut, Bell, Menu, ChevronLeft, Home } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface SidebarItem {
  label: string;
  icon: string;
  href: string;
  badge?: number | string;
}

interface Props {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  userRole?: string;
}

// Role color map
const ROLE_COLORS: Record<string, { badge: string; dot: string }> = {
  admin:       { badge: 'bg-red-500/20 text-red-300', dot: '#ef4444' },
  receptionist:{ badge: 'bg-[#0d9488]/20 text-[#0d9488]', dot: '#0d9488' },
  patient:     { badge: 'bg-[#fbbf24]/20 text-[#fbbf24]', dot: '#fbbf24' },
};

export default function DashboardLayout({ children, sidebarItems, headerTitle, headerSubtitle }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, getUnreadCount } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unread = currentUser ? getUnreadCount(currentUser.id) : 0;
  const roleColor = ROLE_COLORS[currentUser?.role || 'patient'] || ROLE_COLORS.patient;

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <svg viewBox="0 0 44 44" className="size-9 shrink-0" aria-hidden="true">
            <rect width="44" height="44" rx="10" fill="rgba(255,255,255,0.12)" />
            <rect x="17" y="9" width="10" height="26" rx="2.5" fill="#ffffff" />
            <rect x="9" y="17" width="26" height="10" rx="2.5" fill="#ffffff" />
            <rect x="20" y="20" width="4" height="4" rx="1" fill="#0d9488" />
          </svg>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-white">
              MEDI SEVA <span className="text-[#0d9488]">360</span>
            </p>
            <p className="text-[10px] text-white/40">Healthcare Portal</p>
          </div>
        </Link>
      </div>

      {/* User Card */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3 rounded-xl bg-white/8 px-3 py-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold shadow"
            style={{ background: 'linear-gradient(135deg, #1e3a8a, #0d9488)' }}
          >
            {currentUser?.avatarInitials || currentUser?.name?.[0] || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
            <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full ${roleColor.badge}`}>
              {currentUser?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto" aria-label="Sidebar navigation">
        {sidebarItems.map(item => {
          const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Circle;
          const isActive = location.pathname === item.href;
          const itemUnread = item.icon === 'Bell' ? unread : (Number(item.badge) || 0);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon className={`size-4 flex-shrink-0 ${isActive ? 'text-[#fbbf24]' : 'text-white/50'}`} />
              <span>{item.label}</span>
              {itemUnread > 0 && (
                <span className="ml-auto flex items-center justify-center size-5 rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {itemUnread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className="sidebar-item"
        >
          <Home className="size-4 text-white/50" />
          <span>Back to Homepage</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-item w-full text-left text-red-400 hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#f0f4ff' }}>
      {/* Notice Banner */}
      <div className="relative z-50 bg-amber-50 border-b border-amber-200 py-1.5 px-4 text-center text-xs font-medium text-amber-800">
        🧪 <strong>Live</strong> — All data is fictional. Not connected to real hospitals or medical systems.
      </div>

      <div className="flex min-h-[calc(100vh-30px)]">
        {/* ── Desktop Sidebar ─────────────────────────── */}
        <aside
          className="hidden lg:flex flex-col w-60 fixed top-[30px] bottom-0 left-0 overflow-y-auto z-30"
          style={{ background: 'linear-gradient(180deg, #0f2056 0%, #1e3a8a 60%, #0f766e 100%)' }}
        >
          <SidebarContent />
        </aside>

        {/* ── Mobile Overlay ───────────────────────────── */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside
              className="absolute left-0 top-0 bottom-0 w-64 z-10 flex flex-col"
              style={{ background: 'linear-gradient(180deg, #0f2056 0%, #1e3a8a 60%, #0f766e 100%)' }}
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="text-white font-bold text-sm">Menu</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-white/60 hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* ── Main Content ─────────────────────────────── */}
        <div className="flex-1 lg:ml-60 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-[30px] z-20 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3.5">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </button>

                <div>
                  <h1 className="text-base font-bold text-[#1e3a8a] leading-tight">
                    {headerTitle || 'Dashboard'}
                  </h1>
                  <p className="text-xs text-slate-400 hidden sm:block">
                    {headerSubtitle || `Welcome back, ${currentUser?.name?.split(' ')[0]}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Link
                  to={`/${currentUser?.role}/notifications`}
                  className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#1e3a8a] transition-colors"
                  aria-label={`${unread} unread notifications`}
                >
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Link>

                {/* Language switcher */}
                <LanguageSwitcher />

                {/* Back to site */}
                <Link
                  to="/"
                  className="hidden sm:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-[#1e3a8a] transition-colors border border-slate-200"
                >
                  <ChevronLeft className="size-3.5" />
                  Site
                </Link>

                {/* Avatar */}
                <div
                  className="flex size-8 items-center justify-center rounded-full text-white text-xs font-bold shadow"
                  style={{ background: 'linear-gradient(135deg, #1e3a8a, #0d9488)' }}
                  aria-hidden="true"
                >
                  {currentUser?.avatarInitials || currentUser?.name?.[0] || 'U'}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
