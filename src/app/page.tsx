import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getFirestore } from '@/lib/firebase-admin';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import CategoryFilter from '@/components/product/CategoryFilter';
import TrustSection from '@/components/home/TrustSection';
import HeroSection from '@/components/home/HeroSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import RecentlyViewed from '@/components/home/RecentlyViewed';

export const metadata: Metadata = {
  title: 'TechLaden.de – Premium Handy-Zubehör | Schnelle Lieferung nach DE',
  description: 'Hochwertige Hüllen, Ladegeräte, Kabel, Schutzglas und Powerbanks. Kostenloser Versand ab 29€. Lieferzeit 3–7 Werktage. Alle Preise inkl. 19% MwSt.',
  openGraph: {
    title: 'TechLaden.de – Premium Handy-Zubehör',
    description: 'Hochwertige Hüllen, Ladegeräte, Kabel und mehr. Schnelle Lieferung nach Deutschland.',
    type: 'website',
    url: 'https://techladen.de',
  },
};

const CATEGORIES = ['Alle', 'MagSafe', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks', 'Gaming', 'Smartwatch', 'Zubehör'];

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
  const allProducts = category === 'Alle' ? products : await getProducts();

  return (
    <>
      {/* 1. Hero with CTA + flash sale countdown */}
      <HeroSection />

      {/* 2. Trust bar — once only */}
      <TrustSection />

      {/* 3. Category showcase */}
      <CategoryShowcase />

      {/* 4. Flash Sale Section */}
      <FlashSaleSection products={allProducts} />

      {/* 5. All products grid */}
      <section id="produkte" className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#2563EB] mb-2">Alle Produkte</p>
              <h2 className="product-section-title">
                {category === 'Alle' ? 'Bestseller' : category}
              </h2>
            </div>
          </div>

          {/* Category filter tabs */}
          <Suspense>
            <CategoryFilter categories={CATEGORIES} active={category} />
          </Suspense>

          {/* Products */}
          <div className="mt-8">
            {products.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed border-[#E2E8F0] rounded-2xl bg-[#F8FAFF]">
                <p className="text-[#0F172A] text-lg font-bold">Noch keine Produkte</p>
                <p className="text-[#64748B] text-sm mt-2">
                  Importiere Produkte über das{' '}
                  <a href="/admin" className="text-[#2563EB] hover:underline font-semibold">Admin-Panel</a>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Recently viewed */}
      <RecentlyViewed />

      {/* 7. Newsletter */}
      <NewsletterSection />
    </>
  );
}
