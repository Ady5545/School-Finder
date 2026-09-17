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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://admissionpitara.com'),
  title: {
    default: 'Admission Pitara — Greater Noida | Find the right school in Greater Noida',
    template: '%s | Admission Pitara',
  },
  description:
    'Admission Pitara: Find the right school in Greater Noida. The parent-first school discovery, verified fee breakdown, and admission intelligence platform for Greater Noida West & Noida Extension.',
  applicationName: 'Admission Pitara — Greater Noida',
  icons: '/icon.svg',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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

