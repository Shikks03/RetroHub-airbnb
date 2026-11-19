"use client";

import { useEffect, useState } from "react";

/** Prev/next buttons + counter for a scroll-snap track (SPEC §8 a11y). */
export function CarouselControls({
  trackId,
  count,
}: {
  trackId: string;
  count: number;
}) {
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = document.getElementById(trackId);
    if (!track) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      const items = track.querySelectorAll("li");
      if (!items.length) return;
      // Phones snap cards to the centre, desktop to the (padded) left edge.
      const startAligned = getComputedStyle(items[0]).scrollSnapAlign.includes("start");
      const box = track.getBoundingClientRect();
      const ref = startAligned
        ? box.left + (parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0)
        : box.left + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((li, i) => {
        const r = li.getBoundingClientRect();
        const d = Math.abs((startAligned ? r.left : r.left + r.width / 2) - ref);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      const max = track.scrollWidth - track.clientWidth;
      setIndex(best);
      setAtStart(track.scrollLeft <= 4);
      setAtEnd(track.scrollLeft >= max - 4);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [trackId]);

  const step = (dir: 1 | -1) => {
    const track = document.getElementById(trackId);
    const first = track?.querySelector("li");
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(first.parentElement!).columnGap) || 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({
      left: dir * (first.getBoundingClientRect().width + gap),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const btn =
    "btn btn-secondary h-12 w-12 px-0 text-xl disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center gap-5 px-4 md:justify-start md:px-8">
      <button
        type="button"
        aria-controls={trackId}
        aria-label="Previous photo"
        disabled={atStart}
        onClick={() => step(-1)}
        className={btn}
      >
        <span aria-hidden>←</span>
      </button>
      <p aria-live="polite" className="min-w-16 text-center font-hand text-xl font-bold">
        {index + 1} / {count}
      </p>
      <button
        type="button"
        aria-controls={trackId}
        aria-label="Next photo"
        disabled={atEnd}
        onClick={() => step(1)}
        className={btn}
      >
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
