'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../components/ui/Toast';
import { getCanonicalSlug } from './schools';
import { useAuth } from './authContext';
import { WishlistLoginModal, type WishlistModalTarget } from '../components/auth/WishlistLoginModal';

interface SchoolStoreContextType {
  shortlist: string[];
  compareList: string[];
  isInShortlist: (slug: string) => boolean;
  toggleShortlist: (slug: string, schoolName?: string) => void;
  addToShortlist: (slug: string, schoolName?: string) => void;
  removeFromShortlist: (slug: string) => void;
  clearShortlist: () => void;
  setShortlistFromServer: (slugs: string[]) => void;
  isInCompare: (slug: string) => boolean;
  toggleCompare: (slug: string, schoolName?: string) => void;
  addCompare: (slug: string, schoolName?: string) => void;
  addToCompare: (slug: string, schoolName?: string) => void;
  removeCompare: (slug: string) => void;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isHydrated: boolean;
  authPromptTarget: WishlistModalTarget | null;
  openAuthPrompt: (target: WishlistModalTarget) => void;
  closeAuthPrompt: () => void;
}

const SchoolStoreContext = createContext<SchoolStoreContextType | undefined>(undefined);

const ANON_SHORTLIST_KEY = 'admission_pitara_anon_shortlist_v1';
const COMPARE_STORAGE_KEY = 'admission_pitara_compare_v1';
const MAX_COMPARE_ITEMS = 4;

export const SchoolStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [authPromptTarget, setAuthPromptTarget] = useState<WishlistModalTarget | null>(null);
  const { showToast } = useToast();
  const currentUserIdRef = useRef<string | null>(null);

  // Hydrate Compare and Anonymous Shortlist once on mount
  useEffect(() => {
    try {
      const savedCompare = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (savedCompare) {
        const parsed = JSON.parse(savedCompare);
        if (Array.isArray(parsed)) {
          setCompareList(Array.from(new Set(parsed.map(s => getCanonicalSlug(String(s))))));
        }
      }
    } catch {
      // Storage unavailable
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync Wishlist with Authenticated User Account
  useEffect(() => {
    if (isAuthLoading) return;

    if (isAuthenticated && user?.id) {
      // User is authenticated: load THIS user's server-backed wishlist
      currentUserIdRef.current = user.id;
      const userWishlist = Array.isArray(user.wishlist)
        ? Array.from(new Set(user.wishlist.map(s => getCanonicalSlug(String(s)))))
        : [];
      setShortlist(userWishlist);

      try {
        localStorage.setItem(`admission_pitara_user_wishlist_${user.id}`, JSON.stringify(userWishlist));
      } catch {}
    } else {
      // User is unauthenticated / logged out: CLEAR in-memory wishlist immediately
      currentUserIdRef.current = null;
      setShortlist([]);
    }
  }, [isAuthenticated, user?.id, user?.wishlist, isAuthLoading]);

  // Sync Compare list to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
      } catch {
        // Ignored
      }
    }
  }, [compareList, isHydrated]);

  const setShortlistFromServer = useCallback((slugs: string[]) => {
    const canonical = Array.from(new Set(slugs.map(s => getCanonicalSlug(String(s)))));
    setShortlist(canonical);
    if (user?.id) {
      try {
        localStorage.setItem(`admission_pitara_user_wishlist_${user.id}`, JSON.stringify(canonical));
      } catch {}
    }
  }, [user?.id]);

  const openAuthPrompt = useCallback((target: WishlistModalTarget) => {
    setAuthPromptTarget(target);
  }, []);

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptTarget(null);
  }, []);

  const isInShortlist = useCallback(
    (slug: string) => shortlist.includes(getCanonicalSlug(slug)),
    [shortlist]
  );

  const toggleShortlist = useCallback(
    (slug: string, schoolName?: string) => {
      const canonical = getCanonicalSlug(slug);
      let isRemoving = false;
      let nextList: string[] = [];

      setShortlist(prev => {
        const exists = prev.includes(canonical);
        isRemoving = exists;
        nextList = exists ? prev.filter(s => s !== canonical) : [...prev, canonical];

        if (exists) {
          showToast(
            schoolName ? `${schoolName} removed from shortlist` : 'Removed from shortlist',
            'info'
          );
        } else {
          showToast(
            schoolName ? `${schoolName} saved to shortlist` : 'Saved to shortlist',
            'success'
          );
        }
        return nextList;
      });

      if (isAuthenticated && user?.id) {
        try {
          localStorage.setItem(`admission_pitara_user_wishlist_${user.id}`, JSON.stringify(nextList));
        } catch {}

        fetch('/api/auth/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: canonical, action: isRemoving ? 'remove' : 'add' }),
        }).catch(() => {});
      } else {
        try {
          localStorage.setItem(ANON_SHORTLIST_KEY, JSON.stringify(nextList));
        } catch {}
      }
    },
    [showToast, isAuthenticated, user?.id]
  );

  const addToShortlist = useCallback(
    (slug: string, schoolName?: string) => {
      const canonical = getCanonicalSlug(slug);
      let nextList: string[] = [];

      setShortlist(prev => {
        if (prev.includes(canonical)) return prev;
        nextList = [...prev, canonical];
        showToast(schoolName ? `${schoolName} saved to shortlist` : 'Saved to shortlist', 'success');
        return nextList;
      });

      if (isAuthenticated && user?.id) {
        try {
          localStorage.setItem(`admission_pitara_user_wishlist_${user.id}`, JSON.stringify(nextList));
        } catch {}

        fetch('/api/auth/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: canonical, action: 'add' }),
        }).catch(() => {});
      }
    },
    [showToast, isAuthenticated, user?.id]
  );

  const removeFromShortlist = useCallback(
    (slug: string) => {
      const canonical = getCanonicalSlug(slug);
      let nextList: string[] = [];

      setShortlist(prev => {
        nextList = prev.filter(s => s !== canonical);
        return nextList;
      });

      if (isAuthenticated && user?.id) {
        try {
          localStorage.setItem(`admission_pitara_user_wishlist_${user.id}`, JSON.stringify(nextList));
        } catch {}

        fetch('/api/auth/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: canonical, action: 'remove' }),
        }).catch(() => {});
      }
    },
    [isAuthenticated, user?.id]
  );

  const clearShortlist = useCallback(() => {
    setShortlist([]);
    showToast('Shortlist cleared', 'info');

    if (isAuthenticated && user?.id) {
      try {
        localStorage.removeItem(`admission_pitara_user_wishlist_${user.id}`);
      } catch {}

      fetch('/api/auth/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear', slug: 'all' }),
      }).catch(() => {});
    }
  }, [showToast, isAuthenticated, user?.id]);

  const isInCompare = useCallback(
    (slug: string) => compareList.includes(getCanonicalSlug(slug)),
    [compareList]
  );

  const toggleCompare = useCallback(
    (slug: string, schoolName?: string) => {
      const canonical = getCanonicalSlug(slug);
      setCompareList(prev => {
        const exists = prev.includes(canonical);
        if (exists) {
          showToast(
            schoolName ? `${schoolName} removed from comparison` : 'Removed from comparison',
            'info'
          );
          return prev.filter(s => s !== canonical);
        }

        if (prev.length >= MAX_COMPARE_ITEMS) {
          showToast(`You can compare up to ${MAX_COMPARE_ITEMS} schools at once`, 'warning');
          return prev;
        }

        showToast(
          schoolName ? `${schoolName} added to comparison` : 'Added to comparison',
          'success'
        );
        return [...prev, canonical];
      });
    },
    [showToast]
  );

  const removeFromCompare = useCallback((slug: string) => {
    const canonical = getCanonicalSlug(slug);
    setCompareList(prev => prev.filter(s => s !== canonical));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    showToast('Comparison list cleared', 'info');
  }, [showToast]);

  const addCompare = useCallback((slug: string, schoolName?: string) => {
    const canonical = getCanonicalSlug(slug);
    setCompareList(prev => {
      if (prev.includes(canonical)) return prev;
      if (prev.length >= MAX_COMPARE_ITEMS) {
        showToast(`You can compare up to ${MAX_COMPARE_ITEMS} schools at once`, 'warning');
        return prev;
      }
      showToast(schoolName ? `${schoolName} added to comparison` : 'Added to comparison', 'success');
      return [...prev, canonical];
    });
  }, [showToast]);

  const addToCompare = addCompare;
  const removeCompare = removeFromCompare;

  return (
    <SchoolStoreContext.Provider
      value={{
        shortlist,
        compareList,
        isInShortlist,
        toggleShortlist,
        addToShortlist,
        removeFromShortlist,
        clearShortlist,
        setShortlistFromServer,
        isInCompare,
        toggleCompare,
        addCompare,
        addToCompare,
        removeCompare,
        removeFromCompare,
        clearCompare,
        isHydrated,
        authPromptTarget,
        openAuthPrompt,
        closeAuthPrompt,
      }}
    >
      {children}
      <WishlistLoginModal
        isOpen={Boolean(authPromptTarget)}
        onClose={closeAuthPrompt}
        targetSchool={authPromptTarget}
      />
    </SchoolStoreContext.Provider>
  );
};

export const useSchoolStore = () => {
  const context = useContext(SchoolStoreContext);
  if (!context) {
    throw new Error('useSchoolStore must be used within a SchoolStoreProvider');
  }
  return context;
};


