'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Mic,
  MicOff,
  Phone,
  Volume2,
  VolumeX,
  BarChart3,
  BrainCircuit,
  ChevronDown,
  Database,
  Gauge,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

type Intelligence = {
  generatedAt: string;
  health: { status: string; issueCount: number; high: number; medium: number; low: number };
  schools: {
    total: number;
    admissionsOpen: number;
    admissionsClosed: number;
    admissionsUnknown: number;
    missingFee: number;
    unverifiedFee: number;
    unverifiedCoordinates: number;
    topAttentionSchools: Array<{ slug: string; name: string; views: number; saves: number; events: number }>;
  };
  users: { total: number; active: number; verifiedEmail: number; withWishlist: number };
  reviews: { total: number; published: number; deleted: number; averagePublishedScore: number };
  activity: { loadedEvents: number; topEventTypes: Array<{ type: string; count: number }> };
  anomalies: Array<{ severity: 'high' | 'medium' | 'low'; issue: string; evidence: string }>;
  datasets: Record<string, number>;
};

const getSpeechRecognitionCtor = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

const browserVoiceSupported = () =>
  typeof window !== 'undefined' &&
  !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
const starters = [
  {
    label: 'FULL SYSTEM SCAN',
    icon: Gauge,
    prompt: 'Give me the complete Admission Pitara situation right now. Cover platform health, schools, admissions, fees, parents, reviews, shortlists, searches, comparisons, promotions, data integrity, security, activity and anything unusual. Connect the signals and tell me what matters most.',
  },
  {
    label: 'FUNNEL ANALYSIS',
    icon: BarChart3,
    prompt: 'Analyse the Admission Pitara discovery-to-admission funnel. Use the available activity, search, comparison, wishlist and school signals to identify where parents engage, shortlist, compare, review, or appear to drop off. Show evidence and missing signals.',
  },
  {
    label: 'DATA INTEGRITY',
    icon: Database,
    prompt: 'Perform a deep Admission Pitara data-integrity audit. Find missing, stale, inconsistent, duplicate-looking, unverifiable or contradictory school, fee, admission, user, review and activity records. Tell me what to investigate first.',
  },
  {
    label: 'USER INTELLIGENCE',
    icon: Users,
    prompt: 'Analyse parent/user behaviour across Admission Pitara. Tell me what users are doing, what schools they appear interested in, where engagement is strongest, where activity is weak, and what operational patterns or anomalies deserve attention.',
  },
];

export function AdvisAdminCopilot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [booting, setBooting] = useState(true);
  const [intelligence, setIntelligence] = useState<Intelligence | null>(null);
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [listening, setListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [toolTrace, setToolTrace] = useState<Array<{ name: string; status: 'ok' | 'error'; summary?: string }>>([]);
  const recognitionRef = useRef<any>(null);
  const voiceModeRef = useRef(false);
  const voiceOutputRef = useRef(true);
  const restartVoiceRef = useRef(false);

  async function ask(value = question) {
    const q = value.trim();
    if (!q || loading) return;
    setQuestion(q);
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('/api/admin/advis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history: history.slice(-6) }),
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'ADVIS request failed.');
      }

      setAnswer(data.answer || '');
      setModel(data.model || '');
      setIntelligence(data.intelligence || null);
      setToolTrace(data.toolTrace || []);
      if (voiceModeRef.current) restartVoiceRef.current = true;
      speakAnswer(data.answer || '');
      setHistory(prev => [...prev, { role: 'user', content: q }, { role: 'assistant', content: data.answer || '' }].slice(-8));
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : 'ADVIS could not complete the analysis.');
    } finally {
      setLoading(false);
      setBooting(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void ask();
  }

  function stopSpeaking() {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }

  function speakAnswer(text: string) {
    if (!voiceOutputRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const clean = text.replace(/[#*_]/g, '').replace(/\\n+/g, '. ').replace(/•/g, '. ');
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(clean.slice(0, 7000));
    utterance.lang = 'en-IN';
    utterance.rate = 1.02;
    utterance.pitch = 0.96;
    utterance.volume = 1;
    utterance.onend = () => {
      if (voiceModeRef.current && restartVoiceRef.current && !loading) startListening();
    };
    window.speechSynthesis.speak(utterance);
  }

  function stopListening() {
    restartVoiceRef.current = false;
    recognitionRef.current?.stop?.();
    recognitionRef.current = null;
    setListening(false);
    setInterimTranscript('');
  }

  function startListening() {
    const Recognition = getSpeechRecognitionCtor();
    if (!Recognition) {
      setVoiceError('Voice input is not available in this browser. Chrome is recommended.');
      return;
    }
    stopListening();
    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.continuous = voiceModeRef.current;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = 'en-IN';
    recognition.onstart = () => {
      restartVoiceRef.current = voiceModeRef.current;
      setVoiceError('');
      setListening(true);
    };
    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const spoken = event.results[index]?.[0]?.transcript || '';
        if (event.results[index].isFinal) finalText += spoken;
        else interimText += spoken;
      }
      setInterimTranscript(interimText);
      if (finalText.trim()) {
        setInterimTranscript('');
        setQuestion(prev => (prev ? prev + ' ' : '') + finalText.trim());
      }
    };
    recognition.onerror = (event: any) => {
      restartVoiceRef.current = false;
      setListening(false);
      setInterimTranscript('');
      const code = event?.error || 'unknown';
      setVoiceError(code === 'not-allowed' || code === 'service-not-allowed'
        ? 'Microphone access was blocked. Allow microphone access for Admission Pitara Admin.'
        : 'Voice input error: ' + code);
    };
    recognition.onend = () => {
      setListening(false);
      if (voiceModeRef.current && restartVoiceRef.current && !loading) {
        window.setTimeout(() => {
          if (voiceModeRef.current && !loading) startListening();
        }, 300);
      }
    };
    try {
      recognition.start();
    } catch {
      setVoiceError('Could not start the microphone. Try again.');
    }
  }

  function toggleVoiceMode() {
    const next = !voiceMode;
    voiceModeRef.current = next;
    setVoiceMode(next);
    if (next) startListening();
    else stopListening();
  }

  function toggleVoiceOutput() {
    const next = !voiceOutput;
    voiceOutputRef.current = next;
    setVoiceOutput(next);
    if (!next) stopSpeaking();
  }


  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    voiceOutputRef.current = voiceOutput;
  }, [voiceOutput]);

  useEffect(() => {
    return () => {
      restartVoiceRef.current = false;
      recognitionRef.current?.stop?.();
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    void ask(
      'Give me the complete Admission Pitara briefing right now. Tell me what is happening across the platform, what looks healthy, what looks abnormal, what deserves attention, what changed signals are visible in the current snapshot, and what I should investigate next. Cover schools, admissions, parents, reviews, shortlists, searches, comparisons, promotions, data integrity, security, activity, and operational health.'
    );
  }, []);

  const statusLabel = intelligence?.health.status === 'stable'
    ? 'SYSTEM STABLE'
    : intelligence?.health.status === 'watch'
      ? 'SYSTEM WATCH'
      : intelligence?.health.status === 'attention'
        ? 'ATTENTION REQUIRED'
        : booting || loading
          ? 'SCANNING'
          : 'READY';

  return (
    <section className="mb-7 overflow-hidden rounded-3xl border border-cyan-300/25 bg-[#03111f]/95 shadow-[0_0_55px_rgba(45,210,255,.09)]">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left border-b border-cyan-300/10 hover:bg-cyan-300/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 w-11 h-11 rounded-2xl border border-cyan-300/30 bg-cyan-300/[0.08] flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-cyan-200" />
            <span className="absolute inset-0 rounded-2xl border border-cyan-300/10 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white">ADVIS Intelligence Core</h2>
              <span className="px-2 py-0.5 rounded-full border border-cyan-300/20 bg-cyan-300/5 text-[9px] font-black uppercase tracking-[0.18em] text-cyan-200">
                Admin only
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Admission Pitara platform intelligence, diagnostics &amp; operational command</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-2.5 py-1 text-[9px] font-black tracking-[0.14em] text-cyan-100/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            {statusLabel}
          </span>
          <ChevronDown className={`w-4 h-4 text-cyan-200 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="p-4 sm:p-6 space-y-5">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-cyan-100/70">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authenticated admin context</span>
                <span>•</span>
                <span>Admission Pitara scope only</span>
                <span>•</span>
                <span>{intelligence ? new Date(intelligence.generatedAt).toLocaleTimeString() : 'Awaiting first scan'}</span>
              </div>
              <h3 className="mt-2 text-lg sm:text-2xl font-black tracking-tight text-white">Your platform, observed as one system.</h3>
              <p className="mt-1 text-xs sm:text-sm leading-5 text-slate-400 max-w-4xl">
                ADVIS connects the signals already available to Admin instead of treating schools, parents, admissions, reviews and activity as separate screens.
              </p>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => void ask('Re-scan the entire Admission Pitara platform from the current live admin snapshot. Tell me what changed or is abnormal since the previous analysis, then give me the highest-priority investigations.')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/[0.08] px-4 py-2.5 text-[10px] font-black tracking-[0.14em] text-cyan-100 hover:bg-cyan-300/[0.14] disabled:opacity-40 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              RE-SCAN
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="rounded-2xl border border-cyan-300/10 bg-[#061a2a] p-3.5">
              <div className="flex items-center justify-between text-cyan-200">
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Platform health</span>
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2 text-base font-black text-white">{statusLabel}</div>
              <p className="mt-1 text-[10px] text-slate-500">{intelligence?.health.issueCount ?? 0} detected issue signals</p>
            </div>

            <div className="rounded-2xl border border-cyan-300/10 bg-[#061a2a] p-3.5">
              <div className="flex items-center justify-between text-cyan-200">
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Schools</span>
                <Database className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2 text-xl font-black text-white">{intelligence?.schools.total ?? '—'}</div>
              <p className="mt-1 text-[10px] text-slate-500">{intelligence?.schools.admissionsOpen ?? 0} recognised as open</p>
            </div>

            <div className="rounded-2xl border border-cyan-300/10 bg-[#061a2a] p-3.5">
              <div className="flex items-center justify-between text-cyan-200">
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Parents</span>
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2 text-xl font-black text-white">{intelligence?.users.total ?? '—'}</div>
              <p className="mt-1 text-[10px] text-slate-500">{intelligence?.users.withWishlist ?? 0} have active shortlist signals</p>
            </div>

            <div className="rounded-2xl border border-cyan-300/10 bg-[#061a2a] p-3.5">
              <div className="flex items-center justify-between text-cyan-200">
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Activity</span>
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div className="mt-2 text-xl font-black text-white">{intelligence?.activity.loadedEvents ?? '—'}</div>
              <p className="mt-1 text-[10px] text-slate-500">recent platform events loaded</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2.5">
            {starters.map(({ label, icon: Icon, prompt }) => (
              <button
                key={label}
                type="button"
                onClick={() => void ask(prompt)}
                disabled={loading}
                className="group text-left rounded-2xl border border-cyan-300/10 bg-[#061625] p-3.5 hover:border-cyan-300/25 hover:bg-[#082039] disabled:opacity-45 transition-all"
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-cyan-300" />
                  <Sparkles className="w-3 h-3 text-cyan-300/40 group-hover:text-cyan-200 transition-colors" />
                </div>
                <div className="mt-3 text-[10px] font-black tracking-[0.14em] text-white">{label}</div>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">Run a focused intelligence pass.</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-4">
            <div className="rounded-2xl border border-cyan-300/10 bg-[#020d18] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Command console</span>
                </div>
                {model && <span className="text-[9px] font-mono text-slate-600">{model}</span>}
              </div>

              <form onSubmit={submit} className="flex gap-2">
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Ask ADVIS about Admission Pitara..."
                  className="min-w-0 flex-1 rounded-xl border border-cyan-300/15 bg-[#010912] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-300/45"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  className="shrink-0 rounded-xl border border-cyan-200/25 bg-cyan-300/[0.08] px-4 text-cyan-100 hover:bg-cyan-300/[0.14] disabled:opacity-40 transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

              {history.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {history.filter(item => item.role === 'user').map(item => (
                    <button
                      key={item}
                      type="button"
                      disabled={loading}
                      onClick={() => void ask(item.content)}
                      title={item.content}
                      className="max-w-full truncate rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-1.5 text-[9px] text-slate-500 hover:text-cyan-100 hover:border-cyan-300/15 transition-colors"
                    >
                      {item.content}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-4 min-h-[180px] rounded-xl border border-cyan-300/10 bg-[#01070d] p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-200">Latest intelligence report</span>
                  {loading && <span className="inline-flex items-center gap-1.5 text-[9px] text-cyan-200/70"><Loader2 className="w-3 h-3 animate-spin" /> SCANNING</span>}
                </div>
                {toolTrace.length > 0 && (
                <div className="mb-4 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.02] p-3">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-cyan-200 mb-2">
                    <BrainCircuit className="w-3 h-3" /> Live tools consulted
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {toolTrace.map((tool, index) => (
                      <span key={tool.name + index} className={`rounded-lg border px-2 py-1 text-[9px] font-mono ${tool.status === 'ok' ? 'border-cyan-300/10 bg-cyan-300/[0.03] text-cyan-100/70' : 'border-rose-300/10 bg-rose-300/[0.03] text-rose-200'}`}>
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {answer ? (
                  <div className="whitespace-pre-wrap text-xs sm:text-sm leading-6 text-slate-200">{answer}</div>
                ) : (
                  <div className="h-28 flex items-center justify-center text-center text-[11px] text-slate-600">
                    <div>{booting || loading ? 'ADVIS is connecting the live Admission Pitara signals…' : 'Run a command to generate an intelligence report.'}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-cyan-300/10 bg-[#020d18] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-cyan-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Detected signals</span>
                </div>
                {intelligence?.anomalies?.length ? (
                  <div className="space-y-2">
                    {intelligence.anomalies.map((item, index) => (
                      <div key={item.issue + index} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.severity === 'high' ? 'bg-rose-300' : item.severity === 'medium' ? 'bg-amber-300' : 'bg-cyan-300'}`} />
                          <span className="text-[10px] font-bold text-white">{item.issue}</span>
                        </div>
                        <p className="mt-1.5 text-[9px] leading-4 text-slate-500">{item.evidence}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-600">No deterministic anomaly signals detected in the current snapshot.</p>
                )}
              </div>

              <div className="rounded-2xl border border-cyan-300/10 bg-[#020d18] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-cyan-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Schools receiving attention</span>
                </div>
                {intelligence?.schools.topAttentionSchools?.length ? (
                  <div className="space-y-1.5">
                    {intelligence.schools.topAttentionSchools.slice(0, 6).map(school => (
                      <div key={school.slug} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.02] px-2.5 py-2">
                        <span className="min-w-0 truncate text-[10px] text-slate-300">{school.name}</span>
                        <span className="shrink-0 text-[9px] font-mono text-cyan-200">{school.events} ev</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-600">No school-level activity loaded yet.</p>
                )}
              </div>

              <div className="rounded-2xl border border-cyan-300/10 bg-[#020d18] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-cyan-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Top activity signals</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(intelligence?.activity.topEventTypes || []).slice(0, 8).map(item => (
                    <span key={item.type} className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.03] px-2.5 py-1.5 text-[9px] text-slate-400">
                      {item.type.replaceAll('_', ' ')} <strong className="text-cyan-200">{item.count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
