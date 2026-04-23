'use client';

import { Tag, X, CheckCircle, Loader2 } from 'lucide-react';
import { useCouponStore } from '@/lib/coupon-store';
import { useCartStore } from '@/lib/cart-store';

export default function CouponInput() {
  const { code, coupon, discount, error, loading, setCode, validate, clear } = useCouponStore();
  const { total, items } = useCartStore();

  const handleApply = async () => {
    await validate(total(), items.map((i) => ({ category: (i as { category?: string }).category })));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleApply();
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">{coupon.code}</p>
            <p className="text-xs text-emerald-600">
              {coupon.type === 'percent' && `-${coupon.value}% Rabatt`}
              {coupon.type === 'fixed' && `-${coupon.value.toFixed(2).replace('.', ',')} € Rabatt`}
              {coupon.type === 'free_shipping' && 'Kostenloser Versand'}
              {discount > 0 && ` (−${discount.toFixed(2).replace('.', ',')} €)`}
            </p>
          </div>
        </div>
        <button onClick={clear} className="text-emerald-600 hover:text-emerald-800 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Gutscheincode eingeben"
            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 uppercase placeholder:normal-case placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Einlösen'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
