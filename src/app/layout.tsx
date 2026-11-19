import type { Metadata, Viewport } from "next";
import { DM_Sans, Gaegu, Shrikhand } from "next/font/google";
import "./globals.css";

// Display: closest Google face to the client's heavy 70s logo lettering.
const shrikhand = Shrikhand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shrikhand",
});

// Handwritten captions/notes, echoing the House Rules poster.
// One weight only, and not preloaded, so it never competes with the LCP photo.
const gaegu = Gaegu({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-gaegu",
  preload: false,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const title = "The Retrohub by Kaia · Retro staycation at Shore Residences, Pasay";
const description =
  "A little corner of nostalgia: a 70s-retro private room staycation at Shore Residences, Pasay City. See photos, then check rates and open dates on Airbnb.";

export const metadata: Metadata = {
  // Set SITE_URL in production for absolute OG URLs (Vercel infers it).
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title,
  description,
  openGraph: { title, description, type: "website", locale: "en_PH", siteName: "The Retrohub" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#F8F1DF",
  viewportFit: "cover",
};

/**
 * Runs before first paint: arms the CSS intro reveals, except for reduced
 * motion and /#photos or /#book deep links (those land on the finished
 * intro). The reveals are pure CSS, so nothing can stay hidden if JS fails.
 */
const motionBootstrap = `(function(){try{if(matchMedia("(prefers-reduced-motion: reduce)").matches||/^#(photos|book)$/.test(location.hash))return;document.documentElement.dataset.motion="on"}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // data-motion is set by the bootstrap script before hydration.
      suppressHydrationWarning
      className={`${shrikhand.variable} ${gaegu.variable} ${dmSans.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
