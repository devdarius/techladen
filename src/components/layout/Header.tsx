'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Zap, Menu, X, ChevronDown, User } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';

const CATEGORIES = ['MagSafe', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks', 'Gaming', 'Smartwatch', 'Zubehör'];

export default function Header() {
  const { items, openCart } = useCartStore();
  const { user } = useAuthStore();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-text-main">Tech</span>
          <span className="text-xl font-light text-text-secondary">Laden.de</span>
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-main">
          <Link href="/" className="hover:text-primary transition-colors">
            Shop
          </Link>

          {/* Kategorien dropdown */}
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              Kategorien <ChevronDown className="w-4 h-4" />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded-card shadow-card-hover py-2 min-w-[180px] z-50">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/?kategorie=${cat}`}
                    className="block px-4 py-2 text-sm text-text-main hover:bg-surface hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/?badge=Angebote" className="hover:text-primary transition-colors">
            Angebote
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-btn hover:bg-surface transition-colors text-text-secondary hover:text-text-main"
            aria-label="Suche"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href={user ? '/mein-konto' : '/anmelden'}
            className="p-2 rounded-btn hover:bg-surface transition-colors text-text-secondary hover:text-text-main"
            aria-label="Konto"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 rounded-btn hover:bg-surface transition-colors text-text-secondary hover:text-text-main"
            aria-label="Warenkorb"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-btn hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          <Link href="/" className="block py-2 text-sm font-medium hover:text-primary" onClick={() => setMobileOpen(false)}>Shop</Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/?kategorie=${cat}`}
              className="block py-2 text-sm text-text-secondary hover:text-primary pl-3"
              onClick={() => setMobileOpen(false)}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
