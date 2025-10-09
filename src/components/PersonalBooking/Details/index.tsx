"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Expert from "@/components/PersonalBooking/Expert";
import Awards from "@/components/PersonalBooking/Awards";
import InvestmentStats from "@/components/PersonalBooking/Problem/index";
import Solutions from "@/components/PersonalBooking/Solutions";
import TestimonialSection from "@/components/Common/TestimonialSection/index";
import AdvisorConsultationCard from "@/components/Citizenship/AdvisorConsultationCard";

import {
  User,
  AlertTriangle,
  Lightbulb,
  FileText,
  Award,
  MessageCircle,
  DollarSign,
} from "lucide-react";

type ArticleMeta = {
  title: string;
  url: string;
  date?: string;
  summary?: string;
  hero?: string;
  tags?: string[];
};

// Navigation labels and section anchors
const navItems = [
  { label: "About", href: "#about", icon: User },
  { label: "Why Consultation", href: "#why", icon: AlertTriangle },
  { label: "Our Approach", href: "#approach", icon: Lightbulb },
  { label: "Insights", href: "#articles", icon: FileText },
  { label: "Awards & Media", href: "#awards", icon: Award },
  { label: "Client Stories", href: "#testimonials", icon: MessageCircle },
  { label: "Pricing", href: "#pricing", icon: DollarSign },
];

function ArticleCard({ a }: { a: ArticleMeta }) {
  return (
    <a
      href={a.url}
      className="group block rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 hover:shadow-lg transition"
      aria-label={a.title}
    >
      {a.hero ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.hero} alt={a.title} className="w-full h-40 object-cover" />
      ) : null}
      <div className="p-4">
        <h3 className="font-semibold leading-snug group-hover:underline">
          {a.title}
        </h3>
        {a.summary ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {a.summary}
          </p>
        ) : null}
        <div className="mt-2 text-xs text-gray-500">
          {a.date ? new Date(a.date).toLocaleDateString() : null}
        </div>
      </div>
    </a>
  );
}

export default function Sections({ articles }: { articles: ArticleMeta[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full transition-colors duration-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {/* Sticky Top Nav (Desktop) */}
      <section className="sticky top-0 z-40 hidden sm:block bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 p-5">
        <div className="container mx-auto lg:max-w-screen-xl px-4">
          <nav className="relative flex justify-between text-sm sm:text-base font-medium tracking-wide gap-6 sm:gap-10">
            {navItems.map((item) => {
              const isActive = active === item.href.replace("#", "");
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative p-5 transition-all duration-300 ${isActive
                      ? "text-black dark:text-white font-semibold"
                      : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-1"
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 -bottom-[20px] h-[3px] bg-black dark:bg-white rounded-full"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Floating Bottom Nav (Mobile) — improved */}
      <nav
        role="tablist"
        aria-label="Section navigation"
        className="
    sm:hidden fixed left-1/2 -translate-x-1/2 z-50
    bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl
    border border-neutral-200/70 dark:border-neutral-700/70
    rounded-2xl shadow-lg w-[92%] max-w-md
  "
        /* respect iOS home-indicator */
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
      >
        {/* scrollable rail so 7 items aren’t squished */}
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-2 py-2 gap-1">
          {navItems.map((item) => {
            const isActive = active === item.href.replace("#", "");
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "page" : undefined}
                className={`
            snap-center shrink-0 grow-0 basis-[84px]
            flex flex-col items-center justify-center
            h-16 rounded-xl transition-all
            ${isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"}
          `}
              >
                {/* keep height stable so nothing jumps on active */}
                <div
                  className={`
              grid place-items-center h-9 w-9 rounded-xl
              ${isActive ? "bg-indigo-50 dark:bg-indigo-900/40 ring-1 ring-indigo-200/60 dark:ring-indigo-800/60" : ""}
            `}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                <span className="mt-1 text-[10.5px] leading-none line-clamp-1 text-center">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* optional subtle handle to hint scrollability on very small screens */}
        <div className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </nav>


      {/* Sections */}
      <AnimatePresence mode="wait">
        {/* About Section */}
        <motion.section
          id="about"
          key="about"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Expert />
        </motion.section>

        {/* Why Consultation Section */}
        <motion.section
          id="why"
          key="why"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <InvestmentStats />
        </motion.section>

        {/* Our Approach Section */}
        <motion.section
          id="approach"
          key="approach"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Solutions />
        </motion.section>

        {/* Insights Section */}
        <motion.section
          id="articles"
          key="articles"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="container mx-auto lg:max-w-screen-2xl px-4 py-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-semibold">Latest Articles</h2>
              <a href="/articles" className="text-blue-600 hover:underline">
                View all
              </a>
            </div>
            {articles?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <ArticleCard key={a.url} a={a} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No articles yet.
              </p>
            )}
          </div>
        </motion.section>

        {/* Awards & Media Section */}
        <motion.section
          id="awards"
          key="awards"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Awards />
        </motion.section>

        {/* Client Stories / Testimonials Section */}
        <motion.section
          id="testimonials"
          key="testimonials"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <TestimonialSection />
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          id="pricing"
          key="pricing"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* ADVISOR SPOTLIGHT (component) */}
          <section className="scroll-mt-28 max-w-screen-xl mx-auto py-6 px-4">
            <AdvisorConsultationCard
              advisorName="Varun Singh"
              role="CBI & RBI - MD XIPHIAS"
              avatarSrc="/images/avtar/varun-singh.png"
              bookingUrl="/personalbooking"
              brochureUrl="/brochures/citizenship/grenada/real-estate.pdf"
              priceOptions={[
                {
                  id: "std", label: "45–60 mins", price: "₹15,500", best: true, bullets: [
                    "Eligibility triage & risk pointers",
                    "Route comparison (donation vs real estate)",
                    "Project shortlist & checklist",
                  ]
                },
                {
                  id: "deep", label: "90 mins (in-depth)", price: "₹25,500", bullets: [
                    "Everything in Standard",
                    "File strategy & timeline modeling",
                    "Follow-up summary & next steps",
                  ]
                },
              ]}
            />
          </section>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
