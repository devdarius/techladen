'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  'Kostenloser Versand ab 29€',
  'Heute bestellt — schnell geliefert',
  'Sicher bezahlen mit PayPal & Klarna',
  'Über 15.000 zufriedene Kunden',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIndex((i) => (i + 1) % MESSAGES.length); setVisible(true); }, 300);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="bg-black text-white text-xs py-2.5 px-4 text-center font-medium tracking-wide">
      <span style={{ transition: 'opacity 0.3s', opacity: visible ? 1 : 0 }}>
        {MESSAGES[index]}
      </span>
    </div>
  );
}
