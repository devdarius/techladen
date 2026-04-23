'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { useCouponStore } from '@/lib/coupon-store';
import CouponInput from '@/components/cart/CouponInput';

// ─── Validation helpers ───────────────────────────────────────
function validateField(name: string, value: string, country: string): string {
  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!value.trim()) return 'Pflichtfeld';
      if (value.trim().length < 2) return 'Mindestens 2 Zeichen';
      return '';
    case 'email':
      if (!value.trim()) return 'Pflichtfeld';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ungültige E-Mail-Adresse';
      return '';
    case 'emailConfirm':
      return ''; // handled separately
    case 'phone':
      if (!value.trim()) return 'Pflichtfeld — wird für Lieferbenachrichtigungen benötigt';
      if (!/^[\d\s\+\-\(\)]{7,20}$/.test(value.trim())) return 'Ungültige Telefonnummer';
      return '';
    case 'street':
      if (!value.trim()) return 'Pflichtfeld';
      if (value.trim().length < 5) return 'Bitte vollständige Adresse eingeben';
      if (!/\d/.test(value)) return 'Hausnummer fehlt';
      return '';
    case 'zip':
      if (!value.trim()) return 'Pflichtfeld';
      if (country === 'DE' && !/^\d{5}$/.test(value.trim())) return 'PLZ muss 5 Ziffern haben (z.B. 10115)';
      if (country === 'AT' && !/^\d{4}$/.test(value.trim())) return 'PLZ muss 4 Ziffern haben';
      if (country === 'CH' && !/^\d{4}$/.test(value.trim())) return 'PLZ muss 4 Ziffern haben';
      return '';
    case 'city':
      if (!value.trim()) return 'Pflichtfeld';
      if (value.trim().length < 2) return 'Ungültige Stadt';
      return '';
    default:
      return '';
  }
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error: string;
  touched: boolean;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
}

function Field({ label, name, type = 'text', value, onChange, onBlur, error, touched, placeholder, required, hint, autoComplete }: FieldProps) {
  const hasError = touched && error;
  const isValid = touched && !error && value.trim();

  return (
    <div>
      <label className="block text-xs font-semibold text-text-main mb-1.5">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full border rounded-btn px-3 py-2.5 text-sm focus:outline-none transition-colors pr-9 ${
            hasError
              ? 'border-red-400 bg-red-50 focus:border-red-500'
              : isValid
              ? 'border-green-400 bg-green-50 focus:border-green-500'
              : 'border-border focus:border-primary'
          }`}
        />
        {isValid && (
          <CheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
        )}
      </div>
      {hasError && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          {error}
        </p>
      )}
      {hint && !hasError && (
        <p className="text-text-secondary text-xs mt-1">{hint}</p>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function KassePage() {
  const router = useRouter();
  const { items, total } = useCartStore();
  const { user } = useAuthStore();
  const { coupon, discount, clear: clearCoupon } = useCouponStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    emailConfirm: '',
    phone: '',
    street: '',
    city: '',
    zip: '',
    country: 'DE',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill from user account
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        firstName: user.firstName || f.firstName,
        lastName: user.lastName || f.lastName,
        email: user.email || f.email,
        emailConfirm: user.email || f.emailConfirm,
      }));
    }
  }, [user]);

  const setField = (name: string) => (value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      const err = name === 'emailConfirm'
        ? (value !== form.email ? 'E-Mail-Adressen stimmen nicht überein' : '')
        : validateField(name, value, form.country);
      setErrors((e) => ({ ...e, [name]: err }));
    }
  };

  const touchField = (name: string) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    const err = name === 'emailConfirm'
      ? (form.emailConfirm !== form.email ? 'E-Mail-Adressen stimmen nicht überein' : '')
      : validateField(name, form[name as keyof typeof form], form.country);
    setErrors((e) => ({ ...e, [name]: err }));
  };

  const validateAll = () => {
    const fields = ['firstName', 'lastName', 'email', 'emailConfirm', 'phone', 'street', 'zip', 'city'];
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    for (const f of fields) {
      newTouched[f] = true;
      newErrors[f] = f === 'emailConfirm'
        ? (form.emailConfirm !== form.email ? 'E-Mail-Adressen stimmen nicht überein' : '')
        : validateField(f, form[f as keyof typeof form], form.country);
    }
    // country is always valid — never touch it
    newTouched['country'] = false;

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const shipping = total() >= 29 || coupon?.type === 'free_shipping' ? 0 : 4.99;
  const grandTotal = Math.max(0, total() - discount + shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      setError('Bitte korrigiere die markierten Felder.');
      return;
    }
    if (!user) { router.push('/anmelden'); return; }
    if (!items.length) return;

    setLoading(true);
    setError('');
    try {
      const { emailConfirm: _, ...shippingAddress } = form;
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingAddress, couponCode: coupon?.code ?? null }),
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

  const fieldProps = (name: string, extra?: Partial<FieldProps>) => ({
    name,
    value: form[name as keyof typeof form],
    onChange: setField(name),
    onBlur: touchField(name),
    error: errors[name] ?? '',
    touched: touched[name] ?? false,
    ...extra,
  });

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
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4" noValidate>
          <div className="bg-white rounded-card border border-border p-6 shadow-card space-y-4">
            <h2 className="font-semibold text-text-main">Lieferadresse</h2>

            <div className="grid grid-cols-2 gap-3">
              <Field {...fieldProps('firstName')} label="Vorname" required placeholder="Max" autoComplete="given-name" />
              <Field {...fieldProps('lastName')} label="Nachname" required placeholder="Mustermann" autoComplete="family-name" />
            </div>

            <Field {...fieldProps('email')} label="E-Mail-Adresse" type="email" required
              placeholder="deine@email.de" autoComplete="email"
              hint="An diese Adresse senden wir deine Bestellbestätigung" />

            <Field {...fieldProps('emailConfirm')} label="E-Mail bestätigen" type="email" required
              placeholder="deine@email.de" autoComplete="off"
              hint="Bitte E-Mail-Adresse wiederholen" />

            <Field {...fieldProps('phone')} label="Telefon" required
              placeholder="+49 123 456789" autoComplete="tel"
              hint="Wird für Lieferbenachrichtigungen benötigt" />

            <Field {...fieldProps('street')} label="Straße und Hausnummer" required
              placeholder="Musterstraße 42" autoComplete="street-address" />

            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-2">
                <Field {...fieldProps('zip')} label="PLZ" required
                  placeholder={form.country === 'DE' ? '10115' : '1010'} autoComplete="postal-code" />
              </div>
              <div className="col-span-3">
                <Field {...fieldProps('city')} label="Stadt" required
                  placeholder="Berlin" autoComplete="address-level2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Land</label>
              <select
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary bg-white"
              >
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-btn px-3 py-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !user}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {loading ? 'Weiterleitung zur Zahlung…' : `Jetzt bezahlen ${grandTotal.toFixed(2).replace('.', ',')} €`}
          </button>
          <p className="text-xs text-text-secondary text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Sichere Zahlung über Stripe — SSL verschlüsselt
          </p>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-card border border-border p-5 shadow-card lg:sticky lg:top-24">
            <h2 className="font-semibold text-text-main mb-4">
              Bestellübersicht ({items.reduce((s, i) => s + i.quantity, 0)} Artikel)
            </h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                    {item.images[0] && (
                      <Image src={item.images[0]} alt={item.title} fill className="object-contain p-1" sizes="48px" />
                    )}
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
                <span>Zwischensumme</span>
                <span>{total().toFixed(2).replace('.', ',')} €</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Versand</span>
                <span className={shipping === 0 ? 'text-success font-medium' : ''}>
                  {shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2).replace('.', ',')} €`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-text-secondary bg-surface rounded px-2 py-1">
                  Noch <strong className="text-primary">{(29 - total()).toFixed(2).replace('.', ',')} €</strong> bis zum kostenlosen Versand
                </p>
              )}
              <div className="flex justify-between font-bold text-text-main border-t border-border pt-2 mt-2">
                <span>Gesamt</span>
                <span className="text-primary">{grandTotal.toFixed(2).replace('.', ',')} €</span>
              </div>
              <p className="text-xs text-text-secondary">inkl. 19% MwSt.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
