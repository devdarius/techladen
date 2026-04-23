'use client';

function hashSlug(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return Math.abs(h);
}

export default function StockCounter({ slug }: { slug: string }) {
  const stock = 2 + (hashSlug(slug) % 6);
  if (stock > 5) return null;
  return (
    <p className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
      Nur noch {stock} Stück verfügbar
    </p>
  );
}
