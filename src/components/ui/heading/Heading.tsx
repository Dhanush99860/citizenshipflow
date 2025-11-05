import * as React from "react";
import { HeadingLevelContext } from "./HeadingContext";

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1|2|3|4|5|6;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Heading({ level, id, className = "", children, ...rest }: HeadingProps) {
  const ctx = React.useContext(HeadingLevelContext);
  const final = Math.min(6, Math.max(1, level ?? ctx)) as 1|2|3|4|5|6;

  type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const Tag = (`h${final}` as HeadingTag);

  // Use createElement to keep TS happy and pass through extra props like itemProp
  return React.createElement(Tag, { id, className, ...rest }, children);
}
