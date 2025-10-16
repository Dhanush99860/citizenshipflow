// Auto-generated menu data based on the latest sitemap.
// Only links that exist in the current sitemap are retained.
import type { HeaderItem } from '../menu.types'

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
    label: 'Bulgaria',
    href: '/residency/bulgaria',
    // @ts-ignore
    meta: { code: 'BG' },
    submenu: [
      { label: 'AIF Residency', href: '/residency/bulgaria/bulgaria-aif-residency' },
      { label: 'Government Bonds Residency', href: '/residency/bulgaria/bulgaria-government-bonds-residency' },
      { label: 'Real Estate Residency', href: '/residency/bulgaria/bulgaria-real-estate-residency' },
    ],
  },
  {
    label: 'Canada',
    href: '/residency/canada',
    // @ts-ignore
    meta: { code: 'CA' },
    submenu: [
      { label: 'Startup Visa', href: '/residency/canada/startupvisa' },
    ],
  },
  {
    label: 'Curacao',
    href: '/residency/curacao',
    // @ts-ignore
    meta: { code: 'CW' },
    submenu: [
      { label: '3-Year Active Investor', href: '/residency/curacao/3-year-active-investor' },
      { label: 'Indefinite Investor Residency', href: '/residency/curacao/indefinite-investor-residency' },
    ],
  },
  {
    label: 'Cyprus',
    href: '/residency/cyprus',
    // @ts-ignore
    meta: { code: 'CY' },
    submenu: [
      { label: 'Business Investment', href: '/residency/cyprus/business-investment' },
      { label: 'Commercial Property', href: '/residency/cyprus/commercial-property' },
      { label: 'Fund Investment', href: '/residency/cyprus/fund-investment' },
      { label: 'Residential Property', href: '/residency/cyprus/residential-property' },
    ],
  },
  {
    label: 'Greece',
    href: '/residency/greece',
    // @ts-ignore
    meta: { code: 'GR' },
    submenu: [
      { label: 'Capital Investment', href: '/residency/greece/greece-capital-investment' },
      { label: 'Real Estate Investment', href: '/residency/greece/greece-real-estate-investment' },
    ],
  },
  {
    label: 'Hungary',
    href: '/residency/hungary',
    // @ts-ignore
    meta: { code: 'HU' },
    submenu: [
      { label: 'Donation Public Trust', href: '/residency/hungary/hungary-donation-public-trust' },
      { label: 'Real Estate Fund', href: '/residency/hungary/hungary-real-estate-fund' },
    ],
  },
  {
    label: 'Latvia',
    href: '/residency/latvia',
    // @ts-ignore
    meta: { code: 'LV' },
    submenu: [
      { label: 'Bank Deposit', href: '/residency/latvia/latvia-bank-deposit' },
      { label: 'Business Investment', href: '/residency/latvia/latvia-business-investment' },
      { label: 'Government Bonds', href: '/residency/latvia/latvia-government-bonds' },
      { label: 'Real Estate Investment', href: '/residency/latvia/latvia-real-estate-investment' },
    ],
  },
  {
    label: 'Malta',
    href: '/residency/malta',
    // @ts-ignore
    meta: { code: 'MT' },
    submenu: [
      { label: 'Government Contribution', href: '/residency/malta/malta-government-contribution' },
      { label: 'Property Lease Residency', href: '/residency/malta/malta-property-lease-residency' },
      { label: 'Property Purchase', href: '/residency/malta/malta-property-purchase' },
    ],
  },
  {
    label: 'Monaco',
    href: '/residency/monaco',
    // @ts-ignore
    meta: { code: 'MC' },
    submenu: [
      { label: 'Bank Deposit', href: '/residency/monaco/monaco-residency-bank-deposit' },
      { label: 'Property Investment', href: '/residency/monaco/monaco-residency-property-investment' },
    ],
  },
  {
    label: 'Portugal',
    href: '/residency/portugal',
    // @ts-ignore
    meta: { code: 'PT' },
    submenu: [
      { label: 'Business Investment', href: '/residency/portugal/portugal-business-investment' },
      { label: 'Capital Transfer', href: '/residency/portugal/portugal-capital-transfer' },
    ],
  },
  {
    label: 'Singapore',
    href: '/residency/singapore',
    // @ts-ignore
    meta: { code: 'SG' },
    submenu: [
      { label: 'GIP Business Investment', href: '/residency/singapore/singapore-gip-business-investment' },
      { label: 'GIP Fund Investment', href: '/residency/singapore/singapore-gip-fund-investment' },
      { label: 'GIP SFO Residency', href: '/residency/singapore/singapore-gip-sfo-residency' },
    ],
  },
  {
    label: 'Switzerland',
    href: '/residency/switzerland',
    // @ts-ignore
    meta: { code: 'CH' },
    submenu: [
      { label: 'Business Investment', href: '/residency/switzerland/switzerland-business-investment' },
      { label: 'Lump Sum Tax', href: '/residency/switzerland/switzerland-lump-sum-tax' },
    ],
  },
  {
    label: 'UAE',
    href: '/residency/uae',
    // @ts-ignore
    meta: { code: 'AE' },
    submenu: [
      { label: 'Real Estate', href: '/residency/uae/uae-real-estate' },
      { label: 'Specialized Talent', href: '/residency/uae/uae-specialized-talent' },
    ],
  },
  {
    label: 'USA',
    href: '/residency/usa',
    // @ts-ignore
    meta: { code: 'US' },
    submenu: [
      { label: 'EB-5 Non-Targeted Employment Area', href: '/residency/usa/eb5-non-targeted-employment-area' },
      { label: 'EB-5 Targeted Employment Area', href: '/residency/usa/eb5-targeted-employment-area' },
    ],
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
        submenu: [
          { label: 'Business Investment', href: '/citizenship/antigua-barbuda/business-investment' },
          { label: 'National Development Fund', href: '/citizenship/antigua-barbuda/national-development-fund' },
          { label: 'Real Estate', href: '/citizenship/antigua-barbuda/real-estate' },
        ],
      },
      {
        label: 'Dominica',
        href: '/citizenship/dominica',
        // @ts-ignore
        meta: { code: 'DM' },
        submenu: [
          { label: 'Real Estate', href: '/citizenship/dominica/real-estate' },
          { label: 'Economic Diversification Fund', href: '/citizenship/dominica/economic-diversification-fund' },
        ],
      },
      {
        label: 'Egypt',
        href: '/citizenship/egypt',
        // @ts-ignore
        meta: { code: 'EJ' },
        // @ts-ignore
        badge: { text: 'Fast Track', tone: 'info' },
        submenu: [
          { label: 'Bank Deposit', href: '/citizenship/egypt/bank-deposit' },
          { label: 'Business Investment', href: '/citizenship/egypt/business-investment' },
          { label: 'Donation', href: '/citizenship/egypt/donation' },
          { label: 'Real Estate', href: '/citizenship/egypt/real-estate' },
        ],
      },
      {
        label: 'Grenada',
        href: '/citizenship/grenada',
        // @ts-ignore
        meta: { code: 'GD' },
        submenu: [
          { label: 'Real Estate', href: '/citizenship/grenada/real-estate' },
          { label: 'National Transformation Fund', href: '/citizenship/grenada/national-transformation-fund' },
        ],
      },
      {
        label: 'Nauru',
        href: '/citizenship/nauru',
        // @ts-ignore
        meta: { code: 'NR' },
        submenu: [
          { label: 'Investment', href: '/citizenship/nauru/investment' },
        ],
      },
      {
        label: 'Saint Lucia',
        href: '/citizenship/saint-lucia',
        // @ts-ignore
        meta: { code: 'LC' },
        submenu: [
          { label: 'National Economic Fund', href: '/citizenship/saint-lucia/national-economic-fund' },
          { label: 'Real Estate', href: '/citizenship/saint-lucia/real-estate' },
        ],
      },
      {
        label: 'Saotome',
        href: '/citizenship/saotome',
        // @ts-ignore
        meta: { code: 'ST' },
        submenu: [
          { label: 'NTF', href: '/citizenship/saotome/ntf' },
        ],
      },
      {
        label: 'Saintkitts',
        href: '/citizenship/saintkitts',
        // @ts-ignore
        meta: { code: 'KN' },
        submenu: [
          { label: 'Approved Public Benefit Project', href: '/citizenship/saintkitts/approved-public-benefit-project' },
          { label: 'Real Estate', href: '/citizenship/saintkitts/real-estate' },
          { label: 'Sustainable Island State Contribution', href: '/citizenship/saintkitts/sustainable-island-state-contribution' },
        ],
      },
      {
        label: 'Turkey',
        href: '/citizenship/turkey',
        // @ts-ignore
        meta: { code: 'TR' },
        submenu: [
          { label: 'Bank Deposit', href: '/citizenship/turkey/bank-deposit' },
          { label: 'Business Investment', href: '/citizenship/turkey/business-investment' },
          { label: 'Fund Investment', href: '/citizenship/turkey/fund-investment' },
          { label: 'Government Bonds', href: '/citizenship/turkey/government-bonds' },
          { label: 'Job Creation', href: '/citizenship/turkey/job-creation' },
          { label: 'Real Estate', href: '/citizenship/turkey/real-estate' },
        ],
      },
      {
        label: 'Vanuatu',
        href: '/citizenship/vanuatu',
        // @ts-ignore
        meta: { code: 'VU' },
        submenu: [
          { label: 'VDSP Donation', href: '/citizenship/vanuatu/vdsp-donation' },
        ],
      },
    ],
  },

  // Corporate formation (only countries with valid pages)
  {
    label: 'Corporate',
    href: '/#corporate',
    submenu: [
      {
        label: 'Singapore',
        href: '/corporate/singapore',
        // @ts-ignore
        meta: { code: 'SG' },
        submenu: [
          { label: 'EP – Company Setup', href: '/corporate/singapore/ep' },
        ],
      },
    ],
  },

  // Skilled migration (only countries with valid pages)
  {
    label: 'Skilled',
    href: '/#skilled',
    submenu: [
      {
        label: 'Australia',
        href: '/skilled/australia',
        // @ts-ignore
        meta: { code: 'AU' },
        submenu: [
          { label: 'Global Talent', href: '/skilled/australia/global-talent' },
          { label: 'Skilled Independent 189', href: '/skilled/australia/skilled-independent-189' },
          { label: 'Skilled Nominated 190', href: '/skilled/australia/skilled-nominated-190' },
        ],
      },
      {
        label: 'Canada',
        href: '/skilled/canada',
        // @ts-ignore
        meta: { code: 'CA' },
        submenu: [
          { label: 'Express Entry', href: '/skilled/canada/express-entry' },
          { label: 'Provincial Nominee', href: '/skilled/canada/provincial-nominee' },
        ],
      },
    ],
  },

  // Resources section with available pages from the sitemap
  {
    label: 'Resources',
    href: '/#resources',
    submenu: [
      { label: 'Blog', href: '/blog' },
      { label: 'Insights', href: '/insights' },
      { label: 'Media', href: '/media' },
      { label: 'News', href: '/news' },
    ],
  },

  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];