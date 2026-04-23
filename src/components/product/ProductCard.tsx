'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Flame } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/lib/cart-store';

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h);
}

function fakeOriginalPrice(p: number) { return Math.floor(p * 1.38) + 0.99; }

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const h = hashSlug(product.slug);
  const stock = 2 + (h % 6);
  const sold = 80 + (h % 420);
  const rating = 4.2 + ((h % 8) / 10);
  const reviews = 18 + (h % 180);
  const original = fakeOriginalPrice(product.price.eur);
  const pct = Math.round(((original - product.price.eur) / original) * 100);
  const badge = product.badge;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Link href={`/${product.slug}`}
      className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden card-lift">

      {/* Image area */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.title} fill
            className="object-contain p-5 group-hover:scale-[1.06] transition-transform duration-400"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">Kein Bild</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badge && (
            <span className="badge bg-indigo-600 text-white">{badge}</span>
          )}
          <span className="badge bg-red-500 text-white">-{pct}%</span>
        </div>

        {/* Sold counter */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
          <Flame className="w-3 h-3 text-orange-400" />
          {sold}× verkauft
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-slate-500 font-semibold text-sm bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
              Ausverkauft
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 min-h-[2.5rem] leading-snug">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-600">{rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-black text-slate-900">
            {product.price.eur.toFixed(2).replace('.', ',')} €
          </span>
          <span className="text-sm text-slate-400 line-through">
            {original.toFixed(2).replace('.', ',')} €
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">inkl. MwSt.</p>

        {/* Stock warning */}
        {stock <= 4 && product.inStock && (
          <p className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 mb-3">
            ⚡ Nur noch {stock} Stück verfügbar
          </p>
        )}

        <button onClick={handleAdd} disabled={!product.inStock}
          className="btn-cta w-full py-2.5 text-sm">
          <ShoppingCart className="w-4 h-4" />
          In den Warenkorb
        </button>
      </div>
    </Link>
  );
}
