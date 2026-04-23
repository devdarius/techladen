'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';

export default function KassePage() {
  const router = useRouter();
  const { items, total } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    country: 'DE',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const shipping = total() >= 29 ? 0 : 4.99;
  const grandTotal = total() + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/anmelden'); return; }
    if (!items.length) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingAddress: form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      window.location.href = data.url;
    } catch {
      setError('Fehler beim Erstellen der Zahlung. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary mb-4">Dein Warenkorb ist leer.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          <ArrowLeft className="w-4 h-4" /> Zurück zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/warenkorb" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Zurück zum Warenkorb
      </Link>
      <h1 className="text-2xl font-bold text-text-main mb-8">Kasse</h1>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-card p-4 mb-6 text-sm text-blue-800">
          Bitte <Link href="/anmelden" className="font-semibold underline">anmelden</Link> oder{' '}
          <Link href="/registrieren" className="font-semibold underline">registrieren</Link>, um fortzufahren.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-card border border-border p-6 shadow-card">
            <h2 className="font-semibold text-text-main mb-4">Lieferadresse</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-main mb-1">Vorname *</label>
                <input type="text" value={form.firstName} onChange={set('firstName')} required
                  className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-main mb-1">Nachname *</label>
                <input type="text" value={form.lastName} onChange={set('lastName')} required
                  className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-text-main mb-1">E-Mail *</label>
              <input type="email" value={form.email} onChange={set('email')} required
                className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-text-main mb-1">Telefon</label>
              <input type="tel" value={form.phone} onChange={set('phone')}
                className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-text-main mb-1">Straße und Hausnummer *</label>
              <input type="text" value={form.street} onChange={set('street')} required
                className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-text-main mb-1">PLZ *</label>
                <input type="text" value={form.zip} onChange={set('zip')} required
                  className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-text-main mb-1">Stadt *</label>
                <input type="text" value={form.city} onChange={set('city')} required
                  className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-text-main mb-1">Land</label>
              <select value={form.country} onChange={set('country')}
                className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-btn px-3 py-2">⚠ {error}</p>}

          <button type="submit" disabled={loading || !user}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {loading ? 'Weiterleitung zur Zahlung…' : `Jetzt bezahlen ${grandTotal.toFixed(2).replace('.', ',')} €`}
          </button>
          <p className="text-xs text-text-secondary text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Sichere Zahlung über Stripe — SSL verschlüsselt
          </p>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-card border border-border p-5 shadow-card sticky top-24">
            <h2 className="font-semibold text-text-main mb-4">Bestellübersicht ({items.reduce((s, i) => s + i.quantity, 0)} Artikel)</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                    {item.images[0] && <Image src={item.images[0]} alt={item.title} fill className="object-contain p-1" sizes="48px" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-main line-clamp-2">{item.title}</p>
                    <p className="text-xs text-text-secondary">× {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-text-main flex-shrink-0">
                    {(item.price.eur * item.quantity).toFixed(2).replace('.', ',')} €
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Zwischensumme</span><span>{total().toFixed(2).replace('.', ',')} €</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Versand</span>
                <span className={shipping === 0 ? 'text-success font-medium' : ''}>
                  {shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2).replace('.', ',')} €`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-text-main border-t border-border pt-2 mt-2">
                <span>Gesamt</span><span className="text-primary">{grandTotal.toFixed(2).replace('.', ',')} €</span>
              </div>
              <p className="text-xs text-text-secondary">inkl. 19% MwSt.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
