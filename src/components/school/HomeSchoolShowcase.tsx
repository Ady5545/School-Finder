'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { SchoolCard } from './SchoolCard';
import { Button } from '../ui/Button';
import type { School } from '../../types/school';

interface HomeSchoolShowcaseProps {
  schools: School[];
}

type TabType = 'all' | 'techzone' | 'kp5' | 'sec16b' | 'cbse' | 'international';

export const HomeSchoolShowcase: React.FC<HomeSchoolShowcaseProps> = ({ schools }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const counts = useMemo(() => {
    return {
      all: schools.length,
      techzone: schools.filter(s => (s.location.sector || s.location.area || '').toLowerCase().includes('techzone')).length,
      kp5: schools.filter(s => (s.location.sector || s.location.area || '').toLowerCase().includes('knowledge park')).length,
      sec16b: schools.filter(s => (s.location.sector || s.location.area || '').toLowerCase().includes('16b')).length,
      cbse: schools.filter(s => {
        const boards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
        return boards.some(b => b.toUpperCase().includes('CBSE'));
      }).length,
      international: schools.filter(s => {
        const boards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
        return boards.some(b => b.toUpperCase().includes('IB') || b.toUpperCase().includes('IGSC') || b.toUpperCase().includes('CAMBRIDGE'));
      }).length,
    };
  }, [schools]);

  const filteredSchools = useMemo(() => {
    switch (activeTab) {
      case 'techzone':
        return schools.filter(s => (s.location.sector || s.location.area || '').toLowerCase().includes('techzone'));
      case 'kp5':
        return schools.filter(s => (s.location.sector || s.location.area || '').toLowerCase().includes('knowledge park'));
      case 'sec16b':
        return schools.filter(s => (s.location.sector || s.location.area || '').toLowerCase().includes('16b'));
      case 'international':
        return schools.filter(s => {
          const boards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
          return boards.some(b => b.toUpperCase().includes('IB') || b.toUpperCase().includes('IGSC') || b.toUpperCase().includes('CAMBRIDGE'));
        });
      case 'cbse':
        return schools.filter(s => {
          const boards = Array.isArray(s.board) ? s.board : [s.board].filter(Boolean) as string[];
          return boards.some(b => b.toUpperCase().includes('CBSE'));
        }).slice(0, 6);
      case 'all':
      default:
        return schools.slice(0, 6);
    }
  }, [schools, activeTab]);

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'all', label: 'All Campuses', count: counts.all },
    { id: 'techzone', label: 'Techzone 4', count: counts.techzone },
    { id: 'kp5', label: 'Knowledge Park 5', count: counts.kp5 },
    { id: 'sec16b', label: 'Sector 16B', count: counts.sec16b },
    { id: 'cbse', label: 'CBSE', count: counts.cbse },
    { id: 'international', label: 'IB & Cambridge', count: counts.international },
  ];

  return (
    <div className="w-full">
      {/* Category Tabs Ribbon */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-warm-xs'
                    : 'bg-white text-[var(--color-content-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#f4efe6] text-[var(--color-content-muted)]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          href="/schools"
          className="text-xs font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] inline-flex items-center gap-1.5 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Advanced Directory Filter →</span>
        </Link>
      </div>

      {/* Grid of Distinctive School Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredSchools.map((school, index) => (
          <div
            key={school.id}
            className="reveal-on-scroll"
            data-reveal-delay={String((index % 3) + 1)}
          >
            <SchoolCard school={school} />
          </div>
        ))}
      </div>

      {/* Clean Directory Link */}
      <div className="mt-10 sm:mt-12 text-center">
        <Link
          href="/schools"
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors group px-6 py-3 rounded-xl bg-white border border-[var(--color-border-strong)] hover:border-[var(--color-primary)] shadow-warm-xs hover:shadow-warm-sm"
        >
          <span>View all {schools.length} schools</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[var(--color-accent)]" />
        </Link>
      </div>
    </div>
  );
};
