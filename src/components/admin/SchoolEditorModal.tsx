'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  X, Save, Building2, MapPin, IndianRupee, CalendarDays, Image as ImageIcon,
  ShieldCheck, AlertCircle, CheckCircle2, Upload, Trash2, FileJson, RotateCcw,
  Phone, Clock3, Trophy, GraduationCap, Star, Database
} from 'lucide-react';
import type { School, AdmissionMilestone, Facility } from '../../../data/schoolsData';

interface SchoolEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (school: School) => void;
  schoolToEdit?: Partial<School> | null;
  isNew?: boolean;
}

type EditorTab = 'basic' | 'location' | 'fees' | 'admissions' | 'content' | 'media' | 'verification' | 'json';

const emptySchool = (): Partial<School> => ({
  name: '',
  shortName: '',
  slug: '',
  alternateNames: [],
  tagline: '',
  summary: '',
  board: [],
  boardNote: null,
  curriculum: '',
  gradeRange: { from: '', to: '', raw: '' },
  admissionAge: '',
  studentTeacherRatio: '',
  schoolType: '',
  dayOrBoarding: '',
  timings: '',
  transportDetails: '',
  establishedYear: null,
  location: {
    address: '',
    sector: '',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    pincode: '',
    area: '',
    coordinates: { lat: null, lng: null, isVerified: false },
    mapSearchQuery: '',
    mapEmbedUrl: null,
  },
  fees: {
    cardFee: null,
    currency: 'INR',
    rangeText: '',
    registrationFee: null,
    admissionFee: null,
    tuitionMonthly: null,
    tuitionQuarterly: null,
    tuitionAnnual: null,
    transportMonthly: null,
    transportAnnual: null,
    verificationStatus: 'pending_audit',
    disclosed: false,
    comparableAnnualAvailable: false,
    academicSession: '2027-28',
    sourceUrl: '',
    annualDisplay: '',
    table: [],
    components: [],
    gradeWiseTiers: [],
    concessions: [],
    footnotes: [],
    disclaimer: '',
  },
  facilities: [],
  uniforms: { notes: '' },
  achievements: [],
  sports: [],
  admissions: {
    status: 'Not publicly disclosed',
    session: '2027-28',
    process: '',
    date: null,
    timelineDescription: '',
    sourceUrl: '',
    milestones: [],
  },
  contact: { phone: null, email: null, website: null },
  rating: { score: 0, scale: 5, reviewsCount: 0 },
  assets: { featured: null, hero: null, gallery: [], legacyPaths: {} },
  verification: {
    isVerified: false,
    status: 'pending_audit',
    lastVerified: '',
    sourceName: '',
    sourceUrl: '',
    cbseAffiliationNumber: null,
    verifiedFields: [],
  },
  classification: 'nearby_surrounding',
  status: 'active',
  isArchived: false,
});

function cleanForJson(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(cleanForJson);
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === 'completeness' || key === '_id') continue;
    if (val !== undefined) out[key] = cleanForJson(val);
  }
  return out;
}

function splitLines(text: string): string[] {
  return text.split('\n').map(v => v.trim()).filter(Boolean);
}

function parseFacilities(text: string): Facility[] {
  return splitLines(text).map(line => {
    const [name, category = 'Infrastructure'] = line.split('|').map(v => v.trim());
    return { name, category };
  });
}

export function SchoolEditorModal({
  isOpen,
  onClose,
  onSaved,
  schoolToEdit,
  isNew = false,
}: SchoolEditorModalProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingType, setUploadingType] = useState<'featured' | 'hero' | 'gallery' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState('');
  const [jsonBase, setJsonBase] = useState<Partial<School> | null>(null);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [slug, setSlug] = useState('');
  const [alternateNamesText, setAlternateNamesText] = useState('');
  const [tagline, setTagline] = useState('');
  const [summary, setSummary] = useState('');
  const [boardsText, setBoardsText] = useState('');
  const [boardNote, setBoardNote] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [dayOrBoarding, setDayOrBoarding] = useState('');
  const [gradeFrom, setGradeFrom] = useState('');
  const [gradeTo, setGradeTo] = useState('');
  const [admissionAge, setAdmissionAge] = useState('');
  const [ratio, setRatio] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [classification, setClassification] = useState('nearby_surrounding');
  const [status, setStatus] = useState('active');
  const [isArchived, setIsArchived] = useState(false);

  const [address, setAddress] = useState('');
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('Greater Noida');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [coordinatesVerified, setCoordinatesVerified] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');

  const [cardFee, setCardFee] = useState('');
  const [rangeText, setRangeText] = useState('');
  const [annualDisplay, setAnnualDisplay] = useState('');
  const [registrationFee, setRegistrationFee] = useState('');
  const [admissionFee, setAdmissionFee] = useState('');
  const [tuitionMonthly, setTuitionMonthly] = useState('');
  const [tuitionQuarterly, setTuitionQuarterly] = useState('');
  const [tuitionAnnual, setTuitionAnnual] = useState('');
  const [transportMonthly, setTransportMonthly] = useState('');
  const [transportAnnual, setTransportAnnual] = useState('');
  const [feeSession, setFeeSession] = useState('2027-28');
  const [feeVerificationStatus, setFeeVerificationStatus] = useState('pending_audit');
  const [feeSourceUrl, setFeeSourceUrl] = useState('');
  const [feeDisclaimer, setFeeDisclaimer] = useState('');

  const [admissionStatus, setAdmissionStatus] = useState('Not publicly disclosed');
  const [admissionSession, setAdmissionSession] = useState('2027-28');
  const [admissionProcess, setAdmissionProcess] = useState('');
  const [timelineDescription, setTimelineDescription] = useState('');
  const [admissionSourceUrl, setAdmissionSourceUrl] = useState('');
  const [milestones, setMilestones] = useState<AdmissionMilestone[]>([]);

  const [timings, setTimings] = useState('');
  const [transportDetails, setTransportDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [facilitiesText, setFacilitiesText] = useState('');
  const [sportsText, setSportsText] = useState('');
  const [achievementsText, setAchievementsText] = useState('');
  const [uniformBoysImage, setUniformBoysImage] = useState('');
  const [uniformGirlsImage, setUniformGirlsImage] = useState('');
  const [uniformNotes, setUniformNotes] = useState('');

  const [ratingScore, setRatingScore] = useState('0');
  const [ratingReviews, setRatingReviews] = useState('0');
  const [ratingBreakdownJson, setRatingBreakdownJson] = useState('{}');

  const [featuredImage, setFeaturedImage] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [imageSource, setImageSource] = useState('');

  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'verified_official' | 'pending_audit' | 'partially_verified'>('pending_audit');
  const [verificationSourceName, setVerificationSourceName] = useState('');
  const [verificationSourceUrl, setVerificationSourceUrl] = useState('');
  const [auditReason, setAuditReason] = useState('Updated via Admission Pitara Admin CMS');

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingUploadType, setPendingUploadType] = useState<'featured' | 'hero' | 'gallery' | null>(null);

  const loadSchoolIntoForm = (source: Partial<School>) => {
    const s = source || emptySchool();
    setName(s.name || '');
    setShortName(s.shortName || s.name || '');
    setSlug(s.slug || '');
    setAlternateNamesText(Array.isArray(s.alternateNames) ? s.alternateNames.join(', ') : '');
    setTagline(s.tagline || '');
    setSummary(s.summary || '');
    setBoardsText(Array.isArray(s.board) ? s.board.join(', ') : '');
    setBoardNote(s.boardNote || '');
    setCurriculum(s.curriculum || '');
    setSchoolType(s.schoolType || '');
    setDayOrBoarding(s.dayOrBoarding || '');
    setGradeFrom(s.gradeRange?.from || '');
    setGradeTo(s.gradeRange?.to || '');
    setAdmissionAge(s.admissionAge || '');
    setRatio(s.studentTeacherRatio || '');
    setEstablishedYear(s.establishedYear == null ? '' : String(s.establishedYear));
    setClassification(s.classification || 'nearby_surrounding');
    setStatus(s.status || 'active');
    setIsArchived(Boolean(s.isArchived));

    setAddress(s.location?.address || '');
    setSector(s.location?.sector || '');
    setCity(s.location?.city || 'Greater Noida');
    setState(s.location?.state || 'Uttar Pradesh');
    setPincode(s.location?.pincode || '');
    setArea(s.location?.area || '');
    setLat(s.location?.coordinates?.lat != null ? String(s.location.coordinates.lat) : s.location?.coordinates?.latitude != null ? String(s.location.coordinates.latitude) : '');
    setLng(s.location?.coordinates?.lng != null ? String(s.location.coordinates.lng) : s.location?.coordinates?.longitude != null ? String(s.location.coordinates.longitude) : '');
    setCoordinatesVerified(Boolean(s.location?.coordinates?.isVerified));
    setMapSearchQuery(s.location?.mapSearchQuery || '');

    setCardFee(s.fees?.cardFee == null ? '' : String(s.fees.cardFee));
    setRangeText(s.fees?.rangeText || '');
    setAnnualDisplay(s.fees?.annualDisplay || '');
    setRegistrationFee(s.fees?.registrationFee == null ? '' : String(s.fees.registrationFee));
    setAdmissionFee(s.fees?.admissionFee == null ? '' : String(s.fees.admissionFee));
    setTuitionMonthly(s.fees?.tuitionMonthly || '');
    setTuitionQuarterly(s.fees?.tuitionQuarterly || '');
    setTuitionAnnual(s.fees?.tuitionAnnual || '');
    setTransportMonthly(s.fees?.transportMonthly || '');
    setTransportAnnual(s.fees?.transportAnnual || '');
    setFeeSession(s.fees?.academicSession || s.fees?.academicYear || '2027-28');
    setFeeVerificationStatus(s.fees?.verificationStatus || 'pending_audit');
    setFeeSourceUrl(s.fees?.sourceUrl || '');
    setFeeDisclaimer(s.fees?.disclaimer || '');

    setAdmissionStatus(s.admissions?.status || 'Not publicly disclosed');
    setAdmissionSession(s.admissions?.session || s.admissions?.academicYear || '2027-28');
    setAdmissionProcess(s.admissions?.process || '');
    setTimelineDescription(s.admissions?.timelineDescription || '');
    setAdmissionSourceUrl(s.admissions?.sourceUrl || '');
    setMilestones(s.admissions?.milestones || []);

    setTimings(s.timings || '');
    setTransportDetails(s.transportDetails || '');
    setPhone(s.contact?.phone || '');
    setEmail(s.contact?.email || '');
    setWebsite(s.contact?.website || '');
    setFacilitiesText((s.facilities || []).map(f => `${f.name} | ${f.category || 'Infrastructure'}`).join('\n'));
    setSportsText((s.sports || []).join('\n'));
    setAchievementsText((s.achievements || []).join('\n'));
    setUniformBoysImage(s.uniforms?.boys?.image || '');
    setUniformGirlsImage(s.uniforms?.girls?.image || '');
    setUniformNotes(s.uniforms?.notes || '');

    setRatingScore(String(s.rating?.score ?? 0));
    setRatingReviews(String(s.rating?.reviewsCount ?? 0));
    setRatingBreakdownJson(JSON.stringify(s.rating?.breakdown || {}, null, 2));

    setFeaturedImage(s.assets?.featured || '');
    setHeroImage(s.assets?.hero || '');
    setGallery(Array.isArray(s.assets?.gallery) ? s.assets.gallery : []);
    setImageSource(s.assets?.imageSource || '');

    setAffiliationNumber(s.affiliationNumber || s.verification?.cbseAffiliationNumber || '');
    setVerificationStatus(s.verification?.status || 'pending_audit');
    setVerificationSourceName(s.verification?.sourceName || '');
    setVerificationSourceUrl(s.verification?.sourceUrl || '');
    setJsonBase(cleanForJson(s) as Partial<School>);
    setRawJson(JSON.stringify(cleanForJson(s), null, 2));
  };

  useEffect(() => {
    if (!isOpen) return;
    loadSchoolIntoForm(schoolToEdit || emptySchool());
    setActiveTab('basic');
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadingType(null);
  }, [isOpen, schoolToEdit]);

  if (!isOpen) return null;

  const handleNameChange = (value: string) => {
    setName(value);
    if (isNew && !slug) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  function buildPayload(includeOriginal = true): Partial<School> {
    let breakdown: Record<string, number> | undefined;
    try {
      const parsed = JSON.parse(ratingBreakdownJson || '{}');
      if (parsed && typeof parsed === 'object') breakdown = parsed;
    } catch {
      breakdown = undefined;
    }

    const source = includeOriginal ? (jsonBase || (schoolToEdit ? cleanForJson(schoolToEdit) as Partial<School> : {})) : {};
    return {
      ...source,
      name: name.trim(),
      shortName: shortName.trim() || name.trim(),
      slug: slug.trim(),
      alternateNames: splitLines(alternateNamesText.replace(/,/g, '\n')),
      tagline: tagline.trim(),
      summary: summary.trim(),
      board: boardsText.split(',').map(v => v.trim()).filter(Boolean),
      boardNote: boardNote.trim() || null,
      curriculum: curriculum.trim(),
      schoolType: schoolType.trim(),
      dayOrBoarding: dayOrBoarding.trim(),
      gradeRange: {
        from: gradeFrom.trim(),
        to: gradeTo.trim(),
        raw: [gradeFrom.trim(), gradeTo.trim()].filter(Boolean).join(' – '),
      },
      admissionAge: admissionAge.trim(),
      studentTeacherRatio: ratio.trim(),
      establishedYear: establishedYear.trim() ? Number(establishedYear) : null,
      timings: timings.trim(),
      transportDetails: transportDetails.trim(),
      classification: classification as School['classification'],
      status: status as School['status'],
      isArchived,
      location: {
        ...(source.location || {}),
        address: address.trim(),
        sector: sector.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        area: area.trim() || sector.trim(),
        coordinates: {
          ...(source.location?.coordinates || {}),
          lat: lat.trim() ? Number(lat) : null,
          lng: lng.trim() ? Number(lng) : null,
          latitude: lat.trim() ? Number(lat) : null,
          longitude: lng.trim() ? Number(lng) : null,
          isVerified: coordinatesVerified,
        },
        mapSearchQuery: mapSearchQuery.trim(),
      },
      fees: {
        ...(source.fees || {}),
        cardFee: cardFee.trim() ? Number(cardFee) : null,
        rangeText: rangeText.trim(),
        annualDisplay: annualDisplay.trim(),
        registrationFee: registrationFee.trim() ? Number(registrationFee) : null,
        admissionFee: admissionFee.trim() ? Number(admissionFee) : null,
        tuitionMonthly: tuitionMonthly.trim() || null,
        tuitionQuarterly: tuitionQuarterly.trim() || null,
        tuitionAnnual: tuitionAnnual.trim() || null,
        transportMonthly: transportMonthly.trim() || null,
        transportAnnual: transportAnnual.trim() || null,
        academicSession: feeSession.trim() || '2027-28',
        currency: 'INR',
        verificationStatus: feeVerificationStatus as School['fees']['verificationStatus'],
        sourceUrl: feeSourceUrl.trim() || undefined,
        disclaimer: feeDisclaimer.trim() || undefined,
      },
      facilities: parseFacilities(facilitiesText),
      achievements: splitLines(achievementsText),
      sports: splitLines(sportsText),
      uniforms: {
        ...(source.uniforms || {}),
        boys: uniformBoysImage ? { image: uniformBoysImage, label: 'Boys Uniform' } : source.uniforms?.boys,
        girls: uniformGirlsImage ? { image: uniformGirlsImage, label: 'Girls Uniform' } : source.uniforms?.girls,
        notes: uniformNotes.trim(),
      },
      admissions: {
        ...(source.admissions || {}),
        status: admissionStatus.trim(),
        session: admissionSession.trim() || '2027-28',
        process: admissionProcess.trim(),
        timelineDescription: timelineDescription.trim(),
        sourceUrl: admissionSourceUrl.trim() || undefined,
        milestones,
      },
      contact: {
        ...(source.contact || {}),
        phone: phone.trim() || null,
        email: email.trim() || null,
        website: website.trim() || null,
      },
      rating: {
        ...(source.rating || {}),
        score: Math.max(0, Math.min(5, Number(ratingScore) || 0)),
        scale: 5,
        reviewsCount: Math.max(0, Number(ratingReviews) || 0),
        breakdown,
      },
      assets: {
        ...(source.assets || {}),
        featured: featuredImage.trim() || null,
        hero: heroImage.trim() || null,
        gallery,
        imageSource: imageSource.trim() || undefined,
      },
      affiliationNumber: affiliationNumber.trim() || null,
      verification: {
        ...(source.verification || {}),
        isVerified: verificationStatus === 'verified_official',
        status: verificationStatus,
        lastVerified: new Date().toISOString().split('T')[0],
        sourceName: verificationSourceName.trim(),
        sourceUrl: verificationSourceUrl.trim() || null,
        cbseAffiliationNumber: affiliationNumber.trim() || null,
        verifiedFields: source.verification?.verifiedFields || [],
      },
    };
  }

  const applyRawJson = () => {
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed || typeof parsed !== 'object') throw new Error('JSON must contain a school object.');
      const parsedSchool = parsed as Partial<School>;
      setJsonBase(cleanForJson(parsedSchool) as Partial<School>);
      loadSchoolIntoForm(parsedSchool);
      setSuccessMessage('JSON applied to the form. Review it, then click Save School.');
      setActiveTab('basic');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON.');
    }
  };

  const addMilestone = () => {
    setMilestones(current => [...current, {
      id: `milestone_${Date.now()}_${current.length}`,
      label: 'Admission milestone',
      date: new Date().toISOString().slice(0, 10),
      type: 'custom',
      status: 'verified',
      verified: true,
      notes: '',
    }]);
  };

  const updateMilestone = (index: number, patch: Partial<AdmissionMilestone>) => {
    setMilestones(current => current.map((item, i) => i === index ? { ...item, ...patch } : item));
  };

  const removeMilestone = (index: number) => {
    setMilestones(current => current.filter((_, i) => i !== index));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setErrorMessage('School name is required.');
    if (isNew && !slug.trim()) return setErrorMessage('A URL slug is required.');
    if (lat.trim() && !Number.isFinite(Number(lat))) return setErrorMessage('Latitude is not a valid number.');
    if (lng.trim() && !Number.isFinite(Number(lng))) return setErrorMessage('Longitude is not a valid number.');

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = buildPayload(true);
      const url = isNew ? '/api/admin/schools' : `/api/admin/schools/${encodeURIComponent(schoolToEdit?.slug || slug)}`;
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify(
          isNew
            ? { schoolData: payload, reason: auditReason.trim() || 'School created via Admin CMS' }
            : { updates: payload, reason: auditReason.trim() || 'School updated via Admin CMS' }
        ),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || 'The server rejected this school change.');

      onSaved(data.school);
      setSuccessMessage(isNew ? 'School created and saved permanently.' : 'School updated and saved permanently.');
      if (isNew) {
        setTimeout(onClose, 700);
      } else {
        setTimeout(onClose, 700);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save school.');
    } finally {
      setIsSaving(false);
    }
  };

  const chooseUpload = (type: 'featured' | 'hero' | 'gallery') => {
    if (!schoolToEdit?.slug && !slug) {
      setErrorMessage('Save the school once first; then you can attach durable image files to it.');
      return;
    }
    setPendingUploadType(type);
    uploadInputRef.current?.click();
  };

  const uploadImage = async (file: File, type: 'featured' | 'hero' | 'gallery') => {
    setUploadingType(type);
    setErrorMessage(null);
    try {
      const form = new FormData();
      form.append('schoolSlug', schoolToEdit?.slug || slug);
      form.append('type', type);
      form.append('file', file);
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: form,
        cache: 'no-store',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message || 'Image upload failed.');
      const url = data.url as string;
      if (type === 'featured') setFeaturedImage(url);
      if (type === 'hero') setHeroImage(url);
      if (type === 'gallery') setGallery(current => current.includes(url) ? current : [...current, url]);
      setSuccessMessage('Image uploaded to persistent storage.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploadingType(null);
      setPendingUploadType(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const type = pendingUploadType;
    event.target.value = '';
    if (file && type) void uploadImage(file, type);
  };

  const inputClass = 'w-full rounded-xl bg-[#091b32] border border-[#1d4672] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10';
  const textareaClass = inputClass + ' leading-relaxed';
  const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5';
  const tabItems: { id: EditorTab; label: string; icon: React.ElementType }[] = [
    { id: 'basic', label: 'Basic', icon: Building2 },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'fees', label: 'Fees', icon: IndianRupee },
    { id: 'admissions', label: 'Admissions', icon: CalendarDays },
    { id: 'content', label: 'Contact & Content', icon: Phone },
    { id: 'media', label: 'Images', icon: ImageIcon },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'json', label: 'Advanced JSON', icon: FileJson },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[94vh] overflow-hidden rounded-3xl border border-[#28527d] bg-[#0b1d34] text-slate-100 shadow-2xl flex flex-col">
        <div className="px-5 py-4 border-b border-[#1d426a] bg-[#08172b] flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center">
                <Database className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {isNew ? 'Add School' : `Edit ${schoolToEdit?.name || 'School'}`}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Everything here is editable. Changes are stored in the persistent school database.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-2.5 border-b border-[#1d426a] bg-[#09182d] overflow-x-auto flex gap-1">
          {tabItems.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-colors ${active ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            );
          })}
        </div>

        {(errorMessage || successMessage) && (
          <div className="px-5 pt-4">
            {errorMessage && <div className="rounded-xl border border-rose-700/50 bg-rose-950/50 p-3 text-xs text-rose-200 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{errorMessage}</div>}
            {successMessage && <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/50 p-3 text-xs text-emerald-200 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{successMessage}</div>}
          </div>
        )}

        <form onSubmit={save} className="flex-1 min-h-0 overflow-y-auto p-5">
          {activeTab === 'basic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Official school name *"><input className={inputClass} value={name} onChange={e => handleNameChange(e.target.value)} required /></Field>
                <Field label="Display short name"><input className={inputClass} value={shortName} onChange={e => setShortName(e.target.value)} /></Field>
                <Field label="URL slug *"><input className={inputClass + ' font-mono'} value={slug} onChange={e => setSlug(e.target.value)} disabled={!isNew} required /></Field>
                <Field label="Board(s), comma separated"><input className={inputClass} value={boardsText} onChange={e => setBoardsText(e.target.value)} placeholder="CBSE, ICSE, IB" /></Field>
              </div>
              <Field label="Alternate names, comma separated"><input className={inputClass} value={alternateNamesText} onChange={e => setAlternateNamesText(e.target.value)} /></Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tagline"><input className={inputClass} value={tagline} onChange={e => setTagline(e.target.value)} /></Field>
                <Field label="Curriculum"><input className={inputClass} value={curriculum} onChange={e => setCurriculum(e.target.value)} /></Field>
              </div>
              <Field label="Editorial summary"><textarea className={textareaClass} rows={4} value={summary} onChange={e => setSummary(e.target.value)} /></Field>
              <Field label="Board note"><textarea className={textareaClass} rows={2} value={boardNote} onChange={e => setBoardNote(e.target.value)} /></Field>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="School type"><input className={inputClass} value={schoolType} onChange={e => setSchoolType(e.target.value)} placeholder="Co-Ed" /></Field>
                <Field label="Day / boarding"><input className={inputClass} value={dayOrBoarding} onChange={e => setDayOrBoarding(e.target.value)} /></Field>
                <Field label="Grade from"><input className={inputClass} value={gradeFrom} onChange={e => setGradeFrom(e.target.value)} /></Field>
                <Field label="Grade to"><input className={inputClass} value={gradeTo} onChange={e => setGradeTo(e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Admission age"><input className={inputClass} value={admissionAge} onChange={e => setAdmissionAge(e.target.value)} /></Field>
                <Field label="Student-teacher ratio"><input className={inputClass} value={ratio} onChange={e => setRatio(e.target.value)} /></Field>
                <Field label="Established year"><input type="number" className={inputClass} value={establishedYear} onChange={e => setEstablishedYear(e.target.value)} /></Field>
                <Field label="Classification"><select className={inputClass} value={classification} onChange={e => setClassification(e.target.value)}><option value="core_greater_noida_west">Core Greater Noida West</option><option value="nearby_surrounding">Nearby / Surrounding</option><option value="upcoming">Upcoming</option><option value="primary">Primary</option></select></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Record status"><select className={inputClass} value={status} onChange={e => setStatus(e.target.value)}><option value="active">Active</option><option value="archived">Archived</option><option value="alias">Alias</option></select></Field>
                <label className="flex items-center gap-2.5 rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-sm text-slate-200"><input type="checkbox" checked={isArchived} onChange={e => setIsArchived(e.target.checked)} /> Hide from public directory (archived)</label>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-5">
              <Field label="Full address *"><textarea className={textareaClass} rows={3} value={address} onChange={e => setAddress(e.target.value)} /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Sector / locality"><input className={inputClass} value={sector} onChange={e => setSector(e.target.value)} /></Field>
                <Field label="Area"><input className={inputClass} value={area} onChange={e => setArea(e.target.value)} /></Field>
                <Field label="City"><input className={inputClass} value={city} onChange={e => setCity(e.target.value)} /></Field>
                <Field label="PIN code"><input className={inputClass} value={pincode} onChange={e => setPincode(e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="Latitude"><input className={inputClass} value={lat} onChange={e => setLat(e.target.value)} placeholder="28.48..." /></Field>
                <Field label="Longitude"><input className={inputClass} value={lng} onChange={e => setLng(e.target.value)} placeholder="77.51..." /></Field>
                <label className="flex items-center gap-2.5 rounded-xl border border-[#1d4672] bg-[#091b32] px-3 py-2.5 text-sm text-slate-200"><input type="checkbox" checked={coordinatesVerified} onChange={e => setCoordinatesVerified(e.target.checked)} /> Coordinates verified</label>
              </div>
              <Field label="Map search query"><input className={inputClass} value={mapSearchQuery} onChange={e => setMapSearchQuery(e.target.value)} /></Field>
              <p className="text-xs text-slate-400">The School Run uses the stored latitude/longitude. Mark them verified only when you have personally confirmed the campus location.</p>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Card / annual fee"><input type="number" className={inputClass} value={cardFee} onChange={e => setCardFee(e.target.value)} /></Field>
                <Field label="Registration fee"><input type="number" className={inputClass} value={registrationFee} onChange={e => setRegistrationFee(e.target.value)} /></Field>
                <Field label="Admission fee"><input type="number" className={inputClass} value={admissionFee} onChange={e => setAdmissionFee(e.target.value)} /></Field>
                <Field label="Fee session shown"><input className={inputClass} value={feeSession} onChange={e => setFeeSession(e.target.value)} /></Field>
              </div>
              <Field label="Annual / range display"><input className={inputClass} value={annualDisplay} onChange={e => setAnnualDisplay(e.target.value)} placeholder="₹2,04,464 / year" /></Field>
              <Field label="Fee range text"><input className={inputClass} value={rangeText} onChange={e => setRangeText(e.target.value)} /></Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tuition monthly"><input className={inputClass} value={tuitionMonthly} onChange={e => setTuitionMonthly(e.target.value)} /></Field>
                <Field label="Tuition quarterly"><input className={inputClass} value={tuitionQuarterly} onChange={e => setTuitionQuarterly(e.target.value)} /></Field>
                <Field label="Tuition annual"><input className={inputClass} value={tuitionAnnual} onChange={e => setTuitionAnnual(e.target.value)} /></Field>
                <Field label="Transport monthly"><input className={inputClass} value={transportMonthly} onChange={e => setTransportMonthly(e.target.value)} /></Field>
                <Field label="Transport annual"><input className={inputClass} value={transportAnnual} onChange={e => setTransportAnnual(e.target.value)} /></Field>
                <Field label="Fee verification status"><select className={inputClass} value={feeVerificationStatus} onChange={e => setFeeVerificationStatus(e.target.value)}><option value="verified_from_source">Verified from source</option><option value="verified_official">Verified official</option><option value="calculated_from_official">Calculated from official</option><option value="estimated_historical">Estimated historical</option><option value="partially_verified">Partially verified</option><option value="pending_audit">Pending audit</option><option value="not_publicly_verified">Not publicly verified</option></select></Field>
              </div>
              <Field label="Fee source URL"><input className={inputClass} value={feeSourceUrl} onChange={e => setFeeSourceUrl(e.target.value)} /></Field>
              <Field label="Fee disclaimer"><textarea className={textareaClass} rows={3} value={feeDisclaimer} onChange={e => setFeeDisclaimer(e.target.value)} /></Field>
              <p className="text-xs text-slate-400">You can use the 2026–27 published fee in the 2027–28 display. Record the session exactly as you want it shown.</p>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Admission status"><input className={inputClass} value={admissionStatus} onChange={e => setAdmissionStatus(e.target.value)} /></Field>
                <Field label="Admission session"><input className={inputClass} value={admissionSession} onChange={e => setAdmissionSession(e.target.value)} /></Field>
                <Field label="Official source URL"><input className={inputClass} value={admissionSourceUrl} onChange={e => setAdmissionSourceUrl(e.target.value)} /></Field>
              </div>
              <Field label="Admission process"><textarea className={textareaClass} rows={4} value={admissionProcess} onChange={e => setAdmissionProcess(e.target.value)} /></Field>
              <Field label="Timeline description"><textarea className={textareaClass} rows={3} value={timelineDescription} onChange={e => setTimelineDescription(e.target.value)} /></Field>
              <div className="rounded-2xl border border-[#1d4672] bg-[#091b32] p-4 space-y-3">
                <div className="flex items-center justify-between"><div><h3 className="font-bold text-sm text-white">Admission milestones</h3><p className="text-xs text-slate-400">Add only dates you actually want displayed.</p></div><button type="button" onClick={addMilestone} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold">Add date</button></div>
                {milestones.map((m, index) => (
                  <div key={m.id || index} className="grid grid-cols-1 md:grid-cols-[1.3fr_180px_1fr_auto] gap-2 items-center">
                    <input className={inputClass} value={m.label} onChange={e => updateMilestone(index, { label: e.target.value })} />
                    <input type="date" className={inputClass} value={m.date} onChange={e => updateMilestone(index, { date: e.target.value })} />
                    <input className={inputClass} value={m.notes || ''} onChange={e => updateMilestone(index, { notes: e.target.value })} placeholder="Notes" />
                    <button type="button" onClick={() => removeMilestone(index)} className="p-2 rounded-lg text-rose-300 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Phone"><input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} /></Field>
                <Field label="Email"><input className={inputClass} value={email} onChange={e => setEmail(e.target.value)} /></Field>
                <Field label="Website"><input className={inputClass} value={website} onChange={e => setWebsite(e.target.value)} /></Field>
                <Field label="School timings"><input className={inputClass} value={timings} onChange={e => setTimings(e.target.value)} placeholder="8:00 AM – 2:30 PM" /></Field>
                <Field label="Transport details"><input className={inputClass} value={transportDetails} onChange={e => setTransportDetails(e.target.value)} /></Field>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Facilities — one per line, optionally Name | Category"><textarea className={textareaClass} rows={9} value={facilitiesText} onChange={e => setFacilitiesText(e.target.value)} /></Field>
                <Field label="Sports — one per line"><textarea className={textareaClass} rows={9} value={sportsText} onChange={e => setSportsText(e.target.value)} /></Field>
                <Field label="Achievements / highlights — one per line"><textarea className={textareaClass} rows={7} value={achievementsText} onChange={e => setAchievementsText(e.target.value)} /></Field>
                <div className="space-y-4">
                  <Field label="Uniform boys image URL"><input className={inputClass} value={uniformBoysImage} onChange={e => setUniformBoysImage(e.target.value)} /></Field>
                  <Field label="Uniform girls image URL"><input className={inputClass} value={uniformGirlsImage} onChange={e => setUniformGirlsImage(e.target.value)} /></Field>
                  <Field label="Uniform notes"><textarea className={textareaClass} rows={4} value={uniformNotes} onChange={e => setUniformNotes(e.target.value)} /></Field>
                </div>
              </div>
              <div className="rounded-2xl border border-[#1d4672] bg-[#091b32] p-4 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm"><Star className="w-4 h-4 text-amber-400" /> Public rating controls</div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Rating score (0–5)"><input type="number" min="0" max="5" step="0.1" className={inputClass} value={ratingScore} onChange={e => setRatingScore(e.target.value)} /></Field>
                  <Field label="Displayed review count"><input type="number" min="0" className={inputClass} value={ratingReviews} onChange={e => setRatingReviews(e.target.value)} /></Field>
                </div>
                <Field label="Rating breakdown JSON"><textarea className={textareaClass + ' font-mono text-xs'} rows={4} value={ratingBreakdownJson} onChange={e => setRatingBreakdownJson(e.target.value)} /></Field>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-5">
              <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleFileChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MediaCard title="Featured image" value={featuredImage} onChange={setFeaturedImage} onUpload={() => chooseUpload('featured')} busy={uploadingType === 'featured'} />
                <MediaCard title="Hero image" value={heroImage} onChange={setHeroImage} onUpload={() => chooseUpload('hero')} busy={uploadingType === 'hero'} />
              </div>
              <div className="rounded-2xl border border-[#1d4672] bg-[#091b32] p-4 space-y-4">
                <div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-sm text-white">Gallery</h3><p className="text-xs text-slate-400">Upload files or paste existing image URLs.</p></div><button type="button" onClick={() => chooseUpload('gallery')} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-50" disabled={uploadingType === 'gallery'}><Upload className="w-3.5 h-3.5" />{uploadingType === 'gallery' ? 'Uploading…' : 'Upload image'}</button></div>
                <div className="space-y-2">
                  {gallery.map((url, index) => <div key={url + index} className="flex items-center gap-2"><input className={inputClass + ' flex-1 text-xs'} value={url} onChange={e => setGallery(current => current.map((v, i) => i === index ? e.target.value : v))} /><button type="button" onClick={() => setGallery(current => current.filter((_, i) => i !== index))} className="p-2 rounded-lg text-rose-300 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></button></div>)}
                </div>
                <button type="button" onClick={() => setGallery(current => [...current, ''])} className="text-xs font-bold text-amber-300">+ Add image URL</button>
              </div>
              <Field label="Image source / credit"><input className={inputClass} value={imageSource} onChange={e => setImageSource(e.target.value)} placeholder="Official school upload / parent supplied / etc." /></Field>
              <p className="text-xs text-slate-400">Uploads are stored in MongoDB GridFS and served through a stable Admission Pitara URL. For a new school, save the record once before uploading files.</p>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="CBSE / affiliation number"><input className={inputClass} value={affiliationNumber} onChange={e => setAffiliationNumber(e.target.value)} /></Field>
                <Field label="Verification status"><select className={inputClass} value={verificationStatus} onChange={e => setVerificationStatus(e.target.value as typeof verificationStatus)}><option value="verified_official">Verified official</option><option value="partially_verified">Partially verified</option><option value="pending_audit">Pending audit</option></select></Field>
                <Field label="Verification source name"><input className={inputClass} value={verificationSourceName} onChange={e => setVerificationSourceName(e.target.value)} /></Field>
                <Field label="Verification source URL"><input className={inputClass} value={verificationSourceUrl} onChange={e => setVerificationSourceUrl(e.target.value)} /></Field>
              </div>
              <Field label="Audit reason"><textarea className={textareaClass} rows={3} value={auditReason} onChange={e => setAuditReason(e.target.value)} /></Field>
              <div className="rounded-2xl border border-emerald-700/30 bg-emerald-950/20 p-4 text-xs text-emerald-200 flex gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <div><p className="font-bold">Verification is editable by design.</p><p className="mt-1 text-emerald-100/80">This panel is your editorial source of truth. You can mark a field verified, partially verified, or pending and keep the source URL beside it.</p></div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div><h3 className="font-bold text-white flex items-center gap-2"><FileJson className="w-4 h-4 text-amber-300" />Paste / edit the complete school object</h3><p className="text-xs text-slate-400 mt-1">This is the escape hatch for any field not exposed in the friendly form.</p></div>
                <button type="button" onClick={() => setRawJson(JSON.stringify(cleanForJson(buildPayload(true)), null, 2))} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#28527d] text-xs font-bold text-slate-200 hover:bg-white/5"><RotateCcw className="w-3.5 h-3.5" />Refresh from form</button>
              </div>
              <textarea className={textareaClass + ' min-h-[520px] font-mono text-[11px]'} value={rawJson} onChange={e => setRawJson(e.target.value)} spellCheck={false} />
              <button type="button" onClick={applyRawJson} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold">Apply JSON to form</button>
            </div>
          )}

          <div className="sticky bottom-0 -mx-5 mt-6 px-5 py-4 bg-[#08172b]/95 backdrop-blur border-t border-[#1d426a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">Save once. Public pages will read the same persistent record.</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-[#28527d] text-xs font-bold text-slate-300 hover:text-white">Cancel</button>
              <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold disabled:opacity-60"><Save className="w-4 h-4" />{isSaving ? 'Saving…' : isNew ? 'Add School' : 'Save Changes'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">{label}</label>{children}</div>;
}

function MediaCard({ title, value, onChange, onUpload, busy }: {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: () => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#1d4672] bg-[#091b32] p-4 space-y-3">
      <div className="flex items-center justify-between gap-3"><h3 className="font-bold text-sm text-white">{title}</h3><button type="button" onClick={onUpload} disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-2.5 py-1.5 text-[11px] font-bold text-slate-950 disabled:opacity-50"><Upload className="w-3.5 h-3.5" />{busy ? 'Uploading…' : 'Upload'}</button></div>
      {value ? <div className="rounded-xl border border-white/5 overflow-hidden bg-black/20"><img src={value} alt="" className="w-full aspect-video object-cover" /></div> : <div className="aspect-video rounded-xl border border-dashed border-[#28527d] flex items-center justify-center text-xs text-slate-500">No image selected</div>}
      <input className="w-full rounded-lg bg-[#071528] border border-[#1d4672] px-2.5 py-2 text-[11px] text-slate-300" value={value} onChange={e => onChange(e.target.value)} placeholder="Or paste an image URL" />
    </div>
  );
}
