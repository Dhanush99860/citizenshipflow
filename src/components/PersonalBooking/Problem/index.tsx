"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, Users } from "lucide-react";

interface CounterProps {
  value: number;
  duration?: number;
}

/**
 * Counter component animates numbers up to a target value.
 */
const Counter = ({ value, duration = 2 }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration * 60); // assume 60fps
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <span
      className="font-extrabold text-5xl md:text-6xl lg:text-7xl 
                 bg-clip-text text-transparent 
                 bg-gradient-to-r from-primary via-primary/80 to-primary/60"
    >
      {count.toLocaleString()}
    </span>
  );
};

/**
 * WhyConsultation — Explains why booking a consultation is vital.
 */
export default function WhyConsultation() {
  const data = [
    {
      value: 80,
      suffix: "%",
      text: "of self‑guided applicants face delays or rejection",
      icon: AlertTriangle,
    },
    {
      value: 95,
      suffix: "%",
      text: "of our clients secure residency or citizenship on their first application",
      icon: CheckCircle,
    },
    {
      value: 10000,
      suffix: "+",
      text: "clients empowered by our expert guidance",
      icon: Users,
    },
  ];

  return (
    <section className="relative w-full bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Heading & description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center md:text-left"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-800 dark:text-slate-100 leading-tight">
            Why Consultation{" "}
            <span className="bg-gradient-to-r from-primary/70 to-primary bg-clip-text text-transparent">
              Matters
            </span>
          </h2>
          <p className="mt-4 text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl">
            Navigating immigration laws and investment programs is complex. Self‑guided attempts
            often lead to costly mistakes, delays, or rejection. Here’s why expert guidance is crucial.
          </p>
        </motion.div>

        {/* Statistic cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {data.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-10 rounded-2xl border border-slate-200/80 dark:border-slate-700/60
                           bg-white/40 dark:bg-slate-800/40 backdrop-blur-md shadow-xl
                           transition hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon className="w-8 h-8 text-primary" />
                  <div className="flex items-baseline gap-1">
                    <Counter value={item.value} duration={1.8} />
                    <span className="font-extrabold text-3xl md:text-4xl lg:text-5xl text-primary">
                      {item.suffix}
                    </span>
                  </div>
                </div>
                <p className="text-base md:text-lg text-slate-700 dark:text-slate-300">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center md:justify-start mt-10"
        >
          <Link
            href="/contact"
            className="group flex items-center gap-2 text-primary font-medium text-lg md:text-xl
                       hover:text-primary/80 transition-colors"
          >
            Book Your Consultation
            <span className="transition-transform group-hover:translate-x-2">➝</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
