Build a complete Next.js 15 dropshipping store called TechLaden.de from scratch.

## TECH STACK
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- Firebase Firestore (via firebase-admin)
- AliExpress DS API
- Vercel deployment

## ENV VARS (already in .env.local)
ALIEXPRESS_APP_KEY=532686
ALIEXPRESS_APP_SECRET=8gLeF0iK9sIIa1bzkeiXUqkasMil5q1G
FIREBASE_SERVICE_ACCOUNT_JSON=<contents of firebase-service-account.json>
NEXT_PUBLIC_SITE_URL=https://techladen.de
ADMIN_PASSWORD=admin123

## API DOCS
Full AliExpress DS API documentation is in aliexpress-ds-api-reference.md in the 
project root. Read it before implementing any API calls.

## SIGNING REQUESTS (copy this exactly)
function sign(params, secret) {
  const base = Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [k, v]) => acc + k + v, '');
  return require('crypto')
    .createHmac('sha256', secret)
    .update(base).digest('hex').toUpperCase();
}
Base URL: https://api-sg.aliexpress.com/sync

## BUILD THESE FILES

### Project structure:
src/
  app/
    page.tsx                          — homepage with product grid
    [slug]/page.tsx                   — product detail page
    warenkorb/page.tsx                — shopping cart
    admin/page.tsx                    — admin panel (password protected)
    api/
      products/route.ts               — GET all products from Firestore
      import-product/route.ts         — POST: import product from AliExpress by ID
      aliexpress/callback/route.ts    — OAuth callback
    impressum/page.tsx
    datenschutz/page.tsx
    agb/page.tsx
    widerruf/page.tsx
  components/
    layout/Header.tsx
    layout/Footer.tsx
    product/ProductCard.tsx
    product/ProductDetail.tsx
    cart/CartDrawer.tsx
  lib/
    firebase-admin.ts
    aliexpress.ts                     — callAPI() + sign() functions
    cart-store.ts                     — Zustand cart store
  types/
    product.ts
    order.ts

### Firestore structure:
products/de/items/{slug} — Product documents
orders/{orderId} — Order documents

### Product type:
{
  id: string
  slug: string
  title: string              // German
  description: string        // German HTML
  category: string
  images: string[]
  price: {
    eur: number              // aliexpressEur * 2.8 rounded to X.99
    aliexpressEur: number
  }
  variants: {
    colors: string[]
    models: string[]
  }
  aliexpressProductId: string
  inStock: boolean
  createdAt: string
  updatedAt: string
}

## DESIGN
- Dark theme: background #0A0F1E, cards #111827
- Accent: electric blue #00D4FF
- Font: Inter
- Language: German ONLY (de-DE)
- NO mentions of AliExpress, China, dropshipping
- Shipping shown as "Lieferzeit: 3-7 Werktage"
- Prices always with EUR and "inkl. 19% MwSt."
- Mobile-first

## KEY FEATURES TO BUILD

### 1. Homepage (page.tsx)
- Hero section: "Premium Handy-Zubehör" headline
- Category filter bar: Alle | Hüllen | Ladegeräte | Kabel | Schutzglas | Powerbanks
- Product grid (3 cols desktop, 2 tablet, 1 mobile)
- Each ProductCard: image, title, price, "In den Warenkorb" button

### 2. Product Page ([slug]/page.tsx)
- Image gallery with thumbnails
- Title, price (EUR inkl. MwSt.)
- Variant selectors (color, phone model dropdowns)
- "In den Warenkorb" button
- Description HTML
- "Ähnliche Produkte" section

### 3. Cart (Zustand store + CartDrawer)
- Slide-in drawer from right
- List items with quantity +/-
- Total price
- "Zur Kasse" button (disabled, shows "Demnächst verfügbar")

### 4. Admin Panel (/admin)
- Password check against ADMIN_PASSWORD env var
- Import form: input AliExpress product_id → "Importieren" button
- Calls POST /api/import-product
- Shows imported products list with edit/delete

### 5. API: /api/import-product
- Receives: { productId: string }
- Calls aliexpress.ds.product.get with:
  product_id, target_currency=EUR, target_language=de_DE, ship_to_country=DE
- Extracts: title, images, price, SKU variants
- Translates title+description to German
- Calculates price: aliexpressPrice * 2.8, round to X.99
- Saves to Firestore products/de/items/{slug}
- Returns saved product

### 6. Legal pages
Simple clean pages in German:
- /impressum — placeholder with [COMPANY NAME], [ADDRESS], [EMAIL]
- /datenschutz — GDPR privacy policy template
- /agb — Terms & conditions template
- /widerruf — 14-day return policy

## AFTER BUILDING ALL FILES — RUN THESE COMMANDS:

### 1. Initialize git and push to GitHub
git init
git add .
git commit -m "feat: initial TechLaden.de dropshipping store"
gh repo create techladen --public --source=. --remote=origin --push

### 2. Deploy to Vercel
vercel --yes
vercel --prod

### 3. Set Vercel env vars from .env.local
vercel env add ALIEXPRESS_APP_KEY production
vercel env add ALIEXPRESS_APP_SECRET production
vercel env add FIREBASE_SERVICE_ACCOUNT_JSON production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add ADMIN_PASSWORD production

### 4. Link domain (after DNS is configured)
vercel domains add techladen.de

## START
Scaffold the complete project now. Create all files with working code.
Begin with: package.json, next.config.ts, tailwind.config.ts,
src/lib/firebase-admin.ts, src/lib/aliexpress.ts, src/types/product.ts,
then build all pages and components, then run the deployment commands.
