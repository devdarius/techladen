'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exit_popup_shown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
        sessionStorage.setItem('exit_popup_shown', '1');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl max-w-md w-full p-8 relative card-lift">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <h2 className="text-2xl font-black text-white mb-2">Dein Rabatt wartet!</h2>
            <p className="text-text-secondary text-sm mb-6">
              Wir haben dir deinen Rabattcode per E-Mail geschickt.
            </p>
            <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-4 font-mono font-bold text-primary text-xl shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              SAVE5
            </div>
            <button
              onClick={() => setVisible(false)}
              className="btn-cta w-full mt-6 py-3.5 text-sm"
            >
              Jetzt shoppen
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white mb-2">Warten Sie!</h2>
              <p className="text-lg font-bold text-primary mb-2">5% Rabatt auf Ihre erste Bestellung</p>
              <p className="text-text-secondary text-sm">
                Tragen Sie Ihre E-Mail ein und erhalten Sie sofort Ihren Rabattcode
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
              />
              <button type="submit" className="btn-cta w-full py-4 text-sm uppercase tracking-wider">
                Rabatt sichern — Code: SAVE5
              </button>
            </form>

            <button
              onClick={() => setVisible(false)}
              className="mt-4 w-full text-xs text-text-secondary hover:text-white transition-colors text-center"
            >
              Nein danke, ich möchte den Vollpreis zahlen
            </button>
          </>
        )}
      </div>
    </div>
  );
}
