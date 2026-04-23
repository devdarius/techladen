import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from '@/lib/firebase-admin';
import { sendOrderConfirmationEmail } from '@/lib/email';
import type { Order } from '@/types/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (webhookSecret && sig && webhookSecret !== 'whsec_placeholder') {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  try {
    const db = getFirestore();
    const meta = session.metadata ?? {};
    const shippingAddress = JSON.parse(meta.shippingAddress ?? '{}');
    const items = JSON.parse(meta.items ?? '[]');
    const userId = meta.userId ?? '';

    const subtotal = items.reduce(
      (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0
    );
    const shipping = subtotal >= 29 ? 0 : 4.99;

    const order: Omit<Order, 'id'> = {
      userId,
      items,
      shippingAddress,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: 'paid',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = await db.collection('orders').add(order);
    console.log('Order created:', ref.id);

    // Send confirmation + invoice email
    await sendOrderConfirmationEmail({ ...order, id: ref.id });
    console.log('Confirmation email sent to:', shippingAddress.email);
  } catch (error) {
    console.error('handleCheckoutComplete error:', error);
  }
}
