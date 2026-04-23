import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getFirestore } from '@/lib/firebase-admin';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import CategoryFilter from '@/components/product/CategoryFilter';
import TrustSection from '@/components/home/TrustSection';
import HeroSection from '@/components/home/HeroSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'TechLaden.de – Premium Handy-Zubehör',
  description: 'Hochwertige Hüllen, Ladegeräte, Kabel, Schutzglas und Powerbanks. Kostenloser Versand ab 29€. Lieferzeit 3–7 Werktage. Alle Preise inkl. 19% MwSt.',
  openGraph: {
    title: 'TechLaden.de – Premium Handy-Zubehör',
    description: 'Hochwertige Hüllen, Ladegeräte, Kabel und mehr. Schnelle Lieferung nach Deutschland.',
    type: 'website',
    url: 'https://techladen.de',
  },
};

const CATEGORIES = ['Alle', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks', 'Zubehör'];

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

async function getProducts(category?: string): Promise<Product[]> {
  try {
    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection('products/de/items');
    if (category && category !== 'Alle') {
      query = query.where('category', '==', category);
    }
    const snapshot = await query.orderBy('createdAt', 'desc').limit(48).get();
    return snapshot.docs.map((doc) => normalize(doc.id, doc.data()));
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ kategorie?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.kategorie ?? 'Alle';
  const products = await getProducts(category);

  return (
    <>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Category filter */}
        <Suspense>
          <CategoryFilter categories={CATEGORIES} active={category} />
        </Suspense>

        {/* Products */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
            🔥 Bestseller
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-card">
              <p className="text-text-secondary text-lg font-medium">Noch keine Produkte</p>
              <p className="text-text-secondary text-sm mt-2">
                Importiere Produkte über das{' '}
                <a href="/admin" className="text-primary hover:underline">Admin-Panel</a>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <TrustSection />
      <NewsletterSection />
    </>
  );
}
