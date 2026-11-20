// outside → in, same palette as the profile-picture ribbons
export const BANDS = ["#D94E3E", "#EA6B31", "#F8C12F", "#A3CDBD", "#72BCC7"];

export type Ribbon = { d: string; dx: number; dy: number; w: number };

export const RIBBONS = {
  desktop: [
    // top-left corner
    // Both ends are extended in a straight line (same tangent) far past the
    // viewport so every band, however far it's stepped, runs off the screen.
    { d: "M-500 330 L-40 330 C 190 330 330 190 410 -40 L 600 -600", dx: 26, dy: 26, w: 40 },
    // bottom-right corner (bands run inward)
    // ...and keeps going down-left into the next section (viewBox is two screens tall).
    { d: "M2000 410 L1480 470 C 1270 490 1250 720 1030 790 C 880 838 780 880 700 960 L -300 1960", dx: -26, dy: -26, w: 40 },
  ],
  mobile: [
    { d: "M-500 150 L-30 150 C 90 150 150 100 190 -30 L 330 -480", dx: 17, dy: 17, w: 26 },
    // Leaves through the left edge above the section seam, so nothing is sliced flat.
    { d: "M900 570 L430 610 C 330 620 280 650 210 690 C 140 730 60 745 -60 750 L -500 780", dx: -17, dy: -17, w: 26 },
  ],
  // Reviews: picks the ribbon up at the left edge where Photos ends, loops
  // under the cards and leaves bottom-right, toward the booking card.
  reviews: [
    { d: "M-500 105 L-40 105 C 260 105 330 295 560 375 C 760 465 980 425 1180 565 C 1300 645 1380 685 1480 695 L 2000 735", dx: 24, dy: 24, w: 36 },
  ],
  reviewsMobile: [
    // Drawn on a canvas 100px taller than the section: it starts in the empty
    // gap under Photos' arrows, never over the polaroids.
    { d: "M-300 -40 L0 155 C 90 212 150 295 220 382 C 290 470 340 500 430 510 L 900 550", dx: 15, dy: 15, w: 22 },
  ],
} satisfies Record<string, Ribbon[]>;

export function Ribbons({ set, viewBox, className }: { set: Ribbon[]; viewBox: string; className: string }) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${className}`}
      fill="none"
    >
      {set.map((r, ri) =>
        BANDS.map((color, bi) => (
          // Outermost band first; each next band steps inward.
          <path
            key={`${ri}-${bi}`}
            className="ribbon-band"
            style={{ ["--b" as string]: ri * 2 + bi }}
            d={r.d}
            pathLength={1}
            stroke={color}
            strokeWidth={r.w}
            transform={`translate(${r.dx * bi} ${r.dy * bi})`}
          />
        )),
      )}
    </svg>
  );
}

