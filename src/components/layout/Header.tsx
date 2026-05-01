'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Zap, Magnet, Smartphone, BatteryCharging, Cable, ShieldCheck, Battery, Gamepad2, Watch, Headphones, Percent, Home } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';

const CATEGORIES = [
  { name: 'MagSafe',    icon: Magnet },
  { name: 'Hüllen',     icon: Smartphone },
  { name: 'Ladegeräte', icon: BatteryCharging },
  { name: 'Kabel',      icon: Cable },
  { name: 'Schutzglas', icon: ShieldCheck },
  { name: 'Powerbanks', icon: Battery },
  { name: 'Gaming',     icon: Gamepad2 },
  { name: 'Smartwatch', icon: Watch },
  { name: 'Zubehör',    icon: Headphones },
];

export default function Header() {
  const { items, openCart } = useCartStore();
  const { user } = useAuthStore();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = items.reduce((s, i) => s + i.price.eur * i.quantity, 0);

  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [catOpen, setCatOpen]         = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 glass-header ${scrolled ? 'shadow-md shadow-blue-100/60' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)'
          }}>
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-[#0F172A]">
            Tech<span className="gradient-text">Laden</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2 text-sm font-semibold text-[#64748B]">
          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-[#F8FAFF] hover:text-[#2563EB] transition-all">
            Shop
          </Link>

          {/* Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#F8FAFF] hover:text-[#2563EB] transition-all">
              Kategorien <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 min-w-[220px] z-50"
                style={{ boxShadow: '0 20px 60px rgba(37,99,235,0.15)' }}>
                <p className="px-4 py-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Alle Kategorien</p>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/?kategorie=${cat.name}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F8FAFF] hover:text-[#2563EB] transition-colors"
                    onClick={() => setCatOpen(false)}
                  >
                    <cat.icon className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/?badge=Angebote"
            className="px-3 py-2 rounded-lg text-[#FF5733] hover:bg-[#FFF4F1] font-bold transition-all flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" /> Sale
          </Link>
        </nav>

        {/* Search bar — center, desktop */}
        <div className={`hidden md:flex flex-1 max-w-sm mx-auto transition-all duration-200`}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="search"
              placeholder="Suche nach Produkten..."
              className="search-input pl-9 pr-4 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 ml-auto">
          {/* Mobile search toggle */}
          <button
            className="md:hidden p-2.5 rounded-lg hover:bg-[#F8FAFF] text-[#64748B] hover:text-[#2563EB] transition-all"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Suche öffnen"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User */}
          <Link
            href={user ? '/mein-konto' : '/anmelden'}
            className="p-2.5 rounded-lg hover:bg-[#F8FAFF] text-[#64748B] hover:text-[#2563EB] transition-all"
            aria-label="Mein Konto"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-xl hover:bg-[#F8FAFF] text-[#64748B] hover:text-[#2563EB] transition-all group"
            aria-label="Warenkorb öffnen"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[#2563EB] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-count"
                  style={{ width: 17, height: 17, minWidth: 17 }}>
                  {count}
                </span>
              )}
            </div>
            {count > 0 && (
              <span className="hidden sm:block text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {cartTotal.toFixed(2).replace('.', ',')} €
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden p-2.5 rounded-lg hover:bg-[#F8FAFF] text-[#64748B] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] px-4 py-3 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Suche nach Produkten..."
              className="search-input pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-1 shadow-lg">
          <Link href="/"
            className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFF] hover:text-[#2563EB] transition-colors"
            onClick={() => setMobileOpen(false)}>
            <Home className="w-4 h-4" /> Shop
          </Link>
          <Link href="/?badge=Angebote"
            className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold text-[#FF5733] hover:bg-[#FFF4F1] transition-colors"
            onClick={() => setMobileOpen(false)}>
            <Percent className="w-4 h-4" /> Sale
          </Link>
          <div className="pt-2">
            <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest px-3 pb-2">Kategorien</p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/?kategorie=${cat.name}`}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFF] hover:text-[#2563EB] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <cat.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
