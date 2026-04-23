'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Shield, RotateCcw, Truck, ChevronDown, ChevronUp, Check } from 'lucide-react';
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

interface Props {
  product: Product;
  related: Product[];
}

function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h) ^ slug.charCodeAt(i);
  return Math.abs(h);
}

function fakeOriginalPrice(price: number): number {
  return Math.floor(price * 1.35) + 0.99;
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-btn overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-main hover:bg-surface transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductDetail({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0] ?? '');
  const [selectedModel, setSelectedModel] = useState(product.variants.models[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const reviews = generateReviews(product.slug);
  const original = fakeOriginalPrice(product.price.eur);
  const discountPct = Math.round(((original - product.price.eur) / original) * 100);

  useEffect(() => {
    trackRecentlyViewed({
      slug: product.slug,
      title: product.title,
      image: product.images[0] ?? '',
      price: product.price.eur,
    });
  }, [product]);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product, selectedColor, selectedModel);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SocialProofToast />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/?kategorie=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-text-main line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-surface rounded-card overflow-hidden border border-border">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-contain p-6"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-secondary">Kein Bild</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-btn overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-primary' : 'border-border hover:border-gray-400'
                  }`}
                >
                  <Image src={img} alt={`Bild ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <span className="inline-block text-xs font-semibold text-primary bg-indigo-50 px-2 py-1 rounded-full mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-text-main leading-tight">{product.title}</h1>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-text-secondary">({reviews.length} Bewertungen)</span>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-error">
                {product.price.eur.toFixed(2).replace('.', ',')} €
              </p>
              <p className="text-lg text-text-secondary line-through">
                {original.toFixed(2).replace('.', ',')} €
              </p>
              <span className="bg-error text-white text-sm font-bold px-2 py-0.5 rounded-full">
                -{discountPct}%
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-0.5">inkl. 19% MwSt. zzgl. Versand</p>
          </div>

          {/* Countdown */}
          <CountdownTimer label="Angebot endet in:" />

          {/* Stock */}
          <div className="flex items-center gap-2 text-sm font-medium text-success">
            <Check className="w-4 h-4" />
            Auf Lager — Lieferzeit 3–7 Werktage
          </div>

          <StockCounter slug={product.slug} />
          <VisitorsCounter />

          {/* Color variants */}
          {product.variants.colors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-text-main mb-2">
                Farbe: <span className="font-normal text-text-secondary">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-btn text-sm border-2 transition-colors ${
                      selectedColor === color
                        ? 'border-primary text-primary bg-indigo-50 font-medium'
                        : 'border-border text-text-secondary hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Model dropdown */}
          {product.variants.models.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Modell</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border border-border rounded-btn px-3 py-2.5 text-sm text-text-main bg-white focus:outline-none focus:border-primary"
              >
                {product.variants.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium text-text-main mb-2">Menge</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-btn overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-surface transition-colors text-text-main font-bold"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-surface transition-colors text-text-main font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="btn-cta w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            {added ? '✓ Hinzugefügt!' : 'In den Warenkorb'}
          </button>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { icon: Shield, text: 'Sichere Zahlung' },
              { icon: RotateCcw, text: '14 Tage Rückgabe' },
              { icon: Truck, text: 'Versand ab 29€ frei' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1 p-2 bg-surface rounded-btn text-center">
                <Icon className="w-4 h-4 text-text-secondary" />
                <span className="text-xs text-text-secondary">{text}</span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="space-y-2 pt-2">
            <Accordion title="Beschreibung">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p>Keine Beschreibung verfügbar.</p>
              )}
            </Accordion>
            <Accordion title="Lieferung & Rückgabe">
              <p>Lieferzeit: 3–7 Werktage nach Deutschland. Kostenloser Versand ab 29€ Bestellwert.</p>
              <p className="mt-2">14 Tage Rückgaberecht ab Erhalt der Ware. Rücksendung kostenlos.</p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ProductReviews reviews={reviews} />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-text-main mb-6">Ähnliche Produkte</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
