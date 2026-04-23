import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

function checkAdmin(request: Request) {
  const pw = request.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const db = getFirestore();
  const snap = await db.collection('users').orderBy('createdAt', 'desc').get();
  const users = snap.docs.map((doc) => {
    const d = doc.data();
    return {
      uid: doc.id,
      email: d.email,
      firstName: d.firstName,
      lastName: d.lastName,
      createdAt: d.createdAt,
      phone: d.phone ?? null,
    };
  });
  return NextResponse.json(users);
}

export async function DELETE(request: Request) {
  if (!checkAdmin(request)) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const { uid } = await request.json();
  if (!uid) return NextResponse.json({ error: 'Brak uid' }, { status: 400 });
  const db = getFirestore();
  await db.collection('users').doc(uid).delete();
  return NextResponse.json({ ok: true });
}
