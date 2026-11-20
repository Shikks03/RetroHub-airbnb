"use client";

import { useEffect } from "react";
import { isAnimating, scrollToY, setSnapActive } from "@/lib/sectionScroll";

/**
 * Desktop section snapping with a controllable speed (SNAP_MS in
 * lib/sectionScroll). CSS `scroll-snap-type` stays as the fallback (before
 * JS loads, and with reduced motion); while this runs, `html.js-snap`
 * switches the CSS snap off and every move is eased by script.
 *
 * - Wheel / trackpad: one gesture moves one section. Trackpad momentum
 *   keeps firing wheel events, so a new move needs a short pause first.
 * - Keys: ↓ / PageDown / Space next, ↑ / PageUp / Shift+Space previous,
 *   Home / End.
 * - Sections taller than the screen (e.g. booking with rules expanded)
 *   scroll normally inside, then move on at their edge.
 * - Scrollbar drags and other native scrolls settle on the nearest stop.
 */

const DESKTOP = "(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)";
const SECTION_IDS = ["intro", "photos", "reviews", "book"];
const GESTURE_GAP_MS = 180; // pause that separates two wheel gestures
const SECTION_LINK = /^#(photos|reviews|book)$/;

type Stops = { points: number[]; tall: { top: number; bottom: number }[] };

function measure(): Stops {
  const vh = innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const points = new Set<number>();
  const tall: Stops["tall"] = [];
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const top = Math.round(r.top + scrollY);
    points.add(Math.min(top, max));
    if (r.height > vh + 2) {
      const bottomStop = Math.min(Math.round(top + r.height - vh), max);
      points.add(bottomStop);
      tall.push({ top, bottom: bottomStop });
    }
  }
  points.add(max); // footer end stop
  return { points: [...points].sort((a, b) => a - b), tall };
}

/** Inside a tall section, away from its edge in `dir`: scroll natively. */
function freeScroll(stops: Stops, dir: number) {
  const y = scrollY;
  return stops.tall.some((s) =>
    dir > 0 ? y >= s.top - 1 && y < s.bottom - 1 : y > s.top + 1 && y <= s.bottom + 1,
  );
}

function step(dir: number) {
  const { points } = measure();
  const y = scrollY;
  const target = dir > 0 ? points.find((p) => p > y + 1) : [...points].reverse().find((p) => p < y - 1);
  if (target !== undefined) void scrollToY(target);
}

export function SectionSnap() {
  useEffect(() => {
    const root = document.documentElement;
    const query = matchMedia(DESKTOP);
    let lastWheel = 0;
    let gestureUsed = false;
    let settleTimer = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const dir = Math.sign(e.deltaY);
      if (!dir) return;
      const now = performance.now();
      const newGesture = now - lastWheel > GESTURE_GAP_MS;
      lastWheel = now;
      if (newGesture) gestureUsed = false;

      if (!isAnimating() && freeScroll(measure(), dir)) return; // native scroll inside
      e.preventDefault();
      if (isAnimating() || gestureUsed) return;
      gestureUsed = true;
      step(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
      const onControl = !!t?.closest("button, a, summary");
      let dir = 0;
      let edge: "home" | "end" | null = null;
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          dir = 1;
          break;
        case "ArrowUp":
        case "PageUp":
          dir = -1;
          break;
        case " ":
          if (onControl) return; // Space activates buttons/links
          dir = e.shiftKey ? -1 : 1;
          break;
        case "Home":
          edge = "home";
          break;
        case "End":
          edge = "end";
          break;
        default:
          return;
      }
      if (edge) {
        e.preventDefault();
        const { points } = measure();
        void scrollToY(edge === "home" ? 0 : points[points.length - 1]);
        return;
      }
      if (!isAnimating() && freeScroll(measure(), dir)) return;
      e.preventDefault();
      if (!isAnimating()) step(dir);
    };

    // Section links (chips, Book buttons pointing at #book) glide too.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = a?.getAttribute("href");
      if (!hash || !SECTION_LINK.test(hash)) return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, "", hash);
      void scrollToY(el.getBoundingClientRect().top + scrollY);
    };

    // Scrollbar drags, middle-click autoscroll, find-in-page: settle on a stop.
    const settle = () => {
      if (isAnimating()) return;
      const stops = measure();
      const y = scrollY;
      if (stops.tall.some((s) => y >= s.top - 1 && y <= s.bottom + 1)) return;
      const nearest = stops.points.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
      if (Math.abs(nearest - y) > 1) void scrollToY(nearest, 500);
    };
    const onScroll = () => {
      if (isAnimating()) return;
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 160);
    };
    const onResize = () => {
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        const { points } = measure();
        const y = scrollY;
        const nearest = points.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
        void scrollToY(nearest, 0);
      }, 160);
    };

    const enable = () => {
      root.classList.add("js-snap");
      setSnapActive(true);
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      document.addEventListener("click", onClick);
    };
    const disable = () => {
      root.classList.remove("js-snap");
      setSnapActive(false);
      clearTimeout(settleTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
    };
    const sync = () => (query.matches ? enable() : disable());

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      disable();
    };
  }, []);

  return null;
}
