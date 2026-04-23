'use client';

import { useCartStore } from '@/lib/cart-store';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

export default function WarenkorbPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">
          Dein Warenkorb ist leer
        </h1>
        <p className="text-slate-400 mb-6">
          Entdecke unsere Produkte und füge sie hinzu.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-black"
          style={{ backgroundColor: '#00D4FF' }}
        >
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-card rounded-xl p-4 border border-slate-800"
            >
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900">
                {item.images[0] && (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white line-clamp-2">
                  {item.title}
                </p>
                {item.selectedColor && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Farbe: {item.selectedColor}
                  </p>
                )}
                {item.selectedModel && (
                  <p className="text-xs text-slate-500">
                    Modell: {item.selectedModel}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-bold text-white">
                    {(item.price.eur * item.quantity)
                      .toFixed(2)
                      .replace('.', ',')}{' '}
                    €
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="self-start text-slate-600 hover:text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl p-6 border border-slate-800 h-fit">
          <h2 className="font-bold text-white mb-4">Zusammenfassung</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Zwischensumme</span>
              <span>{total().toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Versand</span>
              <span>Kostenlos</span>
            </div>
            <div className="border-t border-slate-800 pt-2 mt-2 flex justify-between font-bold text-white">
              <span>Gesamt</span>
              <span>{total().toFixed(2).replace('.', ',')} €</span>
            </div>
            <p className="text-xs text-slate-500">inkl. 19% MwSt.</p>
          </div>

          <button
            disabled
            className="w-full mt-6 py-3 rounded-xl font-semibold text-slate-400 bg-slate-800 cursor-not-allowed border border-slate-700 text-sm"
          >
            Zur Kasse – Demnächst verfügbar
          </button>

          <Link
            href="/"
            className="block text-center mt-3 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Weiter einkaufen
          </Link>
        </div>
      </div>
    </div>
  );
}
