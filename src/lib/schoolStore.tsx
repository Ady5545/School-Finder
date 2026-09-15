'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';
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

const SHORTLIST_STORAGE_KEY = 'admission_pitara_shortlist_v1';
const COMPARE_STORAGE_KEY = 'admission_pitara_compare_v1';
const MAX_COMPARE_ITEMS = 4;

export const SchoolStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [authPromptTarget, setAuthPromptTarget] = useState<WishlistModalTarget | null>(null);
  const { showToast } = useToast();

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const savedShortlist = localStorage.getItem(SHORTLIST_STORAGE_KEY);
      if (savedShortlist) {
        setShortlist(JSON.parse(savedShortlist));
      }
      const savedCompare = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (savedCompare) {
        setCompareList(JSON.parse(savedCompare));
      }
    } catch {
      // Storage unavailable or parsing error
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync Shortlist to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(shortlist));
      } catch {
        // Ignored
      }
    }
  }, [shortlist, isHydrated]);

  // Sync Compare to localStorage
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
    setShortlist(slugs);
  }, []);

  const openAuthPrompt = useCallback((target: WishlistModalTarget) => {
    setAuthPromptTarget(target);
  }, []);

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptTarget(null);
  }, []);

  const isInShortlist = useCallback(
    (slug: string) => shortlist.includes(slug),
    [shortlist]
  );

  const toggleShortlist = useCallback(
    (slug: string, schoolName?: string) => {
      setShortlist(prev => {
        const exists = prev.includes(slug);
        const next = exists ? prev.filter(s => s !== slug) : [...prev, slug];
        
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
        return next;
      });
    },
    [showToast]
  );

  const removeFromShortlist = useCallback((slug: string) => {
    setShortlist(prev => prev.filter(s => s !== slug));
  }, []);

  const clearShortlist = useCallback(() => {
    setShortlist([]);
    showToast('Shortlist cleared', 'info');
  }, [showToast]);

  const isInCompare = useCallback(
    (slug: string) => compareList.includes(slug),
    [compareList]
  );

  const toggleCompare = useCallback(
    (slug: string, schoolName?: string) => {
      setCompareList(prev => {
        const exists = prev.includes(slug);
        if (exists) {
          showToast(
            schoolName ? `${schoolName} removed from comparison` : 'Removed from comparison',
            'info'
          );
          return prev.filter(s => s !== slug);
        }

        if (prev.length >= MAX_COMPARE_ITEMS) {
          showToast(`You can compare up to ${MAX_COMPARE_ITEMS} schools at once`, 'warning');
          return prev;
        }

        showToast(
          schoolName ? `${schoolName} added to comparison` : 'Added to comparison',
          'success'
        );
        return [...prev, slug];
      });
    },
    [showToast]
  );

  const removeFromCompare = useCallback((slug: string) => {
    setCompareList(prev => prev.filter(s => s !== slug));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    showToast('Comparison list cleared', 'info');
  }, [showToast]);

  const addToShortlist = useCallback((slug: string, schoolName?: string) => {
    setShortlist(prev => (prev.includes(slug) ? prev : [...prev, slug]));
    showToast(schoolName ? `${schoolName} saved to shortlist` : 'Saved to shortlist', 'success');
  }, [showToast]);

  const addCompare = useCallback((slug: string, schoolName?: string) => {
    setCompareList(prev => {
      if (prev.includes(slug)) return prev;
      if (prev.length >= MAX_COMPARE_ITEMS) {
        showToast(`You can compare up to ${MAX_COMPARE_ITEMS} schools at once`, 'warning');
        return prev;
      }
      showToast(schoolName ? `${schoolName} added to comparison` : 'Added to comparison', 'success');
      return [...prev, slug];
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

