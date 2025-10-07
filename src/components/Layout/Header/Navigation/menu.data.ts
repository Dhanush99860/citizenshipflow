// FILE: src/components/Layout/Header/menu.data.ts
// (ONE file used by both desktop and mobile)
import type { HeaderItem } from '../menu.types';

/**
 * Notes:
 * - MegaPanel shows a flag if you add `meta.code` (ISO-2) or `meta.iconEmoji`.
 * - Keep labels concise; use badges to draw attention; avoid over-linking.
 * - For items with `meta`, we keep the existing `// @ts-ignore` to match your current types.
 */

// ---------------------------
// Residency (countries)
// ---------------------------
const residencyCountries: HeaderItem[] = [
  {
    label: 'Argentina',
    href: '/residency/argentina',
    // @ts-ignore
    meta: { code: 'AR' },
    submenu: [
      { label: 'Investor Visa', href: '/residency/argentina/investor-visa' },
      { label: 'Entrepreneur Path', href: '/residency/argentina/entrepreneur' },
    ],
  },
  {
    label: 'Australia',
    href: '/residency/australia',
    // @ts-ignore
    meta: { code: 'AU' },
    submenu: [
      { label: 'Innovation Visa', href: '/residency/australia/innovation-visa' },
      { label: '186 ENS', href: '/residency/australia/186' },
      { label: '189 Skilled Independent', href: '/residency/australia/189' },
      { label: '190 Skilled Nominee', href: '/residency/australia/190' },
      { label: '482 TSS', href: '/residency/australia/482' },
    ],
  },
  {
    label: 'Austria',
    href: '/residency/austria',
    // @ts-ignore
    meta: { code: 'AT' },
    submenu: [{ label: 'Residency by Investment', href: '/residency/austria/investment' }],
  },
  {
    label: 'Bulgaria',
    href: '/residency/bulgaria',
    // @ts-ignore
    meta: { code: 'BG' },
    submenu: [{ label: 'Residency by Investment', href: '/residency/bulgaria/investment' }],
  },
  {
    label: 'Canada',
    href: '/residency/canada',
    // @ts-ignore
    meta: { code: 'CA' },
    submenu: [
      { label: 'PNP (Entrepreneur)', href: '/residency/canada/pnp' },
      { label: 'Quebec', href: '/residency/canada/quebec' },
      { label: 'Self Employed', href: '/residency/canada/self-employed' },
      { label: 'C11', href: '/residency/canada/c11' },
    ],
  },
  {
    label: 'Cyprus',
    href: '/residency/cyprus',
    // @ts-ignore
    meta: { code: 'CY' },
    submenu: [{ label: 'Golden Visa', href: '/residency/cyprus/golden-visa' }],
  },
  {
    label: 'France',
    href: '/residency/france',
    // @ts-ignore
    meta: { code: 'FR' },
    submenu: [
      { label: 'Business Creation', href: '/residency/france/business-creation' },
      { label: 'Business Investment', href: '/residency/france/business-investment' },
    ],
  },
  {
    label: 'Greece',
    href: '/residency/greece',
    // @ts-ignore
    meta: { code: 'GR' },
    submenu: [{ label: 'Golden Visa', href: '/residency/greece/golden-visa' }],
  },
  {
    label: 'Hungary',
    href: '/residency/hungary',
    // @ts-ignore
    meta: { code: 'HU' },
    submenu: [{ label: 'Guest Investor Visa', href: '/residency/hungary/guest-investor' }],
  },
  {
    label: 'Italy',
    href: '/residency/italy',
    // @ts-ignore
    meta: { code: 'IT' },
    submenu: [{ label: 'Italian Golden Visa', href: '/residency/italy/golden-visa' }],
  },
  {
    label: 'Luxembourg',
    href: '/residency/luxembourg',
    // @ts-ignore
    meta: { code: 'LU' },
    submenu: [{ label: 'Residence by Investment', href: '/residency/luxembourg/investment' }],
  },
  {
    label: 'Malta',
    href: '/residency/malta',
    // @ts-ignore
    meta: { code: 'MT' },
    submenu: [{ label: 'Permanent Residence Programme', href: '/residency/malta/permanent-residence' }],
  },
  {
    label: 'Portugal',
    href: '/residency/portugal',
    // @ts-ignore
    meta: { code: 'PT' },
    // @ts-ignore – badge supported by your MenuNode
    badge: { text: 'Popular', tone: 'success' },
    submenu: [
      { label: 'Golden Visa', href: '/residency/portugal/golden-visa' },
      { label: 'D7 Visa', href: '/residency/portugal/d7' },
      { label: 'D9 Tech Visa', href: '/residency/portugal/d9' },
    ],
  },
  {
    label: 'Singapore',
    href: '/residency/singapore',
    // @ts-ignore
    meta: { code: 'SG' },
    submenu: [
      { label: 'Global Investor Programme', href: '/residency/singapore/global-investor' },
      { label: 'Family Office', href: '/residency/singapore/family-office' },
    ],
  },
  {
    label: 'Spain',
    href: '/residency/spain',
    // @ts-ignore
    meta: { code: 'ES' },
    submenu: [{ label: 'Non-Lucrative Visa', href: '/residency/spain/non-lucrative' }],
  },
  {
    label: 'Switzerland',
    href: '/residency/switzerland',
    // @ts-ignore
    meta: { code: 'CH' },
    submenu: [{ label: 'Residency by Investment', href: '/residency/switzerland/investment' }],
  },
  {
    label: 'UAE',
    href: '/residency/uae',
    // @ts-ignore
    meta: { code: 'AE' },
    submenu: [{ label: 'Golden Visa', href: '/residency/uae/golden-visa' }],
  },
  {
    label: 'USA',
    href: '/residency/usa',
    // @ts-ignore
    meta: { code: 'US' },
    submenu: [{ label: 'EB-5 Program', href: '/residency/usa/eb5' }],
  },
];

// ---------------------------
// Top-level header menu
// ---------------------------
export const headerMenu: HeaderItem[] = [
  { label: 'Home', href: '/#main-banner' },

  // Residency (flag-rich list)
  {
    label: 'Residency',
    href: '/#residency',
    badge: { text: 'Popular', tone: 'success' },
    submenu: residencyCountries,
  },

  // Citizenship by investment
  {
    label: 'Citizenship',
    href: '/#citizenship',
    submenu: [
      {
        label: 'Antigua & Barbuda',
        href: '/citizenship/antigua-barbuda',
        // @ts-ignore
        meta: { code: 'AG' },
        submenu: [{ label: 'CBI Program', href: '/citizenship/antigua-barbuda/program' }],
      },
      {
        label: 'Dominica',
        href: '/citizenship/dominica',
        // @ts-ignore
        meta: { code: 'DM' },
        submenu: [{ label: 'CBI Program', href: '/citizenship/dominica/program' }],
      },
      {
        label: 'St. Kitts & Nevis',
        href: '/citizenship/st-kitts-nevis',
        // @ts-ignore
        meta: { code: 'KN' },
        // @ts-ignore
        badge: { text: 'Fast Track', tone: 'info' },
        submenu: [{ label: 'CBI Program', href: '/citizenship/st-kitts-nevis/program' }],
      },
      {
        label: 'Türkiye',
        href: '/citizenship/turkiye',
        // @ts-ignore
        meta: { code: 'TR' },
        submenu: [{ label: 'CBI Program', href: '/citizenship/turkiye/program' }],
      },
      {
        label: 'Vanuatu',
        href: '/citizenship/vanuatu',
        // @ts-ignore
        meta: { code: 'VU' },
        submenu: [{ label: 'CBI Program', href: '/citizenship/vanuatu/program' }],
      },
    ],
  },

  // Corporate formation
  {
    label: 'Corporate',
    href: '/#corporate',
    submenu: [
      {
        label: 'UAE',
        href: '/corporate/uae',
        // @ts-ignore
        meta: { code: 'AE' },
        submenu: [
          { label: 'FTZ – Company Setup', href: '/corporate/uae/ftz' },
          { label: 'Mainland – Setup', href: '/corporate/uae/mainland' },
          { label: 'Offshore – Setup', href: '/corporate/uae/offshore' },
        ],
      },
      {
        label: 'Singapore',
        href: '/corporate/singapore',
        // @ts-ignore
        meta: { code: 'SG' },
        submenu: [
          { label: 'EP – Company Setup', href: '/corporate/singapore/ep' },
          { label: 'GIP – Company Setup', href: '/corporate/singapore/global-investor' },
        ],
      },
      {
        label: 'Switzerland',
        href: '/corporate/switzerland',
        // @ts-ignore
        meta: { code: 'CH' },
        submenu: [
          { label: 'Holding Company', href: '/corporate/switzerland/holding' },
          { label: 'Trading Company', href: '/corporate/switzerland/trading' },
        ],
      },
    ],
  },

  // Skilled migration
  {
    label: 'Skilled',
    href: '/#skilled',
    submenu: [
      {
        label: 'USA',
        href: '/skilled/usa',
        // @ts-ignore
        meta: { code: 'US' },
        submenu: [
          { label: 'EB1A Extraordinary', href: '/skilled/usa/eb1a' },
          { label: 'EB2 NIW', href: '/skilled/usa/eb2-niw' },
          { label: 'H1B', href: '/skilled/usa/h1b' },
        ],
      },
      {
        label: 'UK',
        href: '/skilled/uk',
        // @ts-ignore
        meta: { code: 'GB' },
        submenu: [
          { label: 'Global Talent', href: '/skilled/uk/global-talent' },
          { label: 'Expansion Worker', href: '/skilled/uk/expansion-worker' },
        ],
      },
      {
        label: 'Canada',
        href: '/skilled/canada',
        // @ts-ignore
        meta: { code: 'CA' },
        submenu: [
          { label: 'Express Entry', href: '/skilled/canada/express-entry' },
          { label: 'Provincial Nominee', href: '/skilled/canada/pnp' },
        ],
      },
    ],
  },

  // Resources (new) — helpful for HNIs/B2B/consumers
  {
    label: 'Resources',
    href: '/#resources',
    submenu: [
      { label: 'Pricing & Fees', href: '/resources/pricing' },
      { label: 'Case Studies', href: '/resources/case-studies' },
      { label: 'Guides & Playbooks', href: '/resources/guides' },
      { label: 'Webinars & Events', href: '/resources/webinars' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/resources/faq' },
    ],
  },

  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
