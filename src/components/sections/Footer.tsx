import type { Unit } from "@/data/units";

export function Footer({ unit }: { unit: Unit }) {
  const link = "inline-flex min-h-11 items-center underline decoration-2 underline-offset-4";

  return (
    <footer className="border-t-2 border-ink/10 px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-ink/80 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl text-ink">{unit.name}</p>
          <p>{unit.location}</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 font-bold text-ink">
          <li>
            <a href={unit.airbnbUrl} target="_blank" rel="noopener" className={link}>
              Airbnb
            </a>
          </li>
          <li>
            <a href={unit.messengerUrl} target="_blank" rel="noopener" className={link}>
              Messenger
            </a>
          </li>
          <li>
            <a href={`tel:${unit.phone}`} className={link}>
              {unit.phoneDisplay}
            </a>
          </li>
        </ul>
        {/* Keep only if the client wants it (SPEC §4.4). */}
        <p>Photos © {unit.name}</p>
      </div>
    </footer>
  );
}
