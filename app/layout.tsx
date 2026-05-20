import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// T-005: Viewport — themeColor moved from Metadata to Viewport in Next.js 16
export const viewport: Viewport = {
  themeColor: "#F7F5F0",
};

// T-005: Base metadata — Next.js merges this with per-route overrides via the template
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    url: site.url,
    title: site.name,
    description: site.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable}`}
    >
      <body className="bg-bg text-text-primary min-h-screen flex flex-col">
        {/* Skip-to-content: visible on focus for keyboard users (WCAG 2.1 AA) */}
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>

        {/* Fixed navigation header — 64px mobile / 80px desktop; sections compensate via scroll-margin-top */}
        <header className="fixed top-0 w-full z-50 h-16 md:h-20 bg-bg/90 backdrop-blur-sm">
          <Navbar />
        </header>

        {/* pt-16/pt-20 offsets the fixed header so content isn't hidden beneath it */}
        <main id="main" className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
