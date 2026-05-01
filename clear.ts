import * as admin from 'firebase-admin';
import * as fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/FIREBASE_SERVICE_ACCOUNT_JSON=(.+)/);
if (!match) throw new Error('No json');

let raw = match[1];
if (raw.startsWith("'") || raw.startsWith('"')) {
  raw = raw.slice(1, -1);
}
const sa = JSON.parse(raw.replace(/\\n/g, '\n'));

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}
const db = admin.firestore();

async function run() {
  const col = db.collection('products/de/items');
  const snap = await col.get();
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
  console.log('CLEARED ALL ITEMS');
}
run();
