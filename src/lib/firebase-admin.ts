import admin from 'firebase-admin';

function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON env var is not set');
  }

  // Strip surrounding quotes if present, unescape \n
  const cleaned = serviceAccountJson
    .replace(/^['"]|['"]$/g, '')
    .replace(/\\n/g, '\n');

  const serviceAccount = JSON.parse(cleaned);

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export function getFirestore() {
  getFirebaseAdmin();
  return admin.firestore();
}
