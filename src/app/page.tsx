import { getFirestore } from '@/lib/firebase-admin';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import CategoryFilter from '@/components/product/CategoryFilter';

const CATEGORIES = ['Alle', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks'];

async function getProducts(category?: string): Promise<Product[]> {
  try {
    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection('products/de/items');
    if (category && category !== 'Alle') {
      query = query.where('category', '==', category);
    }
    const snapshot = await query.orderBy('createdAt', 'desc').limit(48).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A0F1E] via-[#0d1530] to-[#0A0F1E] py-20 px-4">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, #00D4FF 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Premium{' '}
            <span style={{ color: '#00D4FF' }}>Handy-Zubehör</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
            Hochwertige Hüllen, Ladegeräte, Kabel und mehr. Lieferzeit: 3–7
            Werktage. Alle Preise inkl. 19% MwSt.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full">
              ✓ Schnelle Lieferung
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full">
              ✓ 14 Tage Rückgabe
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full">
              ✓ Sichere Zahlung
            </span>
          </div>
        </div>
      </section>

      {/* Category filter + grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <CategoryFilter categories={CATEGORIES} active={category} />

        {products.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">Keine Produkte gefunden.</p>
            <p className="text-sm mt-2">
              Importiere Produkte über das{' '}
              <a href="/admin" className="underline hover:text-slate-300">
                Admin-Panel
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
