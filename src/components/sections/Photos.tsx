import type { Unit } from "@/data/units";
import { Polaroid } from "../Polaroid";
import { CarouselControls } from "./CarouselControls";

const TRACK_ID = "photos-track";

export function Photos({ unit }: { unit: Unit }) {
  const count = unit.photos.length;

  return (
    <section
      id="photos"
      aria-labelledby="photos-title"
      className="relative py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 text-center md:px-8 md:text-left">
        <p className="font-hand text-2xl font-bold text-plum">come on in</p>
        <h2
          id="photos-title"
          className="font-display text-[clamp(2.25rem,9vw,3.75rem)] leading-none text-ink"
        >
          Take a peek inside
        </h2>
      </div>

      {/* Scroller is focusable so arrow keys scroll it; buttons below do too. */}
      <div
        id={TRACK_ID}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Photos of ${unit.name}`}
        tabIndex={0}
        className="no-scrollbar mt-4 snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:mt-6 md:scroll-px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
      >
        <ul className="flex w-max gap-5 px-[calc((100vw-min(76vw,340px))/2)] py-12 md:gap-10 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          {unit.photos.map((photo, i) => (
            <li
              key={photo.caption}
              aria-label={`${i + 1} of ${count}`}
              aria-roledescription="slide"
              className="w-[min(76vw,340px)] shrink-0 snap-center md:w-[calc((min(100vw,72rem)-4rem-5rem)/3)] md:snap-start"
            >
              <Polaroid photo={photo} index={i} />
            </li>
          ))}
        </ul>
      </div>

      <CarouselControls trackId={TRACK_ID} count={count} />
    </section>
  );
}
