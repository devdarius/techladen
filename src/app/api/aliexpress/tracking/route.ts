import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { getOrderTracking } from '@/lib/aliexpress';

async function getAccessToken(): Promise<string | null> {
  const db = getFirestore();
  const doc = await db.collection('settings').doc('aliexpress_token').get();
  if (!doc.exists) return null;
  return doc.data()?.access_token ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ error: 'Brak orderId' }, { status: 400 });

  const session = await getAccessToken();
  if (!session) return NextResponse.json({ error: 'Brak tokenu AliExpress' }, { status: 401 });

  const tracking = await getOrderTracking(orderId, session);
  return NextResponse.json(tracking);
}
