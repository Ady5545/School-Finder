'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Scale, Calendar, Menu, Search, User, Heart, ShieldCheck, LayoutDashboard, X, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Drawer } from '../ui/Drawer';
import { BrandLogo } from '../ui/BrandLogo';
import { NotificationCenter } from './NotificationCenter';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { cn } from '../../lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const { shortlist, compareList } = useSchoolStore();
  const { user, isAuthenticated } = useAuth();

  // Sync navbar search with URL query when on /schools
  useEffect(() => {
    if (typeof window !== 'undefined' && pathname === '/schools') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      setNavSearch(q);
    }
  }, [pathname]);

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = navSearch.trim();
    if (pathname === '/schools') {
      const params = new URLSearchParams(window.location.search);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      const newUrl = `/schools${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
      window.dispatchEvent(new CustomEvent('nav-search-change', { detail: query }));
    } else {
      router.push(`/schools${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    }
  };

  const handleNavSearchChange = (val: string) => {
    setNavSearch(val);
    if (pathname === '/schools') {
      const params = new URLSearchParams(window.location.search);
      if (val.trim()) {
        params.set('q', val.trim());
      } else {
        params.delete('q');
      }
      const newUrl = `/schools${params.toString() ? '?' + params.toString() : ''}`;
      window.history.replaceState({}, '', newUrl);
      window.dispatchEvent(new CustomEvent('nav-search-change', { detail: val.trim() }));
    }
  };

  const navLinks = [
    { label: 'Schools', href: '/schools', icon: <Compass className="w-4 h-4" /> },
    {
      label: 'Compare',
      href: '/compare',
      icon: <Scale className="w-4 h-4" />,
      badge: compareList.length > 0 ? compareList.length : null,
      badgeColor: 'bg-[var(--color-accent)] text-white',
    },
    { label: 'Admissions 2026-27', href: '/admissions', icon: <Calendar className="w-4 h-4" /> },
    {
      label: 'Shortlist',
      href: '/wishlist',
      icon: <Heart className="w-4 h-4" />,
      badge: shortlist.length > 0 ? shortlist.length : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    { label: 'About', href: '/about', icon: null },
    { label: 'Reviews', href: '/reviews', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fcfbf9]/95 backdrop-blur-md border-t-2 border-t-[var(--color-accent)] border-b border-[var(--color-border)] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand Mark */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center" aria-label="Admission Pitara Home">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 relative',
                  isActive(link.href)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[var(--color-brand-200)]/70 font-bold shadow-2xs'
                    : 'text-[var(--color-content-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-subtle)]/70'
                )}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight shrink-0',
                      link.badgeColor || 'bg-[var(--color-accent)] text-white'
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Search Field */}
        <div className="hidden sm:flex items-center flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-3">
          <form onSubmit={handleNavSearchSubmit} className="relative w-full">
            <label htmlFor="nav-school-search" className="sr-only">
              Search schools, sectors, boards
            </label>
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                id="nav-school-search"
                type="text"
                value={navSearch}
                onChange={e => handleNavSearchChange(e.target.value)}
                placeholder="Search schools, sectors, boards..."
                className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-[var(--color-border-strong)] bg-white/95 text-xs text-[var(--color-content)] placeholder:text-[var(--color-content-muted)]/70 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-all shadow-2xs"
              />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => handleNavSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link href="/wishlist">
            <IconButton
              aria-label={`Shortlisted Schools (${shortlist.length})`}
              size="sm"
              variant={shortlist.length > 0 ? 'secondary' : 'ghost'}
              className="relative"
            >
              <Heart className={cn('w-4 h-4', shortlist.length > 0 ? 'text-rose-600 fill-rose-500' : 'text-slate-600')} />
              {shortlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {shortlist.length}
                </span>
              )}
            </IconButton>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5">
              <NotificationCenter />
              {user.role === 'admin' && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  >
                    Admin Audit
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs font-bold border border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100"
                  leftIcon={<LayoutDashboard className="w-3.5 h-3.5 text-sky-700" />}
                >
                  <span>{user.name.split(' ')[0]}</span>
                  {user.emailVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" leftIcon={<User className="w-3.5 h-3.5" />} className="text-xs font-semibold text-[var(--color-primary)]">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="accent" size="sm" className="text-xs font-bold">
                  Parent Signup
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Affordances */}
        <div className="flex items-center gap-1.5 sm:hidden">
          {isAuthenticated && user && <NotificationCenter />}
          <Link href="/schools" aria-label="Search schools">
            <IconButton
              aria-label="Search schools"
              size="sm"
              variant="ghost"
              className="text-[var(--color-content)]"
            >
              <Search className="w-5 h-5" />
            </IconButton>
          </Link>
          <Link href="/wishlist" aria-label={`Shortlist (${shortlist.length})`}>
            <IconButton
              aria-label={`Shortlist (${shortlist.length})`}
              size="sm"
              variant="ghost"
              className="relative text-[var(--color-content)]"
            >
              <Heart className={cn('w-5 h-5', shortlist.length > 0 && 'text-rose-500 fill-rose-500')} />
              {shortlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                  {shortlist.length}
                </span>
              )}
            </IconButton>
          </Link>
          <IconButton
            aria-label="Open mobile menu"
            size="sm"
            variant="outline"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Admission Pitara"
        side="right"
      >
        <div className="flex flex-col gap-5">
          {/* Mobile Drawer Integrated Search */}
          <form
            onSubmit={e => {
              handleNavSearchSubmit(e);
              setIsMobileMenuOpen(false);
            }}
            className="relative w-full"
          >
            <label htmlFor="mobile-nav-search" className="sr-only">
              Search schools, sectors, boards
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="mobile-nav-search"
                type="text"
                value={navSearch}
                onChange={e => handleNavSearchChange(e.target.value)}
                placeholder="Search schools, sectors, boards..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[var(--color-border-strong)] bg-white text-xs text-[var(--color-content)] placeholder:text-[var(--color-content-muted)]/70 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-all shadow-2xs"
              />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => handleNavSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
          {isAuthenticated && user && (
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white font-bold flex items-center justify-center shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-sky-950 truncate">{user.name}</span>
                  {user.emailVerified && <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />}
                </div>
                <span className="text-[11px] text-sky-700 truncate block">{user.preferredSchoolLocality || 'Parent Account'}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[var(--color-content-muted)] uppercase tracking-wider px-2 mb-1">
              Navigation
            </span>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)] font-semibold'
                    : 'text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)]'
                )}
              >
                <div className="flex items-center gap-3">
                  {link.icon || <Compass className="w-4 h-4 text-slate-400" />}
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={cn(
                      'text-xs font-bold px-2 py-0.5 rounded-full',
                      link.badgeColor || 'bg-[var(--color-primary)] text-white'
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive('/dashboard')
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)] font-semibold'
                      : 'text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-sky-600" />
                    <span>Parent Dashboard</span>
                  </div>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive('/admin')
                        ? 'text-amber-800 bg-amber-50 font-semibold'
                        : 'text-amber-700 hover:bg-amber-50/70'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Admin Telemetry</span>
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col gap-2.5">
            <Link href="/schools" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Explore All Schools
              </Button>
            </Link>
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full text-xs">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full text-xs font-bold">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>

          <div className="mt-auto pt-6 text-xs text-[var(--color-content-muted)] border-t border-[var(--color-border-subtle)]">
            <p className="font-bold text-[var(--color-content)]">Admission Pitara — Greater Noida</p>
            <p className="mt-1 leading-relaxed text-[11px]">
              Find the right school in Greater Noida with parent-first intelligence, verified fee breakdowns, and unbiased comparisons.
            </p>
          </div>
        </div>
      </Drawer>
    </header>
  );
};


