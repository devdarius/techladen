'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(''); }
  };

  return (
    <section className="bg-[#F7F7F7] border-t border-[#E8E8E8] py-16">
      <div className="max-w-xl mx-auto px-6 text-center">
        <p className="text-xs font-bold tracking-[3px] uppercase text-[#999] mb-3">Newsletter</p>
        <h2 className="text-2xl font-black text-black mb-3">
          10% auf deine erste Bestellung
        </h2>
        <p className="text-sm text-[#666] mb-8">
          Exklusive Angebote, neue Produkte und deinen persönlichen Willkommenscode.
        </p>

        {done ? (
          <p className="text-sm font-semibold text-black">Danke! Dein Code kommt per E-Mail.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de" required
              className="flex-1 border border-[#E8E8E8] bg-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            <button type="submit"
              className="bg-black text-white font-semibold px-5 py-3 rounded-lg hover:bg-[#222] transition-colors flex items-center gap-2 text-sm">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
        <p className="text-[11px] text-[#bbb] mt-4">Kein Spam. Jederzeit abmeldbar.</p>
      </div>
    </section>
  );
}
