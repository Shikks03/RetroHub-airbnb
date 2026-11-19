/**
 * Eased page scrolling shared by the section snapper and in-page links.
 *
 * Browsers don't let CSS control how fast scroll-snap animates, so on
 * desktop SectionSnap takes over and every section move goes through
 * `scrollToY`, using SNAP_MS and an ease-in-out curve.
 */

/** How long one section-to-section move takes. Tune here. */
export const SNAP_MS = 900;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

let frame = 0;
let animating = false;
/** Set by SectionSnap while it owns desktop scrolling. */
let snapActive = false;

export const isAnimating = () => animating;
export const setSnapActive = (on: boolean) => {
  snapActive = on;
};

const prefersReduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Scroll the page to `target` px. Resolves when the move finishes. */
export function scrollToY(target: number, duration = SNAP_MS): Promise<void> {
  const max = document.documentElement.scrollHeight - innerHeight;
  const to = Math.max(0, Math.min(max, Math.round(target)));
  cancelAnimationFrame(frame);

  // Outside desktop snapping, or with reduced motion: let the browser do it.
  if (!snapActive || prefersReduced()) {
    animating = false;
    window.scrollTo({ top: to, behavior: prefersReduced() ? "instant" : "smooth" });
    return Promise.resolve();
  }

  const from = scrollY;
  if (Math.abs(to - from) < 1) return Promise.resolve();
  animating = true;
  const start = performance.now();

  return new Promise((resolve) => {
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // "instant" bypasses html { scroll-behavior: smooth } per frame.
      window.scrollTo({ top: from + (to - from) * easeInOutCubic(t), behavior: "instant" });
      if (t < 1) {
        frame = requestAnimationFrame(step);
      } else {
        animating = false;
        resolve();
      }
    };
    frame = requestAnimationFrame(step);
  });
}
