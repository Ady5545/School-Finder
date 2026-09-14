import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Mail, MessageSquare } from 'lucide-react';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'Contact Admission Pitara',
  'Get in touch with the Admission Pitara editorial team for questions, fee updates, or school submissions.',
  '/contact'
);

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Contact', isCurrent: true }]} className="mb-6" />

      <div className="space-y-4 pb-8 border-b border-[var(--color-border)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-content)] tracking-tight">
          Contact & Feedback
        </h1>
        <p className="text-sm text-[var(--color-content-muted)] leading-relaxed max-w-2xl">
          Have a suggestion, question about an admission deadline, or want to report updated fee information for a Greater Noida West school? Reach out to our community team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>We typically review inquiries within 1–2 business days.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Your Name" placeholder="Full name" />
                <Input label="Email address" type="email" placeholder="name@example.com" />
              </div>
              <Input label="Subject" placeholder="E.g., Fee update for DPS Knowledge Park V" />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--color-content)]">Message</label>
                <textarea
                  rows={4}
                  placeholder="Share details or questions regarding school information..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)]"
                />
              </div>
              <Button variant="primary" size="md">
                Send Inquiry
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm">
              <Mail className="w-4 h-4" />
              <span>Editorial Inquiries</span>
            </div>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              For school administrators looking to update official prospectus sheets or admission schedules.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[var(--color-border)] space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>Parent Community</span>
            </div>
            <p className="text-xs text-[var(--color-content-muted)] leading-relaxed">
              We welcome corrections from local parents on transport routes, recent fee circulars, and nursery admission notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
