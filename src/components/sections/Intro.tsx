import type { Unit } from "@/data/units";
import { Polaroid } from "../Polaroid";
import { Sticker } from "../Sticker";

/**
 * Beats (SPEC §4.1) are tagged with data-beat / data-fly for the CSS in
 * globals.css. Without JS, or with reduced motion, this renders as the
 * finished state.
 *
 * Look: the client's cover + profile art. Peach page, fat rainbow ribbons
 * sweeping in from the corners, a sticker-collage polaroid, and a tilted
 * "ticker tape" of facts along the bottom.
 */

// outside → in, same palette as the profile-picture ribbons
const BANDS = ["#D94E3E", "#EA6B31", "#F8C12F", "#A3CDBD", "#72BCC7"];

type Ribbon = { d: string; dx: number; dy: number; w: number };

const RIBBONS = {
  desktop: [
    // top-left corner
    // Both ends are extended in a straight line (same tangent) far past the
    // viewport so every band, however far it's stepped, runs off the screen.
    { d: "M-500 330 L-40 330 C 190 330 330 190 410 -40 L 600 -600", dx: 26, dy: 26, w: 40 },
    // bottom-right corner (bands run inward)
    // ...and keeps going down-left into the next section (viewBox is two screens tall).
    { d: "M2000 410 L1480 470 C 1270 490 1250 720 1030 790 C 880 838 780 880 700 960 L -300 1960", dx: -26, dy: -26, w: 40 },
  ],
  mobile: [
    { d: "M-500 150 L-30 150 C 90 150 150 100 190 -30 L 330 -480", dx: 17, dy: 17, w: 26 },
    { d: "M900 570 L430 610 C 320 620 290 700 220 790 C 200 815 190 830 170 850 L -80 1100", dx: -17, dy: -17, w: 26 },
  ],
} satisfies Record<string, Ribbon[]>;

function Ribbons({ set, viewBox, className }: { set: Ribbon[]; viewBox: string; className: string }) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
      fill="none"
    >
      {set.map((r, ri) =>
        BANDS.map((color, bi) => (
          // Outermost band first; each next band steps inward.
          <path
            key={`${ri}-${bi}`}
            className="ribbon-band"
            style={{ ["--b" as string]: ri * 2 + bi }}
            d={r.d}
            pathLength={1}
            stroke={color}
            strokeWidth={r.w}
            transform={`translate(${r.dx * bi} ${r.dy * bi})`}
          />
        )),
      )}
    </svg>
  );
}

export function Intro({ unit }: { unit: Unit }) {
  const [lead] = unit.photos;
  const tape = [...unit.facts, unit.location, "retro staycation", unit.tagline];

  return (
    <section
      id="intro"
      aria-label={`Introducing ${unit.name}`}
      className="hero relative isolate flex min-h-svh items-center overflow-x-clip px-4 pt-[calc(var(--rh-header-h)+1rem)] pb-28 md:px-8 md:pb-24"
    >
      {/* Back layer: ribbons + halftone are beat 0; stickers fly in at beat 2. */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden md:overflow-visible">
        <Ribbons set={RIBBONS.desktop} viewBox="0 0 1440 1800" className="max-md:hidden md:h-[200%]" />
        <Ribbons set={RIBBONS.mobile} viewBox="0 0 400 800" className="md:hidden" />
        <div className="hero-halftone" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10">
        {unit.introStickers.map((s, i) => (
          <Sticker key={`${s.name}-${i}`} placement={s} index={i} eager fly />
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-6 md:grid-cols-[1.15fr_1fr] md:gap-10">
        <div className="text-center md:text-left">
          <p
            data-beat="introducing"
            className="font-hand text-2xl font-bold text-plum md:text-3xl"
          >
            Introducing
          </p>

          {/* Placeholder wordmark until the client's transparent logo arrives. */}
          <h1 data-beat="logo" className="hero-wordmark mt-2 font-display md:mt-4">
            <span className="hero-the">The</span>
            <span className="hero-name">Retrohub</span>
          </h1>

          <div data-beat="tagline">
            <p className="mt-5 font-hand text-2xl text-plum md:text-3xl">
              {unit.tagline}
            </p>
            <p className="mt-1 text-sm font-bold tracking-wide text-ink/70 uppercase">
              {unit.location}
            </p>
          </div>

          <div
            data-beat="cta"
            className="mx-auto mt-7 grid max-w-sm grid-cols-[3fr_2fr] gap-3 md:mx-0 md:max-w-md"
          >
            <a href={unit.airbnbUrl} target="_blank" rel="noopener" className="btn btn-primary">
              Book on Airbnb
            </a>
            <a href="#photos" className="btn btn-secondary">
              Peek inside ↓
            </a>
          </div>
        </div>

        <div
          data-beat="polaroid"
          className="relative mx-auto w-[min(58vw,300px)] rotate-[2.5deg] md:w-[min(100%,360px,calc((100svh-15rem)*0.75))]"
        >
          {/* Lead photo; its full sticker set appears in the carousel. */}
          <Polaroid photo={lead} index={0} preload withStickers={false} eagerStickers />
        </div>
      </div>

      {/* Ticker tape: the facts, scrolling, like a strip of washi on the page edge. */}
      <div data-beat="tape" aria-hidden className="hero-tape">
        <div className="hero-tape-track">
          {[0, 1].map((n) => (
            <ul key={n} className="hero-tape-set">
              {tape.map((t) => (
                <li key={t}>
                  <span>{t}</span>
                  <span className="hero-tape-dot">✺</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <p className="sr-only">
        {unit.facts.join(", ")}. {unit.location}.
      </p>
    </section>
  );
}
