'use client';

import { useCartStore } from '@/lib/cart-store';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WarenkorbPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-border mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-main mb-2">Dein Warenkorb ist leer</h1>
        <p className="text-text-secondary mb-6">Entdecke unsere Produkte und füge sie hinzu.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          Zum Shop <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-text-main mb-8">Warenkorb</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white rounded-card border border-border p-4 shadow-card">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                {item.images[0] && (
                  <Image src={item.images[0]} alt={item.title} fill className="object-contain p-1" sizes="80px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main line-clamp-2">{item.title}</p>
                {item.selectedColor && <p className="text-xs text-text-secondary mt-0.5">Farbe: {item.selectedColor}</p>}
                {item.selectedModel && <p className="text-xs text-text-secondary">Modell: {item.selectedModel}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-btn overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-surface transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-bold text-primary">{(item.price.eur * item.quantity).toFixed(2).replace('.', ',')} €</p>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="self-start text-text-secondary hover:text-red-500 transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-card border border-border p-6 shadow-card h-fit">
          <h2 className="font-bold text-text-main mb-4">Zusammenfassung</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Zwischensumme</span>
              <span>{total().toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Versand</span>
              <span className={total() >= 29 ? 'text-success font-medium' : ''}>
                {total() >= 29 ? 'Kostenlos' : '4,99 €'}
              </span>
            </div>
            <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-text-main">
              <span>Gesamt</span>
              <span>{(total() + (total() >= 29 ? 0 : 4.99)).toFixed(2).replace('.', ',')} €</span>
            </div>
            <p className="text-xs text-text-secondary">inkl. 19% MwSt.</p>
          </div>

          {total() < 29 && (
            <div className="mt-3 text-xs text-text-secondary bg-surface rounded-btn px-3 py-2 text-center">
              Noch <strong className="text-primary">{(29 - total()).toFixed(2).replace('.', ',')} €</strong> bis zum kostenlosen Versand
            </div>
          )}

          <Link
            href="/kasa"
            className="btn-primary w-full mt-5 py-3 flex items-center justify-center gap-2 text-sm"
          >
            Zur Kasse <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="block text-center mt-3 text-sm text-text-secondary hover:text-primary transition-colors">
            Weiter einkaufen
          </Link>
        </div>
      </div>
    </div>
  );
}
