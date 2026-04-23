import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from '@/lib/firebase-admin';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'E-Mail fehlt.' }, { status: 400 });

    const db = getFirestore();
    const snap = await db.collection('users').where('email', '==', email.toLowerCase()).limit(1).get();

    if (snap.empty) return NextResponse.json({ ok: true }); // Don't reveal if user exists

    const doc = snap.docs[0];
    const data = doc.data();

    if (data.emailVerified) {
      return NextResponse.json({ error: 'Diese E-Mail-Adresse wurde bereits bestätigt.' }, { status: 400 });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await doc.ref.update({
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail({ email: data.email, firstName: data.firstName, verificationToken });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
