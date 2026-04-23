import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getFirestore } from '@/lib/firebase-admin';
import { sendVerificationEmail } from '@/lib/email';
import { verifyTurnstile } from '@/lib/turnstile';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, turnstileToken } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 });
    }

    // Verify Turnstile
    const humanCheck = await verifyTurnstile(turnstileToken ?? '');
    if (!humanCheck) {
      return NextResponse.json({ error: 'Sicherheitsüberprüfung fehlgeschlagen. Bitte versuche es erneut.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Das Passwort muss mindestens 6 Zeichen lang sein.' }, { status: 400 });
    }

    const db = getFirestore();
    const existing = await db.collection('users').where('email', '==', email.toLowerCase()).get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const uid = crypto.randomUUID();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const now = new Date().toISOString();

    await db.collection('users').doc(uid).set({
      email: email.toLowerCase(),
      firstName,
      lastName,
      passwordHash,
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
      createdAt: now,
    });

    // Send verification email
    await sendVerificationEmail({ email: email.toLowerCase(), firstName, verificationToken });

    return NextResponse.json({ ok: true, message: 'Bitte überprüfe deine E-Mails und bestätige dein Konto.' });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Serverfehler. Bitte versuche es erneut.' }, { status: 500 });
  }
}
