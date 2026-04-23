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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-card shadow-card-hover max-w-md w-full p-8 relative">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-main transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-text-main mb-2">Dein Rabatt wartet!</h2>
            <p className="text-text-secondary text-sm mb-4">
              Wir haben dir deinen Rabattcode per E-Mail geschickt.
            </p>
            <div className="bg-indigo-50 border border-primary rounded-btn px-4 py-3 font-mono font-bold text-primary text-lg">
              WILLKOMMEN10
            </div>
            <button
              onClick={() => setVisible(false)}
              className="btn-primary mt-4 px-6 py-2.5 text-sm"
            >
              Jetzt shoppen
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎁</div>
              <h2 className="text-xl font-bold text-text-main mb-2">Warten Sie!</h2>
              <p className="text-lg font-semibold text-primary mb-1">10% Rabatt auf Ihre erste Bestellung</p>
              <p className="text-text-secondary text-sm">
                Tragen Sie Ihre E-Mail ein und erhalten Sie sofort Ihren Rabattcode.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                className="w-full border border-border rounded-btn px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="btn-cta w-full py-3 text-sm">
                Rabatt sichern — Code: WILLKOMMEN10
              </button>
            </form>

            <button
              onClick={() => setVisible(false)}
              className="mt-3 w-full text-xs text-text-secondary hover:text-text-main transition-colors text-center"
            >
              Nein danke, ich möchte keinen Rabatt
            </button>
          </>
        )}
      </div>
    </div>
  );
}
