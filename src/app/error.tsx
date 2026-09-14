'use client';

import React, { useEffect } from 'react';
import { ErrorState } from '../components/ui/ErrorState';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 w-full flex items-center justify-center flex-1">
      <ErrorState
        title="We encountered an unexpected error"
        message="An unexpected system error occurred while displaying this page. Our team has been notified."
        onRetry={() => reset()}
        className="w-full"
      />
    </div>
  );
}
