'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Car, Footprints, Heart, MapPin, RefreshCw, ShieldCheck, Store, Navigation, LocateFixed, Shirt, PencilRuler, Sparkles, Tag, ExternalLink } from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useSchoolStore } from '../../lib/schoolStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
const SchoolRunMap = dynamic(() => import('./SchoolRunMap'), { ssr: false });

type SchoolRunData = {
  origin: { lat: number; lng: number; label: string };
  schools: Array<{ slug: string; name: string; shortName: string; sector: string; address: string; point: { lat:number; lng:number; label:string }; driving: {distanceKm:number; durationMin:number; coordinates:[number,number][]; provider:string}|null; walking: {distanceKm:number; durationMin:number; coordinates:[number,number][]; provider:string}|null }>;
};

type NearbyShop = { id: string; name: string; category: 'uniform' | 'stationery' | 'fancy_dress'; distanceKm: number; address: string | null; osmUrl: string; coupon: { code: string; description: string } | null };

const CATEGORY_META = {
  uniform: { label: 'Uniform shops', icon: Shirt, tint: 'text-[var(--color-primary)] bg-[#eef6fb]' },
  stationery: { label: 'Stationery shops', icon: PencilRuler, tint: 'text-emerald-700 bg-emerald-50' },
  fancy_dress: { label: 'Fancy dress & gifts', icon: Sparkles, tint: 'text-[var(--color-accent)] bg-orange-50' },
} as const;

function useGeolocatedOrigin() {
  const [state, setState] = useState<{ status: 'idle' | 'locating' | 'ready' | 'error'; lat?: number; lng?: number; message?: string }>({ status: 'idle' });
  const request = () => {
    if (!('geolocation' in navigator)) { setState({ status: 'error', message: 'Your browser does not support location access.' }); return; }
    setState({ status: 'locating' });
    navigator.geolocation.getCurrentPosition(
      pos => setState({ status: 'ready', lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setState({ status: 'error', message: err.code === err.PERMISSION_DENIED ? 'Location permission was denied. Allow it in your browser settings to use your current location.' : 'We could not read your current location.' }),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };
  const clear = () => setState({ status: 'idle' });
  return { state, request, clear };
}

function NearbyShopsPanel({ slug }: { slug: string }) {
  const [shops, setShops] = useState<NearbyShop[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<{ shopName: string; code: string; description: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null); setShops(null);
    fetch(`/api/school-run/nearby-shops?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(payload => { if (cancelled) return; if (!payload.success) { setError(payload.message || 'Nearby shops could not load.'); return; } setShops(payload.shops); })
      .catch(() => { if (!cancelled) setError('Nearby shops could not load.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5">
    <div className="flex items-center gap-2 text-sm font-black text-[var(--color-content)]"><Store className="w-4 h-4 text-[var(--color-accent)]" />Near this school: uniform, stationery &amp; fancy-dress shops</div>
    <p className="text-[11px] text-[var(--color-content-muted)] mt-1 max-w-2xl">Pulled live from OpenStreetMap — real shops mapped by contributors near the school, not a manually curated list. Click a uniform shop for its parent offer, where one exists.</p>
    {loading ? <div className="py-8 text-center text-xs text-[var(--color-content-muted)]">Finding real shops around this school…</div> : null}
    {error ? <div className="py-6 text-center text-xs text-[var(--color-content-muted)]">{error}</div> : null}
    {!loading && !error && shops && shops.length === 0 ? <div className="py-6 text-center text-xs text-[var(--color-content-muted)]">No mapped uniform, stationery or fancy-dress shops near this school yet on OpenStreetMap.</div> : null}
    {!loading && !error && shops && shops.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {(['uniform', 'stationery', 'fancy_dress'] as const).map(cat => {
        const meta = CATEGORY_META[cat];
        const Icon = meta.icon;
        const list = shops.filter(s => s.category === cat);
        return <div key={cat} className="rounded-xl border border-[var(--color-border)] p-3">
          <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide rounded-full px-2 py-1 ${meta.tint}`}><Icon className="w-3 h-3" />{meta.label}</div>
          {list.length === 0 ? <div className="text-[11px] text-[var(--color-content-muted)] mt-3">None mapped nearby yet.</div> : <ul className="mt-3 space-y-2.5">
            {list.map(shop => <li key={shop.id} className="text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-[var(--color-content)]">{shop.name}</div>
                  <div className="text-[10px] text-[var(--color-content-muted)]">{shop.distanceKm} km away{shop.address ? ` · ${shop.address}` : ''}</div>
                </div>
                <a href={shop.osmUrl} target="_blank" rel="noreferrer" className="shrink-0 text-[var(--color-content-muted)] hover:text-[var(--color-primary)]" aria-label={`Open ${shop.name} on OpenStreetMap`}><ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
              {cat === 'uniform' ? (shop.coupon
                ? <button type="button" onClick={() => setCoupon({ shopName: shop.name, ...shop.coupon! })} className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-1 hover:bg-emerald-100"><Tag className="w-3 h-3" />Parent offer available</button>
                : <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[var(--color-content-muted)]"><Tag className="w-3 h-3" />No partner offer yet</div>) : null}
            </li>)}
          </ul>}
        </div>;
      })}
    </div> : null}
    <Modal isOpen={!!coupon} onClose={() => setCoupon(null)} title={coupon?.shopName} description="Parent offer">
      {coupon ? <div className="text-center py-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">Show this at the counter</div>
        <div className="mt-2 inline-block rounded-xl border-2 border-dashed border-[var(--color-primary)] px-5 py-3 text-xl font-black tracking-[0.2em] text-[var(--color-primary)]">{coupon.code}</div>
        <p className="text-xs text-[var(--color-content-muted)] mt-3">{coupon.description}</p>
      </div> : null}
    </Modal>
  </div>;
}

export default function SchoolRunContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { shortlist } = useSchoolStore();
  const [data,setData]=useState<SchoolRunData|null>(null);
  const [error,setError]=useState<{code?:string;message:string}|null>(null);
  const [loading,setLoading]=useState(true);
  const [activeSlug,setActiveSlug]=useState<string|null>(null);
  const geo = useGeolocatedOrigin();

  const load=async()=>{
    setLoading(true);setError(null);
    try{
      const params = geo.state.status === 'ready' ? `?lat=${geo.state.lat}&lng=${geo.state.lng}` : '';
      const response=await fetch(`/api/school-run${params}`,{cache:'no-store'});
      const payload=await response.json();
      if(!response.ok||!payload.success){setError({code:payload.code,message:payload.message||'School Run could not load.'});setData(null);return;}
      setData(payload);setActiveSlug(prev => prev && payload.schools?.some((s: { slug: string }) => s.slug === prev) ? prev : payload.schools?.[0]?.slug || null);
    }catch{setError({message:'We could not connect to School Run. Please try again.'});}
    finally{setLoading(false);}
  };
  useEffect(()=>{if(!isLoading&&isAuthenticated) load();else if(!isLoading)setLoading(false);},[isLoading,isAuthenticated,shortlist.join('|'),geo.state.status,geo.state.lat,geo.state.lng]);

  if(isLoading||loading)return <div className="py-16 text-center text-sm text-[var(--color-content-muted)]">Preparing your school run map…</div>;
  if(!isAuthenticated)return <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-warm-xs"><ShieldCheck className="w-10 h-10 mx-auto text-[var(--color-primary)] mb-3"/><h2 className="text-xl font-black text-[var(--color-content)]">Your School Run is private</h2><p className="text-sm text-[var(--color-content-muted)] max-w-lg mx-auto mt-2 mb-5">Sign in to use the society saved in your Parent Account and see your shortlisted schools on a private route map.</p><Link href="/auth/login"><Button variant="primary">Sign In</Button></Link></div>;

  if(error){const isSociety=error.code==='SOCIETY_MISSING'||error.code==='SOCIETY_NOT_FOUND';const isShortlist=error.code==='SHORTLIST_EMPTY';return <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 text-center shadow-warm-xs"><MapPin className="w-10 h-10 mx-auto text-[var(--color-accent)] mb-3"/><h2 className="text-xl font-black text-[var(--color-content)]">{isSociety?'We need your location':isShortlist?'Start with your shortlist':'School Run needs another try'}</h2><p className="text-sm text-[var(--color-content-muted)] max-w-lg mx-auto mt-2 mb-5">{error.message}</p><div className="flex flex-wrap justify-center gap-3">{isSociety?<><Link href="/dashboard"><Button variant="primary">Update Parent Profile</Button></Link><Button variant="outline" onClick={geo.request} leftIcon={<LocateFixed className="w-4 h-4"/>}>Use my current location</Button></>:null}{isShortlist?<Link href="/schools"><Button variant="primary">Browse Schools</Button></Link>:null}{!isSociety&&!isShortlist?<Button variant="outline" onClick={load} leftIcon={<RefreshCw className="w-4 h-4"/>}>Try Again</Button>:null}</div></div>;}

  if(!data||data.schools.length===0)return <div className="py-12 text-center text-sm text-[var(--color-content-muted)]">We could not resolve a route to the selected schools yet.</div>;
  const active=data.schools.find(s=>s.slug===activeSlug)||data.schools[0];
  const usingDevice = geo.state.status === 'ready';
  return <div className="space-y-5">
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 shadow-warm-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-black text-[var(--color-primary)]"><Navigation className="w-3.5 h-3.5"/> Private family route</div>
        <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] mt-1">From {usingDevice ? 'your current location' : data.origin.label} to your shortlisted schools</h2>
        <p className="text-xs text-[var(--color-content-muted)] mt-1">{usingDevice ? 'Using your device\u2019s live GPS position for this run.' : 'Your saved society is used as the starting point.'} We do not publish your location.</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-2"><ShieldCheck className="w-3.5 h-3.5"/> Private to your account</div>
        {usingDevice
          ? <button type="button" onClick={geo.clear} className="text-[11px] font-bold text-[var(--color-content-muted)] hover:text-[var(--color-primary)] underline">Use saved society instead</button>
          : <button type="button" onClick={geo.request} disabled={geo.state.status==='locating'} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-primary)] hover:underline disabled:opacity-50"><LocateFixed className="w-3.5 h-3.5"/>{geo.state.status==='locating'?'Locating…':'Use my current location instead'}</button>}
        {geo.state.status==='error' ? <div className="text-[10px] text-rose-600 max-w-[220px] text-right">{geo.state.message}</div> : null}
      </div>
    </div>
    <SchoolRunMap origin={data.origin} schools={data.schools} activeSlug={active.slug} onSelect={setActiveSlug}/>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{data.schools.map((school,index)=><button key={school.slug} type="button" onClick={()=>setActiveSlug(school.slug)} className={`text-left bg-white rounded-2xl border p-4 transition-all ${active.slug===school.slug?'border-[var(--color-primary)] shadow-warm-sm ring-1 ring-[var(--color-primary)]/10':'border-[var(--color-border)] hover:border-slate-300'}`}><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="w-8 h-8 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center text-xs font-black">{index+1}</span><div><h3 className="font-extrabold text-sm text-[var(--color-content)] leading-snug">{school.name}</h3><p className="text-[11px] text-[var(--color-content-muted)] mt-0.5">{school.sector}</p></div></div><Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0"/></div><div className="grid grid-cols-2 gap-2 mt-4"><div className="rounded-xl bg-slate-50 border border-slate-100 p-3"><Car className="w-4 h-4 text-[var(--color-primary)] mb-1"/><div className="text-xs font-black">{school.driving?`${school.driving.distanceKm} km`:'—'}</div><div className="text-[10px] text-[var(--color-content-muted)]">{school.driving?`~${school.driving.durationMin} min`:'Route unavailable'}</div></div><div className="rounded-xl bg-orange-50 border border-orange-100 p-3"><Footprints className="w-4 h-4 text-[var(--color-accent)] mb-1"/><div className="text-xs font-black">{school.walking?`${school.walking.distanceKm} km`:'—'}</div><div className="text-[10px] text-[var(--color-content-muted)]">{school.walking?`~${school.walking.durationMin} min`:'Walking route needs map service'}</div></div></div><div className="mt-3 text-[10px] text-[var(--color-content-muted)] flex items-center gap-1"><MapPin className="w-3 h-3"/>{school.address}</div></button>)}</div>
    <NearbyShopsPanel slug={active.slug} />
  </div>;
}
