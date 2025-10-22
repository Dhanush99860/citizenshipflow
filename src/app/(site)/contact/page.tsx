// ============================
// src/app/(site)/contact/page.tsx
// ============================
import type { Metadata } from "next";
import Script from "next/script";

// Existing blocks
import ContactHero from "@/components/Contact/ContactHero";
import LocationsShowcase, { type Region, type Office } from "@/components/Contact/LocationsShowcase";

// New composables
import ContactChannels from "@/components/Contact/ContactChannels";
import LeadTabs from "@/components/Contact/LeadTabs";
import MapCard from "@/components/Contact/MapCard";
import FAQ from "@/components/Contact/FAQ";

import TrustBar, {
  BadgeIcon,
  AwardIcon,
  UsersIcon,
  GlobeIcon,
} from "@/components/Contact/TrustBar";

export const metadata: Metadata = {
  title: "Contact XIPHIAS | Speak to an Immigration Expert",
  description:
    "Talk to our licensed immigration experts. Call, WhatsApp, email, or book a callback. Bengaluru HQ with India, UAE and Canada presence.",
  alternates: { canonical: "/contact" },
};

/* ------------------------------- content cfg ------------------------------ */
const CONTACT = {
  headline: "Talk to an Immigration Expert",
  sub: "Fast, discreet, compliant. Choose the channel you prefer.",
  phonePrimary: "+91 90194 00500",
  phoneAlt: "+91 80105 00200",
  email: "immigration@xiphias.in",
  whatsapp: "+91 90194 00500",
  address: [
    "XIPHIAS IMMIGRATION PVT LTD",
    "Aurbis Prime, 11, Kaveri Regent Coronet",
    "80 Feet Rd, 3rd Block, Koramangala, Bengaluru 560034",
  ],
  hours: "Mon–Fri • 9:00–18:00 IST",
  responseNote: "No obligation · Response within 24 hours",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/xiphias" },
    { label: "Facebook", href: "https://www.facebook.com/xiphias" },
    { label: "Instagram", href: "https://www.instagram.com/xiphias" },
    { label: "YouTube", href: "https://www.youtube.com/" },
  ],
} as const;

const REGIONS: Region[] = [
  { key: "india", label: "India" },
  { key: "uae", label: "UAE" },
  { key: "canada", label: "Canada" },
  { key: "europe", label: "Europe" },
];

const OFFICES: Office[] = [
  {
    id: "blr",
    city: "Bengaluru",
    regionKey: "india",
    regionLabel: "India",
    address: [
      "XIPHIAS IMMIGRATION PVT LTD",
      "Aurbis Prime, 11, Kaveri Regent Coronet",
      "80 Feet Road, 3rd Block, Koramangala, 560034",
    ],
    phone: "+91 90194 00500, +91 80105 00200",
    email: "immigration@xiphias.in",
    mapQuery: "Aurbis Prime, 80 Feet Road, 3rd Block Koramangala, Bengaluru 560034",
    heroImage: "/images/offices/blr.jpg",
  },
  {
    id: "ggn",
    city: "Gurugram",
    regionKey: "india",
    regionLabel: "India",
    address: [
      "XIPHIAS IMMIGRATION PVT LTD",
      "Augusta Point, Golf Course Rd, near Parsvnath Exotica",
      "DLF Phase 5, Sector 53, Gurugram, Haryana 122002",
    ],
    phone: "+91 96675 20211",
    email: "Gurgaon@xiphias.in",
    heroImage: "/images/offices/ggn.jpg",
  },
];

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      {/* ------------------------------ hero ------------------------------ */}
      <ContactHero
        headline={CONTACT.headline}
        sub={CONTACT.sub}
        phone={CONTACT.phonePrimary}
        email={CONTACT.email}
        whatsapp={CONTACT.whatsapp}
        responseNote={CONTACT.responseNote}
        ctaHref="#enquiry"
        ctaLabel="Make an enquiry"
        stats={[
          { value: "24h", label: "Average response" },
          { value: "15+", label: "Years experience" },
          { value: "30K+", label: "Consultations" },
        ]}
      />

      {/* --------------------------- trust signals -------------------------- */}
      <TrustBar
        className="mt-6"
        items={[
          { label: "RCIC • MARA", sub: "Accredited", icon: <BadgeIcon /> },
          { label: "4.8★", sub: "1,000+ reviews", icon: <AwardIcon /> },
          { label: "Secure", sub: "PCI / UPI", icon: <GlobeIcon /> },
          { label: "Global", sub: "India · UAE · Canada", icon: <UsersIcon /> },
        ]}
      />

      {/* --------------------- channels + enquiry tabs --------------------- */}
      <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_.85fr]">
        <section>
          <LeadTabs id="enquiry" emailTo={CONTACT.email} phoneFallback={CONTACT.phonePrimary} />
        </section>

        <aside>
          <ContactChannels
            phone={CONTACT.phonePrimary}
            altPhone={CONTACT.phoneAlt}
            email={CONTACT.email}
            whatsapp={CONTACT.whatsapp}
            address={[...CONTACT.address]}   
            hours={CONTACT.hours}
            socials={[...CONTACT.socials]}   
            className="md:sticky md:top-6"
          />

          {/* Generic, reusable map card */}
          <MapCard
            className="mt-6"
            title="Bengaluru HQ"
            query="Aurbis Prime, 80 Feet Road, 3rd Block Koramangala, Bengaluru 560034"
            address={[...CONTACT.address]} 
            height={320}
            zoom={14}
          />
        </aside>
      </div>

      {/* ------------------------------ offices ----------------------------- */}
      <LocationsShowcase
        className="mt-10"
        offices={OFFICES}
        regions={REGIONS}
        defaultRegion="india"
        showBengaluruMap={false}
        title="Worldwide locations"
        subtitle="Find your nearest office and get directions."
      />

      {/* -------------------------------- FAQ -------------------------------- */}
      <FAQ className="mt-10" items={DEFAULT_FAQ} />

      {/* --------------------------- structured data -------------------------- */}
      <Script id="contact-jsonld" type="application/ld+json">
        {JSON.stringify(buildContactJsonLd(CONTACT))}
      </Script>
    </main>
  );
}

const DEFAULT_FAQ = [
  {
    q: "How quickly will you respond?",
    a: "We aim to respond within one business day (usually within a few hours during Mon–Fri, 9:00–18:00 IST).",
  },
  {
    q: "Do you offer virtual consultations?",
    a: "Yes. Phone, WhatsApp, and video consultations are available by appointment.",
  },
  {
    q: "What should I include in my enquiry?",
    a: "Your target country, visa category (if known), current location, and a brief summary of your situation help us route you to the right expert.",
  },
  {
    q: "Where is your head office?",
    a: "Bengaluru (Koramangala). We also have presence in Gurugram, and international desks in the UAE and Canada.",
  },
];

function buildContactJsonLd(cfg: typeof CONTACT) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "XIPHIAS Immigration",
    url: "https://www.xiphias.in/contact",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: cfg.phonePrimary,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: cfg.address[1],
      addressLocality: "Bengaluru",
      postalCode: "560034",
      addressCountry: "IN",
    },
    sameAs: cfg.socials.map((s) => s.href),
  };
}
