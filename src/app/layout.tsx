// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Lato, Inter, Sora } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import MDXProviders from "@/components/MDX/MDXProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700", "900"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.xiphiasimmigration.com"),
  applicationName: "XIPHIAS Immigration",
  generator: "Next.js",
  title: {
    default: "XIPHIAS Immigration – Residency, Citizenship & Global Mobility",
    template: "%s | XIPHIAS Immigration",
  },
  description:
    "Trusted advisors for Residency by Investment, Citizenship by Investment, Skilled Immigration, and Corporate Mobility across 25+ countries.",
  // Global robots (page-level can override)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "en-IN": "/",
    },
  },
  openGraph: {
    title: "XIPHIAS Immigration",
    description:
      "Residency & Citizenship solutions for high-net-worth individuals and global enterprises.",
    url: "https://www.xiphiasimmigration.com",
    siteName: "XIPHIAS Immigration",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "XIPHIAS Immigration – Residency & Citizenship by Investment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XIPHIAS Immigration",
    description: "Residency & Citizenship solutions for HNWIs and enterprises.",
    images: ["/og.jpg"],
    creator: "@xiphiasimmig",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/site.webmanifest", rel: "manifest" },
      { url: "/icons/safari-pinned-tab.svg", rel: "mask-icon", color: "#0f3a84" },
    ],
  },
  appleWebApp: {
    title: "XIPHIAS Immigration",
    statusBarStyle: "default",
    capable: true,
  },
};

// ✅ Move viewport + themeColor into dedicated export to remove warnings
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ---------- JSON-LD (Organization + Sitelinks Search) ----------
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LegalService"],
    name: "XIPHIAS Immigration",
    url: "https://www.xiphiasimmigration.com",
    logo: "https://www.xiphiasimmigration.com/logo.png",
    sameAs: [
      "https://www.linkedin.com/company/xiphias",
      "https://www.facebook.com/xiphias",
      "https://www.instagram.com/xiphias",
      "https://www.youtube.com/",
      "https://twitter.com/xiphiasimmig",
    ],
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Aurbis Prime, 11, Kaveri Regent Coronet, 80 Feet Road, 3rd Block, Koramangala",
      addressLocality: "Bengaluru",
      addressRegion: "KA",
      postalCode: "560034",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91 90194 00500",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    serviceType: ["Residency", "Citizenship", "Skilled", "Corporate"],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.xiphiasimmigration.com",
    name: "XIPHIAS Immigration",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.xiphiasimmigration.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${lato.className} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Performance: font preconnects */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Security/UX */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>

      <body className="antialiased">
        {/* Accessible skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-black focus:text-white focus:px-3 focus:py-2"
        >
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Aoscompo>
            <MDXProviders>
              {/* Ensure pages put their main content inside <main id="main"> */}
              {children}
            </MDXProviders>
            <Footer />
            <ScrollToTop />
          </Aoscompo>
        </ThemeProvider>

        {/* JSON-LD (inline) */}
        <script
          id="org-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
