import React from 'react';
import { getAllSchoolsAsync, getDistinctBoardsAsync, getDistinctAreasAsync } from '../../lib/schoolsServer';
import { SchoolDirectory } from '../../components/school/SchoolDirectory';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { buildPageMetadata, generateSchoolDirectoryJsonLd } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'Schools in Greater Noida West & Noida Extension',
  'Browse schools in Greater Noida, Greater Noida West and Noida Extension. Compare fees, boards, facilities, student-teacher ratios and current admission information.',
  '/schools'
);

interface SchoolsPageProps {
  searchParams: Promise<{
    q?: string;
    board?: string;
    area?: string;
    sports?: string;
    admission?: string;
    grade?: string;
    sibling?: string;
    fee?: string;
    sort?: string;
    curriculum?: string;
    transport?: string;
    trust?: string;
  }>;
}

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
  const params = await searchParams;
  const q = params.q || '';
  const selectedBoard = params.board || '';
  const selectedArea = params.area || '';
  const selectedSports = params.sports ? params.sports.split(',').map(s => s.trim()).filter(Boolean) : [];
  const selectedAdmission = params.admission || 'all';
  const selectedGrade = params.grade || 'all';
  const initialSibling = params.sibling === 'true';
  const selectedFee = params.fee || 'all';
  const initialSort = params.sort || 'featured';
  const initialCurriculum = params.curriculum || '';
  const initialTransport = params.transport || 'all';
  const initialTrust = params.trust || 'all';

  const [allSchools, boards, areas] = await Promise.all([
    getAllSchoolsAsync(),
    getDistinctBoardsAsync(),
    getDistinctAreasAsync(),
  ]);

  const directoryJsonLd = generateSchoolDirectoryJsonLd(allSchools);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directoryJsonLd) }}
      />
      <Breadcrumbs items={[{ label: 'Schools', isCurrent: true }]} className="mb-4" />

      <div className="pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Schools in Greater Noida West &amp; Noida Extension
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Explore school profiles, fee breakdowns, curriculum details, and admissions status across Greater Noida, Greater Noida West and Noida Extension.
        </p>
      </div>

      <SchoolDirectory
        initialSchools={allSchools}
        distinctBoards={boards}
        distinctAreas={areas}
        initialQuery={q}
        initialBoard={selectedBoard}
        initialArea={selectedArea}
        initialSports={selectedSports}
        initialAdmissionStatus={selectedAdmission}
        initialGrade={selectedGrade}
        initialSiblingOnly={initialSibling}
        initialFeeTier={selectedFee}
        initialSortBy={initialSort}
        initialCurriculum={initialCurriculum}
        initialTransport={initialTransport}
        initialTrust={initialTrust}
      />
    </div>
  );
}
