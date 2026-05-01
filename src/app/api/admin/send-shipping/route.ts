import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getFirestore } from '@/lib/firebase-admin';
import { sendShippingEmail } from '@/lib/email';
import type { Order } from '@/types/user';

export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== 'admin') {
    return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  }

  const { orderId, trackingNumber } = await request.json();
  if (!orderId) return NextResponse.json({ error: 'Brak orderId' }, { status: 400 });

  const db = getFirestore();
  const doc = await db.collection('orders').doc(orderId).get();
  if (!doc.exists) return NextResponse.json({ error: 'Zamówienie nie istnieje' }, { status: 404 });

  const order = { id: doc.id, ...doc.data() } as Order & { id: string };

  // Update status to shipped
  await db.collection('orders').doc(orderId).update({
    status: 'shipped',
    trackingNumber: trackingNumber ?? null,
    updatedAt: new Date().toISOString(),
  });

  await sendShippingEmail(order, trackingNumber);

  return NextResponse.json({ ok: true });
}
