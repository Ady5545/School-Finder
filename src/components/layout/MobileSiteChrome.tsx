'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Compass, Scale, Heart, Menu, Search, Calendar, MessageSquare,
  ClipboardList, SlidersHorizontal, X, LayoutDashboard, ShieldCheck,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { IconButton } from '../ui/IconButton';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { cn } from '../../lib/utils';

const links = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Schools', href: '/schools', icon: Compass },
  { label: 'Compare', href: '/compare', icon: Scale },
  { label: 'Admissions', href: '/admissions', icon: Calendar },
  { label: 'Reviews', href: '/reviews', icon: MessageSquare },
  { label: 'School Match', href: '/match', icon: SlidersHorizontal },
  { label: 'Applications', href: '/application-tracker', icon: ClipboardList },
  { label: 'About', href: '/about', icon: null },
];

export const MobileSiteChrome: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { shortlist, compareList } = useSchoolStore();
  const { user, isAuthenticated } = useAuth();

  const active = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header className="mobile-site-header lg:hidden">
        <div className="mobile-site-header__inner">
          <Link href="/" aria-label="Admission Pitara Home" className="min-w-0 flex-1">
            <BrandLogo size="sm" subtext="" className="max-w-full" />
          </Link>
          <div className="flex items-center gap-1 shrink-0">
            <Link href="/schools" aria-label="Search schools">
              <IconButton aria-label="Search schools" size="md" variant="ghost" className="text-slate-800">
                <Search className="w-[19px] h-[19px]" />
              </IconButton>
            </Link>
            <Link href="/wishlist" aria-label={"Shortlist (" + shortlist.length + ")"} className="relative">
              <IconButton aria-label={"Shortlist (" + shortlist.length + ")"} size="md" variant="ghost" className="text-slate-800">
                <Heart className={cn('w-[19px] h-[19px]', shortlist.length > 0 && 'fill-rose-500 text-rose-500')} />
              </IconButton>
              {shortlist.length > 0 && <span className="mobile-nav-badge">{shortlist.length}</span>}
            </Link>
          </div>
        </div>
      </header>

      <nav className="mobile-bottom-nav lg:hidden" aria-label="Primary">
        <Link href="/" className={cn('mobile-bottom-nav__item', active('/') && 'is-active')}>
          <Home className="w-[19px] h-[19px]" /><span>Home</span>
        </Link>
        <Link href="/schools" className={cn('mobile-bottom-nav__item', active('/schools') && 'is-active')}>
          <Compass className="w-[19px] h-[19px]" /><span>Schools</span>
        </Link>
        <Link href="/compare" className={cn('mobile-bottom-nav__item', active('/compare') && 'is-active')}>
          <span className="relative"><Scale className="w-[19px] h-[19px]" />{compareList.length > 0 && <span className="mobile-nav-badge">{compareList.length}</span>}</span>
          <span>Compare</span>
        </Link>
        <Link href="/wishlist" className={cn('mobile-bottom-nav__item', active('/wishlist') && 'is-active')}>
          <span className="relative"><Heart className={cn('w-[19px] h-[19px]', shortlist.length > 0 && 'fill-rose-500')} />{shortlist.length > 0 && <span className="mobile-nav-badge">{shortlist.length}</span>}</span>
          <span>Saved</span>
        </Link>
        <button type="button" onClick={() => setMenuOpen(true)} className={cn('mobile-bottom-nav__item', menuOpen && 'is-active')} aria-label="Open menu">
          <Menu className="w-[19px] h-[19px]" /><span>Menu</span>
        </button>
      </nav>

      <Drawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Admission Pitara" side="right">
        <div className="flex flex-col h-full min-h-0">
          <div className="mobile-menu-hero">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#66758a]">Family workspace</p>
                <p className="mt-1 text-lg font-black text-[#102238]">
                  {isAuthenticated && user ? 'Hi, ' + user.name.split(' ')[0] : 'Find your next school'}
                </p>
              </div>
              <IconButton aria-label="Close menu" size="md" variant="ghost" onClick={() => setMenuOpen(false)}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#596a7e]">
              Keep school discovery, comparison and admissions in one simple place.
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto py-2">
            <div className="mobile-menu-section-title">Explore</div>
            {links.map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={cn('mobile-menu-link', active(link.href) && 'is-active')}>
                  <span className="flex items-center gap-3 min-w-0">
                    {Icon ? <Icon className="w-[18px] h-[18px] shrink-0" /> : <Compass className="w-[18px] h-[18px] shrink-0" />}
                    <span className="truncate">{link.label}</span>
                  </span>
                  <span className="text-[#a1adbb]">›</span>
                </Link>
              );
            })}

            <div className="mobile-menu-section-title mt-4">Your tools</div>
            <Link href="/wishlist" onClick={() => setMenuOpen(false)} className={cn('mobile-menu-link', active('/wishlist') && 'is-active')}>
              <span className="flex items-center gap-3"><Heart className="w-[18px] h-[18px]" /> Shortlist <span className="ml-auto text-[10px] font-black bg-[#f3eeee] text-[#a94a4a] rounded-full px-2 py-0.5">{shortlist.length}</span></span>
              <span className="text-[#a1adbb]">›</span>
            </Link>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
              <span className="flex items-center gap-3"><LayoutDashboard className="w-[18px] h-[18px]" /> Parent Dashboard</span>
              <span className="text-[#a1adbb]">›</span>
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="mobile-menu-link">
                <span className="flex items-center gap-3 text-amber-800"><ShieldCheck className="w-[18px] h-[18px]" /> Admin Audit</span>
                <span className="text-[#a1adbb]">›</span>
              </Link>
            )}
          </div>

          <div className="pt-3 pb-safe border-t border-[#ece6dc]">
            <Link href="/schools" onClick={() => setMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">Explore schools</Button>
            </Link>
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">Sign in</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full font-bold">Create account</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};
