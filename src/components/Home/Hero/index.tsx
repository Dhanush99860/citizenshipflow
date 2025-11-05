"use client";


import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import CardSlider from "./slider";

// Lazy-load ContactForm on the client only
const ContactForm = dynamic(() => import("@/components/ContactForm/index"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const reduce = useReducedMotion();
  const [showForm, setShowForm] = useState(false);

  const leftMotion = {
    initial: { x: reduce ? 0 : -18, opacity: reduce ? 1 : 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.45 } },
  };
  const rightMotion = {
    initial: { x: reduce ? 0 : 18, opacity: reduce ? 1 : 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.45, delay: 0.05 } },
  };

  return (
    <section id="main-banner" aria-labelledby="home-hero-title" className="relative z-1 overflow-hidden">
      {/* Background image (critical) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero/top-immigration-counsultent.webp"
          alt="top-immigration-counsultent"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-blue-700/85 md:bg-blue-700/80" />
      </div>

      <div className="container mx-auto px-4 lg:max-w-screen-2xl">
        {/* ===================== TOP GRID ===================== */}
        {/* Balanced columns & tighter horizontal rhythm on lg+ */}
        <div className="grid grid-cols-12 items-start gap-y-10 gap-x-6 lg:gap-x-12 pt-16 md:pt-20 lg:pt-24">
          {/* LEFT: Text + CTAs */}
          <motion.div {...leftMotion} className="col-span-12 lg:col-span-7 xl:col-span-6">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
              <Image
                src="/images/icons/icon-bag.svg"
                alt=""
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-9 w-9"
              />
              <p className="mb-0 text-[15px] text-white/90">
                Residency & Citizenship <span className="text-secondary">Made Easy</span>
              </p>
            </div>

            {/* Title */}
            <h1
              id="home-hero-title"
              className="mx-auto max-w-[18ch] text-center font-semibold leading-tight text-white lg:text-left"
              style={{ fontSize: "clamp(2rem, 6vw, 4.75rem)" }}
            >
              Secure Your <span className="text-secondary">Future</span> with Global{" "}
              <span className="text-secondary">Investment Visas</span>!
            </h1>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:justify-start">
              <Link
                href="/eligibility"
                aria-label="Check your visa eligibility"
                className="inline-flex items-center justify-center rounded-lg border border-secondary bg-secondary px-5 py-2.5 text-base font-medium text-black transition hover:bg-transparent hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Check your Eligibility
              </Link>

              <Link
                href="/images/residency/xiphias-corporate-mobility.pdf"
                aria-label="Download immigration guide (PDF)"
                className="inline-flex items-center justify-center rounded-lg border border-secondary bg-transparent px-5 py-2.5 text-base font-medium text-white transition hover:bg-secondary hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                Download Guide
              </Link>
            </div>

            {/* Store badges */}
            <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
              <Link
                href="https://play.google.com/store/apps/details?id=com.xiphiasimmigration"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get the app on Google Play"
                className="transition hover:scale-[1.03]"
              >
                <Image
                  src="/images/hero/playstore.png"
                  alt="Get it on Google Play"
                  width={200}
                  height={60}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 160px, 200px"
                />
              </Link>

              <Link
                href="https://apps.apple.com/app/idXXXXXXXX" // TODO: replace with real App Store link
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="transition hover:scale-[1.03]"
              >
                <Image
                  src="/images/hero/applestore.png"
                  alt="Download on the App Store"
                  width={200}
                  height={60}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 160px, 200px"
                />
              </Link>
            </div>

            {/* MOBILE: Show/Hide Contact Form */}
            <div className="mt-8 lg:hidden">
              <button
                type="button"
                onClick={() => setShowForm((s) => !s)}
                aria-expanded={showForm}
                aria-controls="mobile-consultation-form"
                className="w-full rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15"
              >
                {showForm ? "Hide consultation form" : "Book a FREE consultation"}
              </button>

              <div
                id="mobile-consultation-form"
                className={[
                  "grid overflow-hidden transition-all duration-300 ease-out",
                  showForm ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/20">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Desktop form (right-aligned, sticky) */}
          <motion.aside
            {...rightMotion}
            className="relative col-span-12 hidden lg:col-span-5 xl:col-span-6 lg:block"
          >
            <div className="lg:sticky lg:top-24">
              {/* align to the right edge, controlled width */}
              <div className="ml-auto w-full max-w-md rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.20)]">
                <ContactForm />
              </div>
            </div>
          </motion.aside>
        </div>

        {/* ===================== SLIDER ===================== */}
        <div className="py-10">
          <CardSlider />
        </div>
      </div>

      {/* Subtle glow */}
      <div className="pointer-events-none absolute -right-16 -top-56 -z-10 h-64 w-64 rounded-full bg-secondary/30 blur-[120px] md:h-80 md:w-80" />

      {/* Tiny SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "XIPHIAS Immigration",
            url: "https://www.xiphiasimmigration.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://www.xiphiasimmigration.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </section>
  );
}

