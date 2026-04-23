'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Review } from '@/types/product';
import { getAverageRating } from '@/lib/fake-reviews';

interface Props {
  reviews: Review[];
}

function StarRow({ rating, filled }: { rating: number; filled: boolean }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ reviews }: Props) {
  const [showAll, setShowAll] = useState(false);
  const avg = getAverageRating(reviews);
  const displayed = showAll ? reviews : reviews.slice(0, 5);

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <div className="mt-12 border-t border-border pt-10">
      <h2 className="text-xl font-bold text-text-main mb-6">Kundenbewertungen</h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-surface rounded-card border border-border">
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-5xl font-extrabold text-text-main">{avg.toFixed(1)}</span>
          <span className="text-sm text-text-secondary mt-1">von 5</span>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${s <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-text-secondary mt-1">{reviews.length} Bewertungen</span>
        </div>

        <div className="flex-1 space-y-2">
          {dist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-4 text-right text-text-secondary">{star}</span>
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-text-secondary">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-5">
        {displayed.map((review) => (
          <div key={review.id} className="border border-border rounded-card p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-text-main">{review.author}</span>
                  <span className="text-xs text-text-secondary">aus {review.location}</span>
                  {review.verified && (
                    <span className="text-xs font-medium text-cta bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ Verifizierter Kauf
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-text-secondary">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="font-semibold text-sm text-text-main mb-1">{review.title}</p>
            <p className="text-sm text-text-secondary leading-relaxed">{review.text}</p>
            {review.helpful > 0 && (
              <p className="text-xs text-text-secondary mt-3">
                👍 {review.helpful} Personen fanden das hilfreich
              </p>
            )}
          </div>
        ))}
      </div>

      {!showAll && reviews.length > 5 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 w-full py-3 border border-border rounded-btn text-sm font-medium text-text-main hover:border-primary hover:text-primary transition-colors"
        >
          Mehr anzeigen ({reviews.length - 5} weitere Bewertungen)
        </button>
      )}
    </div>
  );
}
