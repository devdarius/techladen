'use client';

import { AlertTriangle } from 'lucide-react';

function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h) ^ slug.charCodeAt(i);
  return Math.abs(h);
}

export default function StockCounter({ slug }: { slug: string }) {
  const stock = 2 + (hashSlug(slug) % 6);
  if (stock > 5) return null;

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      Nur noch {stock} Stück verfügbar!
    </div>
  );
}
