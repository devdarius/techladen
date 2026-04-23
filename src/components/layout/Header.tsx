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
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
      scrolled ? 'shadow-lg shadow-slate-200/60' : 'border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-slate-900 text-lg">Tech<span className="text-indigo-600">Laden</span><span className="text-slate-400 font-light">.de</span></span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link href="/" className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all">
            Shop
          </Link>

          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all">
              Kategorien <ChevronDown className={`w-3.5 h-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 min-w-[200px] z-50">
                {CATEGORIES.map((cat) => (
                  <Link key={cat} href={`/?kategorie=${cat}`}
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium">
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/?badge=Angebote"
            className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all font-semibold">
            Sale 🔥
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900" aria-label="Suche">
            <Search className="w-5 h-5" />
          </button>

          <Link href={user ? '/mein-konto' : '/anmelden'}
            className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900" aria-label="Konto">
            <User className="w-5 h-5" />
          </Link>

          <button onClick={openCart}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900" aria-label="Warenkorb">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </button>

          <button className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-0.5">
          <Link href="/" className="block py-2.5 text-sm font-semibold text-slate-800 hover:text-indigo-600" onClick={() => setMobileOpen(false)}>Shop</Link>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2 pb-1 px-1">Kategorien</p>
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/?kategorie=${cat}`}
              className="block py-2 text-sm text-slate-600 hover:text-indigo-600 pl-3 rounded-lg hover:bg-indigo-50 transition-colors"
              onClick={() => setMobileOpen(false)}>
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
