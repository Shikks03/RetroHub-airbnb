import Image from "next/image";
import type { UnitPhoto } from "@/data/units";
import { Sticker } from "./Sticker";

/** Alternating tilt within ±3° (SPEC §4.2). */
const TILTS = [-3, 2, -1.5, 3, -2, 1.5];

/** Shared so the intro card and carousel card 1 reuse one download. */
export const POLAROID_SIZES = "(min-width: 768px) 360px, 76vw";

type Props = {
  photo: UnitPhoto;
  index: number;
  /** Only the intro card (the LCP image) should preload. */
  preload?: boolean;
  /** Render the photo's anchored stickers (off for the intro card). */
  withStickers?: boolean;
  eagerStickers?: boolean;
};

export function Polaroid({
  photo,
  index,
  preload = false,
  withStickers = true,
  eagerStickers = false,
}: Props) {
  const tilt = TILTS[index % TILTS.length];
  const tapeSky = index % 2 === 1;

  return (
    <figure
      className="relative rounded-card bg-paper p-3 pb-0 shadow-card"
      style={{ rotate: `${tilt}deg` }}
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-[4px] bg-ink/10">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={POLAROID_SIZES}
          placeholder="blur"
          preload={preload}
          className="object-cover"
        />
      </div>
      <figcaption className="flex min-h-11 items-center justify-center px-1 py-1.5 text-center font-hand text-[1.2rem] leading-[1.05] font-bold text-ink md:text-[1.3rem]">
        {photo.caption}
      </figcaption>

      <Sticker
        placement={{
          name: tapeSky ? "tape-sky" : "tape-mustard",
          x: 50,
          y: 0,
          size: 104,
          rotate: tapeSky ? 6 : -6,
        }}
        eager={eagerStickers}
        className="z-10"
      />
      {withStickers &&
        photo.stickers.map((s, i) => (
          <Sticker
            key={`${s.name}-${i}`}
            placement={s}
            index={index * 3 + i}
            eager={eagerStickers}
          />
        ))}
    </figure>
  );
}
