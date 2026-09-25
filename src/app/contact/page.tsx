'use client';

export const dynamic = 'force-dynamic';

export const metadata = buildPageMetadata(
  'Contact Admission Pitara',
  'Contact Admission Pitara for parent enquiries, school data corrections, verified fee updates and partnerships in Greater Noida.',
  '/contact'
);

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildPageMetadata } from '../../lib/seo';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import {
  Mail,
  Building2,
  Users,
  Handshake,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';

const PUBLIC_ENQUIRY_EMAIL = 'enquiry.admissionpitara@gmail.com';

export default function ContactPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('parent');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PUBLIC_ENQUIRY_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          inquiryType,
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'We could not send your message. Please try again.');
        return;
      }
      router.push('/thank-you');
    } catch {
      setErrorMessage('Network error while sending your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Contact', isCurrent: true }]} className="mb-6" />

      {/* Header Banner */}
      <div className="space-y-4 pb-8 border-b border-[var(--color-border)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Contact Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-content)] tracking-tight">
          Contact Admission Pitara
        </h1>
        <p className="text-sm sm:text-base text-[var(--color-content-muted)] leading-relaxed max-w-3xl">
          Whether you are a parent seeking school insights, a school administrator providing verified fee circulars, or a partner inquiring about directory listings, our team is here to assist.
        </p>
      </div>

      {/* Primary Email Banner */}
      <div className="my-8 p-6 bg-gradient-to-r from-amber-900 to-amber-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Official Public Enquiry Email</span>
          </div>
          <a
            href={`mailto:${PUBLIC_ENQUIRY_EMAIL}`}
            className="text-xl sm:text-2xl font-mono font-bold text-white hover:text-amber-200 transition-colors break-all"
          >
            {PUBLIC_ENQUIRY_EMAIL}
          </a>
          <p className="text-xs text-amber-200/80 leading-relaxed max-w-xl">
            All parent inquiries, fee prospectus updates, school claim submissions, and partnership communications are managed through this address.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCopyEmail}
            className="bg-amber-900/80 border-amber-700 text-amber-100 hover:bg-amber-800 hover:text-white font-medium text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 mr-1.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5" />
                <span>Copy Email</span>
              </>
            )}
          </Button>

        </div>
      </div>

      {/* 4 Major Inquiry Pathways */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold text-[var(--color-content)] tracking-tight mb-4">
          Inquiry Pathways & Support
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--color-content)]">Parent Enquiries</h3>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              Questions regarding admission deadlines, transport coverage, or fee breakdowns across Greater Noida West schools.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--color-content)]">School Submissions</h3>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              Official school management updates, official fee structure circulars, prospectus sheets, or facility details.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <Handshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--color-content)]">Partnerships</h3>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              Educational research collaborations, directory listings, or media inquiries regarding local admission statistics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-warm-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[var(--color-content)]">Data Corrections</h3>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              Reporting minor address adjustments, telephone updates, website link fixes, or typo corrections.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Contact Form & Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
        <div className="md:col-span-2">
          <Card id="contact-form-card" className="border-[var(--color-border)] bg-white shadow-warm-xs">
            <CardHeader className="border-b border-stone-100 pb-4">
              <CardTitle className="text-xl font-bold font-serif text-[var(--color-content)]">
                Send a Direct Inquiry
              </CardTitle>
              <CardDescription className="text-xs text-[var(--color-content-muted)]">
                Your message is sent securely from the website directly to <strong className="text-stone-900 font-mono">{PUBLIC_ENQUIRY_EMAIL}</strong>.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4">{errorMessage}</div>
              )}

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-3 animate-fade-in text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base">Message Prepared</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Your message has been received by the Admission Pitara team. We’ll review it and get back to you if a response is needed.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button type="button" onClick={() => setSubmitted(false)} className="px-4 py-2 bg-white text-emerald-900 border border-emerald-300 font-semibold text-xs rounded-xl hover:bg-emerald-100/50">
                      Write Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Your Name
                      </label>
                      <Input
                        id="contact-name"
                        placeholder="e.g. Anish Gupta"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-category" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      id="contact-category"
                      value={inquiryType}
                      onChange={e => setInquiryType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-xs text-stone-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)]"
                    >
                      <option value="parent">Parent Inquiry / Admission Deadline Question</option>
                      <option value="fee-update">Submit Verified Fee Sheet / Circular</option>
                      <option value="school-claim">School Administrator Update / Listing Claim</option>
                      <option value="partnership">Partnership or Media Inquiry</option>
                      <option value="correction">Data Correction or General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Subject
                    </label>
                    <Input
                      id="contact-subject"
                      placeholder="e.g. Transport route confirmation for Sector 16B"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="Please share details about your inquiry, school circular reference, or question..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] leading-relaxed"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Editorial Integrity & Response</span>
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              We aim to review every parent inquiry and official prospectus update within <strong>1–2 business days</strong>.
            </p>
            <p className="text-xs text-stone-700 leading-relaxed">
              Fee updates submitted by parents or school staff are verified against official circulars before publication.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-700">
              Response Hours
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Monday &ndash; Friday: 9:00 AM &ndash; 6:00 PM IST
            </p>
            <p className="text-xs text-stone-500">
              Closed on national holidays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
