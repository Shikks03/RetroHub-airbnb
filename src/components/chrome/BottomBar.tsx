"use client";

import type { Unit } from "@/data/units";
import { useIntroPassed } from "./hooks";

/** Mobile-only thumb-reach CTAs, hidden during the intro (SPEC §4.0). */
export function BottomBar({ unit }: { unit: Unit }) {
  const visible = useIntroPassed();

  return (
    <>
      <nav
        aria-label="Book or message"
        data-visible={visible}
        inert={!visible}
        className="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t-2 border-ink/10 bg-cream/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out data-[visible=true]:translate-y-0 motion-reduce:transition-none md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-[3fr_2fr] gap-3">
          <a
            href={unit.airbnbUrl}
            target="_blank"
            rel="noopener"
            className="btn btn-primary"
          >
            Book on Airbnb
          </a>
          <a
            href={unit.messengerUrl}
            target="_blank"
            rel="noopener"
            className="btn btn-secondary"
          >
            Message
          </a>
        </div>
      </nav>
      {/* Keeps the end of the page clear of the fixed bar on phones. */}
      <div
        aria-hidden
        className="h-[calc(var(--rh-bar-h)+env(safe-area-inset-bottom))] md:hidden"
      />
    </>
  );
}
