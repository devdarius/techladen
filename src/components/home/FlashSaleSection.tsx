import Link from 'next/link';
import Image from 'next/image';
import { Zap, AlertTriangle } from 'lucide-react';
import type { Product } from '@/types/product';
import CountdownTimer from '@/components/ui/CountdownTimer';

interface Props { products: Product[] }

function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h) ^ slug.charCodeAt(i);
  return Math.abs(h);
}

function fakeOriginalPrice(price: number): number {
  return Math.floor(price * 1.4) + 0.99;
}

function discountPct(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export default function FlashSaleSection({ products }: Props) {
  const items = products.slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Flash Sale — Heute bis Mitternacht
        </h2>
        <CountdownTimer />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((product) => {
          const original = fakeOriginalPrice(product.price.eur);
          const pct = discountPct(original, product.price.eur);
          const stock = 2 + (hashSlug(product.slug) % 4);

          return (
            <Link
              key={product.id}
              href={`/${product.slug}`}
              className="group block bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="relative aspect-square bg-slate-50 overflow-hidden">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Kein Bild</div>
                )}
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  -{pct}%
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-slate-800 line-clamp-2 mb-2">{product.title}</p>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-base font-bold text-red-500">
                    {product.price.eur.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {original.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Nur noch {stock} Stück!
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
