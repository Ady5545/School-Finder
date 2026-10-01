'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

function isNavigableLink(anchor: HTMLAnchorElement, event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return false;
  if (url.pathname.startsWith('/api/')) return false;

  return true;
}

export function PageTransitionManager() {
  const router = useRouter();
  const navigatingRef = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;

      if (!anchor || !isNavigableLink(anchor, event) || navigatingRef.current) return;

      const url = new URL(anchor.href, window.location.href);
      const startTransition = (document as Document & {
        startViewTransition?: (update: () => void | Promise<void>) => unknown;
      }).startViewTransition;

      if (!startTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      event.preventDefault();
      navigatingRef.current = true;

      startTransition(() => {
        router.push(url.pathname + url.search + url.hash);
      });

      window.setTimeout(() => {
        navigatingRef.current = false;
      }, 1200);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
