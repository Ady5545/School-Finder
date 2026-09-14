import React from 'react';
import Link from 'next/link';
import { getPopularSchools } from '../lib/schools';
import { SchoolCard } from '../components/school/SchoolCard';
import { SearchInput } from '../components/ui/SearchInput';
import { Button } from '../components/ui/Button';
import { Compass, HelpCircle } from 'lucide-react';

export default function NotFound() {
  const popularSchools = getPopularSchools(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col items-center">
      <div className="text-center max-w-lg mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-4 text-[var(--color-content-muted)]">
          <HelpCircle className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          School or Page Not Found
        </h1>
        <p className="text-sm text-[var(--color-content-muted)] mt-2 leading-relaxed">
          The school or page you are looking for may have moved or been updated. Use the search bar below or explore popular institutions in Greater Noida West.
        </p>

        <form action="/schools" method="GET" className="mt-6 flex flex-col sm:flex-row gap-2">
          <SearchInput name="q" placeholder="Search by school name, sector, or board..." />
          <Button type="submit" variant="primary" size="md" className="shrink-0">
            Search
          </Button>
        </form>
      </div>

      {popularSchools.length > 0 && (
        <div className="w-full mt-8 pt-8 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[var(--color-content)]">
                Popular Schools in Greater Noida West
              </h2>
              <p className="text-xs text-[var(--color-content-muted)]">
                High parent interest and verified institutional information
              </p>
            </div>
            <Link href="/schools">
              <Button variant="outline" size="sm" rightIcon={<Compass className="w-4 h-4" />}>
                View All 17 Schools
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularSchools.map(school => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
