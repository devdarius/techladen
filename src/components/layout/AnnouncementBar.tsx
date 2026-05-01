'use client';

import { useEffect, useRef } from 'react';
import { Truck, Zap, RotateCcw, ShieldCheck, Star } from 'lucide-react';

const MESSAGES = [
  { icon: Truck, text: 'Gratis Versand ab 29€ — Schnelle Lieferung in 3–7 Werktagen' },
  { icon: Zap, text: 'Flash Sale läuft — Bis zu 40% Rabatt auf ausgewählte Produkte!' },
  { icon: RotateCcw, text: '30 Tage kostenlose Rückgabe — Kein Risiko, volle Zufriedenheit' },
  { icon: ShieldCheck, text: 'Sicherer Checkout — PayPal, Klarna & Kreditkarte akzeptiert' },
  { icon: Star, text: 'Über 10.000 zufriedene Kunden — Trustpilot Bewertung 4,9/5' },
];

export default function AnnouncementBar() {
  // Build a doubled list for seamless loop
  const doubled = [...MESSAGES, ...MESSAGES];

  return (
    <div className="relative overflow-hidden py-2.5" style={{
      background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)',
    }}>
      {/* Marquee track */}
      <div className="flex animate-marquee whitespace-nowrap gap-0" style={{ width: 'max-content' }}>
        {doubled.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-white text-xs font-semibold tracking-wide px-12"
          >
            <msg.icon className="w-3.5 h-3.5 flex-shrink-0" />
            {msg.text}
            <span className="text-white/30 mx-4">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
