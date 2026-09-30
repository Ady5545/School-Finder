'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, MapPin, Scale, ShieldCheck, Star } from 'lucide-react';
import { SchoolImage } from './SchoolImage';
import { AdmissionStatus } from './AdmissionStatus';
import { RatingDisplay } from '../ui/RatingDisplay';
import { CardFeeDisplay } from './CardFeeDisplay';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { cn } from '../../lib/utils';
import type { School } from '../../types/school';

export const MobileSchoolProfileHero: React.FC<{ school: School }> = ({ school }) => {
  const store = useSchoolStore();
  const { isAuthenticated } = useAuth();
  const saved = store.isInShortlist(school.slug);
  const boards = Array.isArray(school.board) ? school.board : [school.board].filter(Boolean) as string[];

  const toggleSave = () => {
    if (!isAuthenticated) {
      store.openAuthPrompt({
        slug: school.slug,
        name: school.name,
        image: school.assets.featured,
        area: school.location.area,
      });
      return;
    }
    store.toggleShortlist(school.slug, school.name);
  };

  return (
    <section className="mobile-profile-hero">
      <div className="mobile-profile-hero__image">
        <SchoolImage src={school.assets.featured} alt={school.name} aspectRatio="video" className="w-full h-full object-cover" />
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {boards.slice(0, 2).map(board => (
              <span key={board} className="mobile-home-chip mobile-home-chip--dark">{board}</span>
            ))}
            {school.schoolType && <span className="mobile-home-chip mobile-home-chip--dark">{school.schoolType}</span>}
          </div>
          <div className="mobile-profile-rating">
            <RatingDisplay score={school.rating.score} size="sm" showCount={false} />
          </div>
        </div>
      </div>

      <div className="mobile-profile-hero__body">
        <div className="flex items-start justify-between gap-10">
          <div className="min-w-0">
            <div className="mobile-profile-location">
              <MapPin className="w-3.5 h-3.5" />
              <span>{school.location.sector || school.location.area || 'Greater Noida West'}</span>
            </div>
            <h1>{school.name}</h1>
            {school.tagline && <p>{school.tagline}</p>}
          </div>
          <button
            type="button"
            onClick={toggleSave}
            className={cn('mobile-profile-save', saved && 'is-saved')}
            aria-label={saved ? 'Remove from shortlist' : 'Add to shortlist'}
          >
            <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
          </button>
        </div>

        <div className="mobile-profile-status-row">
          <AdmissionStatus admissions={school.admissions} showDate={false} />
          <div className="mobile-profile-verified"><ShieldCheck className="w-3.5 h-3.5" /> {school.verification?.isVerified ? 'Verified data' : 'Data status shown'}</div>
        </div>

        <div className="mobile-profile-price">
          <div className="min-w-0">
            <span className="mobile-profile-price__label">Annual fee shown</span>
            <CardFeeDisplay slug={school.slug} fees={school.fees} />
          </div>
          <div className="mobile-profile-score">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <strong>{school.rating.score.toFixed(1)}</strong>
            <span>{school.rating.reviewsCount} reviews</span>
          </div>
        </div>

        <div className="mobile-profile-actions-row">
          <Link href="#fee-breakdown-section" className="mobile-profile-hero-action mobile-profile-hero-action--primary">
            View fees <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/compare" className="mobile-profile-hero-action mobile-profile-hero-action--secondary">
            <Scale className="w-3.5 h-3.5" /> Compare
          </Link>
        </div>
      </div>
    </section>
  );
};
