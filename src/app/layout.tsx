import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ToastProvider } from '../components/ui/Toast';
import { AuthProvider } from '../lib/authContext';
import { SchoolStoreProvider } from '../lib/schoolStore';
import { ComparisonDock } from '../components/school/ComparisonDock';
import { ScrollRevealManager } from '../components/layout/ScrollRevealManager';
import { SmoothScrollProvider } from '../components/layout/SmoothScrollProvider';
import { Analytics } from '@vercel/analytics/next';
import { generateOrganizationJsonLd, generateWebsiteJsonLd, BASE_URL, SITE_DESCRIPTION, SITE_SHORT_NAME } from '../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(`${BASE_URL.replace(/\/$/, '')}/`),
  title: {
    default: 'School Admissions in Greater Noida | Admission Pitara',
    template: '%s | Admission Pitara',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_SHORT_NAME,
  category: 'education',
  alternates: {
    canonical: BASE_URL.replace(/\/$/, ''),
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  openGraph: {
    title: 'School Admissions in Greater Noida | Admission Pitara',
    description: SITE_DESCRIPTION,
    url: BASE_URL.replace(/\/$/, ''),
    siteName: SITE_SHORT_NAME,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Admission Pitara — school discovery and admissions in Greater Noida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School Admissions in Greater Noida | Admission Pitara',
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0f2d4a',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('admission-pitara-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=t}catch(e){}})()` }} />
      <body className="min-h-screen flex flex-col bg-[var(--color-surface-muted)] text-[var(--color-content)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteJsonLd()) }}
        />
        <SmoothScrollProvider>
          <ToastProvider>
            <AuthProvider>
              <SchoolStoreProvider>
                <Header />
                <main className="flex-1 w-full flex flex-col" id="main-content">
                  {children}
                </main>
                <Footer />
                <ComparisonDock />
                <ScrollRevealManager />
                <Analytics />
              </SchoolStoreProvider>
            </AuthProvider>
          </ToastProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
