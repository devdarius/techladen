import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

function checkAdmin(request: Request) {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const db = getFirestore();
  const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
  const orders = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const { orderId, status } = await request.json();
  if (!orderId || !status) return NextResponse.json({ error: 'Brak danych' }, { status: 400 });
  const db = getFirestore();
  await db.collection('orders').doc(orderId).update({ status, updatedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
