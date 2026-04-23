'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, ChevronDown, User } from 'lucide-react';
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
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header className={`sticky top-0 z-40 bg-white transition-shadow duration-150 ${scrolled ? 'shadow-sm' : 'border-b border-[#E8E8E8]'}`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="font-black text-xl tracking-tight text-black flex-shrink-0">
          TECH<span className="font-light">LADEN</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#444]">
          <Link href="/" className="hover:text-black transition-colors">Shop</Link>
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="flex items-center gap-1 hover:text-black transition-colors">
              Kategorien <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-[#E8E8E8] rounded-xl shadow-lg py-2 min-w-[180px] z-50">
                {CATEGORIES.map((cat) => (
                  <Link key={cat} href={`/?kategorie=${cat}`}
                    className="block px-4 py-2 text-sm text-[#444] hover:text-black hover:bg-[#F7F7F7] transition-colors">
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/?badge=Angebote" className="hover:text-black transition-colors text-red-600 font-semibold">Sale</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors text-[#666]" aria-label="Suche">
            <Search className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </button>
          <Link href={user ? '/mein-konto' : '/anmelden'}
            className="p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors text-[#666]">
            <User style={{ width: 18, height: 18 }} />
          </Link>
          <button onClick={openCart} className="relative p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors text-[#666]">
            <ShoppingCart style={{ width: 18, height: 18 }} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ width: 18, height: 18 }}>
                {count}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 rounded-lg hover:bg-[#F7F7F7]" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E8E8E8] bg-white px-6 py-3 space-y-0.5">
          <Link href="/" className="block py-2.5 text-sm font-semibold" onClick={() => setMobileOpen(false)}>Shop</Link>
          <p className="text-[11px] font-bold text-[#999] uppercase tracking-widest pt-2 pb-1">Kategorien</p>
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/?kategorie=${cat}`}
              className="block py-2 text-sm text-[#555] hover:text-black pl-2"
              onClick={() => setMobileOpen(false)}>{cat}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
