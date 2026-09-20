import type { MetadataRoute } from 'next';
import { getCanonicalSchools } from '../lib/schools';
import { BASE_URL } from '../lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/schools`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/compare`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/admissions`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/reviews`, changeFrequency: 'daily', priority: 0.5 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/login`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/register`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Only canonical, active, non-duplicate schools get their own sitemap entry -
  // archived schools and alias/duplicate records are intentionally excluded so
  // they don't compete with (or dilute ranking signal from) the real profile.
  const schoolRoutes: MetadataRoute.Sitemap = getCanonicalSchools().map(school => ({
    url: `${BASE_URL}/schools/${school.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...schoolRoutes];
}
