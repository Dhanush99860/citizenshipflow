// src/components/MDX/registry.tsx
import type { MDXComponents } from "mdx/types";

import Section from "@/components/MDX/Section";
import ContentImage from "@/components/MDX/ContentImage";
import { Steps, Step } from "@/components/MDX/Steps";
import Video from "@/components/MDX/Video";
import FAQSection from "@/components/Insights/FAQSection";

const mdxComponents = {
  Section,
  ContentImage,
  Steps,
  Step,
  Video,
  FAQSection,
} satisfies MDXComponents;

export default mdxComponents;
