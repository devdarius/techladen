'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function ErfolgPage() {
  const { clearCart } = useCartStore();

  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-success" />
      </div>
      <h1 className="text-2xl font-bold text-text-main mb-2">Bestellung erfolgreich!</h1>
      <p className="text-text-secondary mb-2">Vielen Dank für deinen Einkauf. Eine Bestätigung wurde an deine E-Mail-Adresse gesendet.</p>
      <p className="text-sm text-text-secondary mb-8 flex items-center justify-center gap-1.5">
        <Package className="w-4 h-4" /> Lieferzeit: 3–7 Werktage
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/mein-konto/bestellungen" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3">
          Meine Bestellungen <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-btn text-text-secondary hover:text-text-main hover:border-gray-400 transition-colors">
          Zurück zum Shop
        </Link>
      </div>
    </div>
  );
}
