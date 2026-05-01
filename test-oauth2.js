const APP_KEY = '532686';
const APP_SECRET = '8gLeF0iK9sIIa1bzkeiXUqkasMil5q1G';

async function testOAuthStandard() {
  const url = 'https://api-sg.aliexpress.com/oauth/token';
  const params = {
    client_id: APP_KEY,
    client_secret: APP_SECRET,
    code: 'dummy_code',
    grant_type: 'authorization_code',
    redirect_uri: 'https://techladen.de/api/aliexpress/callback'
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString()
  });

  console.log("OAuth Standard status:", res.status);
  const json = await res.json();
  console.log("Response:", JSON.stringify(json, null, 2));
}

testOAuthStandard();
