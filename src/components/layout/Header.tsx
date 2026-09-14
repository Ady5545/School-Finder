'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Scale, Calendar, Menu, Search, User, GraduationCap, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Drawer } from '../ui/Drawer';
import { cn } from '../../lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Schools', href: '/schools', icon: <Compass className="w-4 h-4" /> },
    { label: 'Compare', href: '/compare', icon: <Scale className="w-4 h-4" /> },
    { label: 'Admissions', href: '/admissions', icon: <Calendar className="w-4 h-4" /> },
    { label: 'About', href: '/about', icon: null },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Wordmark */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-[var(--color-content)] leading-tight">
                Admission Pitara
              </span>
              <span className="text-[10px] font-medium text-[var(--color-content-muted)] tracking-wider uppercase">
                Greater Noida West
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5',
                  isActive(link.href)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)] font-semibold'
                    : 'text-[var(--color-content-muted)] hover:text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)]'
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/schools">
            <Button variant="outline" size="sm" leftIcon={<Search className="w-3.5 h-3.5" />}>
              Find a School
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" leftIcon={<User className="w-3.5 h-3.5" />}>
              Log in
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Affordances */}
        <div className="flex items-center gap-2 md:hidden">
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--color-content-muted)] uppercase tracking-wider px-2">
              Menu
            </span>
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)] font-semibold'
                    : 'text-[var(--color-content)] hover:bg-[var(--color-surface-subtle)]'
                )}
              >
                {link.icon || <Compass className="w-4 h-4 text-slate-400" />}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col gap-2.5">
            <Link href="/schools" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Find a School
              </Button>
            </Link>
            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" size="md" className="w-full">
                Log in
              </Button>
            </Link>
          </div>

          <div className="mt-auto pt-6 text-xs text-[var(--color-content-muted)] border-t border-[var(--color-border-subtle)]">
            <p className="font-medium text-[var(--color-content)]">Greater Noida West Edition</p>
            <p className="mt-1">Unbiased school discovery, fees, and admission insights for parents.</p>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
