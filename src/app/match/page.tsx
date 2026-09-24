import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { SchoolMatchView } from '../../components/school/SchoolMatchView';
import { buildPageMetadata } from '../../lib/seo';
import { getAllSchoolsAsync } from '../../lib/schoolsServer';

export const metadata = buildPageMetadata(
  'School Match | Admission Pitara',
  'Match Greater Noida schools to transparent board, area, grade, fee and admission preferences.',
  '/match'
);

export default async function MatchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'School Match', isCurrent: true }]} className="mb-4" />
      <SchoolMatchView schools={await getAllSchoolsAsync()} />
    </div>
  );
}