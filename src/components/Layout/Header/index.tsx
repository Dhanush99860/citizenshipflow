// FILE: src/components/Layout/Header/index.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import { headerMenu } from './Navigation/menu.data';
import Logo from './Logo';
import HeaderLink from './Navigation/HeaderLink';
import MobileHeaderLink from './Navigation/MobileHeaderLink';
import TopBar from './Navigation/TopBar';
// import Search from '@/components/GlobalSearch';

import { Menu, X, Moon, Sun, Search as SearchIcon } from 'lucide-react';

/**
 * Fixed Header with compact Myntra-like nav
 */

export default function Header() {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const lastYRef = useRef(0);
  const lastIntentAtRef = useRef(0);
  const rAFRef = useRef<number | null>(null);
  const burgerBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const colorMode = useMemo(() => (resolvedTheme || theme) ?? 'light', [resolvedTheme, theme]);
  const isDark = colorMode === 'dark';

  // Direction-aware scroll
  useEffect(() => {
    lastYRef.current = window.scrollY || 0;
    const DELTA = 6;
    const INTENT_MS = 120;
    const COMPACT_MIN_Y = 8;

    const onScroll = () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
      rAFRef.current = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const dy = y - lastYRef.current;
        if (Math.abs(dy) < DELTA) return;

        const now = performance.now();
        if (now - lastIntentAtRef.current < INTENT_MS) {
          lastYRef.current = y;
          return;
        }

        const goingDown = dy > 0;
        const goingUp = dy < 0;
        setCompact(goingDown && y > COMPACT_MIN_Y);
        setShowTopBar(goingUp || y <= 0);

        lastYRef.current = y <= 0 ? 0 : y;
        lastIntentAtRef.current = now;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, []);

  // Close drawer on route change
  useEffect(() => {
    if (drawerOpen) setDrawerOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Body lock + focus return when drawer toggles
  useEffect(() => {
    const docEl = document.documentElement;
    const prevOverflow = docEl.style.overflow;
    const prevPadRight = docEl.style.paddingRight;

    if (drawerOpen) {
      const sw = window.innerWidth - docEl.clientWidth;
      docEl.style.overflow = 'hidden';
      if (sw > 0) docEl.style.paddingRight = `${sw}px`;

      const t = setTimeout(() => {
        drawerRef.current
          ?.querySelector<HTMLElement>('a,button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
          ?.focus();
      }, 10);

      return () => {
        clearTimeout(t);
        docEl.style.overflow = prevOverflow;
        docEl.style.paddingRight = prevPadRight;
        burgerBtnRef.current?.focus();
      };
    }
  }, [drawerOpen]);

  // Esc closes drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  // Reduced motion
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(m.matches);
    apply();
    m.addEventListener?.('change', apply);
    return () => m.removeEventListener?.('change', apply);
  }, []);

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[9999] focus:rounded-lg focus:bg-black/80 focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* Header wrapper */}
      <header
        className={[
          'fixed inset-x-0 top-0 z-50 w-full will-change-transform',
          'transition-[background-color,backdrop-filter,box-shadow,padding] ease-out',
          reducedMotion ? 'duration-0' : 'duration-300',
          isDark ? 'bg-zinc-950' : 'bg-primary/95',
          'backdrop-blur-md',
          compact ? 'shadow-lg' : 'shadow-md',
        ].join(' ')}
      >
        {/* Desktop TopBar */}
        <div
          aria-hidden={!showTopBar}
          className={[
            'overflow-hidden transition-[max-height,opacity] ease-out',
            reducedMotion ? 'duration-0' : 'duration-300',
            showTopBar ? 'max-h-[45px] opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
        >
          <TopBar />
        </div>

        {/* Main row */}
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className={[showTopBar ? 'mt-[10px]' : 'mt-1', compact ? 'mb-1' : 'mb-2'].join(' ')}>
            <div
              className={[
                'relative flex items-center justify-between rounded-2xl ring-1 ring-white/10',
                isDark ? 'bg-white/5 backdrop-saturate-[1.3]' : 'bg-white/[0.06] backdrop-saturate-[1.4]',
                isDark
                  ? 'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]'
                  : 'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.12),transparent_60%)]',
                compact ? 'px-3 py-2' : 'px-4 py-2.5',
                'transition-[padding,ring-color,transform,box-shadow] ease-out',
                reducedMotion ? 'duration-0' : 'duration-300',
                'hover:ring-white/20',
              ].join(' ')}
            >
              <Logo />

              {/* Desktop navigation */}
              <nav className="hidden lg:flex flex-grow items-center justify-center gap-1 xl:gap-2" aria-label="Main navigation">
                {headerMenu.map((item, i) => (
                  <HeaderLink key={i} item={item} />
                ))}
              </nav>

              {/* Desktop actions */}
              <div className="ml-3 flex items-center gap-1 sm:gap-2">
                <button
                  aria-label="Toggle theme"
                  onClick={toggleTheme}
                  className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
                </button>

                <Link
                  href="/PersonalBooking"
                  aria-label="Book a personal consultation"
                  className="hidden lg:inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  Book a Personal Consultation
                </Link>

                {/* Burger (mobile) */}
                <button
                  ref={burgerBtnRef}
                  onClick={() => setDrawerOpen((s) => !s)}
                  aria-label="Toggle mobile menu"
                  aria-expanded={drawerOpen}
                  aria-controls="mobile-menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 lg:hidden"
                >
                  {drawerOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay — click outside to close */}
        {drawerOpen && (
          <button
            type="button"
            className="fixed inset-0 z-[49] bg-black/50 backdrop-blur-[2px] overscroll-contain lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
        )}

        {/* MOBILE DRAWER */}
        <div
          id="mobile-menu"
          ref={drawerRef}
          className={[
            'fixed right-0 top-0 z-[50] h-full w-[86%] max-w-xs rounded-l-2xl outline-none lg:hidden',
            'transition-transform',
            reducedMotion ? 'duration-0' : 'duration-300',
            drawerOpen ? 'translate-x-0' : 'translate-x-full',
            'bg-white dark:bg-zinc-900',
          ].join(' ')}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
        >
          <div className="flex h-full flex-col overscroll-contain">
            {/* Drawer header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
              <Logo />
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-800 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white dark:hover:bg-white/10"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg:white/10"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 text-zinc-900 dark:text-white" aria-hidden />
                </button>
              </div>
            </div>

            {/* Single mobile search */}
            <div className="border-b border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
              {/* <Search /> */}
              <div className="relative">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-300"
                  aria-hidden
                />
                <input
                  aria-label="Search site"
                  placeholder="Search…"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-9 py-3 text-base text-zinc-900 outline-none focus:border-zinc-500 dark:border-white/20 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-300"
                />
              </div>
            </div>

            {/* SCROLLABLE MENU */}
            <nav className="flex-1 px-4 py-3 bg-white dark:bg-zinc-900" aria-label="Mobile navigation">
              <div className="rounded-xl bg-zinc-50 p-2 dark:bg-zinc-800">
                {headerMenu.map((item, i) => (
                  <MobileHeaderLink key={i} item={item} closeMenuAction={() => setDrawerOpen(false)} />
                ))}
              </div>
            </nav>

            {/* Sticky footer */}
            <div className="sticky bottom-0 border-t border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
              <Link
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-300 px-4 py-3 text-base dark:border-white/20"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div
        aria-hidden
        className={[
          'w-full',
          showTopBar ? 'h-[calc(var(--header-h,70px)+var(--topbar-h,0px))]' : 'h-[var(--header-h,88px)]',
          compact && !showTopBar ? 'md:h-[var(--header-h-compact,70px)]' : '',
        ].join(' ')}
      />

      <div id="main" />
    </>
  );
}
