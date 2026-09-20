'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Building,
  MapPin,
  IndianRupee,
  Calendar,
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import type { School, AdmissionMilestone } from '../../../data/schoolsData';

interface SchoolEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (school: School) => void;
  schoolToEdit?: Partial<School> | null;
  isNew?: boolean;
}

export function SchoolEditorModal({
  isOpen,
  onClose,
  onSaved,
  schoolToEdit,
  isNew = false,
}: SchoolEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'fees' | 'admissions' | 'media' | 'verification'>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [summary, setSummary] = useState('');
  const [boards, setBoards] = useState<string[]>(['CBSE']);
  const [curriculum, setCurriculum] = useState('CBSE');
  const [schoolType, setSchoolType] = useState('Co-educational');
  const [dayOrBoarding, setDayOrBoarding] = useState('Day School');
  const [gradeFrom, setGradeFrom] = useState('Nursery');
  const [gradeTo, setGradeTo] = useState('Class 12');
  const [establishedYear, setEstablishedYear] = useState<number | string>(2015);
  const [studentTeacherRatio, setStudentTeacherRatio] = useState('Not publicly verified');

  // Location
  const [sector, setSector] = useState('Sector 16B');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('201306');
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');
  const [mapSearchQuery, setMapSearchQuery] = useState('');

  // Fees
  const [cardFee, setCardFee] = useState<string>('120000');
  const [tuitionAnnual, setTuitionAnnual] = useState<string>('');
  const [registrationFee, setRegistrationFee] = useState<string>('');
  const [admissionFee, setAdmissionFee] = useState<string>('');
  const [rangeText, setRangeText] = useState('₹1,20,000 - ₹1,50,000 / year');
  const [feeVerificationStatus, setFeeVerificationStatus] = useState<string>('partially_verified');
  const [feeSourceUrl, setFeeSourceUrl] = useState('');

  // Admissions
  const [admissionStatus, setAdmissionStatus] = useState('Admissions Open');
  const [admissionSession, setAdmissionSession] = useState('2027-28');
  const [admissionProcess, setAdmissionProcess] = useState('');
  const [milestones, setMilestones] = useState<AdmissionMilestone[]>([]);

  // Media
  const [featuredImage, setFeaturedImage] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [imageSource, setImageSource] = useState('');

  // Verification & Editorial
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'verified_official' | 'pending_audit' | 'partially_verified'>('verified_official');
  const [auditReason, setAuditReason] = useState('Updated via Admin School Editor');

  useEffect(() => {
    if (schoolToEdit) {
      setName(schoolToEdit.name || '');
      setShortName(schoolToEdit.shortName || schoolToEdit.name || '');
      setSlug(schoolToEdit.slug || '');
      setTagline(schoolToEdit.tagline || '');
      setSummary(schoolToEdit.summary || '');
      setBoards(schoolToEdit.board || ['CBSE']);
      setCurriculum(schoolToEdit.curriculum || 'CBSE');
      setSchoolType(schoolToEdit.schoolType || 'Co-educational');
      setDayOrBoarding(schoolToEdit.dayOrBoarding || 'Day School');
      setGradeFrom(schoolToEdit.gradeRange?.from || 'Nursery');
      setGradeTo(schoolToEdit.gradeRange?.to || 'Class 12');
      setEstablishedYear(schoolToEdit.establishedYear || 2015);
      setStudentTeacherRatio(schoolToEdit.studentTeacherRatio || 'Not publicly verified');

      setSector(schoolToEdit.location?.sector || 'Sector 16B');
      setAddress(schoolToEdit.location?.address || '');
      setPincode(schoolToEdit.location?.pincode || '201306');
      setLat(schoolToEdit.location?.coordinates?.lat ? String(schoolToEdit.location.coordinates.lat) : '');
      setLng(schoolToEdit.location?.coordinates?.lng ? String(schoolToEdit.location.coordinates.lng) : '');
      setMapSearchQuery(schoolToEdit.location?.mapSearchQuery || '');

      setCardFee(schoolToEdit.fees?.cardFee ? String(schoolToEdit.fees.cardFee) : '120000');
      setTuitionAnnual(schoolToEdit.fees?.tuitionAnnual || '');
      setRegistrationFee(schoolToEdit.fees?.registrationFee ? String(schoolToEdit.fees.registrationFee) : '');
      setAdmissionFee(schoolToEdit.fees?.admissionFee ? String(schoolToEdit.fees.admissionFee) : '');
      setRangeText(schoolToEdit.fees?.rangeText || '');
      setFeeVerificationStatus(schoolToEdit.fees?.verificationStatus || 'partially_verified');
      setFeeSourceUrl(schoolToEdit.fees?.sourceUrl || '');

      setAdmissionStatus(schoolToEdit.admissions?.status || 'Admissions Open');
      setAdmissionSession(schoolToEdit.admissions?.session || '2027-28');
      setAdmissionProcess(schoolToEdit.admissions?.process || '');
      setMilestones(schoolToEdit.admissions?.milestones || []);

      setFeaturedImage(schoolToEdit.assets?.featured || '');
      setHeroImage(schoolToEdit.assets?.hero || '');
      setImageSource(schoolToEdit.assets?.imageSource || '');

      setAffiliationNumber(schoolToEdit.affiliationNumber || schoolToEdit.verification?.cbseAffiliationNumber || '');
      setVerificationStatus(schoolToEdit.verification?.status || 'verified_official');
    } else if (isNew) {
      // Clear fields for new school
      setName('');
      setShortName('');
      setSlug('');
      setTagline('');
      setSummary('');
      setBoards(['CBSE']);
      setCurriculum('CBSE');
      setSchoolType('Co-educational');
      setDayOrBoarding('Day School');
      setGradeFrom('Nursery');
      setGradeTo('Class 12');
      setEstablishedYear(2018);
      setStudentTeacherRatio('Not publicly verified');
      setSector('Sector 16B');
      setAddress('');
      setPincode('201306');
      setLat('');
      setLng('');
      setMapSearchQuery('');
      setCardFee('120000');
      setTuitionAnnual('');
      setRegistrationFee('');
      setAdmissionFee('');
      setRangeText('₹1,20,000 - ₹1,50,000 / year');
      setFeeVerificationStatus('partially_verified');
      setFeeSourceUrl('');
      setAdmissionStatus('Admissions Open');
      setAdmissionSession('2027-28');
      setAdmissionProcess('');
      setMilestones([]);
      setFeaturedImage('');
      setHeroImage('');
      setImageSource('');
      setAffiliationNumber('');
      setVerificationStatus('verified_official');
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [schoolToEdit, isNew, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (isNew && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  const handleAddMilestone = () => {
    const newM: AdmissionMilestone = {
      id: `milestone_${Date.now()}`,
      label: 'Application Deadline',
      date: new Date().toISOString().split('T')[0],
      verified: true,
      notes: '',
    };
    setMilestones([...milestones, newM]);
  };

  const handleUpdateMilestone = (idx: number, updates: Partial<AdmissionMilestone>) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], ...updates };
    setMilestones(updated);
  };

  const handleDeleteMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('School name is required.');
      return;
    }
    if (isNew && !slug.trim()) {
      setErrorMessage('School slug is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const parsedLat = lat.trim() ? parseFloat(lat) : null;
    const parsedLng = lng.trim() ? parseFloat(lng) : null;

    const payload = {
      name: name.trim(),
      shortName: shortName.trim() || name.trim(),
      slug: slug.trim(),
      tagline: tagline.trim(),
      summary: summary.trim(),
      board: boards,
      curriculum: curriculum.trim(),
      schoolType,
      dayOrBoarding,
      gradeRange: { from: gradeFrom, to: gradeTo, raw: `${gradeFrom} to ${gradeTo}` },
      establishedYear: establishedYear ? Number(establishedYear) : null,
      studentTeacherRatio: studentTeacherRatio.trim(),
      affiliationNumber: affiliationNumber.trim() || null,
      location: {
        address: address.trim(),
        sector: sector.trim(),
        city: 'Greater Noida',
        state: 'Uttar Pradesh',
        pincode: pincode.trim(),
        area: sector.trim(),
        coordinates: { lat: parsedLat, lng: parsedLng },
        mapSearchQuery: mapSearchQuery.trim() || `${name.trim()}, ${sector.trim()}, Greater Noida West`,
        mapEmbedUrl: null,
      },
      fees: {
        ...(schoolToEdit?.fees || {}),
        cardFee: Number(cardFee) || 120000,
        currency: 'INR',
        rangeText: rangeText.trim() || `₹${Number(cardFee).toLocaleString('en-IN')}/yr`,
        tuitionAnnual: tuitionAnnual.trim() || null,
        registrationFee: registrationFee ? Number(registrationFee) : null,
        admissionFee: admissionFee ? Number(admissionFee) : null,
        verificationStatus: feeVerificationStatus,
        sourceUrl: feeSourceUrl.trim() || undefined,
        table: schoolToEdit?.fees?.table || [],
      },
      admissions: {
        status: admissionStatus,
        session: admissionSession,
        process: admissionProcess.trim(),
        milestones,
      },
      assets: {
        featured: featuredImage.trim() || null,
        hero: heroImage.trim() || null,
        gallery: schoolToEdit?.assets?.gallery || [],
        imageSource: imageSource.trim() || undefined,
        legacyPaths: schoolToEdit?.assets?.legacyPaths || {},
      },
      verification: {
        isVerified: verificationStatus === 'verified_official',
        status: verificationStatus,
        lastVerified: new Date().toISOString().split('T')[0],
        sourceName: 'Admission Pitara Editorial Verification',
        cbseAffiliationNumber: affiliationNumber.trim() || null,
        verifiedFields: ['name', 'location', 'fees', 'contact', 'board'],
      },
    };

    try {
      if (isNew) {
        const res = await fetch('/api/admin/schools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolData: payload,
            reason: auditReason || 'New school entry created',
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Creation failed');
        setSuccessMessage('School created successfully!');
        onSaved(data.school);
        setTimeout(() => onClose(), 800);
      } else {
        const targetSlug = schoolToEdit?.slug || slug;
        const res = await fetch(`/api/admin/schools/${targetSlug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: payload,
            reason: auditReason || 'Admin edited school details',
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Update failed');
        setSuccessMessage('School details updated successfully!');
        onSaved(data.school);
        setTimeout(() => onClose(), 800);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c1f38] border border-[#1e4875] rounded-2xl shadow-2xl text-slate-200 overflow-hidden flex flex-col my-8 max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0a1b32] border-b border-[#1b3d63] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                {isNew ? 'Register New School Record' : `Edit: ${schoolToEdit?.name || 'School'}`}
              </h2>
              <p className="text-xs text-slate-400">
                {isNew ? 'Direct canonical listing entry' : `Slug: ${schoolToEdit?.slug}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#08172b] border-b border-[#1b3d63] overflow-x-auto text-xs">
          {[
            { id: 'basic', label: 'Basic Info', icon: Building },
            { id: 'location', label: 'Location & Map', icon: MapPin },
            { id: 'fees', label: 'Fees & Structure', icon: IndianRupee },
            { id: 'admissions', label: 'Admissions & Dates', icon: Calendar },
            { id: 'media', label: 'Media Assets', icon: ImageIcon },
            { id: 'verification', label: 'Verification & Editorial', icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs focus:outline-hidden focus:border-amber-400"
                    placeholder="e.g. Lotus Valley International School"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Short Name
                  </label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={e => setShortName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs focus:outline-hidden focus:border-amber-400"
                    placeholder="e.g. Lotus Valley, Noida Extension"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unique URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isNew}
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-xs font-mono focus:outline-hidden focus:border-amber-400 ${
                      !isNew ? 'opacity-60 cursor-not-allowed text-slate-400' : 'text-amber-400'
                    }`}
                    placeholder="e.g. lotus-valley-international-school-noida-extension"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Affiliation Board(s)
                  </label>
                  <input
                    type="text"
                    value={boards.join(', ')}
                    onChange={e => setBoards(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs focus:outline-hidden focus:border-amber-400"
                    placeholder="CBSE, Cambridge, IB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline (Editorial Headline)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs focus:outline-hidden focus:border-amber-400"
                  placeholder="e.g. Holistic child-centric education with state-of-the-art campus"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Editorial Summary
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs focus:outline-hidden focus:border-amber-400 leading-relaxed"
                  placeholder="Detailed overview for parents..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    School Type
                  </label>
                  <select
                    value={schoolType}
                    onChange={e => setSchoolType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  >
                    <option value="Co-educational">Co-educational</option>
                    <option value="All Girls">All Girls</option>
                    <option value="All Boys">All Boys</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Day / Boarding
                  </label>
                  <select
                    value={dayOrBoarding}
                    onChange={e => setDayOrBoarding(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  >
                    <option value="Day School">Day School</option>
                    <option value="Day-cum-Boarding">Day-cum-Boarding</option>
                    <option value="Boarding School">Boarding School</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={establishedYear}
                    onChange={e => setEstablishedYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student-Teacher Ratio
                  </label>
                  <input
                    type="text"
                    value={studentTeacherRatio}
                    onChange={e => setStudentTeacherRatio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="e.g. 20:1 or Not publicly verified"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sector / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="e.g. Sector 16B, Techzone 4"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="201306"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    City / Region
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Greater Noida West, UP"
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-slate-400 text-xs opacity-70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Campus Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  placeholder="Plot No., Sector, Greater Noida West, Uttar Pradesh 201306"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#08182d] border border-[#1b3e66] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      Map Coordinates (Greater Noida West)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Standard Greater Noida West bounds: Lat ~28.55 to 28.65, Lng ~77.40 to 77.52.
                      Missing coordinates = no map pin (never use fallback placeholders).
                    </p>
                  </div>
                  {lat && lng && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:underline"
                    >
                      <span>Preview Pin</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={lat}
                      onChange={e => setLat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs font-mono"
                      placeholder="e.g. 28.6012"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={lng}
                      onChange={e => setLng(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs font-mono"
                      placeholder="e.g. 77.4485"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Card / Display Annual Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={cardFee}
                    onChange={e => setCardFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="120000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fee Range Display Text
                  </label>
                  <input
                    type="text"
                    value={rangeText}
                    onChange={e => setRangeText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="₹1,20,000 - ₹1,50,000 / year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tuition (Annual / Periodic)
                  </label>
                  <input
                    type="text"
                    value={tuitionAnnual}
                    onChange={e => setTuitionAnnual(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="e.g. ₹95,000 / yr"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={registrationFee}
                    onChange={e => setRegistrationFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="e.g. 2000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    One-Time Admission Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={admissionFee}
                    onChange={e => setAdmissionFee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="e.g. 25000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fee Verification Level
                  </label>
                  <select
                    value={feeVerificationStatus}
                    onChange={e => setFeeVerificationStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  >
                    <option value="verified_from_source">Verified from Source / Official Prospectus</option>
                    <option value="partially_verified">Partially Verified</option>
                    <option value="unverified_undisclosed">Undisclosed / On Request</option>
                    <option value="not_publicly_verified">Not Publicly Verified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fee Source URL / Document Reference
                  </label>
                  <input
                    type="url"
                    value={feeSourceUrl}
                    onChange={e => setFeeSourceUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="https://school.edu.in/fees-structure-2025"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Admission Status
                  </label>
                  <select
                    value={admissionStatus}
                    onChange={e => setAdmissionStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  >
                    <option value="Admissions Open">Admissions Open</option>
                    <option value="Upcoming (Starting Soon)">Upcoming (Starting Soon)</option>
                    <option value="Admissions Closed">Admissions Closed</option>
                    <option value="Waitlist Only">Waitlist Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Academic Session
                  </label>
                  <input
                    type="text"
                    value={admissionSession}
                    onChange={e => setAdmissionSession(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                    placeholder="2027-28"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admission Process Summary
                </label>
                <textarea
                  rows={2}
                  value={admissionProcess}
                  onChange={e => setAdmissionProcess(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs leading-relaxed"
                  placeholder="Online registration, document submission, student interaction, fee deposit."
                />
              </div>

              {/* Milestones List */}
              <div className="p-4 rounded-xl bg-[#08182d] border border-[#1b3e66] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Admission Dates & Milestones (Notification Trigger Points)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Used by parents for automated email alerts and calendar reminders.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold hover:bg-amber-400/20 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                {milestones.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2 text-center italic">
                    No admission milestones configured yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {milestones.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-lg bg-[#0b203a] border border-white/5 text-xs"
                      >
                        <input
                          type="text"
                          value={m.label}
                          onChange={e => handleUpdateMilestone(idx, { label: e.target.value })}
                          className="flex-1 px-2.5 py-1 rounded bg-[#071629] border border-white/10 text-white text-xs"
                          placeholder="Milestone Label (e.g. Application Closes)"
                        />
                        <input
                          type="date"
                          value={m.date}
                          onChange={e => handleUpdateMilestone(idx, { date: e.target.value })}
                          className="px-2.5 py-1 rounded bg-[#071629] border border-white/10 text-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteMilestone(idx)}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Featured / Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={e => setFeaturedImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  placeholder="https://images.unsplash.com/... or /images/schools/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Header Image URL
                </label>
                <input
                  type="url"
                  value={heroImage}
                  onChange={e => setHeroImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  placeholder="https://images.unsplash.com/... or /images/schools/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Image Attribution / Photographer Source
                </label>
                <input
                  type="text"
                  value={imageSource}
                  onChange={e => setImageSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  placeholder="e.g. Official Campus Media / Admission Pitara Verified Field Visit"
                />
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CBSE / Board Affiliation Number
                  </label>
                  <input
                    type="text"
                    value={affiliationNumber}
                    onChange={e => setAffiliationNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs font-mono"
                    placeholder="e.g. 2132338"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Cross-checked against CBSE SARAS public registry.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Verification Status
                  </label>
                  <select
                    value={verificationStatus}
                    onChange={e => setVerificationStatus(e.target.value as typeof verificationStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  >
                    <option value="verified_official">Verified Official</option>
                    <option value="partially_verified">Partially Verified</option>
                    <option value="pending_audit">Pending Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Administrative Reason / Change Notes *
                </label>
                <input
                  type="text"
                  required
                  value={auditReason}
                  onChange={e => setAuditReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#091b32] border border-[#1d4672] text-white text-xs"
                  placeholder="e.g. Updated fee structure from 2025 prospectus after tele-verification"
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#1b3d63] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Record...' : isNew ? 'Create School Record' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
