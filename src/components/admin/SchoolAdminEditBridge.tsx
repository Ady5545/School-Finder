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
    let activeElement: HTMLElement | null = null;
    let toolbar: HTMLDivElement | null = null;
    let editingField: HTMLElement | null = null;

    const post = (type: string, payload: Record<string, unknown> = {}) => {
      window.parent.postMessage(
        { type, ...payload },
        window.location.origin,
      );
    };

    const labelFor = (el: HTMLElement) =>
      el.getAttribute('data-admin-label') ||
      el.getAttribute('data-admin-field') ||
      el.getAttribute('data-admin-section') ||
      'School content';

    const fieldFor = (el: HTMLElement | null) =>
      el?.getAttribute('data-admin-field') || null;

    const sectionFor = (el: HTMLElement | null) =>
      el?.getAttribute('data-admin-section') || null;

    const clearHover = () => {
      touched.forEach((el) => {
        if (el.dataset.adminSelected !== '1') {
          el.style.outline = '';
          el.style.outlineOffset = '';
          el.style.boxShadow = '';
        }
      });
      touched.clear();
    };

    const ensureToolbar = () => {
      if (toolbar) return toolbar;
      toolbar = document.createElement('div');
      toolbar.id = 'admission-pitara-visual-toolbar';
      toolbar.setAttribute('role', 'toolbar');
      toolbar.style.cssText = [
        'position:fixed',
        'z-index:2147483647',
        'display:none',
        'align-items:center',
        'gap:4px',
        'padding:5px',
        'border-radius:12px',
        'background:rgba(8,21,38,.97)',
        'border:1px solid rgba(245,158,11,.38)',
        'box-shadow:0 14px 34px rgba(0,0,0,.22)',
        'backdrop-filter:blur(12px)',
        'font:700 11px/1 ui-sans-serif,system-ui,sans-serif',
      ].join(';');

      const addButton = (text: string, title: string, onClick: () => void, tone = 'normal') => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        button.title = title;
        button.style.cssText = [
          'border:0',
          'border-radius:8px',
          'padding:7px 9px',
          'cursor:pointer',
          'font:800 10px/1 ui-sans-serif,system-ui,sans-serif',
          tone === 'danger'
            ? 'background:rgba(244,63,94,.13);color:#fda4af;'
            : tone === 'primary'
              ? 'background:rgba(245,158,11,.14);color:#fde68a;'
              : 'background:rgba(255,255,255,.06);color:#e2e8f0;',
        ].join('');
        button.addEventListener('mousedown', (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          onClick();
        });
        toolbar!.appendChild(button);
        return button;
      };

      (toolbar as any)._addButton = addButton;
      document.body.appendChild(toolbar);
      return toolbar;
    };

    const positionToolbar = (el: HTMLElement) => {
      const bar = ensureToolbar();
      bar.style.display = 'flex';
      const rect = el.getBoundingClientRect();
      const width = 380;
      let left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - width - 8));
      let top = rect.top - 48;
      if (top < 8) top = Math.min(window.innerHeight - 56, rect.bottom + 8);
      bar.style.left = left + 'px';
      bar.style.top = top + 'px';

      while (bar.firstChild) bar.removeChild(bar.firstChild);

      const field = fieldFor(el);
      const section = sectionFor(el);
      const label = labelFor(el);

      const addButton = (bar as any)._addButton as (
        text: string,
        title: string,
        onClick: () => void,
        tone?: string,
      ) => HTMLButtonElement;

      const edit = () => {
        if (!field) return;
        eventSelection(el);
        beginInlineEdit(el);
      };

      if (field) {
        addButton('Edit', 'Edit this text directly', edit, 'primary');
        addButton('Clear', 'Remove this content', () => {
          el.textContent = '';
          post('admission-pitara-admin-field-change', {
            field,
            value: '',
          });
          eventSelection(el);
        }, 'danger');
      } else if (section) {
        addButton('Edit', 'Open section controls', () => eventSelection(el), 'primary');
        addButton('Hide', 'Hide this section on the public profile', () => {
          el.style.display = 'none';
          post('admission-pitara-admin-section-action', {
            action: 'hide',
            section,
            label,
            text: el.innerText,
          });
        }, 'danger');
        addButton('Duplicate', 'Copy this section into an editable custom block', () => {
          post('admission-pitara-admin-section-action', {
            action: 'duplicate',
            section,
            label,
            text: el.innerText,
          });
        });
      }
    };

    const eventSelection = (el: HTMLElement) => {
      clearHover();
      el.dataset.adminSelected = '1';
      el.style.outline = '2px solid rgba(245,158,11,.95)';
      el.style.outlineOffset = '4px';
      el.style.boxShadow = '0 0 0 6px rgba(245,158,11,.11)';
      activeElement = el;
      post('admission-pitara-admin-select', {
        field: fieldFor(el),
        section: sectionFor(el),
        label: labelFor(el),
      });
      positionToolbar(el);
    };

    const beginInlineEdit = (el: HTMLElement) => {
      const field = fieldFor(el);
      if (!field) return;

      if (editingField && editingField !== el) {
        editingField.contentEditable = 'false';
        editingField.dataset.adminEditing = '0';
      }

      editingField = el;
      el.contentEditable = 'true';
      el.dataset.adminEditing = '1';
      el.spellcheck = true;
      el.style.cursor = 'text';
      el.focus();

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.addRange(range);
      }
    };

    const finishInlineEdit = (el: HTMLElement) => {
      const field = fieldFor(el);
      if (!field) return;
      const value = el.innerText.replace(/\u00a0/g, ' ').trim();
      el.contentEditable = 'false';
      el.dataset.adminEditing = '0';
      post('admission-pitara-admin-field-change', { field, value });
      if (editingField === el) editingField = null;
      positionToolbar(el);
    };

    const onPointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest(selector) as HTMLElement | null;
      if (!el || el === toolbar || toolbar?.contains(el)) return;
      clearHover();
      el.style.outline = '2px solid rgba(245,158,11,.72)';
      el.style.outlineOffset = '3px';
      el.style.boxShadow = '0 0 0 4px rgba(245,158,11,.08)';
      touched.add(el);
      activeElement = el;
      window.clearTimeout((el as any).__adminToolbarTimer);
      (el as any).__adminToolbarTimer = window.setTimeout(() => {
        if (activeElement === el) positionToolbar(el);
      }, 80);
    };

    const onPointerOut = (event: MouseEvent) => {
      const related = event.relatedTarget as Node | null;
      const current = event.target as HTMLElement | null;
      const el = current?.closest(selector) as HTMLElement | null;
      if (el && related && el.contains(related)) return;
      if (related && toolbar?.contains(related)) return;
      if (el && activeElement === el && editingField !== el) {
        clearHover();
        if (toolbar) toolbar.style.display = 'none';
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest(selector) as HTMLElement | null;
      if (!el) return;
      if (toolbar?.contains(target)) return;

      event.preventDefault();
      event.stopPropagation();

      const field = fieldFor(el);
      if (field) {
        eventSelection(el);
        beginInlineEdit(el);
      } else {
        eventSelection(el);
      }
    };

    const onFocusOut = (event: FocusEvent) => {
      const el = event.target as HTMLElement | null;
      if (!el || el.dataset.adminEditing !== '1') return;
      finishInlineEdit(el);
    };

    const addContentButton = document.createElement('button');
    addContentButton.type = 'button';
    addContentButton.textContent = '＋ Add content';
    addContentButton.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:2147483647',
      'border:1px solid rgba(245,158,11,.38)',
      'border-radius:999px',
      'padding:10px 14px',
      'background:rgba(8,21,38,.95)',
      'color:#fde68a',
      'font:900 11px/1 ui-sans-serif,system-ui,sans-serif',
      'box-shadow:0 12px 28px rgba(0,0,0,.18)',
      'cursor:pointer',
    ].join(';');
    addContentButton.addEventListener('mousedown', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    addContentButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      post('admission-pitara-admin-add-content');
    });
    document.body.appendChild(addContentButton);

    const style = document.createElement('style');
    style.id = 'admission-pitara-admin-edit-bridge-style';
    style.textContent = `
      [data-admin-field], [data-admin-section] {
        cursor: pointer !important;
        transition: outline-color 140ms ease, box-shadow 140ms ease, opacity 140ms ease;
      }
      [data-admin-field]:hover, [data-admin-section]:hover {
        outline: 2px solid rgba(245, 158, 11, 0.72);
        outline-offset: 3px;
        box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.08);
      }
      [data-admin-field][contenteditable="true"] {
        outline: 2px dashed rgba(59, 130, 246, .85) !important;
        outline-offset: 4px !important;
        cursor: text !important;
        box-shadow: 0 0 0 6px rgba(59, 130, 246, .10) !important;
      }
      body::before {
        content: 'VISUAL EDIT MODE';
        position: fixed;
        top: 12px;
        right: 12px;
        z-index: 2147483647;
        padding: 8px 11px;
        border-radius: 999px;
        background: rgba(15, 40, 74, 0.94);
        border: 1px solid rgba(245, 158, 11, 0.44);
        color: #fde68a;
        font: 800 10px/1.1 ui-sans-serif, system-ui, sans-serif;
        letter-spacing: .06em;
        pointer-events: none;
        box-shadow: 0 10px 25px rgba(0,0,0,.14);
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('mouseover', onPointerOver, true);
    document.addEventListener('mouseout', onPointerOut, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('focusout', onFocusOut, true);

    return () => {
      clearHover();
      if (toolbar) toolbar.remove();
      addContentButton.remove();
      document.removeEventListener('mouseover', onPointerOver, true);
      document.removeEventListener('mouseout', onPointerOut, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focusout', onFocusOut, true);
      style.remove();
    };
  }, [enabled]);

  return null;
}
