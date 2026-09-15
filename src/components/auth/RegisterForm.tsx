'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
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
  Sparkles,
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

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredSchoolLocality, setPreferredSchoolLocality] = useState('Greater Noida West');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [childGrade, setChildGrade] = useState('Nursery / Pre-K');
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

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full Parent / Guardian name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!isPasswordComplex) {
      setErrorMessage('Please ensure your password meets all security criteria.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

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

        // Auto complete registration
        const regRes = await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          preferredSchoolLocality,
          password,
          verificationToken: res.verificationToken,
          childGrade,
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
            <span>Parent Profile & Location</span>
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
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Parent / Guardian Full Name <span className="text-amber-700">*</span>
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

            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address <span className="text-amber-700">*</span>
              </label>
              <div className="relative">
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="e.g. parent@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="pl-10"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                A 6-digit verification code will be sent to this email address.
              </p>
            </div>

            {/* School Search Locality */}
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
                Helps prioritize schools near your preferred search sectors. We never ask for or store your home address.
              </p>
            </div>

            <div>
              <label htmlFor="reg-child-grade" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Target Admission Class
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

            {/* Password */}
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
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-950">Verification Code Sent To</p>
                  <p className="text-sm font-medium text-stone-800">{email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {devOtpHint && (
              <div className="p-3 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-700 flex items-center justify-between">
                <span>
                  <strong>Development Mode OTP:</strong> {devOtpHint}
                </span>
                <button
                  type="button"
                  onClick={() => setEmailOtp(devOtpHint)}
                  className="px-2 py-1 bg-white border border-stone-300 rounded text-stone-800 hover:bg-stone-50 font-medium"
                >
                  Auto Fill
                </button>
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="email-otp-input" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Enter 6-Digit Email Code
              </label>
              <div className="relative">
                <Input
                  id="email-otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={emailOtp}
                  onChange={e => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={isSubmitting || emailVerified}
                  className="text-center font-mono text-xl tracking-widest pl-4"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>Didn&apos;t receive the code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isSubmitting}
                  className="text-amber-800 font-semibold hover:underline disabled:text-stone-400 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
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
                  Verifying & Registering...
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
