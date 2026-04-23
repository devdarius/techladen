import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import type { Product } from '@/types/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection('products/de/items');

    if (category && category !== 'Alle') {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const products: Product[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product)
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Produkte' },
      { status: 500 }
    );
  }
}
