'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
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
  const rating = (4.2 + ((h % 8) / 10)).toFixed(1);
  const reviews = 18 + (h % 180);
  const original = fakeOriginalPrice(product.price.eur);
  const pct = Math.round(((original - product.price.eur) / original) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <Link href={`/${product.slug}`}
      className="group block bg-white border border-[#E8E8E8] rounded-xl overflow-hidden hover:border-black hover:shadow-lg transition-all duration-200">

      {/* Image */}
      <div className="relative aspect-square bg-[#F7F7F7] overflow-hidden">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.title} fill
            className="object-contain p-5 group-hover:scale-[1.04] transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#ccc] text-sm">Kein Bild</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {product.badge}
            </span>
          )}
          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            -{pct}%
          </span>
        </div>

        {/* Sold */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-semibold px-2 py-1 rounded">
          {sold}× verkauft
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="text-[#666] font-semibold text-sm border border-[#E8E8E8] bg-white px-4 py-1.5 rounded-lg">
              Ausverkauft
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-black line-clamp-2 mb-2 min-h-[2.5rem] leading-snug">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(Number(rating)) ? 'text-amber-400 fill-amber-400' : 'text-[#E8E8E8] fill-[#E8E8E8]'}`} />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#666]">{rating}</span>
          <span className="text-xs text-[#bbb]">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-black text-black">
            {product.price.eur.toFixed(2).replace('.', ',')} €
          </span>
          <span className="text-sm text-[#bbb] line-through">
            {original.toFixed(2).replace('.', ',')} €
          </span>
        </div>
        <p className="text-[11px] text-[#bbb] mb-3">inkl. MwSt.</p>

        {stock <= 4 && product.inStock && (
          <p className="text-[11px] font-semibold text-amber-600 mb-3">
            Nur noch {stock} Stück verfügbar
          </p>
        )}

        <button onClick={handleAdd} disabled={!product.inStock}
          className="w-full bg-black text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#222] transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
          <ShoppingCart className="w-4 h-4" />
          In den Warenkorb
        </button>
      </div>
    </Link>
  );
}
