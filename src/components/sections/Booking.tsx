import type { Unit } from "@/data/units";
import { Sticker } from "../Sticker";
import { Disclosure } from "./Disclosure";

function formatReadOn(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pb-4 pl-1">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Booking({ unit }: { unit: Unit }) {
  return (
    <section
      id="book"
      aria-labelledby="book-title"
      className="relative overflow-x-clip px-4 py-16 md:py-24"
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="font-hand text-2xl font-bold text-plum">ready when you are</p>
        <h2
          id="book-title"
          className="font-display text-[clamp(2.25rem,9vw,3.75rem)] leading-none text-ink"
        >
          Book your stay
        </h2>
      </div>

      <div className="relative mx-auto mt-20 max-w-xl md:mt-24">
        {/* Stickers hug the card's edges, away from price and button text. */}
        <Sticker placement={{ name: "key", x: 8, y: 1, size: 76, rotate: -24 }} index={1} className="z-10" />
        <Sticker placement={{ name: "badge-round", x: 90, y: -2, size: 88, rotate: 10 }} index={2} className="z-10">
          <span className="absolute inset-0 grid place-items-center text-center font-display text-[13px] leading-[1.05] text-ink md:text-[17px]">
            Book
            <br />
            now
          </span>
        </Sticker>
        <Sticker placement={{ name: "cassette", x: 92, y: 98, size: 84, rotate: 8 }} index={3} className="z-10" />
        <Sticker placement={{ name: "sparkle", x: 2, y: 62, size: 44 }} index={4} className="z-10" />
        <Sticker placement={{ name: "tag-label", x: -6, y: 36, size: 96, rotate: -6, desktopOnly: true }} index={5} className="z-10">
          <span className="absolute inset-0 flex -rotate-8 flex-col items-center justify-center pb-[6%] font-display text-[15px] leading-[1.45] text-ink">
            <span>10/10</span>
            <span>vibes</span>
          </span>
        </Sticker>

        <div className="relative rounded-[20px] border-[3px] border-ink bg-paper px-5 pt-8 pb-6 shadow-card md:px-10 md:pt-10">
          <div className="text-center">
            {unit.price === null ? (
              <a
                href={unit.airbnbUrl}
                target="_blank"
                rel="noopener"
                className="inline-block font-display text-[1.6rem] leading-tight text-ink underline decoration-orange decoration-4 underline-offset-[6px] md:text-3xl"
              >
                See rates and open dates on Airbnb
              </a>
            ) : (
              <p className="font-display text-3xl text-ink">
                from ₱{unit.price.toLocaleString("en-PH")}{" "}
                <span className="font-sans text-base font-bold">/ night</span>
              </p>
            )}

            <ul className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm font-bold text-ink/80">
              {unit.facts.map((fact, i) => (
                <li key={fact} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>·</span>}
                  {fact}
                </li>
              ))}
            </ul>

            {unit.rating && (
              <p className="mt-2 text-sm text-ink/70">
                <span aria-hidden>★ </span>
                {unit.rating.value.toFixed(1)} on Airbnb ({unit.rating.count} reviews) · as of{" "}
                {formatReadOn(unit.rating.readOn)}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={unit.airbnbUrl} target="_blank" rel="noopener" className="btn btn-primary sm:col-span-2">
              Book on Airbnb
            </a>
            <a href={unit.messengerUrl} target="_blank" rel="noopener" className="btn btn-secondary">
              Message us
            </a>
            <a
              href={`tel:${unit.phone}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full font-bold text-ink underline decoration-2 underline-offset-4"
            >
              Call {unit.phoneDisplay}
            </a>
          </div>

          <div className="mt-8">
            <h3 className="font-hand text-2xl font-bold text-plum">Good to know</h3>
            <div className="mt-2">
              <List items={unit.goodToKnow} />
            </div>
          </div>

          <div className="mt-2">
            <Disclosure title="House rules">
              <List items={unit.houseRules} />
            </Disclosure>
            <Disclosure title="Before you check out">
              <List items={unit.checkout} />
            </Disclosure>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t-2 border-ink/10 pt-4">
            <p>
              <span className="font-bold">Where:</span> {unit.location}
            </p>
            <a
              href={unit.mapsUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center font-bold text-ink underline decoration-2 underline-offset-4"
            >
              Open in Maps ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
