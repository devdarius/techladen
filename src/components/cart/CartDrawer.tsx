'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } =
    useCartStore();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-slate-800 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Warenkorb"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: '#00D4FF' }} />
            Warenkorb
            {items.length > 0 && (
              <span className="text-sm font-normal text-slate-400">
                ({items.reduce((s, i) => s + i.quantity, 0)} Artikel)
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Warenkorb schließen"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <ShoppingBag className="w-12 h-12 opacity-30" />
              <p>Dein Warenkorb ist leer</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-slate-800/50 rounded-xl p-3"
              >
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-900">
                  {item.images[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 line-clamp-2">
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
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                        aria-label="Menge verringern"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                        aria-label="Menge erhöhen"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {(item.price.eur * item.quantity)
                        .toFixed(2)
                        .replace('.', ',')}{' '}
                      €
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start p-1 text-slate-600 hover:text-slate-400 transition-colors"
                  aria-label="Artikel entfernen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Zwischensumme</span>
              <span className="text-white font-semibold">
                {total().toFixed(2).replace('.', ',')} €
              </span>
            </div>
            <p className="text-xs text-slate-500">inkl. 19% MwSt.</p>
            <button
              disabled
              className="w-full py-3 rounded-xl font-semibold text-slate-400 bg-slate-800 cursor-not-allowed border border-slate-700 text-sm"
            >
              Zur Kasse – Demnächst verfügbar
            </button>
          </div>
        )}
      </div>
    </>
  );
}
