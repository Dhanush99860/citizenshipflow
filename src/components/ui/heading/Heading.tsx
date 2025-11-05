import * as React from "react";
import { HeadingLevelContext } from "./HeadingContext";

type Props = {
  level?: 1|2|3|4|5|6;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Heading({ level, id, className = "", children }: Props) {
  const ctx = React.useContext(HeadingLevelContext);
  const final = Math.min(6, Math.max(1, level ?? ctx)) as 1|2|3|4|5|6;

  type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const Tag = (`h${final}` as HeadingTag);

  // Use createElement to avoid JSX type issues in TS
  return React.createElement(Tag, { id, className }, children);
}
