// ============================
// FILE: src/components/Layout/Footer/index.tsx
// Final compact glass footer — ONE Action Bar (payments + CTAs + socials), single Legal
// ============================
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import LogoWhite from "@/components/Layout/Header/LogoWhite/index";

// ---------- Link groups ----------
const EXPLORE = [
  { label: "Residency", href: "/residency" },
  { label: "Citizenship", href: "/citizenship" },
  { label: "Corporate", href: "/corporate" },
  { label: "Skilled", href: "/skilled" },
];

const COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Media & Press", href: "/media" },
];

const SUPPORT = [
  { label: "Contact Us", href: "/contact" },
  { label: "Book a Consultation", href: "/consultation" },
  { label: "Client Support", href: "/contact#support" },
  { label: "Status Tracker (App)", href: "/app" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Anti-Fraud Notice", href: "/legal/anti-fraud" },
  { label: "Refunds & Cancellations", href: "/legal/refunds" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.xiphias.com#org",
        name: "XIPHIAS",
        url: "https://www.xiphias.com",
        logo: "https://www.xiphias.com/images/logo.png",
        sameAs: [
          "https://www.youtube.com/",
          "https://www.linkedin.com/",
          "https://www.facebook.com/",
          "https://www.instagram.com/",
          "https://twitter.com/",
        ],
        contactPoint: [
          { "@type": "ContactPoint", contactType: "sales", email: "sales@yourdomain.com" },
          { "@type": "ContactPoint", contactType: "support", email: "support@yourdomain.com" },
        ],
      },
      {
        "@type": "WebSite",
        name: "XIPHIAS",
        url: "https://www.xiphias.com",
        potentialAction: {
          "@type": "SubscribeAction",
          target: "https://www.xiphias.com/newsletter",
          description:
            "Subscribe to weekly insights on visas, residency, citizenship, and corporate setup.",
        },
      },
    ],
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="relative text-gray-900 dark:text-white transition-colors duration-300"
    >
      {/* Blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-900 dark:via-indigo-800 dark:to-black" />

      <div className="relative container mx-auto px-4 md:px-6 lg:max-w-screen-4xl">

        {/* ============ BRAND & PRIMARY CTAs ============ */}
        <div className="pt-10 pb-6 border-b border-white/15">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7">
              <LogoWhite />
              <p className="mt-3 text-white/85 text-[13.5px] lg:text-sm max-w-2xl">
                Advisory for global mobility, corporate setup, and skilled migration with transparent
                process, timelines, and support.
              </p>
            </div>

            <div className="md:col-span-5 flex md:justify-end gap-2">
              <Link
                href="/consultation"
                className="px-3 py-2 lg:px-3.5 lg:py-2.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[13px] lg:text-sm backdrop-blur-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Book a consultation
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 lg:px-3.5 lg:py-2.5 rounded-md bg-black/20 hover:bg-black/30 text-white text-[13px] lg:text-sm backdrop-blur-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>

        {/* ============ NAV ROW (3 compact columns) ============ */}
        <div className="py-7 border-b border-white/15">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
            <FooterNav title="Explore" links={EXPLORE} />
            <FooterNav title="Company" links={COMPANY} />
            <FooterNav title="Support" links={SUPPORT} />
            <FooterNav title="Legal" links={LEGAL} />
          </div>
        </div>

        {/* ============ TRUST STRIP (glass cards) ============ */}
        <div className="py-5 border-b border-white/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {[
              { icon: "mdi:shield-check", title: "Secure & Compliant", sub: "Data protection • KYC/AML" },
              { icon: "mdi:account-tie-outline", title: "Experienced Advisors", sub: "Dedicated consultant per case" },
              { icon: "mdi:star-circle-outline", title: "Client-First", sub: "Transparent pricing & timelines" },
              { icon: "mdi:headset", title: "Priority Support", sub: "Phone • Email • WhatsApp" },
            ].map(({ icon, title, sub }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/15 p-3 lg:p-3.5 backdrop-blur-md"
              >
                <span className="inline-flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-md bg-white/20">
                  <Icon icon={icon} className="w-5 h-5 lg:w-5.5 lg:h-5.5 text-white" />
                </span>
                <div className="min-w-0">
                  <div className="text-white font-medium text-[12.5px] lg:text-[13px] leading-tight">
                    {title}
                  </div>
                  <div className="text-white/80 text-[11px] lg:text-[11.5px] leading-tight">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ APP • NEWSLETTER • CONTACT (Left)  +  STACKED (Right) ============ */}
<div className="py-7 border-b border-white/10">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
    {/* LEFT COLUMN (col-5): App card + mini newsletter + quick contacts */}
    <aside className="lg:col-span-5 space-y-4">
      {/* App card — filled & balanced */}
      <div className="relative overflow-hidden bg-white/15 dark:bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/25 shadow-lg">
        {/* decorative dots / glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_35%)]" />
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-4">
          {/* QR + copy */}
          <div className="sm:col-span-3 flex gap-4">
            <div className="h-24 w-24 shrink-0 rounded-lg bg-white/30 dark:bg-white/10 flex items-center justify-center ring-1 ring-white/30">
              <img
                src="/images/footer/qrcode.webp"
                alt="Scan to download the app"
                className="h-20 w-20 object-contain"
                loading="lazy"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm md:text-[15px] text-white/95 font-medium">
                XIPHIAS App — track docs & case status in real time
              </p>

              {/* rating */}
              <div className="mt-1.5 flex items-center gap-1 text-[12px] text-white/90">
                <span className="inline-flex">
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-white/90">
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.636 1.122 6.545z" />
                  </svg>
                </span>
                <span className="font-semibold">4.8</span>
                <span className="text-white/70">· 1,200+ reviews</span>
              </div>

              {/* feature chips */}
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {["Live status", "Secure vault", "Push alerts"].map((t) => (
                  <li
                    key={t}
                    className="px-2 py-1 rounded-full text-[11.5px] leading-none bg-white/15 text-white/90 ring-1 ring-white/20"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              {/* store badges */}
              <div className="flex items-center gap-3 mt-3">
                <img
                  src="/images/footer/appstore.svg"
                  alt="Download on App Store"
                  className="h-9 w-auto transition-transform hover:scale-105 hover:drop-shadow"
                  loading="lazy"
                />
                <img
                  src="/images/footer/playstore.65459def.svg"
                  alt="Get it on Google Play"
                  className="h-9 w-auto transition-transform hover:scale-105 hover:drop-shadow"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* phone mock (fills space nicely on wide screens) */}
          <div className="sm:col-span-2 hidden sm:flex items-center justify-center">
            <div className="relative h-40 w-24 rounded-2xl bg-gradient-to-b from-white/25 to-white/10 ring-1 ring-white/30 shadow-2xl">
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-2.5 w-16 rounded-b-xl bg-black/60" />
              <div className="absolute inset-0 p-2.5">
                <div className="h-3 w-16 rounded bg-white/70" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-2.5 w-18 rounded bg-white/35" />
                  <div className="h-2.5 w-20 rounded bg-white/30" />
                  <div className="h-2.5 w-14 rounded bg-white/25" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 grid grid-cols-3 gap-1.5">
                  <div className="h-6 rounded bg-white/25" />
                  <div className="h-6 rounded bg-white/20" />
                  <div className="h-6 rounded bg-white/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini newsletter under app (short, single-line) */}
      <form
        action="/newsletter"
        method="post"
        noValidate
        aria-label="Subscribe to newsletter"
        className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-3"
      >
        <div className="flex items-stretch rounded-full overflow-hidden ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-white/40">
          <input
            id="footer-email-mini"
            name="email"
            type="email"
            inputMode="email"
            placeholder="you@email.com"
            required
            className="flex-1 min-w-0 px-3 h-10 bg-transparent text-white placeholder-white/70 outline-none"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="px-4 h-10 text-sm font-medium text-white
                       bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500
                       hover:from-sky-500 hover:via-blue-600 hover:to-indigo-600
                       focus-visible:outline-none"
          >
            Subscribe
          </button>
        </div>
      </form>

      {/* Quick contacts (chips) */}
      <div className="flex flex-wrap gap-2">
        {[
          { href: "tel:+910000000000", icon: "mdi:phone", label: "Call" },
          { href: "https://wa.me/910000000000", icon: "mdi:whatsapp", label: "WhatsApp", ext: true },
          { href: "mailto:info@xiphiasimmigration.com", icon: "mdi:email-outline", label: "Email" },
          { href: "https://maps.google.com/?q=MG+Road+Bengaluru", icon: "mdi:map-marker-outline", label: "Open in Maps", ext: true },
        ].map(({ href, icon, label, ext }) => (
          <a
            key={label}
            href={href}
            target={ext ? "_blank" : undefined}
            rel={ext ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]
                       bg-white/15 hover:bg-white/25 border border-white/20 text-white"
          >
            <Icon icon={icon} className="w-4 h-4" /> {label}
          </a>
        ))}
      </div>
    </aside>

    {/* RIGHT COLUMN (col-7): two stacked rows */}
    <div className="lg:col-span-7 grid grid-rows-2 gap-4">
      {/* Top row: compact newsletter + trust/quick links in two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Newsletter card */}
        <form
          action="/newsletter"
          method="post"
          noValidate
          aria-label="Subscribe to newsletter"
          className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5"
        >
          <h3 className="text-white/95 text-sm font-semibold mb-2">Subscribe</h3>
          <div className="flex items-stretch rounded-full overflow-hidden ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-white/40">
            <input
              id="footer-email-right"
              name="email"
              type="email"
              inputMode="email"
              placeholder="your@email.com"
              required
              className="flex-1 min-w-0 px-4 h-10 bg-transparent text-white placeholder-white/70 outline-none"
            />
            <button
              type="submit"
              className="px-4 h-10 text-sm font-medium text-white
                         bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500
                         hover:from-sky-500 hover:via-blue-600 hover:to-indigo-600
                         focus-visible:outline-none"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-white/75">Weekly updates. No spam.</p>
        </form>

        {/* Quick “helpful” block (you can swap content anytime) */}
        <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5">
          <h3 className="text-white/95 text-sm font-semibold mb-2">Helpful</h3>
          <ul className="grid grid-cols-2 gap-2 text-[13px] text-white/90">
            <li><Link href="/resources/pricing" className="hover:underline underline-offset-4">Pricing & Fees</Link></li>
            <li><Link href="/resources/faq" className="hover:underline underline-offset-4">FAQ</Link></li>
            <li><Link href="/resources/guides" className="hover:underline underline-offset-4">Guides</Link></li>
            <li><Link href="/resources/webinars" className="hover:underline underline-offset-4">Webinars</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom row: address & contacts (two cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address card */}
        <address
          className="not-italic rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5"
          itemScope
          itemType="https://schema.org/PostalAddress"
          aria-label="Office address"
        >
          <h3 className="text-white/95 text-sm font-semibold mb-2">Bengaluru HQ</h3>
          <p className="text-white/90 text-[13px]" itemProp="streetAddress">
            3rd Floor, XYZ Tower, MG Road
          </p>
          <p className="text-white/90 text-[13px]">
            <span itemProp="addressLocality">Bengaluru</span> 560001,{" "}
            <span itemProp="addressCountry">India</span>
          </p>
          <p className="text-white/70 text-[12px] mt-1">Mon–Fri, 9:30–18:30</p>
        </address>

        {/* Contact chips */}
        <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5">
          <h3 className="text-white/95 text-sm font-semibold mb-2">Get in touch</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "tel:+910000000000", icon: "mdi:phone", label: "Call" },
              { href: "https://wa.me/910000000000", icon: "mdi:whatsapp", label: "WhatsApp", ext: true },
              { href: "mailto:info@xiphiasimmigration.com", icon: "mdi:email-outline", label: "Email" },
              { href: "/consultation", icon: "mdi:calendar-clock", label: "Book consultation" },
            ].map(({ href, icon, label, ext }) => (
              <Link
                key={label}
                href={href}
                target={ext ? "_blank" : undefined}
                rel={ext ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]
                           bg-white/15 hover:bg-white/25 border border-white/20 text-white"
              >
                <Icon icon={icon} className="w-4 h-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* ============ ONE ACTION BAR: payments + CTAs + socials (all in one row) ============ */}
        <div className="py-5">
          <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md px-3.5 py-3 lg:px-4 lg:py-3.5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Payments — scrollable on small screens */}
              <div aria-label="Payment methods" className="flex items-center gap-3 overflow-x-auto no-scrollbar pr-1">
                {[
                  { src: "/images/footer/PaymentMethod/Amex.png", alt: "Amex" },
                  { src: "/images/footer/PaymentMethod/GooglePay.png", alt: "Google Pay" },
                  { src: "/images/footer/PaymentMethod/Maestro.png", alt: "Maestro" },
                  { src: "/images/footer/PaymentMethod/PayPal.png", alt: "PayPal" },
                  { src: "/images/footer/PaymentMethod/Stripe.png", alt: "Stripe" },
                ].map((icon) => (
                  <span
                    key={icon.alt}
                    className="bg-white/20 dark:bg-white/10 rounded-md p-1.5 shadow-sm"
                  >
                    <span className="relative block h-7 w-14 lg:h-8 lg:w-16">
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        fill
                        sizes="(max-width:768px) 56px, 64px"
                        className="object-contain"
                        loading="lazy"
                      />
                    </span>
                  </span>
                ))}
              </div>

              {/* CTAs + Socials */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="flex gap-2 md:order-1">
                  <Link
                    href="/contact"
                    className="inline-flex items-center rounded-md border border-white/60 text-white px-3.5 py-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    Follow us
                  </Link>
                </div>

                <nav
                  aria-label="Social media"
                  className="flex items-center gap-4 md:order-2"
                >
                  {[
                    { href: "#", label: "YouTube", icon: "mdi:youtube", hover: "hover:text-red-400" },
                    { href: "#", label: "LinkedIn", icon: "mdi:linkedin", hover: "hover:text-blue-400" },
                    { href: "#", label: "Facebook", icon: "mdi:facebook", hover: "hover:text-blue-500" },
                    { href: "#", label: "Instagram", icon: "mdi:instagram", hover: "hover:text-pink-400" },
                    { href: "#", label: "Twitter / X", icon: "mdi:twitter", hover: "hover:text-sky-400" },
                  ].map(({ href, label, icon, hover }) => (
                    <Link
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white/95 ${hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-md`}
                    >
                      <Icon className="w-6 h-6" icon={icon} />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* ============ SINGLE LEGAL ROW ============ */}
        <div className="py-5 border-t border-white/15">
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[11px] text-white/75">©2011–{year} XIPHIAS. All rights reserved.</p>
            <p className="text-[11px] text-white/70 max-w-3xl leading-4">
              Information is for general guidance only and not legal advice. Availability, costs, and
              timelines may change. Please read our{" "}
              <Link href="/legal/privacy" className="underline hover:text-white">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/legal/terms" className="underline hover:text-white">
                Terms of Use
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </footer>
  );
}

/* ---------- small helpers ---------- */

function FooterNav({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-white font-semibold mb-2.5 lg:mb-3 text-[15px]">{title}</h3>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[13.5px] lg:text-[14px] leading-relaxed text-white/85 hover:text-white underline-offset-4 hover:underline transition"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function InlineLinks({
  title,
  links,
  className = "",
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <nav className={className} aria-label={`${title} links`}>
      <h3 className="text-base font-semibold text-white mb-2.5">{title}</h3>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[13.5px] lg:text-[14px] leading-relaxed text-white/85 hover:text-white underline-offset-4 hover:underline transition"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
