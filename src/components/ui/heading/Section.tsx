import * as React from "react";
import { Heading } from "./Heading";
import { HeadingLevel } from "./HeadingContext";

type Props = {
  id: string;
  title: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, title, className = "", children }: Props) {
  return (
    <section aria-labelledby={id} className={className}>
      <HeadingLevel>
        <Heading id={id} className="text-2xl font-semibold">{title}</Heading>
        {children}
      </HeadingLevel>
    </section>
  );
}
