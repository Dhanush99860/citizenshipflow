// FILE: src/components/Layout/Header/Navigation/HeaderLink.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MegaPanel from './MegaPanel';
import type { HeaderItem } from '../menu.types';

/**
 * Improved HeaderLink (compact Myntra-like)
 * - Correct semantics (no interactive-in-interactive). The label is an <a>.
 * - Hover/focus opens on desktop; keyboard open with ⬇/Space/Enter, Esc closes.
 * - Touch: first tap opens, second tap (≤600ms) navigates.
 * - Separate caret button on mobile toggles the mega panel.
 */

type Props = { item: HeaderItem };

export default function HeaderLink({ item }: Props) {
  const path = usePathname();

  const [open, setOpen] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const caretBtnRef = React.useRef<HTMLButtonElement>(null);
  const hoverTimer = React.useRef<number | null>(null);
  const lastTapRef = React.useRef<number>(0);

  const id = React.useId();
  const isActive = !!item.href && (path === item.href || path?.startsWith(item.href + '/'));
  const hasMenu = Array.isArray(item.submenu) && item.submenu.length > 0;

  // Reduced motion
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const clearTimer = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const openWithIntent = () => {
    clearTimer();
    hoverTimer.current = window.setTimeout(() => setOpen(true), 80);
  };

  const closeWithIntent = () => {
    clearTimer();
    hoverTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  // Keyboard
  const onKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (!hasMenu) return;
    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      linkRef.current?.focus();
    }
  };

  // Touch: first tap opens, second tap navigates
  const onTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!hasMenu) return;
    const now = performance.now();
    if (!open || now - lastTapRef.current > 600) {
      e.preventDefault();
      setOpen(true);
      lastTapRef.current = now;
    }
  };

  const onCaretClick = () => setOpen((s) => !s);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handle = (ev: MouseEvent) => {
      const el = wrapperRef.current;
      if (el && !el.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Cleanup timers
  React.useEffect(() => () => clearTimer(), []);

  // Compact Myntra-like pill
  const basePill =
    'relative inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[14px] font-medium leading-6 outline-none transition-colors';
  const colorIdle = 'text-white/90 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40';
  const colorActive =
    'text-white after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-white/80';
  const pillBg = isActive ? 'bg-white/10 ring-1 ring-white/10' : 'hover:bg-white/10';

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={hasMenu ? openWithIntent : undefined}
      onMouseLeave={hasMenu ? closeWithIntent : undefined}
    >
      {/* Label link */}
      <Link
        href={item.href}
        ref={linkRef}
        className={[basePill, pillBg, isActive ? colorActive : colorIdle].join(' ')}
        aria-haspopup={hasMenu ? 'menu' : undefined}
        aria-expanded={hasMenu ? open : undefined}
        aria-controls={hasMenu ? `mega-${id}` : undefined}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
      >
        <span>{item.label}</span>
      </Link>

      {/* Caret button only when there is a submenu (mobile-friendly) */}
      {hasMenu && (
        <button
          ref={caretBtnRef}
          type="button"
          aria-label={open ? `Close ${item.label} menu` : `Open ${item.label} menu`}
          aria-controls={`mega-${id}`}
          aria-expanded={open}
          onClick={onCaretClick}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 rounded-lg p-1 text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
        >
          <svg
            className={`h-4 w-4 transition-transform ${reducedMotion ? '' : 'duration-200'} ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" />
          </svg>
        </button>
      )}

      {/* Mega panel */}
      {hasMenu && (
        <div id={`mega-${id}`} role="region" aria-label={`${item.label} menu`}>
          <MegaPanel rootLabel={item.label} columns={item.submenu!} open={open} onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
