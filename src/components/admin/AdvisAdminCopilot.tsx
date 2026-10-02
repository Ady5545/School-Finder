'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BrainCircuit, Send, Loader2, Sparkles, ShieldCheck, ChevronDown } from 'lucide-react';

const starters = [
  'Give me the complete Admission Pitara situation right now. Cover users, schools, admissions, reviews, shortlists, searches, comparisons, promotions, data quality, security, and anything unusual.',
  'Audit Admission Pitara for suspicious data, broken relationships, stale records, duplicate signals, missing information, and operational inconsistencies.',
  'Analyse the entire school-discovery and admission funnel. Tell me where parents are engaging, dropping off, shortlisting, comparing, reviewing, or failing to convert.',
  'Tell me everything important happening in Admission Pitara that I should know as the administrator, ranked by urgency and backed by the live data.',
];

export function AdvisAdminCopilot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);\n  const [booting, setBooting] = useState(true);

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
        body: JSON.stringify({ question: q }),
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'ADVIS request failed.');
      setAnswer(data.answer);
      setModel(data.model || '');
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : 'ADVIS could not complete the analysis.');
    } finally {
      setLoading(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void ask();
  }

  useEffect(() => {
    let active = true;
    void (async () => {
      await ask('Give me the complete Admission Pitara briefing right now. Tell me what is happening across the platform, what changed, what looks healthy, what looks abnormal, what deserves attention, and what I should investigate next. Cover schools, admissions, parents, reviews, shortlists, searches, comparisons, promotions, data integrity, security, and operational health.');
      if (active) setBooting(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mb-6 rounded-2xl border border-cyan-300/25 bg-[#041323]/90 shadow-[0_0_45px_rgba(45,210,255,.08)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full px-4 sm:px-5 py-4 flex items-center justify-between text-left hover:bg-cyan-300/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl border border-cyan-300/30 bg-cyan-300/10 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-cyan-200" />
            <span className="absolute inset-0 rounded-xl border border-cyan-300/10 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">ADVIS Intelligence Core</h2>
              <span className="px-2 py-0.5 rounded-full border border-cyan-300/20 bg-cyan-300/5 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200">Admin only</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Live reasoning over Admission Pitara's operational data</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-cyan-200 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-cyan-300/10">
          <div className="pt-4 flex flex-wrap items-center gap-2 text-[10px] text-cyan-100/70">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated admin context</span><span>•</span><span>Admission Pitara intelligence only</span><span>•</span><span>Live operational snapshot</span>
          </div>

          <div className="rounded-2xl border border-cyan-300/15 bg-gradient-to-r from-cyan-300/[0.05] via-transparent to-blue-400/[0.04] p-4 sm:p-5">\n            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">\n              <div>\n                <div className="flex items-center gap-2 text-cyan-200 text-[10px] font-black uppercase tracking-[0.2em]"><span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(85,231,255,.9)] animate-pulse" />Platform intelligence online</div>\n                <h3 className="mt-2 text-lg sm:text-xl font-black text-white">Your Admission Pitara command centre</h3>\n                <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl leading-5">Ask about the platform itself. ADVIS reasons over the authenticated admin snapshot and connects the signals across the directory, admissions funnel, parents, reviews, shortlists, searches, comparisons, promotions, audits, and school data.</p>\n              </div>\n              <div className="shrink-0 rounded-xl border border-cyan-300/15 bg-[#020b16]/70 px-3 py-2 text-[10px] text-cyan-100/80">{booting || loading ? 'ANALYSING LIVE DATA…' : 'READY FOR COMMANDS'}</div>\n            </div>\n          </div>\n\n          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
            {starters.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => void ask(s)}
                disabled={loading}
                className="text-left p-3 rounded-xl border border-cyan-300/10 bg-[#071a2c] hover:border-cyan-300/30 hover:bg-[#09233a] text-[10px] leading-relaxed text-slate-300 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 mb-1.5" />
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex gap-2">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask ADVIS anything about Admission Pitara — schools, parents, admissions, data, funnel, security, or operations..."
              className="min-w-0 flex-1 rounded-xl border border-cyan-300/15 bg-[#020b16] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-300/45"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="shrink-0 rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-4 text-cyan-100 hover:bg-cyan-300/20 disabled:opacity-40 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          {answer && (
            <div className="rounded-xl border border-cyan-300/15 bg-[#020b16] p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-cyan-200">Analysis</span>
                {model && <span className="text-[9px] text-slate-500">{model}</span>}
              </div>
              <div className="text-xs sm:text-sm leading-6 text-slate-200 whitespace-pre-wrap">{answer}</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
