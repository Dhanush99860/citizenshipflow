// FILE: src/app/(site)/terms/page.tsx
// Terms of Use — black/white theme only, fully responsive, SEO+JSON-LD, with Breadcrumb.
// Uses your Breadcrumb component: import Breadcrumb from "@/components/Common/Breadcrumb"; no props assumed.
// If your Breadcrumb needs props, replace the JSX where noted.

import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import React from "react";

// ───────────────── SEO METADATA ─────────────────
export const metadata: Metadata = {
  title: "Terms of Use · XIPHIAS Immigration Private Limited",
  description:
    "The terms and conditions for using XIPHIAS Immigration Private Limited’s website and services.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Use · XIPHIAS Immigration Private Limited",
    description:
      "The terms and conditions for using XIPHIAS Immigration Private Limited’s website and services.",
    url: "/terms",
    type: "article",
  },
  twitter: { card: "summary" },
};

// ──────────────── SMALL UI HELPERS (black/white only) ────────────────
const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
    <h2 id={`${id}-title`} className="text-xl md:text-2xl font-semibold tracking-tight mb-3 text-black dark:text-white">
      {title}
    </h2>
    <div className="max-w-none text-black dark:text-white">{children}</div>
  </section>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-black/10 dark:border-white/20 bg-white/80 dark:bg-black/40 p-4 backdrop-blur-sm text-black dark:text-white">
    {children}
  </div>
);

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium bg-white border-black/20 text-black dark:bg-black dark:border-white/30 dark:text-white">{children}</kbd>
);

// ───────────────── PAGE ─────────────────
export default function TermsPage() {
  const effectiveDate = "09 Oct 2025";
  const company = {
    name: "XIPHIAS Immigration Private Limited",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    site: "https://xiphiasimmigration.com",
    contact: "privacy@xiphiasimmigration.com",
  } as const;

  const toc = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "services", label: "Services & Information" },
    { id: "eligibility", label: "Eligibility & Accounts" },
    { id: "conduct", label: "User Conduct" },
    { id: "ip", label: "Intellectual Property" },
    { id: "links", label: "Third‑Party Links" },
    { id: "warranty", label: "Disclaimers" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "indemnity", label: "Indemnity" },
    { id: "termination", label: "Suspension & Termination" },
    { id: "law", label: "Governing Law & Jurisdiction" },
    { id: "changes", label: "Changes to Terms" },
    { id: "contact", label: "Contact" },
  ];

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Use",
    url: `${company.site}/terms`,
    dateModified: "2025-10-09",
    isPartOf: { "@type": "WebSite", name: company.name, url: company.site },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${company.site}/` },
      { "@type": "ListItem", position: 2, name: "Terms of Use", item: `${company.site}/terms` },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900 text-black dark:text-white">
      {/* Skip link for keyboard users */}
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-black focus:text-white focus:px-3 focus:py-2">Skip to content</a>

      {/* Your Breadcrumb component (no props assumed) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        <Breadcrumb />
      </div>

      {/* Hero */}
      <header className="border-b border-black/10 dark:border-white/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">Terms of Use</h1>
              <p className="mt-2 text-sm/6 opacity-80">Effective: {effectiveDate}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Card>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ground rules for using our website and services.</li>
                    <li>Ownership of content, acceptable use, and disclaimers.</li>
                    <li>Jurisdiction: Bengaluru, Karnataka, India.</li>
                    <li>How to contact us and how updates work.</li>
                  </ul>
                </Card>
                <Card>
                  <p className="text-sm">Related policy: <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
                  <p className="text-sm mt-2">Need help? Email <a className="underline" href={`mailto:${company.contact}`}>{company.contact}</a>.</p>
                </Card>
              </div>
            </div>

            {/* Right rail (desktop TOC) */}
            <aside className="hidden lg:block w-64 shrink-0">
              <nav aria-label="On this page" className="sticky top-28">
                <p className="text-xs uppercase tracking-wide opacity-70 mb-2">On this page</p>
                <ul className="space-y-1">
                  {toc.map((n) => (
                    <li key={n.id}>
                      <a href={`#${n.id}`} className="block rounded-md px-2 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10">
                        {n.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </header>

      {/* Body */}
      <div id="content" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-9 space-y-10">
            <Section id="acceptance" title="1. Acceptance of Terms">
              <p>By accessing or using this site, you agree to be bound by these Terms and our <Link href="/privacy-policy" className="underline">Privacy Policy</Link>. If you do not agree, please do not use the site.</p>
            </Section>

            <Section id="services" title="2. Services & Information">
              <p>
                {company.name} provides immigration consulting information and related services. Content on this site is for general guidance and does not constitute legal advice. You should obtain professional counsel before acting on information found here.
              </p>
            </Section>

            <Section id="eligibility" title="3. Eligibility & Accounts">
              <ul className="list-disc pl-5 space-y-1">
                <li>You must be able to form a binding contract under applicable law.</li>
                <li>If you create an account, keep credentials confidential and promptly notify us of any unauthorized use.</li>
                <li>You are responsible for all activity under your account.</li>
              </ul>
            </Section>

            <Section id="conduct" title="4. User Conduct (Acceptable Use)">
              <ul className="list-disc pl-5 space-y-1">
                <li>No unlawful, infringing, defamatory, or harmful content or activity.</li>
                <li>No interference with site operation or attempts to access non‑public areas.</li>
                <li>No automated scraping beyond what is permitted by robots.txt.</li>
              </ul>
            </Section>

            <Section id="ip" title="5. Intellectual Property">
              <p>
                All site materials (text, graphics, logos, trademarks, and code) are owned by {company.name} or our licensors and are protected by applicable laws. You may not reproduce, distribute, adapt, or create derivative works without prior written permission.
              </p>
            </Section>

            <Section id="links" title="6. Third‑Party Links">
              <p>
                The site may contain links to third‑party websites. We do not endorse or control those sites and are not responsible for their content, policies, or practices.
              </p>
            </Section>

            <Section id="warranty" title="7. Disclaimers">
              <p>
                The site and services are provided on an “as is” and “as available” basis. To the fullest extent permitted by law, {company.name} disclaims all warranties, whether express, implied, or statutory, including merchantability, fitness for a particular purpose, and non‑infringement.
              </p>
            </Section>

            <Section id="liability" title="8. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, {company.name} will not be liable for any indirect, incidental, special, consequential, or exemplary damages, or for loss of profits, data, or goodwill, arising from or related to your use of the site or services.
              </p>
            </Section>

            <Section id="indemnity" title="9. Indemnity">
              <p>
                You agree to indemnify and hold harmless {company.name}, its affiliates, officers, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys’ fees) arising from your violation of these Terms or applicable law.
              </p>
            </Section>

            <Section id="termination" title="10. Suspension & Termination">
              <p>
                We may suspend or terminate access to the site at any time, with or without notice, for conduct that we believe violates these Terms or is otherwise harmful.
              </p>
            </Section>

            <Section id="law" title="11. Governing Law & Jurisdiction">
              <p>
                These Terms are governed by the laws of India. Courts in Bengaluru, Karnataka shall have exclusive jurisdiction over any disputes arising from or relating to these Terms or your use of the site.
              </p>
            </Section>

            <Section id="changes" title="12. Changes to Terms">
              <p>
                We may update these Terms from time to time. If changes are material, we will provide a notice on this page. Your continued use of the site after changes become effective constitutes your acceptance of the revised Terms.
              </p>
              <Card>
                <h3 className="text-sm font-semibold mb-2">Version history</h3>
                <ul className="text-sm list-disc pl-5">
                  <li>v1.0 — 09 Oct 2025: Initial publication.</li>
                </ul>
              </Card>
            </Section>

            <Section id="contact" title="13. Contact">
              <p>
                Questions about these Terms? Email <a className="underline" href={`mailto:${company.contact}`}>{company.contact}</a> or write to {company.name}, {company.city}, {company.state}, {company.country}.
              </p>
            </Section>

            <div className="pt-6 text-xs opacity-80">
              <p>Tip: Use <Kbd>Ctrl</Kbd>/<Kbd>Cmd</Kbd> + <Kbd>F</Kbd> to quickly search within this page.</p>
            </div>
          </div>

          {/* Mobile TOC */}
          <div className="lg:col-span-3">
            <div className="lg:hidden sticky top-24 border rounded-xl border-black/10 dark:border-white/20 bg-white/80 dark:bg-black/40 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide opacity-70 mb-2">On this page</p>
              <div className="flex flex-wrap gap-2">
                {toc.map((n) => (
                  <a key={n.id} href={`#${n.id}`} className="inline-flex items-center rounded-md border px-2 py-1 text-xs border-black/15 dark:border-white/25 hover:bg-black/5 dark:hover:bg-white/10">
                    {n.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD (SEO) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
    </main>
  );
}
