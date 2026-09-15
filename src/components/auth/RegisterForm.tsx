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
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Info,
  Edit3,
} from 'lucide-react';

const GREATER_NOIDA_LOCALITIES = [
  { value: 'Techzone 4, Greater Noida West', label: 'Techzone 4 (Near Gaur City)' },
  { value: 'Sector 1, Greater Noida West', label: 'Sector 1' },
  { value: 'Sector 2, Greater Noida West', label: 'Sector 2' },
  { value: 'Sector 3, Greater Noida West', label: 'Sector 3' },
  { value: 'Sector 4, Greater Noida West', label: 'Sector 4 / Gaur City 1' },
  { value: 'Sector 10, Greater Noida West', label: 'Sector 10' },
  { value: 'Sector 12, Greater Noida West', label: 'Sector 12' },
  { value: 'Sector 16B, Greater Noida West', label: 'Sector 16B / Gaur City 2' },
  { value: 'Sector 16C, Greater Noida West', label: 'Sector 16C' },
  { value: 'Knowledge Park 5, Greater Noida West', label: 'Knowledge Park 5' },
  { value: 'Zeta 1, Greater Noida', label: 'Zeta 1' },
  { value: 'Chi 4, Greater Noida', label: 'Chi 4' },
  { value: 'Beta 1 & 2, Greater Noida', label: 'Beta 1 & 2' },
  { value: 'Gamma 1 & 2, Greater Noida', label: 'Gamma 1 & 2' },
  { value: 'Delta 1 & 2, Greater Noida', label: 'Delta 1 & 2' },
  { value: 'Other Locality in Greater Noida', label: 'Other Locality / Sector' },
];

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { sendOtp, verifyOtp, register, isAuthenticated } = useAuth();

  // Step 1: Parent Details, Step 2: Email OTP Verification
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [locality, setLocality] = useState('Techzone 4, Greater Noida West');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childGrade, setChildGrade] = useState('Nursery / Pre-K');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage('Please enter your full parent / guardian name (minimum 2 characters).');
      return;
    }

    const emailClean = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      setErrorMessage('Please provide a valid email address (e.g. parent@example.com).');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    if (!locality) {
      setErrorMessage('Please select your sector / locality in Greater Noida.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsSubmitting(true);
    const res = await sendOtp(emailClean, { purpose: 'register', name: name.trim() });
    setIsSubmitting(false);

    if (res.success) {
      setStep(2);
      setResendCooldown(45);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
    } else {
      setErrorMessage(res.message || 'Failed to dispatch verification email. Please check the email entered.');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);

    const emailClean = email.trim().toLowerCase();
    const res = await sendOtp(emailClean, { purpose: 'register', name: name.trim() });
    setIsSubmitting(false);

    if (res.success) {
      setResendCooldown(60);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
    } else {
      setErrorMessage(res.message || 'Failed to resend verification email.');
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code sent to your email.');
      return;
    }

    setIsSubmitting(true);
    const emailClean = email.trim().toLowerCase();
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    // 1. Verify OTP with backend
    const verifyRes = await verifyOtp(emailClean, cleanOtp);

    if (!verifyRes.success || !verifyRes.verificationToken) {
      setIsSubmitting(false);
      setErrorMessage(verifyRes.message || 'Invalid or expired verification code. Please try again.');
      return;
    }

    // 2. Complete Account Registration
    const regRes = await register({
      name: name.trim(),
      email: emailClean,
      mobile: cleanMobile,
      locality,
      password,
      verificationToken: verifyRes.verificationToken,
      childGrade,
      termsAccepted,
      marketingConsent,
    });

    setIsSubmitting(false);

    if (regRes.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(regRes.message || 'Failed to finalize parent account registration.');
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-sm border border-[var(--color-border)] bg-white">
      <CardHeader className="space-y-1.5 pb-4 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Parent Verification</span>
          </div>
          <span className="text-xs font-semibold text-[var(--color-content-subtle)]">
            {step === 1 ? 'Step 1 of 2: Details' : 'Step 2 of 2: Email Verification'}
          </span>
        </div>

        <CardTitle className="text-xl sm:text-2xl font-black text-[var(--color-content)] tracking-tight">
          {step === 1 ? 'Create Parent Account' : 'Verify your email'}
        </CardTitle>

        <CardDescription className="text-xs text-[var(--color-content-muted)]">
          {step === 1
            ? 'Join Greater Noida parents to compare verified school fees and track admission updates.'
            : `We've sent a 6-digit verification code to ${email.trim().toLowerCase()}.`}
        </CardDescription>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-[var(--color-primary)] h-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2.5 animate-fadeIn">
            <Info className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <form onSubmit={handleInitiateSignup} className="space-y-4">
            <Input
              label="Parent / Guardian Full Name"
              placeholder="e.g. Priya Sharma / Amit Verma"
              value={name}
              onChange={e => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Email Address (Verification OTP will be sent here)"
              placeholder="parent@example.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              helperText="We will send a 6-digit single-use OTP to this email."
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Mobile Number (10 Digits)"
                placeholder="e.g. 9876543210"
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                required
              />

              <Select
                label="Locality in Greater Noida"
                value={locality}
                onChange={e => setLocality(e.target.value)}
                options={GREATER_NOIDA_LOCALITIES}
              />
            </div>

            <Select
              label="Child's Target Grade"
              value={childGrade}
              onChange={e => setChildGrade(e.target.value)}
              options={[
                { value: 'Playgroup / Daycare', label: 'Playgroup / Daycare' },
                { value: 'Nursery / Pre-K', label: 'Nursery / Pre-K' },
                { value: 'KG / Kindergarten', label: 'KG / Kindergarten' },
                { value: 'Grade 1 - 5 (Primary)', label: 'Grade 1 – 5 (Primary)' },
                { value: 'Grade 6 - 8 (Middle)', label: 'Grade 6 – 8 (Middle)' },
                { value: 'Grade 9 - 10 (Secondary)', label: 'Grade 9 – 10 (Secondary)' },
                { value: 'Grade 11 - 12 (Senior Secondary)', label: 'Grade 11 – 12 (Senior Secondary)' },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Create Password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            {/* Consent Safeguards */}
            <div className="pt-2 space-y-3 border-t border-[var(--color-border-subtle)]">
              <Checkbox
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                label={
                  <span className="text-xs text-[var(--color-content)] leading-tight">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="font-semibold text-sky-700 underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" className="font-semibold text-sky-700 underline">
                      Privacy Policy
                    </Link>
                    . (Mandatory)
                  </span>
                }
              />

              <Checkbox
                checked={marketingConsent}
                onChange={e => setMarketingConsent(e.target.checked)}
                label={
                  <span className="text-xs text-[var(--color-content-muted)] leading-tight">
                    Send me admission deadline alerts and verified fee update digests for Greater Noida schools. (Optional)
                  </span>
                }
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Verification Code
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Email OTP Verification Screen */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            {/* Email verification recipient banner */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Verification Code sent to:</span>
                  <strong className="text-slate-900 font-bold text-xs">{email.trim().toLowerCase()}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setErrorMessage(null);
                  setDevOtpHint(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change Email</span>
              </button>
            </div>

            {/* Development helper banner when email config is in test mode */}
            {devOtpHint && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fadeIn">
                <div>
                  <span className="font-semibold block">[Sandbox Preview] Verification Code:</span>
                  <strong className="font-mono text-sm tracking-widest text-emerald-950 font-black">
                    {devOtpHint}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(devOtpHint)}
                  className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 cursor-pointer"
                >
                  Auto Fill Code
                </button>
              </div>
            )}

            {/* OTP Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--color-content)] block">
                Enter 6-Digit Email Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoFocus
                placeholder="••••••"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.4em] text-2xl font-mono py-3 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 focus:outline-none font-black text-slate-900 bg-white"
              />
              <p className="text-[11px] text-slate-500 text-center">
                Valid for 10 minutes. Please check your spam or junk folder if not in inbox.
              </p>
            </div>

            {/* Resend Cooldown */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <span>Didn&apos;t receive the email?</span>
              <button
                type="button"
                disabled={resendCooldown > 0 || isSubmitting}
                onClick={handleResendOtp}
                className="font-bold text-sky-700 disabled:text-slate-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                  setStep(1);
                  setErrorMessage(null);
                }}
                className="w-1/3"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-2/3 font-bold"
              >
                Verify & Create Account
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-[var(--color-border-subtle)] py-4 text-xs text-[var(--color-content-muted)]">
        Already have a parent account?{' '}
        <Link href="/auth/login" className="font-bold text-[var(--color-primary)] ml-1 hover:underline">
          Sign in here
        </Link>
      </CardFooter>
    </Card>
  );
};
