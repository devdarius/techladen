# Implementation Plan: Zaitron Layout Redesign

## Overview

This implementation plan transforms TechLaden's homepage into a premium, dynamic e-commerce experience with enhanced visual hierarchy, sophisticated shadow systems, and responsive layouts. The implementation uses Next.js 14+, React, TypeScript, and Tailwind CSS to create larger hero sections, dynamic category grids, premium product cards, and new promotional sections.

## Tasks

- [x] 1. Set up design system foundation
  - Update Tailwind configuration with new color palette, spacing scale, typography scale, shadow system, and border radius values
  - Create custom utility classes for the 3-level elevation shadow system
  - Add responsive breakpoint utilities (mobile: 0-767px, tablet: 768-1023px, desktop: 1024px+)
  - Configure animation timing functions (fast: 150ms, normal: 300ms, slow: 500ms)
  - Add CSS for prefers-reduced-motion support
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3_

- [x] 2. Create PromotionalBanner component
  - [x] 2.1 Implement PromotionalBanner component with TypeScript interface
    - Create component file at `src/components/home/PromotionalBanner.tsx`
    - Define `PromotionalBannerProps` interface with title, description, ctaText, ctaHref, gradientFrom, gradientTo
    - Implement gradient background using Electric Tech Blue (#00A3E0) with 30% opacity variation
    - Add responsive layout: horizontal on desktop, vertical stack on mobile
    - Implement CTA button with hover lift effect (4px vertical translation, 300ms transition)
    - Apply minimum height of 200px on desktop, 150px on mobile
    - Use border-radius of 24px
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [x] 2.2 Write unit tests for PromotionalBanner component
    - Test component renders with all props
    - Test gradient background is applied correctly
    - Test responsive layout changes at breakpoints
    - Test CTA button click navigation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 3. Enhance HeroSection component
  - [x] 3.1 Refactor HeroSection layout structure
    - Update `src/components/home/HeroSection.tsx` with two-column layout
    - Implement 60/40 split for product showcase and promotional banner on desktop
    - Implement 50/50 split on tablet viewports
    - Implement vertical stack on mobile viewports
    - Set minimum viewport height to 50vh on desktop, 60vh on mobile
    - Add gradient background from white via gray-50 to blue-50
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [x] 3.2 Enhance hero product card styling
    - Apply border-radius of 40px to hero product cards
    - Implement elevation2 shadow (0 20px 60px rgba(0, 0, 0, 0.1))
    - Add hover animation: translateY(-8px) with elevation3 shadow
    - Set product images to minimum 400x400px on desktop
    - Add 300ms transition for all hover effects
    - Use will-change property for transform optimization
    - _Requirements: 1.1, 1.7, 7.1, 7.2, 7.3, 7.4, 7.5, 10.1, 10.2, 10.3_
  
  - [x] 3.3 Integrate PromotionalBanner into HeroSection
    - Add PromotionalBanner component to HeroSection layout
    - Pass German promotional content as props
    - Position banner in the 40% column on desktop
    - _Requirements: 1.2, 1.3, 1.4, 1.6, 4.1, 4.3_
  
  - [x] 3.4 Write visual regression tests for HeroSection
    - Test hero section layout on desktop (1280x800)
    - Test hero section layout on tablet (768x1024)
    - Test hero section layout on mobile (375x667)
    - Test product card hover state rendering
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.7_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Enhance ProductCard component
  - [x] 5.1 Update ProductCard styling and structure
    - Update `src/components/product/ProductCard.tsx` with enhanced design
    - Increase base card size by 20% (adjust padding and spacing)
    - Apply border-radius of 12px
    - Implement 3-level shadow system: elevation1 (base), elevation2 (interactive), elevation3 (hover)
    - Add hover animation: translateY(-8px) with 300ms transition
    - Add image zoom on hover: scale(1.05) with 300ms transition
    - Set image aspect ratio to 1:1 (square)
    - Apply will-change property to animated elements
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 7.1, 7.2, 7.3, 7.4, 7.5, 10.1, 10.2, 10.3_
  
  - [x] 5.2 Add badge positioning and styling
    - Position badge at top-left corner of product card
    - Ensure badge displays with minimum 14px font size
    - Apply appropriate background color and padding
    - _Requirements: 3.6, 6.8_
  
  - [x] 5.3 Enhance price display typography
    - Use large, bold typography for price display
    - Maintain German currency formatting (EUR)
    - Apply primary text color (#111111)
    - _Requirements: 3.6, 9.3_
  
  - [x] 5.4 Write unit tests for ProductCard component
    - Test card renders with all product data
    - Test hover state applies correct transform and shadow
    - Test image aspect ratio is maintained
    - Test badge displays when present
    - Test price formatting is correct
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 6. Enhance CategoryShowcase component
  - [x] 6.1 Implement dynamic grid layout
    - Update `src/components/home/CategoryShowcase.tsx` with responsive grid
    - Implement 4-column grid on desktop (≥1024px)
    - Implement 3-column grid on tablet (768px-1023px)
    - Implement 2-column grid on mobile (<768px)
    - Add featured category support with 1.5x size (grid-column: span 2, grid-row: span 2)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [x] 6.2 Apply enhanced card styling
    - Apply border-radius of 12px to category cards
    - Implement elevation1 shadow for base state
    - Add hover animation: translateY(-8px) with elevation2 shadow
    - Add border color change on hover (from #E5E5E5 to #00A3E0)
    - Set transition duration to 300ms
    - Set icon size to 32px on desktop, 24px on mobile
    - _Requirements: 2.7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 10.1, 10.2_
  
  - [x] 6.3 Write responsive layout tests for CategoryShowcase
    - Test 4-column grid on desktop viewport
    - Test 3-column grid on tablet viewport
    - Test 2-column grid on mobile viewport
    - Test featured category spans 2 columns and 2 rows
    - Test hover animation applies correct transform
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_

- [x] 7. Create NewArrivalSection component
  - [x] 7.1 Implement NewArrivalSection component
    - Create component file at `src/components/home/NewArrivalSection.tsx`
    - Define `NewArrivalSectionProps` interface with products array and maxProducts (default: 8)
    - Add section heading "Neu eingetroffen" in German
    - Implement 4-column grid on desktop, 3-column on tablet, 2-column on mobile
    - Use enhanced ProductCard component for product display
    - Add "Alle anzeigen" (View All) link to full catalog
    - Limit display to maximum 8 products
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 7.2 Add server-side data fetching for new arrivals
    - Update homepage data fetching to filter products by createdAt within last 30 days
    - Sort products by createdAt descending
    - Pass filtered products to NewArrivalSection component
    - _Requirements: 5.2_
  
  - [x] 7.3 Write integration tests for NewArrivalSection
    - Test section displays with correct heading
    - Test maximum 8 products are displayed
    - Test "View All" link is present and functional
    - Test responsive grid layout at all breakpoints
    - Test products are sorted by creation date
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 8. Create DealsOfTheDaySection component
  - [x] 8.1 Implement countdown timer component
    - Create component file at `src/components/ui/CountdownTimer.tsx`
    - Define `CountdownTimerProps` interface with endTime (ISO 8601 string)
    - Implement countdown logic using React hooks
    - Display time remaining in format: "HH:MM:SS" or "DD:HH:MM"
    - Update countdown every second
    - Handle expired deals gracefully
    - _Requirements: 6.7_
  
  - [x] 8.2 Implement DealsOfTheDaySection component
    - Create component file at `src/components/home/DealsOfTheDaySection.tsx`
    - Define `DealsOfTheDaySectionProps` interface with deals array and maxDeals (default: 4)
    - Add section heading "Angebote des Tages" in German
    - Implement 4-column grid on desktop
    - Implement horizontal scrollable layout with snap points on mobile
    - Use enhanced ProductCard component for deal display
    - Integrate CountdownTimer component for each deal
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  
  - [x] 8.3 Add discount badge logic
    - Calculate discount percentage from original and sale prices
    - Display discount badge with minimum 14px font size
    - Position badge at top-left corner of product card
    - Use urgency color (#EF4444) for badge background
    - Format discount as percentage (e.g., "-25%")
    - _Requirements: 6.8, 9.7_
  
  - [x] 8.4 Update Product type with deal fields
    - Add `dealEndTime?: string` field to Product interface
    - Add `discount?: number` field to Product interface
    - Update product data fetching to include deal information
    - _Requirements: 6.2, 6.7, 6.8_
  
  - [x] 8.5 Write unit tests for CountdownTimer component
    - Test countdown displays correct time format
    - Test countdown updates every second
    - Test expired deals show appropriate message
    - Test component handles invalid dates gracefully
    - _Requirements: 6.7_
  
  - [x] 8.6 Write integration tests for DealsOfTheDaySection
    - Test section displays with correct heading
    - Test maximum 4 deals are displayed
    - Test horizontal scroll works on mobile
    - Test countdown timer displays for each deal
    - Test discount badge displays with correct percentage
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Integrate all components into homepage
  - [x] 10.1 Update homepage component structure
    - Update `src/app/page.tsx` with new component hierarchy
    - Add HeroSection (enhanced) at top
    - Add TrustSection (existing) after hero
    - Add CategoryShowcase (enhanced) after trust section
    - Add NewArrivalSection (new) after categories
    - Add DealsOfTheDaySection (new) after new arrivals
    - Add FlashSaleSection (existing) after deals
    - Add ProductGrid (enhanced) with enhanced ProductCard
    - Add RecentlyViewed (existing) near bottom
    - Add NewsletterSection (existing) at bottom
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.1_
  
  - [x] 10.2 Update homepage data fetching
    - Fetch featured products for HeroSection
    - Fetch new arrivals (last 30 days) for NewArrivalSection
    - Fetch active deals for DealsOfTheDaySection
    - Fetch all products for ProductGrid
    - Ensure all data fetching is server-side
    - _Requirements: 5.2, 6.2_
  
  - [x] 10.3 Write integration tests for homepage
    - Test all sections render in correct order
    - Test data is fetched and passed to components correctly
    - Test responsive layout at all breakpoints
    - Test navigation between sections works
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.1_

- [ ] 11. Implement image optimization and lazy loading
  - [x] 11.1 Configure Next.js Image component
    - Ensure all product images use Next.js Image component
    - Configure blur placeholders to prevent layout shift
    - Set up automatic WebP format with fallbacks
    - Define image sizes for responsive loading
    - _Requirements: 10.4, 10.5_
  
  - [x] 11.2 Add lazy loading for below-fold images
    - Implement IntersectionObserver for lazy loading
    - Add loading="lazy" attribute to below-fold images
    - Use aspect-ratio CSS to reserve space and prevent layout shift
    - Add placeholder backgrounds (#F7F7F7) during image load
    - _Requirements: 10.4, 10.5, 10.6_
  
  - [x] 11.3 Implement image error handling
    - Add onError handler to Image components
    - Display fallback placeholder image on error
    - Show "Kein Bild" text in center of placeholder
    - Maintain aspect ratio to prevent layout shift
    - _Requirements: 10.4, 10.6_
  
  - [x] 11.4 Write performance tests for image loading
    - Test images lazy load below the fold
    - Test blur placeholders prevent layout shift
    - Test fallback images display on error
    - Test CLS score is less than 0.1
    - _Requirements: 10.4, 10.5, 10.6_

- [ ] 12. Add responsive padding and max-width constraints
  - [x] 12.1 Apply responsive padding to all sections
    - Add horizontal padding of 16px on mobile viewports (<768px)
    - Add horizontal padding of 24px on desktop viewports (≥1024px)
    - Apply padding consistently across all homepage sections
    - _Requirements: 8.6, 8.7_
  
  - [x] 12.2 Set maximum content width
    - Apply maximum content width of 1280px on desktop viewports
    - Center content horizontally when viewport exceeds max width
    - Ensure all sections respect max-width constraint
    - _Requirements: 8.5_
  
  - [x] 12.3 Write responsive layout tests
    - Test padding is correct at mobile breakpoint
    - Test padding is correct at desktop breakpoint
    - Test content is centered when viewport exceeds 1280px
    - Test all sections respect max-width constraint
    - _Requirements: 8.5, 8.6, 8.7_

- [ ] 13. Implement accessibility features
  - [x] 13.1 Ensure WCAG AA contrast ratios
    - Verify all text on gradient backgrounds meets 4.5:1 contrast ratio
    - Adjust gradient opacity if needed to meet contrast requirements
    - Test contrast ratios for all color combinations
    - _Requirements: 7.7_
  
  - [x] 13.2 Add keyboard navigation support
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators to all focusable elements
    - Test tab order is logical and intuitive
    - Add skip-to-content link for keyboard users
    - _Requirements: 7.7_
  
  - [x] 13.3 Add semantic HTML and ARIA labels
    - Use proper heading hierarchy (h1, h2, h3)
    - Add landmark regions (header, main, footer, nav)
    - Add descriptive alt text to all product images
    - Add ARIA labels where semantic HTML is insufficient
    - _Requirements: 7.7_
  
  - [x] 13.4 Write accessibility tests
    - Test contrast ratios meet WCAG AA standards
    - Test keyboard navigation works for all interactive elements
    - Test focus indicators are visible
    - Test screen reader compatibility
    - Test semantic HTML structure is correct
    - _Requirements: 7.7_

- [x] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Performance optimization and validation
  - [x] 15.1 Optimize CSS animations
    - Verify all animations use CSS transforms (not layout properties)
    - Add will-change property to animated elements
    - Remove will-change after animation completes
    - Ensure all animations complete within 300ms
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [x] 15.2 Run Lighthouse performance audit
    - Test Cumulative Layout Shift (CLS) is less than 0.1
    - Test First Contentful Paint (FCP) is less than 1.8s
    - Test Largest Contentful Paint (LCP) is less than 2.5s
    - Test Time to Interactive (TTI) is less than 3.8s
    - Identify and fix any performance bottlenecks
    - _Requirements: 10.6_
  
  - [x] 15.3 Validate 60fps during interactions
    - Test scroll performance maintains 60fps
    - Test hover animations maintain 60fps
    - Use Chrome DevTools Performance panel to identify jank
    - Optimize any animations causing frame drops
    - _Requirements: 10.6_
  
  - [x] 15.4 Write performance tests
    - Test CLS score is less than 0.1
    - Test FCP is less than 1.8s
    - Test LCP is less than 2.5s
    - Test animations use CSS transforms
    - Test will-change is applied to animated elements
    - _Requirements: 10.1, 10.2, 10.3, 10.6_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All components use TypeScript for type safety
- All text content is in German to maintain brand consistency
- The design system foundation (Task 1) must be completed before other tasks
- Enhanced ProductCard is used across multiple sections (NewArrivalSection, DealsOfTheDaySection, ProductGrid)
- Image optimization is critical for performance and should not be skipped
- Accessibility features are essential for WCAG compliance
