import type { MetadataRoute } from 'next';
import { getFirestore } from '@/lib/firebase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://techladen.de';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/agb`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/widerruf`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const db = getFirestore();
    const snap = await db.collection('products/de/items').get();
    const productPages: MetadataRoute.Sitemap = snap.docs.map((doc) => ({
      url: `${base}/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
