import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Maximize2, Trash2 } from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────
interface Msg { role: 'user' | 'assistant'; text: string; time: string; }

const t = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

// ── System context for healthcare assistant ──────────────────────────────────
const SYSTEM_PROMPT = `You are MRK Health Assistant, an AI healthcare helper for MEDI SEVA 360 — a healthcare platform serving Kadapa and Proddatur districts in Andhra Pradesh, India.

You help users with:
- Finding hospitals in Kadapa, Proddatur, and nearby areas
- Information about booking OPD appointments
- General health questions and first-aid advice
- Ambulance and emergency help (always remind to call 108)
- Understanding medical specialties (Cardiology, Neurology, etc.)
- Information about government health schemes (PMJAY, Aarogyasri)

Key info:
- Emergency: Call 108 for ambulance
- Platform: MEDI SEVA 360 (demo healthcare portal)
- Location: Kadapa district, Andhra Pradesh

Always:
- Be helpful, concise, and caring
- Recommend visiting a real doctor for serious concerns
- Mention "Live" when asked about real appointments
- Respond in English (or match the user's language if they use Telugu/Hindi)
- Keep responses short and clear (2-4 sentences max)`;

// ── Fallback responses when no API key ──────────────────────────────────────
const FALLBACKS: Record<string, string> = {
  default: "I'm your MRK Health Assistant! I can help with hospital info, appointments, and general health queries. How can I help you?",
  hospital: "MEDI SEVA 360 covers hospitals in Kadapa, Proddatur, Mydukur, Jammalamadugu and more. Use 'Find Hospitals' to search by specialty.",
  ambulance: "🚨 For emergencies call **108** immediately (free, 24/7). You can also track ambulances live on our Ambulance Tracker page.",
  appointment: "To book an appointment: Login → Find Hospitals → Select a hospital → Book Appointment tab. This is a demo — not a real booking system.",
  emergency: "🚨 Call **108** for ambulance or **100** for police. Go to the nearest government hospital for emergencies.",
  hello: "Hello! I'm your MRK Health Assistant 👋. Ask me about hospitals, appointments, health tips, or anything medical!",
  fever: "For fever: rest, drink plenty of fluids, take paracetamol if above 38.5°C. See a doctor if fever lasts more than 2 days or exceeds 40°C.",
  rims: "RIMS Kadapa (Rajiv Institute of Medical Sciences) is the main government hospital in Kadapa. It's located near the city center and offers multi-specialty care.",
};

function getFallback(text: string): string {
  const l = text.toLowerCase();
  if (l.includes('hello') || l.includes('hi') || l.includes('hey')) return FALLBACKS.hello;
  if (l.includes('ambulan') || l.includes('108') || l.includes('emergency') || l.includes('accident')) return FALLBACKS.ambulance;
  if (l.includes('hospital') || l.includes('clinic') || l.includes('doctor')) return FALLBACKS.hospital;
  if (l.includes('appoint') || l.includes('book') || l.includes('opd')) return FALLBACKS.appointment;
  if (l.includes('fever') || l.includes('temperature')) return FALLBACKS.fever;
  if (l.includes('rims') || l.includes('kadapa')) return FALLBACKS.rims;
  return FALLBACKS.default;
}

// ── Call Gemini API ──────────────────────────────────────────────────────────
async function askGemini(messages: Msg[], userText: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return getFallback(userText);

  const history = messages.slice(-8).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [...history, { role: 'user', parts: [{ text: userText }] }],
    generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );

  if (!res.ok) return getFallback(userText);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || getFallback(userText);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AIAssistant() {
  const [open, setOpen]       = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [msgs, setMsgs]       = useState<Msg[]>([
    { role: 'assistant', text: "Hi! I'm your **MRK Health Assistant** 🩺\n\nAsk me about hospitals, appointments, health tips, or emergencies!", time: t() }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); } }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg: Msg = { role: 'user', text, time: t() };
    setMsgs(p => [...p, userMsg]);
    setLoading(true);
    try {
      const reply = await askGemini(msgs, text);
      const botMsg: Msg = { role: 'assistant', text: reply, time: t() };
      setMsgs(p => [...p, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMsgs(p => [...p, { role: 'assistant', text: getFallback(text), time: t() }]);
    }
    setLoading(false);
  };

  const clear = () => setMsgs([{ role: 'assistant', text: "Chat cleared! How can I help you?", time: t() }]);

  // Render markdown-ish bold
  const renderText = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
    );

  const QUICK = ['Nearest hospital', 'Call ambulance', 'Book appointment', 'Health tips'];

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-24 right-6 z-[999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg,#0d9488,#1e3a8a)' }}
        aria-label="AI Health Assistant"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ background: 'linear-gradient(135deg,#0d9488,#1e3a8a)' }} />
        )}
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className={`fixed right-6 z-[998] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 transition-all duration-300 ${
            expanded
              ? 'bottom-6 left-6 sm:left-auto sm:w-[420px] h-[85vh]'
              : 'bottom-24 w-[340px] sm:w-[380px] h-[520px]'
          }`}
          style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.18)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-t-2xl text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#0d9488,#1e3a8a)' }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">MRK Health Assistant</p>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                AI-powered · Always available
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clear} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Clear chat">
                <Trash2 className="w-4 h-4 text-white/80" />
              </button>
              <button onClick={() => setExpanded(v => !v)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                {expanded ? <Minimize2 className="w-4 h-4 text-white/80" /> : <Maximize2 className="w-4 h-4 text-white/80" />}
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>

          {/* API key notice if missing */}
          {!import.meta.env.VITE_GEMINI_API_KEY && (
            <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-[10px] text-amber-700 flex-shrink-0">
              ⚡ Running in smart fallback mode · Add <code className="bg-amber-100 px-1 rounded">VITE_GEMINI_API_KEY</code> for full AI
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user' ? 'bg-[#1e3a8a]' : 'bg-teal-600'
                }`}>
                  {m.role === 'user'
                    ? <User className="w-4 h-4 text-white" />
                    : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#1e3a8a] text-white rounded-tr-sm'
                      : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                  }`}>
                    {renderText(m.text)}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{m.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {msgs.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {QUICK.map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }}
                  className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-full px-3 py-1 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="flex gap-2 bg-slate-100 rounded-xl px-3 py-2 items-center border border-slate-200 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask about hospitals, health..."
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                disabled={loading}
              />
              <button onClick={send} disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#0d9488,#1e3a8a)' }}>
                {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              🩺 For emergencies always call <strong>108</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
