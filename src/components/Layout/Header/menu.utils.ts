// --------------------------------------
// 📁 File: src/components/Layout/Header/menu.utils.ts
// --------------------------------------
export function chunkIntoColumns<T>(items: T[], cols: number): T[][] {
    const out: T[][] = Array.from({ length: cols }, () => []);
    items.forEach((item, i) => out[i % cols].push(item));
    return out;
  }
  
  export function cx(...s: (string | false | null | undefined)[]) {
    return s.filter(Boolean).join(' ');
  }
  
  import type { Badge } from './menu.types';
  export const badgeTone = (tone?: Badge['tone']) =>
    cx(
      'ml-2 rounded-full px-2 py-0.5 text-[11px] leading-none border',
      tone === 'success' && 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700/40',
      tone === 'warning' && 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/40',
      tone === 'danger' && 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-700/40',
      (!tone || tone === 'info') && 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/40',
    );