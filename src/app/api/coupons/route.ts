import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import type { Coupon } from '@/types/coupon';

function checkAdmin(req: Request) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

// GET all coupons (admin)
export async function GET(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const db = getFirestore();
  const snap = await db.collection('coupons').get();
  const coupons = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(coupons);
}

// POST create coupon (admin)
export async function POST(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const body = await request.json() as Partial<Coupon>;

  const code = (body.code ?? '').trim().toUpperCase();
  if (!code) return NextResponse.json({ error: 'Kod jest wymagany' }, { status: 400 });

  const coupon: Omit<Coupon, 'id'> = {
    code,
    type: body.type ?? 'percent',
    value: body.value ?? 10,
    minOrderValue: body.minOrderValue ?? 0,
    maxUses: body.maxUses ?? 0,
    usedCount: 0,
    maxUsesPerUser: body.maxUsesPerUser ?? 1,
    expiresAt: body.expiresAt ?? null,
    onlyNewCustomers: body.onlyNewCustomers ?? false,
    category: body.category ?? null,
    active: true,
    description: body.description ?? '',
    createdAt: new Date().toISOString(),
  };

  const db = getFirestore();
  await db.collection('coupons').doc(code).set(coupon);
  return NextResponse.json({ id: code, ...coupon });
}

// PATCH update coupon (admin)
export async function PATCH(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const { code, ...updates } = await request.json();
  if (!code) return NextResponse.json({ error: 'Brak kodu' }, { status: 400 });
  const db = getFirestore();
  await db.collection('coupons').doc(code.toUpperCase()).update(updates);
  return NextResponse.json({ ok: true });
}

// DELETE coupon (admin)
export async function DELETE(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const { code } = await request.json();
  const db = getFirestore();
  await db.collection('coupons').doc(code.toUpperCase()).delete();
  return NextResponse.json({ ok: true });
}
