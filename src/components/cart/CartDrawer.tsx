'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  const handleCheckout = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={closeCart} aria-hidden="true" />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col transition-transform duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Warenkorb"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-lg text-text-main flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Warenkorb
            {itemCount > 0 && (
              <span className="text-sm font-normal text-text-secondary">({itemCount} Artikel)</span>
            )}
          </h2>
          <button onClick={closeCart} className="p-2 rounded-btn hover:bg-surface transition-colors" aria-label="Schließen">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-text-secondary gap-3 py-16">
              <ShoppingBag className="w-14 h-14 text-border" />
              <p className="font-medium">Dein Warenkorb ist leer</p>
              <button onClick={closeCart} className="text-sm text-primary hover:underline">
                Weiter einkaufen
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-surface rounded-card border border-border">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-btn overflow-hidden bg-white border border-border">
                  {item.images[0] && (
                    <Image src={item.images[0]} alt={item.title} fill className="object-contain p-1" sizes="64px" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main line-clamp-2">{item.title}</p>
                  {item.selectedColor && <p className="text-xs text-text-secondary mt-0.5">Farbe: {item.selectedColor}</p>}
                  {item.selectedModel && <p className="text-xs text-text-secondary">Modell: {item.selectedModel}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-border rounded-btn overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white transition-colors text-text-main"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-white transition-colors text-text-main"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-primary">
                      {(item.price.eur * item.quantity).toFixed(2).replace('.', ',')} €
                    </p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="self-start p-1 text-text-secondary hover:text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border space-y-3 bg-white">
            {total() < 29 && (
              <div className="text-xs text-text-secondary bg-surface rounded-btn px-3 py-2 text-center">
                Noch <strong className="text-primary">{(29 - total()).toFixed(2).replace('.', ',')} €</strong> bis zum kostenlosen Versand
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Zwischensumme</span>
              <span className="font-bold text-text-main">{total().toFixed(2).replace('.', ',')} €</span>
            </div>
            <p className="text-xs text-text-secondary">inkl. 19% MwSt.</p>

            <Link
              href="/kasa"
              onClick={closeCart}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm"
            >
              Zur Kasse <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={closeCart} className="w-full text-center text-sm text-text-secondary hover:text-primary transition-colors">
              Weiter einkaufen
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-text-main text-white text-sm px-5 py-3 rounded-card shadow-card-hover">
          Kasse kommt bald — wir arbeiten daran! 🚀
        </div>
      )}
    </>
  );
}
