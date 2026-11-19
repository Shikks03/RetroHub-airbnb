import type { CSSProperties, ReactNode } from "react";
import type { StickerName, StickerPlacement } from "@/data/units";

/** viewBox heights for the non-square stickers (all are 240 wide). */
const HEIGHTS: Partial<Record<StickerName, number>> = {
  "rainbow-arch": 140,
  "rainbow-wave": 170,
  squiggle: 80,
  "tape-mustard": 100,
  "tape-sky": 100,
};

type Props = {
  placement: StickerPlacement;
  /** Seeds the idle-loop delay/duration so neighbours don't bob in sync. */
  index?: number;
  /** Intro set loads eagerly; everything else is lazy (SPEC §6). */
  eager?: boolean;
  /** Marks the sticker as a fly-in target for the intro timeline. */
  fly?: boolean;
  className?: string;
  /** Optional HTML overlay (badge/tag text). */
  children?: ReactNode;
};

/**
 * Decorative sticker, absolutely positioned by its centre inside a
 * `position: relative` anchor. Three layers so transforms never collide:
 * `.sticker` (placement + static tilt + tap wiggle) → `.sticker-fly`
 * (GSAP fly-in) → `.sticker-img` (CSS idle bob).
 */
export function Sticker({
  placement,
  index = 0,
  eager = false,
  fly = false,
  className = "",
  children,
}: Props) {
  const { name, x, y, size, rotate = 0, desktopOnly, md } = placement;
  const style = {
    "--x": `${x}%`,
    "--y": `${y}%`,
    "--x-md": `${md?.x ?? x}%`,
    "--y-md": `${md?.y ?? y}%`,
    "--s": size,
    "--r": `${rotate}deg`,
    "--r-md": `${md?.rotate ?? rotate}deg`,
    // Phone fly-in (CSS): enter from the nearest side, staggered by index.
    "--fx": x < 50 ? -1 : 1,
    "--i": index,
    "--idle-delay": `${-((index * 1.37) % 4).toFixed(2)}s`,
    "--idle-dur": `${(6 + ((index * 0.83) % 3)).toFixed(2)}s`,
  } as CSSProperties;

  return (
    <span
      aria-hidden
      data-sticker={name}
      className={`sticker ${desktopOnly ? "max-md:hidden" : ""} ${className}`}
      style={style}
    >
      <span className="sticker-fly" data-fly={fly ? "" : undefined}>
        {/* Plain <img>: tiny static SVGs, nothing for the optimizer to do. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/stickers/${name}.svg`}
          alt=""
          width={240}
          height={HEIGHTS[name] ?? 240}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="sticker-img"
        />
        {children}
      </span>
    </span>
  );
}
