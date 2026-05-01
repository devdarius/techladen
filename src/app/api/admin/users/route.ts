import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';

import { getSession } from '@/lib/auth';

async function checkAdmin() {
  const session = await getSession();
  return session?.role === 'admin';
}

export async function GET(request: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
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
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  const { uid } = await request.json();
  if (!uid) return NextResponse.json({ error: 'Brak uid' }, { status: 400 });
  const db = getFirestore();
  await db.collection('users').doc(uid).delete();
  return NextResponse.json({ ok: true });
}
