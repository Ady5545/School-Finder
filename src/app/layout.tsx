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
import { generateOrganizationJsonLd, generateWebsiteJsonLd } from '../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://admissionpitara.com'),
  title: {
    default: 'School Admissions in Greater Noida, Greater Noida West & Noida | Admission Pitara',
    template: '%s | Admission Pitara',
  },
  description:
    'Find schools and school admissions in Greater Noida, Greater Noida West, Noida Extension and Noida. Compare fees, boards, facilities, admission status and school profiles.',
  applicationName: 'Admission Pitara',
  keywords: [
    'school admissions Greater Noida',
    'school admissions Greater Noida West',
    'school admissions Noida',
    'schools in Greater Noida',
    'schools in Greater Noida West',
    'schools in Noida Extension',
  ],
  icons: '/icon.svg',
};

export const viewport: Viewport = {
  themeColor: '#0f2d4a',
  colorScheme: 'light',
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
              </SchoolStoreProvider>
            </AuthProvider>
          </ToastProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
