import * as admin from 'firebase-admin';
import * as fs from 'fs';

const sa = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf-8'));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function main() {
  // Try with orderBy
  try {
    const snap = await db.collection('products/de/items').orderBy('createdAt', 'desc').get();
    console.log('With orderBy — count:', snap.size);
    snap.docs.forEach(d => console.log(' -', d.id, '|', d.data().title));
  } catch (e: unknown) {
    console.error('orderBy failed:', (e as Error).message);
  }

  // Try without orderBy
  try {
    const snap2 = await db.collection('products/de/items').get();
    console.log('\nWithout orderBy — count:', snap2.size);
    snap2.docs.forEach(d => console.log(' -', d.id, '|', d.data().title));
  } catch (e: unknown) {
    console.error('plain get failed:', (e as Error).message);
  }

  process.exit(0);
}

main();
