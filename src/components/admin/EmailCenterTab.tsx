'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  Users,
  RefreshCw,
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  subject: string;
  bodySnippet: string;
  recipientType: string;
  recipientCount: number;
  recipientsPreview: string[];
  sentBy: string;
  sentAt: string;
  status: 'sent' | 'test' | 'partially_failed';
}

const TEMPLATES = [
  {
    name: '2027-28 Admission Timeline Alert',
    subject: 'Important: Greater Noida West School Admission Deadlines Approaching',
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
  <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">Admission Season Update</h2>
  <p>Dear Parent,</p>
  <p>Several leading CBSE and Cambridge schools across <strong>Greater Noida West (Noida Extension)</strong> have announced application deadlines for the upcoming 2027–28 academic session.</p>
  <p>You can track open registration portals, verified fee structures, and campus milestones directly on your Admission Pitara account.</p>
  <div style="margin: 24px 0;">
    <a href="https://admissionpitara.com" style="background-color: #f59e0b; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Active School Admissions</a>
  </div>
  <p style="font-size: 12px; color: #64748b;">Admission Pitara • Greater Noida West Independent Parent Directory</p>
</div>`,
  },
  {
    name: 'Sector 16B & Techzone 4 Verification Digest',
    subject: 'Updated School Fee & Seat Availability Report for Greater Noida West',
    content: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
  <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">Editorial Verification Report</h2>
  <p>Dear Parent,</p>
  <p>Our editorial team has verified the fee structures, student-teacher ratios, and CBSE affiliations for schools in <strong>Sector 16B and Techzone 4</strong>.</p>
  <p>Log in to compare tuition costs, transport charges, and parent ratings side-by-side.</p>
  <div style="margin: 24px 0;">
    <a href="https://admissionpitara.com" style="background-color: #f59e0b; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Compare Schools Now</a>
  </div>
  <p style="font-size: 12px; color: #64748b;">Admission Pitara • Trusted by thousands of local parents</p>
</div>`,
  },
];

export function EmailCenterTab() {
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [contentHtml, setContentHtml] = useState(TEMPLATES[0].content);
  const [recipientType, setRecipientType] = useState('test');
  const [customEmail, setCustomEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/admin/email/history');
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
        setSmtpConfigured(data.smtpConfigured);
        setSmtpHost(data.smtpHost);
        setSmtpUser(data.smtpUserMasked);
      }
    } catch (err) {
      console.error('Failed to load email history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setSubject(tmpl.subject);
    setContentHtml(tmpl.content);
  };

  const handleSendEmail = async (isTest: boolean) => {
    if (!subject.trim() || !contentHtml.trim()) {
      setFeedback({ type: 'error', message: 'Subject and HTML content are required.' });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          contentHtml,
          recipientType: isTest ? 'test' : recipientType,
          customEmail,
          isTest,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        fetchHistory();
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to send email.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error dispatching email.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top SMTP Status Banner */}
      <div className="p-4 rounded-2xl bg-[#0a1c33] border border-[#1b3e66] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${smtpConfigured ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">SMTP Mail Gateway</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${smtpConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {smtpConfigured ? 'Live Configured' : 'Development Simulated'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Host: <span className="font-mono text-slate-300">{smtpHost || 'Standard SMTP'}</span> • User: <span className="font-mono text-slate-300">{smtpUser}</span>
            </p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {feedback && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${feedback.type === 'success' ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'}`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Composer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0b2038] border border-[#1d4672] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              Compose Parent Announcement
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Template:</span>
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] cursor-pointer"
                >
                  {idx === 0 ? 'Admissions' : 'Sectors'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white text-xs focus:outline-hidden focus:border-amber-400"
              placeholder="e.g. Greater Noida West School Admission Alert"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              HTML Email Body *
            </label>
            <textarea
              rows={8}
              value={contentHtml}
              onChange={e => setContentHtml(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#071629] border border-[#1d4672] text-white text-xs font-mono focus:outline-hidden focus:border-amber-400 leading-relaxed"
            />
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <select
                value={recipientType}
                onChange={e => setRecipientType(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#071629] border border-[#1d4672] text-xs text-white"
              >
                <option value="test">Test Preview (Current Admin)</option>
                <option value="verified_parents">Verified Parents Only</option>
                <option value="all_parents">All Active Parent Accounts</option>
                <option value="individual">Custom Email</option>
              </select>

              {recipientType === 'individual' && (
                <input
                  type="email"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="px-3 py-1.5 rounded-xl bg-[#071629] border border-[#1d4672] text-xs text-white"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSendEmail(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Send Test Preview</span>
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSendEmail(false)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="p-5 rounded-2xl bg-[#0b2038] border border-[#1d4672] flex flex-col">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Rendered Parent View Preview
          </h3>
          <div className="flex-1 p-4 rounded-xl bg-white text-slate-900 text-xs overflow-y-auto max-h-[360px] shadow-inner">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </div>
      </div>

      {/* Dispatch History Log */}
      <div className="rounded-2xl bg-[#0a1c33] border border-[#1b3e66] overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-[#08172c] border-b border-[#1b3e66] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Recent Dispatch Logs ({campaigns.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08172c] text-slate-400 border-b border-[#1b3e66]">
              <tr>
                <th className="px-4 py-2.5">Subject</th>
                <th className="px-4 py-2.5">Target</th>
                <th className="px-4 py-2.5">Recipients</th>
                <th className="px-4 py-2.5">Dispatched By</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#153457] text-slate-300">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-500 italic">
                    No email campaigns dispatched in this session yet.
                  </td>
                </tr>
              ) : (
                campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-white max-w-xs truncate">
                      {c.subject}
                    </td>
                    <td className="px-4 py-2.5 uppercase font-mono text-[11px] text-slate-400">
                      {c.recipientType}
                    </td>
                    <td className="px-4 py-2.5 font-mono">{c.recipientCount} parents</td>
                    <td className="px-4 py-2.5 text-slate-400">{c.sentBy}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'}`}>
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-400 font-mono">
                      {new Date(c.sentAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
