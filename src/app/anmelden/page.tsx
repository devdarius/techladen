'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuthStore } from '@/lib/auth-store';

export default function AnmeldenPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const turnstileToken = useRef<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken.current) {
      setError('Bitte warte auf die Sicherheitsüberprüfung.');
      return;
    }
    setLoading(true);
    setError('');
    setUnverified(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, turnstileToken: turnstileToken.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.unverified) {
          setUnverified(true);
          setUnverifiedEmail(data.email ?? email);
        } else {
          setError(data.error);
        }
        return;
      }
      setUser(data);
      router.push('/mein-konto');
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 mb-4">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-text-main">Tech</span>
            <span className="font-light text-xl text-text-secondary">Laden.de</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Anmelden</h1>
          <p className="text-text-secondary text-sm mt-1">Willkommen zurück!</p>
        </div>

        <div className="bg-white rounded-card border border-border p-6 shadow-card">
          {unverified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-btn p-4 mb-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">E-Mail nicht bestätigt</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Bitte bestätige zuerst deine E-Mail-Adresse <strong>{unverifiedEmail}</strong>.
                  </p>
                  <Link href="/email-bestaetigung"
                    className="inline-block mt-2 text-xs font-semibold text-yellow-800 underline hover:no-underline">
                    Neuen Bestätigungslink anfordern →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">E-Mail-Adresse</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="deine@email.de" required autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Passwort</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-btn px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Turnstile */}
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NODE_ENV === 'development' ? '1x00000000000000000000AA' : (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADB9PTqFl-310e6L')}
                onSuccess={(token) => { turnstileToken.current = token; }}
                onExpire={() => { turnstileToken.current = ''; }}
                options={{ theme: 'light', language: 'de' }}
              />
            </div>

            {error && <p className="text-red-500 text-sm">⚠ {error}</p>}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Anmelden…' : 'Anmelden'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-4">
            Noch kein Konto?{' '}
            <Link href="/registrieren" className="text-primary hover:underline font-medium">Jetzt registrieren</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
