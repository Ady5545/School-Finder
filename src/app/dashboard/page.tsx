import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Compass, Heart, Scale } from 'lucide-react';
import { buildPageMetadata } from '../../lib/seo';

export const metadata = buildPageMetadata('Parent Dashboard', 'Manage your shortlisted schools, compare lists, and admission alerts.', '/dashboard');

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
      <Breadcrumbs items={[{ label: 'Parent Dashboard', isCurrent: true }]} className="mb-4" />

      <div className="pb-6 border-b border-[var(--color-border)] mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight">
          Parent Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1">
          Manage your saved institutions, active comparison boards, and application timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Shortlisted Schools</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-[var(--color-content-muted)]">
              You have 0 saved schools in your shortlist.
            </p>
            <Link href="/schools">
              <Button variant="outline" size="sm">
                Explore Schools
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Active Comparisons</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-[var(--color-content-muted)]">
              No schools currently added to comparison tray.
            </p>
            <Link href="/compare">
              <Button variant="outline" size="sm">
                Open Compare Tool
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Greater Noida West Schools</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-[var(--color-content-muted)]">
              Browse all 17 institutions across CBSE, IB, and Cambridge boards.
            </p>
            <Link href="/schools">
              <Button variant="primary" size="sm">
                Browse Directory
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
