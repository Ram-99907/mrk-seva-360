import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, CheckCircle2, Info, Loader2,
  HeartPulse, Shield, Users, ClipboardList,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface PasswordStrength {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function checkPassword(pw: string): PasswordStrength {
  return {
    minLength: pw.length >= 8,
    hasUpper: /[A-Z]/.test(pw),
    hasLower: /[a-z]/.test(pw),
    hasNumber: /[0-9]/.test(pw),
    hasSpecial: /[^A-Za-z0-9]/.test(pw),
  };
}

const PW_HINTS: { key: keyof PasswordStrength; label: string }[] = [
  { key: 'minLength', label: 'At least 8 characters' },
  { key: 'hasUpper', label: 'One uppercase letter' },
  { key: 'hasLower', label: 'One lowercase letter' },
  { key: 'hasNumber', label: 'One number' },
  { key: 'hasSpecial', label: 'One special character' },
];

const BENEFITS = [
  { icon: HeartPulse, title: 'Find Hospitals Fast', desc: 'Search by city, specialty, or type across 12+ demo facilities.' },
  { icon: ClipboardList, title: 'Book OPD Tokens', desc: 'Request appointments and track status in real-time.' },
  { icon: Shield, title: 'Insurance Friendly', desc: 'Filter hospitals by PMJAY, CGHS, ESIC and more.' },
  { icon: Users, title: 'Family Health Hub', desc: 'Manage health coordination for your whole family.' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, authError, clearAuthError, isAuthenticated } = useAppStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const pwStrength = checkPassword(password);
  const pwValid = Object.values(pwStrength).every(Boolean);

  useEffect(() => {
    if (isAuthenticated) navigate('/patient/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError || localError) {
      clearAuthError();
      setLocalError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, phone, password, confirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!pwValid) {
      setLocalError('Password does not meet all requirements.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setLocalError('You must agree to the Privacy Notice and Terms of Service.');
      return;
    }

    const ok = await register(name.trim(), email.trim(), phone.trim(), password);
    if (ok) {
      navigate('/patient/dashboard', { replace: true });
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Benefits ──────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 bg-gradient-to-br from-navy-DEFAULT via-[#1e4a6e] to-[#0d9488] flex-col justify-between p-10 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.jpg" alt="Mediseva360" className="w-10 h-10 rounded-xl object-contain" />
            <div>
              <span className="text-white font-black text-xl font-display tracking-tight">MEDI SEVA <span className="text-amber-400">360</span></span>
              <p className="text-white/60 text-xs">भारत स्वास्थ्य पोर्टल</p>
            </div>
          </div>

          {/* Tricolor stripe */}
          <div className="flex mt-3 mb-8 rounded-full overflow-hidden" style={{ height: '4px', width: '120px' }}>
            <div className="flex-1 bg-[#FF9933]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#138808]" />
          </div>

          <h2 className="text-3xl font-black text-white font-display leading-tight mb-3">
            Join India's Unified Healthcare Portal
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Connect with hospitals across India, book OPD tokens, and manage your health in one place.
          </p>
        </div>

        {/* Benefits */}
        <div className="relative z-10 space-y-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">{title}</p>
                <p className="text-white/65 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-3xl font-black text-amber-400">12+</div>
            <div>
              <p className="font-bold text-white text-sm">hospitals</p>
              <p className="text-white/60 text-xs">Across 8 states · Free Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Register Form ────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f0f4ff] overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/logo.jpg" alt="Mediseva360" className="w-10 h-10 rounded-xl object-contain" />
            <span className="text-navy-DEFAULT font-black text-xl font-display">MEDI SEVA <span className="text-teal-600">360</span></span>
          </div>

          <h1 className="text-2xl font-black text-navy-DEFAULT font-display mb-1">Create Your Account</h1>
          <p className="text-slate-500 text-sm mb-6">Join as a patient — it's free and takes under a minute.</p>

          {/* Live Notice */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
            <Info size={15} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-blue-700 text-xs leading-relaxed">
              This creates a <strong>local demo account</strong>. Data is stored in browser session only — not transmitted to any server.
            </p>
          </div>

          {/* Error */}
          {displayError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-red-700 text-sm">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajesh Kumar"
                className="input-field mt-1"
                disabled={isLoading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field mt-1"
                disabled={isLoading}
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="phone" className="label">Mobile Number</label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="input-field mt-1"
                disabled={isLoading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="input-field pr-10"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Requirements */}
              {password.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {PW_HINTS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <CheckCircle2
                        size={12}
                        className={pwStrength[key] ? 'text-emerald-500' : 'text-slate-300'}
                      />
                      <span className={`text-xs ${pwStrength[key] ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="label">Confirm Password</label>
              <div className="relative mt-1">
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className={`input-field pr-10 ${
                    confirm.length > 0 && confirm !== password
                      ? 'border-red-400 focus:ring-red-300'
                      : ''
                  }`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirm.length > 0 && confirm !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
              )}
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-slate-300 text-navy-DEFAULT focus:ring-navy-DEFAULT cursor-pointer"
                />
              </div>
              <span className="text-sm text-slate-600 leading-snug group-hover:text-slate-800 transition-colors">
                I agree to the{' '}
                <span className="text-teal-600 hover:underline cursor-pointer">Privacy Notice</span>
                {' '}and{' '}
                <span className="text-teal-600 hover:underline cursor-pointer">Terms of Service</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !name.trim() || !email.trim() || !phone.trim() || !pwValid || password !== confirm || !agreed}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 py-3 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} MEDI SEVA 360 · Healthcare Platform · Not a real medical system
          </p>
        </div>
      </div>
    </div>
  );
}
