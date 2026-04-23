import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Load service account
const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

const products = [
  {
    title: 'iPhone 15 / 15 Pro Hülle — Transparent Slim',
    category: 'Hüllen',
    price: { eur: 9.99, aliexpressEur: 2.50 },
    images: ['https://picsum.photos/seed/case1/600/600'],
    variants: { colors: ['Transparent', 'Schwarz', 'Blau'], models: ['iPhone 15', 'iPhone 15 Pro'] },
    badge: 'Bestseller',
    description: '<p>Hochwertige Slim-Hülle aus TPU für maximalen Schutz bei minimalem Gewicht. Perfekte Passform, alle Anschlüsse zugänglich.</p>',
  },
  {
    title: 'USB-C Ladekabel 2m — 100W Fast Charge',
    category: 'Kabel',
    price: { eur: 7.99, aliexpressEur: 1.80 },
    images: ['https://picsum.photos/seed/cable1/600/600'],
    variants: { colors: ['Schwarz', 'Weiß'], models: [] },
    badge: 'Neu',
    description: '<p>Geflochtenes USB-C Kabel mit 100W Schnellladefunktion. 2 Meter Länge, kompatibel mit allen USB-C Geräten.</p>',
  },
  {
    title: '65W GaN Ladegerät — 3 Ports USB-C/USB-A',
    category: 'Ladegeräte',
    price: { eur: 24.99, aliexpressEur: 7.50 },
    images: ['https://picsum.photos/seed/charger1/600/600'],
    variants: { colors: ['Weiß', 'Schwarz'], models: [] },
    badge: 'Bestseller',
    description: '<p>Kompaktes GaN-Ladegerät mit 65W Gesamtleistung. 2x USB-C + 1x USB-A. Lädt Laptop, Tablet und Smartphone gleichzeitig.</p>',
  },
  {
    title: 'Samsung Galaxy S24 Schutzglas 9H',
    category: 'Schutzglas',
    price: { eur: 6.99, aliexpressEur: 1.20 },
    images: ['https://picsum.photos/seed/glass1/600/600'],
    variants: { colors: [], models: ['Galaxy S24', 'Galaxy S24+', 'Galaxy S24 Ultra'] },
    badge: null,
    description: '<p>Gehärtetes Schutzglas mit 9H Härtegrad. Blasenfreie Montage, oleophobe Beschichtung gegen Fingerabdrücke.</p>',
  },
  {
    title: 'Powerbank 20000mAh — USB-C PD 22.5W',
    category: 'Powerbanks',
    price: { eur: 29.99, aliexpressEur: 9.00 },
    images: ['https://picsum.photos/seed/power1/600/600'],
    variants: { colors: ['Schwarz', 'Weiß', 'Blau'], models: [] },
    badge: 'Neu',
    description: '<p>Leistungsstarke Powerbank mit 20.000mAh Kapazität. USB-C PD 22.5W Schnellladung. Lädt Smartphones bis zu 5x auf.</p>',
  },
  {
    title: 'MagSafe Autohalterung — 360° drehbar',
    category: 'Zubehör',
    price: { eur: 14.99, aliexpressEur: 4.00 },
    images: ['https://picsum.photos/seed/mag1/600/600'],
    variants: { colors: ['Schwarz', 'Silber'], models: [] },
    badge: null,
    description: '<p>Magnetische Autohalterung kompatibel mit MagSafe. 360° drehbar, einfache Ein-Hand-Bedienung. Für Lüftung und Armaturenbrett.</p>',
  },
];

async function seed() {
  console.log('🌱 Seeding Firestore with demo products...\n');

  for (const p of products) {
    const slug = toSlug(p.title);
    const now = new Date().toISOString();
    const doc = {
      slug,
      title: p.title,
      description: p.description,
      category: p.category,
      images: p.images,
      price: p.price,
      variants: p.variants,
      badge: p.badge ?? null,
      aliexpressProductId: '',
      inStock: true,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('products/de/items').doc(slug).set(doc);
    console.log(`  ✓ ${p.title}`);
  }

  console.log('\n✅ Seeding complete! 6 products added.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
