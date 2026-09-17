import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'Privacy Policy',
  'Privacy Policy and data handling practices for Admission Pitara users.',
  '/privacy'
);

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Privacy Policy', isCurrent: true }]} className="mb-6" />

      <h1 className="text-3xl font-extrabold text-[var(--color-content)] tracking-tight pb-4 border-b border-[var(--color-border)]">
        Privacy Policy
      </h1>

      <div className="py-8 space-y-6 text-sm text-[var(--color-content-muted)] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">1. Information We Collect</h2>
          <p>
            Admission Pitara collects minimal information required to provide our school discovery services. If you create an account, we store your name and email address to maintain your school shortlists and comparison preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">2. How We Use Information</h2>
          <p>
            We use collected data solely to deliver, maintain, and improve parent tools on our platform. We do not sell or lease personal contact details to third-party marketing companies or commercial coaching centers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">3. Parent Reviews & Public Anonymity Handling</h2>
          <p>
            When you submit a rating or review for a school on Admission Pitara:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>
              <strong>Public Anonymity:</strong> You can select &quot;Post anonymously&quot;. When selected, our server strips your name, email address, and user ID from public API responses. The review appears publicly under the name &quot;Anonymous Parent&quot;.
            </li>
            <li>
              <strong>Server-Side Record Keeping:</strong> The platform maintains an internal, server-side association between the review and your verified user account. This prevents duplicate rating manipulation, protects schools against fraudulent bots, and allows you to edit or delete your review in future sessions.
            </li>
            <li>
              <strong>Identity Confidentiality:</strong> Your real name and email address for an anonymous review are strictly confidential and will never be shared with schools, site visitors, or external parties.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[var(--color-content)]">4. Data Security</h2>
          <p>
            We implement industry-standard administrative and technical safeguards to protect stored user preferences and account credentials.
          </p>
        </section>

        <section className="space-y-2 pt-2 border-t border-[var(--color-border)]">
          <h2 className="text-base font-bold text-[var(--color-content)]">4. Privacy Contact</h2>
          <p>
            For questions or requests regarding your data and account privacy, contact our editorial team at{' '}
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
