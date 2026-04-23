import Link from 'next/link';
import Image from 'next/image';
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
    <section className="bg-black py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-[#666] mb-1">Nur heute</p>
            <h2 className="text-2xl font-black text-white">Flash Sale</h2>
          </div>
          <CountdownTimer dark />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((product) => {
            const orig = fakeOriginalPrice(product.price.eur);
            const discount = pct(orig, product.price.eur);
            const stock = 2 + (hashSlug(product.slug) % 4);

            return (
              <Link key={product.id} href={`/${product.slug}`}
                className="group bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#444] transition-all">
                <div className="relative aspect-square bg-[#1a1a1a] overflow-hidden">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.title} fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#444] text-xs">Kein Bild</div>
                  )}
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    -{discount}%
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-[#aaa] line-clamp-2 mb-3 leading-snug">{product.title}</p>
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <span className="text-base font-black text-white">{product.price.eur.toFixed(2).replace('.', ',')} €</span>
                    <span className="text-xs text-[#555] line-through">{orig.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#f59e0b]">Nur noch {stock} Stück</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
