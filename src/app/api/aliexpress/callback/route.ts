import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'Kein Code erhalten' }, { status: 400 });
  }

  // In production: exchange code for access token and store it
  // For now, just log and redirect
  console.log('AliExpress OAuth callback received:', { code, state });

  return NextResponse.redirect(
    new URL('/admin?oauth=success', request.url)
  );
}
