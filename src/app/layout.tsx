import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { site } from "@/data/site";
import { contactLinks, personalInfo } from "@/lib/portfolio";
import { themeInitScript } from "@/lib/theme-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s · ${personalInfo.name}`,
  },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  authors: [{ name: personalInfo.name }],
  creator: personalInfo.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: site.locale,
    url: "/",
    siteName: personalInfo.name,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
  ],
  colorScheme: "light dark",
};

const sameAs = contactLinks.filter((l) => l.external).map((l) => l.href);

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalInfo.name,
  jobTitle: personalInfo.title,
  url: site.url,
  image: `${site.url}/images/profile.webp`,
  sameAs,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Bahria University Lahore",
  },
  knowsAbout: ["Flutter", "Dart", "iOS", "Android", "Flutter Web"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      // The theme script sets data-theme before hydration.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <noscript>
          {/* Ensure reveal-animated content is visible without JavaScript. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-on-ink"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          {children}
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
