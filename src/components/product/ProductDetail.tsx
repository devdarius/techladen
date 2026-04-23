'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/lib/cart-store';
import ProductCard from './ProductCard';
import StockCounter from './StockCounter';
import VisitorsCounter from './VisitorsCounter';
import SocialProofToast from '@/components/ui/SocialProofToast';
import CountdownTimer from '@/components/ui/CountdownTimer';
import ProductReviews from './ProductReviews';
import { generateReviews } from '@/lib/fake-reviews';
import { trackRecentlyViewed } from '@/components/home/RecentlyViewed';

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h);
}

function fakeOriginalPrice(p: number) { return Math.floor(p * 1.38) + 0.99; }

function Accordion({ title, children, open: defaultOpen = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8E8E8] last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-black hover:text-[#444] transition-colors text-left">
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-[#999] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#999] flex-shrink-0" />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-[#666] leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0] ?? '');
  const [selectedModel, setSelectedModel] = useState(product.variants.models[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const reviews = generateReviews(product.slug);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const original = fakeOriginalPrice(product.price.eur);
  const pct = Math.round(((original - product.price.eur) / original) * 100);
  const h = hashSlug(product.slug);
  const sold = 80 + (h % 420);

  useEffect(() => {
    trackRecentlyViewed({ slug: product.slug, title: product.title, image: product.images[0] ?? '', price: product.price.eur });
  }, [product]);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product, selectedColor, selectedModel);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-white">
      <SocialProofToast />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-5 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[#999]">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/?kategorie=${product.category}`} className="hover:text-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#666] line-clamp-1">{product.title}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-[#F7F7F7] rounded-2xl overflow-hidden border border-[#E8E8E8]">
              {product.images[selectedImage] ? (
                <Image src={product.images[selectedImage]} alt={product.title} fill
                  className="object-contain p-8" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#ccc]">Kein Bild</div>
              )}
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded">
                -{pct}%
              </span>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-black' : 'border-[#E8E8E8] hover:border-[#999]'
                    }`}>
                    <Image src={img} alt={`Bild ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold tracking-[3px] uppercase text-[#999] mb-2">{product.category}</p>
              <h1 className="text-2xl lg:text-3xl font-black text-black leading-tight">{product.title}</h1>
            </div>

            {/* Stars + sold */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-[#E8E8E8] fill-[#E8E8E8]'}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-[#666]">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-[#bbb]">({reviews.length} Bewertungen)</span>
              <span className="text-sm text-[#bbb]">·</span>
              <span className="text-sm text-[#999]">{sold}× verkauft</span>
            </div>

            {/* Price box */}
            <div className="bg-[#F7F7F7] rounded-xl p-4 border border-[#E8E8E8]">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-black text-black">
                  {product.price.eur.toFixed(2).replace('.', ',')} €
                </span>
                <span className="text-lg text-[#bbb] line-through">
                  {original.toFixed(2).replace('.', ',')} €
                </span>
                <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded">
                  -{pct}%
                </span>
              </div>
              <p className="text-xs text-[#999]">inkl. 19% MwSt. · Versandkostenfrei ab 29€</p>
              <div className="mt-3">
                <CountdownTimer label="Angebot endet in:" />
              </div>
            </div>

            {/* Stock + visitors */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                <Check className="w-4 h-4" />
                Auf Lager — Lieferzeit 3–7 Werktage
              </div>
              <StockCounter slug={product.slug} />
              <VisitorsCounter />
            </div>

            {/* Colors */}
            {product.variants.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-black mb-2">
                  Farbe: <span className="font-normal text-[#666]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        selectedColor === color ? 'border-black bg-black text-white' : 'border-[#E8E8E8] text-[#666] hover:border-[#999]'
                      }`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Model */}
            {product.variants.models.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Modell</label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full border-2 border-[#E8E8E8] rounded-xl px-4 py-3 text-sm text-black bg-white focus:outline-none focus:border-black font-medium">
                  {product.variants.models.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="flex gap-3">
              <div className="flex items-center border-2 border-[#E8E8E8] rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-[#F7F7F7] transition-colors font-bold text-lg text-black">
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold text-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-[#F7F7F7] transition-colors font-bold text-lg text-black">
                  +
                </button>
              </div>
              <button onClick={handleAdd} disabled={!product.inStock}
                className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-[#222] transition-colors flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed">
                <ShoppingCart className="w-5 h-5" />
                {added ? '✓ Hinzugefügt!' : 'In den Warenkorb'}
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {['SSL Zahlung', '14 Tage Rückgabe', 'Versand ab 29€'].map((t) => (
                <div key={t} className="bg-[#F7F7F7] rounded-lg py-2.5 px-2 border border-[#E8E8E8]">
                  <p className="text-[11px] font-semibold text-[#666]">{t}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="border border-[#E8E8E8] rounded-xl px-5">
              <Accordion title="Produktbeschreibung" open>
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>Hochwertige Qualität, geprüft vor dem Versand.</p>
                )}
              </Accordion>
              <Accordion title="Lieferung & Rückgabe">
                <p>Lieferzeit: 3–7 Werktage nach Deutschland.</p>
                <p>Kostenloser Versand ab 29€ Bestellwert.</p>
                <p>14 Tage Rückgaberecht, kostenlose Rücksendung.</p>
              </Accordion>
              <Accordion title="Zahlungsmethoden">
                <p>PayPal, Klarna, Kreditkarte (Visa/Mastercard), Apple Pay, Google Pay, SEPA. Alle Zahlungen SSL-verschlüsselt.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Why us */}
      <div className="border-y border-[#E8E8E8] py-12 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { t: 'Geprüfte Qualität',  s: 'Jedes Produkt kontrolliert' },
              { t: 'Schnelle Lieferung', s: '3–7 Werktage nach DE' },
              { t: '14 Tage Rückgabe',  s: 'Kostenlos & einfach' },
              { t: 'Sichere Zahlung',    s: 'PayPal · Klarna · SSL' },
            ].map(({ t, s }) => (
              <div key={t}>
                <p className="font-bold text-sm text-black mb-1">{t}</p>
                <p className="text-xs text-[#999]">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-6">
        <ProductReviews reviews={reviews} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 border-t border-[#E8E8E8]">
          <p className="text-xs font-bold tracking-[3px] uppercase text-[#999] mb-2">Mehr entdecken</p>
          <h2 className="text-2xl font-black text-black mb-6">Ähnliche Produkte</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E8E8E8] px-4 py-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-[#bbb] line-through">{original.toFixed(2).replace('.', ',')} €</p>
            <p className="text-lg font-black text-black">{product.price.eur.toFixed(2).replace('.', ',')} €</p>
          </div>
          <button onClick={handleAdd} disabled={!product.inStock}
            className="flex-1 bg-black text-white font-bold py-3.5 rounded-xl hover:bg-[#222] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-40">
            <ShoppingCart className="w-4 h-4" />
            {added ? '✓ Hinzugefügt!' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
      <div className="lg:hidden h-20" />
    </div>
  );
}
