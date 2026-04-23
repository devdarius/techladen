import * as admin from 'firebase-admin';
import * as fs from 'fs';

const sa = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf-8'));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('orders').get();
  console.log(`\nZamówienia w Firestore: ${snap.size}\n`);
  snap.docs.forEach((d) => {
    const data = d.data();
    console.log(`  ID:     ${d.id}`);
    console.log(`  Status: ${data.status}`);
    console.log(`  Total:  ${data.total} €`);
    console.log(`  Email:  ${data.shippingAddress?.email}`);
    console.log(`  Stripe: ${data.stripeSessionId}`);
    console.log('  ---');
  });
  process.exit(0);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
