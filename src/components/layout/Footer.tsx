import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Heart } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="inline-block">
              <BrandLogo size="md" subtext="Greater Noida West & Extension" />
            </Link>
            <p className="text-xs text-[var(--color-content-muted)] max-w-sm leading-relaxed mt-1">
              Admission Pitara is an independent, parent-first school discovery, fee verification, and admissions intelligence platform. Designed to help families discover, compare, and apply to schools with complete clarity.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-content-muted)] mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>Greater Noida West / Noida Extension, Uttar Pradesh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1.5 rounded-lg w-fit mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>100% Unbiased & Independent • Zero Paid Promotions</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
              Explore
            </span>
            <ul className="space-y-2 text-xs text-[var(--color-content-muted)] list-none p-0 m-0">
              <li>
                <Link href="/schools" className="hover:text-[var(--color-primary)] transition-colors">
                  All 17 Schools
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[var(--color-primary)] transition-colors">
                  Compare Schools
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-[var(--color-primary)] transition-colors">
                  Admission Tracker
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[var(--color-primary)] transition-colors">
                  Saved Shortlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Sectors & Locations Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
              Key Sectors
            </span>
            <ul className="space-y-2 text-xs text-[var(--color-content-muted)] list-none p-0 m-0">
              <li>
                <Link href="/schools?area=Knowledge%20Park%205" className="hover:text-[var(--color-primary)] transition-colors">
                  Knowledge Park 5
                </Link>
              </li>
              <li>
                <Link href="/schools?area=Techzone%204" className="hover:text-[var(--color-primary)] transition-colors">
                  Techzone 4
                </Link>
              </li>
              <li>
                <Link href="/schools?area=Sector%201" className="hover:text-[var(--color-primary)] transition-colors">
                  Sector 1 & 2
                </Link>
              </li>
              <li>
                <Link href="/schools?area=Sector%2016B" className="hover:text-[var(--color-primary)] transition-colors">
                  Sector 16B & 16C
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
              Platform
            </span>
            <ul className="space-y-2 text-xs text-[var(--color-content-muted)] list-none p-0 m-0">
              <li>
                <Link href="/about" className="hover:text-[var(--color-primary)] transition-colors">
                  About Admission Pitara
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-content-subtle)]">
          <p>© {new Date().getFullYear()} Admission Pitara. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[var(--color-content-muted)]">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[var(--color-content-muted)]">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-[var(--color-content-muted)]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

