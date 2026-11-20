"use client";

import { SECTIONS, type Unit } from "@/data/units";
import { useActiveSection, useHideOnScroll, useIntroPassed } from "./hooks";

const sectionIds = SECTIONS.map((s) => s.id);

export function SiteHeader({ unit }: { unit: Unit }) {
  const [hidden, setHidden] = useHideOnScroll();
  const introPassed = useIntroPassed();
  const active = useActiveSection(sectionIds);

  return (
    <header
      data-hidden={hidden}
      // Keyboard users tabbing into a hidden header bring it back.
      onFocusCapture={() => setHidden(false)}
      className={`fixed inset-x-0 top-0 z-40 transition-[transform,background-color] duration-300 ease-out data-[hidden=true]:-translate-y-full motion-reduce:transition-none ${
        // Transparent over the hero so the rainbow runs to the top edge.
        introPassed ? "bg-cream/95" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-(--rh-header-h) max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        {/* Placeholder wordmark until the client sends a transparent logo (SPEC §3). */}
        <a
          href="#intro"
          className="font-display text-2xl leading-none text-ink md:text-[1.75rem]"
        >
          {unit.name}
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border-2 border-ink/15 bg-paper p-1">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold text-ink/70 transition-colors hover:text-ink aria-[current=true]:bg-mustard aria-[current=true]:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* On phones the bottom bar takes over booking once the intro is passed. */}
        <a
          href={unit.airbnbUrl}
          target="_blank"
          rel="noopener"
          className={`btn btn-primary ${introPassed ? "max-md:hidden" : ""}`}
        >
          Book now
        </a>
      </div>
    </header>
  );
}
