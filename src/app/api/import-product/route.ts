import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import { callAPI } from '@/lib/aliexpress';
import type { Product } from '@/types/product';

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

function roundToNinetyNine(price: number): number {
  return Math.floor(price) + 0.99;
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
    skuMap, // stored for order fulfillment
  };
}

function mapCategory(categoryId: number): string {
  const map: Record<number, string> = {
    200010248: 'Hüllen', 200010249: 'Hüllen',
    200010250: 'Ladegeräte', 200010251: 'Kabel',
    200010252: 'Schutzglas', 200010253: 'Powerbanks',
  };
  return map[categoryId] ?? 'Zubehör';
}

export async function POST(request: Request) {
  try {
    const { productId } = await request.json() as { productId: string };
    if (!productId) return NextResponse.json({ error: 'productId ist erforderlich' }, { status: 400 });

    const data = await callAPI('aliexpress.ds.product.get', {
      product_id: productId,
      target_currency: 'EUR',
      target_language: 'de_DE',
      ship_to_country: 'DE',
      local_country: 'DE',
      local_language: 'de',
    });

    const resp = data['aliexpress_ds_product_get_response'] as Record<string, unknown> | undefined;

    if (!resp) {
      return NextResponse.json({ error: 'Produkt nicht gefunden', raw: data }, { status: 404 });
    }

    const title = (resp.product_title as string) ?? `Produkt ${productId}`;
    const images = (resp.product_images as string[]) ?? [];
    const mainImage = (resp.product_main_image as string) ?? '';
    const allImages = mainImage ? [mainImage, ...images.filter((i) => i !== mainImage)] : images;

    const salePriceStr = (resp.sale_price as string) ?? '0';
    const aliexpressEur = parseFloat(salePriceStr) || 0;
    const eur = roundToNinetyNine(aliexpressEur * 2.8);

    const skuList = (resp.sku_list as Array<{ sku_attr?: string; sku_id?: string; price?: string; stock?: number }>) ?? [];
    const { colors, models, skuMap } = extractVariants(skuList);
    const categoryId = (resp.category_id as number) ?? 0;
    const category = mapCategory(categoryId);

    // Check stock from SKUs
    const totalStock = skuList.reduce((s, sku) => s + (sku.stock ?? 0), 0);

    const slug = toSlug(title) + '-' + productId;
    const now = new Date().toISOString();

    const product: Omit<Product, 'id'> & { skuMap: Record<string, unknown> } = {
      slug,
      title,
      description: '',
      category,
      images: allImages.slice(0, 8),
      price: { eur, aliexpressEur },
      variants: { colors, models },
      skuMap, // for fulfillment
      aliexpressProductId: productId,
      inStock: totalStock > 0,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
    };

    const db = getFirestore();
    await db.collection('products/de/items').doc(slug).set(product);

    return NextResponse.json({ id: slug, ...product });
  } catch (error) {
    console.error('POST /api/import-product error:', error);
    return NextResponse.json({ error: 'Import fehlgeschlagen', details: String(error) }, { status: 500 });
  }
}
