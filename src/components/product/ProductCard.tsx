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
      className="group flex flex-col h-full card-lift rounded-xl overflow-hidden relative">

      {/* Image */}
      <div className="relative aspect-square bg-white overflow-hidden p-6 flex items-center justify-center">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.title} fill
            className="object-contain p-5"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#999999] text-sm">Kein Bild</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-[#F7F7F7] text-[#111111] text-[10px] font-bold px-2 py-1 rounded shadow-md border border-[#E5E5E5]">
              {product.badge}
            </span>
          )}
          <span className="bg-urgency text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
            Save {pct}%
          </span>
        </div>

        {/* Sold */}
        <div className="absolute bottom-3 left-3 bg-white/90 text-[#111111] text-[10px] font-semibold px-2 py-1 rounded backdrop-blur-sm border border-[#E5E5E5]">
          {sold}× verkauft
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-[#111111] font-semibold text-sm border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-1.5 rounded-lg shadow-lg">
              Ausverkauft
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-[#111111] line-clamp-2 mb-2 min-h-[2.5rem] leading-snug group-hover:text-[#00A3E0] transition-colors">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} className={`w-3 h-3 ${s <= Math.round(Number(rating)) ? 'text-[#00A3E0] fill-[#00A3E0]' : 'text-[#E5E5E5] fill-[#E5E5E5]'}`} />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#666666]">{rating}</span>
          <span className="text-xs text-[#999999]">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-black text-[#111111]">
            {product.price.eur.toFixed(2).replace('.', ',')} €
          </span>
          <span className="text-sm text-[#999999] line-through">
            {original.toFixed(2).replace('.', ',')} €
          </span>
        </div>
        <p className="text-[11px] text-[#999999] mb-4">inkl. MwSt.</p>

        {stock <= 4 && product.inStock && (
          <p className="text-[11px] font-semibold text-urgency mb-3">
            Nur noch {stock} Stück verfügbar
          </p>
        )}

        <button onClick={handleAdd} disabled={!product.inStock}
          className="w-full btn-cta py-3 mt-auto">
          <ShoppingCart className="w-4 h-4" />
          In den Warenkorb
        </button>
      </div>
    </Link>
  );
}
