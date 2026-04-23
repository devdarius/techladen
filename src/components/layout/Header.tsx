'use client';

import Link from 'next/link';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function Header() {
  const { items, openCart } = useCartStore();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0F1E]/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap className="text-accent w-6 h-6" style={{ color: '#00D4FF' }} />
          <span className="text-white">Tech</span>
          <span style={{ color: '#00D4FF' }}>Laden</span>
          <span className="text-slate-400 text-sm font-normal">.de</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Shop
          </Link>
          <Link href="/impressum" className="hover:text-white transition-colors">
            Impressum
          </Link>
          <Link href="/agb" className="hover:text-white transition-colors">
            AGB
          </Link>
        </nav>

        <button
          onClick={openCart}
          className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Warenkorb öffnen"
        >
          <ShoppingCart className="w-6 h-6 text-slate-300" />
          {count > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-black"
              style={{ backgroundColor: '#00D4FF' }}
            >
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
