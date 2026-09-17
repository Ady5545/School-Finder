'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OtpInput } from '../ui/OtpInput';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Tooltip } from '../ui/Tooltip';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import {
  ShieldCheck,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Info,
  Edit3,
  MapPin,
  Phone,
  Building2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Shield,
  Users,
} from 'lucide-react';

const SCHOOL_SEARCH_LOCALITIES = [
  { value: 'Greater Noida West', label: 'Greater Noida West (Entire Area)' },
  { value: 'Sector 16B', label: 'Sector 16B / Gaur City 2' },
  { value: 'Sector 4', label: 'Sector 4 / Gaur City 1' },
  { value: 'Techzone 4', label: 'Techzone 4' },
  { value: 'Knowledge Park 5', label: 'Knowledge Park 5' },
  { value: 'Sector 1', label: 'Sector 1' },
  { value: 'Sector 2', label: 'Sector 2' },
  { value: 'Sector 3', label: 'Sector 3' },
  { value: 'Sector 10', label: 'Sector 10' },
  { value: 'Sector 12', label: 'Sector 12' },
  { value: 'Sector 16C', label: 'Sector 16C' },
  { value: 'Zeta 1', label: 'Zeta 1' },
  { value: 'Delta & Gamma Sectors', label: 'Delta / Gamma Sectors' },
  { value: 'Other Locality', label: 'Other Sector / Locality' },
];

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { sendOtp, verifyOtp, register, isAuthenticated } = useAuth();

  // Step 1: Parent Details & Location Preference, Step 2: Email OTP Verification
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields - Required
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childGrade, setChildGrade] = useState('Nursery / Pre-K');
  const [residentialSociety, setResidentialSociety] = useState('');
  const [preferredSchoolLocality, setPreferredSchoolLocality] = useState('Greater Noida West');

  // Form Fields - Family Details (Expanded by default, collapsible, non-required)
  const [showFamilyDetails, setShowFamilyDetails] = useState(true);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');

  // Password & Consents
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  // Password Complexity
  const passwordCriteria = [
    { id: 'length', label: 'Minimum 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'At least one lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'At least one number (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'At least one special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
  ];
  const metCriteriaCount = passwordCriteria.filter(c => c.met).length;
  const isPasswordComplex = metCriteriaCount === passwordCriteria.length;
  const passwordsMatch = Boolean(confirmPassword) && password === confirmPassword;

  // Email OTP Verification States
  const [emailOtp, setEmailOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Parent Name
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full Parent / Guardian name (minimum 2 characters).');
      return;
    }

    // 2. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 3. Phone Number (Indian mobile validation)
    const cleanedPhone = phone.trim().replace(/[\s\-\(\)\.]/g, '');
    const phoneRegex = /^(?:\+91|91|0)?([6-9]\d{9})$/;
    if (!cleanedPhone || !phoneRegex.test(cleanedPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 98765 43210).');
      return;
    }

    // 4. Child Name
    if (!childName.trim() || childName.trim().length < 2) {
      setErrorMessage('Please enter your child / student name (minimum 2 characters).');
      return;
    }

    // 5. Child Grade
    if (!childGrade.trim()) {
      setErrorMessage('Please select target admission class/grade.');
      return;
    }

    // 6. Residential Society
    if (!residentialSociety.trim() || residentialSociety.trim().length < 3) {
      setErrorMessage('Please enter your residential society or apartment complex name (minimum 3 characters).');
      return;
    }

    // 7. Optional Family Names
    if (fatherName.trim() && fatherName.trim().length < 2) {
      setErrorMessage("Father's name must be at least 2 characters if provided.");
      return;
    }
    if (motherName.trim() && motherName.trim().length < 2) {
      setErrorMessage("Mother's name must be at least 2 characters if provided.");
      return;
    }

    // 8. Password Security
    if (!isPasswordComplex) {
      setErrorMessage('Please ensure your password meets all 5 security criteria.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    // 9. Terms Acceptance
    if (!termsAccepted) {
      setErrorMessage('You must accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendOtp(email.trim(), { purpose: 'register', name: name.trim() });
      if (result.success) {
        setStep(2);
        setResendCooldown(60);
        if (result.devOtp) {
          setDevOtpHint(result.devOtp);
        }
      } else {
        setErrorMessage(result.message || 'Failed to dispatch verification code. Please try again.');
      }
    } catch {
      setErrorMessage('Network error occurred while sending verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    const cleanOtp = emailOtp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await verifyOtp(email.trim(), cleanOtp);
      if (res.success && res.verificationToken) {
        setEmailVerified(true);
        setVerificationToken(res.verificationToken);
        setDevOtpHint(null);

        // Auto complete registration with all required and optional fields
        const regRes = await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          childName: childName.trim(),
          childGrade,
          residentialSociety: residentialSociety.trim(),
          fatherName: fatherName.trim() || undefined,
          motherName: motherName.trim() || undefined,
          preferredSchoolLocality,
          password,
          verificationToken: res.verificationToken,
          termsAccepted: true,
          analyticsConsent,
        });

        if (regRes.success) {
          router.push('/dashboard');
        } else {
          setErrorMessage(regRes.message || 'Account registration failed.');
        }
      } else {
        setErrorMessage(res.message || 'Invalid verification code. Please check and retry.');
      }
    } catch {
      setErrorMessage('An error occurred during verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await sendOtp(email.trim(), { purpose: 'register', name: name.trim() });
      if (res.success) {
        setResendCooldown(60);
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
        }
      } else {
        setErrorMessage(res.message || 'Failed to resend code.');
      }
    } catch {
      setErrorMessage('Network error while resending code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card id="parent-registration-card" className="w-full max-w-xl mx-auto shadow-xl border-stone-200 bg-white">
      <CardHeader className="text-center pb-4 pt-6 px-6 sm:px-8 border-b border-stone-100">
        <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-700">
          <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
        </div>
        <CardTitle className="text-2xl font-serif text-stone-900 tracking-tight">
          Create Verified Parent Account
        </CardTitle>
        <CardDescription className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
          Access verified fee tables, save your shortlist, submit genuine school reviews, and track admissions.
        </CardDescription>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
              step === 1 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            {step === 2 ? <Check className="w-3.5 h-3.5" /> : <span>1</span>}
            <span>Parent Profile & Child Details</span>
          </div>
          <div className="w-6 h-px bg-stone-300" />
          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
              step === 2 ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-500'
            }`}
          >
            <span>2</span>
            <span>Email Verification</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div
            id="register-error-banner"
            className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-start gap-3 animate-shake"
          >
            <Info className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Registration Note</p>
              <p className="mt-0.5 text-xs text-red-800 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Parent Details & Location */}
        {step === 1 && (
          <form id="step-1-parent-details" onSubmit={handleInitiateSignup} className="space-y-4">
            {/* Section: Parent / Guardian Info */}
            <div className="space-y-4">
              {/* Field 1: Parent / Guardian Name */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Parent / Guardian Name <span className="text-amber-700">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Fields 2 & 3: Father's Name & Mother's Name (Directly near Parent / Guardian Name, Expanded by default, Collapsible, No 'Optional' label, No asterisks) */}
              <div className="bg-stone-50/80 rounded-xl border border-stone-200/80 overflow-hidden transition-all">
                <button
                  type="button"
                  id="toggle-family-details-btn"
                  onClick={() => setShowFamilyDetails(!showFamilyDetails)}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs font-semibold text-stone-700 hover:text-stone-900 text-left transition-colors"
                  aria-expanded={showFamilyDetails}
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-500" />
                    <span>Father &amp; Mother Details</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-normal text-stone-500">
                    <span>{showFamilyDetails ? 'Hide' : 'Show'}</span>
                    {showFamilyDetails ? (
                      <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                    )}
                  </span>
                </button>

                {showFamilyDetails && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-stone-200/60 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-father-name" className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Father&apos;s Name
                        </label>
                        <Input
                          id="reg-father-name"
                          type="text"
                          placeholder="e.g. Rajesh Sharma"
                          value={fatherName}
                          onChange={e => setFatherName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-mother-name" className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Mother&apos;s Name
                        </label>
                        <Input
                          id="reg-mother-name"
                          type="text"
                          placeholder="e.g. Sunita Sharma"
                          value={motherName}
                          onChange={e => setMotherName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information: Email & Phone visually close to one another */}
              <div className="pt-2 border-t border-stone-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Field 4: Email Address */}
                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Email Address <span className="text-amber-700">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="pl-10"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {/* OTP explanation: visible directly below Email, NOT inside tooltip */}
                    <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                      A 6-digit verification code (OTP) will be sent to this email address to activate your account.
                    </p>
                  </div>

                  {/* Field 5: Phone Number with ? Tooltip */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="reg-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                        Phone Number <span className="text-amber-700">*</span>
                      </label>
                      <Tooltip
                        id="tooltip-reg-phone"
                        align="right"
                        text="Your phone number is part of your parent profile and may be used for relevant admission-related communication and deadline updates."
                      />
                    </div>
                    <div className="relative">
                      <Input
                        id="reg-phone"
                        type="tel"
                        placeholder="e.g. 98765 43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="pl-10"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      10-digit Indian mobile number.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Child / Student Details */}
            <div className="pt-2 border-t border-stone-100 space-y-4">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span>Student &amp; Admission Profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field 6: Child / Student Name */}
                <div>
                  <label htmlFor="reg-child-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Child / Student Name <span className="text-amber-700">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="reg-child-name"
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={childName}
                      onChange={e => setChildName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="pl-10"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Field 7: Grade / Class */}
                <div>
                  <label htmlFor="reg-child-grade" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Grade / Class <span className="text-amber-700">*</span>
                  </label>
                  <Select
                    id="reg-child-grade"
                    options={[
                      { value: 'Nursery / Pre-K', label: 'Nursery / Pre-School (Ages 3-4)' },
                      { value: 'KG / Kindergarten', label: 'Kindergarten / KG' },
                      { value: 'Primary (Grades 1-5)', label: 'Primary School (Grades 1-5)' },
                      { value: 'Middle School (Grades 6-8)', label: 'Middle School (Grades 6-8)' },
                      { value: 'Secondary (Grades 9-10)', label: 'Secondary (Grades 9-10)' },
                      { value: 'Senior Secondary (Grades 11-12)', label: 'Senior Secondary (Grades 11-12)' },
                    ]}
                    value={childGrade}
                    onChange={e => setChildGrade(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Section: Residence & Locality */}
            <div className="pt-2 border-t border-stone-100 space-y-4">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Residence &amp; Locality</span>
              </div>

              {/* Field 8: Residential Society / Apartment Complex with ? Tooltip */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="reg-residential-society" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Residential Society / Apartment Complex <span className="text-amber-700">*</span>
                  </label>
                  <Tooltip
                    id="tooltip-reg-society"
                    align="right"
                    text="This helps Admission Pitara understand which schools are realistically accessible from where families live and improve relevant school discovery and recommendations."
                  />
                </div>
                <div className="relative">
                  <Input
                    id="reg-residential-society"
                    type="text"
                    placeholder="e.g. Gaur City 2, Panchsheel Greens, Nirala Estate, Arihant Arden"
                    value={residentialSociety}
                    onChange={e => setResidentialSociety(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                  <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="mt-1.5 flex items-start gap-1.5 p-2 bg-stone-50 rounded border border-stone-200/80 text-[11px] text-stone-600">
                  <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Notice:</strong> Enter only your society or apartment complex name. Please don&apos;t enter your flat, tower, floor, or house number.
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="reg-locality" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Which area are you looking for a school in?
                </label>
                <div className="relative">
                  <Select
                    id="reg-locality"
                    options={SCHOOL_SEARCH_LOCALITIES}
                    value={preferredSchoolLocality}
                    onChange={e => setPreferredSchoolLocality(e.target.value)}
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Helps prioritize schools near your preferred search sectors.
                </p>
              </div>
            </div>

            {/* Section: Password & Security */}
            <div className="pt-2 border-t border-stone-100 space-y-4">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Create Account Password <span className="text-amber-700">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password criteria checklist */}
                {password.length > 0 && (
                  <div className="mt-2.5 p-2.5 bg-stone-50 border border-stone-200 rounded-md text-[11px] space-y-1">
                    <div className="font-semibold text-stone-700 flex justify-between">
                      <span>Password Strength:</span>
                      <span className={metCriteriaCount === 5 ? 'text-emerald-700' : 'text-amber-700'}>
                        {metCriteriaCount} of 5 rules met
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                      {passwordCriteria.map(crit => (
                        <div
                          key={crit.id}
                          className={`flex items-center gap-1.5 ${crit.met ? 'text-emerald-700 font-medium' : 'text-stone-400'}`}
                        >
                          {crit.met ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-3 text-center">•</span>}
                          <span>{crit.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Confirm Password <span className="text-amber-700">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password..."
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-red-600 text-xs mt-1">Passwords do not match.</p>
                )}
              </div>
            </div>

            {/* Terms and Privacy Consent */}
            <div className="pt-2 space-y-2 border-t border-stone-100">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="reg-terms"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  required
                  className="mt-0.5"
                />
                <label htmlFor="reg-terms" className="text-xs text-stone-600 leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-amber-800 underline font-medium hover:text-amber-900">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-amber-800 underline font-medium hover:text-amber-900">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="reg-analytics"
                  checked={analyticsConsent}
                  onChange={e => setAnalyticsConsent(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="reg-analytics" className="text-xs text-stone-500 leading-relaxed cursor-pointer">
                  Allow privacy-conscious anonymous school view metrics to help improve editorial directory data.
                </label>
              </div>
            </div>

            <Button
              id="continue-to-email-verification-btn"
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center mt-4 bg-amber-800 hover:bg-amber-900 text-white font-medium"
              disabled={isSubmitting || !isPasswordComplex || !passwordsMatch || !termsAccepted}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Generating Verification Code...
                </>
              ) : (
                <>
                  <span>Continue to Email Verification</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* STEP 2: Email OTP Verification */}
        {step === 2 && (
          <div id="step-2-email-verification" className="space-y-6">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-950">Verification Code Sent To</p>
                  <p className="text-sm font-medium text-stone-800 break-all">{email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMessage(null);
                }}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 underline shrink-0 ml-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Change Email</span>
              </button>
            </div>

            {devOtpHint && (
              <div className="p-3 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-700 flex items-center justify-between">
                <span>
                  <strong>Development Mode Code:</strong> {devOtpHint}
                </span>
                <button
                  type="button"
                  onClick={() => setEmailOtp(devOtpHint)}
                  className="px-2 py-1 bg-white border border-stone-300 rounded text-stone-800 hover:bg-stone-50 font-medium text-xs"
                >
                  Auto Fill
                </button>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 text-center">
                Enter 6-Digit Email Code
              </label>

              <OtpInput
                length={6}
                value={emailOtp}
                onChange={setEmailOtp}
                onComplete={() => {
                  // Optional auto-submit when all 6 digits are entered
                }}
                disabled={isSubmitting || emailVerified}
                hasError={Boolean(errorMessage)}
              />

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Didn&apos;t see the email?</span>
                </p>
                <p className="leading-relaxed pl-5">
                  Check your spam or junk folder. The code is valid for 10 minutes.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>Didn&apos;t receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isSubmitting}
                  className="text-amber-800 font-semibold hover:underline disabled:text-stone-400 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
            </div>

            <Button
              id="verify-and-register-btn"
              type="button"
              variant="primary"
              size="lg"
              onClick={handleVerifyEmail}
              className="w-full justify-center bg-amber-800 hover:bg-amber-900 text-white font-medium"
              disabled={isSubmitting || emailOtp.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Verifying & Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span>Verify Email & Complete Registration</span>
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-stone-50/80 px-6 sm:px-8 py-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
        <span>Already have a parent account?</span>
        <Link
          id="login-link-from-register"
          href="/login"
          className="font-semibold text-amber-800 hover:text-amber-950 transition-colors"
        >
          Sign In to Pitara &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
};
