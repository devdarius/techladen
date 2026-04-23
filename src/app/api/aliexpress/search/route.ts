import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/aliexpress';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('q');
  const page = parseInt(searchParams.get('page') ?? '1');

  if (!keyword) return NextResponse.json({ error: 'Brak słowa kluczowego' }, { status: 400 });

  const results = await searchProducts(keyword, page);
  return NextResponse.json(results);
}
