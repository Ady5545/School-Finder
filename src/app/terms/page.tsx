import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'Terms of Service',
  'Terms of service and informational disclaimer for Admission Pitara.',
  '/terms'
);

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Terms of Service', isCurrent: true }]} className="mb-6" />

      <h1 className="text-3xl font-extrabold text-[var(--color-content)] tracking-tight pb-4 border-b border-[var(--color-border)]">
        Terms of Service
      </h1>

      <div className="py-8 space-y-6 text-sm text-[var(--color-content-muted)] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">1. Informational Disclaimer</h2>
          <p>
            Admission Pitara provides institutional discovery, estimated fee ranges, and admission dates for informational and comparative purposes. While we strive to maintain audited and accurate data, parents are advised to verify final fee schedules, transport charges, and admission criteria directly with the respective school administration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">2. User Accounts & Parent Verification</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Access to interactive community features, including submitting school ratings and reviews, requires an authenticated and email-verified account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">3. Parent Reviews, Ratings & Optional Anonymity</h2>
          <p>
            Admission Pitara allows verified parents to submit ratings and constructive feedback for educational institutions.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>
              <strong>Public Anonymity Option:</strong> When submitting or editing a review, parents may choose to post anonymously. When selected, the review is displayed publicly under the title &quot;Anonymous Parent&quot; without exposing your name or account email to site visitors.
            </li>
            <li>
              <strong>Internal Account Association:</strong> Choosing public anonymity hides your identity from site visitors, but Admission Pitara maintains an internal record linking the review to your authenticated user account. This internal linkage is necessary for moderation, anti-spam safeguards, duplicate review prevention, and platform integrity.
            </li>
            <li>
              <strong>Content Guidelines:</strong> Reviews must represent authentic, first-hand parent experiences. Submitting fraudulent, defamatory, abusive, or commercially biased reviews is strictly prohibited and subject to moderation or account suspension.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">4. Intellectual Property</h2>
          <p>
            The software design, compilation, and proprietary comparison algorithms of Admission Pitara are protected by copyright and intellectual property laws. School logos and trademarks remain the property of their respective educational institutions.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-[var(--color-border)]">
          <h2 className="text-base font-bold text-[var(--color-content)]">4. Inquiries & Feedback</h2>
          <p>
            For legal inquiries, terms clarifications, or institutional communications, reach out to our desk at{' '}
            <a
              href="mailto:enquiry.admissionpitara@gmail.com"
              className="font-mono font-semibold text-[var(--color-primary)] hover:underline"
            >
              enquiry.admissionpitara@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
