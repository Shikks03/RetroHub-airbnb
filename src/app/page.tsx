import { BottomBar } from "@/components/chrome/BottomBar";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";
import { Intro } from "@/components/sections/Intro";
import { Photos } from "@/components/sections/Photos";
import { primaryUnit as unit } from "@/data/units";

export default function Home() {
  return (
    <>
      <SiteHeader unit={unit} />
      <main data-unit={unit.theme}>
        <Intro unit={unit} />
        <Photos unit={unit} />
        <Booking unit={unit} />
      </main>
      <Footer unit={unit} />
      <BottomBar unit={unit} />
    </>
  );
}
