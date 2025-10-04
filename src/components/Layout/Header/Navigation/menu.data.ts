// FILE: src/components/Layout/Header/menu.data.ts
// (ONE file used by both desktop and mobile)
import type { HeaderItem } from '../menu.types';

/**
 * Flags:
 * - MegaPanel shows a flag if you add `meta.code` (ISO-2) or `meta.iconEmoji`.
 * - Omit `meta` to show plain text without a flag.
 * - Example below shows 🇨🇦 for Canada using ISO-2 code.
 */

const residencyCountries: HeaderItem[] = [
  {
    label: 'Argentina',
    href: '/residency/argentina',
    submenu: [
      { label: 'Investor Visa', href: '/residency/argentina/investor-visa' },
      { label: 'Entrepreneur Path', href: '/residency/argentina/entrepreneur' },
    ],
  },
  {
    label: 'Australia',
    href: '/residency/australia',
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
    submenu: [{ label: 'Residency by Investment', href: '/residency/austria/investment' }],
  },
  {
    label: 'Bulgaria',
    href: '/residency/bulgaria',
    submenu: [{ label: 'Residency by Investment', href: '/residency/bulgaria/investment' }],
  },
  {
    label: 'Canada',
    href: '/residency/canada',
    // ✅ Show 🇨🇦 flag
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
    submenu: [{ label: 'Golden Visa', href: '/residency/cyprus/golden-visa' }],
  },
  {
    label: 'France',
    href: '/residency/france',
    submenu: [
      { label: 'Business Creation', href: '/residency/france/business-creation' },
      { label: 'Business Investment', href: '/residency/france/business-investment' },
    ],
  },
  {
    label: 'Greece',
    href: '/residency/greece',
    submenu: [{ label: 'Golden Visa', href: '/residency/greece/golden-visa' }],
  },
  {
    label: 'Hungary',
    href: '/residency/hungary',
    submenu: [{ label: 'Guest Investor Visa', href: '/residency/hungary/guest-investor' }],
  },
  {
    label: 'Italy',
    href: '/residency/italy',
    submenu: [{ label: 'Italian Golden Visa', href: '/residency/italy/golden-visa' }],
  },
  {
    label: 'Luxembourg',
    href: '/residency/luxembourg',
    submenu: [{ label: 'Residence by Investment', href: '/residency/luxembourg/investment' }],
  },
  {
    label: 'Malta',
    href: '/residency/malta',
    submenu: [{ label: 'Permanent Residence Programme', href: '/residency/malta/permanent-residence' }],
  },
  {
    label: 'Portugal',
    href: '/residency/portugal',
    submenu: [
      { label: 'Golden Visa', href: '/residency/portugal/golden-visa' },
      { label: 'D7 Visa', href: '/residency/portugal/d7' },
      { label: 'D9 Visa', href: '/residency/portugal/d9' },
    ],
  },
  {
    label: 'Singapore',
    href: '/residency/singapore',
    submenu: [
      { label: 'Global Investor Programme', href: '/residency/singapore/global-investor' },
      { label: 'Family Office', href: '/residency/singapore/family-office' },
    ],
  },
  {
    label: 'Spain',
    href: '/residency/spain',
    submenu: [{ label: 'Non-Lucrative Visa', href: '/residency/spain/non-lucrative' }],
  },
  {
    label: 'Switzerland',
    href: '/residency/switzerland',
    submenu: [{ label: 'Residency by Investment', href: '/residency/switzerland/investment' }],
  },
  {
    label: 'UAE',
    href: '/residency/uae',
    submenu: [{ label: 'Golden Visa', href: '/residency/uae/golden-visa' }],
  },
  {
    label: 'USA',
    href: '/residency/usa',
    submenu: [{ label: 'EB-5 Program', href: '/residency/usa/eb5' }],
  },
  // Add more countries up to ~50 as needed. Add meta.code/iconEmoji for flags.
];

export const headerMenu: HeaderItem[] = [
  { label: 'Home', href: '/#main-banner' },
  { label: 'Residency', href: '/#residency', badge: { text: 'Popular', tone: 'success' }, submenu: residencyCountries },
  {
    label: 'Citizenship',
    href: '/#citizenship',
    submenu: [
      {
        label: 'Antigua & Barbuda',
        href: '/citizenship/antigua-barbuda',
        submenu: [{ label: 'CBI Program', href: '/citizenship/antigua-barbuda/program' }],
      },
      { label: 'Dominica', href: '/citizenship/dominica', submenu: [{ label: 'CBI Program', href: '/citizenship/dominica/program' }] },
      { label: 'St. Kitts & Nevis', href: '/citizenship/st-kitts-nevis', submenu: [{ label: 'CBI Program', href: '/citizenship/st-kitts-nevis/program' }] },
      { label: 'Türkiye', href: '/citizenship/turkiye', submenu: [{ label: 'CBI Program', href: '/citizenship/turkiye/program' }] },
      { label: 'Vanuatu', href: '/citizenship/vanuatu', submenu: [{ label: 'CBI Program', href: '/citizenship/vanuatu/program' }] },
    ],
  },
  {
    label: 'Corporate',
    href: '/#corporate',
    submenu: [
      {
        label: 'UAE',
        href: '/corporate/uae',
        submenu: [
          { label: 'FTZ – Company Setup', href: '/corporate/uae/ftz' },
          { label: 'Mainland – Setup', href: '/corporate/uae/mainland' },
          { label: 'Offshore – Setup', href: '/corporate/uae/offshore' },
        ],
      },
      {
        label: 'Singapore',
        href: '/corporate/singapore',
        submenu: [
          { label: 'EP – Company Setup', href: '/corporate/singapore/ep' },
          { label: 'GIP – Company Setup', href: '/corporate/singapore/global-investor' },
        ],
      },
    ],
  },
  {
    label: 'Skilled',
    href: '/#skilled',
    submenu: [
      {
        label: 'USA',
        href: '/skilled/usa',
        submenu: [
          { label: 'EB1A Extraordinary', href: '/skilled/usa/eb1a' },
          { label: 'EB2 NIW', href: '/skilled/usa/eb2-niw' },
          { label: 'H1B', href: '/skilled/usa/h1b' },
        ],
      },
      {
        label: 'UK',
        href: '/skilled/uk',
        submenu: [
          { label: 'Global Talent', href: '/skilled/uk/global-talent' },
          { label: 'Expansion Worker', href: '/skilled/uk/expansion-worker' },
        ],
      },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
