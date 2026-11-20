"use client";

import { useLayoutEffect } from "react";

/**
 * Prev/next buttons for an endless scroll-snap track (SPEC §8 a11y).
 *
 * The track holds three identical sets of `count` cards. It starts on the
 * middle set; once scrolling settles in an outer set it is moved by exactly
 * one set width, which looks identical, so the strip never reaches an end.
 */
export function CarouselControls({
  trackId,
  count,
}: {
  trackId: string;
  count: number;
}) {
  useLayoutEffect(() => {
    const track = document.getElementById(trackId);
    if (!track) return;
    let setW = 0;
    let timer = 0;

    const measure = () => {
      const items = track.querySelectorAll("li");
      return items[count] ? items[count].offsetLeft - items[0].offsetLeft : 0;
    };

    // Land on the middle set before the first paint.
    setW = measure();
    if (setW) track.scrollLeft = setW;

    const wrap = () => {
      if (!setW) return;
      if (track.scrollLeft < setW * 0.5) track.scrollLeft += setW;
      else if (track.scrollLeft > setW * 1.5) track.scrollLeft -= setW;
    };

    const onScroll = () => {
      clearTimeout(timer);
      timer = window.setTimeout(wrap, 120);
    };

    const onResize = () => {
      const next = measure();
      if (!next || !setW) return;
      // Keep the same relative position within the set.
      const frac = (((track.scrollLeft % setW) + setW) % setW) / setW;
      setW = next;
      track.scrollLeft = setW + frac * setW;
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [trackId, count]);

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

  const btn = "btn btn-secondary h-12 w-12 px-0 text-xl";

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-center gap-5 px-4 md:justify-start md:px-8">
      <button
        type="button"
        aria-controls={trackId}
        aria-label="Previous photo"
        onClick={() => step(-1)}
        className={btn}
      >
        <span aria-hidden>←</span>
      </button>
      <button
        type="button"
        aria-controls={trackId}
        aria-label="Next photo"
        onClick={() => step(1)}
        className={btn}
      >
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
