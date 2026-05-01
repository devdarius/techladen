import { NextResponse } from 'next/server';
import { exchangeToken } from '@/lib/aliexpress';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Kein Code erhalten' }, { status: 400 });
  }

  const tokenData = await exchangeToken(code);

  if (!tokenData || !tokenData.access_token) {
    const errorDetails = JSON.stringify(tokenData || {});
    return NextResponse.redirect(new URL(`/admin?oauth=error&details=${encodeURIComponent(errorDetails)}`, request.url));
  }

  // Store token in Firestore
  const db = getFirestore();
  await db.collection('settings').doc('aliexpress_token').set({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_at: Date.now() + tokenData.expires_in * 1000,
    refresh_expires_at: Date.now() + tokenData.refresh_expires_in * 1000,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.redirect(new URL('/admin?oauth=success', request.url));
}
