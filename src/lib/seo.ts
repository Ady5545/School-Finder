import type { Metadata } from 'next';
import type { School } from '../types/school';

export const SITE_NAME = 'Admission Pitara';
export const SITE_DESCRIPTION = 'School discovery, decision-making, and admission intelligence platform for Greater Noida West & Noida Extension.';
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://admissionpitara.com';

export function buildPageMetadata(title: string, description?: string, path: string = ''): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const metaDesc = description || SITE_DESCRIPTION;
  const canonicalUrl = `${BASE_URL}${path}`;

  return {
    title: fullTitle,
    description: metaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildSchoolMetadata(school: School): Metadata {
  const title = `${school.name} - Admissions, Fees, Reviews & Facilities`;
  const description = `${school.name} located at ${school.location.address}. Affiliated to ${school.board.join(', ')}. Grade range: ${school.gradeRange.raw}. Get verified fees, admission dates, and facilities.`;
  const canonicalUrl = `${BASE_URL}/schools/${school.slug}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${school.name} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'article',
      images: school.assets.featured
        ? [
            {
              url: school.assets.featured.startsWith('/') ? school.assets.featured : `/${school.assets.featured}`,
              alt: school.name,
            },
          ]
        : [],
    },
  };
}

export function generateSchoolJsonLd(school: School) {
  return {
    '@context': 'https://schema.org',
    '@type': ['School', 'EducationalOrganization'],
    name: school.name,
    description: school.summary || school.tagline,
    url: `${BASE_URL}/schools/${school.slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: school.location.address,
      addressLocality: school.location.city,
      addressRegion: school.location.state,
      postalCode: school.location.pincode,
      addressCountry: 'IN',
    },
    ...(school.location.coordinates.lat && school.location.coordinates.lng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: school.location.coordinates.lat,
            longitude: school.location.coordinates.lng,
          },
        }
      : {}),
    ...(school.contact.phone ? { telephone: school.contact.phone } : {}),
    ...(school.contact.email ? { email: school.contact.email } : {}),
    ...(school.contact.website ? { sameAs: school.contact.website } : {}),
  };
}
