import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import CountdownTimer from '@/components/ui/CountdownTimer';

interface Props {
  products: Product[];
}

function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h) ^ slug.charCodeAt(i);
  return Math.abs(h);
}

function fakeOriginalPrice(price: number): number {
  const raw = price * 1.4;
  return Math.floor(raw) + 0.99;
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
        <h2 className="text-2xl font-bold text-text-main">⚡ Flash Sale — Heute bis Mitternacht</h2>
        <CountdownTimer />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((product) => {
          const original = fakeOriginalPrice(product.price.eur);
          const pct = discountPct(original, product.price.eur);
          const stock = 2 + (hashSlug(product.slug) % 4); // 2-5

          return (
            <Link
              key={product.id}
              href={`/${product.slug}`}
              className="group block bg-white rounded-card border border-border card-hover overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            >
              <div className="relative aspect-square bg-surface overflow-hidden">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">Kein Bild</div>
                )}
                <span className="absolute top-2 left-2 bg-error text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{pct}%
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-text-main line-clamp-2 mb-2">{product.title}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-bold text-error">
                    {product.price.eur.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="text-xs text-text-secondary line-through">
                    {original.toFixed(2).replace('.', ',')} €
                  </span>
                </div>
                <p className="text-xs font-semibold text-urgency">⚠️ Nur noch {stock} Stück!</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
