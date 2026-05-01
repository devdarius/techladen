import crypto from 'crypto';

const BASE_URL = 'https://api-sg.aliexpress.com/sync';
const APP_KEY = process.env.ALIEXPRESS_APP_KEY!;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET!;

// ─── Signing ──────────────────────────────────────────────────
export function sign(params: Record<string, string>, secret: string): string {
  const base = Object.entries(params)
    .filter(([k, v]) => v != null && v !== '' && k !== 'sign')
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [k, v]) => acc + k + v, '');
  return crypto.createHmac('sha256', secret).update(base).digest('hex').toUpperCase();
}

// ─── Core API caller ──────────────────────────────────────────
export async function callAPI(
  method: string,
  extraParams: Record<string, string> = {},
  session?: string
): Promise<Record<string, unknown>> {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const params: Record<string, string> = {
    app_key: APP_KEY,
    timestamp,
    sign_method: 'hmac-sha256',
    method,
    v: '2.0',
    format: 'json',
    ...extraParams,
  };

  if (session) params.session = session;
  params.sign = sign(params, APP_SECRET);

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });

  if (!res.ok) throw new Error(`AliExpress API HTTP error: ${res.status}`);
  return res.json();
}

// ─── Types ────────────────────────────────────────────────────
export interface AliExpressSku {
  sku_id: string;
  sku_attr: string;
  price: string;
  stock: number;
  sku_image?: string;
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
  evaluate_rate?: string;
  total_sales?: number;
}

export interface FreightOption {
  service_name: string;
  fee: string;
  delivery_time: string;
  tracking_available: boolean;
}

export interface TrackingInfo {
  tracking_number: string;
  logistics_company: string;
  tracking_status: string;
  tracking_details: Array<{
    time: string;
    location: string;
    status: string;
  }>;
}

export interface SearchResult {
  product_id: number;
  product_title: string;
  sale_price: string;
  main_image: string;
  product_url: string;
  total_sales: number;
  evaluate_rate: string;
}

// ─── 1. Get product details ───────────────────────────────────
export async function getProduct(productId: string, session?: string): Promise<AliExpressProduct | null> {
  try {
    const data = await callAPI('aliexpress.ds.product.get', {
      product_id: productId,
      target_currency: 'EUR',
      target_language: 'de_DE',
      ship_to_country: 'DE',
      local_country: 'DE',
      local_language: 'de',
    }, session);
    return (data['aliexpress_ds_product_get_response'] as AliExpressProduct) ?? null;
  } catch {
    return null;
  }
}

// ─── 2. Text search ───────────────────────────────────────────
export async function searchProducts(
  keyword: string,
  page = 1,
  pageSize = 20,
  session?: string,
  shipFromCountry: string = '' // np. DE, ES, FR, PL
): Promise<SearchResult[]> {
  try {
    const params: any = {
      search_key: keyword,
      target_currency: 'EUR',
      currency: 'EUR',
      target_language: 'de_DE',
      ship_to_country: 'DE',
      countryCode: 'DE',
      local_country: 'DE',
      local_language: 'de',
      local: 'de_DE',
      page_no: String(page),
      page_size: String(pageSize),
      sort: 'SALE_PRICE_ASC',
    };
    
    if (shipFromCountry) {
      params.ship_from_country = shipFromCountry;
    }

    const data = await callAPI('aliexpress.ds.text.search', params, session);
    
    if (data.error_response) {
      throw new Error(JSON.stringify(data.error_response));
    }
    
    const resp = data['aliexpress_ds_text_search_response'] as Record<string, any> | undefined;
    const productsData = resp?.data?.products?.selection_search_product;
    
    // If no list, return empty
    if (!productsData || !Array.isArray(productsData)) {
       return [];
    }
    
    // Map the new fields to our SearchResult interface
    const mappedList: SearchResult[] = productsData.map((item: any) => ({
      product_id: parseInt(item.itemId || '0'),
      product_title: item.title || '',
      sale_price: item.targetSalePrice || item.salePrice || '0',
      main_image: item.itemMainPic ? (item.itemMainPic.startsWith('//') ? 'https:' + item.itemMainPic : item.itemMainPic) : '',
      product_url: item.itemUrl ? (item.itemUrl.startsWith('//') ? 'https:' + item.itemUrl : item.itemUrl) : '',
      total_sales: parseInt((item.orders || '0').replace(/[^0-9]/g, '')),
      evaluate_rate: item.evaluateRate || '0',
    }));
    
    return mappedList;
  } catch (err) {
    throw err;
  }
}

// ─── 3. Freight query ─────────────────────────────────────────
export async function getFreightOptions(
  productId: string,
  quantity: number,
  countryCode = 'DE',
  skuId?: string,
  session?: string
): Promise<FreightOption[]> {
  try {
    const params: Record<string, string> = {
      product_id: productId,
      quantity: String(quantity),
      country_code: countryCode,
      send_goods_country_code: 'CN',
    };
    if (skuId) params.sku_id = skuId;

    const data = await callAPI('aliexpress.ds.freight.query', params, session);
    const resp = data['aliexpress_ds_freight_query_response'] as Record<string, unknown> | undefined;
    const list = resp?.['freight_list'] as FreightOption[] | undefined;
    return list ?? [];
  } catch {
    return [];
  }
}

// ─── 4. Create DS order (auto-fulfillment) ────────────────────
export interface DSOrderItem {
  product_id: string;
  sku_attr: string;
  product_count: number;
  logistics_service_name: string;
}

export interface DSAddress {
  country: string;
  province: string;
  city: string;
  address: string;
  zip: string;
  full_name: string;
  contact_person: string;
  mobile_no: string;
  phone_country: string;
  locale: string;
}

export interface DSOrderResult {
  is_success: boolean;
  order_list?: number[];
  error_code?: string;
  error_msg?: string;
}

export async function createDSOrder(
  items: DSOrderItem[],
  address: DSAddress,
  outOrderId: string,
  session: string
): Promise<DSOrderResult> {
  const orderRequest = {
    product_items: items,
    logistics_address: address,
    out_order_id: outOrderId,
  };

  const data = await callAPI(
    'aliexpress.ds.order.create',
    {
      param_place_order_request4_open_api_d_t_o: JSON.stringify(orderRequest),
      ds_extend_request: JSON.stringify({
        payment: { try_to_pay: 'true', pay_currency: 'USD' },
        trade_extra_param: { business_model: 'retail' },
      }),
    },
    session
  );

  const result = data['result'] as DSOrderResult | undefined;
  return result ?? { is_success: false, error_msg: 'No response' };
}

// ─── 5. Get order details ─────────────────────────────────────
export async function getDSOrderDetails(orderId: string, session: string) {
  try {
    const data = await callAPI(
      'aliexpress.trade.ds.order.get',
      { order_id: orderId },
      session
    );
    return data['aliexpress_trade_ds_order_get_response'] ?? null;
  } catch {
    return null;
  }
}

// ─── 6. Order tracking ────────────────────────────────────────
export async function getOrderTracking(
  orderId: string,
  session: string
): Promise<TrackingInfo | null> {
  try {
    const data = await callAPI(
      'aliexpress.ds.order.tracking.get',
      { order_id: orderId },
      session
    );
    return (data['aliexpress_ds_order_tracking_get_response'] as TrackingInfo) ?? null;
  } catch {
    return null;
  }
}

// ─── 7. OAuth token exchange ──────────────────────────────────
export async function exchangeToken(code: string): Promise<any> {
  try {
    const data = await callAPI('/auth/token/create', { code });
    return data;
  } catch (err) {
    return { catch_error: String(err) };
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
} | null> {
  try {
    const data = await callAPI('/auth/token/refresh', { refresh_token: refreshToken });
    if (data.error_response) {
      console.error("AliExpress token refresh error:", data.error_response);
      return null;
    }
    return data as { access_token: string; refresh_token: string; expires_in: number };
  } catch {
    return null;
  }
}
