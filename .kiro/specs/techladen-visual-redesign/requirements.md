# Requirements Document

## Introduction

This feature covers a comprehensive visual redesign and UX optimization of the TechLaden e-commerce store. The goal is to transform the current dark, generic dropshipping aesthetic into a premium, bright, and airy mobile accessory boutique. The redesign spans the global layout (header, footer), the homepage (hero, categories, flash sale, bestsellers, trust signals), and the product detail page (gallery, USP row, color picker, CTA, reviews, related products). All existing German text must be preserved verbatim. The implementation targets the existing Next.js + Tailwind CSS codebase.

---

## Glossary

- **Store**: The TechLaden Next.js e-commerce application.
- **Accent_Color**: The single vibrant accent color chosen for CTAs, interactive links, price highlights, and key icons. Value: Electric Tech Blue `#00A3E0`.
- **Light_Theme**: A color scheme using white (`#FFFFFF`) or off-white (`#FAFAFA`) as the primary background and `#F7F7F7` as a subtle section divider/fill, with dark typography (`#111111` or `#1A1A1A`).
- **Dark_Typography**: Text rendered in `#111111` or `#1A1A1A` for high contrast on light backgrounds.
- **CTA_Button**: A call-to-action button styled with the Accent_Color background and white or dark contrasting text.
- **Hero_Section**: The full-width banner at the top of the homepage (`HeroSection.tsx`).
- **Category_Card**: A single card in the category grid rendered by `CategoryShowcase.tsx`.
- **Flash_Sale_Section**: The time-limited sale section rendered by `FlashSaleSection.tsx`.
- **Product_Card**: A reusable product tile rendered by `ProductCard.tsx`.
- **Product_Detail**: The full product page rendered by `ProductDetail.tsx`.
- **USP_Row**: A horizontal row of four icon-and-label pairs highlighting product selling points.
- **Color_Swatch**: A visual button representing a product color variant.
- **Trust_Bar**: The horizontal strip of trust signals rendered by `TrustSection.tsx`.
- **Footer**: The site-wide footer rendered by `Footer.tsx`.
- **Header**: The sticky site-wide navigation rendered by `Header.tsx`.
- **globals.css**: The global stylesheet at `src/app/globals.css`.

---

## Requirements

### Requirement 1: Global Design Token Migration

**User Story:** As a developer, I want a single source of truth for the new light-theme design tokens, so that all components consistently use the correct colors, typography, and spacing.

#### Acceptance Criteria

1. THE Store SHALL define the Accent_Color (`#00A3E0`) as a CSS custom property `--accent` in `globals.css` and expose it as a Tailwind utility class `accent`.
2. THE Store SHALL set the default `body` background to `#FFFFFF` and the default `body` text color to `#111111` in `globals.css`.
3. THE Store SHALL define a `bg-surface-light` utility (`#F7F7F7`) for subtle section fills and dividers.
4. THE Store SHALL update the `.btn-cta` class in `globals.css` to use the Accent_Color (`#00A3E0`) as background with white (`#FFFFFF`) text, replacing the current cyan (`#00F0FF`) / black combination.
5. THE Store SHALL update the `.card-lift` class in `globals.css` to use a white background, a light grey border (`#E5E5E5`), and a subtle light shadow, replacing the current dark surface.
6. THE Store SHALL update the `.glass-header` class in `globals.css` to use a semi-transparent white background (`rgba(255,255,255,0.85)`) with a light border, replacing the current dark glass effect.
7. WHERE the Inter font is already imported, THE Store SHALL ensure `font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif` remains the global font stack.

---

### Requirement 2: Header Light Theme

**User Story:** As a visitor, I want a clean, light-themed header, so that the navigation feels premium and trustworthy.

#### Acceptance Criteria

1. THE Header SHALL render on a white or near-white background using the updated `.glass-header` class.
2. THE Header SHALL render the logo text "TECHLADEN" in Dark_Typography, with the accent portion ("LADEN") in the Accent_Color.
3. THE Header SHALL render all navigation link text in Dark_Typography (`#555555` default, `#111111` on hover).
4. WHEN a navigation link is the active route, THE Header SHALL render that link in the Accent_Color.
5. THE Header SHALL render the cart badge background in the Accent_Color.
6. THE Header SHALL render the category dropdown on a white background with Dark_Typography links and a light border.
7. WHEN the mobile menu is open, THE Header SHALL render the mobile menu panel on a white background with Dark_Typography.

---

### Requirement 3: Hero Section Redesign

**User Story:** As a visitor, I want an immersive, light hero section with a lifestyle image, so that the store feels premium and the main CTA is immediately visible.

#### Acceptance Criteria

1. THE Hero_Section SHALL render on a white background, removing the current dark background and cyan glow effect.
2. THE Hero_Section SHALL display a single full-width lifestyle image (a high-resolution photo of a 3-in-1 charger on a wooden desk with iPhone, Apple Watch, and AirPods) as the primary visual, replacing the current product card placeholder.
3. THE Hero_Section SHALL overlay the German headline "Das Beste für dein Smartphone." in Dark_Typography over the image area.
4. THE Hero_Section SHALL render the main CTA button ("Jetzt shoppen") as a CTA_Button using the Accent_Color.
5. THE Hero_Section SHALL preserve all existing German text verbatim.
6. THE Hero_Section SHALL render trust badge icons (Truck, ShieldCheck, RefreshCcw) in the Accent_Color instead of the current success green.
7. IF no lifestyle image URL is available, THEN THE Hero_Section SHALL render a styled placeholder with a light grey background (`#F7F7F7`) and a descriptive alt text.

---

### Requirement 4: Category Showcase Redesign

**User Story:** As a visitor, I want a grid of refined category cards with minimal technical icons, so that I can quickly identify and navigate to product categories.

#### Acceptance Criteria

1. THE Category_Card SHALL render on a white background with a light grey border (`#E5E5E5`) and subtle box shadow.
2. WHEN a visitor hovers over a Category_Card, THE Category_Card SHALL highlight its border in the Accent_Color and show a subtle Accent_Color tint background.
3. THE Category_Card SHALL display a minimal SVG icon representing the category above the category name text.
4. THE Category_Card SHALL render the category name in Dark_Typography (`font-semibold`).
5. THE Category_Card SHALL render the category description text in a muted dark grey (`#666666`).
6. THE CategoryShowcase section heading ("Alle Kategorien") SHALL be rendered in Dark_Typography.
7. THE CategoryShowcase section SHALL render on a white or `#F7F7F7` background.

---

### Requirement 5: Flash Sale Section Light Theme

**User Story:** As a visitor, I want the Flash Sale section to feel energetic yet clean on a light background, so that sale products stand out without the dark aesthetic.

#### Acceptance Criteria

1. THE Flash_Sale_Section SHALL render on a white background, removing the current dark `bg-background` and red glow.
2. THE Flash_Sale_Section SHALL render the "Flash Sale" heading and "Nur heute" label in Dark_Typography.
3. THE Flash_Sale_Section SHALL render sale discount badges (e.g., "-30%") exclusively in red (`#EF4444`) with white text, preserving the urgency signal.
4. THE Flash_Sale_Section SHALL render the countdown timer using the Accent_Color for digit highlights.
5. THE Flash_Sale_Section SHALL render product cards on a white background with a light grey border, using Dark_Typography for titles and prices.
6. WHEN a visitor hovers over a Flash Sale product card, THE Flash_Sale_Section SHALL highlight the card border in red (`#EF4444`) to maintain urgency.
7. THE Flash_Sale_Section SHALL standardize the product grid so all cards have equal height and aligned price/title blocks.

---

### Requirement 6: Bestseller / Product Card Light Theme

**User Story:** As a visitor, I want product cards to display clearly on a light background, so that product images and prices are easy to read.

#### Acceptance Criteria

1. THE Product_Card SHALL render on a white background with a light grey border (`#E5E5E5`).
2. THE Product_Card SHALL render the product title in Dark_Typography.
3. THE Product_Card SHALL render the current price in Dark_Typography (`font-black`).
4. THE Product_Card SHALL render the original (crossed-out) price in muted grey (`#999999`).
5. THE Product_Card SHALL render the "In den Warenkorb" button as a CTA_Button using the Accent_Color.
6. THE Product_Card SHALL render star rating icons in the Accent_Color for filled stars.
7. THE Product_Card SHALL render the "Save X%" badge in the Accent_Color background with white text.
8. WHEN a visitor hovers over a Product_Card, THE Product_Card SHALL apply a subtle upward lift and Accent_Color border highlight.

---

### Requirement 7: Trust Bar Light Theme

**User Story:** As a visitor, I want the trust signals bar to be clearly legible on a light background, so that I feel confident about purchasing.

#### Acceptance Criteria

1. THE Trust_Bar SHALL render on a `#F7F7F7` background with a light border (`#E5E5E5`).
2. THE Trust_Bar SHALL render all trust signal titles in Dark_Typography (`font-bold`).
3. THE Trust_Bar SHALL render all trust signal subtitles in muted dark grey (`#666666`).
4. THE Trust_Bar SHALL render a small icon for each trust signal in the Accent_Color.
5. THE Trust_Bar SHALL center all trust signal items both horizontally and vertically within the bar.

---

### Requirement 8: Footer Light Theme

**User Story:** As a visitor, I want a light-themed footer, so that the page ends consistently with the new bright aesthetic.

#### Acceptance Criteria

1. THE Footer SHALL render on a white background, replacing the current dark `bg-surface`.
2. THE Footer SHALL render all heading text in Dark_Typography (`font-bold`).
3. THE Footer SHALL render all body and link text in dark grey (`#555555`).
4. WHEN a visitor hovers over a footer link, THE Footer SHALL change the link color to the Accent_Color.
5. THE Footer SHALL render the brand name "TECHLADEN" in Dark_Typography with the "LADEN" portion in the Accent_Color.
6. THE Footer SHALL render the bottom bar (payment methods, copyright) on a `#F7F7F7` background with dark text.
7. THE Footer SHALL render payment method badges with a white background, light grey border, and Dark_Typography text.
8. THE Footer SHALL preserve all existing German text verbatim.

---

### Requirement 9: Product Detail Page — Core Layout & Typography

**User Story:** As a visitor, I want the product detail page to display on a light background with dark, readable typography, so that I can easily evaluate the product.

#### Acceptance Criteria

1. THE Product_Detail SHALL render the page background in white (`#FFFFFF`).
2. THE Product_Detail SHALL render the product title (`h1`) in Dark_Typography.
3. THE Product_Detail SHALL render the breadcrumb links in dark grey with Accent_Color on hover.
4. THE Product_Detail SHALL render the category label above the title in the Accent_Color.
5. THE Product_Detail SHALL render the price block on a `#F7F7F7` background with a light border, replacing the current dark `bg-surface`.
6. THE Product_Detail SHALL render the current price in the Accent_Color (`font-black`, large).
7. THE Product_Detail SHALL render the original price in muted grey (`#999999`) with strikethrough.
8. THE Product_Detail SHALL render the "inkl. 19% MwSt." note in dark grey.
9. THE Product_Detail SHALL render the stock/visitors bar on a `#F7F7F7` background with Dark_Typography.
10. THE Product_Detail SHALL render accordion section titles in Dark_Typography.
11. THE Product_Detail SHALL render accordion body text in dark grey (`#555555`).

---

### Requirement 10: Product Detail Page — USP Row

**User Story:** As a visitor, I want to see a row of four product USPs with icons just below the product description, so that key selling points are immediately visible.

#### Acceptance Criteria

1. THE Product_Detail SHALL render a USP_Row containing exactly four items below the product description accordion.
2. THE USP_Row SHALL display the following items in order:
   - Icon: lightning bolt (fast charge) — Label: "Schnellladung 22.5W"
   - Icon: magnet/MagSafe ring — Label: "MagSafe Kompatibel"
   - Icon: shield/checkmark — Label: "1 Jahr Garantie"
   - Icon: certificate/badge — Label: "CE & RoHS Zertifiziert"
3. THE USP_Row SHALL render each icon in the Accent_Color.
4. THE USP_Row SHALL render each label in Dark_Typography (`text-sm font-medium`).
5. THE USP_Row SHALL render on a `#F7F7F7` background with a light border and rounded corners.
6. THE USP_Row SHALL be responsive: 2 columns on mobile, 4 columns on desktop.

---

### Requirement 11: Product Detail Page — Color Variant Picker

**User Story:** As a visitor, I want to see color swatches with color names below them, so that I can clearly identify and select product color variants.

#### Acceptance Criteria

1. THE Product_Detail SHALL render each Color_Swatch as a rounded square showing the actual color fill, with the color name text below it.
2. THE Color_Swatch SHALL have a subtle light grey border (`#E5E5E5`) when not selected.
3. WHEN a Color_Swatch is selected, THE Color_Swatch SHALL display an Accent_Color border and a subtle Accent_Color outer glow.
4. THE Color_Swatch SHALL render the color name label in Dark_Typography (`text-xs`).
5. THE Product_Detail SHALL render the "Farbe:" label and selected color name in Dark_Typography.

---

### Requirement 12: Product Detail Page — CTA & Trust Badges

**User Story:** As a visitor, I want a prominent, accent-colored "In den Warenkorb" button with clear trust badges below it, so that I feel confident completing my purchase.

#### Acceptance Criteria

1. THE Product_Detail SHALL render the "In den Warenkorb" button as a CTA_Button using the Accent_Color with white text and a shopping cart icon.
2. THE Product_Detail SHALL render trust badges (SSL, 14 Tage Rückgabe, Versandkostenfrei) below the CTA_Button in Dark_Typography with Accent_Color icons.
3. THE Product_Detail SHALL render the sticky mobile add-to-cart bar on a white background with a light top border, using the Accent_Color CTA_Button.
4. WHEN the "In den Warenkorb" button is clicked and the item is added, THE Product_Detail SHALL display "✓ Hinzugefügt!" as the button label for 2.5 seconds.
5. IF the product is out of stock, THEN THE Product_Detail SHALL disable the CTA_Button and render it with reduced opacity.

---

### Requirement 13: Product Detail Page — Reviews

**User Story:** As a visitor, I want to read product reviews with clear, dark typography and perfect alignment, so that I can make an informed purchase decision.

#### Acceptance Criteria

1. THE Product_Detail SHALL render the reviews section on a white background.
2. THE Product_Detail SHALL render reviewer names in Dark_Typography (`font-semibold`).
3. THE Product_Detail SHALL render review body text in dark grey (`#555555`).
4. THE Product_Detail SHALL render filled star icons in the Accent_Color.
5. THE Product_Detail SHALL render all review cards with consistent spacing and aligned left edges.

---

### Requirement 14: Product Detail Page — Related Products

**User Story:** As a visitor, I want to see related products ("Zuletzt angesehen") in standardized, aligned cards, so that I can easily discover additional products.

#### Acceptance Criteria

1. THE Product_Detail SHALL render the related products section heading in Dark_Typography.
2. THE Product_Detail SHALL render related Product_Cards using the updated light-theme Product_Card design (per Requirement 6).
3. THE Product_Detail SHALL render all related product cards at equal height with aligned title, price, and button blocks.
4. THE Product_Detail SHALL render the related products section on a white background with a light top border (`#E5E5E5`).

---

### Requirement 15: Newsletter Section Light Theme

**User Story:** As a visitor, I want the newsletter section to feel consistent with the light theme, so that the page has a cohesive visual identity.

#### Acceptance Criteria

1. THE NewsletterSection SHALL render on a white or `#F7F7F7` background, replacing the current dark background.
2. THE NewsletterSection SHALL render the heading and body text in Dark_Typography.
3. THE NewsletterSection SHALL render the email input field with a white background, light grey border, and Dark_Typography placeholder text.
4. WHEN the email input is focused, THE NewsletterSection SHALL highlight the input border in the Accent_Color.
5. THE NewsletterSection SHALL render the submit button as a CTA_Button using the Accent_Color.
6. THE NewsletterSection SHALL preserve all existing German text verbatim.
