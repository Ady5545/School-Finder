'use client';

import { FormEvent, useState } from 'react';
import { BrainCircuit, Send, Loader2, Sparkles, ShieldCheck, ChevronDown } from 'lucide-react';

const starters = [
  'Give me a health check of Admission Pitara right now.',
  'Find suspicious or inconsistent admin data.',
  'Which schools are getting attention but weak conversion signals?',
  'Explain the biggest user-behaviour trend in the last 30 days.',
];

export function AdvisAdminCopilot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

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
          <div className="pt-4 flex items-center gap-2 text-[10px] text-cyan-100/70">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authenticated admin context • read-only intelligence • destructive changes require explicit confirmation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
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
              placeholder="Ask ADVIS anything about the admin system..."
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
