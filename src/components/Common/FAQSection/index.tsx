"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import ContactForm from "@/components/ContactForm/index"; // replace with your form

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "What services do you provide?",
    answer:
      "We offer end-to-end solutions including consulting, migration, and business setup services tailored to your needs.",
  },
  {
    question: "How long does the process take?",
    answer:
      "The timeline depends on the specific program or service. Typically, processes range from a few weeks to several months.",
  },
  {
    question: "Do you provide global support?",
    answer:
      "Yes, we work with clients worldwide, offering tailored support across multiple countries and programs.",
  },
  {
    question: "Do you provide global support?",
    answer:
      "Yes, we work with clients worldwide, offering tailored support across multiple countries and programs.",
  },
  {
    question: "Do you provide global support?",
    answer:
      "Yes, we work with clients worldwide, offering tailored support across multiple countries and programs.",
  },
];

export default function FAQWithForm() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(0); // default open first

  // keep first always open when not hovering
  useEffect(() => {
    if (hoverIndex === null) {
      setHoverIndex(0);
    }
  }, [hoverIndex]);

  return (
    <section
      className="max-w-7xl w-full mx-auto py-20 px-4 md:px-6"
      aria-labelledby="faq-heading"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left FAQ */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2
            id="faq-heading"
             className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight mb-8"
          >
            Still got questions? <span className="text-primary">We're here to help.</span>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = hoverIndex === index;
              return (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-colors bg-white dark:bg-gray-900"
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {/* Question */}
                  <div
                    className="flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-10 h-10 text-primary transition-transform duration-300" />
                    ) : (
                      <ChevronDown className="w-10 h-10 text-gray-500 transition-transform duration-300" />
                    )}
                  </div>

                  {/* Answer with motion */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-4 text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
