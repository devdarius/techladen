'use client';

import { useState, useEffect } from 'react';
import { Truck, Zap, Lock, Star } from 'lucide-react';

const MESSAGES = [
  { icon: Truck, text: 'Kostenloser Versand ab 29€' },
  { icon: Zap,   text: 'Heute bestellt — schnell geliefert' },
  { icon: Lock,  text: 'Sicher bezahlen mit PayPal & Klarna' },
  { icon: Star,  text: 'Über 15.000 zufriedene Kunden' },
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

  const { icon: Icon, text } = MESSAGES[index];

  return (
    <div className="bg-slate-900 text-white text-sm py-2 px-4 text-center font-medium">
      <span
        className="inline-flex items-center gap-2"
        style={{ transition: 'opacity 0.3s ease', opacity: visible ? 1 : 0 }}
      >
        <Icon className="w-3.5 h-3.5 opacity-80" />
        {text}
      </span>
    </div>
  );
}
