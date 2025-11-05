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
  const final = Math.min(6, Math.max(1, level ?? ctx));
  const Tag = `h${final}` as keyof JSX.IntrinsicElements;
  return <Tag id={id} className={className}>{children}</Tag>;
}
