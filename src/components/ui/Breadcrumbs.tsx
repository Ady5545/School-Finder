import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className, showHome = true }) => {
  const schemaBreadcrumbs = [
    ...(showHome ? [{ name: 'Home', item: '/' }] : []),
    ...items.map(item => ({
      name: item.label,
      item: item.href,
    })),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaBreadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      ...(crumb.item
        ? { item: crumb.item.startsWith('http') ? crumb.item : `https://admissionpitara.com${crumb.item}` }
        : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-[var(--color-content-muted)]', className)}>
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0"
        >
          {showHome && (
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center gap-1.5"
            >
              <Link
                href="/"
                itemProp="item"
                className="hover:text-[var(--color-content)] flex items-center transition-colors"
                aria-label="Home"
              >
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
                <span itemProp="name" className="sr-only">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
              <ChevronRight className="w-3 h-3 text-[var(--color-content-subtle)] shrink-0" aria-hidden="true" />
            </li>
          )}
          {items.map((item, index) => {
            const isLast = index === items.length - 1 || item.isCurrent;
            const position = (showHome ? 2 : 1) + index;
            return (
              <li
                key={item.label + index}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1.5"
              >
                {isLast || !item.href ? (
                  <span
                    itemProp="name"
                    className="font-semibold text-[var(--color-content)] truncate max-w-[200px] sm:max-w-none"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    itemProp="item"
                    className="hover:text-[var(--color-content)] transition-colors truncate max-w-[150px] sm:max-w-none"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                )}
                <meta itemProp="position" content={String(position)} />
                {!isLast && (
                  <ChevronRight className="w-3 h-3 text-[var(--color-content-subtle)] shrink-0" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
