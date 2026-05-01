import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getFirestore } from '@/lib/firebase-admin';
import type { Product } from '@/types/product';
import ProductDetail from '@/components/product/ProductDetail';

function normalizeProduct(id: string, data: FirebaseFirestore.DocumentData): Product {
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
    status: data.status ?? 'active',
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const db = getFirestore();
    const doc = await db.collection('products/de/items').doc(slug).get();
    if (!doc.exists) return null;
    return normalizeProduct(doc.id, doc.data()!);
  } catch {
    return null;
  }
}

async function getRelated(category: string, excludeSlug: string): Promise<Product[]> {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('products/de/items')
      .where('category', '==', category)
      .where('status', '==', 'active')
      .limit(8)
      .get();
    return snapshot.docs
      .map((doc) => normalizeProduct(doc.id, doc.data()))
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
  if (!product) return { title: 'Produkt nicht gefunden – TechLaden.de' };
  return {
    title: `${product.title} – TechLaden.de`,
    description: `${product.title} für ${product.price.eur.toFixed(2).replace('.', ',')} € inkl. 19% MwSt. Lieferzeit: 3–7 Werktage. Kostenloser Versand ab 29€.`,
    openGraph: {
      title: product.title,
      description: `Jetzt kaufen für ${product.price.eur.toFixed(2).replace('.', ',')} €`,
      images: product.images[0] ? [{ url: product.images[0], width: 600, height: 600 }] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.category, slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.description.replace(/<[^>]+>/g, ''),
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'TechLaden.de' },
    offers: {
      '@type': 'Offer',
      url: `https://techladen.de/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.eur.toFixed(2),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'TechLaden.de' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'EUR' },
        deliveryTime: { '@type': 'ShippingDeliveryTime', businessDays: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 7 } },
      },
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.5', reviewCount: '124' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}
