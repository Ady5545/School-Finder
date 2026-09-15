'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';

export interface ParentUserProfile {
  id: string;
  name: string;
  mobile: string;
  email: string;
  locality: string;
  preferredBoards?: string[];
  childGrade?: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  marketingConsent: boolean;
  createdAt: string;
  wishlist?: string[];
  compareList?: string[];
}

interface AuthContextType {
  user: ParentUserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  sendOtp: (
    email: string,
    options?: { purpose?: 'register' | 'login'; name?: string } | 'register' | 'login'
  ) => Promise<{ success: boolean; message?: string; devOtp?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; verificationToken?: string; message?: string }>;
  register: (data: {
    name: string;
    mobile: string;
    email: string;
    locality: string;
    password: string;
    verificationToken: string;
    preferredBoards?: string[];
    childGrade?: string;
    termsAccepted: boolean;
    marketingConsent?: boolean;
  }) => Promise<{ success: boolean; message?: string }>;
  login: (credentials: {
    identifier?: string;
    email?: string;
    password?: string;
    mobile?: string;
    otp?: string;
    loginType?: 'password' | 'otp';
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ParentUserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const sendOtp = async (
    email: string,
    options: { purpose?: 'register' | 'login'; name?: string } | 'register' | 'login' = 'register'
  ) => {
    try {
      const purpose = typeof options === 'string' ? options : options?.purpose || 'register';
      const name = typeof options === 'object' ? options?.name : undefined;

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Failed to dispatch verification code', 'error');
        return { success: false, message: data.message };
      }
      showToast(data.message || 'Verification code sent to your email', 'success');
      return { success: true, message: data.message, devOtp: data.devOtp };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      showToast('Network error while requesting verification code', 'error');
      return { success: false, message: msg };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Verification code failed', 'error');
        return { success: false, message: data.message };
      }
      showToast('Email address verified successfully!', 'success');
      return { success: true, verificationToken: data.verificationToken, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      showToast('Network error during verification', 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (formData: {
    name: string;
    mobile: string;
    email: string;
    locality: string;
    password: string;
    verificationToken: string;
    preferredBoards?: string[];
    childGrade?: string;
    termsAccepted: boolean;
    marketingConsent?: boolean;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Registration failed', 'error');
        return { success: false, message: data.message };
      }

      setUser(data.user);
      if (data.token) {
        setToken(data.token);
      }
      showToast('Parent account registered successfully! Welcome to Admission Pitara.', 'success');
      return { success: true, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      showToast('Registration failed due to a network issue.', 'error');
      return { success: false, message: msg };
    }
  };

  const login = async (credentials: {
    identifier?: string;
    password?: string;
    mobile?: string;
    otp?: string;
    loginType?: 'password' | 'otp';
  }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Login failed', 'error');
        return { success: false, message: data.message };
      }

      setUser(data.user);
      if (data.token) {
        setToken(data.token);
      }
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      showToast('Login failed due to a network issue.', 'error');
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignored
    } finally {
      setUser(null);
      setToken(null);
      showToast('Logged out of parent account.', 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        token,
        sendOtp,
        verifyOtp,
        register,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
