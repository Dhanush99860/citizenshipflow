import { clsx } from "clsx";


export const badgeTone = (tone?: string) =>
clsx(
"ml-2 rounded-full px-2 py-0.5 text-11 leading-none border",
tone === "success" && "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/50",
tone === "warning" && "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/50",
tone === "danger" && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700/50",
(!tone || tone === "info") && "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/50",
);


export const kbd =
"inline-flex items-center rounded-md border border-gray-300 dark:border-white/20 px-1.5 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-300";


export const prefersReducedMotion = () =>
typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;