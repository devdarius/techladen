'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/lib/cart-store';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const badge = (product as Product & { badge?: string }).badge;

  return (
    <Link
      href={`/${product.slug}`}
      className="group block bg-white rounded-card border border-border card-hover"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface rounded-t-card overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-secondary text-sm">
            Kein Bild
          </div>
        )}

        {badge && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-text-secondary font-semibold text-sm bg-white px-3 py-1 rounded-full border border-border">
              Ausverkauft
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-main line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3.5 h-3.5 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
            />
          ))}
          <span className="text-xs text-text-secondary ml-1">4.5</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-bold text-primary">
              {product.price.eur.toFixed(2).replace('.', ',')} €
            </p>
            <p className="text-xs text-text-secondary">inkl. MwSt.</p>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn-primary w-full mt-3 py-2.5 flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          In den Warenkorb
        </button>
      </div>
    </Link>
  );
}
