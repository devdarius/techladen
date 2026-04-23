import admin from 'firebase-admin';

function parseServiceAccount(raw: string) {
  // Vercel may store multiline values — try direct parse first
  const attempts = [
    raw,
    raw.trim(),
    raw.trim().replace(/\\n/g, '\n'),
    raw.trim().replace(/^['"]|['"]$/g, ''),
    raw.trim().replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n'),
  ];

  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt);
      if (parsed.private_key) return parsed;
    } catch {
      // try next
    }
  }

  throw new Error('Could not parse FIREBASE_SERVICE_ACCOUNT_JSON — check Vercel env var');
}

function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not set');

  const serviceAccount = parseServiceAccount(raw);

  // Ensure private_key newlines are real newlines
  if (typeof serviceAccount.private_key === 'string') {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export function getFirestore() {
  getFirebaseAdmin();
  return admin.firestore();
}
