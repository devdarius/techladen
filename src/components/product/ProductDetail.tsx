'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import type { Product } from '@/types/product';
import { useCartStore } from '@/lib/cart-store';

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetail({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.variants.colors[0] ?? ''
  );
  const [selectedModel, setSelectedModel] = useState(
    product.variants.models[0] ?? ''
  );
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const handleAdd = () => {
    addItem(product, selectedColor, selectedModel);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden">
            {product.images[selectedImage] ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                Kein Bild
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage
                      ? 'border-accent'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={
                    i === selectedImage ? { borderColor: '#00D4FF' } : {}
                  }
                >
                  <Image
                    src={img}
                    alt={`Bild ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">{product.category}</p>
            <h1 className="text-2xl font-bold text-white">{product.title}</h1>
          </div>

          <div>
            <p className="text-3xl font-bold text-white">
              {product.price.eur.toFixed(2).replace('.', ',')} €
            </p>
            <p className="text-sm text-slate-400 mt-1">inkl. 19% MwSt.</p>
          </div>

          {/* Variants */}
          {product.variants.colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Farbe: <span className="text-white">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      selectedColor === color
                        ? 'border-accent text-white'
                        : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                    style={
                      selectedColor === color ? { borderColor: '#00D4FF' } : {}
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants.models.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Modell
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                style={{ '--tw-ring-color': '#00D4FF' } as React.CSSProperties}
              >
                {product.variants.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#00D4FF' }}
          >
            <ShoppingCart className="w-5 h-5" />
            {added ? 'Hinzugefügt ✓' : 'In den Warenkorb'}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, text: 'Lieferzeit: 3–7 Werktage' },
              { icon: Shield, text: '14 Tage Rückgabe' },
              { icon: RotateCcw, text: 'Kostenloser Umtausch' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex flex-col items-center gap-1 p-3 bg-slate-800/50 rounded-lg text-center"
              >
                <Icon className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-400">{text}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="font-semibold text-white mb-3">Beschreibung</h2>
              <div
                className="text-sm text-slate-400 leading-relaxed prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-white mb-6">
            Ähnliche Produkte
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <a
                key={p.id}
                href={`/${p.slug}`}
                className="group bg-card rounded-xl overflow-hidden border border-slate-800 hover:border-accent transition-colors"
                style={{ '--tw-border-opacity': '1' } as React.CSSProperties}
              >
                <div className="relative aspect-square bg-slate-900">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {p.title}
                  </p>
                  <p className="text-sm font-bold text-white mt-1">
                    {p.price.eur.toFixed(2).replace('.', ',')} €
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
