'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(''); }
  };

  return (
    <section className="bg-surface border-t border-border py-14">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-text-main mb-2">
          Spare 10% auf deine erste Bestellung
        </h2>
        <p className="text-text-secondary mb-6">
          Melde dich für unseren Newsletter an und erhalte exklusive Angebote.
        </p>
        {done ? (
          <p className="text-success font-semibold">✓ Danke! Dein Rabattcode kommt per E-Mail.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              className="flex-1 border border-border rounded-btn px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
              Anmelden
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
