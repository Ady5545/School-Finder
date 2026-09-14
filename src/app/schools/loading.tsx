import React from 'react';
import { Skeleton } from '../../components/ui/Skeleton';

export default function SchoolsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Skeleton variant="text" className="h-4 w-32 mb-4" />
      <div className="flex justify-between items-end pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <Skeleton variant="text" className="h-8 w-64" />
          <Skeleton variant="text" className="h-4 w-40" />
        </div>
        <Skeleton variant="rounded" className="h-10 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <Skeleton variant="rounded" className="w-full h-48" />
            <Skeleton variant="text" className="h-5 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2" />
            <Skeleton variant="text" className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
