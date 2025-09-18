"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, ShieldCheck, TrendingUp, Globe2 } from "lucide-react";
import Breadcrumb from "@/components/Common/Breadcrumb";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

// ----------------------------------------------------
// Config
// ----------------------------------------------------
const INDUSTRY_AVG = 68;
const XIPHIAS_SUCCESS = 92;

// Tailwind color tokens from your design system are used throughout
// (primary, secondary, light_bg, dark_text, etc.) so it fits right in.

// ----------------------------------------------------
// Utilities
// ----------------------------------------------------
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

// Smooth counter that only animates when visible
// Smooth counter that only animates when visible (no update loops)
type CounterProps = { end: number; suffix?: string; duration?: number };

const Counter = ({ end, suffix = "", duration = 1800 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const rafId = useRef<number | null>(null);
  const didAnimateRef = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || didAnimateRef.current) return;

    const onIntersect: IntersectionObserverCallback = ([entry], obs) => {
      if (!entry.isIntersecting || didAnimateRef.current) return;

      // ensure we don't re-trigger again
      didAnimateRef.current = true;
      obs.unobserve(entry.target);

      if (reduced) {
        setCount(end);
        return;
      }

      let start: number | null = null;
      const step = (ts: number) => {
        if (start == null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setCount(Math.round(eased * end));
        if (p < 1) {
          rafId.current = requestAnimationFrame(step);
        } else {
          setCount(end); // snap to final
        }
      };

      rafId.current = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(onIntersect, { threshold: 0.4 });
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
    // only re-create if end/duration/reduced change
  }, [end, duration, reduced]);

  return (
    <span ref={ref} aria-live="polite" aria-atomic>
      {count}
      {suffix}
    </span>
  );
};


// ----------------------------------------------------
// Component
// ----------------------------------------------------
export default function PersonalHero() {
  const reduced = useReducedMotion();

  const initialData = useMemo(
    () => [
      { name: "Industry Avg", value: 0 },
      { name: "XIPHIAS Success", value: 0 },
    ],
    []
  );

  const finalData = useMemo(
    () => [
      { name: "Industry Avg", value: INDUSTRY_AVG },
      { name: "XIPHIAS Success", value: XIPHIAS_SUCCESS },
    ],
    []
  );

  const [chartData, setChartData] = useState(initialData);
  const [dateText, setDateText] = useState<string>(""); // avoid hydration mismatch

  // Animate chart only when visible
  useEffect(() => {
    const target = document.getElementById("chart-box");
    if (!target) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setChartData(finalData);
      },
      { threshold: 0.35 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, [finalData]);

  // Month/year (client only)
  useEffect(() => {
    const update = () =>
      setDateText(
        new Date().toLocaleString("en-US", { month: "short", year: "numeric" })
      );
    update();
    const id = setInterval(update, 1000 * 60 * 60);
    return () => clearInterval(id);
  }, []);

  const isAnimating = chartData.some((d) => d.value === 0);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden bg-gradient-to-br from-primary via-[#3a7bdb] to-[#0d3a7a] dark:from-dark_bg dark:via-darklight dark:to-deepSlate pt-6 sm:pt-8 lg:pt-10"
    >
      {/* Background orbs / accents (decorative) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {/* ROW 1: Breadcrumb */}
      <div className="max-w-7xl w-full mx-auto lg:max-w-screen-xl mb-6 md:mb-8 px-4 sm:px-6 lg:px-0">
        <div className="bg-white dark:bg-black/80 backdrop-blur border border-blue-100/60 dark:border-dark_border rounded-xl md:rounded-2xl shadow-sm">
          <Breadcrumb />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* LEFT CONTENT */}
          <header className="flex flex-col justify-center text-center lg:text-left text-light_bg dark:text-dark_text space-y-5">
            <h1 id="hero-title" className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Unlock Global Opportunities with <span className="text-secondary">XIPHIAS</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 text-light_bg/95 dark:text-dark_text/80">
              Trusted by entrepreneurs, investors, and families worldwide — with a
              <span className="font-semibold text-secondary"> 92% success rate</span> across Golden Visa, PR, and Investment Migration Programs.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1">
              <Link
                href="/contact"
                aria-label="Book a private consultation"
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-secondary text-light_text font-semibold shadow-md hover:shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary/80"
              >
                <Calendar className="h-5 w-5 shrink-0" />
                <span>Book a Private Consultation</span>
              </Link>

              <Link
                href="/insights"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 rounded-2xl bg-white/20 dark:bg-white/10 text-white border border-white/30 hover:bg-white/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50"
              >
                Explore latest Insights
              </Link>
            </div>

            {/* Trust strip */}
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-white/90">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <ShieldCheck className="h-4 w-4" /> Transparent Process
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <TrendingUp className="h-4 w-4" /> Outcome-focused
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Globe2 className="h-4 w-4" /> Global Coverage
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="h-4 w-4" /> Fast Scheduling
              </li>
            </ul>
          </header>

          {/* RIGHT CONTENT BOX */}
          <div
            id="chart-box"
            className="relative rounded-3xl p-5 sm:p-6 lg:p-7 bg-light_bg/90 dark:bg-darklight/90 backdrop-blur-xl shadow-2xl border border-border/50 dark:border-dark_border/60 overflow-hidden"
          >
            {/* Glossy Overlay */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-slateGray/40 dark:to-transparent rounded-3xl pointer-events-none"
            />

            {/* Header */}
            <div className="relative mb-5 text-center lg:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-light_text dark:text-dark_text">
                Proven Track Record
              </h3>
              <p className="text-xs sm:text-sm text-light_grey dark:text-dark_border">
                XIPHIAS Success vs. Industry Standards
              </p>
            </div>

            {/* Chart */}
            <div className="relative">
              {/* Skeleton shimmer while values are 0 */}
              {isAnimating && (
                <div aria-hidden className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="h-full w-full animate-pulse bg-gradient-to-b from-slate-200/60 to-slate-100/30 dark:from-slate-700/40 dark:to-slate-600/20" />
                </div>
              )}

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} barCategoryGap="25%">
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      borderRadius: 12,
                      border: "1px solid rgba(2,6,23,0.06)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                      color: "#0f172a",
                    }}
                    labelStyle={{ display: "none" }}
                  />

                  {/* Animated Gradients */}
                  <defs>
                    <linearGradient id="gradGray" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#cbd5e1">
                        {!reduced && (
                          <animate attributeName="offset" values="0;1;0" dur="6s" repeatCount="indefinite" />
                        )}
                      </stop>
                      <stop offset="100%" stopColor="#e2e8f0" />
                    </linearGradient>
                    <linearGradient id="gradBlue" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#1c57b4">
                        {!reduced && (
                          <animate attributeName="offset" values="0;1;0" dur="6s" repeatCount="indefinite" />
                        )}
                      </stop>
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>

                  <Bar
                    dataKey="value"
                    radius={[14, 14, 0, 0]}
                    animationDuration={reduced ? 0 : 1600}
                    className="transition-transform duration-300 motion-safe:group-hover:scale-[1.02]"
                  >
                    {chartData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={entry.name === "Industry Avg" ? "url(#gradGray)" : "url(#gradBlue)"}
                        className="transition-all duration-300 hover:brightness-110"
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      content={(props: any) => {
                        const { x, y, value } = props;
                        return (
                          <text
                            x={(x ?? 0) + 35}
                            y={(y ?? 0) - 8}
                            textAnchor="middle"
                            className="fill-light_text dark:fill-dark_text font-semibold text-sm sm:text-base"
                          >
                            {value}%
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Disclaimer */}
            <p className="relative text-xs text-light_grey dark:text-dark_border mt-4 text-center lg:text-left">
              *As of {dateText || "—"}. Past performance does not guarantee future outcomes.
            </p>

            {/* Key Stats */}
            <div className="relative grid grid-cols-3 gap-3 sm:gap-6 mt-7 text-center">
              <div className="space-y-1 hover:scale-[1.03] transition-transform duration-300">
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary">
                  <Counter end={15} suffix="+" />
                </p>
                <p className="text-xs sm:text-sm text-light_grey dark:text-dark_border">Years of Excellence</p>
              </div>
              <div className="space-y-1 hover:scale-[1.03] transition-transform duration-300">
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary">
                  <Counter end={25} suffix="+" />
                </p>
                <p className="text-xs sm:text-sm text-light_grey dark:text-dark_border">Global Programs</p>
              </div>
              <div className="space-y-1 hover:scale-[1.03] transition-transform duration-300">
                <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary">
                  <Counter end={10000} suffix="+" duration={2200} />
                </p>
                <p className="text-xs sm:text-sm text-light_grey dark:text-dark_border">Clients Empowered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
