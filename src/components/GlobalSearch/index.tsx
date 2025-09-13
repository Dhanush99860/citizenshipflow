"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import { searchItems, preloadIndex, debounce } from "@/utils/search";

type Item = { title: string; type: string; url: string };

const popularSuggestions: Item[] = [
  { title: "Canada Startup Visa", type: "Residency",   url: "/residency/canada/startupvisa" },
  { title: "Antigua & Barbuda CBI", type: "Citizenship", url: "/citizenship/antigua-barbuda/program" },
  { title: "Australia Global Talent", type: "Skilled",  url: "/skilled/australia/global-talent" },
  { title: "Singapore EP (Company Setup)", type: "Corporate", url: "/corporate/singapore/ep" },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlighted, setHighlighted] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo<Item[]>(
    () => (query.trim() ? results : popularSuggestions),
    [query, results]
  );

  // Warm the search index only when overlay opens
  useEffect(() => {
    if (open) preloadIndex();
  }, [open]);

  // Debounced "search" when query changes
  useEffect(() => {
    const run = debounce(async () => {
      const q = query.trim();
      if (!q) {
        setResults([]);
        setHighlighted("");
        setActiveIndex(0);
        return;
      }
      const found = await Promise.resolve(searchItems(q)); // searchItems is sync; keep await harmlessly
      setResults(found || []);
      if (found?.length) {
        const match = found[0].title;
        setHighlighted(match.toLowerCase().startsWith(q.toLowerCase()) ? match : "");
      } else {
        setHighlighted("");
      }
      setActiveIndex(0);
    }, 220);

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Autofocus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(allItems.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + Math.max(allItems.length, 1)) % Math.max(allItems.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = allItems[activeIndex];
        if (item) {
          setRecent((prev) => [item.title, ...prev.filter((x) => x !== item.title)].slice(0, 5));
          window.location.href = item.url;
        } else if (highlighted) {
          setQuery(highlighted);
        }
      } else if (e.key === "Tab" && highlighted) {
        e.preventDefault();
        setQuery(highlighted);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, allItems, activeIndex, highlighted]);

  // Outside click close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Lock background scroll
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white dark:text-gray-200 dark:hover:bg-gray-800"
        aria-label="Open search"
      >
        <Search size={20} />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-white/90 dark:bg-black/80 backdrop-blur-xl flex justify-center"
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-red-400 transition"
              aria-label="Close search"
            >
              <X size={32} />
            </button>

            {/* Panel */}
            <motion.div
              ref={overlayRef}
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} transition={{ duration: 0.3 }}
              className="w-full max-w-2xl mt-24 px-4"
            >
              {/* Input + ghost autocomplete */}
              <div className="relative">
                <div className="flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                  <Search className="text-gray-500 dark:text-gray-400" size={22} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by country, visa type, or service..."
                    className="flex-1 bg-transparent px-3 text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                {highlighted && highlighted.toLowerCase() !== query.toLowerCase() && (
                  <span className="absolute left-12 top-3.5 text-lg text-gray-400 pointer-events-none select-none">
                    {highlighted}
                  </span>
                )}
              </div>

              {/* Results */}
              <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[420px] overflow-y-auto">
                {query.trim() === "" && recent.length > 0 && (
                  <div className="px-5 py-3 border-b dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    Recent Searches
                  </div>
                )}

                <div className="text-xs text-gray-400 dark:text-gray-500 m-2 px-2 text-center">
                  ⌨ Type to search — use ↑ ↓ to navigate, <kbd>Enter</kbd> to select, <kbd>Tab</kbd> to autocomplete, <kbd>Esc</kbd> to close
                </div>

                {query.trim() === "" && recent.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-3 border-b dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <Clock size={16} className="text-gray-400" />
                    {item}
                  </div>
                ))}

                {allItems.length > 0 ? (
                  allItems.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      className={`flex items-center justify-between px-5 py-4 border-b last:border-0 border-gray-100 dark:border-gray-700 transition ${
                        i === activeIndex ? "bg-blue-100 dark:bg-gray-800" : "hover:bg-blue-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.type}
                        </div>
                      </div>
                      <ArrowRight className={i === activeIndex ? "text-blue-600" : "text-gray-400"} />
                    </a>
                  ))
                ) : query.trim() !== "" ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                    No results found. Try different keywords.
                  </p>
                ) : null}
              </div>

              {query.trim() === "" && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                  Try: “Canada Startup Visa”, “Citizenship Antigua”, “Global Talent”, “Singapore EP”
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
