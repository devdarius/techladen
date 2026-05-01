import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getFirestore, getAuthAdmin } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null);
  return NextResponse.json(session);
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 });

    const uid = session.uid;
    const db = getFirestore();
    const authAdmin = getAuthAdmin();

    // Usuń z Firebase Auth
    await authAdmin.deleteUser(uid);

    // Usuń dane użytkownika z Firestore
    await db.collection('users').doc(uid).delete();

    // Wyloguj sesję (skasuj ciastko)
    const cookieStore = await cookies();
    cookieStore.set('tl_session', '', { maxAge: 0, path: '/' });

    return NextResponse.json({ ok: true, message: 'Konto usunięte pomyślnie' });
  } catch (error) {
    console.error('Błąd usuwania konta:', error);
    return NextResponse.json({ error: 'Nie udało się usunąć konta' }, { status: 500 });
  }
}
