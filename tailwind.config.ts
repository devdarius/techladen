import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === Base ===
        background:       '#FFFFFF',
        surface:          '#F8FAFF',   // Very slight blue tint
        'surface-2':      '#F1F5FF',   // Cards, sections
        'surface-warm':   '#FFF8F5',   // Orange-tinted sections (FlashSale)
        border:           '#E2E8F0',
        'border-strong':  '#CBD5E1',

        // === Brand ===
        primary:          '#2563EB',   // Electric Blue — main brand
        'primary-hover':  '#1D4ED8',
        'primary-light':  '#EFF6FF',   // Blue tinted bg
        'primary-mid':    '#BFDBFE',

        // === Accent / Urgency ===
        accent:           '#FF5733',   // Coral Orange — CTAs, badges
        'accent-hover':   '#E84520',
        'accent-light':   '#FFF4F1',

        // === Secondary accents ===
        teal:             '#0EA5E9',
        purple:           '#7C3AED',
        'purple-light':   '#F5F3FF',
        emerald:          '#10B981',
        amber:            '#F59E0B',

        // === Text ===
        'text-main':      '#0F172A',
        'text-secondary': '#64748B',
        'text-muted':     '#94A3B8',

        // === Semantic ===
        success:          '#10B981',
        urgency:          '#EF4444',
        warning:          '#F59E0B',
      },
      fontFamily: {
        sans:     ['Inter', 'sans-serif'],
        display:  ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        btn:  '10px',
        xl2:  '20px',
        xl3:  '28px',
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(37, 99, 235, 0.08)',
        'card-hover': '0 8px 32px rgba(37, 99, 235, 0.18)',
        'btn':        '0 4px 14px rgba(37, 99, 235, 0.25)',
        'btn-accent': '0 4px 14px rgba(255, 87, 51, 0.35)',
        'glow-blue':  '0 0 24px rgba(37, 99, 235, 0.3)',
      },
      keyframes: {
        'marquee': {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'marquee':  'marquee 22s linear infinite',
        'fade-in':  'fade-in 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
