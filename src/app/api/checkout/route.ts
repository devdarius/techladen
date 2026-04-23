import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';
import type { CartItem } from '@/types/product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techladen.de';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Musisz być zalogowany' }, { status: 401 });
    }

    const { items, shippingAddress } = await request.json() as {
      items: CartItem[];
      shippingAddress: {
        firstName: string; lastName: string; email: string;
        phone: string; street: string; city: string; zip: string; country: string;
      };
    };

    if (!items?.length) {
      return NextResponse.json({ error: 'Koszyk jest pusty' }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams['line_items'] = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          images: item.images[0] ? [item.images[0]] : [],
          description: [item.selectedColor, item.selectedModel].filter(Boolean).join(' · ') || undefined,
        },
        unit_amount: Math.round(item.price.eur * 100),
      },
      quantity: item.quantity,
    }));

    // Free shipping over 29€
    const subtotal = items.reduce((s, i) => s + i.price.eur * i.quantity, 0);
    const shippingCost = subtotal >= 29 ? 0 : 499; // cents

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

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: shippingAddress.email,
      metadata: {
        userId: session.uid,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items.map((i) => ({
          productId: i.id,
          slug: i.slug,
          title: i.title,
          image: i.images[0] ?? '',
          price: i.price.eur,
          quantity: i.quantity,
          selectedColor: i.selectedColor ?? '',
          selectedModel: i.selectedModel ?? '',
        }))),
      },
      success_url: `${BASE_URL}/bestellung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/warenkorb`,
      locale: 'de',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Błąd podczas tworzenia sesji płatności' }, { status: 500 });
  }
}
