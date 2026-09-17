'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 w-full flex items-center justify-center flex-1">
      <div
        role="alert"
        className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 bg-rose-50/50 my-6 w-full"
      >
        <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-3.5">
          <svg className="w-6 h-6 stroke-[1.75]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-rose-950 mb-1">
          We encountered an unexpected error
        </h3>
        <p className="text-xs text-rose-700 max-w-sm mb-4 leading-relaxed">
          An unexpected system error occurred while displaying this page.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-900 bg-white border border-rose-300 rounded-xl hover:bg-rose-100/50 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
