'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'all');
    setVisible(false);
  };

  const necessary = () => {
    localStorage.setItem('cookie_consent', 'necessary');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-card-hover">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-secondary text-center sm:text-left">
          🍪 Wir verwenden Cookies für ein optimales Einkaufserlebnis.{' '}
          <a href="/datenschutz" className="text-primary underline hover:no-underline">
            Mehr erfahren
          </a>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={necessary}
            className="px-4 py-2 text-sm font-medium border border-border rounded-btn text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            Nur notwendige
          </button>
          <button
            onClick={accept}
            className="btn-cta px-4 py-2 text-sm"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
