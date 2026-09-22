'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Car, Footprints, Heart, MapPin, RefreshCw, ShieldCheck, Store, Navigation } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useSchoolStore } from '../../lib/schoolStore';
import { Button } from '../ui/Button';
const SchoolRunMap = dynamic(() => import('./SchoolRunMap'), { ssr: false });

type SchoolRunData = {
  origin: { lat: number; lng: number; label: string };
  schools: Array<{ slug: string; name: string; shortName: string; sector: string; address: string; point: { lat:number; lng:number; label:string }; driving: {distanceKm:number; durationMin:number; coordinates:[number,number][]; provider:string}|null; walking: {distanceKm:number; durationMin:number; coordinates:[number,number][]; provider:string}|null }>;
};

export default function SchoolRunContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { shortlist } = useSchoolStore();
  const [data,setData]=useState<SchoolRunData|null>(null);
  const [error,setError]=useState<{code?:string;message:string}|null>(null);
  const [loading,setLoading]=useState(true);
  const [activeSlug,setActiveSlug]=useState<string|null>(null);
  const load=async()=>{setLoading(true);setError(null);try{const response=await fetch('/api/school-run',{cache:'no-store'});const payload=await response.json();if(!response.ok||!payload.success){setError({code:payload.code,message:payload.message||'School Run could not load.'});setData(null);return;}setData(payload);setActiveSlug(payload.schools?.[0]?.slug||null);}catch{setError({message:'We could not connect to School Run. Please try again.'});}finally{setLoading(false);}};
  useEffect(()=>{if(!isLoading&&isAuthenticated) load();else if(!isLoading)setLoading(false);},[isLoading,isAuthenticated,shortlist.join('|')]);
  if(isLoading||loading)return <div className="py-16 text-center text-sm text-[var(--color-content-muted)]">Preparing your school run map…</div>;
  if(!isAuthenticated)return <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-warm-xs"><ShieldCheck className="w-10 h-10 mx-auto text-[var(--color-primary)] mb-3"/><h2 className="text-xl font-black text-[var(--color-content)]">Your School Run is private</h2><p className="text-sm text-[var(--color-content-muted)] max-w-lg mx-auto mt-2 mb-5">Sign in to use the society saved in your Parent Account and see your shortlisted schools on a private route map.</p><Link href="/auth/login"><Button variant="primary">Sign In</Button></Link></div>;

  if(error){const isSociety=error.code==='SOCIETY_MISSING'||error.code==='SOCIETY_NOT_FOUND';const isShortlist=error.code==='SHORTLIST_EMPTY';return <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-warm-xs"><MapPin className="w-10 h-10 mx-auto text-[var(--color-accent)] mb-3"/><h2 className="text-xl font-black text-[var(--color-content)]">{isSociety?'We need your society':isShortlist?'Start with your shortlist':'School Run needs another try'}</h2><p className="text-sm text-[var(--color-content-muted)] max-w-lg mx-auto mt-2 mb-5">{error.message}</p><div className="flex flex-wrap justify-center gap-3">{isSociety?<Link href="/dashboard"><Button variant="primary">Update Parent Profile</Button></Link>:null}{isShortlist?<Link href="/schools"><Button variant="primary">Browse Schools</Button></Link>:null}{!isSociety&&!isShortlist?<Button variant="outline" onClick={load} leftIcon={<RefreshCw className="w-4 h-4"/>}>Try Again</Button>:null}</div></div>;}

  if(!data||data.schools.length===0)return <div className="py-12 text-center text-sm text-[var(--color-content-muted)]">We could not resolve a route to the selected schools yet.</div>;
  const active=data.schools.find(s=>s.slug===activeSlug)||data.schools[0];
  return <div className="space-y-5">
    <style jsx>{`
      @keyframes schoolRunCardIn { from { opacity: 0; transform: translateY(14px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes schoolRunHeaderIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      .school-run-header { animation: schoolRunHeaderIn .55s ease-out both; }
      .school-run-card { animation: schoolRunCardIn .62s cubic-bezier(.2,.75,.2,1) both; }
      @media (prefers-reduced-motion: reduce) { .school-run-header, .school-run-card { animation: none !important; } }
    `}</style>
    <div className="school-run-header bg-white rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 shadow-warm-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div><div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-black text-[var(--color-primary)]"><Navigation className="w-3.5 h-3.5"/> Private family route</div><h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] mt-1">From {data.origin.label} to your shortlisted schools</h2><p className="text-xs text-[var(--color-content-muted)] mt-1">Your saved society is used as the starting point. We do not publish your home location.</p></div><div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-2"><ShieldCheck className="w-3.5 h-3.5"/> Private to your account</div></div>
    <SchoolRunMap origin={data.origin} schools={data.schools} activeSlug={active.slug} onSelect={setActiveSlug}/>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{data.schools.map((school,index)=><button key={school.slug} type="button" onClick={()=>setActiveSlug(school.slug)} style={{ animationDelay: String(index * 70) + 'ms' }} className={`school-run-card group text-left bg-white rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-sm ${active.slug===school.slug?'border-[var(--color-primary)] shadow-warm-sm ring-2 ring-[var(--color-primary)]/10':'border-[var(--color-border)] hover:border-slate-300'}`}><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="w-8 h-8 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center text-xs font-black">{index+1}</span><div><h3 className="font-extrabold text-sm text-[var(--color-content)] leading-snug">{school.name}</h3><p className="text-[11px] text-[var(--color-content-muted)] mt-0.5">{school.sector}</p></div></div><Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0"/></div><div className="grid grid-cols-2 gap-2 mt-4"><div className="rounded-xl bg-slate-50 border border-slate-100 p-3"><Car className="w-4 h-4 text-[var(--color-primary)] mb-1"/><div className="text-xs font-black">{school.driving?`${school.driving.distanceKm} km`:'—'}</div><div className="text-[10px] text-[var(--color-content-muted)]">{school.driving?`~${school.driving.durationMin} min`:'Route unavailable'}</div></div><div className="rounded-xl bg-orange-50 border border-orange-100 p-3"><Footprints className="w-4 h-4 text-[var(--color-accent)] mb-1"/><div className="text-xs font-black">{school.walking?`${school.walking.distanceKm} km`:'—'}</div><div className="text-[10px] text-[var(--color-content-muted)]">{school.walking?`~${school.walking.durationMin} min`:'Walking route needs map service'}</div></div></div><div className="mt-3 text-[10px] text-[var(--color-content-muted)] flex items-center gap-1"><MapPin className="w-3 h-3"/>{school.address}</div></button>)}</div>
    <div className="bg-[#faf8f5] rounded-2xl border border-[var(--color-border)] p-5"><div className="flex items-center gap-2 text-sm font-black text-[var(--color-content)]"><Store className="w-4 h-4 text-[var(--color-accent)]"/>Nearby parent essentials are coming next</div><p className="text-xs text-[var(--color-content-muted)] mt-1 max-w-2xl">This section is reserved for the verified uniform, stationery and fancy-dress shops you will provide. We will add real businesses and real parent offers here—no invented listings or coupons.</p></div>
  </div>;
}