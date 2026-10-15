import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, Phone,
  Monitor, MessageSquare, Users, Clock, Star,
  Stethoscope, Send, ChevronRight, AlertCircle,
  RefreshCw, Camera, Settings, Maximize2
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useAppStore } from '../store/appStore';
import { Link } from 'react-router-dom';

// ── Demo doctors ────────────────────────────────────────────────────────────
const DOCTORS = [
  { id:'d1', name:'Dr. Prasad Reddy',     specialty:'General Medicine', exp:'12 yrs', rating:4.8, fee:200, wait:'< 2 min', avatar:'PR', color:'#1e3a8a', hospital:'RIMS Kadapa' },
  { id:'d2', name:'Dr. Sunitha Kumari',   specialty:'Gynaecology',      exp:'9 yrs',  rating:4.9, fee:250, wait:'< 5 min', avatar:'SK', color:'#0d9488', hospital:'Govt General' },
  { id:'d3', name:'Dr. Venkataramaiah',   specialty:'Cardiology',       exp:'15 yrs', rating:4.7, fee:300, wait:'< 3 min', avatar:'VR', color:'#7c3aed', hospital:'SVIMS Proddatur' },
  { id:'d4', name:'Dr. Anitha Devi',      specialty:'Paediatrics',      exp:'8 yrs',  rating:4.9, fee:200, wait:'< 1 min', avatar:'AD', color:'#db2777', hospital:'RIMS Kadapa' },
  { id:'d5', name:'Dr. Krishna Murthy',   specialty:'Orthopaedics',     exp:'11 yrs', rating:4.6, fee:280, wait:'< 4 min', avatar:'KM', color:'#059669', hospital:'Rajiv Gandhi' },
  { id:'d6', name:'Dr. Lakshmi Prasanna', specialty:'Dermatology',      exp:'7 yrs',  rating:4.8, fee:220, wait:'< 2 min', avatar:'LP', color:'#d97706', hospital:'Govt General' },
];

type Stage = 'select' | 'waiting' | 'call' | 'ended';

// ── Chat messages ────────────────────────────────────────────────────────────
interface ChatMsg { from: 'you' | 'doctor'; text: string; time: string; }

const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export default function ConsultationPage() {
  const { currentUser, isAuthenticated } = useAppStore();

  const [stage, setStage]           = useState<Stage>('select');
  const [selectedDoc, setSelectedDoc] = useState<typeof DOCTORS[0] | null>(null);
  const [waitSecs, setWaitSecs]     = useState(0);
  const [callSecs, setCallSecs]     = useState(0);
  const [camOn, setCamOn]           = useState(true);
  const [micOn, setMicOn]           = useState(true);
  const [chatOpen, setChatOpen]     = useState(false);
  const [chatMsg, setChatMsg]       = useState('');
  const [messages, setMessages]     = useState<ChatMsg[]>([]);
  const [stream, setStream]         = useState<MediaStream | null>(null);
  const [camErr, setCamErr]         = useState('');
  const [docJoined, setDocJoined]   = useState(false);
  const [rating, setRating]         = useState(0);

  const localVideoRef  = useRef<HTMLVideoElement>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Start camera ─────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      setCamErr('');
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = s;
      }
    } catch (e: any) {
      setCamErr(e?.message || 'Camera access denied. Please allow camera permission.');
    }
  }, []);

  // ── Stop camera ──────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
  }, [stream]);

  // Attach stream to video element whenever it changes
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  // ── Waiting room timer → simulate doctor joining ─────────────────────────
  useEffect(() => {
    if (stage !== 'waiting') return;
    startCamera();
    setWaitSecs(0);
    const joinDelay = 4 + Math.floor(Math.random() * 4); // 4-7s
    timerRef.current = setInterval(() => {
      setWaitSecs(s => {
        if (s + 1 >= joinDelay) {
          clearInterval(timerRef.current!);
          setDocJoined(true);
          setTimeout(() => {
            setStage('call');
            setMessages([{ from:'doctor', text:`Hello! I'm ${selectedDoc?.name}. How can I help you today?`, time: now() }]);
          }, 1200);
        }
        return s + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  // ── Call timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'call') return;
    timerRef.current = setInterval(() => setCallSecs(s => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  // ── Toggle video track ───────────────────────────────────────────────────
  const toggleCam = () => {
    if (stream) stream.getVideoTracks().forEach(t => { t.enabled = !camOn; });
    setCamOn(v => !v);
  };
  const toggleMic = () => {
    if (stream) stream.getAudioTracks().forEach(t => { t.enabled = !micOn; });
    setMicOn(v => !v);
  };

  // ── End call ─────────────────────────────────────────────────────────────
  const endCall = () => {
    stopCamera();
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('ended');
  };

  // ── Send chat ─────────────────────────────────────────────────────────────
  const sendChat = () => {
    if (!chatMsg.trim()) return;
    const msg: ChatMsg = { from: 'you', text: chatMsg, time: now() };
    setMessages(p => [...p, msg]);
    setChatMsg('');
    // Auto-reply after 1.5s
    const REPLIES = [
      'I understand. Can you tell me more about your symptoms?',
      'How long have you been experiencing this?',
      'Have you taken any medication for this?',
      'I see. I\'ll prescribe something suitable for you.',
      'Please follow up in 3 days if symptoms persist.',
    ];
    setTimeout(() => {
      setMessages(p => [...p, { from:'doctor', text: REPLIES[Math.floor(Math.random()*REPLIES.length)], time: now() }]);
    }, 1500);
  };

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // Cleanup on unmount
  useEffect(() => () => { stopCamera(); if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── LOGIN GATE ───────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Login Required</h2>
            <p className="text-slate-500 text-sm mb-6">Please login to start an online consultation with a doctor.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-secondary">Register</Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // STAGE: SELECT DOCTOR
  // ════════════════════════════════════════════════════════════════════════
  if (stage === 'select') {
    return (
      <PageLayout>
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              Doctors Online Now
            </div>
            <h1 className="text-3xl font-extrabold text-[#1e3a8a] mb-2">Online Consultation</h1>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              Connect face-to-face with a verified doctor via live video. Demo simulation — no real medical advice.
            </p>
          </div>

          {/* Demo notice */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs leading-relaxed">
              <strong>Demo Mode:</strong> This is a simulated video consultation. No real doctor will join. Your camera will be accessed for demonstration. Do not share real medical information.
            </p>
          </div>

          {/* Doctor cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOCTORS.map(doc => (
              <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-teal-300 transition-all group cursor-pointer"
                onClick={() => { setSelectedDoc(doc); setStage('waiting'); }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: doc.color }}>
                    {doc.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm leading-tight">{doc.name}</p>
                    <p className="text-teal-600 text-xs font-medium">{doc.specialty}</p>
                    <p className="text-slate-400 text-xs">{doc.hospital}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span>⭐ {doc.rating}</span>
                  <span>·</span>
                  <span>{doc.exp} exp</span>
                  <span>·</span>
                  <span className="text-green-600 font-semibold">Wait {doc.wait}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-bold text-sm">₹{doc.fee} <span className="text-slate-400 font-normal text-xs">/ session</span></span>
                  <button className="flex items-center gap-1.5 bg-[#1e3a8a] text-white text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-teal-600 transition-colors">
                    <Video className="w-3.5 h-3.5" /> Consult
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // STAGE: WAITING ROOM
  // ════════════════════════════════════════════════════════════════════════
  if (stage === 'waiting') {
    return (
      <PageLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 to-blue-950">
          <div className="text-center max-w-sm w-full">
            {/* Doctor avatar */}
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-2xl"
                style={{ background: selectedDoc?.color }}>
                {selectedDoc?.avatar}
              </div>
              {docJoined && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {!docJoined && (
                <div className="absolute inset-0 rounded-full border-4 border-teal-400/40 animate-ping" />
              )}
            </div>

            <h2 className="text-white font-bold text-xl mb-1">{selectedDoc?.name}</h2>
            <p className="text-slate-400 text-sm mb-6">{selectedDoc?.specialty}</p>

            {docJoined ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <p className="text-green-400 font-semibold">Doctor joined! Connecting...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
                  <span className="text-teal-300 text-sm">Connecting to doctor...</span>
                </div>
                <div className="bg-white/10 rounded-full h-1.5 w-48 mx-auto overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full animate-pulse" style={{ width: `${Math.min((waitSecs / 6) * 100, 95)}%`, transition: 'width 1s' }} />
                </div>
                <p className="text-slate-500 text-xs mt-3">Please wait... {waitSecs}s</p>
              </>
            )}

            {/* Camera preview */}
            <div className="mt-6 rounded-xl overflow-hidden border border-white/20 bg-black relative" style={{ height: 140 }}>
              {camErr ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs gap-2">
                  <Camera className="w-6 h-6" />
                  <span>{camErr}</span>
                  <button onClick={startCamera} className="text-teal-400 underline text-xs">Retry</button>
                </div>
              ) : (
                <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
              )}
              <span className="absolute bottom-2 left-2 text-white text-xs bg-black/50 rounded px-1.5 py-0.5">You</span>
            </div>

            <button onClick={() => { stopCamera(); setStage('select'); }}
              className="mt-4 text-slate-400 hover:text-red-400 text-sm transition-colors flex items-center gap-1 mx-auto">
              <PhoneOff className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // STAGE: ACTIVE CALL
  // ════════════════════════════════════════════════════════════════════════
  if (stage === 'call') {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col z-50">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: selectedDoc?.color }}>
              {selectedDoc?.avatar}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{selectedDoc?.name}</p>
              <p className="text-green-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                {selectedDoc?.specialty} · {fmt(callSecs)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:block">🔒 End-to-end encrypted (Demo)</span>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Doctor video (avatar simulation) */}
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `radial-gradient(circle at center, ${selectedDoc?.color}22, #0f172a)` }}>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-5xl mx-auto mb-4 shadow-2xl border-4 border-white/20"
                style={{ background: selectedDoc?.color }}>
                {selectedDoc?.avatar}
              </div>
              <p className="text-white font-bold text-lg">{selectedDoc?.name}</p>
              <p className="text-slate-400 text-sm">{selectedDoc?.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs">Camera On (Simulated)</span>
              </div>
            </div>
          </div>

          {/* Your camera (PiP) */}
          <div className="absolute top-4 right-4 w-36 h-24 sm:w-48 sm:h-32 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl bg-black">
            {camErr ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs gap-1">
                <Camera className="w-5 h-5" />
                <span className="text-center px-2">{camErr}</span>
                <button onClick={startCamera} className="text-teal-400 text-xs underline">Retry</button>
              </div>
            ) : camOn ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-slate-800 text-slate-500 text-xs gap-1">
                <VideoOff className="w-5 h-5" />
                <span>Camera Off</span>
              </div>
            )}
            <span className="absolute bottom-1 left-1.5 text-white text-[10px] bg-black/60 rounded px-1">You</span>
          </div>

          {/* Chat panel */}
          {chatOpen && (
            <div className="absolute top-0 left-0 bottom-0 w-72 bg-slate-900/95 backdrop-blur border-r border-white/10 flex flex-col z-20">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-white font-semibold text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-teal-400" /> Chat</span>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white text-lg leading-none">×</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.from === 'you' ? 'bg-[#1e3a8a] text-white' : 'bg-slate-700 text-slate-100'}`}>
                      <p>{m.text}</p>
                      <p className={`text-[10px] mt-1 ${m.from === 'you' ? 'text-white/50' : 'text-slate-400'}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/10 flex gap-2">
                <input
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-teal-500 placeholder:text-slate-500"
                />
                <button onClick={sendChat} className="w-9 h-9 bg-teal-600 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div className="bg-black/60 backdrop-blur px-4 py-4 flex items-center justify-center gap-3 sm:gap-5">
          {/* Mute */}
          <button onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
            title={micOn ? 'Mute' : 'Unmute'}>
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Video */}
          <button onClick={toggleCam}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camOn ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
            title={camOn ? 'Turn off camera' : 'Turn on camera'}>
            {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* End call */}
          <button onClick={endCall}
            className="w-16 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-all shadow-lg hover:shadow-red-500/40 active:scale-95">
            <PhoneOff className="w-5 h-5" />
          </button>

          {/* Chat */}
          <button onClick={() => setChatOpen(v => !v)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${chatOpen ? 'bg-teal-600 text-white' : 'bg-white/15 hover:bg-white/25 text-white'}`}>
            <MessageSquare className="w-5 h-5" />
            {messages.filter(m => m.from === 'doctor').length > 0 && !chatOpen && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {messages.filter(m => m.from === 'doctor').length}
              </span>
            )}
          </button>

          {/* Participants */}
          <button className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all">
            <Users className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // STAGE: CALL ENDED
  // ════════════════════════════════════════════════════════════════════════
  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Consultation Ended</h2>
          <p className="text-slate-500 text-sm mb-2">Session with {selectedDoc?.name}</p>
          <p className="text-slate-400 text-xs mb-6">Duration: {fmt(callSecs)}</p>

          {/* Rating */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-slate-600 text-sm font-semibold mb-3">Rate your experience</p>
            <div className="flex justify-center gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(s)}
                  className={`text-2xl transition-transform hover:scale-125 ${s <= rating ? 'text-amber-400' : 'text-slate-300'}`}>
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && <p className="text-green-600 text-xs mt-2 font-medium">Thank you for your feedback!</p>}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-left">
            <p className="text-amber-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span><strong>Demo reminder:</strong> This was a simulated session. No real medical advice was given. Consult a real doctor for health concerns.</span>
            </p>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => { setStage('select'); setSelectedDoc(null); setCallSecs(0); setMessages([]); setRating(0); }}
              className="btn-primary flex items-center gap-2">
              <Video className="w-4 h-4" /> New Consultation
            </button>
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
