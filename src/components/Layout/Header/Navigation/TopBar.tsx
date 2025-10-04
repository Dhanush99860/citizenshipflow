'use client';

import Link from 'next/link';
// import Search from '@/components/GlobalSearch';
import { Phone, Mail, Facebook, Twitter, Instagram, Search as SearchIcon } from 'lucide-react';

/**
 * Desktop TopBar
 * - Same width as main bar (max-w-screen-xl)
 * - Contact chips + centered search (fallback input shown) + socials + Login
 * - Search icon z-index/visibility fixed so it never “pops in” on scroll
 */
export default function TopBar() {
  return (
    <div className="hidden lg:block">
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2 text-[13px] leading-6 text-white/95">
          {/* Contact chips */}
          <div className="flex items-center gap-2 xl:gap-3">
            <Chip href="tel:+919876543210" label="+91 98765 43210" ariaLabel="Call +91 98765 43210" />
            <Chip href="mailto:info@example.com" label="info@example.com" ariaLabel="Email info@example.com" />
          </div>

          {/* Centered search */}
          <div className="flex justify-center">
            {/* <div className="w-full max-w-xl"><Search /></div> */}
            <div className="relative w-full max-w-xl">
              <SearchIcon
                className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-white/80"
                aria-hidden
              />
              <input
                aria-label="Search site"
                placeholder="Search…"
                className="w-full rounded-full border border-white/15 bg-white/10 px-9 py-2 text-sm text-white placeholder-white/70 outline-none backdrop-blur-md focus:border-white/35"
              />
            </div>
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
              className="ml-1 inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-[12px] text-white/95 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ href, label, ariaLabel }: { href: string; label: string; ariaLabel: string }) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-white/95 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-primary">
        {href.startsWith('tel') ? <Phone className="h-3.5 w-3.5" aria-hidden /> : <Mail className="h-3.5 w-3.5" aria-hidden />}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </a>
  );
}

function CircleLink({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      {children}
    </a>
  );
}
