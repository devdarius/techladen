import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getFirestore } from '@/lib/firebase-admin';
import { searchProducts, getProduct } from '@/lib/aliexpress';
import type { Product } from '@/types/product';

function slugify(text: string) {
  return text.toLowerCase().replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

function r99(price: number) { return Math.floor(price) + 0.99; }

function mapCategory(categoryId: number): string {
  const map: Record<number, string> = {
    200010248: 'Hüllen', 200010249: 'Hüllen',
    200010250: 'Ladegeräte', 200010251: 'Kabel',
    200010252: 'Schutzglas', 200010253: 'Powerbanks',
  };
  return map[categoryId] ?? 'Zubehör';
}

function extractVariants(skuList: Array<{ sku_attr?: string; sku_id?: string; price?: string; stock?: number }>) {
  const colors = new Set<string>();
  const models = new Set<string>();
  const skuMap: Record<string, { sku_id: string; price: string; stock: number }> = {};

  for (const sku of skuList) {
    if (!sku.sku_attr) continue;
    const parts = sku.sku_attr.split(';');
    for (const part of parts) {
      const match = part.match(/#(.+)$/);
      if (match) {
        const val = match[1].trim();
        if (val.length < 30) colors.add(val);
      }
    }
    if (sku.sku_id) {
      skuMap[sku.sku_attr] = {
        sku_id: sku.sku_id,
        price: sku.price ?? '0',
        stock: sku.stock ?? 0,
      };
    }
  }

  return {
    colors: Array.from(colors).slice(0, 10),
    models: Array.from(models).slice(0, 20),
    skuMap,
  };
}

export async function POST() {
  try {
    const session = await getSession();
    if (session?.role !== 'admin') return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });

    const db = getFirestore();
    const tokenDoc = await db.collection('settings').doc('aliexpress_token').get();
    const tokenData = tokenDoc.data();
    
    if (!tokenData || !tokenData.access_token) {
      return NextResponse.json({ error: 'Brak tokena AliExpress' }, { status: 401 });
    }

    // 1. Delete all existing products
    const col = db.collection('products/de/items');
    const existing = await col.get();
    const batch = db.batch();
    existing.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();

    const QUERIES = [
      {
        q: 'MagSafe wireless charger iPhone',
        cat: 'MagSafe',
        keywords: ['magsafe', 'magnetic', 'wireless charg', 'qi charger', 'mag safe']
      },
      {
        q: 'iPhone 15 14 13 case cover',
        cat: 'Hüllen',
        keywords: ['iphone', 'case', 'cover', 'hülle', 'schutzhülle', 'coque']
      },
      {
        q: 'GaN USB C fast charger 65w 100w',
        cat: 'Ladegeräte',
        keywords: ['charger', 'gan', 'adapter', 'ladegerät', 'fast charg', 'usb c charger', 'pd charger', '65w', '100w', '45w']
      },
      {
        q: 'USB C cable fast charging 100w braided',
        cat: 'Kabel',
        keywords: ['cable', 'kabel', 'usb', 'type-c', 'type c', 'charging cable', 'data cable', 'braided']
      },
      {
        q: 'iPhone tempered glass screen protector',
        cat: 'Schutzglas',
        keywords: ['glass', 'screen protector', 'panzerglas', 'schutzglas', 'tempered', 'schutzfolie', 'film']
      },
      {
        q: 'Powerbank 10000mAh 20000mAh portable charger',
        cat: 'Powerbanks',
        keywords: ['powerbank', 'power bank', 'battery pack', 'portable charger', '10000', '20000', 'mah']
      }
    ];

    // Magazyny z krótkim czasem dostawy do Niemiec (kolejność priorytetowa)
    const EU_WAREHOUSES = ['DE', 'PL', 'CZ', 'FR', 'ES'];

    let totalAdded = 0;
    const batch2 = db.batch();
    const now = new Date().toISOString();

    for (const query of QUERIES) {
      const bestResults: any[] = [];
      
      // Szukamy produktów globalnie, kierowanych na rynek DE
      try {
        const results = await searchProducts(query.q, 1, 60, tokenData.access_token, '');
        
        for (const res of results) {
          if (bestResults.length >= 5) break;
          if (!res.product_id) continue;

          // HARD TITLE FILTER – odrzucamy wszystko co nie pasuje do kategorii
          const titleLower = (res.product_title || '').toLowerCase();
          const isRelevant = query.keywords.some(kw => titleLower.includes(kw));
          if (!isRelevant) continue;

          // Sweet spot: odrzucamy produkty z brakiem zamowień i totalnych bestsellerów
          const sales = res.total_sales || 0;
          if (sales > 15000) continue;

          // Unikamy duplikatów
          if (!bestResults.find(r => r.product_id === res.product_id)) {
            bestResults.push(res);
          }
        }
      } catch (e) {
        console.warn(`Błąd wyszukiwania ${query.q}:`, e);
      }
      
      // Teraz pobieramy pełne detale dla uzbieranych wyników
      for (const res of bestResults) {
        // Fetch full product details
        const details = await getProduct(res.product_id.toString(), tokenData.access_token);
        if (!details) continue;

        const title = details.product_title || res.product_title;
        const mainImage = details.product_main_image || res.main_image;
        const images = details.product_images || [mainImage];
        const allImages = mainImage ? [mainImage, ...images.filter((i) => i !== mainImage)] : images;

        const aliEur = parseFloat(details.sale_price || res.sale_price || '0');
        if (aliEur <= 0) continue;
        const eur = r99(aliEur * 2.8); // 2.8x Margin

        const slug = slugify(title) + '-' + res.product_id;
        
        const skuList = details.sku_list || [];
        const { colors, models, skuMap } = extractVariants(skuList);
        const totalStock = skuList.reduce((s, sku) => s + (sku.stock ?? 0), 0) || 999;
        const category = details.category_id ? mapCategory(details.category_id) : query.cat;

        const productRef = col.doc(slug);
        
        const productData = {
          id: slug,
          slug,
          title,
          description: '<p>Qualitätsprodukt mit schnellem Versand aus Europa.</p>',
          category,
          images: allImages.slice(0, 8),
          price: { eur, aliexpressEur: aliEur },
          variants: { colors, models },
          skuMap,
          aliexpressProductId: res.product_id.toString(),
          inStock: totalStock > 0,
          badge: totalAdded % 3 === 0 ? 'BESTSELLER' : null,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };
        
        batch2.set(productRef, productData);
        totalAdded++;
      }
    }

    await batch2.commit();
    
    return NextResponse.json({ ok: true, message: `Pomyślnie zaimportowano ${totalAdded} produktów wysyłanych z Niemiec!` });
  } catch (error: any) {
    console.error('Auto import error:', error);
    return NextResponse.json({ error: error.message || 'Błąd importu', details: String(error) }, { status: 500 });
  }
}
