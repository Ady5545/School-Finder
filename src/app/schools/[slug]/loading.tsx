import React from 'react';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function SchoolDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Skeleton variant="text" className="h-4 w-48 mb-6" />
      <div className="flex justify-between items-start pb-6 border-b border-slate-200 gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex gap-2">
            <Skeleton variant="rounded" className="h-6 w-16" />
            <Skeleton variant="rounded" className="h-6 w-24" />
          </div>
          <Skeleton variant="text" className="h-8 w-3/4 max-w-md" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
        <Skeleton variant="rounded" className="h-28 w-60 shrink-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton variant="rounded" className="w-full h-80" />
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-white">
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
            <Skeleton variant="text" className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton variant="rounded" className="w-full h-64" />
          <Skeleton variant="rounded" className="w-full h-48" />
        </div>
      </div>
    </div>
  );
}
