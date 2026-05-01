import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getFirestore } from '@/lib/firebase-admin';
import { setSession } from '@/lib/auth';
import { verifyTurnstile } from '@/lib/turnstile';

export async function POST(request: Request) {
  try {
    const { email, password, turnstileToken } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Bitte E-Mail und Passwort eingeben.' }, { status: 400 });
    }

    // Verify Turnstile
    const humanCheck = await verifyTurnstile(turnstileToken ?? '');
    if (!humanCheck) {
      return NextResponse.json({ error: 'Sicherheitsüberprüfung fehlgeschlagen. Bitte versuche es erneut.' }, { status: 400 });
    }

    const db = getFirestore();
    const snap = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (snap.empty) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse oder Passwort.' }, { status: 401 });
    }

    const doc = snap.docs[0];
    const data = doc.data();

    const valid = await bcrypt.compare(password, data.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse oder Passwort.' }, { status: 401 });
    }

    // Check email verification
    if (!data.emailVerified) {
      return NextResponse.json({
        error: 'Bitte bestätige zuerst deine E-Mail-Adresse.',
        unverified: true,
        email: data.email,
      }, { status: 403 });
    }

    const user = { 
      uid: doc.id, 
      email: data.email, 
      firstName: data.firstName, 
      lastName: data.lastName,
      role: data.role || 'user'
    };
    await setSession(user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
