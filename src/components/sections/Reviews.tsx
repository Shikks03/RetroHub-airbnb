import type { GuestReview, Unit } from "@/data/units";
import { Ribbons, RIBBONS } from "../Ribbons";
import { Sticker } from "../Sticker";

const TILTS = [-2.5, 1.5, -1];
const ACCENT: Record<GuestReview["accent"], string> = {
  mustard: "bg-mustard",
  sky: "bg-sky",
  sage: "bg-sage",
};

function Stars() {
  return (
    <p aria-label="5 out of 5 stars" className="text-xl leading-none tracking-[0.15em] text-orange">
      <span aria-hidden>★★★★★</span>
    </p>
  );
}

/**
 * Real guest quotes from the Airbnb listing (never invented, SPEC §2).
 * No background of its own: the page canvas shows through, a ribbon picks up
 * where Photos ends, and a ticker tape straddles the seam into Booking.
 */
export function Reviews({ unit }: { unit: Unit }) {
  const { rating, reviews } = unit;
  if (reviews.length === 0) return null;

  const tape = Array.from({ length: 4 }, () =>
    rating ? `★ ${rating.value.toFixed(1)} on Airbnb · ${rating.count} reviews` : "guest love",
  );

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="relative isolate overflow-x-clip px-4 pt-16 pb-24 md:flex md:min-h-svh md:flex-col md:justify-center md:px-8 md:pt-(--rh-header-h) md:pb-16"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <Ribbons set={RIBBONS.reviews} viewBox="0 0 1440 900" className="max-md:hidden" />
      </div>
      {/* Phones: the ribbon starts 100px up inside Photos' empty bottom gap, so it
          flows in from the previous section instead of beginning at this one's edge. */}
      <div aria-hidden className="absolute inset-x-0 -top-[100px] bottom-0 -z-10 md:hidden">
        <Ribbons set={RIBBONS.reviewsMobile} viewBox="0 0 390 1240" className="" />
      </div>

      <div className="mx-auto max-w-6xl text-center md:text-left">
        <p className="font-hand text-2xl font-bold text-plum">straight from our guests</p>
        <h2
          id="reviews-title"
          className="font-display text-[clamp(2.25rem,min(9vw,8svh),3.75rem)] leading-none text-ink"
        >
          Kind words
        </h2>
        {rating && (
          <p className="mt-3 text-sm font-bold text-ink/70">
            <span aria-hidden className="text-orange">★ </span>
            {rating.value.toFixed(1)} on Airbnb · {rating.count} reviews
          </p>
        )}
      </div>

      <div className="relative mx-auto mt-10 w-full max-w-6xl md:mt-[min(3rem,5svh)]">
        <Sticker placement={{ name: "sparkle", x: 3, y: -4, size: 48 }} index={2} className="z-10" />
        <Sticker placement={{ name: "daisy-smiley-pink", x: 98, y: 4, size: 72, rotate: 12, desktopOnly: true }} index={3} className="z-10" />
        <Sticker placement={{ name: "star", x: 94, y: 104, size: 52, rotate: -10 }} index={4} className="z-10" />

        <ul className="grid gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">
          {reviews.map((r, i) => (
            <li key={r.name} className="relative" style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}>
              <figure className="relative flex h-full flex-col rounded-[14px] border-[3px] border-ink bg-paper p-6 shadow-card md:p-7">
                <span
                  aria-hidden
                  className={`absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 border-2 border-ink/70 opacity-90 ${ACCENT[r.accent]}`}
                />
                <Stars />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink md:text-base">
                  <p>“{r.text}”</p>
                </blockquote>
                <figcaption className="mt-5 flex items-baseline justify-between gap-3 border-t-2 border-dashed border-ink/20 pt-3">
                  <span className="font-hand text-2xl leading-none font-bold text-plum">{r.name}</span>
                  <span className="text-xs font-bold tracking-wide text-ink/60 uppercase">via Airbnb</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center md:mt-10">
          <a
            href={unit.airbnbUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center font-bold text-ink underline decoration-orange decoration-4 underline-offset-[6px]"
          >
            Read them all on Airbnb ↗
          </a>
        </p>
      </div>

      {/* Tape across the seam into Booking, echoing the intro's. */}
      <div aria-hidden className="hero-tape hero-tape--seam">
        <div className="hero-tape-track">
          {[0, 1].map((n) => (
            <ul key={n} className="hero-tape-set">
              {tape.map((t, i) => (
                <li key={i}>
                  <span>{t}</span>
                  <span className="hero-tape-dot">✺</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
