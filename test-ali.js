import { readFileSync } from 'fs';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/FIREBASE_SERVICE_ACCOUNT_JSON=(.+)/);
if (!match) throw new Error('No json');

let raw = match[1];
if (raw.startsWith("'") || raw.startsWith('"')) {
  raw = raw.slice(1, -1);
}
const sa = JSON.parse(raw.replace(/\\n/g, '\n'));

if (!getApps().length) {
  initializeApp({ credential: cert(sa) });
}
const db = getFirestore();

// Simple API caller
const APP_KEY = process.env.ALIEXPRESS_APP_KEY || '510619';
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET || '8gLeF0iK9sIIa1bzkeiXUqkasMil5q1G';

async function callAPI(method, params, session) {
  const url = 'https://api-sg.aliexpress.com/sync';
  const sysParams = {
    method,
    app_key: APP_KEY,
    sign_method: 'md5',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    format: 'json',
    v: '2.0',
    sign: ''
  };
  if (session) sysParams.session = session;
  const allParams = { ...sysParams, ...params };
  const sortedKeys = Object.keys(allParams).sort();
  let signStr = '';
  for (const k of sortedKeys) {
    if (k !== 'sign' && allParams[k] !== undefined) signStr += k + allParams[k];
  }
  const hash = crypto.createHash('md5').update(APP_SECRET + signStr + APP_SECRET, 'utf8').digest('hex').toUpperCase();
  allParams.sign = hash;
  
  const searchParams = new URLSearchParams();
  for (const k in allParams) {
    if (allParams[k] !== undefined) searchParams.append(k, allParams[k]);
  }
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: searchParams.toString()
  });
  
  const json = await res.json();
  const responseKey = method.replace(/\./g, '_') + '_response';
  const result = json[responseKey] && json[responseKey].result;
  if (!result || !result.products || !result.products.product) {
    return [];
  }
  return result.products.product;
}

async function run() {
  const tokenDoc = await db.collection('settings').doc('aliexpress_token').get();
  const tokenData = tokenDoc.data();
  if (!tokenData) throw new Error('No token');
  
  const params = {
    search_key: 'MagSafe',
    page_no: 1,
    page_size: 5,
    target_currency: 'EUR',
    target_language: 'DE',
    ship_to_country: 'DE',
    ship_from_country: 'DE',
    category_id: '5090301'
  };
  const results = await callAPI('aliexpress.ds.text.search', params, tokenData.access_token);
  console.log("Found:", results.length);
  results.forEach(r => console.log(r.product_title, r.sale_price));
}
run();
