'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  IndianRupee,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { AdmissionMilestone, School, SchoolTimings } from '../../../data/schoolsData';

interface SchoolEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (school: School) => void;
  schoolToEdit?: Partial<School> | null;
  isNew?: boolean;
}

const inputClass =
  'w-full px-3 py-2.5 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs focus:outline-none focus:border-amber-400';
const labelClass = 'block text-[11px] font-semibold text-slate-300 mb-1';

function cloneDraft(input?: Partial<School> | null): Partial<School> {
  return input ? JSON.parse(JSON.stringify(input)) : {};
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function SchoolEditorModal({
  isOpen,
  onClose,
  onSaved,
  schoolToEdit,
  isNew = false,
}: SchoolEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'fees' | 'admissions' | 'timings' | 'media' | 'json'>('basic');
  const [draft, setDraft] = useState<Partial<School>>({});
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [auditReason, setAuditReason] = useState('Updated via Admission Pitara Admin CMS');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const next = cloneDraft(schoolToEdit);
    if (isNew) {
      next.name = '';
      next.shortName = '';
      next.slug = '';
      next.board = ['CBSE'];
      next.curriculum = 'CBSE';
      next.schoolType = 'Co-educational';
      next.dayOrBoarding = 'Day School';
      next.gradeRange = { from: 'Nursery', to: 'Class 12', raw: 'Nursery to Class 12' };
      next.studentTeacherRatio = 'Not publicly disclosed';
      next.location = {
        address: '',
        sector: '',
        city: 'Greater Noida',
        state: 'Uttar Pradesh',
        pincode: '',
        area: '',
        coordinates: { lat: null, lng: null, isVerified: false },
      };
      next.fees = {
        cardFee: null,
        rangeText: 'Not publicly disclosed',
        tuitionAnnual: null,
        registrationFee: null,
        admissionFee: null,
        currency: 'INR',
        academicYear: '2027-28',
        verificationStatus: 'partially_verified',
        isVerified: false,
      };
      next.admissions = {
        status: 'Admissions Open',
        session: '2027-28',
        academicYear: '2027-28',
        process: '',
        milestones: [],
      };
      next.timings = {};
      next.transportNotes = '';
      next.editorialNotes = '';
      next.rating = { score: 0, scale: 5, reviewsCount: 0 };
      next.assets = { featured: null, hero: null, gallery: [], legacyPaths: {} };
      next.verification = {
        isVerified: false,
        status: 'pending_audit',
        lastVerified: new Date().toISOString().slice(0, 10),
        sourceName: 'Admission Pitara Admin CMS',
        cbseAffiliationNumber: null,
        verifiedFields: [],
      };
    }
    setDraft(next);
    setJsonText(JSON.stringify(next, null, 2));
    setJsonError(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    setActiveTab('basic');
  }, [isOpen, isNew, schoolToEdit]);

  const update = (patch: Partial<School>) => {
    setDraft(prev => {
      const next = { ...prev, ...patch };
      setJsonText(JSON.stringify(next, null, 2));
      return next;
    });
    setJsonError(null);
  };

  const updateLocation = (patch: Partial<School['location']>) =>
    update({ location: { ...(draft.location || {}), ...patch } as School['location'] });

  const updateFees = (patch: Partial<NonNullable<School['fees']>>) =>
    update({ fees: { ...(draft.fees || {}), ...patch } as School['fees'] });

  const updateAdmissions = (patch: Partial<NonNullable<School['admissions']>>) =>
    update({ admissions: { ...(draft.admissions || {}), ...patch } as School['admissions'] });

  const updateAssets = (patch: Partial<NonNullable<School['assets']>>) =>
    update({ assets: { ...(draft.assets || {}), ...patch } as School['assets'] });

  const updateTimings = (patch: Partial<SchoolTimings>) =>
    update({ timings: { ...(draft.timings || {}), ...patch } });

  const addMilestone = () => {
    const current = draft.admissions?.milestones || [];
    const milestone: AdmissionMilestone = {
      id: 'milestone_' + Date.now(),
      label: 'Application milestone',
      date: new Date().toISOString().slice(0, 10),
      type: 'custom',
      status: 'verified',
      verified: true,
      notes: '',
    };
    updateAdmissions({ milestones: [...current, milestone] });
  };

  const editMilestone = (index: number, patch: Partial<AdmissionMilestone>) => {
    const current = [...(draft.admissions?.milestones || [])];
    current[index] = { ...current[index], ...patch };
    updateAdmissions({ milestones: current });
  };

  const deleteMilestone = (index: number) => {
    updateAdmissions({ milestones: (draft.admissions?.milestones || []).filter((_, i) => i !== index) });
  };

  const importJsonIntoForm = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('School data must be a JSON object.');
      }
      if (!parsed.name && !isNew) throw new Error('JSON must contain the school name.');
      setDraft(parsed);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
      setSuccessMessage('JSON loaded into the editor. Review the form, then save.');
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON.');
    }
  };

  const syncJsonFromForm = () => {
    setJsonText(JSON.stringify(draft, null, 2));
    setJsonError(null);
  };

  const uploadImage = async (file: File, kind: 'featured' | 'hero' | 'gallery') => {
    const targetSlug = String(draft.slug || slugify(String(draft.name || 'school'))).trim();
    if (!targetSlug) {
      setErrorMessage('Enter the school name first so the upload can be attached to this record.');
      return;
    }

    setUploadingKind(kind);
    setErrorMessage(null);
    try {
      const form = new FormData();
      form.append('slug', targetSlug);
      form.append('kind', kind);
      form.append('file', file);

      const res = await fetch('/api/admin/schools/assets', {
        method: 'POST',
        body: form,
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Image upload failed.');

      if (kind === 'featured') updateAssets({ featured: data.url });
      if (kind === 'hero') updateAssets({ hero: data.url });
      if (kind === 'gallery') updateAssets({ gallery: [...(draft.assets?.gallery || []), data.url] });

      setSuccessMessage('Image uploaded and attached to this school draft.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploadingKind(null);
    }
  };

  const removeGalleryImage = (index: number) => {
    updateAssets({ gallery: (draft.assets?.gallery || []).filter((_, i) => i !== index) });
  };

  const handleNameChange = (name: string) => {
    const patch: Partial<School> = { name };
    if (isNew && !draft.slug) patch.slug = slugify(name);
    update(patch);
  };

  const canSave = Boolean(String(draft.name || '').trim() && String(draft.slug || '').trim());

  const tabs = useMemo(
    () => [
      ['basic', 'Basic', Building],
      ['location', 'Location', MapPin],
      ['fees', 'Fees', IndianRupee],
      ['admissions', 'Admissions', Calendar],
      ['timings', 'Timings', Calendar],
      ['media', 'Media', ImageIcon],
      ['json', 'Full Data', ShieldCheck],
    ] as const,
    [],
  );

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!String(draft.name || '').trim()) {
      setErrorMessage('School name is required.');
      return;
    }
    if (!String(draft.slug || '').trim()) {
      setErrorMessage('School slug is required.');
      return;
    }

    let payload: Partial<School> = cloneDraft(draft);
    if (activeTab === 'json') {
      try {
        const parsed = JSON.parse(jsonText);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Full Data must be a JSON object.');
        payload = parsed;
      } catch (err) {
        setJsonError(err instanceof Error ? err.message : 'Invalid JSON.');
        return;
      }
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const url = isNew
        ? '/api/admin/schools'
        : '/api/admin/schools/' + encodeURIComponent(String(schoolToEdit?.slug || draft.slug));
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        cache: 'no-store',
        body: JSON.stringify(
          isNew
            ? { schoolData: payload, reason: auditReason.trim() || 'Created via Admin CMS' }
            : { updates: payload, reason: auditReason.trim() || 'Updated via Admin CMS' },
        ),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Could not save school.');
      onSaved(data.school);
      setSuccessMessage(isNew ? 'School created successfully.' : 'School updated successfully.');
      window.setTimeout(onClose, 450);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Could not save school.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const location = draft.location || ({} as School['location']);
  const fees = draft.fees || ({} as School['fees']);
  const admissions = draft.admissions || ({} as School['admissions']);
  const assets = draft.assets || ({} as School['assets']);
  const timings = draft.timings || {};

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-5">
      <div className="w-full max-w-[1280px] max-h-[92vh] sm:max-h-[90vh] overflow-hidden rounded-3xl border border-[#244f7d] bg-[#0c1f38] text-slate-200 shadow-2xl flex flex-col">
        <div className="px-5 py-4 border-b border-[#1b3d63] bg-[#08172b] flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-amber-400 font-black">Admission Pitara CMS</p>
            <h2 className="text-lg font-black text-white font-serif">{isNew ? 'Add a school' : 'Edit school data'}</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Everything here is editable. The Full Data tab is the escape hatch for any field not represented by a visual control.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto px-4 py-2 border-b border-[#1b3d63] bg-[#091a30]">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={'shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold ' + (activeTab === id ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5')}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {(errorMessage || successMessage || jsonError) && (
          <div className="px-5 pt-3">
            {errorMessage && <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{errorMessage}</div>}
            {successMessage && <div className="mt-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{successMessage}</div>}
            {jsonError && <div className="mt-2 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">{jsonError}</div>}
          </div>
        )}

        <form onSubmit={handleSave} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-6">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Official school name *</label><input value={String(draft.name || '')} onChange={e => handleNameChange(e.target.value)} className={inputClass} required /></div>
                <div><label className={labelClass}>Short/display name</label><input value={String(draft.shortName || '')} onChange={e => update({ shortName: e.target.value })} className={inputClass} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>URL slug *</label><input value={String(draft.slug || '')} onChange={e => update({ slug: slugify(e.target.value) })} className={inputClass + ' font-mono'} disabled={!isNew} /></div>
                <div><label className={labelClass}>Boards (comma-separated)</label><input value={(Array.isArray(draft.board) ? draft.board : draft.board ? [draft.board] : []).join(', ')} onChange={e => update({ board: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} className={inputClass} placeholder="CBSE, ICSE, IB" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Curriculum</label><input value={String(draft.curriculum || '')} onChange={e => update({ curriculum: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>School type</label><input value={String(draft.schoolType || '')} onChange={e => update({ schoolType: e.target.value })} className={inputClass} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Day / boarding</label><input value={String(draft.dayOrBoarding || '')} onChange={e => update({ dayOrBoarding: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Established year</label><input type="number" value={draft.establishedYear ?? ''} onChange={e => update({ establishedYear: e.target.value ? Number(e.target.value) : null })} className={inputClass} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Grades from</label><input value={draft.gradeRange?.from || ''} onChange={e => update({ gradeRange: { ...(draft.gradeRange || {}), from: e.target.value, raw: (e.target.value || '') + ' to ' + (draft.gradeRange?.to || '') } as School['gradeRange'] })} className={inputClass} /></div>
                <div><label className={labelClass}>Grades to</label><input value={draft.gradeRange?.to || ''} onChange={e => update({ gradeRange: { ...(draft.gradeRange || {}), to: e.target.value, raw: (draft.gradeRange?.from || '') + ' to ' + (e.target.value || '') } as School['gradeRange'] })} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Admission age / eligibility</label><input value={String(draft.admissionAge || '')} onChange={e => update({ admissionAge: e.target.value })} className={inputClass} placeholder="e.g. Nursery 3+ by 31 March" /></div>
              <div><label className={labelClass}>Student-teacher ratio</label><input value={String(draft.studentTeacherRatio || '')} onChange={e => update({ studentTeacherRatio: e.target.value })} className={inputClass} placeholder="e.g. 20:1 or Not publicly disclosed" /></div>
              <div><label className={labelClass}>Tagline</label><input value={String(draft.tagline || '')} onChange={e => update({ tagline: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Summary</label><textarea rows={4} value={String(draft.summary || '')} onChange={e => update({ summary: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Alternate names / search aliases (one per line)</label><textarea rows={3} value={(draft.alternateNames || []).join('\n')} onChange={e => update({ alternateNames: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className={inputClass} /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Phone</label><input value={String(draft.contact?.phone || '')} onChange={e => update({ contact: { ...(draft.contact || { phone: null, email: null, website: null }), phone: e.target.value || null } })} className={inputClass} /></div>
                <div><label className={labelClass}>Email</label><input value={String(draft.contact?.email || '')} onChange={e => update({ contact: { ...(draft.contact || { phone: null, email: null, website: null }), email: e.target.value || null } })} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Website</label><input value={String(draft.contact?.website || '')} onChange={e => update({ contact: { ...(draft.contact || { phone: null, email: null, website: null }), website: e.target.value || null } })} className={inputClass} /></div>
              <div><label className={labelClass}>Facilities (one per line)</label><textarea rows={6} value={(draft.facilities || []).map(f => f.name).join('\n')} onChange={e => update({ facilities: e.target.value.split('\n').map(x => x.trim()).filter(Boolean).map(name => ({ name, category: 'General', available: true })) })} className={inputClass} /></div>
              <div><label className={labelClass}>Sports / activities (one per line)</label><textarea rows={5} value={(draft.sports || []).join('\n')} onChange={e => update({ sports: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className={inputClass} /></div>
              <div><label className={labelClass}>Achievements / highlights (one per line)</label><textarea rows={5} value={(draft.achievements || []).join('\n')} onChange={e => update({ achievements: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className={inputClass} /></div>
              <div><label className={labelClass}>Transport notes</label><textarea rows={3} value={String(draft.transportNotes || '')} onChange={e => update({ transportNotes: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Editorial notes</label><textarea rows={3} value={String(draft.editorialNotes || '')} onChange={e => update({ editorialNotes: e.target.value })} className={inputClass} /></div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className={labelClass}>Area / sector *</label><input value={String(location.sector || '')} onChange={e => updateLocation({ sector: e.target.value, area: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>PIN code</label><input value={String(location.pincode || '')} onChange={e => updateLocation({ pincode: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>City</label><input value={String(location.city || '')} onChange={e => updateLocation({ city: e.target.value })} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Full campus address *</label><textarea rows={3} value={String(location.address || '')} onChange={e => updateLocation({ address: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>State / region</label><input value={String(location.state || '')} onChange={e => updateLocation({ state: e.target.value })} className={inputClass} /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Latitude</label><input type="number" step="any" value={location.coordinates?.lat ?? ''} onChange={e => updateLocation({ coordinates: { ...(location.coordinates || { lat: null, lng: null }), lat: e.target.value ? Number(e.target.value) : null, isVerified: true } })} className={inputClass + ' font-mono'} /></div>
                <div><label className={labelClass}>Longitude</label><input type="number" step="any" value={location.coordinates?.lng ?? ''} onChange={e => updateLocation({ coordinates: { ...(location.coordinates || { lat: null, lng: null }), lng: e.target.value ? Number(e.target.value) : null, isVerified: true } })} className={inputClass + ' font-mono'} /></div>
              </div>
              {location.coordinates?.lat && location.coordinates?.lng && <a className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline" href={'https://www.google.com/maps/search/?api=1&query=' + location.coordinates.lat + ',' + location.coordinates.lng} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" />Preview exact pin</a>}
              <div><label className={labelClass}>Map search query</label><input value={String(location.mapSearchQuery || '')} onChange={e => updateLocation({ mapSearchQuery: e.target.value })} className={inputClass} /></div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-amber-100">
                Use this section for the amount you want displayed on Admission Pitara. The year shown below is independently editable, so you can carry forward a prior fee schedule for the next admissions cycle.
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Card / comparable annual fee (₹)</label><input type="number" value={fees.cardFee ?? ''} onChange={e => updateFees({ cardFee: e.target.value ? Number(e.target.value) : null })} className={inputClass} /></div>
                <div><label className={labelClass}>Annual display / range text</label><input value={String(fees.annualDisplay || fees.rangeText || '')} onChange={e => updateFees({ annualDisplay: e.target.value, rangeText: e.target.value })} className={inputClass} /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className={labelClass}>Tuition annual</label><input value={String(fees.tuitionAnnual || '')} onChange={e => updateFees({ tuitionAnnual: e.target.value || null })} className={inputClass} /></div>
                <div><label className={labelClass}>Registration fee (₹)</label><input type="number" value={fees.registrationFee ?? ''} onChange={e => updateFees({ registrationFee: e.target.value ? Number(e.target.value) : null })} className={inputClass} /></div>
                <div><label className={labelClass}>Admission fee (₹)</label><input type="number" value={fees.admissionFee ?? ''} onChange={e => updateFees({ admissionFee: e.target.value ? Number(e.target.value) : null })} className={inputClass} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Academic year / display year</label><input value={String(fees.academicYear || '2027-28')} onChange={e => updateFees({ academicYear: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Source / note</label><input value={String(fees.source || '')} onChange={e => updateFees({ source: e.target.value })} className={inputClass} placeholder="e.g. 2026-27 official fee schedule carried forward" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className={labelClass}>Fee source URL</label><input value={String(fees.sourceUrl || '')} onChange={e => updateFees({ sourceUrl: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Verification status</label><select value={String(fees.verificationStatus || 'partially_verified')} onChange={e => updateFees({ verificationStatus: e.target.value as any })} className={inputClass}><option value="verified_from_source">Verified from source</option><option value="verified_official">Verified official</option><option value="partially_verified">Partially verified</option><option value="estimated_historical">Estimated / historical</option><option value="unverified_undisclosed">Undisclosed</option></select></div>
              </div>
              <div><label className={labelClass}>Simple fee table (one item per line: label | cost)</label><textarea rows={7} value={(fees.table || []).map(x => x.type + ' | ' + x.cost).join('\n')} onChange={e => updateFees({ table: e.target.value.split('\n').map(x => x.trim()).filter(Boolean).map(line => { const [type, ...cost] = line.split('|'); return { type: type.trim(), cost: cost.join('|').trim() }; }) })} className={inputClass} /></div>
              <div><label className={labelClass}>Fee notes / footnotes (one per line)</label><textarea rows={5} value={(fees.footnotes || []).join('\n')} onChange={e => updateFees({ footnotes: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className={inputClass} /></div>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className={labelClass}>Status</label><input value={String(admissions.status || '')} onChange={e => updateAdmissions({ status: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Session</label><input value={String(admissions.session || admissions.academicYear || '2027-28')} onChange={e => updateAdmissions({ session: e.target.value, academicYear: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Admissions source URL</label><input value={String(admissions.sourceUrl || '')} onChange={e => updateAdmissions({ sourceUrl: e.target.value })} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Admission process</label><textarea rows={4} value={String(admissions.process || '')} onChange={e => updateAdmissions({ process: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Timeline description</label><textarea rows={3} value={String(admissions.timelineDescription || '')} onChange={e => updateAdmissions({ timelineDescription: e.target.value })} className={inputClass} /></div>
              <div className="rounded-2xl border border-[#1b3d63] bg-[#08182d] p-4 space-y-3">
                <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-bold text-white">Admission milestones</h3><p className="text-[10px] text-slate-400">Only add dates you want the calendar/reminder system to use.</p></div><button type="button" onClick={addMilestone} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black"><Plus className="w-3.5 h-3.5" />Add</button></div>
                {(admissions.milestones || []).map((m, index) => <div key={m.id || index} className="grid sm:grid-cols-[1fr_160px_auto] gap-2 p-2 rounded-xl bg-[#0b203a] border border-white/5"><input value={m.label} onChange={e => editMilestone(index,{label:e.target.value})} className={inputClass} /><input type="date" value={m.date} onChange={e => editMilestone(index,{date:e.target.value})} className={inputClass} /><button type="button" onClick={() => deleteMilestone(index)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>)}
                {(!admissions.milestones || admissions.milestones.length === 0) && <p className="text-xs text-slate-500 text-center py-4">No milestones configured.</p>}
              </div>
            </div>
          )}

          {activeTab === 'timings' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-200/10 bg-sky-400/5 p-4 text-xs text-sky-100">
                Timings were not a first-class field in the old school schema. They are now stored here and can be edited without touching code.
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div><label className={labelClass}>Monday–Friday</label><input value={String(timings.weekdays || '')} onChange={e => updateTimings({ weekdays: e.target.value })} className={inputClass} placeholder="8:00 AM – 2:30 PM" /></div>
                <div><label className={labelClass}>Saturday</label><input value={String(timings.saturday || '')} onChange={e => updateTimings({ saturday: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Sunday</label><input value={String(timings.sunday || '')} onChange={e => updateTimings({ sunday: e.target.value })} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Timing notes</label><textarea rows={4} value={String(timings.notes || '')} onChange={e => updateTimings({ notes: e.target.value })} className={inputClass} /></div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                {(['featured','hero'] as const).map(kind => (
                  <div key={kind} className="rounded-2xl border border-[#1b3d63] bg-[#08182d] p-4 space-y-3">
                    <div className="flex items-center gap-2 text-white text-sm font-bold"><ImageIcon className="w-4 h-4 text-amber-400" />{kind === 'featured' ? 'Featured image' : 'Hero image'}</div>
                    <input value={String(kind === 'featured' ? assets.featured || '' : assets.hero || '')} onChange={e => updateAssets(kind === 'featured' ? { featured: e.target.value || null } : { hero: e.target.value || null })} className={inputClass} placeholder="https://... or /api/schools/assets/..." />
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"><Upload className="w-4 h-4" />{uploadingKind === kind ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="hidden" onChange={e => { const file=e.target.files?.[0]; if(file) void uploadImage(file,kind); e.currentTarget.value=''; }} /></label>
                    {((kind === 'featured' ? assets.featured : assets.hero) || '') && <img src={String(kind === 'featured' ? assets.featured : assets.hero)} alt="" className="w-full h-36 object-cover rounded-xl border border-white/10" onError={e => { e.currentTarget.style.display='none'; }} />}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-[#1b3d63] bg-[#08182d] p-4 space-y-3">
                <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold text-white">Gallery</h3><p className="text-[10px] text-slate-400">Upload multiple campus images or paste existing image URLs.</p></div><label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"><Upload className="w-4 h-4" />{uploadingKind === 'gallery' ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="hidden" onChange={e => { const file=e.target.files?.[0]; if(file) void uploadImage(file,'gallery'); e.currentTarget.value=''; }} /></label></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{(assets.gallery || []).map((url,index)=><div key={index} className="relative group"><img src={url} alt="" className="w-full aspect-[4/3] object-cover rounded-xl border border-white/10" onError={e=>{e.currentTarget.style.opacity='0.2'}} /><button type="button" onClick={()=>removeGalleryImage(index)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100"><X className="w-3.5 h-3.5"/></button></div>)}</div>
                <textarea rows={4} value={(assets.gallery || []).join('\n')} onChange={e=>updateAssets({gallery:e.target.value.split('\n').map(x=>x.trim()).filter(Boolean)})} className={inputClass} placeholder="One gallery URL per line" />
              </div>
              <div><label className={labelClass}>Image source / attribution</label><input value={String(assets.imageSource || '')} onChange={e=>updateAssets({ imageSource:e.target.value })} className={inputClass} /></div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><h3 className="text-sm font-bold text-white">Full school data</h3><p className="text-[10px] text-slate-400">Paste a complete JSON object, load it, then save. This supports fields added to the schema later without rebuilding the form.</p></div>
                <div className="flex gap-2"><button type="button" onClick={syncJsonFromForm} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">Refresh JSON</button><button type="button" onClick={importJsonIntoForm} className="px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black">Load JSON</button></div>
              </div>
              <textarea value={jsonText} onChange={e=>setJsonText(e.target.value)} className="w-full min-h-[520px] rounded-2xl bg-[#071629] border border-[#1d4672] px-4 py-4 text-[11px] leading-relaxed font-mono text-emerald-200 outline-none focus:border-amber-400" spellCheck={false} />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#1b3d63] grid md:grid-cols-[1fr_auto] gap-4 items-end">
            <div><label className={labelClass}>Admin change note *</label><input value={auditReason} onChange={e=>setAuditReason(e.target.value)} className={inputClass} required /></div>
            <div className="flex gap-2 justify-end"><button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">Cancel</button><button type="submit" disabled={isSaving || uploadingKind !== null || !canSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black disabled:opacity-50"><Save className="w-4 h-4" />{isSaving ? 'Saving…' : isNew ? 'Create school' : 'Save changes'}</button></div>
          </div>
        </form>
      </div>
    </div>
  );
}
