'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RecentProduct {
  slug: string;
  title: string;
  image: string;
  price: number;
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recently_viewed');
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-text-main mb-6">Zuletzt angesehen</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.slug}`}
            className="flex-shrink-0 w-40 bg-white rounded-card border border-border card-hover overflow-hidden"
          >
            <div className="relative aspect-square bg-surface">
              {item.image ? (
                <Image src={item.image} alt={item.title} fill className="object-contain p-3" sizes="160px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs">Kein Bild</div>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-text-main line-clamp-2">{item.title}</p>
              <p className="text-sm font-bold text-primary mt-1">
                {item.price.toFixed(2).replace('.', ',')} €
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function trackRecentlyViewed(product: { slug: string; title: string; image: string; price: number }) {
  try {
    const stored = localStorage.getItem('recently_viewed');
    const items: typeof product[] = stored ? JSON.parse(stored) : [];
    const filtered = items.filter((i) => i.slug !== product.slug);
    const updated = [product, ...filtered].slice(0, 6);
    localStorage.setItem('recently_viewed', JSON.stringify(updated));
  } catch {}
}
