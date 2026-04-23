'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Coupon } from '@/types/coupon';

interface CouponStore {
  code: string;
  coupon: Coupon | null;
  discount: number;
  error: string;
  loading: boolean;
  setCode: (code: string) => void;
  validate: (cartTotal: number, cartItems?: Array<{ category?: string }>) => Promise<boolean>;
  clear: () => void;
}

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      code: '',
      coupon: null,
      discount: 0,
      error: '',
      loading: false,

      setCode: (code) => set({ code, error: '' }),

      validate: async (cartTotal, cartItems) => {
        const { code } = get();
        if (!code.trim()) {
          set({ error: 'Bitte einen Gutscheincode eingeben.' });
          return false;
        }
        set({ loading: true, error: '' });
        try {
          const res = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code.trim(), cartTotal, cartItems }),
          });
          const data = await res.json();
          if (data.valid) {
            set({ coupon: data.coupon, discount: data.discount, error: '' });
            return true;
          } else {
            set({ coupon: null, discount: 0, error: data.error });
            return false;
          }
        } catch {
          set({ error: 'Verbindungsfehler.' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      clear: () => set({ code: '', coupon: null, discount: 0, error: '' }),
    }),
    { name: 'tl-coupon' }
  )
);
