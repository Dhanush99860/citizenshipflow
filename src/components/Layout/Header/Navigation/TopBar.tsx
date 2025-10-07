// FILE: src/components/Layout/Header/Navigation/TopBar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Phone, Mail, Facebook, Twitter, Instagram, Search as SearchIcon, X as XIcon } from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch'; // ⬅️ added

/**
 * Desktop TopBar — unchanged styles.
 * This version *opens GlobalSearch overlay* whenever the TopBar search is used.
 */

export default function TopBar() {
  const [q, setQ] = React.useState('');

  // Imperatively click GlobalSearch's trigger button (it has aria-label="Open search")
  const openGlobalSearch = React.useCallback(() => {
    const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Open search"]');
    btn?.click();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    openGlobalSearch();
  };

  // Open overlay on any interaction with the faux input
  const onOpenFromInput = (e: React.SyntheticEvent) => {
    e.preventDefault();
    openGlobalSearch();
  };

  return (
    <div className="hidden lg:block">
      <div className="mx-auto max-w-screen-2xl px-4">
        <div
          className={[
            'grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2',
            'text-[13px] leading-6 text-white/95',
            'rounded-xl ring-1 ring-white/10',
            'bg-white/10 backdrop-blur-md',
          ].join(' ')}
        >
          {/* Contact chips */}
          <div className="flex items-center gap-2 xl:gap-3">
            <Chip href="tel:+919876543210" label="+91 98765 43210" ariaLabel="Call +91 98765 43210" />
            <Chip href="mailto:info@example.com" label="info@example.com" ariaLabel="Email info@example.com" />
          </div>

          {/* Centered search (visual stays identical) */}
          <div className="flex justify-center">
            <form
              role="search"
              action="/search"
              method="GET"
              onSubmit={onSubmit}
              className="relative w-full max-w-xl"
              aria-label="Site search"
            >
              <label htmlFor="topbar-search" className="sr-only">
                Search the site
              </label>

              <SearchIcon
                className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-white/80"
                aria-hidden
              />

              {/* This input looks the same, but any interaction opens GlobalSearch */}
              <input
                id="topbar-search"
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={onOpenFromInput}
                onClick={onOpenFromInput}
                onKeyDown={(e) => {
                  // Let Tab work normally for a11y, otherwise open the overlay
                  if (e.key !== 'Tab') {
                    e.preventDefault();
                    openGlobalSearch();
                  }
                }}
                autoComplete="off"
                placeholder="Search…"
                className={[
                  'w-full rounded-full border px-9 py-2 text-sm text-white placeholder-white/70 outline-none',
                  'border-white/15 bg-white/10 backdrop-blur-md',
                  'focus:border-white/35 focus:ring-2 focus:ring-white/40',
                ].join(' ')}
              />

              {/* Clear button (unchanged) */}
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <XIcon className="h-4 w-4" aria-hidden />
                </button>
              )}
            </form>
          </div>

          {/* Social + Login */}
          <div className="flex items-center justify-end gap-1.5">
            <CircleLink href="https://facebook.com" label="Facebook">
              <Facebook className="h-4 w-4" aria-hidden />
            </CircleLink>
            <CircleLink href="https://twitter.com" label="Twitter">
              <Twitter className="h-4 w-4" aria-hidden />
            </CircleLink>
            <CircleLink href="https://instagram.com" label="Instagram">
              <Instagram className="h-4 w-4" aria-hidden />
            </CircleLink>

            <Link
              href="/login"
              className="ml-1 inline-flex h-8 items-center justify-center rounded-full bg-white/10 px-3 text-[12px] text-white/95 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Render GlobalSearch once; we trigger it programmatically */}
      <div aria-hidden>
        <GlobalSearch />
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Sub components (unchanged)
---------------------------------------------- */

function Chip({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  const isTel = href.startsWith('tel');
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="inline-flex min-h-[36px] items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-white/95 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-primary">
        {isTel ? <Phone className="h-3.5 w-3.5" aria-hidden /> : <Mail className="h-3.5 w-3.5" aria-hidden />}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </a>
  );
}

function CircleLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      title={label}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      {children}
    </a>
  );
}
