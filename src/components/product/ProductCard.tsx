'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
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

  return (
    <Link
      href={`/${product.slug}`}
      className="group block bg-card rounded-xl overflow-hidden border border-slate-800 hover:border-accent transition-all duration-200 hover:shadow-lg hover:shadow-accent/10"
      style={{ '--tw-shadow-color': '#00D4FF' } as React.CSSProperties}
    >
      <div className="relative aspect-square bg-slate-900 overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
            Kein Bild
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-slate-800 px-3 py-1 rounded-full">
              Ausverkauft
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-slate-200 line-clamp-2 mb-2 group-hover:text-white transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-lg font-bold text-white">
              {product.price.eur.toFixed(2).replace('.', ',')} €
            </p>
            <p className="text-xs text-slate-500">inkl. 19% MwSt.</p>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed text-black"
            style={{ backgroundColor: '#00D4FF' }}
            aria-label={`${product.title} in den Warenkorb`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Kaufen</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
