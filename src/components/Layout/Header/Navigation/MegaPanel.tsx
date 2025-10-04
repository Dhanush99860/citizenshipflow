// FILE: src/components/Layout/Header/Navigation/MegaPanel.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubmenuItem } from '../menu.types';
import { cx } from '../menu.utils';

/** -----------------------------
 *  Mega Menu — Professional layout (icons & underlines removed)
 *  - Clean column layout, no vertical dividers, no chevrons/arrows
 *  - Country heading is simple text (optional emoji flag if provided in data)
 *  - Programs show as neat bullet list with subtle hover
 *  - Responsive columns: 2 → 3 → 4 → 5 → 6
 *  - Solid background + internal scroll + quick filter
 * ------------------------------ */

interface MegaPanelProps {
  rootLabel: string;
  columns: SubmenuItem[];
  open: boolean;
  onClose: () => void;
}

const TWEEN = { type: 'tween', duration: 0.18 } as const;
const SHOW_FLAGS = true; // flip to false to hide all flags

// ISO-2 → emoji flag
function flagEmojiFromCode(code?: string) {
  if (!code) return '🏳️';
  const cc = code.trim().toUpperCase();
  if (cc.length !== 2) return '🏳️';
  const base = 127397;
  return String.fromCodePoint(cc.charCodeAt(0) + base) + String.fromCodePoint(cc.charCodeAt(1) + base);
}
function getFlag(item: SubmenuItem): string | null {
  const any = item as unknown as { code?: string; meta?: { code?: string; iconEmoji?: string } };
  const emoji = any.meta?.iconEmoji;
  const code = any.code ?? any.meta?.code;
  return emoji ?? (code ? flagEmojiFromCode(code) : null);
}

function usePreferredCols() {
  const [cols, setCols] = React.useState(4);
  React.useEffect(() => {
    const mq6 = window.matchMedia('(min-width: 1440px)');
    const mq5 = window.matchMedia('(min-width: 1280px)');
    const mq4 = window.matchMedia('(min-width: 1024px)');
    const mq3 = window.matchMedia('(min-width: 640px)');
    const update = () => {
      if (mq6.matches) setCols(6);
      else if (mq5.matches) setCols(5);
      else if (mq4.matches) setCols(4);
      else if (mq3.matches) setCols(3);
      else setCols(2);
    };
    update();
    mq6.addEventListener('change', update);
    mq5.addEventListener('change', update);
    mq4.addEventListener('change', update);
    mq3.addEventListener('change', update);
    return () => {
      mq6.removeEventListener('change', update);
      mq5.removeEventListener('change', update);
      mq4.removeEventListener('change', update);
      mq3.removeEventListener('change', update);
    };
  }, []);
  return cols;
}

// split evenly
function chunkEven<T>(items: T[], cols: number) {
  const out: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => out[i % cols].push(item));
  return out;
}

export default function MegaPanel({ rootLabel, columns, open, onClose }: MegaPanelProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const firstFocusRef = React.useRef<HTMLAnchorElement>(null);
  const [query, setQuery] = React.useState('');
  const cols = usePreferredCols();

  // Esc
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Outside click
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = panelRef.current;
      if (el && !el.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose]);

  // Focus first
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => firstFocusRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open]);

  // Filter
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return columns;
    return columns.filter((c) => c.label.toLowerCase().includes(q) || c.submenu?.some((p) => p.label.toLowerCase().includes(q)));
  }, [columns, query]);

  const colData = React.useMemo(() => chunkEven(filtered, cols), [filtered, cols]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mega"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, transition: TWEEN }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }}
          role="menu"
          aria-label={`${rootLabel} menu`}
          className="fixed inset-x-0 z-[60]"
          style={{ top: 'var(--header-offset, 70px)' }}
        >
          <div className="pointer-events-auto mx-auto max-w-7xl px-4 md:px-6">
            <div
              ref={panelRef}
              className={cx(
                'relative rounded-3xl border shadow-xl',
                'bg-white border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800'
              )}
              style={{ maxHeight: 'min(72vh, 880px)' }}
            >
              {/* header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 md:p-5 border-b border-neutral-200/70 dark:border-neutral-800/70">
                <h2 className="text-xs font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Explore {rootLabel}
                </h2>
                <label className="relative">
                  <span className="sr-only">Filter {rootLabel}</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter by country or program…"
                    className={cx(
                      'w-[min(80vw,320px)] sm:w-80 rounded-md border bg-white px-3 py-2 text-xs',
                      'border-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/40',
                      'dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100'
                    )}
                  />
                </label>
              </div>

              {/* columns */}
              <div className="min-h-0 overflow-y-auto p-4 md:p-5">
                <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cols}, minmax(180px, 1fr))` }}>
                  {colData.map((col, i) => (
                    <div key={`col-${i}`} className="min-w-0 space-y-5">
                      {col.map((country, j) => {
                        const isFirst = i === 0 && j === 0;
                        const flag = SHOW_FLAGS ? getFlag(country) : null;

                        return (
                          <section key={country.label} className="min-w-0">
                            {/* Country heading — plain text, professional */}
                            <Link
                              ref={isFirst ? firstFocusRef : undefined}
                              href={country.href}
                              className={cx(
                                'group inline-flex items-start gap-1.5 text-[14px] font-semibold text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-neutral-100'
                              )}
                              onClick={onClose}
                            >
                              {flag && <span className="text-base leading-none">{flag}</span>}
                              <span
                                className={cx(
                                  'whitespace-normal leading-tight',
                                  '[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden',
                                  'group-hover:text-primary'
                                )}
                              >
                                {country.label}
                              </span>
                            </Link>

                            {/* Programs list — bullet style, NO chevrons, NO bars */}
                            {country.submenu && (
                              <ul className="mt-2 space-y-1.5">
                                {country.submenu.slice(0, 10).map((p) => (
                                  <li key={p.label}>
                                    <Link
                                      href={p.href}
                                      className={cx(
                                        'relative flex items-start rounded-md px-0 py-1.5 text-[13px] text-neutral-700',
                                        'before:mr-2 before:mt-2 before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-neutral-300',
                                        'hover:text-primary hover:before:bg-primary/70',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-neutral-300'
                                      )}
                                      onClick={onClose}
                                    >
                                      <span className="truncate">{p.label}</span>
                                    </Link>
                                  </li>
                                ))}
                                {country.submenu.length > 10 && (
                                  <li>
                                    <Link
                                      href={country.href}
                                      className="py-1 text-[12px] font-semibold text-primary hover:underline"
                                      onClick={onClose}
                                    >
                                      View all {country.submenu.length} programs
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            )}
                          </section>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="flex items-center justify-center py-14 text-xs text-neutral-500 dark:text-neutral-400">
                    No matches. Try a different term.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
