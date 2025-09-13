"use client";

import { useEffect, useState, useRef } from "react";
import { Calendar } from "lucide-react";
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

const initialData = [
  { name: "Industry Avg", value: 0 },
  { name: "XIPHIAS Success", value: 0 },
];

const finalData = [
  { name: "Industry Avg", value: 68 },
  { name: "XIPHIAS Success", value: 92 },
];

// ✅ Smooth Counter with requestAnimationFrame
type CounterProps = {
  end: number;
  suffix?: string;
  duration?: number; // ms
};

const Counter = ({ end, suffix = "", duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          let startTimestamp: number | null = null;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // easing: easeOutCubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(easedProgress * end));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end); // ensure exact end value
              setHasAnimated(true);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [end, hasAnimated, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

export default function PersonalHero() {
  const [chartData, setChartData] = useState(initialData);
  const [dateText, setDateText] = useState(
    new Date().toLocaleString("en-US", { month: "short", year: "numeric" })
  );

  // Animate chart when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setChartData(finalData);
      },
      { threshold: 0.4 }
    );
    const chart = document.getElementById("chart-box");
    if (chart) observer.observe(chart);
    return () => observer.disconnect();
  }, []);

  // Auto-update month/year
  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date().toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      setDateText(current);
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full bg-gradient-to-br from-primary via-[#3a7bdb] to-[#0d3a7a]
    dark:from-dark_bg dark:via-darklight dark:to-deepSlate pt-10"
    >
      {/* ROW 1: Breadcrumb */}
      <div className="max-w-7xl w-full mx-auto lg:max-w-screen-xl mb-8 border-4 rounded-lg border-blue-50 lg:px-0">
        <Breadcrumb />
      </div>

      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 px-6 md:px-12 pb-10">
        {/* LEFT CONTENT */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 text-light_bg dark:text-dark_text">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight">
            Unlock Global Opportunities with{" "}
            <span className="text-secondary">XIPHIAS</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-xl text-light_bg/90 dark:text-dark_text/80">
            Trusted by entrepreneurs, investors, and families worldwide — with a{" "}
            <span className="font-semibold text-secondary">
              92% success rate
            </span>{" "}
            across Golden Visa, PR, and Investment Migration Programs.
          </p>

          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary text-light_text font-semibold shadow-md hover:shadow-xl hover:bg-yellow-400 transition">
            <Calendar className="w-5 h-5" /> Book a Private Consultation
          </button>
        </div>

        {/* RIGHT CONTENT BOX */}
        <div
          id="chart-box"
          className="flex-1 w-full max-w-lg relative rounded-3xl p-6 sm:p-8 
          bg-light_bg/90 dark:bg-darklight/90 backdrop-blur-xl 
          shadow-2xl border-4 border-border dark:border-dark_border 
          overflow-hidden group"
        >
          {/* Glossy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent 
            dark:from-slateGray/40 dark:to-transparent rounded-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative mb-6 text-center lg:text-left animate-fadeInUp">
            <h3 className="text-xl font-bold text-light_text dark:text-dark_text">
              Proven Track Record
            </h3>
            <p className="text-sm text-light_grey dark:text-dark_border">
              XIPHIAS Success vs. Industry Standards
            </p>
          </div>

          {/* Chart */}
          <div className="relative animate-fadeInUp delay-200">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} barCategoryGap="25%">
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    color: "#1e293b",
                  }}
                  labelStyle={{ display: "none" }}
                />
                <defs>
                  {/* Animated Gradient for Industry Avg */}
                  <linearGradient id="gradGray" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#cbd5e1">
                      <animate
                        attributeName="offset"
                        values="0;1;0"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>

                  {/* Animated Gradient for XIPHIAS */}
                  <linearGradient id="gradBlue" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#1c57b4">
                      <animate
                        attributeName="offset"
                        values="0;1;0"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </stop>
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>

                <Bar
                  dataKey="value"
                  radius={[14, 14, 0, 0]}
                  animationDuration={2000}
                  className="transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Industry Avg"
                          ? "url(#gradGray)"
                          : "url(#gradBlue)"
                      }
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
                          x={x + 35}
                          y={y - 8}
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
          <p className="relative text-xs text-light_grey dark:text-dark_border mt-4 text-center lg:text-left animate-fadeInUp delay-300">
            *As of {dateText}. Past performance does not guarantee future outcomes.
          </p>

          {/* ✅ Key Stats with Smooth Animated Counters */}
          <div className="relative grid grid-cols-3 gap-4 sm:gap-6 mt-8 text-center animate-fadeInUp delay-500">
            <div className="space-y-1 hover:scale-105 transition-transform duration-300">
              <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary">
                <Counter end={15} suffix="+" duration={2000} />
              </p>
              <p className="text-xs sm:text-sm text-light_grey dark:text-dark_border">
                Years of Excellence
              </p>
            </div>
            <div className="space-y-1 hover:scale-105 transition-transform duration-300">
              <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary">
                <Counter end={25} suffix="+" duration={2000} />
              </p>
              <p className="text-xs sm:text-sm text-light_grey dark:text-dark_border">
                Global Programs
              </p>
            </div>
            <div className="space-y-1 hover:scale-105 transition-transform duration-300">
              <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary">
                <Counter end={10000} suffix="+" duration={2500} />
              </p>
              <p className="text-xs sm:text-sm text-light_grey dark:text-dark_border">
                Clients Empowered
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
