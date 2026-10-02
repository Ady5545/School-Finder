'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload as UploadIcon,
  X,
} from 'lucide-react';
import type { School } from '../../types/school';

type FieldPath =
  | 'name' | 'shortName' | 'tagline' | 'summary' | 'board' | 'boardNote'
  | 'curriculum' | 'gradeRange.raw' | 'admissionAge' | 'studentTeacherRatio'
  | 'schoolType' | 'dayOrBoarding' | 'establishedYear'
  | 'location.address' | 'location.area' | 'location.sector' | 'location.pincode'
  | 'fees.annualDisplay' | 'fees.feeDisplayOverride' | 'fees.tuitionAnnual' | 'fees.rangeText'
  | 'admissions.status' | 'admissions.academicYear' | 'admissions.process' | 'admissions.timelineDescription'
  | 'timings.weekdays' | 'timings.saturday' | 'timings.sunday' | 'timings.notes'
  | 'contact.phone' | 'contact.email' | 'contact.website'
  | 'verification.sourceName' | 'verification.notes';

interface Props {
  school: School;
}

const fieldLabels: Record<FieldPath, string> = {
  name: 'School name',
  shortName: 'Short name',
  tagline: 'Tagline',
  summary: 'About / summary',
  board: 'Board(s)',
  boardNote: 'Board note',
  curriculum: 'Curriculum',
  'gradeRange.raw': 'Grade range',
  admissionAge: 'Admission age',
  studentTeacherRatio: 'Student–teacher ratio',
  schoolType: 'School type',
  dayOrBoarding: 'Day / boarding type',
  establishedYear: 'Established year',
  'location.address': 'Full address',
  'location.area': 'Area',
  'location.sector': 'Sector',
  'location.pincode': 'Pincode',
  'fees.annualDisplay': 'Annual fee display',
  'fees.feeDisplayOverride': 'Card annual-fee override',
  'fees.tuitionAnnual': 'Annual tuition',
  'fees.rangeText': 'Fee range / notes',
  'admissions.status': 'Admission status',
  'admissions.academicYear': 'Admission academic year',
  'admissions.process': 'Admission procedure',
  'admissions.timelineDescription': 'Admission timeline',
  'timings.weekdays': 'Monday–Friday',
  'timings.saturday': 'Saturday',
  'timings.sunday': 'Sunday',
  'timings.notes': 'Timing notes',
  'contact.phone': 'Phone',
  'contact.email': 'Email',
  'contact.website': 'Website',
  'verification.sourceName': 'Verification source',
  'verification.notes': 'Verification notes',
};

const sectionLabels: Record<string, string> = {
  timings: 'School Timings',
  about: 'About',
  admissions: 'Admissions',
  fees: 'Fee Structure',
  facilities: 'Campus Facilities',
  sports: 'Sports & Athletics',
  gallery: 'Campus Gallery',
  credentials: 'Institutional Credentials',
  contact: 'Contact & Address',
  map: 'Campus Map',
  custom: 'Custom Information',
};

const inputClass =
  'w-full rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400';

const secondaryButton =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#28527d] bg-[#0c2340] px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-400 hover:text-white disabled:opacity-50';

const saveButton =
  'inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-black text-slate-950 hover:bg-amber-300 disabled:opacity-50';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function getPathValue(source: Partial<School>, path: FieldPath): unknown {
  let value: any = source;
  for (const part of path.split('.')) value = value?.[part];
  return value;
}

function setPathValue(source: Partial<School>, path: FieldPath, value: unknown): Partial<School> {
  const next = clone(source);
  const parts = path.split('.');
  let cursor: any = next;
  parts.forEach((part, index) => {
    if (index === parts.length - 1) cursor[part] = value;
    else cursor[part] = cursor[part] && typeof cursor[part] === 'object' ? cursor[part] : {};
    cursor = cursor[part];
  });
  return next;
}

function changedTopLevel(initial: Partial<School>, draft: Partial<School>): Partial<School> {
  const updates: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(initial), ...Object.keys(draft)]);
  keys.forEach((key) => {
    if (JSON.stringify((initial as any)[key]) !== JSON.stringify((draft as any)[key])) {
      updates[key] = (draft as any)[key];
    }
  });
  return updates as Partial<School>;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export function AdminSchoolVisualEditor({ school }: Props) {
  const [initial, setInitial] = useState<Partial<School>>(() => clone(school));
  const [draft, setDraft] = useState<Partial<School>>(() => clone(school));
  const [selectedField, setSelectedField] = useState<FieldPath>('name');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'admission-pitara-admin-select') return;

      const field = event.data.field as FieldPath | null;
      const section = event.data.section as string | null;

      if (event.data.type === 'admission-pitara-admin-field-change' && field) {
        let value: unknown = String(event.data.value ?? '');
        if (field === 'establishedYear') value = String(value).trim() ? Number(value) : null;
        if (field === 'board') value = String(value).split(',').map((item) => item.trim()).filter(Boolean);
        editField(field, value);
        setSelectedField(field);
        setSelectedSection(null);
        setMessage('Edited ' + fieldLabels[field] + '.');
        return;
      }

      if (event.data.type === 'admission-pitara-admin-add-content') {
        addCustom();
        setMessage('New custom content block added. Edit it in the panel, then Save changes.');
        setSelectedSection('custom');
        setError('');
        return;
      }

      if (event.data.type === 'admission-pitara-admin-section-action' && section) {
        const action = event.data.action as string;
        if (action === 'hide') {
          toggleSection(section);
          setMessage('Section hidden. Save changes to publish it.');
        } else if (action === 'duplicate') {
          const title = String(event.data.label || sectionLabels[section] || 'School section');
          const text = String(event.data.text || '').trim();
          setDraft((prev) => ({
            ...prev,
            customSections: [
              ...(Array.isArray(prev.customSections) ? prev.customSections : []),
              {
                id: 'custom_' + Date.now(),
                title: 'Copy of ' + title.replace(/\s+/g, ' ').slice(0, 70),
                content: text || 'Duplicated school content. Edit this block before saving.',
              },
            ],
          }));
          setSelectedSection('custom');
          setMessage('Duplicated as an editable custom block.');
        }
        setError('');
        return;
      }

      if (field && Object.prototype.hasOwnProperty.call(fieldLabels, field)) {
        setSelectedField(field);
        setSelectedSection(null);
        setMessage('Editing ' + fieldLabels[field] + '.');
      } else if (section) {
        setSelectedSection(section);
        setMessage('Selected ' + (sectionLabels[section] || section) + '.');
      }
      setError('');
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const hiddenSections = strings(draft.publicHiddenSections);
  const achievements = strings(draft.achievements);
  const sports = strings(draft.sports);
  const facilities = Array.isArray(draft.facilities) ? draft.facilities : [];
  const gallery = Array.isArray(draft.assets?.gallery) ? draft.assets.gallery : [];
  const customSections = Array.isArray(draft.customSections) ? draft.customSections : [];
  const dirty = JSON.stringify(initial) !== JSON.stringify(draft);

  const editField = (field: FieldPath, value: unknown) => {
    setDraft((prev) => setPathValue(prev, field, value));
    setError('');
    setMessage('');
  };

  const toggleSection = (section: string) => {
    const next = new Set(hiddenSections);
    if (next.has(section)) next.delete(section);
    else next.add(section);
    setDraft((prev) => ({ ...prev, publicHiddenSections: Array.from(next) }));
    setSelectedSection(section);
  };

  const save = async () => {
    const updates = changedTopLevel(initial, draft);
    if (!Object.keys(updates).length) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/admin/schools/' + encodeURIComponent(school.slug), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        cache: 'no-store',
        body: JSON.stringify({ updates, reason: 'Visual school profile editor update' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.school) throw new Error(data.message || 'Could not save school changes.');

      const next = clone(data.school);
      setInitial(next);
      setDraft(next);
      setPreviewKey((value) => value + 1);
      setMessage('Saved to the live school record. Preview refreshed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save school changes.');
    } finally {
      setSaving(false);
    }
  };

  const updateArray = (field: 'achievements' | 'sports', index: number, value: string) => {
    const next = [...(field === 'achievements' ? achievements : sports)];
    next[index] = value;
    setDraft((prev) => ({ ...prev, [field]: next }));
  };

  const removeArray = (field: 'achievements' | 'sports', index: number) => {
    const next = [...(field === 'achievements' ? achievements : sports)];
    next.splice(index, 1);
    setDraft((prev) => ({ ...prev, [field]: next }));
  };

  const addArray = (field: 'achievements' | 'sports') => {
    const next = [...(field === 'achievements' ? achievements : sports), field === 'achievements' ? 'New recognition or highlight' : 'New sport'];
    setDraft((prev) => ({ ...prev, [field]: next }));
  };

  const updateFacility = (index: number, key: string, value: string | boolean) => {
    const next = clone(facilities) as any[];
    next[index] = { ...next[index], [key]: value };
    setDraft((prev) => ({ ...prev, facilities: next as any }));
  };

  const addFacility = () => {
    setDraft((prev) => ({
      ...prev,
      facilities: [
        ...(Array.isArray(prev.facilities) ? prev.facilities : []),
        { name: 'New facility', category: 'Campus', available: true },
      ],
    }));
    setSelectedSection('facilities');
  };

  const removeFacility = (index: number) => {
    const next = clone(facilities) as any[];
    next.splice(index, 1);
    setDraft((prev) => ({ ...prev, facilities: next as any }));
  };

  const addCustom = () => {
    setDraft((prev) => ({
      ...prev,
      customSections: [
        ...(Array.isArray(prev.customSections) ? prev.customSections : []),
        { id: 'custom_' + Date.now(), title: 'New Information', content: 'Add useful school information here.' },
      ],
    }));
    setSelectedSection('custom');
  };

  const updateCustom = (index: number, key: 'title' | 'content', value: string) => {
    const next = clone(customSections);
    next[index] = { ...next[index], [key]: value };
    setDraft((prev) => ({ ...prev, customSections: next }));
  };

  const removeCustom = (index: number) => {
    const next = clone(customSections);
    next.splice(index, 1);
    setDraft((prev) => ({ ...prev, customSections: next }));
  };

  const uploadImage = async (file: File, kind: 'featured' | 'hero' | 'gallery') => {
    setError('');
    try {
      const form = new FormData();
      form.append('slug', school.slug);
      form.append('kind', kind);
      form.append('file', file);

      const res = await fetch('/api/admin/schools/assets', { method: 'POST', body: form, cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.url) throw new Error(data.message || 'Image upload failed.');

      setDraft((prev) => {
        const assets = { ...(prev.assets || ({} as any)) };
        if (kind === 'featured') assets.featured = data.url;
        else if (kind === 'hero') assets.hero = data.url;
        else assets.gallery = [...(Array.isArray(assets.gallery) ? assets.gallery : []), data.url];
        return { ...prev, assets };
      });
      setMessage('Image uploaded. Save changes to publish it.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    }
  };

  const renderField = () => {
    const value = getPathValue(draft, selectedField);
    const multiline =
      selectedField === 'summary' ||
      selectedField === 'boardNote' ||
      selectedField.endsWith('process') ||
      selectedField.endsWith('timelineDescription') ||
      selectedField.startsWith('timings.') ||
      selectedField === 'fees.annualDisplay' ||
      selectedField === 'fees.feeDisplayOverride' ||
      selectedField === 'fees.tuitionAnnual' ||
      selectedField === 'fees.rangeText' ||
      selectedField === 'verification.notes';

    return (
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Selected content</p>
          <h3 className="mt-1 text-base font-black text-white">{fieldLabels[selectedField]}</h3>
        </div>
        {selectedField === 'board' ? (
          <input
            value={strings(value).join(', ')}
            onChange={(e) => editField('board', e.target.value.split(',').map((item) => item.trim()).filter(Boolean))}
            className={inputClass}
          />
        ) : multiline ? (
          <textarea
            value={String(value ?? '')}
            onChange={(e) => editField(selectedField, e.target.value)}
            rows={selectedField === 'summary' ? 9 : 6}
            className={inputClass + ' resize-y'}
          />
        ) : (
          <input
            value={String(value ?? '')}
            onChange={(e) => editField(selectedField, selectedField === 'establishedYear' ? (e.target.value ? Number(e.target.value) : null) : e.target.value)}
            inputMode={selectedField === 'establishedYear' ? 'numeric' : undefined}
            className={inputClass}
          />
        )}
        <p className="text-[11px] text-slate-400 leading-relaxed">Nothing is published until you press Save changes.</p>
      </div>
    );
  };

  const renderSection = () => {
    if (!selectedSection) return null;

    if (selectedSection === 'achievements') {
      return (
        <div className="space-y-3">
          <SectionTitle title="Recognitions & Highlights" />
          {achievements.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input value={item} onChange={(e) => updateArray('achievements', index, e.target.value)} className={inputClass} />
              <button type="button" onClick={() => removeArray('achievements', index)} className={iconButton} aria-label="Remove highlight"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => addArray('achievements')} className={secondaryButton}><Plus className="w-4 h-4" />Add highlight</button>
        </div>
      );
    }

    if (selectedSection === 'sports') {
      return (
        <div className="space-y-3">
          <SectionTitle title="Sports & Athletics" />
          {sports.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input value={item} onChange={(e) => updateArray('sports', index, e.target.value)} className={inputClass} />
              <button type="button" onClick={() => removeArray('sports', index)} className={iconButton} aria-label="Remove sport"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => addArray('sports')} className={secondaryButton}><Plus className="w-4 h-4" />Add sport</button>
        </div>
      );
    }

    if (selectedSection === 'facilities') {
      return (
        <div className="space-y-3">
          <SectionTitle title="Campus Facilities" />
          {facilities.map((facility: any, index) => (
            <div key={index} className="rounded-2xl border border-[#254d75] bg-[#0b2039] p-3 space-y-2">
              <input value={facility.name || ''} onChange={(e) => updateFacility(index, 'name', e.target.value)} placeholder="Facility name" className={inputClass} />
              <input value={facility.category || ''} onChange={(e) => updateFacility(index, 'category', e.target.value)} placeholder="Category" className={inputClass} />
              <label className="flex items-center gap-2 text-xs text-slate-300">
                <input type="checkbox" checked={facility.available !== false} onChange={(e) => updateFacility(index, 'available', e.target.checked)} />
                Available
              </label>
              <button type="button" onClick={() => removeFacility(index)} className="text-xs font-bold text-rose-300 inline-flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />Remove facility</button>
            </div>
          ))}
          <button type="button" onClick={addFacility} className={secondaryButton}><Plus className="w-4 h-4" />Add facility</button>
        </div>
      );
    }

    if (selectedSection === 'gallery') {
      return (
        <div className="space-y-3">
          <SectionTitle title="Campus Gallery" />
          <Upload kind="featured" label="Upload featured image" onUpload={uploadImage} />
          <Upload kind="hero" label="Upload hero image" onUpload={uploadImage} />
          <Upload kind="gallery" label="Add gallery photograph" onUpload={uploadImage} />
          {gallery.map((url, index) => (
            <div key={url + index} className="rounded-2xl border border-[#254d75] bg-[#0b2039] p-2">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, assets: { ...(prev.assets || ({} as any)), gallery: gallery.filter((_, i) => i !== index) } }))}
                className="mt-2 text-xs font-bold text-rose-300 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />Remove photograph
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (selectedSection === 'custom') {
      return (
        <div className="space-y-3">
          <SectionTitle title="Custom Information" />
          {customSections.map((item, index) => (
            <div key={item.id || index} className="rounded-2xl border border-[#254d75] bg-[#0b2039] p-3 space-y-2">
              <input value={item.title || ''} onChange={(e) => updateCustom(index, 'title', e.target.value)} className={inputClass} />
              <textarea value={item.content || ''} onChange={(e) => updateCustom(index, 'content', e.target.value)} rows={5} className={inputClass + ' resize-y'} />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (index === 0) return;
                    const next = clone(customSections);
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    setDraft((prev) => ({ ...prev, customSections: next }));
                  }}
                  disabled={index === 0}
                  className={secondaryButton}
                >
                  ↑ Move up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (index === customSections.length - 1) return;
                    const next = clone(customSections);
                    [next[index + 1], next[index]] = [next[index], next[index + 1]];
                    setDraft((prev) => ({ ...prev, customSections: next }));
                  }}
                  disabled={index === customSections.length - 1}
                  className={secondaryButton}
                >
                  ↓ Move down
                </button>
                <button type="button" onClick={() => removeCustom(index)} className="text-xs font-bold text-rose-300 inline-flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />Remove section</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addCustom} className={secondaryButton}><Plus className="w-4 h-4" />Add custom section</button>
        </div>
      );
    }

    if (sectionLabels[selectedSection]) {
      const hidden = hiddenSections.includes(selectedSection);
      const editableBySection: Record<string, FieldPath[]> = {
        about: ['summary', 'boardNote'],
        timings: ['timings.weekdays', 'timings.saturday', 'timings.sunday', 'timings.notes'],
        admissions: ['admissions.status', 'admissions.academicYear', 'admissions.process', 'admissions.timelineDescription'],
        fees: ['fees.annualDisplay', 'fees.feeDisplayOverride', 'fees.tuitionAnnual', 'fees.rangeText'],
        credentials: ['board', 'boardNote', 'verification.sourceName', 'verification.notes'],
        contact: ['location.address', 'location.area', 'location.sector', 'location.pincode', 'contact.phone', 'contact.email', 'contact.website'],
      };
      const editables = editableBySection[selectedSection] || [];
      return (
        <div className="space-y-4">
          <SectionTitle title={sectionLabels[selectedSection]} />
          {editables.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Edit content</p>
              <div className="grid grid-cols-1 gap-2">
                {editables.map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => { setSelectedField(field); setSelectedSection(null); }}
                    className="rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-left text-[11px] font-bold text-slate-200 hover:border-amber-400 hover:text-white"
                  >
                    {fieldLabels[field]}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button type="button" onClick={() => toggleSection(selectedSection)} className={hidden ? warningButton : secondaryButton}>
            {hidden ? <><Check className="w-4 h-4" />Keep this section visible</> : <><X className="w-4 h-4" />Hide this section on public profile</>}
          </button>
          <p className="text-[11px] text-slate-400 leading-relaxed">Hiding is reversible and does not delete the underlying school data.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#071322] text-slate-200">
      <div className="sticky top-0 z-30 border-b border-[#1b3e62] bg-[#071322]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-[1800px] px-3 sm:px-5 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-300">Visual School CMS</div>
            <h1 className="truncate text-base sm:text-lg font-black text-white">{school.name}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href="/admin" className={secondaryButton}><ArrowLeft className="w-4 h-4" />Back to Admin</a>
            <a href={'/admin/' + encodeURIComponent(school.slug) + '?mode=classic'} className={secondaryButton}><SlidersIcon />Classic CMS</a>
            <a href={'/schools/' + school.slug} target="_blank" rel="noreferrer" className={secondaryButton}><ExternalLink className="w-4 h-4" />Public profile</a>
            <button type="button" onClick={save} disabled={!dirty || saving} className={dirty ? saveButton : secondaryButton}>
              <Save className="w-4 h-4" />{saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-3 sm:px-5 py-4 lg:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px] gap-4 xl:gap-6 items-start">
          <section className="rounded-3xl border border-[#1e4878] bg-[#0b1c32] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-[#1e4878] bg-[#0f284a] px-4 py-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Live replica</div>
                <p className="text-xs text-slate-300">Click the highlighted content in the public page to edit it.</p>
              </div>
              <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-200">Admin edit mode</div>
            </div>
            <iframe
              key={previewKey}
              title={'Edit ' + school.name}
              src={'/schools/' + school.slug + '?adminEdit=1'}
              className="block h-[calc(100vh-155px)] min-h-[760px] w-full border-0 bg-white"
            />
          </section>

          <aside className="xl:sticky xl:top-[76px] rounded-3xl border border-[#1e4878] bg-[#0f284a] shadow-2xl overflow-hidden">
            <div className="border-b border-[#214a73] px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Inspector</p>
              <h2 className="mt-1 text-sm font-black text-white">
                {selectedSection ? (sectionLabels[selectedSection] || selectedSection) : fieldLabels[selectedField]}
              </h2>
            </div>

            <div className="max-h-[calc(100vh-130px)] overflow-y-auto p-4 space-y-5">
              {error && <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs text-rose-200 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
              {message && <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-200 flex gap-2"><Check className="w-4 h-4 shrink-0" />{message}</div>}

              {selectedSection ? renderSection() : renderField()}

              <div className="rounded-2xl border border-[#254d75] bg-[#0b2039] p-3 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Quick edit</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickFields.map((field) => (
                    <button key={field} type="button" onClick={() => { setSelectedField(field); setSelectedSection(null); setMessage('Editing ' + fieldLabels[field] + '.'); }} className="rounded-xl border border-[#1d4672] bg-[#091b32] px-2.5 py-2 text-left text-[10px] font-bold text-slate-300 hover:border-amber-400 hover:text-white">
                      {fieldLabels[field]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#254d75] bg-[#0b2039] p-3 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Editing tips</p>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Click any highlighted text in the page to edit it in place. Hover a section for
                  <span className="font-bold text-amber-200"> Edit</span>,
                  <span className="font-bold text-rose-200"> Hide</span>, or
                  <span className="font-bold text-slate-100"> Duplicate</span>.
                  Use <span className="font-bold text-amber-200">＋ Add content</span> for a new block.
                </p>
              </div>

              <div className="rounded-2xl border border-[#254d75] bg-[#0b2039] p-3 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Add / remove content</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSelectedSection('achievements')} className={secondaryButton}><Plus className="w-3.5 h-3.5" />Highlights</button>
                  <button type="button" onClick={() => setSelectedSection('facilities')} className={secondaryButton}><Plus className="w-3.5 h-3.5" />Facilities</button>
                  <button type="button" onClick={() => setSelectedSection('sports')} className={secondaryButton}><Plus className="w-3.5 h-3.5" />Sports</button>
                  <button type="button" onClick={() => setSelectedSection('gallery')} className={secondaryButton}><ImageIcon className="w-3.5 h-3.5" />Gallery</button>
                  <button type="button" onClick={addCustom} className={secondaryButton}><Plus className="w-3.5 h-3.5" />Custom section</button>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-3 text-[11px] leading-relaxed text-amber-100/80">
                <strong className="text-amber-200">CMS safety:</strong> Save sends only changed top-level fields through the existing admin API. It does not intentionally rebuild the school from scratch.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SlidersIcon() {
  return <span aria-hidden="true" className="text-sm leading-none">⚙︎</span>;
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">Section editor</p>
      <h3 className="mt-1 text-base font-black text-white">{title}</h3>
    </div>
  );
}

function Upload({
  label,
  kind,
  onUpload,
}: {
  label: string;
  kind: 'featured' | 'hero' | 'gallery';
  onUpload: (file: File, kind: 'featured' | 'hero' | 'gallery') => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-400 hover:text-white">
      <UploadIcon className="w-3.5 h-3.5" />
      {label}
      <input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file, kind); event.currentTarget.value = ''; }} />
    </label>
  );
}

const warningButton = 'inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300/40 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-200 hover:bg-amber-400/15';
const iconButton = 'shrink-0 inline-flex items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 text-rose-200 hover:bg-rose-400/15';
