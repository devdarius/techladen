'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Check, ChevronDown, ChevronUp, ShieldCheck, Truck, RefreshCcw, Zap, Magnet, Award } from 'lucide-react';
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

const COLOR_MAP: Record<string, string> = {
  'Schwarz': '#111111',
  'Weiß': '#FFFFFF',
  'Silber': '#C0C0C0',
  'Gold': '#FFD700',
  'Blau': '#3B82F6',
  'Rot': '#EF4444',
  'Grün': '#22C55E',
  'Lila': '#A855F7',
  'Rosa': '#EC4899',
  'Grau': '#9CA3AF',
};

function Accordion({ title, children, open: defaultOpen = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E5E5] last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-[#111111] hover:text-[#00A3E0] transition-colors text-left">
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-[#666666] flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#666666] flex-shrink-0" />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-[#555555] leading-relaxed space-y-2">
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
    <div className="bg-white min-h-screen text-[#111111]">
      <SocialProofToast />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-5 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[#555555]">
          <Link href="/" className="hover:text-[#00A3E0] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/?kategorie=${product.category}`} className="hover:text-[#00A3E0] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#111111] line-clamp-1">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 relative">

          {/* Left Column: Sticky Gallery */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-[#E5E5E5] shadow-sm">
              {product.images[selectedImage] ? (
                <Image src={product.images[selectedImage]} alt={product.title} fill
                  className="object-contain p-8" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#999999]">Kein Bild</div>
              )}
              <span className="absolute top-4 left-4 bg-urgency text-white text-xs font-black px-3 py-1 rounded shadow-lg">
                Save {pct}%
              </span>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-[#00A3E0] shadow-[0_0_10px_rgba(0,163,224,0.3)]' : 'border-[#E5E5E5] opacity-70 hover:opacity-100 hover:border-[#00A3E0]/50'
                    }`}>
                    <Image src={img} alt={`Bild ${i + 1}`} fill className="object-contain p-2" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: CRO Info & Purchase Intent */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold tracking-[3px] uppercase text-[#00A3E0] mb-2">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-black text-[#111111] leading-tight mb-4">{product.title}</h1>
              
              {/* Stars + sold */}
              <div className="flex items-center gap-3 flex-wrap cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('reviews')?.scrollIntoView({behavior: 'smooth'})}>
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-[#00A3E0] fill-[#00A3E0]' : 'text-[#E5E5E5] fill-[#E5E5E5]'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#111111]">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-[#555555] underline decoration-dashed">({reviews.length} Reviews)</span>
                <span className="text-sm text-[#555555]">·</span>
                <span className="text-sm text-[#555555] bg-[#F7F7F7] px-2 py-0.5 rounded border border-[#E5E5E5]">{sold}× verkauft</span>
              </div>
            </div>

            {/* Massive Price Block */}
            <div className="bg-[#F7F7F7] rounded-2xl p-6 border border-[#E5E5E5] shadow-lg relative overflow-hidden">
              <div className="flex items-baseline gap-4 mb-2 relative z-10">
                <span className="text-5xl font-black text-[#00A3E0]">
                  {product.price.eur.toFixed(2).replace('.', ',')} €
                </span>
                <div className="flex flex-col">
                  <span className="text-lg text-[#999999] line-through">
                    {original.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="text-xs font-bold text-[#00A3E0]">You save {(original - product.price.eur).toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>
              <p className="text-xs text-[#555555] mb-4">inkl. 19% MwSt. · Versandkostenfrei ab 29€</p>
              
              <div className="bg-urgency/10 border border-urgency/20 rounded-lg p-3 flex items-center gap-3">
                <div>
                  <p className="text-xs font-bold text-urgency">High Demand: Order within 2 hours for dispatch today.</p>
                  <CountdownTimer dark={false} />
                </div>
              </div>
            </div>

            {/* Stock + visitors */}
            <div className="flex items-center justify-between text-sm bg-[#F7F7F7] border border-[#E5E5E5] px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2 font-semibold text-success">
                <Check className="w-4 h-4" /> Auf Lager
              </div>
              <StockCounter slug={product.slug} />
              <VisitorsCounter />
            </div>

            {/* Variants */}
            {product.variants.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#111111] mb-3">
                  Farbe: <span className="font-normal text-[#111111]">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {product.variants.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className="flex flex-col items-center gap-1.5 group">
                      <div
                        style={{ backgroundColor: COLOR_MAP[color] || '#CCCCCC' }}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          selectedColor === color ? 'border-[#00A3E0] ring-2 ring-[#00A3E0]/30' : 'border-[#E5E5E5] group-hover:border-[#00A3E0]/50'
                        }`}
                      />
                      <span className="text-xs text-[#111111] text-center">{color}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants.models.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-3">Model</label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full border-2 border-[#E5E5E5] rounded-xl px-4 py-3.5 text-sm text-[#111111] bg-white focus:outline-none focus:border-primary font-medium transition-colors">
                  {product.variants.models.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Main CTA */}
            <div className="pt-2">
              <button onClick={handleAdd} disabled={!product.inStock}
                className="w-full btn-cta py-5 rounded-xl flex items-center justify-center gap-3 text-lg disabled:opacity-40 disabled:cursor-not-allowed">
                <ShoppingCart className="w-6 h-6" />
                {added ? '✓ Hinzugefügt!' : 'In den Warenkorb'}
              </button>
            </div>

            {/* Trust Badges under CTA */}
            <div className="flex justify-center gap-6 text-xs text-[#111111] pt-2">
              <div className="flex flex-col items-center gap-1.5"><ShieldCheck className="w-5 h-5 text-[#00A3E0]" /> Secure Checkout</div>
              <div className="flex flex-col items-center gap-1.5"><Truck className="w-5 h-5 text-[#00A3E0]" /> Fast Shipping</div>
              <div className="flex flex-col items-center gap-1.5"><RefreshCcw className="w-5 h-5 text-[#00A3E0]" /> 30-Day Returns</div>
            </div>

            {/* Accordions */}
            <div className="border border-[#E5E5E5] rounded-xl px-5 bg-[#F7F7F7] mt-8">
              <Accordion title="Product Benefits" open>
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} className="prose max-w-none prose-sm" />
                ) : (
                  <div className="space-y-4">
                    <p>Upgrade your daily carry with premium materials and engineered precision.</p>
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-[#F7F7F7] flex items-center justify-center border border-[#E5E5E5]">
                      <span className="text-[#999999] text-xs">[Insert High-Quality Benefit GIF Here]</span>
                    </div>
                  </div>
                )}
              </Accordion>
              <Accordion title="Shipping & Returns">
                <ul className="list-disc pl-4 space-y-1">
                  <li>Delivery in 3–7 business days to Germany.</li>
                  <li>Free shipping on orders over €50.</li>
                  <li>30-day money-back guarantee, no questions asked.</li>
                </ul>
              </Accordion>
            </div>

            {/* USP Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-4 mt-6">
              {[
                { icon: Zap, label: 'Schnellladung 22.5W' },
                { icon: Magnet, label: 'MagSafe Kompatibel' },
                { icon: ShieldCheck, label: '1 Jahr Garantie' },
                { icon: Award, label: 'CE & RoHS Zertifiziert' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <Icon className="w-6 h-6 text-[#00A3E0]" />
                  <span className="text-sm font-medium text-[#111111]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why us (Below the fold trust builders) */}
      <div className="border-y border-[#E5E5E5] py-12 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { t: 'Premium Quality',  s: 'Engineered for durability' },
              { t: 'Fast Dispatch', s: 'Orders processed in 24h' },
              { t: '30-Day Returns',  s: 'Risk-free shopping' },
              { t: 'Secure Payment',    s: 'SSL Encrypted Checkout' },
            ].map(({ t, s }) => (
              <div key={t}>
                <p className="font-bold text-sm text-[#111111] mb-1">{t}</p>
                <p className="text-xs text-[#555555]">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <ProductReviews reviews={reviews} />
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 border-t border-[#E5E5E5]">
          <p className="text-xs font-bold tracking-[3px] uppercase text-primary mb-2 text-center">Complete Your Setup</p>
          <h2 className="text-3xl font-black text-[#111111] mb-8 text-center">Frequently Bought Together</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] px-4 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <p className="text-xs text-[#999999] line-through">{original.toFixed(2).replace('.', ',')} €</p>
            <p className="text-xl font-black text-primary leading-none">{product.price.eur.toFixed(2).replace('.', ',')} €</p>
          </div>
          <button onClick={handleAdd} disabled={!product.inStock}
            className="flex-1 btn-cta py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm disabled:opacity-40">
            <ShoppingCart className="w-5 h-5" />
            {added ? 'Added!' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
      <div className="lg:hidden h-24" /> {/* Padding for the mobile bar */}
    </div>
  );
}
