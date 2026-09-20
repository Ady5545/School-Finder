'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';
import type { ApplicationTrackerItem } from './applicationTracker';

export interface ParentUserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  childName?: string;
  childGrade?: string;
  residentialSociety?: string;
  fatherName?: string;
  motherName?: string;
  preferredSchoolLocality?: string;
  preferredBoards?: string[];
  emailVerified: boolean;
  role?: 'parent' | 'admin';
  analyticsConsent: boolean;
  createdAt: string;
  wishlist?: string[];
  compareList?: string[];
  applicationTracker?: ApplicationTrackerItem[];
}

interface AuthContextType {
  user: ParentUserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  token: string | null;
  sendOtp: (
    email: string,
    options?: { purpose?: 'register' | 'login'; name?: string } | 'register' | 'login'
  ) => Promise<{ success: boolean; message?: string; devOtp?: string; category?: string; notFound?: boolean }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; verificationToken?: string; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    childName: string;
    childGrade: string;
    residentialSociety: string;
    fatherName?: string;
    motherName?: string;
    preferredSchoolLocality?: string;
    password?: string;
    verificationToken?: string;
    preferredBoards?: string[];
    termsAccepted: boolean;
    analyticsConsent?: boolean;
  }) => Promise<{ success: boolean; message?: string }>;
  login: (credentials: {
    email: string;
    password?: string;
    otp?: string;
    loginType?: 'password' | 'otp';
  }) => Promise<{ success: boolean; message?: string; notFound?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
    phone?: string;
    childName?: string;
    childGrade?: string;
    residentialSociety?: string;
    fatherName?: string;
    motherName?: string;
    preferredSchoolLocality?: string;
    preferredBoards?: string[];
    analyticsConsent?: boolean;
  }) => Promise<{ success: boolean; message?: string }>;
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
        return { success: false, notFound: data.notFound, message: data.message, category: data.category };
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
    email: string;
    phone: string;
    childName: string;
    childGrade: string;
    residentialSociety: string;
    fatherName?: string;
    motherName?: string;
    preferredSchoolLocality?: string;
    password?: string;
    verificationToken?: string;
    preferredBoards?: string[];
    termsAccepted: boolean;
    analyticsConsent?: boolean;
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
      showToast('Parent account registered successfully! Email verified.', 'success');
      return { success: true, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      showToast('Registration failed due to a network issue.', 'error');
      return { success: false, message: msg };
    }
  };

  const login = async (credentials: {
    email: string;
    password?: string;
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
        return { success: false, notFound: data.notFound, message: data.message };
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

  const updateProfile = async (updates: {
    name?: string;
    phone?: string;
    childName?: string;
    childGrade?: string;
    residentialSociety?: string;
    fatherName?: string;
    motherName?: string;
    preferredSchoolLocality?: string;
    preferredBoards?: string[];
    analyticsConsent?: boolean;
  }) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || 'Update failed', 'error');
        return { success: false, message: data.message };
      }
      setUser(data.user);
      showToast('Preferences updated successfully', 'success');
      return { success: true, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      showToast('Failed to update preferences', 'error');
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
        isAdmin: user?.role === 'admin',
        isLoading,
        token,
        sendOtp,
        verifyOtp,
        register,
        login,
        logout,
        updateProfile,
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
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      token: null,
      sendOtp: async (): Promise<{ success: boolean; message?: string; devOtp?: string; category?: string; notFound?: boolean }> => ({ success: false, message: 'Auth context unavailable', notFound: false, devOtp: undefined, category: undefined }),
      verifyOtp: async (): Promise<{ success: boolean; verificationToken?: string; message?: string }> => ({ success: false, message: 'Auth context unavailable', verificationToken: undefined }),
      register: async () => ({ success: false, message: 'Auth context unavailable' }),
      login: async (): Promise<{ success: boolean; message?: string; notFound?: boolean }> => ({ success: false, message: 'Auth context unavailable', notFound: false }),
      logout: async () => {},
      updateProfile: async () => ({ success: false, message: 'Auth context unavailable' }),
      refreshProfile: async () => {},
    };
  }
  return context;
};
