// FILE: src/components/Layout/Header/Navigation/HeaderLink.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MegaPanel from './MegaPanel';
import type { HeaderItem } from '../menu.types';

/**
 * HeaderLink — advanced, accessible, intent-aware trigger for MegaPanel
 *
 * - Desktop default = click to open; hover intent only on pointer=fine
 * - Touch: first tap opens, second tap (≤600ms) navigates
 * - Keyboard: Enter/Space/ArrowDown open; Esc closes and returns focus
 * - Outside click + route change close; respects reduced motion
 * - Stable, SSR-safe media query hook prevents "change in order of Hooks" errors
 */

type Props = { item: HeaderItem };

/** Stable, SSR-safe media query state for reduced motion & pointer type */
function usePointerAndMotion() {
  const [state, setState] = React.useState({ reduced: false, enableHover: false });

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      setState({ reduced: false, enableHover: false });
      return;
    }

    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqPointer = window.matchMedia('(pointer: fine)');

    const apply = () =>
      setState({
        reduced: mqMotion.matches,
        enableHover: mqPointer.matches,
      });

    // Safari compatibility (addListener/removeListener fallback)
    const add = (mql: MediaQueryList, cb: () => void) =>
      (mql.addEventListener ? mql.addEventListener('change', cb) : mql.addListener(cb));
    const remove = (mql: MediaQueryList, cb: () => void) =>
      (mql.removeEventListener ? mql.removeEventListener('change', cb) : mql.removeListener(cb));

    apply();
    add(mqMotion, apply);
    add(mqPointer, apply);
    return () => {
      remove(mqMotion, apply);
      remove(mqPointer, apply);
    };
  }, []);

  return state; // { reduced, enableHover }
}

export default function HeaderLink({ item }: Props) {
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const { reduced: reducedMotion, enableHover } = usePointerAndMotion();

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const hoverTimer = React.useRef<number | null>(null);
  const lastTapOrClickRef = React.useRef<number>(0);

  // Deterministic, SSR-safe id (replaces useId to avoid hydration mismatch)
  const stableId = React.useMemo(() => {
    const base =
      (item as any).id ??
      item.href ??
      item.label ??
      Math.random().toString(36).slice(2); // last fallback; ideally never used
    return String(base)
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/(^-|-$)/g, '');
  }, [item]);

  const isActive =
    !!item.href && (pathname === item.href || pathname?.startsWith(item.href + '/'));
  const hasMenu = Array.isArray(item.submenu) && item.submenu.length > 0;
  const isRealLink = typeof item.href === 'string' && item.href.length > 0;

  // Close on route change
  React.useEffect(() => {
    if (open) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const clearTimer = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const openWithIntent = (delay = 150) => {
    clearTimer();
    hoverTimer.current = window.setTimeout(() => setOpen(true), delay);
  };

  const closeWithIntent = (delay = 200) => {
    clearTimer();
    hoverTimer.current = window.setTimeout(() => setOpen(false), delay);
  };

  // Keyboard on top-level label
  const onKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!hasMenu) return;
    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      (linkRef.current ?? buttonRef.current)?.focus();
    }
  };

  // Click-to-open on <Link> (first click opens, second click within 600ms navigates)
  const onClickLabel = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hasMenu) return; // allow default navigate
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // allow new-tab, etc.

    const now = performance.now();
    const delta = now - lastTapOrClickRef.current;

    if (!open || delta > 600) {
      e.preventDefault();
      setOpen(true);
      lastTapOrClickRef.current = now;
    }
    // else: allow navigation on rapid second click
  };

  // Touch: first tap opens; second tap navigates (both link/button)
  const onTouchStart = (e: React.TouchEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (!hasMenu) return;
    const now = performance.now();
    if (!open || now - lastTapOrClickRef.current > 600) {
      e.preventDefault();
      setOpen(true);
      lastTapOrClickRef.current = now;
    }
  };

  // Hover (only on pointer=fine)
  const onMouseEnter = hasMenu && enableHover ? () => openWithIntent() : undefined;
  const onMouseLeave = hasMenu && enableHover ? () => closeWithIntent() : undefined;

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

  // Styles (compact pill, premium look)
  const basePill =
    'relative inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[14px] font-medium leading-6 outline-none transition-colors';
  const colorIdle =
    'text-white/90 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40';
  const colorActive =
    'text-white after:pointer-events-none after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-white/80';
  const pillBg = isActive ? 'bg-white/10 ring-1 ring-white/10' : 'hover:bg-white/10';

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Top-level label (real link for SEO when href exists) */}
      {isRealLink ? (
        <Link
          href={item.href!}
          ref={linkRef}
          className={[basePill, pillBg, isActive ? colorActive : colorIdle].join(' ')}
          aria-haspopup={hasMenu ? 'menu' : undefined}
          aria-expanded={hasMenu ? open : undefined}
          aria-controls={hasMenu ? `mega-${stableId}` : undefined}
          onKeyDown={onKeyDown}
          onClick={hasMenu ? onClickLabel : undefined}
          onTouchStart={hasMenu ? onTouchStart : undefined}
        >
          <span>{item.label}</span>
        </Link>
      ) : (
        <button
          type="button"
          ref={buttonRef}
          className={[basePill, pillBg, isActive ? colorActive : colorIdle].join(' ')}
          aria-haspopup={hasMenu ? 'menu' : undefined}
          aria-expanded={hasMenu ? open : undefined}
          aria-controls={hasMenu ? `mega-${stableId}` : undefined}
          onKeyDown={onKeyDown}
          onClick={hasMenu ? () => setOpen((s) => !s) : undefined}
          onTouchStart={hasMenu ? onTouchStart : undefined}
        >
          <span>{item.label}</span>
        </button>
      )}

      {/* Optional caret button for explicit open on mobile (hidden on lg+) */}
      {hasMenu && (
        <button
          type="button"
          aria-label={open ? `Close ${item.label} menu` : `Open ${item.label} menu`}
          aria-controls={`mega-${stableId}`}
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 rounded-lg p-1 text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
        >
          <svg
            className={`h-4 w-4 transition-transform ${
              reducedMotion ? '' : 'duration-200'
            } ${open ? 'rotate-180' : ''}`}
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
        <div id={`mega-${stableId}`} role="region" aria-label={`${item.label} menu`}>
          <MegaPanel
            rootLabel={item.label}
            columns={item.submenu!}
            open={open}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
