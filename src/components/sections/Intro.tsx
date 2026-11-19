import type { Unit } from "@/data/units";
import { Polaroid } from "../Polaroid";
import { Sticker } from "../Sticker";

/**
 * Beats (SPEC §4.1) are tagged with data-beat / data-fly for PageMotion.
 * Without JS, or with reduced motion, this renders as the finished state.
 */
export function Intro({ unit }: { unit: Unit }) {
  const [lead] = unit.photos;

  return (
    <section
      id="intro"
      aria-label={`Introducing ${unit.name}`}
      className="relative isolate flex min-h-svh items-center overflow-clip px-4 pt-[calc(var(--rh-header-h)+1.25rem)] pb-10 md:px-8"
    >
      {/* Back layer: blobs are part of beat 0; the rest fly in at beat 2. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {unit.introStickers.map((s, i) => (
          <Sticker
            key={`${s.name}-${i}`}
            placement={s}
            index={i}
            eager
            fly={!s.name.startsWith("blob-")}
          />
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
        <div className="text-center md:text-left">
          <p
            data-beat="introducing"
            className="font-hand text-2xl font-bold text-plum md:text-3xl"
          >
            Introducing
          </p>

          <div className="relative mt-1 inline-block md:mt-3">
            {/* Rainbow arch rises behind the wordmark (beat 1). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-beat="arch"
              src="/stickers/rainbow-arch.svg"
              alt=""
              aria-hidden
              width={240}
              height={140}
              className="pointer-events-none absolute bottom-[38%] left-1/2 -z-10 w-[92%] max-w-none -translate-x-1/2 md:left-[46%]"
            />
            {/* Placeholder wordmark until the client's transparent logo arrives. */}
            <h1
              data-beat="logo"
              className="font-display text-[clamp(3.25rem,16vw,7rem)] leading-[0.95] text-ink"
            >
              The
              <br />
              Retrohub
            </h1>
          </div>

          <div data-beat="tagline">
            <p className="mt-3 font-hand text-2xl text-plum md:text-3xl">
              {unit.tagline}
            </p>
            <p className="mt-1 text-sm font-bold tracking-wide text-ink/70 uppercase">
              {unit.location}
            </p>
            <p className="mt-8 hidden font-hand text-xl text-ink/70 md:block">
              scroll for a peek ↓
            </p>
          </div>
        </div>

        <div
          data-beat="polaroid"
          className="mx-auto w-[min(58vw,300px)] md:w-[min(100%,360px)]"
        >
          {/* Lead photo; its full sticker set appears in the carousel. */}
          <Polaroid photo={lead} index={0} preload withStickers={false} eagerStickers />
        </div>
      </div>
    </section>
  );
}
