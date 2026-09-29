'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { SchoolEditorModal } from '../../../../../components/admin/SchoolEditorModal';
import type { School } from '@data/schoolsData';

export default function AdminSchoolEditPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [school, setSchool] = useState<Partial<School> | null>(null);
  const [error, setError] = useState('');

  const slug = decodeURIComponent(String(params?.slug || ''));

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const loadSchool = async () => {
      try {
        const res = await fetch('/api/admin/schools/' + encodeURIComponent(slug), {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success || !data.school) {
          throw new Error(data.message || 'Could not load this school.');
        }

        if (!cancelled) setSchool(data.school);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load this school.');
        }
      }
    };

    void loadSchool();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <main className="min-h-screen bg-[#071322] text-slate-200 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-3xl border border-rose-500/20 bg-[#0f284a] p-7 shadow-2xl">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-white font-serif">Could not open school editor</h1>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </button>
        </div>
      </main>
    );
  }

  if (!school) {
    return (
      <main className="min-h-screen bg-[#071322] text-slate-200 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-2xl border border-[#1e4878] bg-[#0f284a] px-5 py-4 text-sm text-slate-300 shadow-xl">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          Loading school editor…
        </div>
      </main>
    );
  }

  return (
    <SchoolEditorModal
      isOpen
      pageMode
      onClose={() => router.push('/admin')}
      onSaved={() => {}}
      schoolToEdit={school}
      isNew={false}
    />
  );
}
