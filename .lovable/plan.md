# PackSwipe — Implementation Plan

## Scope

Mobile-first web app with three screens matching the Stitch designs:
1. **Setup** — name trip, pick template (Beach / Business / Weekend), add custom must-have items
2. **Packing (Swipe)** — Tinder-style card stack: right = Packed, left = Decide Later, up = Skip
3. **Summary** — categorized review of Packed / Decide Later / Skipped, with ability to re-decide items

No backend in v1. State persists in `localStorage` (single active trip + history). No auth, no Cloud, no weather API, no sharing — all per the spec's "Out of Scope" list.

## Design System

Apply the "Solar Energy" design tokens from `DESIGN.md` into `src/styles.css`:
- Deep navy surfaces (`#0b1326`, `#171f33`, `#1E293B`)
- Amber primary (`#ffc174` / `#f59e0b`) with ambient amber glow shadow
- Emerald tertiary (`#56e5a9`) for Packed state
- Lexend (display/headline) + Inter (body) via Google Fonts
- Pill-shaped components (24px radius), glassmorphism on top/bottom bars
- Material Symbols Outlined icon font

All colors registered as semantic tokens — no hardcoded hex in components.

## Routes (TanStack Start)

- `/` — Setup screen
- `/pack` — Swipe screen (redirects to `/` if no active trip)
- `/summary` — Summary screen

## Data Model

Matches the provided JSON. TypeScript types in `src/lib/types.ts`:

```ts
type ItemStatus = 'pending' | 'packed' | 'decide_later' | 'skipped';
interface Item { id; tripId; name; description; category; icon; status; isCustom }
interface Trip { id; name; templateId; startDate?; endDate?; luggageType?; items: Item[] }
interface Template { id; name; defaultItems: TemplateItem[] }
```

Three templates seeded with the exact baseline items from the PDF (Beach 10, Business 10, Weekend 10), each with category + Material Symbols icon.

Storage layer: `src/lib/storage.ts` — `getTrip()`, `saveTrip()`, `updateItemStatus()`, `addCustomItem()`. Backed by `localStorage` with a Zustand store for reactivity.

## Components

- `TripSetupForm` — name input, 3 template cards (with imagery), custom-item chip input
- `SwipeCard` — single item card with icon, name, description, category chip; framer-motion drag with directional thresholds + colored overlay feedback (green right, gray left, amber up)
- `SwipeDeck` — stack of cards, progress bar (amber gradient), undo last action, finish early CTA
- `SummaryList` — three accordion sections (Packed / Needs Decision / Skipped) grouped by category, tap an item to change its status
- `BottomCTA` — sticky blurred bar shared across screens

## Animation

`framer-motion` for swipe drag, card exit, and screen transitions. Tasteful — one hero swipe interaction, no scattered micro-animations.

## Out of Scope (per spec)

Weather, sharing, custom templates, push notifications, weight/luggage limits, e-commerce.

## File Additions

```
src/lib/types.ts
src/lib/templates.ts        # seeded Beach/Business/Weekend baselines
src/lib/storage.ts          # localStorage + Zustand store
src/components/SwipeCard.tsx
src/components/SwipeDeck.tsx
src/components/TripSetupForm.tsx
src/components/SummaryList.tsx
src/routes/index.tsx        # replace placeholder → Setup
src/routes/pack.tsx
src/routes/summary.tsx
src/styles.css              # updated tokens + Lexend/Inter/Material Symbols
```

Dependencies to add: `framer-motion`, `zustand`.

Ready to build — switch to build mode to proceed.
