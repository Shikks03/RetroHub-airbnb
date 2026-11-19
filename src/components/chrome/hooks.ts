"use client";

import { useEffect, useState } from "react";

/** Header slides away on scroll down, returns on scroll up (SPEC §4.0). */
export function useHideOnScroll(threshold = 80, slop = 6) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (y < threshold) {
        setHidden(false);
        lastY = y;
      } else if (Math.abs(dy) > slop) {
        setHidden(dy > 0);
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold, slop]);

  return [hidden, setHidden] as const;
}

/**
 * True once the intro's bottom edge has risen above the middle of the
 * viewport (i.e. the intro no longer reaches into the bottom half).
 * Drives the mobile bottom bar ("always visible except during the intro").
 * A deep link like /#book resolves to true on the first observer callback.
 */
export function useIntroPassed(introId = "intro") {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const intro = document.getElementById(introId);
    if (!intro) return;
    const io = new IntersectionObserver(
      ([entry]) => setPassed(!entry.isIntersecting),
      // Root = bottom half of the viewport.
      { rootMargin: "-50% 0px 0px 0px" },
    );
    io.observe(intro);
    return () => io.disconnect();
  }, [introId]);

  return passed;
}

/** Id of the section crossing the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    const els = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band across the middle: whichever section spans it is active.
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  return active;
}
