import { NextResponse } from 'next/server';
import { getSession, setSession } from '@/lib/auth';
import { getFirestore } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Niewłaściwe hasło' }, { status: 401 });
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Najpierw się zaloguj na swoje konto' }, { status: 401 });
    }

    const db = getFirestore();
    await db.collection('users').doc(session.uid).update({ role: 'admin' });

    // Strip JWT-specific fields before re-signing
    const { uid, email, firstName, lastName } = session;
    await setSession({ uid, email, firstName, lastName, role: 'admin' });

    return NextResponse.json({ ok: true, message: 'Uprawnienia nadane pomyślnie!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
