import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { getSession } from '@/lib/auth';
import type { Coupon, CouponValidation } from '@/types/coupon';

export async function POST(request: Request) {
  try {
    const { code, cartTotal, cartItems, userId: bodyUserId } = await request.json() as {
      code: string;
      cartTotal: number;
      cartItems?: Array<{ category?: string }>;
      userId?: string;
    };

    if (!code?.trim()) {
      return NextResponse.json({ valid: false, error: 'Bitte einen Gutscheincode eingeben.' });
    }

    const db = getFirestore();
    const doc = await db.collection('coupons').doc(code.trim().toUpperCase()).get();

    if (!doc.exists) {
      return NextResponse.json({ valid: false, error: 'Ungültiger Gutscheincode.' });
    }

    const coupon = { id: doc.id, ...doc.data() } as Coupon;

    if (!coupon.active) {
      return NextResponse.json({ valid: false, error: 'Dieser Gutscheincode ist nicht mehr gültig.' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Dieser Gutscheincode ist abgelaufen.' });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: 'Dieser Gutscheincode wurde bereits zu oft verwendet.' });
    }

    if (cartTotal < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        error: `Mindestbestellwert von ${coupon.minOrderValue.toFixed(2).replace('.', ',')} € nicht erreicht.`,
      });
    }

    // Category restriction
    if (coupon.category && cartItems?.length) {
      const hasCategory = cartItems.some((i) => i.category === coupon.category);
      if (!hasCategory) {
        return NextResponse.json({
          valid: false,
          error: `Dieser Code gilt nur für Produkte der Kategorie "${coupon.category}".`,
        });
      }
    }

    // Per-user limit
    const session = await getSession();
    const uid = session?.uid ?? bodyUserId;
    if (coupon.maxUsesPerUser > 0 && uid) {
      const usageSnap = await db.collection('coupon_usage')
        .where('couponCode', '==', coupon.code)
        .where('userId', '==', uid)
        .get();
      if (usageSnap.size >= coupon.maxUsesPerUser) {
        return NextResponse.json({ valid: false, error: 'Du hast diesen Gutscheincode bereits verwendet.' });
      }
    }

    // New customers only
    if (coupon.onlyNewCustomers && uid) {
      const ordersSnap = await db.collection('orders').where('userId', '==', uid).limit(1).get();
      if (!ordersSnap.empty) {
        return NextResponse.json({ valid: false, error: 'Dieser Code gilt nur für Neukunden.' });
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percent') {
      discount = Math.round(cartTotal * (coupon.value / 100) * 100) / 100;
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, cartTotal);
    } else if (coupon.type === 'free_shipping') {
      discount = cartTotal >= 29 ? 0 : 4.99;
    }

    const result: CouponValidation = { valid: true, coupon, discount };
    return NextResponse.json(result);
  } catch (error) {
    console.error('Coupon validate error:', error);
    return NextResponse.json({ valid: false, error: 'Serverfehler.' });
  }
}
