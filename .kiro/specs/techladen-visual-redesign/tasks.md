# Implementation Plan: TechLaden Visual Redesign

## Overview

Migrate the TechLaden store from its current dark neon aesthetic to a premium light theme. The approach is token-first: update `globals.css` and `tailwind.config.ts` first so that components using shared utility classes update automatically, then patch each component's hard-coded dark className strings.

No data models, API routes, or business logic change. All German text is preserved verbatim.

---

## Tasks

- [x] 1. Migrate design tokens in `globals.css` and `tailwind.config.ts`
  - In `globals.css`: change `body` background to `#FFFFFF` and `body` color to `#111111`
  - Add CSS custom property `--accent: #00A3E0` to `:root`
  - Update `.btn-cta`: background `#00A3E0`, color `#FFFFFF`, box-shadow `rgba(0,163,224,0.25)` glow; update hover to `#0090C8`
  - Update `.card-lift`: background `#FFFFFF`, border `#E5E5E5`, hover shadow to light + blue
  - Update `.glass-header`: background `rgba(255,255,255,0.85)`, border `rgba(0,0,0,0.08)`
  - Update scrollbar track/thumb to light greys
  - In `tailwind.config.ts`: change `primary` to `#00A3E0`, add `accent: '#00A3E0'`, add `'surface-light': '#F7F7F7'`; update `background` to `#FFFFFF`, `surface` to `#F7F7F7`, `border` to `#E5E5E5`, `text-main` to `#111111`, `text-secondary` to `#666666`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 1.1 Verify token changes compile without errors
    - Run `next build` (or `tsc --noEmit`) and confirm zero TypeScript/CSS errors
    - _Requirements: 1.1–1.7_

- [x] 2. Update `Header.tsx` to light theme
  - Logo: `text-white` → `text-[#111111]`; accent span already uses `text-primary` (now resolves to `#00A3E0`)
  - Nav links: `text-text-secondary` → `text-[#555555]`; hover `hover:text-primary`
  - Cart badge: `bg-primary text-black` → `bg-primary text-white` (accent badge with white text)
  - Category dropdown: `bg-background border-border` → `bg-white border-[#E5E5E5]`; links `hover:bg-surface` → `hover:bg-[#F7F7F7]`
  - Mobile menu panel: `bg-background` → `bg-white`; link text `text-white` → `text-[#111111]`
  - Icon buttons: `hover:bg-surface` → `hover:bg-[#F7F7F7]`
  - `.glass-header` updates automatically from task 1
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 3. Update `HeroSection.tsx` to light theme
  - Remove `bg-background` from section; add `bg-white`
  - Remove the cyan background glow `<div>`
  - Replace `h1` gradient span with plain `text-[#00A3E0]`; `text-white` → `text-[#111111]`
  - Body copy: `text-text-secondary` → `text-[#555555]`
  - Trust badge icons: `text-success` → `text-[#00A3E0]`
  - Stats border: `border-border` → `border-[#E5E5E5]`; stat values `text-white` → `text-[#111111]`
  - Right column hero card: inner `text-white` → `text-[#111111]`; replace `picsum.photos` `<img>` with a `<div className="bg-[#F7F7F7] rounded-2xl flex items-center justify-center aspect-square">` fallback per Requirement 3.7
  - Update hero headline to German: "Das Beste für dein Smartphone." and CTA to "Jetzt shoppen"
  - `.btn-cta` and `.card-lift` update automatically from task 1
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 4. Update `CategoryShowcase.tsx` to light theme
  - Section: remove purple glow `<div>`; add `bg-white` (or `bg-[#F7F7F7]`)
  - Section heading: `text-white` → `text-[#111111]`; eyebrow `text-text-secondary` → `text-[#666666]`
  - Card name: `text-white group-hover:text-primary` → `text-[#111111] group-hover:text-[#00A3E0]`
  - Card desc: `text-text-secondary group-hover:text-white` → `text-[#666666] group-hover:text-[#111111]`
  - Add a minimal lucide-react icon per category above the name (map: MagSafe→Magnet, Hüllen→Smartphone, Ladegeräte→Zap, Kabel→Cable, Schutzglas→Shield, Powerbanks→Battery, Gaming→Gamepad2, Smartwatch→Watch); render icon in `text-[#00A3E0]`
  - `.card-lift` and hover border update automatically from task 1
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 5. Update `FlashSaleSection.tsx` to light theme
  - Section: `bg-background` → `bg-white`; remove red glow `<div>`; `border-border` → `border-[#E5E5E5]`
  - Heading: `text-white` → `text-[#111111]`
  - Product card wrapper: `bg-surface border-border` → `bg-white border-[#E5E5E5]`; keep `hover:border-urgency`
  - Card title: `text-white group-hover:text-primary` → `text-[#111111] group-hover:text-[#00A3E0]`
  - Card price: `text-white` → `text-[#111111]`; original price `text-text-secondary` → `text-[#999999]`
  - "Kein Bild" fallback: `text-text-secondary` → `text-[#999999]`
  - Grid: add `items-stretch` to the grid container; add `flex flex-col h-full` to card inner content; add `mt-auto` to price block
  - Pass `dark={false}` (or remove `dark` prop) to `CountdownTimer` so it uses accent-color digit highlights
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 6. Update `ProductCard.tsx` to light theme
  - Title: `text-white group-hover:text-primary` → `text-[#111111] group-hover:text-[#00A3E0]`
  - Price: `text-white` → `text-[#111111]`
  - Original price: `text-text-secondary` → `text-[#999999]`
  - Save badge: `bg-success text-black` → `bg-[#00A3E0] text-white`
  - Sold badge: `bg-background/90 text-primary border-border` → `bg-white/90 text-[#111111] border-[#E5E5E5]`
  - Out-of-stock overlay: `bg-background/80` → `bg-white/80`; inner span `text-white bg-surface border-border` → `text-[#111111] bg-[#F7F7F7] border-[#E5E5E5]`
  - Product badge: `bg-background text-white border-border` → `bg-[#F7F7F7] text-[#111111] border-[#E5E5E5]`
  - "Kein Bild" fallback: `text-text-secondary` → `text-[#999999]`
  - Remove cyan glow from button shadow classes; `.btn-cta` updates automatically from task 1
  - `.card-lift` updates automatically from task 1
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ]* 6.1 Write property test for price computation display consistency
    - **Property 1: Price computation display consistency**
    - For any EUR price, verify `fakeOriginalPrice`, the "Save X%" percentage, and the formatted price strings all match what is rendered in the component
    - Use `fast-check` with `fc.float({ min: 1, max: 999, noNaN: true })`, minimum 100 runs
    - **Validates: Requirements 6.3, 6.4, 6.7, 9.6, 9.7**

  - [ ]* 6.2 Write property test for out-of-stock CTA disabled state
    - **Property 3: Out-of-stock CTA disabled**
    - For any product where `inStock` is `false`, the CTA button must be `disabled` and have `opacity-40`
    - Use `fast-check` with a product record arbitrary where `inStock: fc.constant(false)`, minimum 100 runs
    - **Validates: Requirements 12.5**

- [x] 7. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Update `TrustSection.tsx` to light theme
  - Section: `border-border bg-surface/50` → `border-[#E5E5E5] bg-[#F7F7F7]`
  - Add a lucide-react icon per trust item (Truck, RotateCcw, ShieldCheck, BadgeCheck, PackageCheck) rendered in `text-[#00A3E0]`
  - Title: `text-white group-hover:text-primary` → `text-[#111111] font-bold`
  - Subtitle: `text-text-secondary` → `text-[#666666]`
  - Per-item wrapper: add `flex flex-col items-center` for vertical centering
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9. Update `Footer.tsx` to light theme
  - Footer wrapper: `bg-surface border-border` → `bg-white border-[#E5E5E5]`
  - Brand name: `text-white` → `text-[#111111]`; accent span stays `text-primary`
  - Column headings: `text-white` → `text-[#111111]`
  - Body/link text: `text-text-secondary` → `text-[#555555]`; hover `hover:text-primary` (accent)
  - Bottom bar wrapper: `bg-background` → `bg-[#F7F7F7]`; `border-border` → `border-[#E5E5E5]`
  - Payment badges: `bg-surface border-border text-text-secondary` → `bg-white border-[#E5E5E5] text-[#111111]`
  - Copyright text: `text-text-secondary` → `text-[#555555]`
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [x] 10. Update `ProductDetail.tsx` — core layout, typography, and price block
  - Page wrapper: `bg-background text-white` → `bg-white text-[#111111]`
  - Breadcrumb links: `text-text-secondary hover:text-primary` → `text-[#555555] hover:text-[#00A3E0]`; current page span `text-white` → `text-[#111111]`
  - `h1`: `text-white` → `text-[#111111]`
  - Stars + sold: star filled `text-primary fill-primary` stays (resolves to accent); unfilled `text-border fill-border` → `text-[#E5E5E5] fill-[#E5E5E5]`; rating text `text-white` → `text-[#111111]`; sold badge `bg-surface border-border` → `bg-[#F7F7F7] border-[#E5E5E5]`; `text-text-secondary` → `text-[#555555]`
  - Price block: `bg-surface border-border` → `bg-[#F7F7F7] border-[#E5E5E5]`; remove cyan glow `<div>`; current price `text-primary` stays (accent); original price `text-text-secondary` → `text-[#999999]`; savings text `text-success` → `text-[#00A3E0]`; MwSt note `text-text-secondary` → `text-[#555555]`
  - Stock/visitors bar: `bg-surface/50 border-border` → `bg-[#F7F7F7] border-[#E5E5E5]`
  - Model select: `bg-surface border-border text-white` → `bg-white border-[#E5E5E5] text-[#111111]`; focus `focus:border-primary` stays
  - Accordion wrapper: `border-border bg-surface` → `border-[#E5E5E5] bg-[#F7F7F7]`
  - Accordion title: `text-white hover:text-primary` → `text-[#111111] hover:text-[#00A3E0]`
  - Accordion body: `text-text-secondary` → `text-[#555555]`; `prose-invert` → `prose` (light prose)
  - "Why us" strip: `border-border bg-surface/50` → `border-[#E5E5E5] bg-[#F7F7F7]`; `text-white` → `text-[#111111]`; `text-text-secondary` → `text-[#555555]`
  - Gallery thumbnail: selected `border-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]` → `border-[#00A3E0] shadow-[0_0_10px_rgba(0,163,224,0.3)]`; unselected `border-border` → `border-[#E5E5E5]`
  - Gallery main image border: `border-border shadow-[0_0_30px_rgba(255,255,255,0.05)]` → `border-[#E5E5E5] shadow-sm`
  - "Kein Bild" fallback: `text-text-secondary` → `text-[#999999]`
  - CTA button label: update to "In den Warenkorb" (German); sticky bar label: update to "In den Warenkorb"
  - Trust badges under CTA: icons `text-success` → `text-[#00A3E0]`; labels `text-text-secondary` → `text-[#111111]`
  - Sticky mobile bar: `bg-surface/95 border-border` → `bg-white/95 border-[#E5E5E5]`; remove dark shadow; price `text-primary` stays
  - Related products section: `border-border` → `border-[#E5E5E5]`; heading `text-white` → `text-[#111111]`; eyebrow `text-primary` stays
  - _Requirements: 9.1–9.11, 12.1, 12.3, 12.4, 12.5, 14.1, 14.3, 14.4_

- [x] 11. Implement Color Swatch picker in `ProductDetail.tsx`
  - Add `COLOR_MAP` lookup object inline (Schwarz, Weiß, Silber, Gold, Blau, Rot, Grün, Lila, Rosa, Grau → hex values; unknown → `#CCCCCC`)
  - Replace pill-button color selector with a swatch grid: each swatch is a `40×40px rounded-lg` `<button>` with `backgroundColor` set from `COLOR_MAP`
  - Unselected swatch: `border-2 border-[#E5E5E5]`
  - Selected swatch: `border-2 border-[#00A3E0] ring-2 ring-[#00A3E0]/30`
  - Color name label: `text-xs text-[#111111] text-center` below each swatch
  - "Farbe:" label and selected color name: `text-[#111111]`
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 11.1 Write property test for color swatch selection state
    - **Property 2: Color swatch selection state**
    - For any array of color strings and any selected index, exactly the matching swatches render with `border-[#00A3E0]` and all others render with `border-[#E5E5E5]`
    - Use `fast-check` with `fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 })` and `fc.nat()`, minimum 100 runs
    - **Validates: Requirements 11.2, 11.3**

- [x] 12. Implement USP Row in `ProductDetail.tsx`
  - Import `Zap`, `Magnet`, `ShieldCheck`, `Award` from `lucide-react`
  - Define `USP_ITEMS` array inline with four entries: Schnellladung 22.5W, MagSafe Kompatibel, 1 Jahr Garantie, CE & RoHS Zertifiziert
  - Render USP Row after the accordion block: `grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-4`
  - Each item: `flex flex-col items-center gap-2 text-center`; icon `text-[#00A3E0] w-6 h-6`; label `text-sm font-medium text-[#111111]`
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 13. Update `ProductReviews.tsx` to light theme
  - Summary block: `bg-surface border-border` → `bg-[#F7F7F7] border-[#E5E5E5]`
  - Average rating number: `text-text-main` → `text-[#111111]`
  - Star icons: `text-yellow-400 fill-yellow-400` → `text-[#00A3E0] fill-[#00A3E0]`; unfilled `text-gray-200 fill-gray-200` stays
  - Rating bar fill: `bg-yellow-400` → `bg-[#00A3E0]`
  - Review cards: `border-border` → `border-[#E5E5E5]`
  - Reviewer name: `text-text-main` → `text-[#111111] font-semibold`
  - Location + date: `text-text-secondary` → `text-[#555555]`
  - Review body: `text-text-secondary` → `text-[#555555]`
  - "Mehr anzeigen" button: `text-text-main hover:text-primary border-border` → `text-[#111111] hover:text-[#00A3E0] border-[#E5E5E5]`
  - "Verifizierter Kauf" badge: `text-cta bg-emerald-50 border-emerald-200` → `text-[#00A3E0] bg-[#00A3E0]/10 border-[#00A3E0]/20`
  - Helpful text: `text-text-secondary` → `text-[#555555]`
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [ ]* 13.1 Write property test for review star fill count
    - **Property 4: Review star fill count**
    - For any integer rating R (1–5), exactly R stars render with `fill-[#00A3E0]` and exactly (5 − R) render with `fill-gray-200`
    - Use `fast-check` with `fc.integer({ min: 1, max: 5 })`, minimum 100 runs
    - **Validates: Requirements 13.4**

- [x] 14. Update `NewsletterSection.tsx` to light theme
  - Section: `bg-background border-border` → `bg-[#F7F7F7] border-[#E5E5E5]`; remove both glow `<div>`s
  - Eyebrow pill: `bg-primary/10 border-primary/20 text-primary` → `bg-[#00A3E0]/10 border-[#00A3E0]/20 text-[#00A3E0]`
  - Heading: `text-white` → `text-[#111111]`; gradient span → plain `text-[#00A3E0]`
  - Body copy: `text-text-secondary` → `text-[#555555]`
  - Email input: `bg-surface border-border text-white placeholder:text-text-secondary` → `bg-white border-[#E5E5E5] text-[#111111] placeholder:text-[#999999]`; focus `focus:border-[#00A3E0]`; remove cyan focus shadow
  - Success state: `bg-surface border-primary/30 text-primary` → `bg-white border-[#00A3E0]/30 text-[#00A3E0]`; subtitle `text-text-secondary` → `text-[#555555]`
  - Fine print: `text-text-secondary/60` → `text-[#999999]`
  - Submit button `.btn-cta` updates automatically from task 1
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

- [x] 15. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Tasks 1 (token migration) must be completed before all other tasks — many className changes cascade automatically
- All German text is preserved verbatim throughout; no copy changes are needed beyond what is explicitly listed
- Property tests use `fast-check` (already available or install with `npm install --save-dev fast-check`)
- Run `npx tsc --noEmit` after each component update to catch className typos early
