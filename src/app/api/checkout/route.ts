import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';
import { sendPaymentRequestEmail } from '@/lib/email';
import type { CartItem } from '@/types/product';
import type { Order } from '@/types/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techladen.de';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Bitte anmelden, um fortzufahren.' }, { status: 401 });
    }

    const { items, shippingAddress } = await request.json() as {
      items: CartItem[];
      shippingAddress: Order['shippingAddress'];
    };

    if (!items?.length) {
      return NextResponse.json({ error: 'Der Warenkorb ist leer.' }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.price.eur * i.quantity, 0);
    const shippingCost = subtotal >= 29 ? 0 : 499;

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
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Fehler beim Erstellen der Zahlung.' }, { status: 500 });
  }
}
