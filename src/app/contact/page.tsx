import { buildPageMetadata } from '../../lib/seo';
import ContactPageClient from './ContactPageClient';

export const dynamic = 'force-dynamic';

export const metadata = buildPageMetadata(
  'Contact Admission Pitara',
  'Contact Admission Pitara for parent enquiries, school data corrections, verified fee updates and partnerships in Greater Noida.',
  '/contact'
);

export default function ContactPage() {
  return <ContactPageClient />;
}
