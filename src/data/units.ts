/**
 * Unit data. Every section component takes a `Unit`, so adding a themed unit
 * later means adding an entry here, a `[data-unit="…"]` token block and its
 * sticker choices — no section rewrites. See SPEC.md §9.
 *
 * Rule (SPEC §2): never invent price, capacity or check-in/out times. Leave
 * them `null` until the client confirms them.
 */

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
  /** Left edge, % of the anchor's width. Negative / >100 overlaps the edge. */
  x: number;
  /** Top edge, % of the anchor's height. */
  y: number;
  /** Rendered width in px on phones; scaled up on desktop. */
  size: number;
  /** Degrees. */
  rotate?: number;
  /** Hidden on phones to respect the ~4–5 stickers-per-screen cap. */
  desktopOnly?: boolean;
};

export type UnitPhoto = {
  src: string;
  width: number;
  height: number;
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
    photos: [], // filled in step 2 (needs real alt text per photo)
    introStickers: [], // placed in step 3
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
