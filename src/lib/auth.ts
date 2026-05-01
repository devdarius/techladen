import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = (process.env.JWT_SECRET ?? 'fallback_secret').trim();
const COOKIE_NAME = 'tl_session';

export interface SessionUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user';
}

export function signToken(user: SessionUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
