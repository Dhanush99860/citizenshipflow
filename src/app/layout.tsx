// src/app/layout.tsx
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
// import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import MDXProviders from "@/components/Common/ArticlesSection/MDXProviders";
import { Inter, Sora } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

const font = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

// ---- SEO: site-wide defaults (can be overridden per page) ----
export const metadata: Metadata = {
  metadataBase: new URL("https://www.xiphiasimmigration.com"),
  title: {
    default: "XIPHIAS Immigration – Residency, Citizenship & Global Mobility",
    template: "%s | XIPHIAS Immigration",
  },
  description:
    "Trusted advisors for Residency by Investment, Citizenship by Investment, Skilled Immigration, and Corporate Mobility across 25+ countries.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "XIPHIAS Immigration",
    description:
      "Residency & Citizenship solutions for high-net-worth individuals and global enterprises.",
    url: "https://www.xiphiasimmigration.com",
    siteName: "XIPHIAS Immigration",
    locale: "en_US",
    type: "website",
    images: ["/og.jpg"], // put 1200x630 image at /public/og.jpg
  },
  twitter: {
    card: "summary_large_image",
    title: "XIPHIAS Immigration",
    description:
      "Residency & Citizenship solutions for HNWIs and enterprises.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Inline JSON-LD (Organization + LegalService)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LegalService"],
    name: "XIPHIAS Immigration",
    url: "https://www.xiphiasimmigration.com",
    areaServed: "Worldwide",
    serviceType: ["Residency", "Citizenship", "Skilled", "Corporate"],
    logo: "https://www.xiphiasimmigration.com/logo.png", // update if different
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preconnect improves font load */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      // src/app/layout.tsx
      <body className={`${font.className} antialiased pt-14 lg:pt-20`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      
          <Aoscompo>
            <MDXProviders>{children}</MDXProviders>
            <Footer />
            <ScrollToTop />
          </Aoscompo>
        </ThemeProvider>
      </body>

    </html>
  );
}
