import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { setSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/email-bestaetigung?error=missing', request.url));
  }

  const db = getFirestore();
  const snap = await db.collection('users')
    .where('verificationToken', '==', token)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.redirect(new URL('/email-bestaetigung?error=invalid', request.url));
  }

  const doc = snap.docs[0];
  const data = doc.data();

  if (data.verificationTokenExpires < Date.now()) {
    return NextResponse.redirect(new URL('/email-bestaetigung?error=expired', request.url));
  }

  if (data.emailVerified) {
    return NextResponse.redirect(new URL('/anmelden?verified=already', request.url));
  }

  // Mark as verified
  await doc.ref.update({
    emailVerified: true,
    verificationToken: null,
    verificationTokenExpires: null,
  });

  // Auto-login after verification
  await setSession({
    uid: doc.id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  });

  return NextResponse.redirect(new URL('/email-bestaetigung?success=true', request.url));
}
