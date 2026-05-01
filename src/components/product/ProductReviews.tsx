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
          className={`w-4 h-4 ${s <= rating ? 'text-[#00A3E0] fill-[#00A3E0]' : 'text-gray-200 fill-gray-200'}`}
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
    <div className="mt-12 border-t border-[#E5E5E5] pt-10">
      <h2 className="text-xl font-bold text-[#111111] mb-6">Kundenbewertungen</h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 p-6 bg-[#F7F7F7] rounded-card border border-[#E5E5E5]">
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-5xl font-extrabold text-[#111111]">{avg.toFixed(1)}</span>
          <span className="text-sm text-[#555555] mt-1">von 5</span>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${s <= Math.round(avg) ? 'text-[#00A3E0] fill-[#00A3E0]' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-[#555555] mt-1">{reviews.length} Bewertungen</span>
        </div>

        <div className="flex-1 space-y-2">
          {dist.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-4 text-right text-[#555555]">{star}</span>
              <Star className="w-3.5 h-3.5 text-[#00A3E0] fill-[#00A3E0] flex-shrink-0" />
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[#00A3E0] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-[#555555]">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-5">
        {displayed.map((review) => (
          <div key={review.id} className="border border-[#E5E5E5] rounded-card p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#111111]">{review.author}</span>
                  <span className="text-xs text-[#555555]">aus {review.location}</span>
                  {review.verified && (
                    <span className="text-xs font-medium text-[#00A3E0] bg-[#00A3E0]/10 border border-[#00A3E0]/20 px-2 py-0.5 rounded-full">
                      ✓ Verifizierter Kauf
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-[#00A3E0] fill-[#00A3E0]' : 'text-gray-200 fill-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#555555]">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="font-semibold text-sm text-[#111111] mb-1">{review.title}</p>
            <p className="text-sm text-[#555555] leading-relaxed">{review.text}</p>
            {review.helpful > 0 && (
              <p className="text-xs text-[#555555] mt-3">
                👍 {review.helpful} Personen fanden das hilfreich
              </p>
            )}
          </div>
        ))}
      </div>

      {!showAll && reviews.length > 5 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 w-full py-3 border border-[#E5E5E5] rounded-btn text-sm font-medium text-[#111111] hover:border-[#00A3E0] hover:text-[#00A3E0] transition-colors"
        >
          Mehr anzeigen ({reviews.length - 5} weitere Bewertungen)
        </button>
      )}
    </div>
  );
}
