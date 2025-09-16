"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Expert from "@/components/PersonalBooking/Expert";
import Awards from "@/components/PersonalBooking/Awards";
import InvestmentStats from "@/components/PersonalBooking/Problem/index";
import Solutions from "@/components/PersonalBooking/Solutions";
import TestimonialSection from "@/components/Common/TestimonialSection/index";

import { User, Award, FileText, MessageSquare, DollarSign } from "lucide-react";

type ArticleMeta = {
  title: string;
  url: string;
  date?: string;
  summary?: string;
  hero?: string;
  tags?: string[];
};

const navItems = [
  { label: "Expert", href: "#expert", icon: User },
  { label: "Problem", href: "#problem", icon: DollarSign },
  { label: "Solution", href: "#solution", icon: User },
  { label: "Articles", href: "#articles", icon: FileText },
  { label: "Awards", href: "#awards", icon: Award },
  { label: "Testimonials", href: "#testimonials", icon: MessageSquare },
  { label: "Fee", href: "#fee", icon: MessageSquare },
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
        <h3 className="font-semibold leading-snug group-hover:underline">{a.title}</h3>
        {a.summary ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{a.summary}</p>
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
                  className={`relative p-5 transition-all duration-300 ${
                    isActive
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

      {/* Floating Bottom Nav (Mobile) */}
      <nav
        className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 dark:bg-neutral-900/80
                   backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-700/60
                   flex justify-around items-center gap-3 px-4 py-2 rounded-2xl shadow-lg w-[90%] max-w-md"
      >
        {navItems.map((item) => {
          const isActive = active === item.href.replace("#", "");
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -3 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`p-2 rounded-xl ${isActive ? "bg-indigo-50 dark:bg-indigo-900/40 shadow-md" : "bg-transparent"}`}
              >
                <Icon size={20} strokeWidth={2} />
              </motion.div>
              <span className="text-[11px]">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Sections */}
      <AnimatePresence mode="wait">
        <motion.section id="expert" key="expert" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Expert />
        </motion.section>

        <motion.section id="problem" key="problem" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <InvestmentStats />
        </motion.section>

        <motion.section id="solution" key="solution" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Solutions />
        </motion.section>

        {/* ✅ Latest Articles (from props; no server imports here) */}
        <motion.section id="articles" key="articles" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <div className="container mx-auto lg:max-w-screen-xl px-4 py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">Latest Articles</h2>
              <a href="/articles" className="text-blue-600 hover:underline">View all</a>
            </div>
            {articles?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <ArticleCard key={a.url} a={a} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No articles yet.</p>
            )}
          </div>
        </motion.section>

        <motion.section id="awards" key="awards" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Awards />
        </motion.section>

        <motion.section id="testimonials" key="testimonials" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <TestimonialSection />
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
