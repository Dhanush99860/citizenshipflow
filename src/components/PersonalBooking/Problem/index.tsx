"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CounterProps {
  value: number;
  duration?: number; // seconds
}

const Counter = ({ value, duration = 2 }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration * 60); // 60fps
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
    <motion.span
      className="relative font-bold text-5xl md:text-7xl lg:text-8xl 
                 bg-clip-text text-transparent bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80
                 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-white/50 before:to-white/20 before:animate-shine"
    >
      {count.toLocaleString()}
    </motion.span>
  );
};



export default function Problem() {
  const data = [
    { value: 3900, text: "gains missed in ₹10Cr+ portfolios" },
    { value: 72, text: "of portfolios are over-diversified" },
  ];

  return (
    <section className="relative w-full bg-gray-50 dark:bg-gray-900">
  <div className="max-w-7xl mx-auto py-20 px-4">
    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center md:text-left"
    >
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight">
        Lorem ipsum dolor sit{" "}
        <span className="bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text text-transparent">
          amet consectetur
        </span>{" "}
        adipiscing elit
      </h2>

      <p className="mt-4 text-lg md:text-2xl text-gray-600 dark:text-gray-300">
        After analysing 10 lakh portfolios, we found
      </p>
    </motion.div>

    {/* Cards */}
    <div className="mt-16 grid gap-8 md:grid-cols-2">
      {data.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="py-20 px-10 rounded-xl border border-gray-300 dark:border-gray-700 
                     bg-white/20 dark:bg-gray-800/40 backdrop-blur-xl 
                     shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-500"
        >
          <h3 className="mb-3 flex items-center gap-2">
            <Counter value={item.value} duration={1.8} />
            {item.value > 100 ? " Cr+" : "%"}
          </h3>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-2">
            {item.text}
          </p>
        </motion.div>
      ))}
    </div>

    {/* Button */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      viewport={{ once: true }}
      className="flex justify-center md:justify-start mt-10"
    >
      <button
        className="group flex items-center gap-2 text-gray-800 dark:text-gray-200 
                   font-medium text-lg md:text-xl transition-colors hover:text-gray-600 dark:hover:text-gray-400"
      >
        Find out why
        <span className="transition-transform group-hover:translate-x-2">➝</span>
      </button>
    </motion.div>
  </div>
</section>

  );
}
