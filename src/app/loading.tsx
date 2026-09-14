import React from 'react';
import { Skeleton } from '../components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div className="space-y-4 mb-8">
        <Skeleton variant="text" className="h-8 w-64" />
        <Skeleton variant="text" className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <Skeleton variant="rounded" className="w-full h-48" />
            <Skeleton variant="text" className="h-5 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2" />
            <div className="pt-2 flex justify-between">
              <Skeleton variant="text" className="h-4 w-24" />
              <Skeleton variant="text" className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
