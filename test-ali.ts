import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { searchProducts } from './src/lib/aliexpress';
dotenv.config({ path: '.env.local' });

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON!;
const sa = JSON.parse(raw.replace(/\\n/g, '\n'));

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}
const db = admin.firestore();

async function run() {
  const tokenDoc = await db.collection('settings').doc('aliexpress_token').get();
  const tokenData = tokenDoc.data();
  if (!tokenData) throw new Error('No token');
  
  const results = await searchProducts('MagSafe wireless charger', 1, 5, tokenData.access_token, 'DE', '5090301');
  console.log("Found:", results.length);
  results.forEach(r => console.log(r.product_title, r.sale_price, r.total_sales));
}
run();
