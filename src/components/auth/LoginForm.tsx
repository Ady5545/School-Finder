'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import {
  ShieldCheck,
  Mail,
  Lock,
  Info,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, sendOtp, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Email OTP flow state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier || !password) {
      setErrorMessage('Please enter both your email/mobile and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login({ identifier, password, loginType: 'password' });
    setIsSubmitting(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRequestLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await sendOtp(cleanEmail, { purpose: 'login' });
    setIsSubmitting(false);

    if (res.success) {
      setOtpSent(true);
      setResendCooldown(45);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
    } else {
      setErrorMessage(res.message || 'Failed to dispatch login verification code.');
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp || otp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    const res = await login({ email: email.trim().toLowerCase(), otp: otp.trim(), loginType: 'otp' });
    setIsSubmitting(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.message || 'Invalid or expired verification code.');
    }
  };

  const fillDemoAccount = () => {
    setIdentifier('parent@example.com');
    setPassword('Parent@12345');
    setActiveTab('password');
    setErrorMessage(null);
  };

  return (
    <Card className="w-full max-w-md shadow-sm border border-[var(--color-border)] bg-white">
      <CardHeader className="space-y-1.5 pb-4 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Family Portal</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="text-[11px] font-bold text-sky-700 hover:text-sky-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Fill Demo Account</span>
          </button>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-black text-[var(--color-content)] tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-xs text-[var(--color-content-muted)]">
          Sign in to access your shortlisted Greater Noida schools and saved comparisons.
        </CardDescription>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mt-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setErrorMessage(null);
            }}
            className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'password'
                ? 'bg-white text-[var(--color-content)] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Password Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('otp');
              setErrorMessage(null);
            }}
            className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'otp'
                ? 'bg-white text-[var(--color-content)] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email Code Sign In
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2 animate-fadeIn">
            <Info className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {activeTab === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <Input
              label="Email Address or Mobile Number"
              placeholder="parent@example.com or 9876543210"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleRequestLoginOtp} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  placeholder="parent@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  helperText="We will send a 6-digit verification code to your email."
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full font-bold"
                >
                  Send Verification Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin} className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="text-slate-500 block text-[11px]">Code sent to:</span>
                      <strong className="text-slate-900 font-bold">{email.trim().toLowerCase()}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setDevOtpHint(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                {devOtpHint && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fadeIn">
                    <div>
                      <span className="font-semibold block">[Sandbox Mode] Verification Code:</span>
                      <strong className="font-mono text-sm tracking-widest text-emerald-950 font-black">
                        {devOtpHint}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtpHint)}
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 cursor-pointer"
                    >
                      Auto Fill
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--color-content)]">
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
                    className="w-full text-center tracking-[0.4em] text-2xl font-mono py-2.5 px-4 rounded-xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none font-bold text-slate-900 bg-white"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Didn&apos;t receive code?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isSubmitting}
                    onClick={handleRequestLoginOtp}
                    className="font-semibold text-sky-700 disabled:text-slate-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                    <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full font-bold"
                >
                  Verify Code & Sign In
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-[var(--color-border-subtle)] py-4 text-xs text-[var(--color-content-muted)]">
        Don&apos;t have a parent account?{' '}
        <Link href="/auth/register" className="font-bold text-[var(--color-primary)] ml-1 hover:underline">
          Register with Email OTP
        </Link>
      </CardFooter>
    </Card>
  );
};
