/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1e3a8a',
          dark: '#0f2056',
          light: '#2d4fa0',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          foreground: '#ffffff',
        },
        saffron: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
          foreground: '#ffffff',
        },
        trust: {
          DEFAULT: '#0d9488',
          light: '#14b8a6',
          dark: '#0f766e',
          foreground: '#ffffff',
        },
        emergency: {
          DEFAULT: '#dc2626',
          light: '#ef4444',
          dark: '#b91c1c',
          foreground: '#ffffff',
        },
        teal: {
          DEFAULT: '#0d9488',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#059669',
          light: '#10b981',
          foreground: '#ffffff',
        },
        medical: {
          bg: '#f0f4ff',
          card: '#ffffff',
          text: '#1e293b',
          muted: '#64748b',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px 0 rgba(30,58,138,0.12)',
        nav: '0 1px 3px 0 rgba(0,0,0,0.08)',
        'glow-navy': '0 0 24px rgba(30,58,138,0.2)',
        'glow-trust': '0 0 24px rgba(13,148,136,0.2)',
        'glow-emergency': '0 0 24px rgba(220,38,38,0.2)',
        inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'ticker': 'ticker 35s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'flash': 'flash 2s ease infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        slideDown: {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f2056 0%, #1e3a8a 40%, #1a4394 70%, #0f766e 100%)',
        'hero-radial': 'radial-gradient(ellipse at top left, rgba(13,148,136,0.3) 0%, transparent 60%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
        'tricolor': 'linear-gradient(90deg, #f59e0b 0% 33.3%, #ffffff 33.3% 66.6%, #059669 66.6% 100%)',
        'navy-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #0f2056 100%)',
        'grid-dots': 'radial-gradient(rgba(30,58,138,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-dots': '20px 20px',
      },
    },
  },
  plugins: [],
};
