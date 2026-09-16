import React from 'react';
import Link from 'next/link';
import { getPopularSchools } from '../../../../src/lib/schools';
import { SchoolCard } from '../../../../src/components/school/SchoolCard';
import { SearchInput } from '../../../../src/components/ui/SearchInput';
import { Button } from '../../../../src/components/ui/Button';
import { School, Compass } from 'lucide-react';

export default function SchoolNotFound() {
  const popularSchools = getPopularSchools(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col items-center">
      <div className="text-center max-w-md mb-10">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-700">
          <School className="w-6 h-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-content)]">School Not Found</h1>
        <p className="text-xs text-[var(--color-content-muted)] mt-2 leading-relaxed">
          We could not find the requested school. It might have an updated name or profile. You can search our verified database or browse popular Greater Noida West institutions below.
        </p>

        <form action="/schools" method="GET" className="mt-6 flex gap-2">
          <SearchInput name="q" placeholder="Search school name..." />
          <Button type="submit" variant="primary" size="sm">
            Search
          </Button>
        </form>
      </div>

      <div className="w-full mt-6 pt-8 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[var(--color-content)]">
            Explore Popular Schools
          </h2>
          <Link href="/schools">
            <Button variant="outline" size="sm" rightIcon={<Compass className="w-4 h-4" />}>
              All Schools
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSchools.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>
    </div>
  );
}
