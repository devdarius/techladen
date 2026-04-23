import * as admin from 'firebase-admin';
import * as fs from 'fs';

const sa = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf-8'));
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(sa) });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('users').get();
  console.log(`\nUżytkownicy w Firestore: ${snap.size}\n`);
  snap.docs.forEach((d) => {
    const data = d.data();
    console.log(`  UID:      ${d.id}`);
    console.log(`  Email:    ${data.email}`);
    console.log(`  Imię:     ${data.firstName} ${data.lastName}`);
    console.log(`  Verified: ${data.emailVerified ? '✅ TAK' : '❌ NIE'}`);
    console.log(`  Utworzony: ${data.createdAt}`);
    console.log('  ---');
  });
  process.exit(0);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
