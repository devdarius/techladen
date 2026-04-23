import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getFirestore } from '@/lib/firebase-admin';
import { setSession } from '@/lib/auth';
import type { User } from '@/types/user';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Wszystkie pola są wymagane' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Hasło musi mieć co najmniej 6 znaków' }, { status: 400 });
    }

    const db = getFirestore();
    const existing = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'Konto z tym adresem e-mail już istnieje' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const uid = crypto.randomUUID();
    const now = new Date().toISOString();

    const user: Omit<User, 'uid'> & { passwordHash: string } = {
      email: email.toLowerCase(),
      firstName,
      lastName,
      passwordHash,
      createdAt: now,
    };

    await db.collection('users').doc(uid).set(user);
    await setSession({ uid, email: email.toLowerCase(), firstName, lastName });

    return NextResponse.json({ uid, email: email.toLowerCase(), firstName, lastName });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
