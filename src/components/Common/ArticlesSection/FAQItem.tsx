"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      {/* Question */}
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full text-left text-base font-medium text-gray-900 dark:text-gray-100 focus:outline-none"
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {/* Answer */}
      {open && (
        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
