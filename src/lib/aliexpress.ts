import crypto from 'crypto';

const BASE_URL = 'https://api-sg.aliexpress.com/sync';
const APP_KEY = process.env.ALIEXPRESS_APP_KEY!;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET!;

function sign(params: Record<string, string>, secret: string): string {
  const base = Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [k, v]) => acc + k + v, '');
  return crypto
    .createHmac('sha256', secret)
    .update(base)
    .digest('hex')
    .toUpperCase();
}

export async function callAPI(
  method: string,
  extraParams: Record<string, string> = {},
  session?: string
): Promise<Record<string, unknown>> {
  const timestamp = new Date()
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);

  const params: Record<string, string> = {
    app_key: APP_KEY,
    timestamp,
    sign_method: 'hmac-sha256',
    method,
    v: '2.0',
    format: 'json',
    ...extraParams,
  };

  if (session) {
    params.session = session;
  }

  params.sign = sign(params, APP_SECRET);

  const body = new URLSearchParams(params);
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`AliExpress API HTTP error: ${res.status}`);
  }

  return res.json();
}

export interface AliExpressProduct {
  product_id: number;
  product_title: string;
  product_images: string[];
  product_main_image: string;
  sale_price: string;
  original_price: string;
  currency: string;
  sku_list: AliExpressSku[];
  category_id: number;
}

export interface AliExpressSku {
  sku_id: string;
  sku_attr: string;
  price: string;
  stock: number;
  sku_image?: string;
}

export async function getProduct(
  productId: string
): Promise<AliExpressProduct | null> {
  try {
    const data = await callAPI('aliexpress.ds.product.get', {
      product_id: productId,
      target_currency: 'EUR',
      target_language: 'de_DE',
      ship_to_country: 'DE',
      local_country: 'DE',
      local_language: 'de',
    });

    const response = data[
      'aliexpress_ds_product_get_response'
    ] as AliExpressProduct | undefined;
    return response ?? null;
  } catch {
    return null;
  }
}
