import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/aliexpress';
import { getFirestore } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('q');
  const page = parseInt(searchParams.get('page') ?? '1');

  if (!keyword) return NextResponse.json({ error: 'Brak słowa kluczowego' }, { status: 400 });

  try {
    const db = getFirestore();
    const tokenDoc = await db.collection('settings').doc('aliexpress_token').get();
    const tokenData = tokenDoc.data();
    
    if (!tokenData || !tokenData.access_token) {
      return NextResponse.json({ error: 'Brak tokena AliExpress' }, { status: 401 });
    }

    const results = await searchProducts(keyword, page, 20, tokenData.access_token);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
