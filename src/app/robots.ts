import type { MetadataRoute } from 'next';
import { BASE_URL } from '../lib/seo';

const SITE_URL = BASE_URL.replace(/\/$/, '');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/wishlist',
          '/wishlist/',
          '/compare',
          '/compare/',
          '/auth/',
          '/login',
          '/login/',
          '/register',
          '/register/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
