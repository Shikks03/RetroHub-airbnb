"use client";

import { useEffect } from "react";

/**
 * Intro choreography, in-page link handling and sticker tap-wiggle (SPEC §5).
 *
 * - Phones (or any non-hover / narrow screen): CSS-only reveals, defined in
 *   globals.css under [data-motion="on"]. They start at first paint, so the
 *   lead photo (the LCP element) never waits on JavaScript. No GSAP download.
 * - Desktop (wide + hover, motion OK): GSAP is imported on demand. #intro
 *   pins for PIN_DISTANCE and the scroll position drives a paused timeline.
 *   Once the guest scrolls past, the intro stays finished; only the logo /
 *   "Intro" chip replays it.
 * - Reduced motion: nothing animates; the markup's end state shows.
 * - Deep links (/#photos, /#book) and chip taps land on a finished intro.
 */

const PIN_DISTANCE = "+=100%"; // intro occupies ~200vh of scroll in total
const DESKTOP = "(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)";
const DEEP_LINK = /^#(photos|book)$/;

declare global {
  interface Window {
    __rhMotion?: boolean;
  }
}

type Controls = { finish: () => void; replay: () => void };

export function PageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const intro = document.getElementById("intro");
    const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = matchMedia(DESKTOP);

    // --- Sticker tap wiggle (CSS keyframes) ------------------------------
    const onPointerDown = (e: PointerEvent) => {
      if (reduceQuery.matches) return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-sticker]");
      if (!el || el.classList.contains("is-wiggling")) return;
      el.classList.add("is-wiggling");
      el.addEventListener("animationend", () => el.classList.remove("is-wiggling"), { once: true });
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    // --- Phone / reduced-motion controls (no GSAP) -----------------------
    const cssControls: Controls = {
      finish: () => {},
      replay: () => {
        const reduce = reduceQuery.matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        if (reduce) return;
        // Restart the CSS reveals: drop the attribute, reflow, re-arm.
        delete root.dataset.motion;
        void root.offsetWidth;
        root.dataset.motion = "on";
      },
    };
    let desktop: Controls | null = null;
    const controls = () => (desktopQuery.matches && desktop ? desktop : cssControls);

    // In-page links: Photos/Book land on a finished intro; Intro replays it.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = a?.getAttribute("href");
      if (hash === "#intro") {
        e.preventDefault();
        history.replaceState(null, "", location.pathname + location.search);
        controls().replay();
      } else if (hash && DEEP_LINK.test(hash)) {
        controls().finish();
      }
    };
    document.addEventListener("click", onClick);

    let disposed = false;
    let teardown = () => {};

    const initDesktop = async () => {
      if (!intro || desktop || disposed) return;
      desktop = { finish: () => {}, replay: cssControls.replay }; // placeholder while loading
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const q = (sel: string) => intro.querySelector<HTMLElement>(sel);
      const flyers = gsap.utils.toArray<HTMLElement>("[data-fly]", intro);

      /** Offset that puts a sticker just past its nearest screen edge. */
      const edgeX = (_: number, el: Element) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2 < innerWidth / 2 ? -(r.right + 40) : innerWidth - r.left + 40;
      };
      const edgeY = (_: number, el: Element) =>
        el.getBoundingClientRect().top < innerHeight / 2 ? -40 : 40;

      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        root.dataset.motion = "on";
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
        tl.fromTo(q('[data-beat="introducing"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0)
          .addLabel("beat1", 0.25)
          .fromTo(q('[data-beat="logo"]'), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, "beat1")
          .fromTo(
            q('[data-beat="arch"]'),
            { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" },
            { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.3 },
            "beat1",
          )
          .fromTo(q('[data-beat="tagline"]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.38)
          .addLabel("beat2", 0.55)
          .fromTo(q('[data-beat="polaroid"]'), { autoAlpha: 0, yPercent: 35 }, { autoAlpha: 1, yPercent: 0, duration: 0.35 }, "beat2")
          .fromTo(
            flyers,
            { autoAlpha: 0, x: edgeX, y: edgeY },
            { autoAlpha: 1, x: 0, y: 0, ease: "back.out(1.6)", duration: 0.35, stagger: 0.06 },
            "beat2+=0.1", // the polaroid leads so the photo gets the first look
          );

        // "Introducing" auto-plays on load; scroll drives the rest.
        const BEAT0_END = tl.labels.beat1 / tl.duration();
        const map = (p: number) => BEAT0_END + (1 - BEAT0_END) * p;
        let done = DEEP_LINK.test(location.hash);
        const seek = (p: number, duration = 0.4) =>
          gsap.to(tl, { progress: p, duration, ease: "power1.out", overwrite: true });

        const st = ScrollTrigger.create({
          trigger: intro,
          start: "top top",
          end: PIN_DISTANCE,
          pin: true,
          onUpdate: (self) => {
            if (!done) seek(map(self.progress));
          },
          onLeave: () => {
            done = true;
            seek(1, 0.2);
          },
        });

        if (done || st.progress >= 1) {
          done = true;
          tl.progress(1);
          if (DEEP_LINK.test(location.hash)) {
            // Pinning inserted a spacer; land on the target again.
            requestAnimationFrame(() =>
              document.querySelector(location.hash)?.scrollIntoView({ behavior: "instant" }),
            );
          }
        } else {
          seek(map(st.progress), 0.8);
        }

        desktop = {
          finish: () => {
            done = true;
            seek(1, 0.2);
          },
          replay: () => {
            done = false;
            if (scrollY <= 1) seek(BEAT0_END, 0.6);
            window.scrollTo({ top: 0, behavior: "smooth" }); // rewinds as it climbs
          },
        };
      });

      // GSAP owns the desktop beats now; cancel the bootstrap failsafe.
      window.__rhMotion = true;

      // Layout settles after fonts and images; re-measure the pin.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });

      teardown = () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    };

    // Only screens that will pin ever download GSAP (e.g. after a resize).
    const onDesktopChange = () => {
      if (desktopQuery.matches) void initDesktop();
    };
    onDesktopChange();
    desktopQuery.addEventListener("change", onDesktopChange);

    return () => {
      disposed = true;
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
      desktopQuery.removeEventListener("change", onDesktopChange);
      teardown();
    };
  }, []);

  return null;
}
