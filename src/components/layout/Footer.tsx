import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Heart } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0a1e33] text-slate-300 border-t-4 border-t-[var(--color-accent)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="inline-block">
              <BrandLogo size="md" theme="dark" subtext="Greater Noida West & Extension" />
            </Link>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed mt-1">
              Admission Pitara is an independent, parent-first school discovery, fee verification, and admissions intelligence platform. Designed to help families discover, compare, and apply to schools with complete clarity.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#f7a072] shrink-0" aria-hidden="true" />
              <span>Greater Noida West / Noida Extension, Uttar Pradesh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-[#0f2d4a] border border-[#1d4b75] px-2.5 py-1.5 rounded-lg w-fit mt-1 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Independent Directory • Verified Parent Reviews & Fee Insights</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <span>Explore</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-300 list-none p-0 m-0">
              <li>
                <Link href="/schools" className="hover:text-[#f7a072] transition-colors">
                  All 17 Schools
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-[#f7a072] transition-colors">
                  Compare Schools
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="hover:text-[#f7a072] transition-colors">
                  Admission Tracker
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#f7a072] transition-colors">
                  Saved Shortlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Sectors & Locations Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <span>Key Sectors</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-300 list-none p-0 m-0">
              <li>
                <Link href="/schools?area=Knowledge%20Park%205" className="hover:text-[#f7a072] transition-colors">
                  Knowledge Park 5
                </Link>
              </li>
              <li>
                <Link href="/schools?area=Techzone%204" className="hover:text-[#f7a072] transition-colors">
                  Techzone 4
                </Link>
              </li>
              <li>
                <Link href="/schools?area=Sector%201" className="hover:text-[#f7a072] transition-colors">
                  Sector 1 & 2
                </Link>
              </li>
              <li>
                <Link href="/schools?area=Sector%2016B" className="hover:text-[#f7a072] transition-colors">
                  Sector 16B & 16C
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              <span>Platform</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-300 list-none p-0 m-0">
              <li>
                <Link href="/about" className="hover:text-[#f7a072] transition-colors">
                  About Admission Pitara
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f7a072] transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#f7a072] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#f7a072] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Admission Pitara. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

