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
const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "The Retrohub by Kaia · Retro staycation at Shore Residences, Pasay",
  description:
    "A little corner of nostalgia: a 70s-retro private room staycation at Shore Residences, Pasay City. See photos, then check rates and open dates on Airbnb.",
};

export const viewport: Viewport = {
  themeColor: "#F8F1DF",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${shrikhand.variable} ${gaegu.variable} ${dmSans.variable} antialiased`}
    >
      <body className="min-h-svh">{children}</body>
    </html>
  );
}
