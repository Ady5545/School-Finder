import type { Metadata } from 'next';
import type { School } from '../types/school';

export const SITE_NAME = 'Admission Pitara — Greater Noida';
export const SITE_SHORT_NAME = 'Admission Pitara';
export const SITE_TAGLINE = 'Find the right school in Greater Noida.';
export const SITE_DESCRIPTION = 'The parent-first school discovery, verified fee breakdown, and admission intelligence platform for Greater Noida West & Noida Extension.';
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://admissionpitara.com';

export function buildPageMetadata(title: string, description?: string, path: string = ''): Metadata {
  const fullTitle = title.includes('Admission Pitara') ? title : `${title} | ${SITE_SHORT_NAME}`;
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
      siteName: SITE_SHORT_NAME,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDesc,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildSchoolMetadata(school: School): Metadata {
  const isDup = Boolean(school.isDuplicate && school.duplicateOf);
  const primarySlug = isDup ? school.duplicateOf! : school.slug;
  const title = `${school.name} | ${SITE_SHORT_NAME}`;
  const description = `${school.name} in ${school.location.area || school.location.city}, Greater Noida. Affiliated to ${school.board.join(', ')}. Grade range: ${school.gradeRange.raw}. Verified fee structure: ${school.fees.cardFee ? '₹' + school.fees.cardFee.toLocaleString('en-IN') + '/yr' : 'Available on request'}. Review verified admissions, teacher-student ratios, and campus facilities.`;
  const canonicalUrl = `${BASE_URL}/schools/${primarySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: isDup ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_SHORT_NAME,
      locale: 'en_IN',
      type: 'article',
      images: school.assets.featured
        ? [
            {
              url: school.assets.featured.startsWith('/') ? school.assets.featured : `/${school.assets.featured}`,
              alt: `${school.name} campus in Greater Noida`,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
