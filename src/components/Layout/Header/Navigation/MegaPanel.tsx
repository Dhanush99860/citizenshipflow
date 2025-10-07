// FILE: src/components/Layout/Header/Navigation/MegaPanel.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { SubmenuItem } from '../menu.types';
import { cx } from '../menu.utils';

/**
 * MegaPanel — premium UX surface (no harsh white)
 *
 * Highlights:
 * - Subtle gradient + glass background (light/dark aware), soft border & shadow.
 * - Sticky tools row: section title + inline filter (desktop), collapsible on small screens.
 * - Responsive grid (2→6 cols), comfy spacing, hover-elevated country blocks.
 * - Optional flags; neat bullet list items with better hit areas.
 * - Esc & outside-click close, first focus on first link, reduced motion aware.
 */

interface MegaPanelProps {
  rootLabel: string;
  columns: SubmenuItem[];
  open: boolean;
  onClose: () => void;
}

const TWEEN = { type: 'tween', duration: 0.18 } as const;
const SHOW_FLAGS = true;

// ISO-2 -> emoji flag
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

// even chunk
function chunkEven<T>(items: T[], cols: number) {
  const out: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => out[i % cols].push(item));
  return out;
}

export default function MegaPanel({ rootLabel, columns, open, onClose }: MegaPanelProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const firstFocusRef = React.useRef<HTMLAnchorElement>(null);
  const [query, setQuery] = React.useState('');
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const cols = usePreferredCols();

  // motion preference
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

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

  // Filtered data
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return columns;
    return columns.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.submenu?.some((p) => p.label.toLowerCase().includes(q))
    );
  }, [columns, query]);

  const colData = React.useMemo(() => chunkEven(filtered, cols), [filtered, cols]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mega"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0, transition: reducedMotion ? { duration: 0 } : TWEEN }}
          exit={{ opacity: 0, y: -6, transition: reducedMotion ? { duration: 0 } : { duration: 0.14 } }}
          role="menu"
          aria-label={`${rootLabel} menu`}
          className="fixed inset-x-0 z-[60]"
          style={{ top: 'var(--header-offset, 70px)' }}
        >
          <div className="pointer-events-auto mx-auto max-w-7xl px-4 md:px-6">
            {/* Surface: gradient + glass (no plain white) */}
            <div
              ref={panelRef}
              className={cx(
                'relative rounded-3xl ring-1 shadow-xl backdrop-blur-md',
                // light: soft gradient glass; dark: deep neutral glass
                'ring-white/10 dark:ring-white/10',
                'bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.58)_100%)]',
                'dark:bg-[linear-gradient(180deg,rgba(20,20,20,0.86)_0%,rgba(20,20,20,0.74)_100%)]'
              )}
              style={{ maxHeight: 'min(72vh, 880px)' }}
            >
              {/* Decorative layer */}
              <div
                aria-hidden
                className={cx(
                  'pointer-events-none absolute inset-0 rounded-3xl overflow-hidden'
                )}
              >
                {/* subtle radial glow */}
                <div className="absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(99,102,241,0.15),transparent_65%)] dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent_60%)]" />
                {/* faint grid lines */}
                <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:32px_32px] text-zinc-600 dark:text-zinc-300" />
              </div>

              {/* Tools row (sticky) */}
              <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-white/15 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-4 dark:border-white/10">
                <h2 className="text-[11px] font-semibold tracking-wide uppercase text-zinc-800/90 dark:text-zinc-100/90">
                  Explore {rootLabel}
                </h2>

                <label className="relative inline-flex items-center">
                  <span className="sr-only">Filter {rootLabel}</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter by country or program…"
                    className={cx(
                      'w-[min(80vw,340px)] sm:w-80 rounded-lg border px-3 py-2 text-xs',
                      'bg-white/70 backdrop-blur-sm border-white/30 placeholder:text-zinc-500 text-zinc-900',
                      'focus:outline-none focus:ring-2 focus:ring-primary/40',
                      'dark:bg-zinc-900/70 dark:border-white/20 dark:text-zinc-100 dark:placeholder:text-zinc-400'
                    )}
                  />
                </label>
              </div>

              {/* Columns — scrollable body */}
              <div className="min-h-0 overflow-y-auto px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
                <div
                  className="grid gap-6"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(180px, 1fr))` }}
                >
                  {colData.map((col, i) => (
                    <div key={`col-${i}`} className="min-w-0 space-y-5">
                      {col.map((country, j) => {
                        const isFirst = i === 0 && j === 0;
                        const flag = SHOW_FLAGS ? getFlag(country) : null;

                        return (
                          <section
                            key={country.label}
                            className={cx(
                              'group relative min-w-0 rounded-2xl p-3 transition',
                              'hover:bg-white/50 dark:hover:bg-white/5',
                              'hover:shadow-sm hover:ring-1 hover:ring-white/20 dark:hover:ring-white/10'
                            )}
                          >
                            {/* Country heading */}
                            <Link
                              ref={isFirst ? firstFocusRef : undefined}
                              href={country.href}
                              className={cx(
                                'inline-flex items-start gap-1.5 text-[14px] font-semibold text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-zinc-100'
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

                            {/* Programs list */}
                            {country.submenu && (
                              <ul className="mt-2 space-y-1.5">
                                {country.submenu.slice(0, 10).map((p) => (
                                  <li key={p.label}>
                                    <Link
                                      href={p.href}
                                      className={cx(
                                        'relative flex items-start rounded-md px-2 py-1.5 text-[13px] text-zinc-700 dark:text-zinc-300',
                                        'before:mr-2 before:mt-[9px] before:inline-block before:h-1.5 before:w-1.5 before:rounded-full before:bg-zinc-300 dark:before:bg-zinc-500',
                                        'hover:text-primary hover:before:bg-primary/70',
                                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
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
                                      className="ml-2 inline-flex items-center gap-1 py-1 text-[12px] font-semibold text-primary hover:underline"
                                      onClick={onClose}
                                    >
                                      View all {country.submenu.length} programs
                                      <svg
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden
                                      >
                                        <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                                      </svg>
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

                {/* Empty state */}
                {filtered.length === 0 && (
                  <div className="flex items-center justify-center py-14 text-xs text-zinc-600 dark:text-zinc-400">
                    No matches. Try a different term.
                  </div>
                )}
              </div>

              {/* Screen-reader hint */}
              <span className="sr-only">Press Escape to close the {rootLabel} menu.</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
