'use client';

import { useState, useEffect } from 'react';
import { Truck, Zap, ShieldCheck, Star } from 'lucide-react';

const MESSAGES = [
  { icon: Truck,       text: 'Kostenloser Versand ab 29 €',              highlight: '29 €' },
  { icon: Zap,         text: 'Heute bestellt — schnell geliefert',        highlight: 'schnell' },
  { icon: ShieldCheck, text: 'Sicher bezahlen mit PayPal & Klarna',       highlight: 'PayPal & Klarna' },
  { icon: Star,        text: 'Über 15.000 zufriedene Kunden ⭐⭐⭐⭐⭐',   highlight: '15.000' },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIndex((i) => (i + 1) % MESSAGES.length); setShow(true); }, 350);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const { icon: Icon, text } = MESSAGES[index];

  return (
    <div className="bg-slate-900 text-white py-2.5 px-4 text-center text-sm font-medium">
      <span
        className="inline-flex items-center gap-2"
        style={{ opacity: show ? 1 : 0, transition: 'opacity 0.35s ease' }}
      >
        <Icon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        {text}
      </span>
    </div>
  );
}
