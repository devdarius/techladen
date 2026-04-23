'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser(data);
      router.push('/konto');
    } catch {
      setError('Błąd połączenia z serwerem');
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
          <h1 className="text-2xl font-bold text-text-main">Zaloguj się</h1>
          <p className="text-text-secondary text-sm mt-1">Witaj z powrotem!</p>
        </div>

        <div className="bg-white rounded-card border border-border p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Adres e-mail</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="twoj@email.de" required autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Hasło</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-btn px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary"
                  placeholder="••••••••" required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">⚠ {error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Logowanie…' : 'Zaloguj się'}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-4">
            Nie masz konta?{' '}
            <Link href="/rejestracja" className="text-primary hover:underline font-medium">Zarejestruj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
