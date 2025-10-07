'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeaderItem, SubmenuItem } from '../menu.types';

type AccordionProps = {
  open: boolean;
  id: string;
  reduced: boolean;
  children: React.ReactNode;
};

const Accordion = ({ open, id, reduced, children }: AccordionProps) => {
  const variants = { collapsed: { height: 0, opacity: 0 }, open: { height: 'auto', opacity: 1 } } as const;
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key={id}
          id={id}
          role="region"
          aria-labelledby={`${id}-label`}
          className="overflow-hidden"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          transition={reduced ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
          variants={variants}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);
  return reduced;
}

type NodeProps = {
  item: SubmenuItem;
  depth: number;
  closeMenuAction?: () => void;
};

const Node = ({ item, depth, closeMenuAction }: NodeProps) => {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const hasKids = Array.isArray(item.submenu) && item.submenu.length > 0;

  const id = React.useId();
  const padLeft = Math.min(16 + depth * 14, 48);

  const firstChildRef = React.useRef<HTMLAnchorElement>(null);
  React.useEffect(() => {
    if (!open || !hasKids) return;
    const t = setTimeout(() => firstChildRef.current?.focus(), reduced ? 0 : 160);
    return () => clearTimeout(t);
  }, [open, hasKids, reduced]);

  const toggle = () => setOpen((s) => !s);
  const collapse = () => setOpen(false);
  const expand = () => setOpen(true);

  const onChevronKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); expand(); }
    else if (e.key === 'ArrowLeft' || e.key === 'Escape') { e.preventDefault(); collapse(); }
  };

  return (
    <li className="list-none border-b border-zinc-200 last:border-0 dark:border-white/10">
      <div className="flex items-stretch justify-between" style={{ paddingLeft: padLeft, paddingRight: 12 }}>
        <Link
          id={`${id}-label`}
          href={item.href}
          className="flex min-h-[46px] flex-1 items-center py-2 text-[15px] text-zinc-900 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-zinc-100"
          onClick={() => closeMenuAction?.()}
        >
          <span className="truncate">{item.label}</span>
        </Link>

        {hasKids && (
          <button
            type="button"
            aria-controls={`${id}-panel`}
            aria-expanded={open}
            onClick={toggle}
            onKeyDown={onChevronKey}
            className="ml-1.5 inline-flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-lg text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-zinc-200 dark:hover:bg-white/10"
          >
            <svg className={`h-5 w-5 transition-transform ${open ? '-rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0l-4.25-4.4a.75.75 0 01.02-1.06z" />
            </svg>
            <span className="sr-only">{open ? 'Collapse' : 'Expand'}</span>
          </button>
        )}
      </div>

      {hasKids && (
        <Accordion open={open} id={`${id}-panel`} reduced={useReducedMotion()}>
          <ul className="pb-2">
            {item.submenu!.map((child, i) => (
              <Node key={`${child.label}-${i}`} item={child} depth={depth + 1} closeMenuAction={closeMenuAction} />
            ))}
          </ul>
          <span aria-live="polite" className="sr-only">
            {item.label} {open ? 'expanded' : 'collapsed'}.
          </span>
        </Accordion>
      )}
    </li>
  );
};

export default function MobileHeaderLink({ item, closeMenuAction }: { item: HeaderItem; closeMenuAction?: () => void }) {
  return (
    <ul role="list" className="m-0 p-0">
      <Node item={item} depth={0} closeMenuAction={closeMenuAction} />
    </ul>
  );
}
