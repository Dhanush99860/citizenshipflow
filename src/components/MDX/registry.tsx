/**
 * MDX components registry for compileMDX.
 * Exports BOTH named and default `mdxComponents`.
 */

import Section from "./Section";
import Callout from "./Callout";
import ContentImage from "./ContentImage";
import { Steps, Step } from "./Steps";
import { FAQ, FAQItem } from "./FAQ";
import Video from "./Video";

export const mdxComponents = {
  Section,
  Callout,
  ContentImage,
  Steps,
  Step,
  FAQ,
  FAQItem,
  Video,
};

export default mdxComponents;
