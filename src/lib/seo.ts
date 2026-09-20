import type { Metadata } from 'next';
import type { School } from '../types/school';

export const SITE_NAME = 'Admission Pitara';
export const SITE_SHORT_NAME = 'Admission Pitara';
export const SITE_TAGLINE = 'School admissions and discovery in Greater Noida, Greater Noida West and Noida Extension.';
export const SITE_DESCRIPTION =
  'Find schools and school admissions in Greater Noida, Greater Noida West, Noida Extension and Noida. Compare fees, boards, facilities, admission status and school profiles.';
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://admissionpitara.com';

const cleanBaseUrl = BASE_URL.replace(/\/$/, '');

function absoluteUrl(path = '') {
  return `${cleanBaseUrl}${path.startsWith('/') || !path ? path : `/${path}`}`;
}

export function buildPageMetadata(
  title: string,
  description?: string,
  path: string = '',
  image?: string
): Metadata {
  const fullTitle = title.includes('Admission Pitara') ? title : `${title} | Admission Pitara`;
  const metaDesc = description || SITE_DESCRIPTION;
  const canonicalUrl = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl('/icon.svg');

  return {
    title: fullTitle,
    description: metaDesc,
    metadataBase: new URL(`${cleanBaseUrl}/`),
    alternates: { canonical: canonicalUrl },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      title: fullTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: SITE_SHORT_NAME,
      locale: 'en_IN',
      type: 'website',
      images: [{ url: ogImage, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDesc,
      images: [ogImage],
    },
  };
}

function schoolLocationText(school: School) {
  return [
    school.location.sector,
    school.location.area,
    school.location.city,
    'Greater Noida',
  ].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(', ');
}

function schoolFeeText(school: School) {
  const fee = school.fees.annualDisplay || school.fees.tuitionAnnual || school.fees.rangeText;
  if (!fee || /not publicly disclosed/i.test(fee)) return 'fee information available on the profile';
  return fee;
}

export function buildSchoolMetadata(school: School): Metadata {
  const isDup = Boolean(school.isDuplicate && school.duplicateOf);
  const primarySlug = isDup ? school.duplicateOf! : school.slug;
  const title = `${school.name} — Fees, Admissions & Details in Greater Noida`;
  const location = schoolLocationText(school);
  const boards = Array.isArray(school.board)
    ? school.board.filter(Boolean).join(', ')
    : school.board || 'school curriculum';
  const description =
    `${school.name} in ${location}. Explore ${boards} curriculum, fees (${schoolFeeText(school)}), student-teacher ratio, facilities and current admission information on Admission Pitara.`;
  const canonicalUrl = absoluteUrl(`/schools/${primarySlug}`);
  const image = school.assets.featured
    ? school.assets.featured.startsWith('/')
      ? absoluteUrl(school.assets.featured)
      : absoluteUrl(`/${school.assets.featured}`)
    : absoluteUrl('/icon.svg');

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: isDup
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_SHORT_NAME,
      locale: 'en_IN',
      type: 'website',
      images: [{ url: image, alt: `${school.name} in Greater Noida` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function generateSchoolJsonLd(school: School) {
  const canonicalUrl = absoluteUrl(`/schools/${school.slug}`);
  const schoolImage = school.assets.featured
    ? school.assets.featured.startsWith('/')
      ? absoluteUrl(school.assets.featured)
      : absoluteUrl(`/${school.assets.featured}`)
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': ['School', 'EducationalOrganization'],
    '@id': `${canonicalUrl}#school`,
    name: school.name,
    description: school.summary || school.tagline,
    url: canonicalUrl,
    ...(schoolImage ? { image: [schoolImage] } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(school.location.address ? { streetAddress: school.location.address } : {}),
      addressLocality: school.location.city || 'Greater Noida',
      ...(school.location.state ? { addressRegion: school.location.state } : {}),
      ...(school.location.pincode ? { postalCode: school.location.pincode } : {}),
      addressCountry: 'IN',
    },
    ...(school.location?.coordinates?.lat != null && school.location?.coordinates?.lng != null
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
    ...(school.contact.website ? { sameAs: [school.contact.website] } : {}),
    ...(school.gradeRange?.raw ? { educationalLevel: school.gradeRange.raw } : {}),
    ...(school.rating?.score && school.rating?.reviewsCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: school.rating.score,
            reviewCount: school.rating.reviewsCount,
            bestRating: school.rating.scale || 5,
          },
        }
      : {}),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${cleanBaseUrl}/#organization`,
    name: SITE_SHORT_NAME,
    url: cleanBaseUrl,
    logo: absoluteUrl('/icon.svg'),
    description: SITE_DESCRIPTION,
    areaServed: [
      { '@type': 'City', name: 'Greater Noida' },
      { '@type': 'Place', name: 'Greater Noida West' },
      { '@type': 'Place', name: 'Noida Extension' },
      { '@type': 'City', name: 'Noida' },
    ],
  };
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${cleanBaseUrl}/#website`,
    name: SITE_SHORT_NAME,
    url: cleanBaseUrl,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${cleanBaseUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${cleanBaseUrl}/schools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function generateSchoolDirectoryJsonLd(schools: School[]) {
  const canonicalSchools = schools.filter(s => !s.isDuplicate && !s.isArchived);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Schools in Greater Noida, Greater Noida West and Noida Extension',
    numberOfItems: canonicalSchools.length,
    itemListElement: canonicalSchools.slice(0, 100).map((school, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: school.name,
      url: absoluteUrl(`/schools/${school.slug}`),
    })),
  };
}
