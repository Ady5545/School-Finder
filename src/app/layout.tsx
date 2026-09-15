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

export const metadata: Metadata = {
  title: {
    default: 'Admission Pitara — Greater Noida | Find the right school in Greater Noida',
    template: '%s | Admission Pitara',
  },
  description:
    'Admission Pitara: Find the right school in Greater Noida. The parent-first school discovery, verified fee breakdown, and admission intelligence platform for Greater Noida West & Noida Extension.',
  applicationName: 'Admission Pitara — Greater Noida',
  authors: [{ name: 'Admission Pitara Editorial' }],
  keywords: [
    'Admission Pitara',
    'Schools in Greater Noida',
    'Schools in Greater Noida West',
    'Schools in Noida Extension',
    'School Admissions Greater Noida',
    'School Fees Comparison Greater Noida',
    'CBSE Schools Noida Extension',
    'IB Schools Greater Noida',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Admission Pitara — Greater Noida | Find the right school in Greater Noida',
    description:
      'Find the right school in Greater Noida. Parent-first school discovery, verified fee breakdown, and admission intelligence platform.',
    siteName: 'Admission Pitara',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admission Pitara — Greater Noida | Find the right school in Greater Noida',
    description:
      'Verified school fee structures, board affiliations, ratios, and admission tracker for Greater Noida.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f3256',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--color-surface-muted)] text-[var(--color-content)] antialiased">
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
      </body>
    </html>
  );
}

