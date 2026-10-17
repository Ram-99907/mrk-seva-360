import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Calendar, ChevronRight, Star, ShieldCheck, Building2,
  Stethoscope, Heart, Microscope, BedDouble, Ambulance, Clock,
  Phone, Users, Award, ArrowRight, HeartPulse, CalendarPlus,
  ChevronLeft, Play, CheckCircle, Download, Smartphone,
  BadgeCheck, Video, Newspaper, Package, LocateFixed, X, Trash2,
} from 'lucide-react';
import { DEMO_HOSPITALS } from '../data/demoData';
import PageLayout from '../components/layout/PageLayout';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { saveVideoBlob, loadVideoBlob, clearVideoBlob } from '../utils/videoDB';

// ─── Hero Slides ───────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1600&q=80&auto=format&fit=crop',
    title: 'World-Class Healthcare,\nClose to Home',
    subtitle: 'Book OPD appointments at 700+ verified hospitals across India. No queues, no wait.',
    cta: 'Book Appointment',
    ctaLink: '/hospitals',
    badge: '🏥 HFR Verified Network',
  },
  {
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80&auto=format&fit=crop',
    title: 'Expert Doctors,\nInstant Access',
    subtitle: 'Connect with 15,000+ specialists across Cardiology, Oncology, Neurology & more.',
    cta: 'Find a Doctor',
    ctaLink: '/hospitals',
    badge: '👨‍⚕️ 15,000+ Specialists',
  },
  {
    image: 'https://images.unsplash.com/photo-1588776814546-1ffbb172f6bb?w=1600&q=80&auto=format&fit=crop',
    title: 'Emergency Care,\n24×7 Ready',
    subtitle: 'Round-the-clock emergency services. ICU, trauma, and casualty — always operational.',
    cta: 'Find Emergency Care',
    ctaLink: '/hospitals?emergency=true',
    badge: '🚨 24×7 Casualty',
  },
];

// ─── Specialties ───────────────────────────────────────────────────────────────
const SPECIALTIES = [
  { name: 'Cardiology',      emoji: '❤️',  img: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&q=80&auto=format&fit=crop', color: 'from-red-500 to-rose-600' },
  { name: 'Neurology',       emoji: '🧠',  img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80&auto=format&fit=crop', color: 'from-purple-500 to-violet-600' },
  { name: 'Orthopaedics',    emoji: '🦴',  img: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=400&q=80&auto=format&fit=crop', color: 'from-blue-500 to-indigo-600' },
  { name: 'Oncology',        emoji: '🔬',  img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80&auto=format&fit=crop', color: 'from-teal-500 to-cyan-600' },
  { name: 'Gynaecology',     emoji: '👶',  img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80&auto=format&fit=crop', color: 'from-pink-500 to-rose-500' },
  { name: 'Ophthalmology',   emoji: '👁️',  img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80&auto=format&fit=crop', color: 'from-sky-500 to-blue-500' },
  { name: 'Gastroenterology',emoji: '🫁',  img: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&q=80&auto=format&fit=crop', color: 'from-amber-500 to-orange-500' },
  { name: 'Urology',         emoji: '💊',  img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80&auto=format&fit=crop', color: 'from-navy-DEFAULT to-blue-700' },
  { name: 'Paediatrics',     emoji: '🧒',  img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&q=80&auto=format&fit=crop', color: 'from-green-500 to-emerald-600' },
  { name: 'Dermatology',     emoji: '🌿',  img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop', color: 'from-lime-500 to-green-500' },
  { name: 'Radiology',       emoji: '📡',  img: 'https://images.unsplash.com/photo-1516069677018-378515003435?w=400&q=80&auto=format&fit=crop', color: 'from-slate-600 to-slate-800' },
  { name: 'Pulmonology',     emoji: '🫀',  img: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=400&q=80&auto=format&fit=crop', color: 'from-cyan-500 to-teal-600' },
];

// ─── Doctors ──────────────────────────────────────────────────────────────────
const DOCTORS = [
  {
    name: 'Dr. Priya Mehta',        specialty: 'Senior Cardiologist',       exp: '22 yrs',
    hospital: 'AIIMS New Delhi',     rating: 4.9, reviews: 2340,
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&auto=format&fit=crop&face',
    available: 'Mon–Fri, 10 AM–2 PM',
  },
  {
    name: 'Dr. Arjun Sharma',       specialty: 'Neuro Surgeon',             exp: '18 yrs',
    hospital: 'Apollo Delhi',        rating: 4.8, reviews: 1870,
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80&auto=format&fit=crop',
    available: 'Tue–Sat, 9 AM–1 PM',
  },
  {
    name: 'Dr. Kavitha Nair',       specialty: 'Gynaecologist & Obstetrician', exp: '15 yrs',
    hospital: 'Fortis Mumbai',       rating: 4.9, reviews: 3100,
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80&auto=format&fit=crop',
    available: 'Mon–Thu, 11 AM–3 PM',
  },
  {
    name: 'Dr. Rajan Patel',        specialty: 'Orthopaedic Surgeon',       exp: '20 yrs',
    hospital: 'Medanta Gurugram',    rating: 4.7, reviews: 1560,
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop&face',
    available: 'Wed–Sun, 2 PM–6 PM',
  },
];

// ─── Health Packages ──────────────────────────────────────────────────────────
const PACKAGES = [
  {
    name: 'Basic Health Check',
    price: 799, originalPrice: 1500,
    img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80&auto=format&fit=crop',
    tests: ['CBC', 'Blood Sugar', 'Lipid Profile', 'Urine Analysis', 'ECG'],
    tag: 'Most Popular',
    tagColor: 'bg-emerald-500',
  },
  {
    name: 'Cardiac Wellness',
    price: 2499, originalPrice: 5000,
    img: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&q=80&auto=format&fit=crop',
    tests: ['ECG', 'Echo', 'Lipid Profile', 'Treadmill Test', 'Chest X-Ray', '2D Echo'],
    tag: 'Heart Care',
    tagColor: 'bg-red-500',
  },
  {
    name: "Women's Wellness",
    price: 1999, originalPrice: 3800,
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80&auto=format&fit=crop',
    tests: ['Pap Smear', 'Mammography', 'Thyroid', 'Vitamin D', 'Bone Density'],
    tag: 'For Women',
    tagColor: 'bg-pink-500',
  },
  {
    name: 'Diabetes Care Pack',
    price: 1299, originalPrice: 2600,
    img: 'https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=600&q=80&auto=format&fit=crop',
    tests: ['HbA1c', 'Fasting Glucose', 'Kidney Profile', 'Urine Microalbumin', 'Eye Check'],
    tag: 'Diabetes',
    tagColor: 'bg-amber-500',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Suresh Babu',       city: 'Chennai',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop',
    rating: 5, date: 'Oct 2026',
    text: 'Booked an OPD token for my father in minutes. No queue, no hassle. The bed availability feature helped us choose the right hospital for his cardiac procedure.',
    hospital: 'Apollo Chennai',
  },
  {
    name: 'Meena Kumari',      city: 'Lucknow',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop',
    rating: 5, date: 'Sep 2026',
    text: 'MEDI SEVA 360 showed me which government hospitals accept PMJAY near me. Saved us thousands of rupees. The insurance filter is a lifesaver!',
    hospital: 'KGMU Lucknow',
  },
  {
    name: 'Arif Khan',         city: 'Hyderabad',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop',
    rating: 5, date: 'Oct 2026',
    text: 'During an emergency I found the nearest hospital with ICU beds available in 30 seconds. The GPS finder is incredibly accurate.',
    hospital: 'NIMS Hyderabad',
  },
];

// ─── News ─────────────────────────────────────────────────────────────────────
const NEWS = [
  {
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&auto=format&fit=crop',
    category: 'Health Tips', date: 'Oct 14, 2026',
    title: '10 Early Warning Signs of Heart Disease You Should Never Ignore',
    excerpt: 'Cardiologists reveal the subtle symptoms that most people overlook until it is too late.',
  },
  {
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=600&q=80&auto=format&fit=crop',
    category: 'Cancer Care', date: 'Oct 12, 2026',
    title: 'New Immunotherapy Protocol Shows 78% Success Rate in Stage 3 Lung Cancer',
    excerpt: 'Indian oncologists achieve breakthrough results with combined immunotherapy-targeted approach.',
  },
  {
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80&auto=format&fit=crop',
    category: 'Neurology', date: 'Oct 10, 2026',
    title: 'AI-Assisted Brain Surgery: How Robots Are Transforming Neurosurgery in India',
    excerpt: 'Hospitals across India adopt robotic neurosurgery platforms, cutting recovery times by 40%.',
  },
];

// ─── Locations ────────────────────────────────────────────────────────────────
const LOCATIONS = [
  { city: 'New Delhi',   hospitals: 312, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80&auto=format&fit=crop', state: 'Delhi' },
  { city: 'Mumbai',      hospitals: 489, img: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=80&auto=format&fit=crop', state: 'Maharashtra' },
  { city: 'Bengaluru',   hospitals: 367, img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80&auto=format&fit=crop', state: 'Karnataka' },
  { city: 'Chennai',     hospitals: 298, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80&auto=format&fit=crop', state: 'Tamil Nadu' },
  { city: 'Hyderabad',   hospitals: 275, img: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&q=80&auto=format&fit=crop', state: 'Telangana' },
  { city: 'Kolkata',     hospitals: 341, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop', state: 'West Bengal' },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '5,200+', label: 'Verified Hospitals',   icon: Building2 },
  { value: '15,000+', label: 'Expert Doctors',      icon: Stethoscope },
  { value: '2.8 Cr+', label: 'Patients Served',     icon: Users },
  { value: '36',      label: 'States & UTs Covered', icon: MapPin },
  { value: '24×7',    label: 'Emergency Support',   icon: Ambulance },
  { value: '98.4%',   label: 'Patient Satisfaction', icon: Award },
];

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ onClose }: { onClose: () => void }) {
  const [videoUrl, setVideoUrl]     = useState<string | null>(null);
  const [hasPublic, setHasPublic]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null); // track for cleanup

  /* 1️⃣ On mount: try to restore video from IndexedDB, then check /story-video.mp4 */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const blob = await loadVideoBlob();
        if (blob && !cancelled) {
          const url = URL.createObjectURL(blob);
          blobUrlRef.current = url;
          setVideoUrl(url);
          return; // IndexedDB has a video — done
        }
      } catch { /* ignore */ }
      // Fallback: check if /story-video.mp4 exists in public/
      if (!cancelled) {
        fetch('/story-video.mp4', { method: 'HEAD' })
          .then(r => { if (r.ok && !cancelled) setHasPublic(true); })
          .catch(() => {});
      }
    })();
    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  /* Show toast for 3 seconds */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* 2️⃣ Handle file upload — save to IndexedDB */
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      await saveVideoBlob(file);
      // revoke old url if any
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      const url = URL.createObjectURL(file);
      blobUrlRef.current = url;
      setVideoUrl(url);
      showToast('✅ Video saved! Will appear here even after refresh.');
    } catch {
      showToast('❌ Could not save video. Try a smaller file.');
    } finally {
      setSaving(false);
    }
  };

  /* 3️⃣ Remove saved video */
  const handleRemove = async () => {
    await clearVideoBlob().catch(() => {});
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setVideoUrl(null);
    showToast('🗑️ Video removed.');
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 transition-all">
          <X className="w-5 h-5" />
        </button>

        {/* Toast notification */}
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
            {toast}
          </div>
        )}

        {/* Video player */}
        <div className="aspect-video">
          {videoUrl ? (
            /* IndexedDB-restored or newly uploaded video */
            <video src={videoUrl} autoPlay controls className="w-full h-full object-cover" />
          ) : hasPublic ? (
            /* Pre-placed video in public/story-video.mp4 */
            <video src="/story-video.mp4" autoPlay controls className="w-full h-full object-cover" />
          ) : (
            /* Default YouTube embed */
            <iframe
              src="https://www.youtube.com/embed/gWRMT7eLSag?autoplay=1&rel=0"
              title="How MEDI SEVA 360 Works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>

        {/* Bottom bar */}
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between gap-3">
          {videoUrl ? (
            <>
              <p className="text-slate-400 text-xs">📹 Your custom video (saved on this device)</p>
              <button
                onClick={handleRemove}
                className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-xs">📁 Add your own video — it will persist after refresh!</p>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={saving}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                {saving ? '⏳ Saving…' : '⬆️ Upload Video'}
              </button>
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [searchQ, setSearchQ] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const sliderRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance hero slider
  useEffect(() => {
    sliderRef.current = setInterval(() => {
      setSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => { if (sliderRef.current) clearInterval(sliderRef.current); };
  }, []);

  const prevSlide = () => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => setSlide(s => (s + 1) % HERO_SLIDES.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/hospitals?q=${encodeURIComponent(searchQ)}`);
  };

  // ── Scroll reveal refs ────────────────────────────────────────────────────────
  const statsReveal       = useScrollReveal(0.1);
  const specialtyReveal   = useScrollReveal(0.1);
  const doctorsReveal     = useScrollReveal(0.1);
  const packagesReveal    = useScrollReveal(0.1);
  const locationsReveal   = useScrollReveal(0.1);
  const testimonialsReveal = useScrollReveal(0.1);
  const newsReveal        = useScrollReveal(0.1);
  const appReveal         = useScrollReveal(0.1);

  const cur = HERO_SLIDES[slide];

  return (
    <PageLayout>
      {/* ══ HERO — FULL SCREEN VIDEO (Apollo style) ══════════════════════════ */}
      <section className="relative h-[92vh] min-h-[580px] max-h-[800px] overflow-hidden">

        {/* ── VIDEO BACKGROUND — Apollo style ─────────────────────────────
            HOW TO ADD YOUR VIDEO:
            1. Go to https://pixabay.com/videos/search/?q=hospital  (free, no signup)
            2. Download any hospital/medical video
            3. Rename it to "hero.mp4"
            4. Drop it in:  mediseva360/public/videos/hero.mp4
            The <video> tag below will auto-play it instantly.
        ──────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-0 overflow-hidden">

          {/* Animated gradient background — visible until video loads */}
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #0f2056 0%, #1e3a8a 25%, #0d9488 50%, #1e4a6e 75%, #0f2056 100%)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 12s ease infinite',
            }}
          />

          {/* Animated medical cross pattern overlay */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 10h10v15h15v10H35v15H25V35H10V25h15V10z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
            }}
          />

          {/* LOCAL VIDEO — drop public/videos/hero.mp4 to activate */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 1 }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            <source src="/videos/hero.webm" type="video/webm" />
            {/* Video not found = animated gradient above shows instead */}
          </video>

          {/* Dark overlay — makes text readable over video/gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy-dark/65 to-navy-dark/25" style={{ zIndex: 2 }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-navy-dark/70 to-transparent" style={{ zIndex: 2 }} />
        </div>

        {/* ── Slide text panels cycle over the video ── */}
        {HERO_SLIDES.map((s, i) => (
          <div key={i}
            className={`absolute inset-0 z-10 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: i === slide ? 'auto' : 'none' }}
          >
            {/* per-slide extra tint if needed */}
          </div>
        ))}

        {/* Content — always on top */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-2xl">

              {/* Slide badge */}
              <div
                key={slide}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 animate-fade-in"
              >
                <span className="live-dot bg-emerald-400" />
                {cur.badge}
              </div>

              {/* Slide title */}
              <h1
                key={`t-${slide}`}
                className="text-4xl md:text-5xl xl:text-6xl font-black text-white font-display leading-tight mb-4 whitespace-pre-line animate-fade-in"
              >
                {cur.title}
              </h1>
              <p
                key={`s-${slide}`}
                className="text-lg text-white/80 mb-8 leading-relaxed max-w-xl animate-fade-in"
              >
                {cur.subtitle}
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-2xl">
                  <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search hospital, city or specialty…"
                    className="flex-1 outline-none text-slate-800 placeholder-slate-400 text-sm font-medium bg-transparent"
                  />
                </div>
                <button type="submit"
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold px-5 py-3 rounded-xl transition-all shadow-2xl whitespace-nowrap">
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link to={cur.ctaLink} className="btn-primary py-3 px-6 text-base shadow-2xl">
                  <CalendarPlus className="w-5 h-5" /> {cur.cta}
                </Link>
                <button onClick={() => setShowVideo(true)}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 text-white font-semibold px-5 py-3 rounded-xl transition-all">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 text-navy-DEFAULT fill-navy-DEFAULT ml-0.5" />
                  </div>
                  Watch Our Story
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide controls ── */}
        <button onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 backdrop-blur transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 backdrop-blur transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ── Slide dots ── */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'bg-white w-6 h-2.5' : 'bg-white/40 w-2.5 h-2.5 hover:bg-white/70'}`} />
          ))}
        </div>

        {/* ── Floating stats glass cards at bottom ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-4 pb-6">
            <div className="hidden lg:grid grid-cols-4 gap-3 max-w-2xl">
              {[
                { v: '5,200+',  l: 'Verified Hospitals' },
                { v: '15,000+', l: 'Expert Doctors' },
                { v: '2.8 Cr+', l: 'Patients Served' },
                { v: '36 States', l: 'Pan-India Network' },
              ].map(s => (
                <div key={s.l}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all cursor-default">
                  <p className="text-xl font-black text-amber-400">{s.v}</p>
                  <p className="text-xs text-white/75 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── "Scroll down" hint ── */}
        <div className="absolute bottom-5 right-6 z-30 hidden lg:flex flex-col items-center gap-1 text-white/40 text-xs">
          <span>Scroll</span>
          <div className="w-px h-8 bg-white/30 rounded-full" style={{ animation: 'pulse 2s infinite' }} />
        </div>
      </section>

      {/* ══ QUICK BOOKING STRIP ═══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {[
                { icon: CalendarPlus, label: 'Book OPD', link: '/hospitals', color: 'text-navy-DEFAULT bg-navy-DEFAULT/8' },
                { icon: LocateFixed, label: 'Find Near Me', link: '/hospitals', color: 'text-teal-600 bg-teal-50' },
                { icon: Video, label: 'Video Consult', link: '/hospitals', color: 'text-purple-600 bg-purple-50' },
                { icon: Package, label: 'Health Packages', link: '#packages', color: 'text-amber-600 bg-amber-50' },
              ].map(({ icon: Icon, label, link, color }) => (
                <Link key={label} to={link}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-md ${color}`}>
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="w-4 h-4 text-red-500" />
              <span>24/7 Helpline:</span>
              <a href="tel:18605001066" className="font-bold text-navy-DEFAULT hover:text-teal-600 transition-colors">1860-500-1066</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SPECIALTIES ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#f0f4ff]">
        <div
          ref={specialtyReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${specialtyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label">Departments</p>
              <h2 className="section-title">Our Specialties</h2>
            </div>
            <Link to="/hospitals" className="hidden sm:flex items-center gap-1 text-teal-600 font-semibold text-sm hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {SPECIALTIES.map(sp => (
              <Link key={sp.name} to={`/hospitals?specialty=${encodeURIComponent(sp.name)}`}
                className="group flex flex-col items-center text-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 hover:border-teal-200 transition-all duration-300 cursor-pointer">
                <div className="relative w-full h-28 overflow-hidden">
                  <img src={sp.img} alt={sp.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${sp.color} opacity-60`} />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">{sp.emoji}</div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-navy-DEFAULT text-xs leading-tight">{sp.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS BANNER ══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-navy-DEFAULT via-[#1e4a6e] to-[#0d9488] py-14">
        <div
          ref={statsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${statsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-black text-amber-400 font-display">{value}</p>
                <p className="text-white/80 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FIND A DOCTOR ════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div
          ref={doctorsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${doctorsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label">Our Experts</p>
              <h2 className="section-title">Find a Doctor</h2>
            </div>
            <Link to="/hospitals" className="hidden sm:flex items-center gap-1 text-teal-600 font-semibold text-sm hover:gap-2 transition-all">
              View All Doctors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.map(doc => (
              <div key={doc.name} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 overflow-hidden">
                {/* Photo */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-navy-DEFAULT/10 to-teal-600/10">
                  <img src={doc.img} alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-dark/80 to-transparent py-3 px-4">
                    <span className="text-xs font-semibold text-white/80">{doc.hospital}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-navy-DEFAULT font-display">{doc.name}</h3>
                  <p className="text-teal-600 text-sm font-semibold mt-0.5">{doc.specialty}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {doc.exp} exp</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {doc.reviews.toLocaleString()} reviews</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {doc.available}
                  </p>
                  <Link to="/hospitals"
                    className="mt-4 btn-primary w-full justify-center py-2 text-sm">
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VIDEO SECTION ════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1600&q=60&auto=format&fit=crop"
            alt="Hospital"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-dark/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="section-label text-amber-400 mb-2">Our Story</p>
          <h2 className="text-3xl md:text-4xl font-black text-white font-display mb-4">
            How MEDI SEVA 360 is Transforming<br />Healthcare Access in India
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            A Pan-India platform connecting patients with verified hospitals, digital OPD tokens, live bed counts, and real-time emergency support.
          </p>
          <button onClick={() => setShowVideo(true)}
            className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-amber-400 text-navy-DEFAULT hover:text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-2xl text-lg">
            <div className="w-12 h-12 rounded-full bg-navy-DEFAULT/10 group-hover:bg-white/20 flex items-center justify-center transition-all">
              <Play className="w-6 h-6 fill-navy-DEFAULT group-hover:fill-white text-navy-DEFAULT group-hover:text-white transition-all" />
            </div>
            Watch Our Story
          </button>
          <p className="text-white/40 text-xs mt-4">3 min · Hindi / English subtitles</p>
        </div>
      </section>

      {/* ══ HEALTH PACKAGES ══════════════════════════════════════════════════ */}
      <section id="packages" className="py-16 bg-[#f0f4ff]">
        <div
          ref={packagesReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${packagesReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-10">
            <p className="section-label">Preventive Care</p>
            <h2 className="section-title">Health Check Packages</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2">
              Comprehensive health check-up packages at partner hospitals. Book online, get results on your phone.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map(pkg => (
              <div key={pkg.name} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-teal-200 transition-all duration-300">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img src={pkg.img} alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 to-transparent" />
                  <div className={`absolute top-3 left-3 ${pkg.tagColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                    {pkg.tag}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-navy-DEFAULT font-display mb-1">{pkg.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-black text-teal-600">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-slate-400 line-through text-sm">₹{pkg.originalPrice.toLocaleString()}</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% off
                    </span>
                  </div>
                  <ul className="space-y-1 mb-4">
                    {pkg.tests.slice(0, 4).map(t => (
                      <li key={t} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {t}
                      </li>
                    ))}
                    {pkg.tests.length > 4 && (
                      <li className="text-xs text-teal-600 font-semibold">+{pkg.tests.length - 4} more tests</li>
                    )}
                  </ul>
                  <Link to="/hospitals" className="btn-primary w-full justify-center py-2 text-sm">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR HOSPITALS / LOCATIONS ════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div
          ref={locationsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${locationsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-10">
            <p className="section-label">Nationwide Network</p>
            <h2 className="section-title">Hospitals Across India</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mt-2">
              From metros to tier-2 cities — find verified hospitals in your city.
            </p>
          </div>

          {/* City Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {LOCATIONS.map(loc => (
              <Link key={loc.city} to={`/hospitals?city=${encodeURIComponent(loc.city)}`}
                className="group relative rounded-2xl overflow-hidden h-36 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                <img src={loc.img} alt={loc.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-bold text-white text-sm leading-tight">{loc.city}</p>
                  <p className="text-white/70 text-xs">{loc.hospitals}+ Hospitals</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Embedded Google Map — Kadapa Satellite View */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-navy-DEFAULT to-teal-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white font-display">Hospitals Near Kadapa District</h3>
                <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="live-dot" /> Live Satellite
                </span>
              </div>
              <a
                href="https://www.google.com/maps/search/hospitals+near+Kadapa+Andhra+Pradesh/@14.4673,78.8242,13z"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-semibold transition-colors"
              >
                Open in Google Maps <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            {/* Satellite view of Kadapa */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d30889.32!2d78.8242!3d14.4673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shospitals+near+Kadapa+Andhra+Pradesh!5e1!3m2!1sen!2sin!4v1697298000000"
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospitals Near Kadapa — Satellite View"
              className="w-full"
            />
            {/* Quick hospital links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-t border-slate-200">
              {[
                { name: 'RIMS Kadapa', id: 'h005' },
                { name: 'District HQ Hospital', id: 'h015' },
                { name: 'Holy Cross Hospital', id: 'h016' },
                { name: 'Siva Sai Hospital', id: 'h013' },
              ].map(h => (
                <Link key={h.id} to={`/hospitals/${h.id}`}
                  className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-navy-DEFAULT hover:bg-[#f0f4ff] border-r last:border-0 border-slate-200 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  {h.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PATIENT TESTIMONIALS ══════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-navy-DEFAULT/5 to-teal-600/5">
        <div
          ref={testimonialsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${testimonialsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-10">
            <p className="section-label">Success Stories</p>
            <h2 className="section-title">What Patients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-slate-100 hover:border-teal-200 transition-all duration-300">
                {/* Stars */}
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img src={t.img} alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-teal-200" />
                  <div>
                    <p className="font-bold text-navy-DEFAULT text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.city} · {t.hospital}</p>
                  </div>
                  <div className="ml-auto">
                    <BadgeCheck className="w-5 h-5 text-teal-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HEALTH NEWS ══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div
          ref={newsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${newsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label">Health Blog</p>
              <h2 className="section-title">Latest Health Articles</h2>
            </div>
            <Link to="/hospitals" className="hidden sm:flex items-center gap-1 text-teal-600 font-semibold text-sm hover:gap-2 transition-all">
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {NEWS.map(n => (
              <div key={n.title} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-300 cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img src={n.img} alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 to-transparent" />
                  <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {n.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                    <Newspaper className="w-3.5 h-3.5" /> {n.date}
                  </p>
                  <h3 className="font-bold text-navy-DEFAULT font-display text-sm leading-snug mb-2 group-hover:text-teal-600 transition-colors">
                    {n.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-3">{n.excerpt}</p>
                  <span className="text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY mediseva ════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#f0f4ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80&auto=format&fit=crop"
                  alt="Doctor with patient"
                  className="rounded-2xl h-64 w-full object-cover shadow-lg"
                />
                <div className="flex flex-col gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&q=80&auto=format&fit=crop"
                    alt="Medical team"
                    className="rounded-2xl h-32 w-full object-cover shadow-lg"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500&q=80&auto=format&fit=crop"
                    alt="Hospital technology"
                    className="rounded-2xl flex-1 w-full object-cover shadow-lg"
                  />
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <HeartPulse className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-black text-2xl text-navy-DEFAULT">98.4%</p>
                    <p className="text-xs text-slate-500">Patient Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="section-label">Why Choose Us</p>
              <h2 className="section-title mb-4">India's Most Trusted Healthcare Platform</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                MEDI SEVA 360 is the first unified OPD token platform covering all government and empanelled private hospitals across India. Powered by HFR, ABHA, and ABDM — built for Bharat.
              </p>
              <div className="space-y-4">
                {[
                  { icon: BadgeCheck, title: 'HFR Verified Network', desc: 'Every hospital verified under National Health Facility Registry.' },
                  { icon: ShieldCheck, title: 'ABHA & ABDM Integrated', desc: 'Your health records linked to your ABHA ID — portable and private.' },
                  { icon: BedDouble, title: 'Live Bed Availability', desc: 'Real-time bed counts, ICU status, and ambulance availability.' },
                  { icon: Award, title: 'Insurance Scheme Support', desc: 'PMJAY, CGHS, ESIC, State schemes — filter hospitals by what you have.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-DEFAULT text-sm">{title}</h4>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DOWNLOAD APP ════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-navy-DEFAULT to-[#0d9488] overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div
          ref={appReveal.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${appReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">MEDI SEVA 360 App</p>
              <h2 className="text-3xl md:text-4xl font-black text-white font-display mb-4">
                Healthcare in Your Pocket
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Book OPD tokens, track queue status, receive appointment alerts, manage your health records — all on the app.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center gap-3 bg-white text-navy-DEFAULT font-bold px-5 py-3.5 rounded-xl hover:bg-amber-400 hover:text-white transition-all shadow-lg">
                  <Smartphone className="w-6 h-6" />
                  <div>
                    <p className="text-xs text-current/70 leading-none mb-0.5">Download on</p>
                    <p className="text-sm font-black leading-none">App Store</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-3 bg-white text-navy-DEFAULT font-bold px-5 py-3.5 rounded-xl hover:bg-amber-400 hover:text-white transition-all shadow-lg">
                  <Download className="w-6 h-6" />
                  <div>
                    <p className="text-xs text-current/70 leading-none mb-0.5">Get it on</p>
                    <p className="text-sm font-black leading-none">Google Play</p>
                  </div>
                </a>
              </div>
              <p className="text-white/40 text-xs mt-4">🧪 Live — app links are illustrative only</p>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-64">
                {/* Phone mockup */}
                <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-[3rem] p-4 shadow-2xl">
                  <div className="bg-gradient-to-br from-navy-DEFAULT to-teal-600 rounded-[2.5rem] overflow-hidden" style={{ aspectRatio: '9/19' }}>
                    <img
                      src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80&auto=format&fit=crop"
                      alt="App preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-8 flex flex-col justify-end p-4">
                      <p className="text-white font-bold text-sm">Book OPD Token</p>
                      <p className="text-white/70 text-xs">AIIMS New Delhi · Queue #12</p>
                    </div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -right-12 top-8 bg-white rounded-2xl shadow-xl p-3 text-center w-24">
                  <p className="text-2xl font-black text-emerald-500">12</p>
                  <p className="text-xs text-slate-500">Your Queue #</p>
                </div>
                <div className="absolute -left-10 bottom-16 bg-white rounded-2xl shadow-xl p-3 text-center w-24">
                  <HeartPulse className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-navy-DEFAULT">Live Track</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
            <span className="live-dot bg-teal-500" /> Free to Use · Live Active
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-navy-DEFAULT font-display mb-4">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Join 2.8 crore patients who found the right hospital, booked their OPD token, and never waited in a queue again.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/hospitals" className="btn-primary py-3 px-8 text-base">
              <Search className="w-5 h-5" /> Find Hospitals
            </Link>
            <Link to="/register" className="btn-secondary py-3 px-8 text-base">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && <VideoModal onClose={() => setShowVideo(false)} />}
    </PageLayout>
  );
}
