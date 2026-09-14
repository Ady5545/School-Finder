import React from 'react';
import Link from 'next/link';
import { GraduationCap, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[var(--color-content)]">
                Admission Pitara
              </span>
            </div>
            <p className="text-xs text-[var(--color-content-muted)] max-w-sm leading-relaxed">
              An independent school discovery, decision-making, and admission intelligence platform designed for parents. Focused initially on Greater Noida West & Noida Extension.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-content-muted)] mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>Greater Noida West / Noida Extension, Uttar Pradesh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg w-fit mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>Independent & parent-first school intelligence</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
              Explore
            </span>
            <ul className="space-y-2 text-xs text-[var(--color-content-muted)] list-none p-0 m-0">
              <li>
                <Link href="/schools" className="hover:text-[var(--color-content)] transition-colors">
                  All Schools
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[var(--color-content)] transition-colors">
                  Compare Schools
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-[var(--color-content)] transition-colors">
                  Admission Tracker
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[var(--color-content)] transition-colors">
                  Shortlisted Schools
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-[var(--color-content)] uppercase tracking-wider">
              Information
            </span>
            <ul className="space-y-2 text-xs text-[var(--color-content-muted)] list-none p-0 m-0">
              <li>
                <Link href="/about" className="hover:text-[var(--color-content)] transition-colors">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--color-content)] transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[var(--color-content)] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[var(--color-content)] transition-colors">
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
