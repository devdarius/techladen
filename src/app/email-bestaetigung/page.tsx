'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, Mail, Loader2, Zap } from 'lucide-react';

function VerificationContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);
    setResendError('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setResendError(data.error); }
      else { setResendDone(true); }
    } catch { setResendError('Verbindungsfehler.'); }
    finally { setResending(false); }
  };

  // ── Success ──────────────────────────────────────────────────
  if (success) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-3">E-Mail bestätigt! 🎉</h1>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">
          Dein Konto wurde erfolgreich aktiviert. Du bist jetzt angemeldet und kannst loslegen.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base">
          Zum Shop →
        </Link>
      </div>
    );
  }

  // ── Error: expired ───────────────────────────────────────────
  if (error === 'expired') {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-3">Link abgelaufen</h1>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">
          Dein Bestätigungslink ist abgelaufen. Fordere einen neuen Link an.
        </p>
        <ResendForm email={email} setEmail={setEmail} resending={resending} resendDone={resendDone} resendError={resendError} onSubmit={handleResend} />
      </div>
    );
  }

  // ── Error: invalid ───────────────────────────────────────────
  if (error === 'invalid') {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-main mb-3">Ungültiger Link</h1>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">
          Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet.
        </p>
        <ResendForm email={email} setEmail={setEmail} resending={resending} resendDone={resendDone} resendError={resendError} onSubmit={handleResend} />
      </div>
    );
  }

  // ── Default: check email ─────────────────────────────────────
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-blue-500" />
      </div>
      <h1 className="text-2xl font-bold text-text-main mb-3">Überprüfe deine E-Mails</h1>
      <p className="text-text-secondary mb-2 max-w-sm mx-auto">
        Wir haben dir einen Bestätigungslink gesendet. Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
      </p>
      <p className="text-sm text-text-secondary mb-8">Der Link ist 24 Stunden gültig.</p>

      <div className="bg-surface rounded-card border border-border p-5 text-left max-w-sm mx-auto mb-6">
        <p className="text-sm font-medium text-text-main mb-1">Keine E-Mail erhalten?</p>
        <p className="text-xs text-text-secondary">Überprüfe deinen Spam-Ordner oder fordere einen neuen Link an.</p>
      </div>

      <ResendForm email={email} setEmail={setEmail} resending={resending} resendDone={resendDone} resendError={resendError} onSubmit={handleResend} />
    </div>
  );
}

function ResendForm({
  email, setEmail, resending, resendDone, resendError, onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  resending: boolean;
  resendDone: boolean;
  resendError: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  if (resendDone) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-card p-4 text-sm text-green-800 max-w-sm mx-auto">
        ✓ Neuer Bestätigungslink wurde gesendet. Bitte überprüfe deine E-Mails.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-3">
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@email.de" required
        className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
      />
      {resendError && <p className="text-red-500 text-xs">⚠ {resendError}</p>}
      <button type="submit" disabled={resending}
        className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
        {resending && <Loader2 className="w-4 h-4 animate-spin" />}
        {resending ? 'Wird gesendet…' : 'Neuen Link anfordern'}
      </button>
    </form>
  );
}

export default function EmailBestaetigungPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-text-main">Tech</span>
            <span className="font-light text-xl text-text-secondary">Laden.de</span>
          </Link>
        </div>
        <div className="bg-white rounded-card border border-border p-8 shadow-card">
          <Suspense>
            <VerificationContent />
          </Suspense>
        </div>
        <p className="text-center text-sm text-text-secondary mt-4">
          <Link href="/anmelden" className="text-primary hover:underline">Zurück zur Anmeldung</Link>
        </p>
      </div>
    </div>
  );
}
