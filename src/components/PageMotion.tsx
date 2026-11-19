"use client";

import { useEffect } from "react";
import { scrollToY } from "@/lib/sectionScroll";

/**
 * Intro replay + sticker tap-wiggle. The intro beats themselves are pure CSS
 * (globals.css, under html[data-motion="on"]): they play once from first
 * paint on every screen size, so the lead photo never waits on JavaScript.
 *
 * Desktop sections are full-screen and scroll-snap, so there is no pinned,
 * scroll-scrubbed intro any more (it would be skipped by the snap).
 *
 * - Logo / "Intro" chip: scroll to the top and replay the beats.
 * - Deep links (/#photos, /#book): the bootstrap script never arms the
 *   reveals, so the intro is already in its finished state.
 * - Reduced motion: CSS disables every animation.
 */
export function PageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");

    const onPointerDown = (e: PointerEvent) => {
      if (reduceQuery.matches) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-sticker]");
      if (!el || el.classList.contains("is-wiggling")) return;
      el.classList.add("is-wiggling");
      el.addEventListener("animationend", () => el.classList.remove("is-wiggling"), { once: true });
    };

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href="#intro"]');
      if (!a) return;
      e.preventDefault();
      history.replaceState(null, "", location.pathname + location.search);
      void scrollToY(0); // eased like the section snap on desktop
      if (reduceQuery.matches) return;
      // Restart the CSS reveals: drop the attribute, force a reflow, re-arm.
      delete root.dataset.motion;
      void root.offsetWidth;
      root.dataset.motion = "on";
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
