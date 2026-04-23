import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getFirestore } from '@/lib/firebase-admin';
import { setSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Podaj e-mail i hasło' }, { status: 400 });
    }

    const db = getFirestore();
    const snap = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (snap.empty) {
      return NextResponse.json({ error: 'Nieprawidłowy e-mail lub hasło' }, { status: 401 });
    }

    const doc = snap.docs[0];
    const data = doc.data();
    const valid = await bcrypt.compare(password, data.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Nieprawidłowy e-mail lub hasło' }, { status: 401 });
    }

    const user = { uid: doc.id, email: data.email, firstName: data.firstName, lastName: data.lastName };
    await setSession(user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
