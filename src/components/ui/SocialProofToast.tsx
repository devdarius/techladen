'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Star } from 'lucide-react';

const NAMES = ['Max', 'Anna', 'Thomas', 'Sarah', 'Michael', 'Lisa', 'Stefan', 'Julia', 'Andreas', 'Laura'];
const CITIES = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf', 'Leipzig'];
const PRODUCTS = ['iPhone Hülle', 'MagSafe Ladegerät', 'USB-C Kabel', 'Schutzglas', 'Powerbank', 'Smartwatch Band'];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

type ToastMsg = { icon: React.ElementType; text: string };

function getMessages(): ToastMsg[] {
  return [
    { icon: ShoppingCart, text: `${rand(NAMES)} aus ${rand(CITIES)} hat gerade gekauft: ${rand(PRODUCTS)}` },
    { icon: Eye,          text: `${12 + Math.floor(Math.random() * 22)} Personen schauen sich das gerade an` },
    { icon: ShoppingCart, text: `${rand(NAMES)} aus ${rand(CITIES)} hat gerade gekauft: ${rand(PRODUCTS)}` },
    { icon: Star,         text: `${rand(NAMES)} aus ${rand(CITIES)} hat eine Bewertung hinterlassen` },
  ];
}

export default function SocialProofToast() {
  const [msg, setMsg] = useState<ToastMsg | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const messages = getMessages();
    let i = 0;
    const show = () => {
      setMsg(messages[i % messages.length]);
      setVisible(true);
      i++;
      setTimeout(() => setVisible(false), 4000);
    };
    const t = setTimeout(show, 3000);
    const iv = setInterval(show, 8000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  if (!msg) return null;
  const Icon = msg.icon;

  return (
    <div
      className="fixed bottom-20 left-4 z-40 max-w-xs transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
        {msg.text}
      </div>
    </div>
  );
}
