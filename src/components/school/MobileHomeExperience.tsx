'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Compass, Heart, Scale, ShieldCheck } from 'lucide-react';
import { HomeSearch } from './HomeSearch';
import { SchoolImage } from './SchoolImage';
import { RatingDisplay } from '../ui/RatingDisplay';
import { CardFeeDisplay } from './CardFeeDisplay';
import type { School } from '../../types/school';
import { useSchoolStore } from '../../lib/schoolStore';
import { useAuth } from '../../lib/authContext';
import { cn } from '../../lib/utils';

interface MobileHomeExperienceProps { schools: School[]; }

const boardsFor = (school: School) => {
  const boards = Array.isArray(school.board) ? school.board : [school.board].filter(Boolean) as string[];
  return boards.slice(0, 2);
};

const MobileSchoolCard: React.FC<{ school: School }> = ({ school }) => {
  const { isAuthenticated } = useAuth();
  const store = useSchoolStore();
  const saved = store.isInShortlist(school.slug);

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
    <article className="mobile-home-school-card">
      <Link href={'/schools/' + school.slug} className="block">
        <div className="mobile-home-school-card__image">
          <SchoolImage src={school.assets.featured} alt={school.name} aspectRatio="video" className="w-full h-full object-cover" />
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
            <div className="flex gap-1.5 flex-wrap">
              {boardsFor(school).map(board => <span key={board} className="mobile-home-chip mobile-home-chip--dark">{board}</span>)}
            </div>
            <div className="mobile-home-rating"><RatingDisplay score={school.rating.score} size="sm" showCount={false} /></div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8b98a9]">{school.location.sector || school.location.area}</p>
            <Link href={'/schools/' + school.slug}><h3 className="mt-1 text-[16px] leading-tight font-black text-[#112238] line-clamp-2">{school.name}</h3></Link>
          </div>
          <button type="button" onClick={toggleSave} aria-label={saved ? 'Remove ' + school.name + ' from shortlist' : 'Save ' + school.name + ' to shortlist'} className={cn('shrink-0 w-10 h-10 rounded-full flex items-center justify-center border', saved ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-[#78879a] border-[#e6e1d8]')}>
            <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
          </button>
        </div>

        <p className="mt-2 text-[12px] leading-relaxed text-[#5f6f83] line-clamp-2">{school.tagline || school.summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="mobile-home-chip">{school.studentTeacherRatio} ratio</span>
          {boardsFor(school).map(board => <span key={board} className="mobile-home-chip">{board}</span>)}
        </div>

        <div className="mt-4 pt-3 border-t border-[#eee8df] flex items-end justify-between gap-3">
          <div className="min-w-0"><CardFeeDisplay slug={school.slug} fees={school.fees} /></div>
          <Link href={'/schools/' + school.slug} className="mobile-home-card-link">View <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
      </div>
    </article>
  );
};

export const MobileHomeExperience: React.FC<MobileHomeExperienceProps> = ({ schools }) => {
  const featured = useMemo(() => schools.filter(s => s.assets?.featured).slice(0, 8), [schools]);

  return (
    <div className="mobile-home">
      <section className="mobile-home-hero">
        <div className="mobile-home-hero__eyebrow"><span className="mobile-dot" /> Greater Noida West • School discovery</div>
        <h1>Find the right school.<br /><span>With clarity.</span></h1>
        <p>Fees, boards, facilities, reviews and admissions — brought together for parents.</p>
        <div className="mobile-home-search"><HomeSearch initialSchools={schools} className="w-full" /></div>

        <div className="mobile-home-actions">
          <Link href="/schools" className="mobile-home-primary-action"><Compass className="w-4 h-4" /> Browse schools</Link>
          <Link href="/compare" className="mobile-home-secondary-action"><Scale className="w-4 h-4" /> Compare</Link>
        </div>

        <div className="mobile-home-quick-row">
          <Link href="/schools?board=CBSE" className="mobile-home-quick">CBSE</Link>
          <Link href="/admissions" className="mobile-home-quick">Admissions 2027–28</Link>
          <Link href="/schools" className="mobile-home-quick">Find nearby</Link>
        </div>
      </section>

      <section className="mobile-home-section mobile-home-section--tight">
        <div className="mobile-section-heading">
          <div><p className="mobile-section-kicker">Start here</p><h2>What matters to your family?</h2></div>
          <Link href="/schools" className="text-xs font-bold text-[#183b5d]">See all</Link>
        </div>

        <div className="mobile-home-shortcuts">
          <Link href="/schools" className="mobile-shortcut"><span className="mobile-shortcut__icon mobile-shortcut__icon--navy"><Compass className="w-4 h-4" /></span><span><strong>Discover</strong><small>Browse schools</small></span></Link>
          <Link href="/compare" className="mobile-shortcut"><span className="mobile-shortcut__icon mobile-shortcut__icon--green"><Scale className="w-4 h-4" /></span><span><strong>Compare</strong><small>See differences</small></span></Link>
          <Link href="/admissions" className="mobile-shortcut"><span className="mobile-shortcut__icon mobile-shortcut__icon--amber"><Calendar className="w-4 h-4" /></span><span><strong>Admissions</strong><small>2027–28 status</small></span></Link>
          <Link href="/wishlist" className="mobile-shortcut"><span className="mobile-shortcut__icon mobile-shortcut__icon--red"><Heart className="w-4 h-4" /></span><span><strong>Shortlist</strong><small>Save favourites</small></span></Link>
        </div>
      </section>

      <section className="mobile-home-section">
        <div className="mobile-section-heading">
          <div><p className="mobile-section-kicker">Featured</p><h2>Schools to explore</h2></div>
          <Link href="/schools" className="text-xs font-bold text-[#183b5d]">View all</Link>
        </div>
        <div className="mobile-home-scroll-row" role="region" aria-label="Featured schools">
          {featured.map(school => <MobileSchoolCard key={school.id} school={school} />)}
        </div>
      </section>

      <section className="mobile-home-trust">
        <div className="mobile-trust-card">
          <div className="mobile-trust-icon"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#718095]">Built for parent decisions</p>
            <h2 className="mt-1 text-[18px] font-black text-[#112238]">Look at the same things for every school.</h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5f6f83]">Fees, board, grades, facilities, transport, reviews and admissions — organized in one place.</p>
          </div>
        </div>
        <div className="mobile-trust-grid">
          <div><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Source-aware data</span></div>
          <div><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Side-by-side comparison</span></div>
          <div><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Parent shortlist</span></div>
          <div><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Admission tracking</span></div>
        </div>
      </section>

      <section className="mobile-home-section mobile-home-final">
        <p className="mobile-section-kicker">Ready when you are</p>
        <h2>Start with schools, not spreadsheets.</h2>
        <p>Discover, compare and shortlist the schools that fit your family.</p>
        <Link href="/schools" className="mobile-home-primary-action w-full justify-center">Explore schools <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </div>
  );
};
