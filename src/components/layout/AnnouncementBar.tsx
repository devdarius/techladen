'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  '🚚 Kostenloser Versand ab 29€',
  '⚡ Blitzversand — Heute bestellt, schnell geliefert',
  '🔒 Sicher bezahlen mit PayPal & Klarna',
  '⭐ Über 15.000 zufriedene Kunden',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary text-white text-sm py-2 px-4 text-center font-medium overflow-hidden">
      <span
        style={{
          display: 'inline-block',
          transition: 'opacity 0.3s ease',
          opacity: visible ? 1 : 0,
        }}
      >
        {MESSAGES[index]}
      </span>
    </div>
  );
}
