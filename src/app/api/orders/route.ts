import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { getSession } from '@/lib/auth';
import type { Order } from '@/types/user';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const db = getFirestore();
    const snap = await db.collection('orders')
      .where('userId', '==', session.uid)
      .get();

    const orders: Order[] = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Order))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
