/**
 * Unit data. Every section component takes a `Unit`, so adding a themed unit
 * later means adding an entry here, a `[data-unit="…"]` token block and its
 * sticker choices — no section rewrites. See SPEC.md §9.
 *
 * Rule (SPEC §2): never invent price, capacity or check-in/out times. Leave
 * them `null` until the client confirms them.
 */

import type { StaticImageData } from "next/image";
import balcony from "@/assets/photos/balcony.jpg";
import bedroom from "@/assets/photos/bedroom.jpg";
import kitchen from "@/assets/photos/kitchen.jpg";
import livingRoom from "@/assets/photos/living-room.jpg";
import shower from "@/assets/photos/shower.jpg";
import toiletWasher from "@/assets/photos/toilet-washer.jpg";

export const STICKERS = [
  "badge-round",
  "blob-lavender",
  "blob-mustard",
  "blob-orange",
  "blob-sage",
  "cassette",
  "checker-tile",
  "cloud-mirror",
  "controller",
  "daisy-cream",
  "daisy-smiley-pink",
  "daisy-smiley-plum",
  "key",
  "lamp-wavy",
  "rainbow-arch",
  "rainbow-wave",
  "sparkle",
  "squiggle",
  "star",
  "starburst",
  "tag-label",
  "tamagotchi",
  "tape-mustard",
  "tape-sky",
  "vinyl-orange",
  "vinyl-pink",
  "vinyl-teal",
] as const;

export type StickerName = (typeof STICKERS)[number];

/** Where a sticker sits relative to its anchor (a card or the intro stage). */
export type StickerPlacement = {
  name: StickerName;
  /** Sticker centre, % of the anchor's width. <0 or >100 bleeds past the edge. */
  x: number;
  /** Sticker centre, % of the anchor's height. */
  y: number;
  /** Rendered width in px on phones; scaled up on desktop. */
  size: number;
  /** Degrees. */
  rotate?: number;
  /** Hidden on phones to respect the ~4–5 stickers-per-screen cap. */
  desktopOnly?: boolean;
};

export type UnitPhoto = {
  /** Static import: gives next/image real dimensions and a blur placeholder. */
  src: StaticImageData;
  /** Describe the room, never "photo 1". */
  alt: string;
  /** Draft copy, pending client approval. */
  caption: string;
  stickers: StickerPlacement[];
};

export type Unit = {
  slug: string;
  name: string;
  tagline: string;
  /** Maps to `[data-unit="…"]` token overrides. */
  theme: string;
  airbnbUrl: string;
  messengerUrl: string;
  /** E.164, used for `tel:` links. */
  phone: string;
  /** Human-readable, e.g. "0995 337 6458". */
  phoneDisplay: string;
  location: string;
  mapsUrl: string;
  facts: string[];
  /** Nightly rate in PHP. `null` until the client supplies it. */
  price: number | null;
  /** Airbnb rating as read on `readOn`. `null` hides the rating line. */
  rating: { value: number; count: number; readOn: string } | null;
  goodToKnow: string[];
  houseRules: string[];
  checkout: string[];
  photos: UnitPhoto[];
  introStickers: StickerPlacement[];
};

export const units: Unit[] = [
  {
    slug: "retrohub",
    name: "The Retrohub",
    tagline: "a little corner of nostalgia",
    theme: "retrohub",
    airbnbUrl: "https://www.airbnb.com/rooms/1812096067349092226",
    messengerUrl: "https://m.me/theretrohubbykaia", // inferred from the FB handle — test before launch
    phone: "+639953376458", // verify before publishing
    phoneDisplay: "0995 337 6458",
    location: "Shore Residences, Pasay City",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Shore+Residences+Pasay",
    facts: ["1 bedroom", "2 beds", "Private bath", "Self check-in"],
    price: null,
    rating: { value: 5.0, count: 3, readOn: "2026-11-19" },
    // Wording pending client confirmation (SPEC §4.3).
    goodToKnow: [
      "₱1,000 refundable security deposit on top of the booking total",
      "Valid IDs needed for you and everyone staying",
      "Building admin processes registrations weekdays 9 AM–4 PM, so message us ahead for weekend arrivals",
    ],
    // From the client's House Rules poster.
    houseRules: [
      "No smoking, vaping or pets",
      "No tape or adhesives on the walls",
      "Quiet hours 10:00 PM–8:00 AM",
      "Only registered guests can sleep over",
      "Pantry snacks are pay-as-you-go",
      "Something broke? Tell us right away so we can fix it",
    ],
    // From the client's Before You Check-Out poster.
    checkout: [
      "Turn off the lights and AC",
      "Wash the dishes you used",
      "Throw away your trash",
      "Lock the door",
      "Message the host",
    ],
    // Order per SPEC §4.2: strongest shot first, the dark balcony last.
    // Captions are drafts for the client to approve.
    photos: [
      {
        src: livingRoom,
        alt: "Living room in warm yellow light: a black tufted sofa, a wavy paper floor lamp, a wall of retro posters, a projector screen, metal shelves with retro game controllers and books, a black-and-white checkered rug and a rack of snacks.",
        caption: "Movie corner, snacks included",
        stickers: [
          { name: "lamp-wavy", x: -4, y: 46, size: 76, rotate: -8 },
          { name: "controller", x: 94, y: 80, size: 84, rotate: 12 },
          { name: "checker-tile", x: 92, y: 6, size: 56, rotate: 14, desktopOnly: true },
        ],
      },
      {
        src: bedroom,
        alt: "Bedroom with a made-up bed, a terrazzo-print pillow and folded towels, three colorful posters above the headboard, a paper lantern and blackout blinds.",
        caption: "Queen bed, terrazzo pillow",
        stickers: [
          { name: "star", x: 96, y: 10, size: 64, rotate: 12 },
          { name: "vinyl-pink", x: 2, y: 84, size: 80, rotate: -10 },
        ],
      },
      {
        src: kitchen,
        alt: "Galley kitchen with wood-finish cabinets covered in vinyl records, a sink, a two-burner electric stove, a fridge and a cat-print floor mat by the front door.",
        caption: "Records on the cabinets",
        stickers: [
          { name: "vinyl-orange", x: 97, y: 26, size: 72, rotate: 8 },
          { name: "vinyl-teal", x: 1, y: 66, size: 64, rotate: -6 },
          { name: "key", x: 94, y: 88, size: 72, rotate: -20, desktopOnly: true },
        ],
      },
      {
        src: shower,
        alt: "Private bathroom with a rain shower and water heater, a colorful patchwork shower curtain, a sink and a backlit mirror.",
        caption: "Private bath, color included",
        stickers: [
          { name: "daisy-cream", x: 96, y: 12, size: 68, rotate: 10 },
          { name: "sparkle", x: 2, y: 58, size: 48 },
        ],
      },
      {
        src: toiletWasher,
        alt: "Toilet with a top-load washing machine beside it and a balloon-dog art print on the tiled wall.",
        caption: "Yes, there's a washer. Yes, the poster is a vibe.",
        stickers: [
          { name: "squiggle", x: 88, y: 4, size: 92, rotate: 10 },
          { name: "daisy-smiley-plum", x: 2, y: 78, size: 72, rotate: -12 },
        ],
      },
      {
        src: balcony,
        alt: "Small balcony at night with a black railing, a warm wall lamp and a view of lit-up condo towers.",
        caption: "City lights from the balcony",
        stickers: [
          { name: "star", x: 4, y: 10, size: 60, rotate: -12 },
          { name: "sparkle", x: 96, y: 62, size: 52 },
        ],
      },
    ],
    // Positions are % of the intro stage. Blobs sit behind everything and
    // bleed off-screen; on phones only ~4 small stickers show (SPEC §5).
    introStickers: [
      { name: "blob-sage", x: 2, y: 14, size: 240 },
      { name: "blob-mustard", x: 98, y: 92, size: 280 },
      { name: "daisy-smiley-pink", x: 88, y: 14, size: 76, rotate: 12 },
      { name: "sparkle", x: 12, y: 40, size: 44 },
      { name: "star", x: 86, y: 60, size: 60, rotate: -10 },
      { name: "daisy-cream", x: 9, y: 80, size: 64, rotate: -8, desktopOnly: true },
      { name: "squiggle", x: 48, y: 94, size: 120, rotate: -4, desktopOnly: true },
    ],
  },
];

export const primaryUnit = units[0];

/** Fixed section anchors (SPEC §4). */
export const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "photos", label: "Photos" },
  { id: "book", label: "Book" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
