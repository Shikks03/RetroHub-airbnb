import { BottomBar } from "@/components/chrome/BottomBar";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { primaryUnit as unit } from "@/data/units";

// Step 1: global chrome only. The three sections are placeholders so the
// header, chips and bottom bar have something to track; step 2 fills them.
export default function Home() {
  return (
    <>
      <SiteHeader unit={unit} />

      <main data-unit={unit.theme}>
        <section
          id="intro"
          className="grid min-h-svh place-items-center px-4 text-center"
        >
          <div>
            <p className="font-hand text-2xl text-plum">Introducing</p>
            <h1 className="mt-2 font-display text-6xl text-ink md:text-8xl">
              {unit.name}
            </h1>
            <p className="mt-4 font-hand text-xl text-plum">{unit.tagline}</p>
          </div>
        </section>

        <section
          id="photos"
          aria-labelledby="photos-title"
          className="grid min-h-svh place-items-center bg-paper px-4"
        >
          <h2 id="photos-title" className="font-display text-4xl">
            Photos
          </h2>
        </section>

        <section
          id="book"
          aria-labelledby="book-title"
          className="grid min-h-svh place-items-center px-4"
        >
          <h2 id="book-title" className="font-display text-4xl">
            Book your stay
          </h2>
        </section>
      </main>

      <BottomBar unit={unit} />
    </>
  );
}
