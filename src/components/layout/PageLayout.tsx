import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import DemoBanner from '../ui/DemoBanner';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function PageLayout({ children, showFooter = true }: PageLayoutProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-medical-bg">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}

      {/* ── Floating Book Appointment button ── */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          scrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <Link
          to="/hospitals"
          className="flex items-center gap-2 rounded-full bg-[#f59e0b] px-5 py-3 text-sm font-bold text-white shadow-2xl hover:bg-[#d97706] hover:scale-105 active:scale-95 transition-all"
          aria-label="Book an Appointment"
        >
          <CalendarPlus className="size-5" />
          <span>Book Appointment</span>
        </Link>
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#f59e0b]/30 animate-ping" aria-hidden="true" />
      </div>
    </div>
  );
}
