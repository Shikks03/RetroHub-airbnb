import { BottomBar } from "@/components/chrome/BottomBar";
import { PageMotion } from "@/components/PageMotion";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";
import { Intro } from "@/components/sections/Intro";
import { Photos } from "@/components/sections/Photos";
import { primaryUnit as unit } from "@/data/units";

/**
 * LodgingBusiness structured data with verified facts only: no price,
 * capacity or rating until the client confirms them (SPEC §8).
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "The Retrohub by Kaia",
  description: `${unit.tagline}: a retro-themed private room staycation at ${unit.location}.`,
  telephone: unit.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shore Residences",
    addressLocality: "Pasay City",
    addressRegion: "Metro Manila",
    postalCode: "1300",
    addressCountry: "PH",
  },
  sameAs: [unit.airbnbUrl],
  amenityFeature: ["Kitchen", "WiFi", "Outdoor pool", "Elevator", "Washer", "Self check-in"].map(
    (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
  ),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so the JSON can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, `${String.fromCharCode(92)}u003c`) }}
      />
      <SiteHeader unit={unit} />
      <main data-unit={unit.theme}>
        <Intro unit={unit} />
        <Photos unit={unit} />
        <Booking unit={unit} />
      </main>
      <Footer unit={unit} />
      <BottomBar unit={unit} />
      <PageMotion />
    </>
  );
}
