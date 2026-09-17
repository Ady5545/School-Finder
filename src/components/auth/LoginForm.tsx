'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { OtpInput } from '../ui/OtpInput';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Info,
  ArrowRight,
  RefreshCw,
  Edit3,
  AlertCircle,
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, sendOtp, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email OTP flow state
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [noAccountFound, setNoAccountFound] = useState<{ email: string; message?: string } | null>(null);

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
    setNoAccountFound(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const res = await login({ email: cleanEmail, password, loginType: 'password' });
    setIsSubmitting(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      if (res.notFound) {
        setNoAccountFound({ email: cleanEmail, message: res.message });
      } else {
        setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  const handleRequestLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setNoAccountFound(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    console.log('[FRONTEND_DIAGNOSTIC] Calling sendOtp for login...');
    const res = await sendOtp(cleanEmail, { purpose: 'login' });
    console.log('[FRONTEND_DIAGNOSTIC] sendOtp result:', res);
    setIsSubmitting(false);

    if (res.success) {
      console.log('[FRONTEND_DIAGNOSTIC] Success! Transitioning to OTP entry step.');
      setOtpSent(true);
      setResendCooldown(60);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
    } else {
      console.error('[FRONTEND_DIAGNOSTIC] sendOtp failed. Setting error message:', res.message);
      if (res.notFound) {
        setNoAccountFound({ email: cleanEmail, message: res.message });
      } else {
        setErrorMessage(res.message || 'Failed to dispatch login verification code.');
      }
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp || otp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
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

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-stone-200 bg-white">
      <CardHeader className="space-y-2 pb-4 pt-6 px-6 border-b border-stone-100 text-center">
        <div className="mx-auto w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mb-1">
          <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
        </div>
        <CardTitle className="text-2xl font-serif text-stone-900 tracking-tight">
          Parent Sign In
        </CardTitle>
        <CardDescription className="text-xs text-stone-600">
          Sign in to access your shortlisted Greater Noida schools, saved comparisons, and verified reviews.
        </CardDescription>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100 rounded-lg mt-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setErrorMessage(null);
            }}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'password'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
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
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'otp'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Email Code Sign In
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {noAccountFound && (
          <div className="mb-5 p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-stone-900 shadow-sm animate-fade-in space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  No Account Found
                </h4>
                <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">
                  We couldn&apos;t find an existing parent account for <strong className="font-semibold text-stone-900">{noAccountFound.email}</strong>.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <Link
                href={`/register?email=${encodeURIComponent(noAccountFound.email)}`}
                className="flex-1"
              >
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs justify-center"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Create Parent Account
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setNoAccountFound(null);
                  setEmail('');
                  setPassword('');
                }}
                className="text-xs text-stone-700 bg-white border-stone-300 hover:bg-stone-50 justify-center"
              >
                Try another email
              </Button>
            </div>
          </div>
        )}

        {errorMessage && !noAccountFound && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {activeTab === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="pl-10"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
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
            </div>

            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center bg-amber-800 hover:bg-amber-900 text-white font-medium mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleRequestLoginOtp} className="space-y-4">
                <div>
                  <label htmlFor="login-otp-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Input
                      id="login-otp-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                      className="pl-10"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <Button
                  id="send-login-otp-btn"
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center bg-amber-800 hover:bg-amber-900 text-white font-medium"
                  disabled={isSubmitting || !email.includes('@')}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin} className="space-y-4">
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500">Code sent to: </span>
                    <strong className="text-stone-800">{email}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="text-amber-800 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                {devOtpHint && (
                  <div className="p-2.5 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-700 flex items-center justify-between">
                    <span>
                      <strong>Dev OTP:</strong> {devOtpHint}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtpHint)}
                      className="px-2 py-0.5 bg-white border border-stone-300 rounded text-stone-800 hover:bg-stone-50 text-[11px] font-medium"
                    >
                      Fill
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 text-center">
                    Enter 6-Digit Email Code
                  </label>
                  <OtpInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={isSubmitting}
                    hasError={Boolean(errorMessage)}
                  />
                  <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                    <span>Didn&apos;t receive code?</span>
                    <button
                      type="button"
                      onClick={handleRequestLoginOtp}
                      disabled={resendCooldown > 0 || isSubmitting}
                      className="text-amber-800 font-semibold hover:underline disabled:text-stone-400 disabled:no-underline"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>

                <Button
                  id="verify-login-otp-btn"
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center bg-amber-800 hover:bg-amber-900 text-white font-medium"
                  disabled={isSubmitting || otp.length !== 6}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <span>Verify & Sign In</span>
                  )}
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-stone-50/80 px-6 py-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
        <span>Need a parent account?</span>
        <Link
          id="register-link-from-login"
          href="/register"
          className="font-semibold text-amber-800 hover:text-amber-950 transition-colors"
        >
          Create Verified Account &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
};
