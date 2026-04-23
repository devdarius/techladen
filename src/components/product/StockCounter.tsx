'use client';

function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) + h) ^ slug.charCodeAt(i);
  return Math.abs(h);
}

interface Props {
  slug: string;
}

export default function StockCounter({ slug }: Props) {
  const stock = 2 + (hashSlug(slug) % 6); // 2-7
  if (stock > 5) return null;

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-urgency bg-amber-50 border border-amber-200 rounded-btn px-3 py-2">
      ⚠️ Nur noch {stock} Stück verfügbar!
    </div>
  );
}
