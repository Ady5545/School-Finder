'use client';

import { useEffect } from 'react';

interface SchoolAdminEditBridgeProps {
  enabled?: boolean;
}

export function SchoolAdminEditBridge({ enabled = true }: SchoolAdminEditBridgeProps) {
  useEffect(() => {
    if (!enabled || window.parent === window) return;

    const selector = '[data-admin-field], [data-admin-section]';
    const touched = new Set<HTMLElement>();

    const clearHover = () => {
      touched.forEach((el) => {
        el.style.outline = '';
        el.style.outlineOffset = '';
      });
      touched.clear();
    };

    const onPointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest(selector) as HTMLElement | null;
      if (!el) return;
      clearHover();
      el.style.outline = '2px solid rgba(245, 158, 11, 0.82)';
      el.style.outlineOffset = '3px';
      touched.add(el);
    };

    const onPointerOut = (event: MouseEvent) => {
      const related = event.relatedTarget as Node | null;
      const current = event.target as HTMLElement | null;
      const el = current?.closest(selector) as HTMLElement | null;
      if (el && related && el.contains(related)) return;
      clearHover();
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest(selector) as HTMLElement | null;
      if (!el) return;

      event.preventDefault();
      event.stopPropagation();
      clearHover();

      const field = el.getAttribute('data-admin-field');
      const section = el.getAttribute('data-admin-section');
      const label = el.getAttribute('data-admin-label') || field || section || 'School section';

      window.parent.postMessage(
        {
          type: 'admission-pitara-admin-select',
          field: field || null,
          section: section || null,
          label,
        },
        window.location.origin,
      );
    };

    const style = document.createElement('style');
    style.id = 'admission-pitara-admin-edit-bridge-style';
    style.textContent = `
      [data-admin-field], [data-admin-section] {
        cursor: pointer !important;
        transition: outline-color 140ms ease, box-shadow 140ms ease;
      }
      [data-admin-field]:hover, [data-admin-section]:hover {
        outline: 2px solid rgba(245, 158, 11, 0.72);
        outline-offset: 3px;
        box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.08);
      }
      body::before {
        content: 'ADMIN EDIT MODE — click any highlighted area to edit';
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 2147483647;
        padding: 8px 11px;
        border-radius: 999px;
        background: rgba(15, 40, 74, 0.94);
        border: 1px solid rgba(245, 158, 11, 0.44);
        color: #fde68a;
        font: 700 10px/1.1 ui-sans-serif, system-ui, sans-serif;
        letter-spacing: .06em;
        pointer-events: none;
        box-shadow: 0 10px 25px rgba(0,0,0,.14);
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('mouseover', onPointerOver, true);
    document.addEventListener('mouseout', onPointerOut, true);
    document.addEventListener('click', onClick, true);

    return () => {
      clearHover();
      document.removeEventListener('mouseover', onPointerOver, true);
      document.removeEventListener('mouseout', onPointerOut, true);
      document.removeEventListener('click', onClick, true);
      style.remove();
    };
  }, [enabled]);

  return null;
}
