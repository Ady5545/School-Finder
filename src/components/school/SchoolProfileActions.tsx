'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Scale, Share2, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

export const SchoolProfileActions: React.FC<{ school: School }> = ({ school }) => {
  const router = useRouter();
  const { isInShortlist, toggleShortlist, isInCompare, toggleCompare, compareList, openAuthPrompt } = useSchoolStore();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const isSaved = isInShortlist(school.slug);
  const isCompared = isInCompare(school.slug);

  const handleToggleShortlist = async () => {
    if (!isAuthenticated) {
      openAuthPrompt({
        slug: school.slug,
        name: school.name,
        image: school.assets.featured,
        area: school.location.area,
      });
      return;
    }

    toggleShortlist(school.slug, school.name);

    // Sync with backend API
    try {
      await fetch('/api/auth/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: school.slug, action: 'toggle' }),
      });
    } catch {
      // Local state already updated
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* Shortlist Button */}
      <button
        type="button"
        onClick={handleToggleShortlist}
        className={cn(
          'w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs',
          isSaved
            ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
            : 'bg-white border-[var(--color-border)] text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        )}
      >
        <Heart className={cn('w-4 h-4', isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400')} />
        <span>{isSaved ? 'Saved in Shortlist' : 'Add to Shortlist'}</span>
      </button>

      {/* Compare Button */}
      <button
        type="button"
        onClick={() => toggleCompare(school.slug, school.name)}
        className={cn(
          'w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs',
          isCompared
            ? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]'
            : 'bg-white border-[var(--color-border)] text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        )}
      >
        <Scale className="w-4 h-4" />
        <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
      </button>

      {/* Quick Link to Compare if >= 2 */}
      {isCompared && compareList.length >= 2 && (
        <Link href="/compare" className="w-full">
          <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
            View Comparison ({compareList.length}) →
          </Button>
        </Link>
      )}

      {/* Official Website Button */}
      {school.contact.website && (
        <a
          href={school.contact.website}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs font-bold"
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Official Website
          </Button>
        </a>
      )}

      {/* Share School Link */}
      <button
        type="button"
        onClick={handleShare}
        className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600 font-bold">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Share School</span>
          </>
        )}
      </button>
    </div>
  );
};
