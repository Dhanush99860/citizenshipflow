"use client";

import * as React from "react";
import clsx from "clsx";

type Variant = "info" | "success" | "warning" | "danger" | "tip";

const VARIANT: Record<Variant, string> = {
  info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-100 dark:border-blue-800",
  success:
    "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:border-emerald-800",
  warning:
    "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-800",
  danger:
    "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:border-rose-800",
  tip: "bg-violet-50 text-violet-900 border-violet-200 dark:bg-violet-950/40 dark:text-violet-100 dark:border-violet-800",
};

type Props = {
  title?: string;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
};

export default function Callout({ title, variant = "info", className, children }: Props) {
  return (
    <div
      role="note"
      className={clsx("my-4 border rounded-xl p-4 sm:p-5 shadow-sm", VARIANT[variant], className)}
    >
      {title && <div className="mb-2 font-semibold tracking-tight">{title}</div>}
      <div className="text-sm sm:text-base">{children}</div>
    </div>
  );
}
