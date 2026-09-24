import type { MetadataRoute } from 'next';
import { getCanonicalSchoolsAsync } from '../lib/schools';
import { BASE_URL } from '../lib/seo';

const SITE_URL = BASE_URL.replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/schools`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/admissions`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/reviews`, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Keep the sitemap focused on canonical, useful, indexable pages.
  // Private/session pages and utility views are intentionally excluded.
  const schoolRoutes: MetadataRoute.Sitemap = (await getCanonicalSchoolsAsync()).map(school => ({
    url: `${SITE_URL}/schools/${school.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...schoolRoutes];
}
