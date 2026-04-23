'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Zap, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function RegistrierenPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const turnstileToken = useRef<string>('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken.current) {
      setError('Bitte warte auf die Sicherheitsüberprüfung.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken: turnstileToken.current }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setDone(true);
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
          {!done && (
            <>
              <h1 className="text-2xl font-bold text-text-main">Konto erstellen</h1>
              <p className="text-text-secondary text-sm mt-1">Werde Teil von TechLaden.de</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-card border border-border p-6 shadow-card">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold text-text-main mb-2">Überprüfe deine E-Mails!</h2>
              <p className="text-sm text-text-secondary mb-1">Wir haben einen Bestätigungslink an</p>
              <p className="text-sm font-semibold text-text-main mb-4">{form.email}</p>
              <p className="text-xs text-text-secondary mb-6">
                Klicke auf den Link in der E-Mail, um dein Konto zu aktivieren. Der Link ist 24 Stunden gültig.
              </p>
              <Link href="/email-bestaetigung"
                className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm w-full justify-center">
                <Mail className="w-4 h-4" /> Zur Bestätigungsseite
              </Link>
              <p className="text-xs text-text-secondary mt-4">
                Keine E-Mail erhalten?{' '}
                <Link href="/email-bestaetigung" className="text-primary hover:underline">Neuen Link anfordern</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Vorname</label>
                  <input type="text" value={form.firstName} onChange={set('firstName')}
                    className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                    placeholder="Max" required autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Nachname</label>
                  <input type="text" value={form.lastName} onChange={set('lastName')}
                    className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                    placeholder="Mustermann" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">E-Mail-Adresse</label>
                <input type="email" value={form.email} onChange={set('email')}
                  className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                  placeholder="deine@email.de" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Passwort</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    className="w-full border border-border rounded-btn px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary"
                    placeholder="Mind. 6 Zeichen" required minLength={6} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Turnstile */}
              <div className="flex justify-center">
                <Turnstile
                  siteKey="0x4AAAAAADB9PTqFl-310e6L"
                  onSuccess={(token) => { turnstileToken.current = token; }}
                  onExpire={() => { turnstileToken.current = ''; }}
                  options={{ theme: 'light', language: 'de' }}
                />
              </div>

              {error && <p className="text-red-500 text-sm">⚠ {error}</p>}

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Konto wird erstellt…' : 'Konto erstellen'}
              </button>
              <p className="text-xs text-text-secondary text-center">
                Mit der Registrierung akzeptierst du unsere{' '}
                <Link href="/agb" className="text-primary hover:underline">AGB</Link> und{' '}
                <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link>.
              </p>
            </form>
          )}
        </div>

        {!done && (
          <p className="text-center text-sm text-text-secondary mt-4">
            Bereits ein Konto?{' '}
            <Link href="/anmelden" className="text-primary hover:underline font-medium">Jetzt anmelden</Link>
          </p>
        )}
      </div>
    </div>
  );
}
