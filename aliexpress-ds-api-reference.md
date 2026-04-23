# AliExpress Dropshipping API Complete Reference

> **Version:** 2025-2026 Edition  
> **Base URL:** `https://api-sg.aliexpress.com/sync`  
> **Alternative URL:** `https://gw.api.taobao.com/router/rest`  
> **Protocol:** HTTPS / HTTP  
> **Format:** JSON  
> **Sign Method:** HMAC-SHA256 (recommended) or MD5

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Request Signing (HMAC-SHA256)](#3-request-signing-hmac-sha256)
4. [Auth API Endpoints](#4-auth-api-endpoints)
5. [Dropshipping API Endpoints](#5-dropshipping-api-endpoints)
6. [Product API](#6-product-api)
7. [Order API](#7-order-api)
8. [Freight API](#8-freight-api)
9. [Search API](#9-search-api)
10. [Member & Data API](#10-member--data-api)
11. [Webhook](#11-webhook)
12. [Error Codes](#12-error-codes)
13. [Rate Limits](#13-rate-limits)
14. [Appendix](#14-appendix)

---

## 1. Overview

The AliExpress Dropshipping API (aliexpress.ds.*) enables developers to build dropshipping applications that can:

- Search and query products from AliExpress
- Get detailed product information including pricing, shipping, and variants
- Calculate freight/shipping costs
- Create and manage orders
- Track order shipments
- Access member benefits and commissions

### API Categories

| Category | API Prefix | Description |
|----------|-----------|-------------|
| **Auth** | `/auth/token/*` | Authentication and token management |
| **Product** | `aliexpress.ds.product.*` | Product information queries |
| **Order** | `aliexpress.ds.order.*`, `aliexpress.trade.ds.*` | Order creation and management |
| **Freight** | `aliexpress.ds.freight.*`, `aliexpress.logistics.*` | Shipping and freight calculation |
| **Search** | `aliexpress.ds.*.search*` | Text and image search |
| **Category** | `aliexpress.ds.category.*` | Category information |
| **Feed** | `aliexpress.ds.feed.*` | Product feeds |
| **Member** | `aliexpress.ds.member.*` | Member benefits and data |

---

## 2. Authentication & Authorization

### 2.1 OAuth 2.0 Flow

The AliExpress API uses OAuth 2.0 for authentication. The flow involves:

1. **Register Application** - Get `App Key` and `App Secret` from the AliExpress Open Platform
2. **Seller Authorization** - Get authorization code via OAuth redirect
3. **Token Exchange** - Exchange code for access token
4. **API Calls** - Use access token in API requests

### 2.2 Authorization URL

```
https://openservice.aliexpress.com/authorize/app_redirect?app_id=YOUR_APP_KEY&state=STATE&redirect_uri=YOUR_REDIRECT_URI
```

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `app_id` | String | Yes | Your App Key |
| `state` | String | Yes | CSRF protection random string |
| `redirect_uri` | String | Yes | URL to receive authorization code |

### 2.3 Authorization Callback

After seller authorization, AliExpress redirects to:

```
YOUR_REDIRECT_URI?code=AUTH_CODE&state=STATE&sp=ae&account_platform=seller_center
```

The `code` parameter is the authorization code used to get access tokens.

### 2.4 Common Request Parameters

All API requests must include these parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `app_key` | String | Yes | Your App Key |
| `timestamp` | String | Yes | Current timestamp (format: `YYYY-MM-DD HH:MM:SS`) |
| `sign_method` | String | Yes | Signature method: `hmac-sha256` (recommended) or `md5` |
| `sign` | String | Yes | Request signature |
| `method` | String | Yes | API method name (e.g., `aliexpress.ds.product.get`) |
| `v` | String | Yes | API version: `2.0` |
| `format` | String | No | Response format: `json` (default) or `xml` |
| `session` | String | Yes* | Access token (*required for protected APIs) |
| `simplify` | Boolean | No | Return simplified response: `true` or `false` |
| `partner_id` | String | No | SDK name |

---

## 3. Request Signing (HMAC-SHA256)

### 3.1 Signature Algorithm

AliExpress API uses HMAC-SHA256 for request signing. The process:

### Step 1: Sort Parameters

Sort all request parameters alphabetically by key name (excluding `sign` itself).

### Step 2: Concatenate Parameters

Create a string by concatenating all key-value pairs:
```
STRING = API_NAME + KEY1 + VALUE1 + KEY2 + VALUE2 + ...
```

**Important:** Do NOT URL-encode the concatenated string.

### Step 3: Generate HMAC-SHA256

```
sign = HMAC-SHA256(AppSecret, STRING).toUpperCase()
```

### 3.2 JavaScript/Node.js Example

```javascript
const crypto = require('crypto');

function generateSign(params, apiName, appSecret) {
  // Step 1: Sort parameters alphabetically
  const sortedKeys = Object.keys(params).sort();

  // Step 2: Concatenate key-value pairs
  let signString = apiName;
  for (const key of sortedKeys) {
    if (key !== 'sign' && params[key] !== undefined) {
      signString += key + params[key];
    }
  }

  // Step 3: Generate HMAC-SHA256
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(signString);
  return hmac.digest('hex').toUpperCase();
}

// Usage example
const params = {
  app_key: 'YOUR_APP_KEY',
  timestamp: '2024-01-15 10:30:00',
  sign_method: 'hmac-sha256',
  method: 'aliexpress.ds.product.get',
  v: '2.0',
  format: 'json',
  product_id: '1005001699302548',
  local_country: 'US',
  local_language: 'en'
};

const sign = generateSign(params, 'aliexpress.ds.product.get', 'YOUR_APP_SECRET');
params.sign = sign;
```

### 3.3 Python Example

```python
import hmac
import hashlib
from urllib.parse import urlencode

def generate_sign(params, api_name, app_secret):
    # Sort parameters alphabetically
    sorted_params = sorted(params.items(), key=lambda x: x[0])

    # Concatenate key-value pairs
    sign_string = api_name
    for key, value in sorted_params:
        if key != 'sign' and value is not None:
            sign_string += f"{key}{value}"

    # Generate HMAC-SHA256
    sign = hmac.new(
        app_secret.encode('utf-8'),
        sign_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest().upper()

    return sign

# Usage
params = {
    'app_key': 'YOUR_APP_KEY',
    'timestamp': '2024-01-15 10:30:00',
    'sign_method': 'hmac-sha256',
    'method': 'aliexpress.ds.product.get',
    'v': '2.0',
    'format': 'json',
    'product_id': '1005001699302548',
    'local_country': 'US',
    'local_language': 'en'
}

sign = generate_sign(params, 'aliexpress.ds.product.get', 'YOUR_APP_SECRET')
params['sign'] = sign
```

### 3.4 PHP Example

```php
<?php
function generateSign($params, $apiName, $appSecret) {
    // Sort parameters
    ksort($params);

    // Concatenate
    $signString = $apiName;
    foreach ($params as $key => $value) {
        if ($key !== 'sign' && $value !== null) {
            $signString .= $key . $value;
        }
    }

    // HMAC-SHA256
    return strtoupper(hash_hmac('sha256', $signString, $appSecret));
}
?>
```

### 3.5 MD5 Alternative (Legacy)

```javascript
// MD5 signing (legacy, use HMAC-SHA256 for new apps)
function generateMD5Sign(params, appSecret) {
  const sortedKeys = Object.keys(params).sort();
  let signString = appSecret;
  for (const key of sortedKeys) {
    if (key !== 'sign' && params[key] !== undefined) {
      signString += key + params[key];
    }
  }
  signString += appSecret;
  return crypto.createHash('md5').update(signString).digest('hex').toUpperCase();
}
```

---

## 4. Auth API Endpoints

### 4.1 generateSecurityToken

**Endpoint:** `POST /auth/token/security/create`  
**Method:** `GET/POST`  
**Description:** Generate access_token safely for calling APIs

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `code` | String | Yes | OAuth code from app callback URL |
| `uuid` | String | No | UUID for tracking |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `access_token` | String | Access token for API calls |
| `refresh_token` | String | Token for refreshing when refresh_expires_in > 0 |
| `expires_in` | Number | Access token expiry time in seconds |
| `refresh_expires_in` | Number | Refresh token expiry time in seconds |
| `expire_time` | Number | Absolute expire timestamp |
| `refresh_token_valid_time` | Number | Refresh token valid until timestamp |
| `account_id` | String | Account ID (null if account_platform=seller_center) |
| `user_id` | String | User ID |
| `seller_id` | String | Seller ID |
| `sp` | String | Service provider code |
| `locale` | String | Locale (e.g., "zh_CN") |

#### Example Request

```
POST /sync
app_key=YOUR_APP_KEY
&timestamp=2024-01-15 10:30:00
&sign_method=hmac-sha256
&sign=GENERATED_SIGN
&method=/auth/token/security/create
&v=2.0
&code=0_2DL4DV3jcU1UOT7WGI1A4rY91
&uuid=uuid
```

#### Example Response

```json
{
  "code": "0",
  "request_id": "0ba2887315178178017221014",
  "refresh_token_valid_time": "1437129035362",
  "expire_time": "1437129035362",
  "locale": "zh_CN",
  "access_token": "50000601c30atpedfgu3LVvik87Ixlsvle3mSoB7701ceb156fPunYZ43GBg",
  "refresh_token": "500016000300bwa2WteaQyfwBMnPxurcA0mXGhQdTt18356663CfcDTYpWoi",
  "account_id": "7063844",
  "user_id": "1001",
  "seller_id": "1001",
  "refresh_expires_in": "60",
  "expires_in": "10",
  "sp": "ae"
}
```

---

### 4.2 generateToken

**Endpoint:** `POST /auth/token/create`  
**Method:** `GET/POST`  
**Description:** Generate access token (standard method, less secure than security create)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `code` | String | Yes | OAuth authorization code |
| `uuid` | String | No | UUID |

#### Response Fields

Same as generateSecurityToken.

---

### 4.3 refreshSecurityToken

**Endpoint:** `POST /auth/token/security/refresh`  
**Method:** `GET/POST`  
**Description:** Refresh access token securely using refresh token

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `refresh_token` | String | Yes | Refresh token from token creation |
| `uuid` | String | No | UUID |

#### Response Fields

Same as generateSecurityToken.

---

### 4.4 refreshToken

**Endpoint:** `POST /auth/token/refresh`  
**Method:** `GET/POST`  
**Description:** Refresh access token (standard method)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `refresh_token` | String | Yes | Refresh token |
| `uuid` | String | No | UUID |

---

## 5. Dropshipping API Endpoints

### 5.1 Complete Endpoint List

| # | Method Name | Description |
|---|-------------|-------------|
| 1 | `aliexpress.ds.product.get` | Product info query for DS |
| 2 | `aliexpress.ds.product.wholesale.get` | Product info for wholesale business |
| 3 | `aliexpress.ds.product.specialinfo.get` | Get product special info (certification) |
| 4 | `aliexpress.ds.image.search` | Image search for dropshipping |
| 5 | `aliexpress.ds.image.searchV2` | Image search v2 (improved) |
| 6 | `aliexpress.ds.text.search` | Text search for DS |
| 7 | `aliexpress.ds.feed.itemids.get` | Fetch items with feedname |
| 8 | `aliexpress.ds.category.get` | Get AE Category ID and Name |
| 9 | `aliexpress.ds.freight.query` | Delivery/Freight API |
| 10 | `aliexpress.ds.order.create` | DS Order Create and Pay |
| 11 | `aliexpress.ds.order.tracking.get` | DS Order Tracking |
| 12 | `aliexpress.trade.ds.order.get` | Buyer query order details |
| 13 | `aliexpress.logistics.buyer.freight.calculate` | Freight calculation for buyers |
| 14 | `aliexpress.ds.member.benefit.get` | DS Member benefit get |
| 15 | `aliexpress.ds.search.event.report` | Search event report |
| 16 | `aliexpress.ds.recommend.feed.get` | Get recommended product feed |
| 17 | `aliexpress.ds.commissionorder.listbyindex` | Commission order list by index |
| 18 | `aliexpress.ds.trade.order.get` | Trade order query |
| 19 | `aliexpress.ds.member.orderdata.submit` | Dropshipper data回流 |
| 20 | `aliexpress.ds.add.info` | Report DS info |
| 21 | `aliexpress.offer.ds.product.simplequery` | Simple product query |
| 22 | `aliexpress.logistics.ds.trackinginfo.query` | Query logistics tracking |
| 23 | `aliexpress.postproduct.redefining.findaeproductbyidfordropshipper` | Find product by ID for dropshipper |

---

## 6. Product API

### 6.1 aliexpress.ds.product.get

**Method:** `aliexpress.ds.product.get`  
**Type:** `GET/POST`  
**Description:** Query product information for dropshipping

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | Number/String | Yes | AliExpress product ID |
| `local_country` | String | Yes | Destination country code (e.g., "US") |
| `local_language` | String | Yes | Language code (e.g., "en") |
| `ship_to_country` | String | No | Shipping destination country |
| `target_currency` | String | No | Currency for pricing (e.g., "USD") |
| `target_language` | String | No | Target language for product info |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `product_id` | Number | Product ID |
| `product_title` | String | Product title |
| `product_url` | String | Product URL |
| `product_status` | String | Product status |
| `category_id` | Number | Category ID |
| `currency` | String | Price currency |
| `sale_price` | String | Current sale price |
| `original_price` | String | Original price |
| `discount` | String | Discount percentage |
| `product_images` | Array | List of product image URLs |
| `product_main_image` | String | Main product image URL |
| `product_video` | String | Product video URL |
| `sku_list` | Array | SKU variations list |
| `sku_list[].sku_id` | String | SKU ID |
| `sku_list[].sku_attr` | String | SKU attributes |
| `sku_list[].price` | String | SKU price |
| `sku_list[].stock` | Number | SKU stock quantity |
| `sku_list[].sku_image` | String | SKU image URL |
| `shipping_list` | Array | Available shipping options |
| `shipping_list[].service_name` | String | Shipping service name |
| `shipping_list[].fee` | String | Shipping fee |
| `shipping_list[].delivery_time` | String | Estimated delivery time |
| `seller_info` | Object | Seller information |
| `seller_info.store_id` | Number | Store ID |
| `seller_info.store_name` | String | Store name |
| `seller_info.store_url` | String | Store URL |
| `seller_info.seller_level` | String | Seller level/rating |
| `evaluate_rate` | String | Seller rating |
| `total_sales` | Number | Total sales count |

#### Example Request

```
POST /sync
app_key=YOUR_APP_KEY
&timestamp=2024-01-15 10:30:00
&sign_method=hmac-sha256
&sign=GENERATED_SIGN
&method=aliexpress.ds.product.get
&v=2.0
&session=ACCESS_TOKEN
&product_id=1005001699302548
&local_country=US
&local_language=en
```

#### Example Response

```json
{
  "aliexpress_ds_product_get_response": {
    "product_id": 1005001699302548,
    "product_title": "Wireless Bluetooth Headphones Over Ear",
    "product_url": "https://www.aliexpress.com/item/1005001699302548.html",
    "category_id": 200010248,
    "currency": "USD",
    "sale_price": "25.99",
    "original_price": "45.99",
    "discount": "43%",
    "product_images": [
      "https://ae01.alicdn.com/kf/Hd1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.jpg",
      "https://ae01.alicdn.com/kf/Hd2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7.jpg"
    ],
    "product_main_image": "https://ae01.alicdn.com/kf/Hd1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.jpg",
    "sku_list": [
      {
        "sku_id": "12000036524332084",
        "sku_attr": "14:200002984#Black;5:100014064",
        "price": "25.99",
        "stock": 1500,
        "sku_image": "https://ae01.alicdn.com/kf/sku1.jpg"
      },
      {
        "sku_id": "12000036524332085",
        "sku_attr": "14:200003699#White;5:100014064",
        "price": "27.99",
        "stock": 890,
        "sku_image": "https://ae01.alicdn.com/kf/sku2.jpg"
      }
    ],
    "shipping_list": [
      {
        "service_name": "AliExpress Standard Shipping",
        "fee": "2.53",
        "delivery_time": "20-40 days"
      },
      {
        "service_name": "ePacket",
        "fee": "4.20",
        "delivery_time": "15-30 days"
      }
    ],
    "seller_info": {
      "store_id": 1234567,
      "store_name": "Tech Gadget Store",
      "store_url": "https://www.aliexpress.com/store/1234567",
      "seller_level": "Top Rated"
    },
    "evaluate_rate": "4.8",
    "total_sales": 15420,
    "request_id": "4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r"
  }
}
```

---

### 6.2 aliexpress.ds.product.wholesale.get

**Method:** `aliexpress.ds.product.wholesale.get`  
**Type:** `GET/POST`  
**Description:** Get product information for wholesale business

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | Number/String | Yes | Product ID |
| `local_country` | String | Yes | Country code |
| `local_language` | String | Yes | Language code |
| `quantity` | Number | No | Wholesale quantity |

#### Response Fields

Same as `aliexpress.ds.product.get` with additional wholesale pricing fields:

| Name | Type | Description |
|------|------|-------------|
| `wholesale_price` | String | Wholesale unit price |
| `wholesale_min_qty` | Number | Minimum wholesale quantity |
| `wholesale_discount` | String | Wholesale discount percentage |

---

### 6.3 aliexpress.ds.product.specialinfo.get

**Method:** `aliexpress.ds.product.specialinfo.get`  
**Type:** `GET/POST`  
**Description:** Get product special information like certifications

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | Number/String | Yes | Product ID |
| `local_country` | String | Yes | Country code |
| `local_language` | String | Yes | Language code |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `certification_list` | Array | Product certifications |
| `certification_list[].name` | String | Certification name (CE, FCC, etc.) |
| `certification_list[].image_url` | String | Certification image URL |
| `warning_labels` | Array | Safety warning labels |
| `product_compliance` | Object | Compliance information |
| `product_compliance.age_group` | String | Suitable age group |
| `product_compliance.gender` | String | Target gender |

---

### 6.4 aliexpress.offer.ds.product.simplequery

**Method:** `aliexpress.offer.ds.product.simplequery`  
**Type:** `GET/POST`  
**Description:** Simple product query for dropshippers (lightweight)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | Number/String | Yes | Product ID |
| `local_country` | String | Yes | Country code |
| `local_language` | String | Yes | Language code |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `product_id` | Number | Product ID |
| `product_title` | String | Product title |
| `sale_price` | String | Current price |
| `main_image` | String | Main image URL |
| `product_url` | String | Product page URL |
| `shipping_fee` | String | Shipping fee |
| `total_sales` | Number | Sales count |
| `rating` | String | Product rating |

---

### 6.5 aliexpress.postproduct.redefining.findaeproductbyidfordropshipper

**Method:** `aliexpress.postproduct.redefining.findaeproductbyidfordropshipper`  
**Type:** `GET/POST`  
**Description:** Find product by ID for dropshippers (legacy but still active)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | Number/String | Yes | Product ID |
| `local_country` | String | Yes | Country code |
| `local_language` | String | Yes | Language code |

---

## 7. Order API

### 7.1 aliexpress.ds.order.create

**Method:** `aliexpress.ds.order.create`  
**Type:** `GET/POST`  
**Description:** Create and pay for a dropshipping order

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `param_place_order_request4_open_api_d_t_o` | Object | Yes | Order parameters (JSON string) |
| `ds_extend_request` | Object | No | DS extended parameters (JSON string) |

#### Order Parameters Object (param_place_order_request4_open_api_d_t_o)

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_items` | Array | Yes | List of products to order |
| `product_items[].product_id` | String | Yes | Product ID |
| `product_items[].sku_attr` | String | Yes | SKU attribute string |
| `product_items[].product_count` | Number | Yes | Quantity |
| `product_items[].logistics_service_name` | String | Yes | Shipping method name |
| `product_items[].order_memo` | String | No | Order note/memo |
| `logistics_address` | Object | Yes | Delivery address |
| `logistics_address.country` | String | Yes | Country code |
| `logistics_address.province` | String | Yes | Province/State |
| `logistics_address.city` | String | Yes | City name |
| `logistics_address.address` | String | Yes | Street address |
| `logistics_address.address2` | String | No | Additional address line |
| `logistics_address.zip` | String | Yes | ZIP/Postal code |
| `logistics_address.contact_person` | String | Yes | Contact person name |
| `logistics_address.full_name` | String | Yes | Full name |
| `logistics_address.mobile_no` | String | Yes | Mobile number |
| `logistics_address.phone_country` | String | Yes | Phone country code (+1, +7, etc.) |
| `logistics_address.locale` | String | Yes | Locale (e.g., "en_US") |
| `logistics_address.cpf` | String | Yes* | CPF (required for Brazil) |
| `logistics_address.rut_no` | String | No* | RUT number (for Chile) |
| `logistics_address.tax_number` | String | No | Tax/VAT number |
| `logistics_address.is_foreigner` | String | No | "true" if foreigner |
| `logistics_address.foreigner_passport_no` | String | No | Passport number |
| `logistics_address.passport_no` | String | No | Passport number (legacy) |
| `logistics_address.passport_no_date` | String | No | Passport issue date (MM-DD-YYYY) |
| `logistics_address.passport_organization` | String | No | Passport issuing authority |
| `logistics_address.tax_company` | String | No | Tax company name |
| `logistics_address.vat_no` | String | No | VAT number |
| `out_order_id` | String | Yes | Your external order ID |

#### DS Extend Request Object (ds_extend_request)

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `payment` | Object | No | Payment parameters |
| `payment.pay_currency` | String | No | Payment currency ("USD") |
| `payment.try_to_pay` | String | No | "true" or "false" |
| `trade_extra_param` | Object | No | Extra trade parameters |
| `trade_extra_param.customize_sku_map` | Object | No | SKU customization mapping |
| `trade_extra_param.nat_addr` | String | No | National address code |
| `trade_extra_param.business_model` | String | No | Business model ("wholesale","retail") |
| `channel_strategy` | String | No | Channel strategy |
| `promotion` | Object | No | Promotion parameters |
| `promotion.promotion_activity_id` | String | No | Promotion activity ID |
| `promotion.promotion_channel_info` | String | No | Promotion channel info |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `result` | Object | Result object |
| `result.is_success` | Boolean | Whether order was successful |
| `result.order_list` | Array | List of created order IDs |
| `result.error_code` | String | Error code (if failed) |
| `result.error_msg` | String | Error message (if failed) |

#### Error Codes

| Error Code | Message | Solution |
|------------|---------|----------|
| `B_DROPSHIPPER_DELIVERY_ADDRESS_VALIDATE_FAIL` | Address validation failed | Check delivery address |
| `B_DROPSHIPPER_DELIVERY_ADDRESS_CPF_CN_INVALID` | CPF error | Check CPF number |
| `B_DROPSHIPPER_DELIVERY_ADDRESS_CPF_NOT_MATCH` | CPF mismatch | Check CPF |
| `BLACKLIST_BUYER_IN_LIST` | Buyer in blacklist | Use different buyer account |
| `USER_ACCOUNT_DISABLED` | Account disabled | Use different user |
| `PRICE_PAY_CURRENCY_ERROR` | Currency mismatch | Products must use same currency |
| `DELIVERY_METHOD_NOT_EXIST` | Invalid delivery method | Use aliexpress.ds.freight.query to check |
| `INVENTORY_HOLD_ERROR` | Insufficient inventory | Check stock or retry |
| `REPEATED_ORDER_ERROR` | Duplicate order | Change order and retry |
| `ERROR_WHEN_BUILD_FOR_PLACE_ORDER` | System error | Contact technical support |
| `A001_ORDER_CANNOT_BE_PLACED` | Order cannot be placed | Contact technical support |

#### Example Request

```
POST /sync
app_key=YOUR_APP_KEY
&timestamp=2024-01-15 10:30:00
&sign_method=hmac-sha256
&sign=GENERATED_SIGN
&method=aliexpress.ds.order.create
&v=2.0
&session=ACCESS_TOKEN
&param_place_order_request4_open_api_d_t_o={
  "product_items": [
    {
      "logistics_service_name": "EPAM",
      "sku_attr": "14:70221",
      "product_count": 2,
      "product_id": "1223211",
      "order_memo": "Please put it in a gift box."
    }
  ],
  "logistics_address": {
    "zip": "12222",
    "rut_no": "123-K",
    "country": "RU",
    "address": "sh Kashirskoe dom 142",
    "passport_no_date": "02-23-2018",
    "address2": "sh Kashirskoe dom 142",
    "city": "Mosco",
    "contact_person": "RU TEST TEST",
    "mobile_no": "12334445",
    "passport_no": "12345",
    "locale": "en_US",
    "foreigner_passport_no": "123456789",
    "location_tree_address_id": "903200190000000000-903200190137000000",
    "full_name": "RU TEST TEST",
    "province": "Mosco",
    "is_foreigner": "true",
    "tax_number": "xxx",
    "tax_company": "Soceite General",
    "cpf": "111",
    "passport_organization": "xxxx",
    "phone_country": "+7",
    "vat_no": "123456778"
  },
  "out_order_id": "123456789"
}
&ds_extend_request={
  "trade_extra_param": {
    "customize_sku_map": {"skuId": "customize_id"},
    "nat_addr": "ABCD0000",
    "business_model": ""wholesale","retail""
  },
  "payment": {
    "try_to_pay": "false",
    "pay_currency": "USD"
  },
  "channel_strategy": "channel_strategy",
  "promotion": {
    "promotion_activity_id": "304444",
    "promotion_channel_info": "promotionChannelInfo"
  }
}
```

#### Example Response

```json
{
  "result": {
    "error_msg": "PARM_ILLEGL",
    "error_code": "PARM_ILLEGL",
    "is_success": "true",
    "order_list": [1000000000]
  },
  "code": "0",
  "request_id": "0ba2887315178178017221014"
}
```

---

### 7.2 aliexpress.trade.ds.order.get

**Method:** `aliexpress.trade.ds.order.get`  
**Type:** `GET/POST`  
**Description:** Query order details as buyer

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `order_id` | Number/String | Yes | AliExpress order ID |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `order_id` | Number | Order ID |
| `order_status` | String | Order status |
| `order_amount` | String | Total order amount |
| `currency` | String | Currency |
| `shipping_fee` | String | Shipping fee |
| `product_items` | Array | Ordered items |
| `product_items[].product_id` | String | Product ID |
| `product_items[].product_title` | String | Product title |
| `product_items[].price` | String | Item price |
| `product_items[].quantity` | Number | Quantity |
| `product_items[].sku_attr` | String | SKU attributes |
| `shipping_info` | Object | Shipping information |
| `shipping_info.service_name` | String | Shipping method |
| `shipping_info.tracking_number` | String | Tracking number |
| `shipping_info.status` | String | Shipping status |
| `logistics_address` | Object | Delivery address |
| `create_time` | String | Order creation time |
| `pay_time` | String | Payment time |
| `seller_info` | Object | Seller information |

#### Order Status Values

| Status | Description |
|--------|-------------|
| `PLACE_ORDER_SUCCESS` | Order placed successfully |
| `IN_CANCEL` | Order being cancelled |
| `WAIT_SELLER_SEND_GOODS` | Waiting for seller to ship |
| `SELLER_PART_SEND_GOODS` | Partially shipped |
| `WAIT_BUYER_ACCEPT_GOODS` | Shipped, waiting for buyer |
| `FUND_PROCESSING` | Processing refund |
| `IN_ISSUE` | In dispute |
| `IN_FROZEN` | Order frozen |
| `WAIT_SELLER_EXAMINE_MONEY` | Waiting for seller to confirm payment |
| `RISK_CONTROL` | Risk control review |
| `FINISH` | Order completed |

---

### 7.3 aliexpress.ds.order.tracking.get

**Method:** `aliexpress.ds.order.tracking.get`  
**Type:** `GET/POST`  
**Description:** Get order tracking information

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `order_id` | Number/String | Yes | Order ID |
| `tracking_id` | String | No | Tracking number |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `tracking_number` | String | Tracking number |
| `logistics_company` | String | Logistics company name |
| `tracking_status` | String | Current tracking status |
| `tracking_details` | Array | Tracking history |
| `tracking_details[].time` | String | Event time |
| `tracking_details[].location` | String | Event location |
| `tracking_details[].status` | String | Event description |

---

## 8. Freight API

### 8.1 aliexpress.ds.freight.query

**Method:** `aliexpress.ds.freight.query`  
**Type:** `GET/POST`  
**Description:** Query delivery/freight options for dropshipping

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | Number/String | Yes | Product ID |
| `quantity` | Number | Yes | Quantity |
| `country_code` | String | Yes | Destination country code |
| `province_code` | String | No | Province/state code |
| `city_code` | String | No | City code |
| `sku_id` | String | No | SKU ID for variant-specific freight |
| `send_goods_country_code` | String | No | Shipping origin country (default: CN) |
| `price` | String | No | Product unit price |
| `product_num` | Number | No | Product number |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `freight_list` | Array | Available freight options |
| `freight_list[].service_name` | String | Shipping method name |
| `freight_list[].company` | String | Logistics company |
| `freight_list[].freight_cost` | String | Shipping cost |
| `freight_list[].currency` | String | Currency |
| `freight_list[].estimated_delivery_time` | String | Estimated delivery days |
| `freight_list[].tracking` | Boolean | Whether tracking is available |

---

### 8.2 aliexpress.logistics.buyer.freight.calculate

**Method:** `aliexpress.logistics.buyer.freight.calculate`  
**Type:** `GET/POST`  
**Description:** Calculate freight for buyers

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `product_id` | Number/String | Yes | Product ID |
| `quantity` | Number | Yes | Quantity |
| `ship_to_country` | String | Yes | Destination country |
| `province` | String | No | Province/State |
| `city` | String | No | City |
| `sku_id` | String | No | SKU ID |
| `price` | String | No | Product price |
| `send_goods_country_code` | String | No | Origin country |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `result` | Object | Result object |
| `result.freight_list` | Array | Freight options |
| `result.freight_list[].service_name` | String | Service name |
| `result.freight_list[].fee` | String | Shipping fee |
| `result.freight_list[].delivery_time` | String | Delivery time estimate |

---

## 9. Search API

### 9.1 aliexpress.ds.text.search

**Method:** `aliexpress.ds.text.search`  
**Type:** `GET/POST`  
**Description:** Text search for dropshipping products

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `key_word` | String | Yes | Search keyword |
| `local_country` | String | Yes | Country code |
| `local_language` | String | Yes | Language code |
| `page_size` | Number | No | Results per page (default: 20) |
| `page_no` | Number | No | Page number (default: 1) |
| `category_id` | Number | No | Filter by category |
| `sort_by` | String | No | Sort: "price_asc", "price_desc", "orders", "newest" |
| `ship_to` | String | No | Ship to country |
| `min_price` | String | No | Minimum price |
| `max_price` | String | No | Maximum price |
| `filter` | String | No | Filter: "free_shipping", "4_star_up", etc. |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `total_count` | Number | Total results count |
| `product_list` | Array | Product list |
| `product_list[].product_id` | String | Product ID |
| `product_list[].product_title` | String | Product title |
| `product_list[].sale_price` | String | Sale price |
| `product_list[].currency` | String | Currency |
| `product_list[].product_main_image` | String | Main image URL |
| `product_list[].orders` | Number | Order count |
| `product_list[].rating` | String | Product rating |
| `product_list[].shipping_fee` | String | Shipping fee |
| `product_list[].store_name` | String | Store name |
| `product_list[].store_url` | String | Store URL |

---

### 9.2 aliexpress.ds.image.search

**Method:** `aliexpress.ds.image.search`  
**Type:** `GET/POST`  
**Description:** Image search for dropshipping (find similar products by image)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `image_url` | String | Yes | URL of image to search |
| `local_country` | String | Yes | Country code |
| `local_language` | String | Yes | Language code |
| `page_size` | Number | No | Results per page |
| `page_no` | Number | No | Page number |
| `sort_by` | String | No | Sort order |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `total_count` | Number | Total results |
| `product_list` | Array | Similar products |
| `product_list[].product_id` | String | Product ID |
| `product_list[].product_title` | String | Product title |
| `product_list[].sale_price` | String | Price |
| `product_list[].product_main_image` | String | Main image URL |
| `product_list[].similarity` | String | Similarity score |

---

### 9.3 aliexpress.ds.image.searchV2

**Method:** `aliexpress.ds.image.searchV2`  
**Type:** `GET/POST`  
**Description:** Image search v2 (improved version)

Same parameters as `aliexpress.ds.image.search` with potentially better accuracy.

---

### 9.4 aliexpress.ds.search.event.report

**Method:** `aliexpress.ds.search.event.report`  
**Type:** `GET/POST`  
**Description:** Report search events (for analytics)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `event_type` | String | Yes | Event type: "search", "click", "view" |
| `search_key` | String | Yes | Search keyword or image URL |
| `product_id` | String | No | Product ID (for click/view events) |
| `session_id` | String | Yes | Session identifier |

---

### 9.5 aliexpress.ds.feed.itemids.get

**Method:** `aliexpress.ds.feed.itemids.get`  
**Type:** `GET/POST`  
**Description:** Fetch product item IDs by feed name

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `feed_name` | String | Yes | Feed name identifier |
| `page_size` | Number | No | Page size |
| `page_no` | Number | No | Page number |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `item_list` | Array | List of product IDs |
| `item_list[].product_id` | String | Product ID |
| `item_list[].added_time` | String | Time added to feed |
| `total_count` | Number | Total items |

---

### 9.6 aliexpress.ds.recommend.feed.get

**Method:** `aliexpress.ds.recommend.feed.get`  
**Type:** `GET/POST`  
**Description:** Get recommended product feed

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `feed_name` | String | Yes | Feed name |
| `country_code` | String | Yes | Country code |
| `page_size` | Number | No | Page size |
| `page_no` | Number | No | Page number |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `product_list` | Array | Recommended products |
| `total_count` | Number | Total products |

---

### 9.7 aliexpress.ds.category.get

**Method:** `aliexpress.ds.category.get`  
**Type:** `GET/POST`  
**Description:** Get AliExpress category information

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `category_id` | Number | No | Specific category ID (omit for root) |
| `language` | String | No | Language for category names |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `category_list` | Array | Category list |
| `category_list[].category_id` | Number | Category ID |
| `category_list[].category_name` | String | Category name |
| `category_list[].parent_id` | Number | Parent category ID |
| `category_list[].level` | Number | Category level (1-3) |
| `category_list[].is_leaf` | Boolean | Whether leaf category |

---

## 10. Member & Data API

### 10.1 aliexpress.ds.member.benefit.get

**Method:** `aliexpress.ds.member.benefit.get`  
**Type:** `GET/POST`  
**Description:** Get dropshipping member benefits

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `member_id` | String | Yes | Member ID |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `benefit_list` | Array | Available benefits |
| `benefit_list[].type` | String | Benefit type |
| `benefit_list[].value` | String | Benefit value |
| `benefit_list[].expire_time` | String | Expiry time |
| `member_level` | String | Membership level |
| `commission_rate` | String | Commission rate |

---

### 10.2 aliexpress.ds.commissionorder.listbyindex

**Method:** `aliexpress.ds.commissionorder.listbyindex`  
**Type:** `GET/POST`  
**Description:** Query commission orders by index (affiliate orders)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `start_time` | String | Yes | Start time (YYYY-MM-DD) |
| `end_time` | String | Yes | End time (YYYY-MM-DD) |
| `page_size` | Number | No | Page size (max 50) |
| `page_no` | Number | No | Page number |
| `status` | String | No | Order status filter |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `order_list` | Array | Commission orders |
| `order_list[].order_id` | String | Order ID |
| `order_list[].product_id` | String | Product ID |
| `order_list[].commission` | String | Commission amount |
| `order_list[].status` | String | Order status |
| `order_list[].create_time` | String | Order time |
| `total_count` | Number | Total count |

---

### 10.3 aliexpress.ds.trade.order.get

**Method:** `aliexpress.ds.trade.order.get`  
**Type:** `GET/POST`  
**Description:** Query trade order details

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `order_id` | Number/String | Yes | Order ID |

#### Response Fields

Same as `aliexpress.trade.ds.order.get`

---

### 10.4 aliexpress.ds.member.orderdata.submit

**Method:** `aliexpress.ds.member.orderdata.submit`  
**Type:** `GET/POST`  
**Description:** Submit dropshipper order data (data backflow)

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `order_data` | Object | Yes | Order data JSON |
| `order_data.order_id` | String | Yes | Order ID |
| `order_data.product_id` | String | Yes | Product ID |
| `order_data.store_url` | String | Yes | Store URL |
| `order_data.sale_price` | String | Yes | Sale price |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `result` | Boolean | Success status |
| `rsp_msg` | String | Response message |
| `rsp_code` | String | Response code |

---

### 10.5 aliexpress.ds.add.info

**Method:** `aliexpress.ds.add.info`  
**Type:** `GET/POST`  
**Description:** Report DS information

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `param0` | Object | No | DropShipperReq object |
| `param0.storeUrl` | String | Yes | Store URL |
| `param0.platform` | String | No | Platform name |
| `param0.storeId` | String | No | Store ID |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `result` | Boolean | Result status |
| `rsp_msg` | String | Error/success message |
| `rsp_code` | String | Response code |

---

### 10.6 aliexpress.logistics.ds.trackinginfo.query

**Method:** `aliexpress.logistics.ds.trackinginfo.query`  
**Type:** `GET/POST`  
**Description:** Query logistics tracking information

#### Request Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `order_id` | Number/String | Yes | Order ID |
| `tracking_number` | String | No | Tracking number |

#### Response Fields

| Name | Type | Description |
|------|------|-------------|
| `tracking_info` | Object | Tracking details |
| `tracking_info.tracking_number` | String | Tracking number |
| `tracking_info.logistics_company` | String | Company name |
| `tracking_info.status` | String | Current status |
| `tracking_info.tracking_details` | Array | Tracking events |
| `tracking_info.tracking_details[].time` | String | Event time |
| `tracking_info.tracking_details[].description` | String | Event description |

---

## 11. Webhook

### 11.1 Webhook Events

AliExpress can push event notifications to your webhook URL. Configure webhook URL in the App Console.

#### Supported Event Types

| Event Type | Description |
|------------|-------------|
| `trade.order.paid` | Order paid |
| `trade.order.shipped` | Order shipped |
| `trade.order.completed` | Order completed |
| `trade.order.cancelled` | Order cancelled |
| `trade.refund.created` | Refund created |
| `trade.refund.completed` | Refund completed |
| `product.price.changed` | Product price changed |
| `product.stock.changed` | Product stock changed |
| `product.status.changed` | Product status changed |

#### Webhook Payload Format

```json
{
  "event_type": "trade.order.shipped",
  "event_time": "2024-01-15T10:30:00Z",
  "event_id": "evt_123456789",
  "data": {
    "order_id": "1234567890",
    "tracking_number": "LP123456789",
    "logistics_company": "AliExpress Standard Shipping",
    "shipping_time": "2024-01-15T08:00:00Z"
  },
  "sign": "WEBHOOK_SIGNATURE"
}
```

#### Webhook Verification

Verify webhook signature using HMAC-SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, appSecret) {
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(JSON.stringify(payload));
  const expectedSign = hmac.digest('hex').toUpperCase();
  return expectedSign === signature;
}
```

---

## 12. Error Codes

### 12.1 Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `0` | Success | Request successful |
| `40` | Missing required arguments | A required parameter is missing |
| `41` | Invalid arguments | Invalid parameter format or value |
| `42` | Forbidden request | No permission for this API |
| `43` | API call exceeded | Rate limit exceeded |
| `47` | Request API not found | API method does not exist |
| `48` | Invalid timestamp | Timestamp expired or invalid |
| `49` | Invalid signature | Signature verification failed |
| `50` | Remote service error | AliExpress internal error |
| `isv.invalid-parameter` | Invalid parameter | Parameter validation failed |
| `isv.invalid-signature` | Invalid signature | Signature error |
| `isv.invalid-timestamp` | Invalid timestamp | Timestamp too old |
| `isv.app-call-limited` | App call limited | Rate limit reached |
| `isv.access-denied` | Access denied | No API permission |
| `isv.refresh-token-expired` | Refresh token expired | Need re-authorization |
| `isv.access-token-expired` | Access token expired | Need token refresh |
| `isv.invalid-method` | Invalid method | API method not found |

### 12.2 Dropshipping-Specific Error Codes

| Code | Message |
|------|---------|
| `B_DROPSHIPPER_DELIVERY_ADDRESS_VALIDATE_FAIL` | Address validation failed |
| `B_DROPSHIPPER_DELIVERY_ADDRESS_CPF_CN_INVALID` | CPF/CNPJ invalid |
| `B_DROPSHIPPER_DELIVERY_ADDRESS_CPF_NOT_MATCH` | CPF does not match |
| `BLACKLIST_BUYER_IN_LIST` | Buyer in blacklist |
| `USER_ACCOUNT_DISABLED` | User account disabled |
| `PRICE_PAY_CURRENCY_ERROR` | Currency error |
| `DELIVERY_METHOD_NOT_EXIST` | Delivery method not found |
| `INVENTORY_HOLD_ERROR` | Inventory hold error |
| `REPEATED_ORDER_ERROR` | Repeated order error |
| `ERROR_WHEN_BUILD_FOR_PLACE_ORDER` | Build order error |
| `A001_ORDER_CANNOT_BE_PLACED` | Order cannot be placed |
| `PARM_ILLEGL` | Illegal parameter |
| `ORDER_PAYMENT_FAILED` | Payment failed |
| `PRODUCT_NOT_FOUND` | Product not found |
| `PRODUCT_OFFLINE` | Product offline |
| `SKU_NOT_MATCH` | SKU does not match |
| `ADDRESS_NOT_MATCH` | Address does not match shipping requirements |

---

## 13. Rate Limits

### 13.1 API QPS Limits

| API Category | QPS Limit | Notes |
|-------------|-----------|-------|
| Auth Token | 10 QPS | Per app key |
| Product Get | 50 QPS | Per app key |
| Order Create | 10 QPS | Per app key |
| Order Query | 50 QPS | Per app key |
| Freight Query | 50 QPS | Per app key |
| Text Search | 20 QPS | Per app key |
| Image Search | 10 QPS | Per app key |
| Category Get | 50 QPS | Per app key |
| Feed Get | 50 QPS | Per app key |
| Member API | 20 QPS | Per app key |
| Webhook Push | - | Configurable in console |

### 13.2 Daily Call Limits

| Plan | Daily Limit |
|------|-------------|
| Free Tier | 5,000 calls/day |
| Basic Tier | 50,000 calls/day |
| Professional Tier | 200,000 calls/day |
| Enterprise Tier | Custom limit |

### 13.3 Rate Limit Headers

Response headers for rate limit tracking:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per second |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Time when limit resets (Unix timestamp) |

---

## 14. Appendix

### 14.1 Country Codes

Common country codes:

| Country | Code |
|---------|------|
| United States | US |
| United Kingdom | UK |
| Canada | CA |
| Australia | AU |
| Germany | DE |
| France | FR |
| Spain | ES |
| Italy | IT |
| Brazil | BR |
| Mexico | MX |
| Russian Federation | RU |
| Netherlands | NL |
| Poland | PL |
| Sweden | SE |
| Japan | JP |
| South Korea | KR |
| China | CN |
| India | IN |
| Turkey | TR |
| Israel | IL |

### 14.2 Language Codes

| Language | Code |
|----------|------|
| English | en |
| Spanish | es |
| French | fr |
| German | de |
| Italian | it |
| Portuguese | pt |
| Russian | ru |
| Japanese | ja |
| Korean | ko |
| Arabic | ar |
| Dutch | nl |
| Turkish | tr |
| Polish | pl |
| Hebrew | he |
| Thai | th |
| Vietnamese | vi |
| Indonesian | id |
| Chinese (Simplified) | zh |

### 14.3 Currency Codes

| Currency | Code |
|----------|------|
| US Dollar | USD |
| Euro | EUR |
| British Pound | GBP |
| Australian Dollar | AUD |
| Canadian Dollar | CAD |
| Brazilian Real | BRL |
| Mexican Peso | MXN |
| Russian Ruble | RUB |
| Japanese Yen | JPY |
| Chinese Yuan | CNY |
| Indian Rupee | INR |
| Turkish Lira | TRY |

### 14.4 Shipping Methods

| Method | Code | Description |
|--------|------|-------------|
| AliExpress Standard Shipping | AE_STD | Standard shipping |
| Cainiao Standard | CAINIAO_STD | Cainiao standard |
| Cainiao Super Economy | CAINIAO_ECO | Economy shipping |
| Cainiao Expedited | CAINIAO_EXP | Expedited shipping |
| ePacket | EPK | ePacket service |
| DHL | DHL | DHL Express |
| EMS | EMS | EMS shipping |
| UPS | UPS | UPS delivery |
| FedEx | FEDEX | FedEx delivery |
| Seller's Shipping Method | SELLER | Seller's own method |
| China Post | CHINA_POST | China Post |

### 14.5 Complete SDK Example (Node.js)

```javascript
const crypto = require('crypto');
const axios = require('axios');

class AliExpressDSClient {
  constructor({ appKey, appSecret, accessToken, baseUrl = 'https://api-sg.aliexpress.com/sync' }) {
    this.appKey = appKey;
    this.appSecret = appSecret;
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
  }

  generateSign(params, apiName) {
    const sortedKeys = Object.keys(params).filter(k => k !== 'sign' && params[k] !== undefined).sort();
    let signString = apiName;
    for (const key of sortedKeys) {
      signString += key + params[key];
    }
    return crypto.createHmac('sha256', this.appSecret).update(signString).digest('hex').toUpperCase();
  }

  async call(apiName, params = {}) {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, '');
    const allParams = {
      app_key: this.appKey,
      timestamp,
      sign_method: 'hmac-sha256',
      method: apiName,
      v: '2.0',
      format: 'json',
      session: this.accessToken,
      ...params
    };
    allParams.sign = this.generateSign(allParams, apiName);

    const response = await axios.post(this.baseUrl, new URLSearchParams(allParams), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
    });
    return response.data;
  }

  // Product API
  async getProduct(productId, country = 'US', language = 'en') {
    return this.call('aliexpress.ds.product.get', {
      product_id: productId,
      local_country: country,
      local_language: language
    });
  }

  // Order API
  async createOrder(orderData, extendData = {}) {
    return this.call('aliexpress.ds.order.create', {
      param_place_order_request4_open_api_d_t_o: JSON.stringify(orderData),
      ds_extend_request: JSON.stringify(extendData)
    });
  }

  // Freight API
  async queryFreight(productId, quantity, countryCode) {
    return this.call('aliexpress.ds.freight.query', {
      product_id: productId,
      quantity: quantity,
      country_code: countryCode
    });
  }

  // Search API
  async textSearch(keyword, country = 'US', language = 'en', pageSize = 20, pageNo = 1) {
    return this.call('aliexpress.ds.text.search', {
      key_word: keyword,
      local_country: country,
      local_language: language,
      page_size: pageSize,
      page_no: pageNo
    });
  }

  // Order Tracking
  async getTracking(orderId) {
    return this.call('aliexpress.ds.order.tracking.get', {
      order_id: orderId
    });
  }
}

// Usage
const client = new AliExpressDSClient({
  appKey: 'YOUR_APP_KEY',
  appSecret: 'YOUR_APP_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN'
});

// Get product
client.getProduct('1005001699302548').then(console.log).catch(console.error);
```

### 14.6 Complete SDK Example (Python)

```python
import hmac
import hashlib
import time
import requests
from urllib.parse import urlencode

class AliExpressDSClient:
    def __init__(self, app_key, app_secret, access_token, base_url='https://api-sg.aliexpress.com/sync'):
        self.app_key = app_key
        self.app_secret = app_secret
        self.access_token = access_token
        self.base_url = base_url

    def generate_sign(self, params, api_name):
        sorted_params = sorted(
            [(k, v) for k, v in params.items() if k != 'sign' and v is not None],
            key=lambda x: x[0]
        )
        sign_string = api_name
        for key, value in sorted_params:
            sign_string += f"{key}{value}"
        return hmac.new(
            self.app_secret.encode('utf-8'),
            sign_string.encode('utf-8'),
            hashlib.sha256
        ).hexdigest().upper()

    def call(self, api_name, params=None):
        if params is None:
            params = {}
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        all_params = {
            'app_key': self.app_key,
            'timestamp': timestamp,
            'sign_method': 'hmac-sha256',
            'method': api_name,
            'v': '2.0',
            'format': 'json',
            'session': self.access_token,
            **params
        }
        all_params['sign'] = self.generate_sign(all_params, api_name)

        response = requests.post(self.base_url, data=all_params)
        return response.json()

    def get_product(self, product_id, country='US', language='en'):
        return self.call('aliexpress.ds.product.get', {
            'product_id': product_id,
            'local_country': country,
            'local_language': language
        })

    def create_order(self, order_data, extend_data=None):
        params = {
            'param_place_order_request4_open_api_d_t_o': json.dumps(order_data)
        }
        if extend_data:
            params['ds_extend_request'] = json.dumps(extend_data)
        return self.call('aliexpress.ds.order.create', params)

    def query_freight(self, product_id, quantity, country_code):
        return self.call('aliexpress.ds.freight.query', {
            'product_id': product_id,
            'quantity': quantity,
            'country_code': country_code
        })

    def text_search(self, keyword, country='US', language='en', page_size=20, page_no=1):
        return self.call('aliexpress.ds.text.search', {
            'key_word': keyword,
            'local_country': country,
            'local_language': language,
            'page_size': page_size,
            'page_no': page_no
        })

    def get_tracking(self, order_id):
        return self.call('aliexpress.ds.order.tracking.get', {
            'order_id': order_id
        })

# Usage
import json
client = AliExpressDSClient('YOUR_APP_KEY', 'YOUR_APP_SECRET', 'YOUR_ACCESS_TOKEN')

# Get product
result = client.get_product('1005001699302548')
print(json.dumps(result, indent=2))
```

### 14.7 cURL Examples

```bash
# 1. Get Product Info
curl -X POST https://api-sg.aliexpress.com/sync   -H "Content-Type: application/x-www-form-urlencoded"   -d "app_key=YOUR_APP_KEY"   -d "timestamp=2024-01-15 10:30:00"   -d "sign_method=hmac-sha256"   -d "sign=GENERATED_SIGN"   -d "method=aliexpress.ds.product.get"   -d "v=2.0"   -d "session=ACCESS_TOKEN"   -d "product_id=1005001699302548"   -d "local_country=US"   -d "local_language=en"

# 2. Create Order
curl -X POST https://api-sg.aliexpress.com/sync   -H "Content-Type: application/x-www-form-urlencoded"   -d "app_key=YOUR_APP_KEY"   -d "timestamp=2024-01-15 10:30:00"   -d "sign_method=hmac-sha256"   -d "sign=GENERATED_SIGN"   -d "method=aliexpress.ds.order.create"   -d "v=2.0"   -d "session=ACCESS_TOKEN"   -d "param_place_order_request4_open_api_d_t_o={"product_items":[{"logistics_service_name":"EPAM","sku_attr":"14:70221","product_count":2,"product_id":"1223211"}],"logistics_address":{"country":"US","province":"CA","city":"Los Angeles","address":"123 Main St","zip":"90001","contact_person":"John Doe","full_name":"John Doe","mobile_no":"1234567890","phone_country":"+1","locale":"en_US"},"out_order_id":"ORDER123"}"

# 3. Query Freight
curl -X POST https://api-sg.aliexpress.com/sync   -H "Content-Type: application/x-www-form-urlencoded"   -d "app_key=YOUR_APP_KEY"   -d "timestamp=2024-01-15 10:30:00"   -d "sign_method=hmac-sha256"   -d "sign=GENERATED_SIGN"   -d "method=aliexpress.ds.freight.query"   -d "v=2.0"   -d "session=ACCESS_TOKEN"   -d "product_id=1005001699302548"   -d "quantity=2"   -d "country_code=US"

# 4. Text Search
curl -X POST https://api-sg.aliexpress.com/sync   -H "Content-Type: application/x-www-form-urlencoded"   -d "app_key=YOUR_APP_KEY"   -d "timestamp=2024-01-15 10:30:00"   -d "sign_method=hmac-sha256"   -d "sign=GENERATED_SIGN"   -d "method=aliexpress.ds.text.search"   -d "v=2.0"   -d "session=ACCESS_TOKEN"   -d "key_word=bluetooth+headphones"   -d "local_country=US"   -d "local_language=en"   -d "page_size=20"   -d "page_no=1"

# 5. Get Order Tracking
curl -X POST https://api-sg.aliexpress.com/sync   -H "Content-Type: application/x-www-form-urlencoded"   -d "app_key=YOUR_APP_KEY"   -d "timestamp=2024-01-15 10:30:00"   -d "sign_method=hmac-sha256"   -d "sign=GENERATED_SIGN"   -d "method=aliexpress.ds.order.tracking.get"   -d "v=2.0"   -d "session=ACCESS_TOKEN"   -d "order_id=1234567890"
```

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2024-04-29 | v2.1 | Added aliexpress.ds.image.searchV2 |
| 2024-03-29 | v2.0 | Major API restructuring, added new endpoints |
| 2023-10-15 | v1.5 | Added wholesale product endpoint |
| 2023-08-01 | v1.4 | Added member benefit API |
| 2023-05-20 | v1.3 | Added search event reporting |
| 2023-03-10 | v1.2 | Added category API |
| 2023-01-15 | v1.1 | Added feed item API |
| 2022-12-01 | v1.0 | Initial release |

---

*This documentation is compiled from the official AliExpress Open Platform documentation at openservice.aliexpress.com and developer.alibaba.com.*

*Last updated: 2026-04-22*
