import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import type { Product } from '@/types/product';

function normalize(id: string, data: FirebaseFirestore.DocumentData): Product {
  return {
    id,
    slug: data.slug ?? id,
    title: data.title ?? '',
    description: data.description ?? '',
    category: data.category ?? '',
    images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
    price: { eur: data.price?.eur ?? 0, aliexpressEur: data.price?.aliexpressEur ?? 0 },
    variants: {
      colors: Array.isArray(data.variants?.colors) ? data.variants.colors : [],
      models: Array.isArray(data.variants?.models) ? data.variants.models : [],
    },
    aliexpressProductId: data.aliexpressProductId ?? '',
    inStock: data.inStock ?? true,
    createdAt: data.createdAt ?? '',
    updatedAt: data.updatedAt ?? '',
    badge: data.badge ?? null,
  };
}

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
    const products: Product[] = snapshot.docs.map((doc) => normalize(doc.id, doc.data()));
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Fehler beim Laden der Produkte' }, { status: 500 });
  }
}
