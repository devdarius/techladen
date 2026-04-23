import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFirestore } from '@/lib/firebase-admin';
import type { Product } from '@/types/product';
import ProductDetail from '@/components/product/ProductDetail';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const db = getFirestore();
    const doc = await db.collection('products/de/items').doc(slug).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Product;
  } catch {
    return null;
  }
}

async function getRelated(category: string, excludeSlug: string): Promise<Product[]> {
  try {
    const db = getFirestore();
    const snapshot = await db
      .collection('products/de/items')
      .where('category', '==', category)
      .limit(5)
      .get();
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Product))
      .filter((p) => p.slug !== excludeSlug)
      .slice(0, 4);
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produkt nicht gefunden' };
  return {
    title: `${product.title} – TechLaden.de`,
    description: `${product.title} für ${product.price.eur.toFixed(2).replace('.', ',')} € inkl. MwSt. Lieferzeit: 3–7 Werktage.`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.category, slug);

  return <ProductDetail product={product} related={related} />;
}
