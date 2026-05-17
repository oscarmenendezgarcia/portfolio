import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

// T-003: Inter as primary sans-serif, self-hosted at build time — zero CLS, no external font requests
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// T-003: JetBrains Mono as monospace accent
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// T-005: Viewport — themeColor moved from Metadata to Viewport in Next.js 16
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-text-primary min-h-screen flex flex-col">
        {/* Skip-to-content: visible on focus for keyboard users (WCAG 2.1 AA) */}
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>

        {/* Fixed navigation header — 80px height; sections use scroll-margin-top to compensate */}
        <header className="fixed top-0 w-full z-50 h-20 border-b border-border bg-bg/90 backdrop-blur-sm">
          <Navbar />
        </header>

        {/* pt-20 offsets the fixed header so content isn't hidden beneath it */}
        <main id="main" className="flex-1 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
