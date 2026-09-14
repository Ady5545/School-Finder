import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ToastProvider } from '../components/ui/Toast';

export const metadata: Metadata = {
  title: 'Schools of Greater Noida | Admission Pitara',
  description:
    'Admission Pitara: School discovery, decision-making, and admission intelligence platform for Greater Noida West and Noida Extension',
  openGraph: {
    title: 'Schools of Greater Noida | Admission Pitara',
    description:
      'Admission Pitara: School discovery, decision-making, and admission intelligence platform for Greater Noida West and Noida Extension',
    siteName: 'Admission Pitara',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
          <Header />
          <main className="flex-1 w-full flex flex-col" id="main-content">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
