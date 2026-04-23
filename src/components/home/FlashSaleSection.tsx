import Link from 'next/link';
import Image from 'next/image';
import { Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Product } from '@/types/product';
import CountdownTimer from '@/components/ui/CountdownTimer';

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h);
}

function fakeOriginalPrice(p: number) { return Math.floor(p * 1.4) + 0.99; }
function pct(orig: number, cur: number) { return Math.round(((orig - cur) / orig) * 100); }

export default function FlashSaleSection({ products }: { products: Product[] }) {
  const items = products.slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Nur heute</span>
            </div>
            <h2 className="text-2xl font-black text-white">Flash Sale</h2>
          </div>
          <CountdownTimer dark />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((product) => {
            const orig = fakeOriginalPrice(product.price.eur);
            const discount = pct(orig, product.price.eur);
            const stock = 2 + (hashSlug(product.slug) % 4);

            return (
              <Link key={product.id} href={`/${product.slug}`}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                <div className="relative aspect-square bg-white/5 overflow-hidden">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.title} fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Kein Bild</div>
                  )}
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    -{discount}%
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-slate-300 line-clamp-2 mb-3 leading-snug">{product.title}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-black text-white">{product.price.eur.toFixed(2).replace('.', ',')} €</span>
                    <span className="text-xs text-slate-500 line-through">{orig.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Nur noch {stock} Stück!
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Alle Angebote ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
