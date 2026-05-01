import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getFirestore } from '@/lib/firebase-admin';
import { createDSOrder, getFreightOptions } from '@/lib/aliexpress';
import type { Order } from '@/types/user';

// Get stored AliExpress access token from Firestore
async function getAccessToken(): Promise<string | null> {
  const db = getFirestore();
  const doc = await db.collection('settings').doc('aliexpress_token').get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  // Check if token is still valid
  if (data.expires_at && Date.now() > data.expires_at) return null;
  return data.access_token ?? null;
}

export async function POST(request: Request) {
  const userSession = await getSession();
  if (userSession?.role !== 'admin') {
    return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  }

  const { orderId } = await request.json();
  if (!orderId) return NextResponse.json({ error: 'Brak orderId' }, { status: 400 });

  const db = getFirestore();
  const orderDoc = await db.collection('orders').doc(orderId).get();
  if (!orderDoc.exists) return NextResponse.json({ error: 'Zamówienie nie istnieje' }, { status: 404 });

  const order = { id: orderDoc.id, ...orderDoc.data() } as Order & { id: string };

  const session = await getAccessToken();
  if (!session) {
    return NextResponse.json({
      error: 'Brak tokenu AliExpress. Zaloguj się przez OAuth w panelu admina.',
    }, { status: 401 });
  }

  const results = [];

  for (const item of order.items) {
    // Get available freight options for this product
    const freightOptions = await getFreightOptions(
      item.productId,
      item.quantity,
      order.shippingAddress.country
    );

    const logistics = freightOptions[0]?.service_name ?? 'CAINIAO_STANDARD';

    const dsResult = await createDSOrder(
      [{
        product_id: item.productId,
        sku_attr: '', // Would need to store sku_attr during import
        product_count: item.quantity,
        logistics_service_name: logistics,
      }],
      {
        country: order.shippingAddress.country,
        province: order.shippingAddress.city,
        city: order.shippingAddress.city,
        address: order.shippingAddress.street,
        zip: order.shippingAddress.zip,
        full_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        contact_person: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        mobile_no: order.shippingAddress.phone ?? '000000000',
        phone_country: '+49',
        locale: 'de_DE',
      },
      `TL-${order.id}-${item.productId}`,
      session
    );

    results.push({ productId: item.productId, result: dsResult });
  }

  // Update order with AliExpress order IDs
  const aliOrderIds = results
    .flatMap((r) => r.result.order_list ?? [])
    .map(String);

  await db.collection('orders').doc(orderId).update({
    aliexpressOrderIds: aliOrderIds,
    status: 'processing',
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, results, aliOrderIds });
}
