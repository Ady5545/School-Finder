import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ToastProvider } from '../components/ui/Toast';
import { SchoolStoreProvider } from '../lib/schoolStore';

export const metadata: Metadata = {
  title: {
    default: 'Admission Pitara | Schools of Greater Noida West',
    template: '%s | Admission Pitara',
  },
  description:
    'Admission Pitara: The parent-first school discovery, fee verification, and admission intelligence platform for Greater Noida West and Noida Extension.',
  applicationName: 'Admission Pitara',
  authors: [{ name: 'Admission Pitara Editorial' }],
  keywords: [
    'Admission Pitara',
    'Schools in Greater Noida West',
    'Schools in Noida Extension',
    'School Admissions Greater Noida',
    'School Fees Comparison',
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
    title: 'Admission Pitara | Schools of Greater Noida West',
    description:
      'The parent-first school discovery, verified fee breakdown, and admission intelligence platform for Greater Noida West & Noida Extension.',
    siteName: 'Admission Pitara',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admission Pitara | Schools of Greater Noida West',
    description:
      'Verified school fee structures, board affiliations, ratios, and admission tracker for Greater Noida West.',
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
          <SchoolStoreProvider>
            <Header />
            <main className="flex-1 w-full flex flex-col" id="main-content">
              {children}
            </main>
            <Footer />
          </SchoolStoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

