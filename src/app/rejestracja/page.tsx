'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
          <h1 className="text-2xl font-bold text-text-main">Utwórz konto</h1>
          <p className="text-text-secondary text-sm mt-1">Dołącz do TechLaden.de</p>
        </div>

        <div className="bg-white rounded-card border border-border p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Imię</label>
                <input type="text" value={form.firstName} onChange={set('firstName')}
                  className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="Jan" required autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Nazwisko</label>
                <input type="text" value={form.lastName} onChange={set('lastName')}
                  className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="Kowalski" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Adres e-mail</label>
              <input type="email" value={form.email} onChange={set('email')}
                className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="twoj@email.de" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Hasło</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  className="w-full border border-border rounded-btn px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary"
                  placeholder="Min. 6 znaków" required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">⚠ {error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Tworzenie konta…' : 'Zarejestruj się'}
            </button>

            <p className="text-xs text-text-secondary text-center">
              Rejestrując się, akceptujesz nasze{' '}
              <Link href="/agb" className="text-primary hover:underline">AGB</Link> i{' '}
              <Link href="/datenschutz" className="text-primary hover:underline">Datenschutz</Link>.
            </p>
          </form>

          <p className="text-center text-sm text-text-secondary mt-4">
            Masz już konto?{' '}
            <Link href="/logowanie" className="text-primary hover:underline font-medium">Zaloguj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
