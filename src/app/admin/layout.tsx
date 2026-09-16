import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Control Center | Admission Pitara',
  description: 'Private administrator control center for Admission Pitara.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#0a192f] text-slate-100 flex flex-col font-sans">
      {children}
    </div>
  );
}
