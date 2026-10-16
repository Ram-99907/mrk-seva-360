import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English',  native: 'English',  flag: '🇬🇧' },
  { code: 'te', label: 'Telugu',   native: 'తెలుగు',   flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी',    flag: '🇮🇳' },
];

interface LanguageSwitcherProps {
  /** 'dark' for dashboard sidebars, 'light' for public navbar */
  variant?: 'dark' | 'light';
}

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [open, setOpen]   = useState(false);
  const ref               = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const isDark = variant === 'dark';

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
          ${isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.flag} {current.native}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => select(lang.code)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors text-left"
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{lang.native}</p>
                <p className="text-xs text-slate-500">{lang.label}</p>
              </div>
              {i18n.language === lang.code && (
                <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
