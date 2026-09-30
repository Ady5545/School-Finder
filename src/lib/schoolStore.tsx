'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../components/ui/Toast';
import { getCanonicalSlug, getPublicSchoolBySlug } from './schools';
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

const COMPARE_STORAGE_KEY = 'admission_pitara_compare_v1';
const MAX_COMPARE_ITEMS = 4;

function toPublicCanonicalSlug(slug: string): string | null {
  const school = getPublicSchoolBySlug(slug);
  return school ? getCanonicalSlug(school.slug) : (slug && slug.trim() ? slug.trim() : null);
}

function normalizePublicSlugs(slugs: string[]): string[] {
  return Array.from(new Set(
    slugs
      .map(s => toPublicCanonicalSlug(String(s)))
      .filter((slug): slug is string => Boolean(slug))
  ));
}

export const SchoolStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [authPromptTarget, setAuthPromptTarget] = useState<WishlistModalTarget | null>(null);
  const { showToast } = useToast();
  const currentUserIdRef = useRef<string | null>(null);
  const shortlistRef = useRef<string[]>([]);
  const shortlistMutationQueueRef = useRef<Promise<void>>(Promise.resolve());

  // Compare and shortlist are account-only features. We deliberately do not
  // hydrate or persist either list for anonymous visitors.
  useEffect(() => {
    try {
      localStorage.removeItem('admission_pitara_anon_shortlist_v1');
      localStorage.removeItem(COMPARE_STORAGE_KEY);
    } catch {
      // Storage unavailable
    } finally {
      setCompareList([]);
      setIsHydrated(true);
    }
  }, []);

  //  // Sync Wishlist with Authenticated User Account
  useEffect(() => {
    if (isAuthLoading) return;

    if (isAuthenticated && user?.id) {
      currentUserIdRef.current = user.id;
      const userWishlist = Array.isArray(user.wishlist) ? normalizePublicSlugs(user.wishlist) : [];
      shortlistRef.current = userWishlist;
      setShortlist(userWishlist);

      try {
        localStorage.setItem(`admission_pitara_user_wishlist_${user.id}`, JSON.stringify(userWishlist));
      } catch {}
    } else {
      currentUserIdRef.current = null;
      shortlistRef.current = [];
      setShortlist([]);
      setCompareList([]);
      try {
        localStorage.removeItem('admission_pitara_anon_shortlist_v1');
        localStorage.removeItem(COMPARE_STORAGE_KEY);
      } catch {}
    }
  }, [isAuthenticated, user?.id, user?.wishlist, isAuthLoading]);
  const setShortlistFromServer = useCallback((slugs: string[]) => {
    const canonical = normalizePublicSlugs(slugs);
    shortlistRef.current = canonical;
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
    (slug: string) => {
      const canonical = toPublicCanonicalSlug(slug);
      return Boolean(canonical && shortlist.includes(canonical));
    },
    [shortlist]
  );

  const queueShortlistMutation = useCallback((mutation: () => Promise<void>) => {
    const run = shortlistMutationQueueRef.current.then(mutation, mutation);
    shortlistMutationQueueRef.current = run.catch(() => {});
    return run;
  }, []);

  const reconcileAuthenticatedShortlist = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/wishlist', { cache: 'no-store' });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success || !Array.isArray(data.wishlist)) return false;

      const serverList = normalizePublicSlugs(data.wishlist as string[]);
      shortlistRef.current = serverList;
      setShortlist(serverList);
      try {
        localStorage.setItem(
          `admission_pitara_user_wishlist_${userId}`,
          JSON.stringify(serverList)
        );
      } catch {}
      return true;
    } catch {
      return false;
    }
  }, []);

  const toggleShortlist = useCallback(
    (slug: string, schoolName?: string) => {
      const canonical = toPublicCanonicalSlug(slug);
      if (!canonical) return;

      if (!isAuthenticated || !user?.id) {
        openAuthPrompt({
          slug: canonical,
          name: schoolName || 'this school',
          action: 'shortlist',
        });
        return;
      }

      const previous = shortlistRef.current;
      const exists = previous.includes(canonical);
      const nextList = exists
        ? previous.filter(item => item !== canonical)
        : [...previous, canonical];

      shortlistRef.current = nextList;
      setShortlist(nextList);

      showToast(
        exists
          ? (schoolName ? `${schoolName} removed from shortlist` : 'Removed from shortlist')
          : (schoolName ? `${schoolName} saved to shortlist` : 'Saved to shortlist'),
        exists ? 'info' : 'success'
      );

      const action = exists ? 'remove' : 'add';
      void queueShortlistMutation(async () => {
        try {
          const response = await fetch('/api/auth/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: canonical, action }),
          });
          const data = await response.json().catch(() => null);
          if (!response.ok || !data?.success) {
            throw new Error(data?.message || 'Wishlist mutation failed');
          }
          if (Array.isArray(data.wishlist)) {
            const serverList = normalizePublicSlugs(data.wishlist as string[]);
            shortlistRef.current = serverList;
            setShortlist(serverList);
            try {
              localStorage.setItem(
                `admission_pitara_user_wishlist_${user.id}`,
                JSON.stringify(serverList)
              );
            } catch {}
          }
        } catch {
          const recovered = await reconcileAuthenticatedShortlist(user.id);
          if (!recovered) {
            showToast('Could not sync your shortlist. Please check your connection and try again.', 'error');
          }
        }
      });
    },
    [showToast, isAuthenticated, user?.id, openAuthPrompt, queueShortlistMutation, reconcileAuthenticatedShortlist]
  );

  const addToShortlist = useCallback(
    (slug: string, schoolName?: string) => {
      const canonical = toPublicCanonicalSlug(slug);
      if (!canonical) return;

      if (!isAuthenticated || !user?.id) {
        openAuthPrompt({ slug: canonical, name: schoolName || 'this school', action: 'shortlist' });
        return;
      }

      const previous = shortlistRef.current;
      if (previous.includes(canonical)) return;

      const nextList = [...previous, canonical];
      shortlistRef.current = nextList;
      setShortlist(nextList);
      showToast(schoolName ? `${schoolName} saved to shortlist` : 'Saved to shortlist', 'success');

      void queueShortlistMutation(async () => {
        try {
          const response = await fetch('/api/auth/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: canonical, action: 'add' }),
          });
          const data = await response.json().catch(() => null);
          if (!response.ok || !data?.success) throw new Error(data?.message || 'Wishlist mutation failed');
          if (Array.isArray(data.wishlist)) {
            const serverList = normalizePublicSlugs(data.wishlist as string[]);
            shortlistRef.current = serverList;
            setShortlist(serverList);
          }
        } catch {
          const recovered = await reconcileAuthenticatedShortlist(user.id);
          if (!recovered) showToast('Could not sync your shortlist. Please check your connection and try again.', 'error');
        }
      });
    },
    [showToast, isAuthenticated, user?.id, openAuthPrompt, queueShortlistMutation, reconcileAuthenticatedShortlist]
  );

  const removeFromShortlist = useCallback(
    (slug: string) => {
      const canonical = toPublicCanonicalSlug(slug);
      if (!canonical || !isAuthenticated || !user?.id) return;

      const previous = shortlistRef.current;
      if (!previous.includes(canonical)) return;

      const nextList = previous.filter(item => item !== canonical);
      shortlistRef.current = nextList;
      setShortlist(nextList);

      if (isAuthenticated && user?.id) {
        void queueShortlistMutation(async () => {
          try {
            const response = await fetch('/api/auth/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slug: canonical, action: 'remove' }),
            });
            const data = await response.json().catch(() => null);
            if (!response.ok || !data?.success) {
              throw new Error(data?.message || 'Wishlist mutation failed');
            }
            if (Array.isArray(data.wishlist)) {
              const serverList = normalizePublicSlugs(data.wishlist as string[]);
              shortlistRef.current = serverList;
              setShortlist(serverList);
              try {
                localStorage.setItem(
                  `admission_pitara_user_wishlist_${user.id}`,
                  JSON.stringify(serverList)
                );
              } catch {}
            }
          } catch {
            const recovered = await reconcileAuthenticatedShortlist(user.id);
            if (!recovered) {
              showToast('Could not sync your shortlist. Please check your connection and try again.', 'error');
            }
          }
        });
      }
    },
    [isAuthenticated, user?.id, queueShortlistMutation, reconcileAuthenticatedShortlist, showToast]
  );

  const clearShortlist = useCallback(() => {
    shortlistRef.current = [];
    setShortlist([]);
    showToast('Shortlist cleared', 'info');

    if (isAuthenticated && user?.id) {
      try {
        localStorage.removeItem(`admission_pitara_user_wishlist_${user.id}`);
      } catch {}

      void queueShortlistMutation(async () => {
        try {
          const response = await fetch('/api/auth/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'clear' }),
          });
          const data = await response.json().catch(() => null);
          if (!response.ok || !data?.success) {
            throw new Error(data?.message || 'Wishlist clear failed');
          }
          shortlistRef.current = [];
          setShortlist([]);
          try {
            localStorage.removeItem(`admission_pitara_user_wishlist_${user.id}`);
          } catch {}
        } catch {
          const recovered = await reconcileAuthenticatedShortlist(user.id);
          if (!recovered) {
            showToast('Could not clear your shortlist on the server. Your saved schools were restored.', 'error');
          }
        }
      });
    }
  }, [showToast, isAuthenticated, user?.id, queueShortlistMutation, reconcileAuthenticatedShortlist]);

  const isInCompare = useCallback(
    (slug: string) => {
      const canonical = toPublicCanonicalSlug(slug);
      return Boolean(canonical && compareList.includes(canonical));
    },
    [compareList]
  );

  const toggleCompare = useCallback(
    (slug: string, schoolName?: string) => {
      const canonical = toPublicCanonicalSlug(slug);
      if (!canonical) return;

      if (!isAuthenticated || !user?.id) {
        openAuthPrompt({ slug: canonical, name: schoolName || 'this school', action: 'compare' });
        return;
      }

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
    [showToast, isAuthenticated, user?.id, openAuthPrompt]
  );


  const removeFromCompare = useCallback((slug: string) => {
    const canonical = toPublicCanonicalSlug(slug);
    if (!canonical) return;
    setCompareList(prev => prev.filter(s => s !== canonical));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    showToast('Comparison list cleared', 'info');
  }, [showToast]);

  const addCompare = useCallback((slug: string, schoolName?: string) => {
    const canonical = toPublicCanonicalSlug(slug);
    if (!canonical) return;

    if (!isAuthenticated || !user?.id) {
      openAuthPrompt({ slug: canonical, name: schoolName || 'this school', action: 'compare' });
      return;
    }

    setCompareList(prev => {
      if (prev.includes(canonical)) return prev;
      if (prev.length >= MAX_COMPARE_ITEMS) {
        showToast(`You can compare up to ${MAX_COMPARE_ITEMS} schools at once`, 'warning');
        return prev;
      }
      showToast(schoolName ? `${schoolName} added to comparison` : 'Added to comparison', 'success');
      return [...prev, canonical];
    });
  }, [showToast, isAuthenticated, user?.id, openAuthPrompt]);


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
    return {
      shortlist: [],
      compareList: [],
      isInShortlist: () => false,
      toggleShortlist: () => {},
      addToShortlist: () => {},
      removeFromShortlist: () => {},
      clearShortlist: () => {},
      setShortlistFromServer: () => {},
      isInCompare: () => false,
      toggleCompare: () => {},
      addCompare: () => {},
      addToCompare: () => {},
      removeCompare: () => {},
      removeFromCompare: () => {},
      clearCompare: () => {},
      isHydrated: false,
      authPromptTarget: null,
      openAuthPrompt: () => {},
      closeAuthPrompt: () => {},
    };
  }
  return context;
};
