import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  {
    label: "Home",
    href: "/#main-banner",
  },
  {
    label: "Residency",
    href: "/#residency",
    submenu: [
      { label: "Argentina", href: "/residency/argentina", submenu: [{ label: "Argentina Investor Visa", href: "/residency/argentina/investor-visa" }] },
      { label: "Australia", href: "/residency/australia", submenu: [{ label: "Australia National Innovation Visa", href: "/residency/australia/innovation-visa" }, { label: "186 Employer Nomination Scheme", href: "/residency/australia/186" }, { label: "187 Regional Sponsored Scheme", href: "/residency/australia/187" }, { label: "189 Skill Independent", href: "/residency/australia/189" }, { label: "190 Skill Nominee", href: "/residency/australia/190" }, { label: "482 Temporary Skill Shortage", href: "/residency/australia/482" }] },
      { label: "Austria", href: "/residency/austria", submenu: [{ label: "Austria Residency By Investment", href: "/residency/austria/investment" }] },
      { label: "Bulgaria", href: "/residency/bulgaria", submenu: [{ label: "Bulgaria Residency By Investment", href: "/residency/bulgaria/investment" }] },
      { label: "Canada", href: "/residency/canada", submenu: [
          { label: "PNP (Entrepreneur Stream)", href: "/residency/canada/pnp" },
          { label: "Quebec Immigration", href: "/residency/canada/quebec" },
          { label: "Self Employed Visa", href: "/residency/canada/self-employed" },
          { label: "C11", href: "/residency/canada/c11" },
        ]
      },
      { label: "Cayman Island", href: "/residency/cayman-island", submenu: [{ label: "Cayman Island Investor Visa", href: "/residency/cayman-island/investor-visa" }] },
      { label: "Costa Rica", href: "/residency/costa-rica", submenu: [{ label: "Costa Rica Residence by Investment Program", href: "/residency/costa-rica/investment" }] },
      { label: "Curacao", href: "/residency/curacao", submenu: [{ label: "Curacao Investor Visa", href: "/residency/curacao/investor-visa" }] },
      { label: "Cyprus", href: "/residency/cyprus", submenu: [{ label: "Cyprus Golden Visa", href: "/residency/cyprus/golden-visa" }] },
      { label: "Greece", href: "/residency/greece", submenu: [{ label: "Greece Golden Visa", href: "/residency/greece/golden-visa" }] },
      { label: "France", href: "/residency/france", submenu: [
          { label: "Talent Passport Visa: Business Creation and Start-up", href: "/residency/france/business-creation" },
          { label: "Talent Passport Visa: Business Investment", href: "/residency/france/business-investment" },
        ]
      },
      { label: "Hong Kong", href: "/residency/hong-kong", submenu: [{ label: "Hong Kong Residence by Investment", href: "/residency/hong-kong/investment" }] },
      { label: "Hungary", href: "/residency/hungary", submenu: [{ label: "Hungary Guest Investor Visa", href: "/residency/hungary/guest-investor" }] },
      { label: "Italy", href: "/residency/italy", submenu: [{ label: "Italian Golden Visa", href: "/residency/italy/golden-visa" }] },
      { label: "Latvia", href: "/residency/latvia", submenu: [{ label: "Latvia Residence by Investment Program", href: "/residency/latvia/investment" }] },
      { label: "Luxembourg", href: "/residency/luxembourg", submenu: [{ label: "Luxembourg Residence by Investment Program", href: "/residency/luxembourg/investment" }] },
      { label: "Malaysia", href: "/residency/malaysia", submenu: [{ label: "Malaysia M2H Visa", href: "/residency/malaysia/m2h" }] },
      { label: "Malta", href: "/residency/malta", submenu: [{ label: "Malta Permanent Residence Programme", href: "/residency/malta/permanent-residence" }] },
      { label: "Mauritius", href: "/residency/mauritius", submenu: [{ label: "Mauritius Residence by Investment Program", href: "/residency/mauritius/investment" }] },
      { label: "Monaco", href: "/residency/monaco", submenu: [{ label: "Monaco Legal Residency Visa", href: "/residency/monaco/legal-residency" }] },
      { label: "Montenegro", href: "/residency/montenegro", submenu: [{ label: "Montenegro Residency By Investment", href: "/residency/montenegro/investment" }] },
      { label: "Namibia", href: "/residency/namibia", submenu: [{ label: "Namibia Residency By Investment", href: "/residency/namibia/investment" }] },
      { label: "New Zealand", href: "/residency/new-zealand", submenu: [{ label: "New Zealand Active Investor Plus Visa Program", href: "/residency/new-zealand/active-investor" }] },
      { label: "Panama", href: "/residency/panama", submenu: [{ label: "Panama Business Investor Visa", href: "/residency/panama/investor" }] },
      { label: "Portugal", href: "/residency/portugal", submenu: [
          { label: "Portugal Golden Visa", href: "/residency/portugal/golden-visa" },
          { label: "Portugal D7 Visa", href: "/residency/portugal/d7" },
          { label: "Portugal D9 Visa", href: "/residency/portugal/d9" },
        ]
      },
      { label: "Philippines", href: "/residency/philippines", submenu: [{ label: "Philippines Special Resident Retiree's Visa", href: "/residency/philippines/srrv" }] },
      { label: "Serbia", href: "/residency/serbia", submenu: [{ label: "Residency By Investment", href: "/residency/serbia/investment" }] },
      { label: "Singapore", href: "/residency/singapore", submenu: [
          { label: "Singapore Global Investor Program", href: "/residency/singapore/global-investor" },
          { label: "Singapore Family Office", href: "/residency/singapore/family-office" },
        ]
      },
      { label: "Spain", href: "/residency/spain", submenu: [{ label: "Non Lucrative Visa", href: "/residency/spain/non-lucrative" }] },
      { label: "Switzerland", href: "/residency/switzerland", submenu: [{ label: "Switzerland Residency By Investment", href: "/residency/switzerland/investment" }] },
      { label: "Thailand", href: "/residency/thailand", submenu: [{ label: "Thai Residence By Investment", href: "/residency/thailand/investment" }] },
      { label: "UAE", href: "/residency/uae", submenu: [{ label: "UAE Golden Visa", href: "/residency/uae/golden-visa" }] },
      { label: "United Kingdom", href: "/residency/uk", submenu: [{ label: "UK Innovator Founder Program", href: "/residency/uk/innovator" }] },
      { label: "United States of America", href: "/residency/usa", submenu: [{ label: "USA EB-5 Program", href: "/residency/usa/eb5" }] },
      { label: "Uruguay", href: "/residency/uruguay", submenu: [{ label: "Uruguay Residency By Investment", href: "/residency/uruguay/investment" }] },
    ],
  },
  {
    label: "Citizenship",
    href: "/#citizenship",
    submenu: [
      { label: "Antigua & Barbuda", href: "/citizenship/antigua-barbuda", submenu: [{ label: "Citizenship by Investment Program", href: "/citizenship/antigua-barbuda/program" }] },
      { label: "Austria", href: "/citizenship/austria", submenu: [{ label: "Austria Citizenship by Investment", href: "/citizenship/austria/program" }] },
      { label: "Dominica", href: "/citizenship/dominica", submenu: [{ label: "Dominica Citizenship By Investment", href: "/citizenship/dominica/program" }] },
      { label: "Egypt", href: "/citizenship/egypt", submenu: [{ label: "Egypt Citizenship By Investment", href: "/citizenship/egypt/program" }] },
      { label: "Grenada", href: "/citizenship/grenada", submenu: [{ label: "Grenada CBI", href: "/citizenship/grenada/program" }] },
      { label: "Nauru", href: "/citizenship/nauru", submenu: [{ label: "Nauru Economic and Climate Resilience Citizenship Program", href: "/citizenship/nauru/program" }] },
      { label: "North Macedonia", href: "/citizenship/north-macedonia", submenu: [{ label: "North Macedonia Citizenship by Investment Program", href: "/citizenship/north-macedonia/program" }] },
      { label: "St. Kitts & Nevis", href: "/citizenship/st-kitts-nevis", submenu: [{ label: "St. Kitts and Nevis Citizenship by Investment", href: "/citizenship/st-kitts-nevis/program" }] },
      { label: "St. Lucia", href: "/citizenship/st-lucia", submenu: [{ label: "St. Lucia Citizenship By Investment Program", href: "/citizenship/st-lucia/program" }] },
      { label: "Turkiye", href: "/citizenship/turkiye", submenu: [{ label: "Turkiye Citizenship By Investment Program", href: "/citizenship/turkiye/program" }] },
      { label: "Vanuatu", href: "/citizenship/vanuatu", submenu: [{ label: "Vanuatu Citizenship By Investment", href: "/citizenship/vanuatu/program" }] },
    ],
  },
  {
    label: "Skilled",
    href: "/#skilled",
    submenu: [
      { label: "Australia", href: "/skilled/australia", submenu: [
          { label: "Global Talent Visa", href: "/skilled/australia/global-talent" },
          { label: "187 Regional Sponsored Scheme", href: "/skilled/australia/187" },
          { label: "189 Skill Independant", href: "/skilled/australia/189" },
          { label: "190 Skill Nominee", href: "/skilled/australia/190" },
          { label: "482 Temporary Skill Shortage", href: "/skilled/australia/482" },
        ]
      },
      { label: "Canada", href: "/skilled/canada", submenu: [
          { label: "Express Entry Program", href: "/skilled/canada/express-entry" },
          { label: "Global Talent Visa", href: "/skilled/canada/global-talent" },
          { label: "Provincial Nominee Program", href: "/skilled/canada/provincial-nominee" },
          { label: "Federal Skilled Trade Program", href: "/skilled/canada/federal-skilled-trade" },
          { label: "Canadian Express Class", href: "/skilled/canada/express-class" },
          { label: "Super Visa/Spouse Visa", href: "/skilled/canada/super-spouse" },
        ]
      },
      { label: "USA", href: "/skilled/usa", submenu: [
          { label: "E2 Visa", href: "/skilled/usa/e2" },
          { label: "EB1 A - Extraordinary Ability", href: "/skilled/usa/eb1a" },
          { label: "EB1 B - Outstanding Professor & Researchers", href: "/skilled/usa/eb1b" },
          { label: "EB1 C - Multinational Executives", href: "/skilled/usa/eb1c" },
          { label: "EB2 Visa - National Interest Waiver (NIW)", href: "/skilled/usa/eb2-niw" },
          { label: "EB3 Visa", href: "/skilled/usa/eb3" },
          { label: "H1B Visa", href: "/skilled/usa/h1b" },
          { label: "O-1 Visa: Individuals with Extraordinary Ability or Achievement", href: "/skilled/usa/o1" },
          { label: "K1 & K2 Visa", href: "/skilled/usa/k1-k2" },
          { label: "J1 Visa", href: "/skilled/usa/j1" },
          { label: "Spousal Visa", href: "/skilled/usa/spousal" },
        ]
      },
      { label: "Europe", href: "/skilled/europe", submenu: [{ label: "Digital Nomad Visa", href: "/skilled/europe/digital-nomad" }] },
      { label: "UK", href: "/skilled/uk", submenu: [{ label: "Global Talent Visa", href: "/skilled/uk/global-talent" }, { label: "Expansion Worker Visa", href: "/skilled/uk/expansion-worker" }] },
      { label: "Portugal", href: "/skilled/portugal", submenu: [{ label: "Portugal HQA (D3 Visa)", href: "/skilled/portugal/hqa-d3" }] },
    ],
  },
  {
    label: "Corporate",
    href: "/#corporate",
    submenu: [
      { label: "Australia", href: "/corporate/australia", submenu: [{ label: "Australia – Company Setup", href: "/corporate/australia/setup" }] },
      { label: "Bulgaria", href: "/corporate/bulgaria", submenu: [{ label: "Bulgaria – Company Setup", href: "/corporate/bulgaria/setup" }] },
      { label: "Canada", href: "/corporate/canada", submenu: [{ label: "Canada – ICT", href: "/corporate/canada/ict" }] },
      { label: "Cayman Island", href: "/corporate/cayman-island", submenu: [{ label: "Cayman Islands – Company Setup", href: "/corporate/cayman-island/setup" }] },
      { label: "Cyprus", href: "/corporate/cyprus", submenu: [{ label: "Cyprus – Company Setup", href: "/corporate/cyprus/setup" }] },
      { label: "Hong Kong", href: "/corporate/hong-kong", submenu: [{ label: "Hong-Kong – Company Setup", href: "/corporate/hong-kong/setup" }] },
      { label: "Ireland", href: "/corporate/ireland", submenu: [{ label: "Ireland – Company Setup", href: "/corporate/ireland/setup" }] },
      { label: "Malaysia", href: "/corporate/malaysia", submenu: [{ label: "Malaysia – Company Setup", href: "/corporate/malaysia/setup" }] },
      { label: "New Zealand", href: "/corporate/new-zealand", submenu: [{ label: "New Zealand – Company Setup", href: "/corporate/new-zealand/setup" }] },
      { label: "Portugal", href: "/corporate/portugal", submenu: [{ label: "Portugal – D2 Visa", href: "/corporate/portugal/d2" }] },
      { label: "Singapore", href: "/corporate/singapore", submenu: [
          { label: "Singapore – EP – Company Setup", href: "/corporate/singapore/ep" },
          { label: "Singapore – Global Investor Program – Company Setup", href: "/corporate/singapore/global-investor" },
        ]
      },
      { label: "Spain", href: "/corporate/spain", submenu: [{ label: "Spain – Company Setup", href: "/corporate/spain/setup" }] },
      { label: "UAE", href: "/corporate/uae", submenu: [
          { label: "FTZ – Company Setup", href: "/corporate/uae/ftz" },
          { label: "Mainland – Company Setup", href: "/corporate/uae/mainland" },
          { label: "Offshore – Company Setup", href: "/corporate/uae/offshore" },
        ]
      },
      { label: "UK", href: "/corporate/uk", submenu: [{ label: "Self Sponsorship Visa", href: "/corporate/uk/self-sponsorship" }] },
      { label: "Uruguay", href: "/corporate/uruguay", submenu: [{ label: "Uruguay – Company Setup", href: "/corporate/uruguay/setup" }] },
      { label: "USA", href: "/corporate/usa", submenu: [{ label: "Intra Company Transfer L1 Visa", href: "/corporate/usa/l1" }] },
    ],
  },

  { label: "About", href: "/documentation#version" },
  { label: "Contact", href: "/documentation#version" },
];
