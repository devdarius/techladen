'use client';

import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';

const SOCIAL_PROOF = [
  { emoji: '👤', name: 'Anna M.' },
  { emoji: '👤', name: 'Tobias K.' },
  { emoji: '👤', name: 'Sara L.' },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setDone(true);
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="relative py-20" style={{
      background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
    }}>
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">

        {/* Headline */}
        <h2 className="font-display text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
          10% Rabatt auf deine<br />
          <span className="text-yellow-300">erste Bestellung</span>
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Neue Produkte, Flash Sales und deinen persönlichen Willkommenscode — direkt in dein Postfach
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center mb-8">
          <p className="text-sm text-blue-100">
            <span className="font-bold text-white">5.200+</span> Abonnenten erhalten bereits exklusive Deals
          </p>
        </div>

        {/* Form */}
        {done ? (
          <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-8 py-7 inline-block">
            <p className="text-white font-bold text-lg">Danke! Dein Code kommt per E-Mail.</p>
            <p className="text-blue-100 text-sm mt-1">Schau auch in deinen Spam-Ordner.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                required
                className="w-full bg-white border-0 rounded-xl pl-10 pr-4 py-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 bg-yellow-400 hover:bg-yellow-300 text-[#0F172A] font-bold text-sm px-6 py-4 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-[#0F172A]/30 border-t-[#0F172A] rounded-full animate-spin" />
              ) : (
                <>10% sichern <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        <p className="text-xs text-blue-200 mt-4">Kein Spam. Jederzeit abmeldbar.</p>
      </div>
    </section>
  );
}
