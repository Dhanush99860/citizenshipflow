// app/careers/page.tsx
import type { Metadata } from "next";
import Hero from "@/components/careers/Hero";
import { getAllJobs } from "@/lib/jobs";
import JobList from "@/components/careers/JobList";
import JobFilters from "@/components/careers/JobFilters";
import HiringSteps from "@/components/careers/HiringSteps";
import Perks from "@/components/careers/Perks";
import FAQ from "@/components/careers/FAQ";
import QuickApplyForm from "@/components/careers/QuickApplyForm";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const dynamic = "force-static"; // build-time; FS-driven

const SITE = "https://www.xiphiasimmigration.com";

export const metadata: Metadata = {
  title: "Careers at XIPHIAS Immigration | Remote Jobs & Open Roles",
  description:
    "Join our global team. Explore remote-friendly careers in citizenship, residency, skilled migration, and corporate immigration.",
  alternates: { canonical: `${SITE}/careers` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Careers at XIPHIAS Immigration",
    description: "Remote-first roles across immigration services.",
    url: `${SITE}/careers`,
    type: "website",
    siteName: "XIPHIAS Immigration",
  },
};

function orgJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "XIPHIAS Immigration",
    url: SITE,
    logo: `${SITE}/favicon.ico`,
    sameAs: [
      "https://www.linkedin.com/company/xiphias-immigration/",
      // add other socials if you want
    ],
  });
}

export default function Page() {
  const jobs = getAllJobs();
  const depts = Array.from(new Set(jobs.map((j) => j.dept).filter(Boolean))) as string[];

  return (
    <>
      {/* Organization structured data (OK on listing page) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd() }} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Hero */}
        <Hero />

        {/* Filters + listing */}
        <section id="open-roles" aria-label="Filters and Open roles" className="mt-10 md:mt-14">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Open Roles
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Remote-first opportunities across consulting, sales, processing, design, and marketing.
          </p>

          <div className="mt-4">
            <JobFilters depts={depts} />
          </div>

          <div className="mt-6">
            <JobList jobs={jobs} />
          </div>
        </section>

        {/* Hiring process */}
        <section id="process" aria-label="Hiring process" className="mt-14">
          <HiringSteps />
        </section>

        {/* Benefits */}
        <section id="perks" aria-label="Benefits & Perks" className="mt-14">
          <Perks />
        </section>

        {/* FAQ */}
        <section id="faq" aria-label="Frequently asked questions" className="mt-14">
          <FAQ />
        </section>

        {/* Apply / quick form */}
        <section id="apply" aria-label="Quick apply" className="mt-16">
          <div
            className={[
              "rounded-3xl p-6 sm:p-8",
              "bg-gradient-to-br from-sky-50 via-white to-indigo-50 ring-1 ring-blue-100/80",
              "dark:from-blue-950/30 dark:to-indigo-950/20 dark:ring-blue-900/40",
            ].join(" ")}
          >
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Quick Apply
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Don’t see an exact match? Share your resume and we’ll reach out.
            </p>
            <div className="mt-5">
              <QuickApplyForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
