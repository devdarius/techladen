import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/product';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { ArrowRight } from 'lucide-react';

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h);
}

function fakeOriginalPrice(p: number) { return +(p * 1.4 + 0.99 - (p * 0.4 % 1)).toFixed(2); }
function discountPct(orig: number, cur: number) { return Math.round(((orig - cur) / orig) * 100); }
function stockCount(slug: string) { return 2 + (hashSlug(slug) % 4); }

export default function FlashSaleSection({ products }: { products: Product[] }) {
  const items = products.slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="py-14" style={{
      background: 'linear-gradient(135deg, #FFF4F1 0%, #FFF8F5 50%, #FFF1F2 100%)',
    }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#FF5733] mb-3">
              Nur heute
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              Flash Sale
            </h2>
            <p className="text-[#64748B] mt-1">Limitierte Stückzahl — solange der Vorrat reicht!</p>
          </div>
          <div className="flex-shrink-0">
            <CountdownTimer dark={false} />
          </div>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((product) => {
            const orig    = fakeOriginalPrice(product.price.eur);
            const pct     = discountPct(orig, product.price.eur);
            const stock   = stockCount(product.slug);
            const stockPct = Math.round((stock / 6) * 100);

            return (
              <Link
                key={product.id}
                href={`/${product.slug}`}
                className="group bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-md hover:border-[#FCA5A5]"
                style={{ '--hover-shadow': '0 16px 48px rgba(239,68,68,0.15)' } as React.CSSProperties}
              >
                {/* Image */}
                <div className="relative aspect-square bg-[#F8FAFF] overflow-hidden">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#94A3B8] text-sm">Kein Bild</div>
                  )}
                  {/* Discount badge */}
                  <span className="badge-sale absolute top-2.5 left-2.5">−{pct}%</span>
                </div>

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2 mb-3 leading-snug flex-1">
                    {product.title}
                  </p>

                  {/* Prices */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="price-main text-lg">{product.price.eur.toFixed(2).replace('.', ',')} €</span>
                    <span className="price-original">{orig.toFixed(2).replace('.', ',')} €</span>
                  </div>

                  {/* Stock bar */}
                  <div>
                    <p className="text-[11px] font-bold text-[#EF4444] mb-1.5">
                      Nur noch {stock} Stück
                    </p>
                    <div className="w-full h-1.5 bg-[#F1F5FF] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${stockPct}%`,
                          background: 'linear-gradient(90deg, #EF4444, #FF5733)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link href="/?badge=Angebote" className="btn-cta px-8 py-3.5 inline-flex">
            Alle Angebote ansehen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
