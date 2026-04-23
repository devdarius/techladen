import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';
import { getFirestore } from '@/lib/firebase-admin';
import { sendPaymentRequestEmail } from '@/lib/email';
import type { CartItem } from '@/types/product';
import type { Order } from '@/types/user';

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? '').trim());
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techladen.de').trim();

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Bitte anmelden, um fortzufahren.' }, { status: 401 });
    }

    const { items, shippingAddress, couponCode } = await request.json() as {
      items: CartItem[];
      shippingAddress: Order['shippingAddress'];
      couponCode?: string;
    };

    if (!items?.length) {
      return NextResponse.json({ error: 'Der Warenkorb ist leer.' }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.price.eur * i.quantity, 0);

    // Apply coupon
    let couponDiscount = 0;
    let couponType = '';
    if (couponCode) {
      const db = getFirestore();
      const couponDoc = await db.collection('coupons').doc(couponCode.toUpperCase()).get();
      if (couponDoc.exists) {
        const coupon = couponDoc.data()!;
        if (coupon.active) {
          if (coupon.type === 'percent') couponDiscount = subtotal * (coupon.value / 100);
          else if (coupon.type === 'fixed') couponDiscount = Math.min(coupon.value, subtotal);
          else if (coupon.type === 'free_shipping') couponType = 'free_shipping';
        }
      }
    }

    const shippingCost = (subtotal >= 29 || couponType === 'free_shipping') ? 0 : 499;

    const lineItems: Stripe.Checkout.SessionCreateParams['line_items'] = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          // Stripe requires images to be publicly accessible HTTPS URLs — skip for now
          description: [item.selectedColor, item.selectedModel].filter(Boolean).join(' · ') || undefined,
        },
        unit_amount: Math.round(item.price.eur * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      lineItems!.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Versand' },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    // Add discount line item if coupon applied
    if (couponDiscount > 0) {
      lineItems!.push({
        price_data: {
          currency: 'eur',
          product_data: { name: `Gutschein ${couponCode}` },
          unit_amount: -Math.round(couponDiscount * 100),
        },
        quantity: 1,
      });
    }

    const orderItems = items.map((i) => ({
      productId: i.id,
      slug: i.slug,
      title: i.title,
      image: i.images[0] ?? '',
      price: i.price.eur,
      quantity: i.quantity,
      selectedColor: i.selectedColor ?? '',
      selectedModel: i.selectedModel ?? '',
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: shippingAddress.email,
      metadata: {
        userId: session.uid,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(orderItems),
        couponCode: couponCode ?? '',
      },
      success_url: `${BASE_URL}/bestellung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/warenkorb`,
      locale: 'de',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
    });

    // Send "Bitte bezahlen" email immediately
    const tempOrder: Order & { id: string } = {
      id: checkoutSession.id,
      userId: session.uid,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping: shippingCost / 100,
      total: subtotal + shippingCost / 100,
      status: 'pending',
      stripeSessionId: checkoutSession.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Fire and forget — don't block the response
    sendPaymentRequestEmail(tempOrder, checkoutSession.url!).catch((e) =>
      console.error('Payment request email error:', e)
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Checkout error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
