'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Lock, ArrowRight, X, Scale, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export interface WishlistModalTarget {
  slug: string;
  name: string;
  image?: string;
  area?: string;
}

interface WishlistLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSchool?: WishlistModalTarget | null;
}

export const WishlistLoginModal: React.FC<WishlistLoginModalProps> = ({
  isOpen,
  onClose,
  targetSchool,
}) => {
  const pathname = usePathname();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const redirectUrl = encodeURIComponent(pathname || '/schools');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white p-5 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-rose-400 text-rose-400" />
            </div>
            <div>
              <h3 id="wishlist-modal-title" className="text-base font-bold text-white tracking-tight">
                Save to Your Shortlist
              </h3>
              <p className="text-xs text-amber-200/90 mt-0.5">
                Private parent account required
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Target School Badge if available */}
          {targetSchool && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-rose-600 font-bold text-xs shrink-0 shadow-2xs">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {targetSchool.name}
                </p>
                {targetSchool.area && (
                  <p className="text-[11px] text-stone-600 truncate">
                    {targetSchool.area}, Greater Noida West
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Primary Instruction Message */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-stone-900 leading-snug">
              Please log in to save schools to your shortlist.
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Shortlists are permanently stored in your verified parent account so you can track admission deadlines, fee structures, and compare notes across visits and devices.
            </p>
          </div>

          {/* Benefit bullets */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Permanent cloud synchronization across mobile and laptop</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant alerts for 2026-27 admission cycle opening dates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% private — your shortlist is never shared or publicized</span>
            </div>
          </div>

          {/* Guest Comparison Tip */}
          <div className="text-[11px] text-stone-500 bg-blue-50/60 border border-blue-100 p-2.5 rounded-lg flex items-start gap-2">
            <Scale className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span className="leading-normal">
              <strong>Tip:</strong> You can use the temporary <strong>Compare</strong> tray right now without signing in.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/login?redirect=${redirectUrl}`}
                onClick={onClose}
                className="w-full"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs justify-center"
                  leftIcon={<LogIn className="w-3.5 h-3.5" />}
                >
                  Log in
                </Button>
              </Link>

              <Link
                href={`/register?redirect=${redirectUrl}`}
                onClick={onClose}
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="w-full bg-white border-amber-300 text-amber-900 hover:bg-amber-50 font-medium text-xs justify-center"
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  Create account
                </Button>
              </Link>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-full text-xs text-stone-500 hover:text-stone-800 justify-center"
            >
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
