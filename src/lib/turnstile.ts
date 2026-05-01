export async function verifyTurnstile(token: string): Promise<boolean> {
  if (!token) return false;

  const secret = process.env.NODE_ENV === 'development' 
    ? '1x0000000000000000000000000000000AA' 
    : process.env.TURNSTILE_SECRET_KEY!;

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: secret,
      response: token,
    }),
  });

  const data = await res.json() as { success: boolean };
  return data.success === true;
}
