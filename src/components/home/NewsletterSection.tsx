'use client';

import { useState } from 'react';
import { Mail, Gift, ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(''); }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 py-16">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Gift className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">
          10% Rabatt auf deine erste Bestellung
        </h2>
        <p className="text-indigo-200 mb-8 text-base">
          Melde dich an und erhalte exklusive Angebote, neue Produkte und deinen persönlichen Willkommenscode.
        </p>

        {done ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 inline-flex items-center gap-3 text-white font-semibold">
            <Mail className="w-5 h-5 text-emerald-300" />
            Danke! Dein Code kommt per E-Mail.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de" required
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-indigo-300 text-sm focus:outline-none focus:border-white/50 backdrop-blur-sm" />
            <button type="submit"
              className="bg-white text-indigo-700 font-bold px-5 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 text-sm whitespace-nowrap">
              Anmelden <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-indigo-300 text-xs mt-4">Kein Spam. Jederzeit abmeldbar.</p>
      </div>
    </section>
  );
}
