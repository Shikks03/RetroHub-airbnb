"use client";

import { useId, useState, type ReactNode } from "react";

/** Collapsible row, closed by default (SPEC §4.3, §8). */
export function Disclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-t-2 border-ink/10">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left font-bold text-ink"
        >
          {title}
          <span
            aria-hidden
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink text-lg leading-none transition-transform duration-300 motion-reduce:transition-none"
            style={{ rotate: open ? "45deg" : "0deg" }}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        inert={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
