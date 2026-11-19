# The Retrohub — single-page staycation site (MVP)

Handoff spec for implementation in Claude Code. Planning and sticker assets are done; nothing here is built yet.

- **Client:** The Retrohub by Kaia (Airbnb staycation, Shore Residences, Pasay City, Metro Manila)
- **MVP scope:** this one unit only. The structure must be data-driven so more themed units can be added later without rewriting sections.
- **Audience:** at least 50% mobile. Design phone-first, enhance for desktop.
- **Stack (suggested, matches the developer's usual stack):** Next.js (App Router) + TypeScript + Tailwind or CSS Modules, GSAP + ScrollTrigger for motion, `next/image` for photos. Static export is fine; no backend needed.

---

## 1. Concept

A one-page scroll experience in the spirit of dsgn interior (sections stack and slide over each other), adapted to a single unit:

**Intro → Photos (polaroid cards) → Pricing + Booking.**

- Cream page background, groovy 70s-retro brand look.
- Photos are **polaroid cards** (not full-bleed). The room photos are dim and amber-toned, so full-bleed clashes with the bright brand; cards on cream fix that.
- **Playful sticker assets** (SVGs in `public/stickers/`) float over and around the cards. They are decoration with personality, not content.
- Later units (not in MVP) repeat the same Intro → Photos → Booking block with their own theme tokens, and each new unit's intro slides over the previous unit's end ("curtain").

---

## 2. Source facts

### From the client's Facebook page ("The Retrohub")
- Tagline: "a little corner of nostalgia"
- Location: Shore Residences, Pasay City, Philippines 1300
- Phone: 0995 337 6458 (verify before publishing) · Messenger enabled
- Links to Airbnb; category shown as "Hotel resort" (the Airbnb listing says private room in a condo; copy should follow the Airbnb listing)
- Pinned post: House Rules + Before You Check-Out posters (text in section 6)

### From the Airbnb listing (read Nov 19, 2026 — re-check before launch)
- Title: "The Retrohub by Kaia" · Private room in a condo, Pasay City
- 1 bedroom · 2 beds (1 queen in the bedroom, 1 sofa bed in the living room) · 1 private attached bath
- Rating shown: 5.0 from 3 reviews (cleanliness 4.3, check-in 4.7, others 5.0). **Tiny sample: do not oversell it.**
- Amenities seen: kitchen, WiFi, outdoor pool (specific hours), elevator, washer (37 listed in total; only these were visible)
- Self check-in via lockbox · refundable security deposit of ₱1,000 on top of the booking total
- Valid IDs required for the guest and all companions; building admin processes registrations on weekdays 9:00 AM–4:00 PM; shared condo amenities follow building policies/fees
- "Honesty Store" on site: snacks/drinks, pay by online transfer or cash
- Host: Kat (co-host Ren Gabriel)

### Not found anywhere (must come from the client)
- Nightly price or rate card
- Max guests / capacity
- Check-in and check-out times
- A Google Maps pin or exact building/tower/floor directions

**Rule for the build:** never invent these. Until supplied, the price slot reads "See rates and open dates on Airbnb" and links to the listing.

### Links and contacts to wire up (verify each)
- Book: `https://www.airbnb.com/rooms/1812096067349092226` (clean URL; the share link the client sent carries tracking parameters, strip them)
- Message: `https://m.me/theretrohubbykaia` (inferred from the Facebook page handle, test it)
- Call: `tel:+639953376458`
- Map link (search, not a pin): `https://www.google.com/maps/search/?api=1&query=Shore+Residences+Pasay`

---

## 3. Visual direction

### Palette
All tokens are in `src/styles/tokens.css`. They were sampled from the client's logo, profile picture and poster art, so they are close to the brand but not an official palette.

- Page: `--rh-cream` `#F8F1DF` · cards/borders `--rh-paper` `#FFFDF7`
- Text/outline ink: `--rh-ink` `#4A0D29`
- Accents: orange `#EA6B31`, tomato `#D94E3E`, mustard `#F8C12F`, sage `#ABC78C`, teal `#4FB3A7`, sky `#72BCC7`, lavender `#C8B5E6`, plum `#6C295C`, pink `#FE5BC5`

### Typography (candidates, not test-rendered)
- Display / headings: a chunky groovy face: **Shrikhand**, **Bagel Fat One** or **Chango** (Google Fonts). Pick one in the browser; the client's logo uses a heavy 70s script.
- Handwritten captions and notes: **Gaegu** or **Patrick Hand** (the client's House Rules poster uses a handwritten style).
- Body: **DM Sans** or **Nunito**.
- Self-host via `next/font`.

### Voice
Casual, warm, a little Taglish ("besties", "10/10"). The client's own posters use this tone. All captions below are **drafts** for the client to approve.

### Logo
Use the client's logo file. The profile picture and cover are flattened on backgrounds, so **ask for a transparent PNG/SVG of the logo**. Do not redraw or trace it. Until then, set "The Retrohub" in the display font as a placeholder.

---

## 4. Page structure

Single route `/`. Section ids: `#intro`, `#photos`, `#book`.

### 4.0 Global UI
- Top: small logo + "Book" button. Hide on scroll down, show on scroll up.
- **Mobile sticky bottom bar** (thumb reach): `Book on Airbnb` (primary) + `Message` (secondary). Always visible except during the intro.
- Section chips under the header: **Intro · Photos · Book**, active state tracks scroll (IntersectionObserver). On desktop only if there's room; on mobile keep just the bottom bar.

### 4.1 Intro (`#intro`)
Three beats, then it hands off to the photos.

| Beat | What the guest sees |
|---|---|
| 0 | Cream screen with soft blobs. Small handwritten "Introducing" fades in. |
| 1 | After a little scroll, the unit name fades in big: **The Retrohub** (logo/wordmark). A rainbow arch reveals behind it. |
| 2 | After more scroll, the first polaroid slides up **and** the stickers fly in from the screen edges with a slight stagger. The polaroid leads by about 0.1s so the photo gets the first look. |

Intro stickers: `blob-sage`, `blob-mustard` (back layer, large, partly off-screen), `rainbow-arch`, `daisy-smiley-pink`, `daisy-cream`, `sparkle`, `star`, `squiggle`.

### 4.2 Photos (`#photos`)
Six polaroid cards in this order (all source photos are 1536×2048, 3:4 portrait):

| # | File | Draft caption | Stickers anchored to this card |
|---|---|---|---|
| 1 | `LivingRoom.jpg` | "Movie corner, snacks included" | `lamp-wavy`, `controller`, `checker-tile` |
| 2 | `BedRoom.jpg` | "Queen bed, terrazzo pillow" | `star`, `vinyl-pink` |
| 3 | `Kitchen.jpg` | "Records on the cabinets" | `vinyl-orange`, `vinyl-teal`, `key` |
| 4 | `ShowerArea.jpg` | "Private bath, color included" | `daisy-cream`, `sparkle` |
| 5 | `Toilet.jpg` | "Yes, there's a washer. Yes, the poster is a vibe." | `squiggle`, `daisy-smiley-plum` |
| 6 | `Balcony.jpg` | "City lights from the balcony" | `star`, `sparkle` |

- Photo 1 is the strongest shot, so lead with it. The balcony is the weakest (dark, night), so keep it last.
- Do not claim a feature a photo doesn't prove (for example, the projector is visible but a karaoke or streaming setup is not stated anywhere).

**Polaroid card spec**
- Background `--rh-paper`, border-radius ~10px, padding `12px 12px 44px`, photo `aspect-ratio: 3/4`
- Slight rotation per card, alternating, within ±3° (for example -3°, 2°, -1.5°, 3°)
- Handwritten caption in the bottom strip
- A tape sticker (`tape-mustard` or `tape-sky`) across the top edge, rotated ±6°
- Shadow: `--rh-shadow-card`
- Stickers are absolutely positioned relative to the card and **overlap its edges** (this is the "floating over the images" effect)

**Layout**
- **Mobile:** horizontal swipe carousel with `scroll-snap-type: x mandatory`. Card width about 76vw, neighbours peek on both sides. Give the scroller vertical padding (~32px) so overlapping stickers aren't clipped.
- **Desktop:** the same carousel wider, or a pinned horizontal scroll driven by the page scroll (see motion spec). 3 cards visible.

### 4.3 Pricing + Booking (`#book`) — merged
One card on the cream background, with a key sticker and badge:

- Heading: "Book your stay"
- Price slot: "See rates and open dates on Airbnb" **until the client gives a price**; then "from ₱X / night"
- Facts line: 1 bedroom · 2 beds · private bath · self check-in
- Rating line: "5.0 on Airbnb (3 reviews)", with the date it was read. Remove it if the rating changes or the client prefers not to show it.
- Primary CTA: **Book on Airbnb** · secondary: **Message us** (Messenger) · tertiary: **Call**
- "Good to know" (short, honest): ₱1,000 refundable security deposit · valid IDs for all guests · registration processed by building admin weekdays 9–4 so message ahead for weekend arrivals (confirm wording with the client)
- **Collapsible rows** (closed by default): **House rules** and **Before you check out**
  - House rules (from the client's poster): no smoking, vaping or pets · no tape or adhesives on the walls · quiet hours 10:00 PM–8:00 AM · registered guests only to sleep over · pantry snacks are pay-as-you-go · tell the host right away if something breaks
  - Before you check out: turn off lights and AC · wash used dishes · throw away trash · lock the door · message the host
- "Where": Shore Residences, Pasay City + "Open in Maps" link (search link, not a pin)
- Stickers: `key`, `badge-round` (overlay short text such as "Book now" in HTML), `tag-label` (overlay 2 lines of text), `cassette`, `sparkle`. Keep stickers away from the price and button text.

### 4.4 Footer
Small: name, location text, contact links, "Photos © The Retrohub" if the client wants it.

---

## 5. Motion spec

Use **GSAP + ScrollTrigger**, branched with `gsap.matchMedia()`.

### Desktop (`(min-width: 768px) and (hover: hover)` and `prefers-reduced-motion: no-preference`)
- Intro is pinned for about 200vh with a scrubbed timeline:
  - 0–25%: "Introducing" in (opacity 0→1, y 20→0)
  - 25–55%: logo in (scale .92→1, opacity), rainbow arch reveals with a clip-path
  - 55–100%: first polaroid slides up; stickers fly in from off-screen edges, `back.out(1.6)`, stagger ~0.06s
- Photos: normal scroll or optional pinned horizontal scroll. Keep it optional so it can be cut if it feels heavy.
- Idle sticker motion: CSS keyframes, translateY ±6px and rotate ±3°, randomized delays, 6–9s loops.

### Mobile (everything else)
- **No pinning, no scrub.** Use triggered reveals: each beat plays once when it enters the screen (about 0.5–0.7s each, ease-out). It looks nearly the same and is far more reliable when the browser bar collapses.
- Use `svh` units, not `vh`, for full-height sections.
- Cap stickers per screen: roughly 4–5 on a phone. Hide the rest.
- Tap a sticker: a short wiggle (rotate ±8°, 300ms). Cheap and playful.
- No CSS `filter` on animated stickers (costly on phones); the stickers already have baked-in cream die-cut borders.

### Reduced motion
- No pinning, no flying, no idle animation. Render the end state of every beat.

### Deep links and anchors
- Tapping **Photos** or **Book** (or opening `/#book`) must land on the finished state of that section, with no replay of the intro.
- Only the logo or the "Intro" chip replays the intro sequence.
- Call `ScrollTrigger.refresh()` after fonts and images load.

---

## 6. Assets

All stickers are original drawings in the brand's style (the client's posters inspired the style; none of their Canva characters or logo art were copied). Every file is a transparent SVG, `viewBox` 240 wide unless noted, flat colors, 5px ink outline, baked-in cream die-cut border where it makes sense. IDs inside each file are prefixed so they don't collide if inlined.

| File | Notes / where used |
|---|---|
| `daisy-smiley-pink`, `daisy-smiley-plum` | Smiley daisies: intro, caption cards |
| `daisy-cream` | Plain daisy with orange center |
| `sparkle` | 4-point sparkle: twinkle on every section |
| `star`, `starburst` | Cute star with face; cobalt starburst (accent) |
| `vinyl-orange`, `vinyl-pink`, `vinyl-teal` | Kitchen card, intro, booking |
| `key` | Booking card, nav, favicon idea |
| `blob-sage`, `blob-mustard`, `blob-lavender`, `blob-orange` | Large back-layer shapes, can bleed off-screen |
| `rainbow-arch` (240×140), `rainbow-wave` (240×170) | Intro arch behind the logo; wave as a divider |
| `checker-tile` | Echoes the living-room rug |
| `cassette`, `controller`, `cloud-mirror`, `lamp-wavy`, `tamagotchi` | Objects from the actual space and brand posters |
| `tape-mustard`, `tape-sky` (240×100) | Tape on polaroid tops |
| `badge-round`, `tag-label` | **No text inside.** Overlay HTML text in the display font |
| `squiggle` (240×80) | Decorative line |

`docs/sticker-preview.png` is a labeled contact sheet of everything.

**Usage notes**
- Load as `<img>` (or inline if you need to animate parts). Animate the wrapper with transforms, not the SVG internals.
- Sizes: about 56–96px on phones, up to ~160px for the big objects on desktop; blobs can be 240–400px and partly off-screen.
- Lazy-load everything except the intro set.
- The drawing is intentionally simple; if the client wants more detail on any sticker, tell Claude to refine that one.

---

## 7. Photo handling
- Sources: `Balcony, BedRoom, Kitchen, LivingRoom, ShowerArea, Toilet` (`.jpg`, 1536×2048, about 120–200 KB each, appear to be pre-compressed).
- Convert to AVIF + WebP, widths 480 / 768 / 1080. Use `next/image` with `sizes` tuned to the card width. First polaroid is `priority`.
- Ask the client for **original, uncompressed photos**; these will look soft on large desktop screens.
- Always write real alt text (describe the room, not "photo 1").
- Do not full-bleed these photos.
- The two poster images (`HouseRules`, `BeforeYouCheckOut`) are **not** gallery photos. Use their text as live HTML in the collapsibles; do not embed the posters.
- `coverphoto.jpg` / `profilePicture.jpg`: reference only, for brand look and favicon/OG ideas.

---

## 8. Performance, accessibility, SEO

**Performance (mobile, mid-range Android on 4G)**
- LCP image under ~150 KB (AVIF), no layout shift (reserve the 3:4 aspect-ratio)
- Initial JS under ~150 KB gzipped; load GSAP only where used
- Fonts: limit to 2–3 families, `font-display: swap`, subset

**Accessibility**
- Decorative stickers: `alt=""` / `aria-hidden`
- Collapsibles use proper buttons with `aria-expanded`
- Contrast: ink on cream is fine; check white text on orange/teal/sky before using it; keep all body text on cream or paper
- Visible focus states, tap targets at least 44×44px, honor `prefers-reduced-motion`
- The carousel is keyboard- and screen-reader-usable (buttons or arrow keys)

**SEO / sharing**
- Title/meta description naming Shore Residences, Pasay and "staycation"
- Open Graph image (use the polaroid look with the logo)
- `VacationRental`/`LodgingBusiness` JSON-LD with real data only; omit price and rating if unverified
- Run the `discoverability` skill before launch

---

## 9. Data model (so more units can be added later)

```ts
// data/units.ts
export const units = [
  {
    slug: "retrohub",
    name: "The Retrohub",
    tagline: "a little corner of nostalgia",
    theme: "retrohub",            // maps to [data-unit="retrohub"] token overrides
    airbnbUrl: "https://www.airbnb.com/rooms/1812096067349092226",
    messengerUrl: "https://m.me/theretrohubbykaia",
    phone: "+639953376458",
    location: "Shore Residences, Pasay City",
    facts: ["1 bedroom", "2 beds", "Private bath", "Self check-in"],
    price: null,                  // fill when client provides, else show "See rates on Airbnb"
    photos: [ { src, alt, caption, stickers: [ { name, x, y, size, rotate } ] } ],
    introStickers: [ /* same shape */ ],
    houseRules: [ /* strings */ ],
    checkout: [ /* strings */ ],
  },
];
```
Sections (`Intro`, `Photos`, `Booking`) are components that take a unit. Adding a unit means adding data, a theme token block, and sticker choices.

---

## 10. Build order
1. Project scaffold, tokens, fonts, global layout, sticky bottom bar
2. Static versions of all three sections with the data model (no motion)
3. Polaroid card + carousel (mobile first), sticker placement
4. Booking card with collapsibles and CTAs
5. Motion: mobile triggered reveals first, then desktop pinned intro, then idle animation
6. Deep-link and reduced-motion handling
7. Photo pipeline, performance pass, a11y pass, SEO, OG image
8. Test on a real phone and in Chrome device mode (iPhone SE width ~375 up to 1440 desktop)

### Acceptance checklist
- [ ] No horizontal page scroll on any width from 320px to 1440px
- [ ] Intro works with touch scrolling without jitter when the browser bar collapses
- [ ] `/#book` lands on the booking card with no intro replay
- [ ] Reduced-motion shows every section fully with no animation
- [ ] Every CTA works (Airbnb, Messenger, tel, Maps)
- [ ] No price, capacity or time shown that the client has not confirmed
- [ ] Lighthouse mobile performance 85+ on a simulated mid-range phone

---

## 11. Needed from the client
1. Nightly rate (or a rate card), max guests, check-in and check-out times
2. Transparent logo file (PNG/SVG)
3. Original full-resolution photos
4. Approval of draft captions and the house-rules wording
5. Confirmation of contact links (Messenger, phone) and whether bookings go only through Airbnb or also direct
6. Whether showing the Airbnb rating (5.0 from 3 reviews) is wanted
