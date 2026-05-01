# Design Document: Zaitron Layout Redesign

## Overview

This design document specifies the technical implementation for redesigning TechLaden's homepage layouts to create a richer, more dynamic e-commerce experience inspired by modern platforms like Zaitron. The redesign focuses on enhancing visual hierarchy, improving product presentation, and creating a premium shopping experience through larger hero sections, dynamic grid layouts, enhanced card depth, and bold promotional elements.

### Design Goals

1. **Enhanced Visual Hierarchy**: Create clear content prioritization through size, spacing, and depth
2. **Premium Aesthetic**: Implement sophisticated shadow systems and smooth animations
3. **Responsive Excellence**: Ensure optimal layouts across all device sizes
4. **Performance**: Maintain 60fps animations and fast page loads
5. **Brand Consistency**: Preserve Electric Tech Blue (#00A3E0) color scheme and German content

### Key Design Principles

- **Progressive Enhancement**: Start with solid base layouts, enhance with animations and effects
- **Mobile-First**: Design for mobile viewports first, scale up to desktop
- **Accessibility**: Maintain WCAG AA contrast ratios and semantic HTML
- **Performance**: Use CSS transforms for animations, lazy-load images, prevent layout shift

## Architecture

### Component Hierarchy

```
HomePage
├── HeroSection (Enhanced)
│   ├── ProductShowcase
│   └── PromotionalBanner (New)
├── TrustSection (Existing)
├── CategoryShowcase (Enhanced)
├── NewArrivalSection (New)
├── DealsOfTheDaySection (New)
├── FlashSaleSection (Existing)
├── ProductGrid (Enhanced)
│   └── ProductCard (Enhanced)
├── RecentlyViewed (Existing)
└── NewsletterSection (Existing)
```

### Design System Architecture

The redesign implements a layered design system:

1. **Foundation Layer**: Tailwind CSS configuration with extended color palette and spacing
2. **Component Layer**: React components with consistent styling patterns
3. **Animation Layer**: CSS transitions and transforms for interactive effects
4. **Responsive Layer**: Breakpoint-based layout adaptations

### Technology Stack

- **Framework**: Next.js 14+ with React Server Components
- **Styling**: Tailwind CSS with custom utility classes
- **Animations**: CSS transitions and transforms (no JavaScript animation libraries)
- **Images**: Next.js Image component with lazy loading
- **Type Safety**: TypeScript for all components

## Components and Interfaces

### 1. Enhanced HeroSection Component

**Purpose**: Display large, visually striking hero area with featured products and promotional content

**Interface**:
```typescript
interface HeroSectionProps {
  // Uses server-side data fetching, no props needed
}
```

**Layout Structure**:
- Desktop (≥1024px): Two-column layout (60% product showcase, 40% promotional banner)
- Tablet (768px-1023px): Two-column layout (50/50 split)
- Mobile (<768px): Single column, stacked vertically

**Key Features**:
- Minimum viewport height: 50vh on desktop, 60vh on mobile
- Product images: 400x400px minimum on desktop
- Gradient background using Electric Tech Blue
- Floating shadow effects for depth
- Smooth hover animations (300ms transitions)

**Styling Requirements**:
```css
.hero-section {
  min-height: 50vh;
  background: gradient-to-br from-white via-gray-50 to-blue-50;
}

.hero-product-card {
  border-radius: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: transform 300ms ease;
}

.hero-product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}
```

### 2. PromotionalBanner Component (New)

**Purpose**: Display eye-catching promotional messages with gradient backgrounds

**Interface**:
```typescript
interface PromotionalBannerProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  gradientFrom?: string; // Default: Electric Tech Blue
  gradientTo?: string;   // Default: Complementary color
}
```

**Layout Structure**:
- Desktop: Horizontal layout with text left, CTA right
- Mobile: Vertical stack with centered content

**Key Features**:
- Minimum height: 200px on desktop, 150px on mobile
- Gradient opacity variation: 30% minimum
- CTA button with hover lift effect
- Responsive text sizing

**Styling Requirements**:
```css
.promotional-banner {
  min-height: 200px;
  background: linear-gradient(135deg, #00A3E0 0%, rgba(0, 163, 224, 0.7) 100%);
  border-radius: 24px;
  padding: 48px;
}

.promotional-banner-cta {
  transition: all 300ms ease;
}

.promotional-banner-cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}
```

### 3. Enhanced CategoryShowcase Component

**Purpose**: Display product categories in dynamic grid with varying card sizes

**Interface**:
```typescript
interface CategoryShowcaseProps {
  // Uses static category data, no props needed
}

interface CategoryCard {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean; // For size variation
}
```

**Grid Layout**:
- Desktop (≥1024px): 4-column grid
- Tablet (768px-1023px): 3-column grid
- Mobile (<768px): 2-column grid

**Key Features**:
- Featured categories: 1.5x size of regular cards
- Hover elevation: 8px vertical translation
- Shadow transition: 300ms duration
- Icon size: 32px (desktop), 24px (mobile)

**Styling Requirements**:
```css
.category-card {
  border-radius: 12px;
  border: 1px solid #E5E5E5;
  transition: all 300ms ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: #00A3E0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.category-card.featured {
  grid-column: span 2;
  grid-row: span 2;
}
```

### 4. Enhanced ProductCard Component

**Purpose**: Display individual products with premium appearance and visual depth

**Interface**:
```typescript
interface ProductCardProps {
  product: Product;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  price: {
    eur: number;
    aliexpressEur: number;
  };
  inStock: boolean;
  badge?: string | null;
}
```

**Size Specifications**:
- Base card size: 20% larger than current implementation
- Image aspect ratio: 1:1 (square)
- Border radius: 12px
- Padding: 20px (desktop), 16px (mobile)

**Shadow System** (3 elevation levels):
```css
/* Level 1: Base (static) */
.product-card {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* Level 2: Raised (interactive) */
.product-card-interactive {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Level 3: Lifted (hover) */
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  transition: all 300ms ease;
}
```

**Key Features**:
- Multi-layer shadow effects for depth
- Hover lift animation: 8px vertical translation
- Smooth transitions: 300ms duration
- Image zoom on hover: 105% scale
- Badge positioning: Top-left corner
- Price display: Large, bold typography

### 5. NewArrivalSection Component (New)

**Purpose**: Showcase recently added products (last 30 days)

**Interface**:
```typescript
interface NewArrivalSectionProps {
  products: Product[];
  maxProducts?: number; // Default: 8
}
```

**Grid Layout**:
- Desktop: 4-column grid
- Tablet: 3-column grid
- Mobile: 2-column grid

**Key Features**:
- Section heading: "Neu eingetroffen" in German
- Maximum 8 products displayed
- "View All" link to full catalog
- Uses enhanced ProductCard design
- Server-side filtering: products with createdAt within last 30 days

### 6. DealsOfTheDaySection Component (New)

**Purpose**: Display time-limited deals with countdown timers

**Interface**:
```typescript
interface DealsOfTheDaySectionProps {
  deals: Product[];
  maxDeals?: number; // Default: 4
}
```

**Grid Layout**:
- Desktop: 4-column grid
- Mobile: Horizontal scrollable layout

**Key Features**:
- Section heading: "Angebote des Tages" in German
- Countdown timer component for each deal
- Discount badge: Minimum 14px font size
- Horizontal scroll on mobile with snap points
- Uses enhanced ProductCard design
- Discount percentage calculation and display

## Data Models

### Enhanced Product Type

```typescript
interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  price: {
    eur: number;
    aliexpressEur: number;
  };
  variants: {
    colors: string[];
    models: string[];
  };
  aliexpressProductId: string;
  inStock: boolean;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  badge?: string | null;
  
  // New fields for enhanced features
  dealEndTime?: string; // ISO 8601 format for countdown
  featured?: boolean;   // For hero section
  discount?: number;    // Percentage discount
}
```

### Category Type

```typescript
interface Category {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean; // For size variation in grid
}
```

### Promotional Banner Type

```typescript
interface PromotionalBanner {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  gradientFrom: string;
  gradientTo: string;
  active: boolean;
}
```

## Design System Specifications

### Color Palette

```typescript
const colors = {
  // Primary
  primary: '#00A3E0',        // Electric Tech Blue
  
  // Backgrounds
  background: '#FFFFFF',     // White
  surface: '#F7F7F7',        // Off-white for cards
  surfaceLight: '#FAFAFA',   // Subtle section backgrounds
  
  // Borders
  border: '#E5E5E5',         // Light gray borders
  borderHover: '#00A3E0',    // Primary color on hover
  
  // Typography
  textMain: '#111111',       // Primary text
  textSecondary: '#666666',  // Secondary text
  textTertiary: '#999999',   // Tertiary text
  
  // Status
  success: '#10B981',        // Green for success states
  urgency: '#EF4444',        // Red for urgency/sales
  
  // Gradients
  gradientStart: '#00A3E0',
  gradientEnd: 'rgba(0, 163, 224, 0.7)',
};
```

### Typography Scale

```typescript
const typography = {
  // Headings
  h1: {
    fontSize: '4rem',      // 64px desktop
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.5rem',    // 40px desktop
    fontWeight: 800,
    lineHeight: 1.1,
  },
  h3: {
    fontSize: '1.5rem',    // 24px
    fontWeight: 700,
    lineHeight: 1.2,
  },
  
  // Body
  body: {
    fontSize: '1rem',      // 16px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  bodyLarge: {
    fontSize: '1.125rem',  // 18px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  
  // Small
  small: {
    fontSize: '0.875rem',  // 14px
    fontWeight: 400,
    lineHeight: 1.5,
  },
  tiny: {
    fontSize: '0.75rem',   // 12px
    fontWeight: 400,
    lineHeight: 1.4,
  },
};
```

### Spacing Scale

```typescript
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
};
```

### Shadow System (3 Elevation Levels)

```typescript
const shadows = {
  // Level 1: Base (static cards)
  elevation1: '0 10px 20px rgba(0, 0, 0, 0.05)',
  
  // Level 2: Raised (interactive cards)
  elevation2: '0 20px 40px rgba(0, 0, 0, 0.1)',
  
  // Level 3: Lifted (hover state)
  elevation3: '0 30px 60px rgba(0, 0, 0, 0.15)',
  
  // Special: Glow effect for CTAs
  glow: '0 0 20px rgba(0, 163, 224, 0.25)',
  glowHover: '0 0 30px rgba(0, 163, 224, 0.4)',
};
```

### Border Radius

```typescript
const borderRadius = {
  sm: '8px',      // Buttons, small cards
  md: '12px',     // Product cards, category cards
  lg: '24px',     // Promotional banners
  xl: '40px',     // Hero cards
};
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '0px',           // 0-767px
  tablet: '768px',         // 768-1023px
  desktop: '1024px',       // 1024px+
  wide: '1280px',          // Max content width
};
```

### Animation Timing

```typescript
const animations = {
  // Durations
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  
  // Easing functions
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
  easeInOut: 'cubic-bezier(0.87, 0, 0.13, 1)',
  
  // Transform properties
  lift: 'translateY(-8px)',
  liftSmall: 'translateY(-4px)',
  scale: 'scale(1.05)',
};
```

## Error Handling

### Image Loading Errors

**Strategy**: Graceful degradation with placeholder backgrounds

```typescript
// Image component with error handling
<Image
  src={product.images[0]}
  alt={product.title}
  fill
  onError={(e) => {
    e.currentTarget.src = '/placeholder-product.png';
  }}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

**Fallback UI**:
- Display light gray background (#F7F7F7)
- Show "Kein Bild" text in center
- Maintain aspect ratio to prevent layout shift

### Data Fetching Errors

**Strategy**: Show empty states with helpful messages

```typescript
// Empty state for no products
if (products.length === 0) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-[#E5E5E5] rounded-card">
      <p className="text-[#555555] text-lg font-medium">
        Noch keine Produkte
      </p>
      <p className="text-[#555555] text-sm mt-2">
        Importiere Produkte über das Admin-Panel.
      </p>
    </div>
  );
}
```

### Animation Performance Issues

**Strategy**: Disable animations on low-performance devices

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Layout Shift Prevention

**Strategy**: Reserve space for dynamic content

```typescript
// Use aspect-ratio to prevent layout shift
<div className="aspect-square relative">
  <Image src={src} alt={alt} fill />
</div>

// Use min-height for text content
<h3 className="min-h-[2.5rem] line-clamp-2">
  {product.title}
</h3>
```

## Testing Strategy

This feature involves UI rendering, layout, responsive design, and visual effects, which are NOT suitable for property-based testing. The testing strategy focuses on:

### 1. Visual Regression Testing

**Tools**: Playwright with screenshot comparison

**Test Cases**:
- Hero section layout on desktop, tablet, mobile
- Category grid responsiveness across breakpoints
- Product card hover states and animations
- Promotional banner gradient rendering
- Shadow system consistency across components

**Example Test**:
```typescript
test('hero section renders correctly on desktop', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('.hero-section')).toHaveScreenshot('hero-desktop.png');
});
```

### 2. Responsive Layout Testing

**Test Cases**:
- Grid column counts at each breakpoint
- Content stacking on mobile viewports
- Image sizing and aspect ratios
- Text readability at all sizes
- Touch target sizes on mobile (minimum 44x44px)

**Example Test**:
```typescript
test('category grid adapts to mobile viewport', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 375, height: 667 });
  
  const grid = page.locator('.category-grid');
  await expect(grid).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');
});
```

### 3. Animation Performance Testing

**Test Cases**:
- Hover animations complete within 300ms
- No layout thrashing during animations
- Smooth 60fps during scroll
- CSS transforms used (not layout properties)
- will-change applied to animated elements

**Example Test**:
```typescript
test('product card hover animation is smooth', async ({ page }) => {
  await page.goto('/');
  
  const card = page.locator('.product-card').first();
  await card.hover();
  
  // Check transform is applied
  await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -8)');
  
  // Check transition duration
  await expect(card).toHaveCSS('transition-duration', '0.3s');
});
```

### 4. Accessibility Testing

**Test Cases**:
- WCAG AA contrast ratios (minimum 4.5:1 for text)
- Keyboard navigation for interactive elements
- Focus indicators visible and clear
- Alt text for all images
- Semantic HTML structure
- Screen reader compatibility

**Example Test**:
```typescript
test('promotional banner has sufficient contrast', async ({ page }) => {
  await page.goto('/');
  
  const banner = page.locator('.promotional-banner');
  const textColor = await banner.evaluate((el) => 
    window.getComputedStyle(el).color
  );
  const bgColor = await banner.evaluate((el) => 
    window.getComputedStyle(el).backgroundColor
  );
  
  // Calculate contrast ratio and assert >= 4.5
  const contrastRatio = calculateContrast(textColor, bgColor);
  expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
});
```

### 5. Integration Testing

**Test Cases**:
- Product data fetching and rendering
- Category filtering functionality
- Cart interactions from product cards
- Navigation between sections
- Image lazy loading behavior

**Example Test**:
```typescript
test('new arrival section displays recent products', async ({ page }) => {
  await page.goto('/');
  
  const section = page.locator('.new-arrival-section');
  await expect(section).toBeVisible();
  
  const products = section.locator('.product-card');
  await expect(products).toHaveCount(8);
  
  // Verify "View All" link exists
  await expect(section.locator('a:has-text("Alle anzeigen")')).toBeVisible();
});
```

### 6. Performance Testing

**Metrics to Monitor**:
- Cumulative Layout Shift (CLS) < 0.1
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Image lazy loading effectiveness

**Tools**: Lighthouse, WebPageTest

### 7. Cross-Browser Testing

**Browsers to Test**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Test Cases**:
- Shadow rendering consistency
- Gradient display
- Border radius rendering
- Flexbox/Grid layout support
- CSS transform support

## Implementation Notes

### Phase 1: Foundation (Week 1)
1. Update Tailwind configuration with new design tokens
2. Create shadow system utility classes
3. Implement responsive breakpoint utilities
4. Set up animation timing functions

### Phase 2: Core Components (Week 2)
1. Enhance HeroSection with new layout
2. Create PromotionalBanner component
3. Enhance CategoryShowcase with dynamic grid
4. Enhance ProductCard with shadow system

### Phase 3: New Sections (Week 3)
1. Create NewArrivalSection component
2. Create DealsOfTheDaySection component
3. Implement countdown timer component
4. Add discount badge logic

### Phase 4: Polish & Testing (Week 4)
1. Implement all hover animations
2. Add lazy loading for images
3. Optimize for performance
4. Run visual regression tests
5. Conduct accessibility audit

### Migration Strategy

**Approach**: Gradual rollout with feature flags

1. Implement new components alongside existing ones
2. Use feature flag to toggle between old and new layouts
3. A/B test with subset of users
4. Monitor performance metrics
5. Full rollout after validation

### Performance Optimizations

1. **Image Optimization**:
   - Use Next.js Image component with automatic optimization
   - Implement lazy loading for below-fold images
   - Use blur placeholders to prevent layout shift
   - Serve WebP format with fallbacks

2. **CSS Optimization**:
   - Use CSS transforms for animations (GPU-accelerated)
   - Apply will-change to animated elements
   - Minimize repaints and reflows
   - Use CSS containment where appropriate

3. **Bundle Optimization**:
   - Code-split components with dynamic imports
   - Tree-shake unused Tailwind classes
   - Minimize CSS bundle size
   - Use React Server Components where possible

4. **Runtime Optimization**:
   - Debounce scroll and resize handlers
   - Use IntersectionObserver for lazy loading
   - Memoize expensive calculations
   - Avoid unnecessary re-renders

### Accessibility Considerations

1. **Color Contrast**: All text maintains WCAG AA contrast ratios (4.5:1 minimum)
2. **Keyboard Navigation**: All interactive elements accessible via keyboard
3. **Focus Indicators**: Clear, visible focus states for all interactive elements
4. **Semantic HTML**: Proper heading hierarchy and landmark regions
5. **Alt Text**: Descriptive alt text for all product images
6. **Motion**: Respect prefers-reduced-motion user preference
7. **Screen Readers**: ARIA labels where necessary, semantic HTML preferred

### Browser Support

**Target Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Mobile 90+

**Fallbacks**:
- CSS Grid with flexbox fallback
- CSS custom properties with fallback values
- Modern CSS features with @supports queries

## Conclusion

This design provides a comprehensive technical specification for implementing the Zaitron-inspired layout redesign. The focus is on creating a premium, modern e-commerce experience through enhanced visual hierarchy, sophisticated shadow systems, smooth animations, and responsive layouts—all while maintaining brand consistency and excellent performance.

The implementation prioritizes:
- **Visual Excellence**: Premium shadows, smooth animations, dynamic layouts
- **Performance**: 60fps animations, fast page loads, optimized images
- **Accessibility**: WCAG AA compliance, keyboard navigation, semantic HTML
- **Maintainability**: Consistent design system, reusable components, clear documentation

The testing strategy emphasizes visual regression testing, responsive layout validation, animation performance, and accessibility compliance—appropriate for a UI-focused feature where property-based testing is not applicable.
