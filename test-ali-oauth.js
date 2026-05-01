const crypto = require('crypto');
const APP_KEY = '532686';
const APP_SECRET = '8gLeF0iK9sIIa1bzkeiXUqkasMil5q1G'; // This was in the .env.local file the user provided
const BASE_URL = 'https://api-sg.aliexpress.com/sync';

function sign(params, secret) {
  const base = Object.entries(params)
    .filter(([, v]) => v != null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [k, v]) => acc + k + v, '');
  return crypto.createHmac('sha256', secret).update(base).digest('hex').toUpperCase();
}

async function testTokenExchange() {
  const method = '/auth/token/security/create';
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const params = {
    app_key: APP_KEY,
    timestamp,
    sign_method: 'hmac-sha256',
    method,
    v: '2.0',
    format: 'json',
    code: 'dummy_code_123',
  };

  params.sign = sign(params, APP_SECRET);

  console.log("Request:", params);
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });

  console.log("Status:", res.status);
  const json = await res.json();
  console.log("Response:", JSON.stringify(json, null, 2));
}

testTokenExchange();
