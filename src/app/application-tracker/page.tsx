import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ApplicationTrackerView } from '../../components/parent/ApplicationTrackerView';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata(
  'Application Tracker | Admission Pitara',
  'Track school application progress, notes, target dates and official application links in your private parent account.',
  '/application-tracker'
);

export default function ApplicationTrackerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Application Tracker', isCurrent: true }]} className="mb-4" />
      <ApplicationTrackerView />
    </div>
  );
}