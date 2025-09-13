"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";
import { ChevronRight, Circle } from "lucide-react";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const path = usePathname();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSubmenuOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setSubmenuOpen(false), 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main link + arrow */}
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={submenuOpen}
        className={`flex items-center gap-1 text-17 font-medium capitalize relative group 
          ${path === item.href ? "text-primary" : "text-white dark:text-white"}
          focus:outline-none`}
      >
        <Link href={item.href}>{item.label}</Link>
        {item.submenu && (
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              submenuOpen ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Animated Mega Menu */}
      <AnimatePresence>
        {item.submenu && submenuOpen && (
          <motion.div
          key="mega-menu"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-x-0 top-[190px] bg-grey dark:bg-darklight/95 
                     backdrop-blur-md shadow-2xl z-50 
                     overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
          role="menu"
          aria-label={`${item.label} submenu`}
          style={{ maxHeight: "65vh" }}
        >
          {/* ✅ Centered Container */}
          <div className="container mx-auto px-6 md:px-10 py-10">
            <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700">
              {item.submenu.map((sub, i) => (
                <div key={i} className="flex flex-col space-y-4 px-4">
                  {/* ⭐ Level 1 Heading */}
                  <Link
                    href={sub.href}
                    className="text-xl font-semibold text-gray-900 dark:text-white 
                               hover:text-primary transition-colors pb-2 border-b border-gray-200 dark:border-gray-700"
                  >
                    {sub.label}
                  </Link>
        
                  {/* 📌 Level 2 */}
                  {sub.submenu && (
                    <ul className="space-y-3">
                      {sub.submenu.map((child, j) => (
                        <li key={j} className="group">
                          <Link
                            href={child.href}
                            className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300 
                                       hover:text-primary transition-all duration-200"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                            {child.label}
                          </Link>
        
                          {/* 🔹 Level 3 */}
                          {child.submenu && (
                            <ul className="mt-2 space-y-2 pl-6 border-l border-gray-200 dark:border-gray-600">
                              {child.submenu.map((deep, k) => (
                                <li key={k} className="group">
                                  <Link
                                    href={deep.href}
                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 
                                               hover:text-primary transition-all duration-200"
                                  >
                                    <Circle className="w-2 h-2 text-gray-400 group-hover:scale-125 transition-transform" />
                                    {deep.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeaderLink;
