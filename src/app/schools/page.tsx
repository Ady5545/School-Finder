import React from 'react';
import { getAllSchools, filterSchools, getDistinctBoards, getDistinctAreas } from '../../lib/schools';
import { SchoolCard } from '../../components/school/SchoolCard';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { buildPageMetadata } from '../../lib/seo';
import Link from 'next/link';

export const metadata = buildPageMetadata(
  'Schools in Greater Noida West',
  'Browse and discover all 17 top schools in Greater Noida West and Noida Extension with verified fees, boards, and facilities.',
  '/schools'
);

interface SchoolsPageProps {
  searchParams: Promise<{
    q?: string;
    board?: string;
    area?: string;
  }>;
}

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
  const params = await searchParams;
  const q = params.q || '';
  const selectedBoard = params.board || '';
  const selectedArea = params.area || '';

  const allSchools = getAllSchools();
  const boards = getDistinctBoards();
  const areas = getDistinctAreas();

  const filteredSchools = filterSchools({
    searchQuery: q,
    board: selectedBoard ? [selectedBoard] : undefined,
    area: selectedArea ? [selectedArea] : undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Schools', isCurrent: true }]} className="mb-4" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
            Schools in Greater Noida West
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
            Showing {filteredSchools.length} of {allSchools.length} educational institutions
          </p>
        </div>

        {/* Search Input Form */}
        <form method="GET" action="/schools" className="w-full md:w-80">
          <SearchInput
            name="q"
            defaultValue={q}
            placeholder="Filter by name, sector, board..."
            containerClassName="w-full"
          />
        </form>
      </div>

      {/* Filter Badges / Pills */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        <span className="text-xs font-semibold text-[var(--color-content-muted)] mr-1">Filter by Board:</span>
        <Link
          href="/schools"
          className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
            !selectedBoard
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-semibold'
              : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-slate-400'
          }`}
        >
          All
        </Link>
        {boards.map(b => (
          <Link
            key={b}
            href={`/schools?board=${encodeURIComponent(b)}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              selectedBoard === b
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-semibold'
                : 'bg-white text-[var(--color-content-muted)] border-[var(--color-border)] hover:border-slate-400'
            }`}
          >
            {b}
          </Link>
        ))}
      </div>

      {/* School Cards Grid or Empty State */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredSchools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No schools found"
          description={`We could not find any schools matching your search "${q}". Try clearing filters or searching by a broader sector name.`}
          actionLabel="View All Schools"
          actionHref="/schools"
        />
      )}
    </div>
  );
}
