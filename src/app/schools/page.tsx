import React from 'react';
import { getAllSchools, getDistinctBoards, getDistinctAreas } from '../../lib/schools';
import { SchoolDirectory } from '../../components/school/SchoolDirectory';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'Schools in Greater Noida West',
  'Browse and discover verified top schools in Greater Noida West and Noida Extension with audited fees, boards, and facilities.',
  '/schools'
);

export const dynamic = 'force-dynamic';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Schools', isCurrent: true }]} className="mb-4" />

      {/* Header */}
      <div className="pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Schools in Greater Noida West & Noida Extension
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Explore verified profiles, fee breakdowns, curriculum details, and admissions status for all {allSchools.length} institutions.
        </p>
      </div>

      {/* Directory Component with Search, Filters, Sort, and Compare */}
      <SchoolDirectory
        initialSchools={allSchools}
        distinctBoards={boards}
        distinctAreas={areas}
        initialQuery={q}
        initialBoard={selectedBoard}
        initialArea={selectedArea}
      />
    </div>
  );
}

