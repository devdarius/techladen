'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart, Star, Shield, RotateCcw, Truck,
  Check, ChevronDown, ChevronUp, Zap, Package,
  ThumbsUp, Award, Clock,
} from 'lucide-react';
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

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors text-left">
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

const WHY_US = [
  { icon: Award,   title: 'Geprüfte Qualität',    desc: 'Jedes Produkt wird vor dem Versand kontrolliert' },
  { icon: Truck,   title: 'Schnelle Lieferung',   desc: 'Direkt zu dir nach Hause geliefert' },
  { icon: RotateCcw, title: '14 Tage Rückgabe',  desc: 'Kostenlose Rücksendung, kein Stress' },
  { icon: Shield,  title: 'Sichere Zahlung',      desc: 'PayPal, Klarna, Kreditkarte — SSL verschlüsselt' },
];

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

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-2">
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/?kategorie=${product.category}`} className="hover:text-indigo-600 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-slate-600 line-clamp-1">{product.title}</span>
        </nav>
      </div>

      {/* ── Main product section ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100">
              {product.images[selectedImage] ? (
                <Image src={product.images[selectedImage]} alt={product.title} fill
                  className="object-contain p-8" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">Kein Bild</div>
              )}
              {/* Discount badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg">
                -{pct}%
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-indigo-500 shadow-md' : 'border-slate-200 hover:border-slate-400'
                    }`}>
                    <Image src={img} alt={`Bild ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            {/* Category + title */}
            <div>
              <span className="section-label">{product.category}</span>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight mt-2">
                {product.title}
              </h1>
            </div>

            {/* Stars + sold */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-slate-400">({reviews.length} Bewertungen)</span>
              <span className="text-sm text-slate-400">·</span>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                {sold}× verkauft
              </span>
            </div>

            {/* Price */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-black text-slate-900">
                  {product.price.eur.toFixed(2).replace('.', ',')} €
                </span>
                <span className="text-xl text-slate-400 line-through font-medium">
                  {original.toFixed(2).replace('.', ',')} €
                </span>
                <span className="bg-red-500 text-white text-sm font-black px-2.5 py-1 rounded-lg">
                  -{pct}%
                </span>
              </div>
              <p className="text-xs text-slate-500">inkl. 19% MwSt. · Versandkostenfrei ab 29€</p>
              <div className="mt-3">
                <CountdownTimer label="Angebot endet in:" />
              </div>
            </div>

            {/* Stock + visitors */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <Check className="w-4 h-4" />
                Auf Lager — Lieferzeit 3–7 Werktage
              </div>
              <StockCounter slug={product.slug} />
              <VisitorsCounter />
            </div>

            {/* Color variants */}
            {product.variants.colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Farbe: <span className="font-normal text-slate-500">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedColor === color
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Modell</label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:border-indigo-400 font-medium">
                  {product.variants.models.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Quantity + CTA */}
            <div className="flex gap-3">
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700 font-bold text-lg">
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700 font-bold text-lg">
                  +
                </button>
              </div>
              <button onClick={handleAdd} disabled={!product.inStock}
                className="btn-cta flex-1 py-3.5 text-base">
                <ShoppingCart className="w-5 h-5" />
                {added ? '✓ Hinzugefügt!' : 'In den Warenkorb'}
              </button>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield,    text: 'SSL Zahlung' },
                { icon: RotateCcw, text: '14 Tage Rückgabe' },
                { icon: Package,   text: 'Versand ab 29€' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <span className="text-[11px] font-semibold text-slate-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="bg-slate-50 rounded-2xl px-5 border border-slate-100">
              <Accordion title="Produktbeschreibung" defaultOpen>
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>Hochwertige Qualität, geprüft vor dem Versand. Kompatibel mit allen gängigen Geräten.</p>
                )}
              </Accordion>
              <Accordion title="Lieferung & Rückgabe">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />Lieferzeit: 3–7 Werktage nach Deutschland</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />Kostenloser Versand ab 29€ Bestellwert</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />14 Tage Rückgaberecht, kostenlose Rücksendung</li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />Sendungsverfolgung per E-Mail</li>
                </ul>
              </Accordion>
              <Accordion title="Zahlungsmethoden">
                <p>PayPal, Klarna (Ratenzahlung), Kreditkarte (Visa/Mastercard), Apple Pay, Google Pay, SEPA-Lastschrift. Alle Zahlungen SSL-verschlüsselt.</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ── Why us section ── */}
      <div className="bg-slate-50 border-y border-slate-100 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="section-label text-center mb-2">Warum TechLaden.de?</p>
          <h2 className="text-2xl font-black text-slate-900 text-center mb-8">Dein Vorteil bei uns</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="font-bold text-sm text-slate-900 mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="max-w-7xl mx-auto px-4">
        <ProductReviews reviews={reviews} />
      </div>

      {/* ── Related ── */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="section-label mb-2">Mehr entdecken</p>
          <h2 className="text-2xl font-black text-slate-900 mb-6">Ähnliche Produkte</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {/* ── Sticky mobile CTA ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-slate-500 line-through">{original.toFixed(2).replace('.', ',')} €</p>
            <p className="text-lg font-black text-slate-900">{product.price.eur.toFixed(2).replace('.', ',')} €</p>
          </div>
          <button onClick={handleAdd} disabled={!product.inStock}
            className="btn-cta flex-1 py-3.5 text-sm">
            <ShoppingCart className="w-4 h-4" />
            {added ? '✓ Hinzugefügt!' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
      <div className="lg:hidden h-20" /> {/* spacer for sticky bar */}
    </div>
  );
}
