'use client';

import { useState, useEffect } from 'react';

const NAMES = ['Max', 'Anna', 'Thomas', 'Sarah', 'Michael', 'Lisa', 'Stefan', 'Julia'];
const CITIES = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf'];
const PRODUCTS = ['iPhone Hülle', 'MagSafe Ladegerät', 'USB-C Kabel', 'Schutzglas', 'Powerbank'];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export default function SocialProofToast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const msgs = [
      `${rand(NAMES)} aus ${rand(CITIES)} hat gerade gekauft: ${rand(PRODUCTS)}`,
      `${12 + Math.floor(Math.random() * 22)} Personen schauen sich das gerade an`,
      `${rand(NAMES)} aus ${rand(CITIES)} hat eine Bewertung hinterlassen`,
    ];
    let i = 0;
    const show = () => {
      setMsg(msgs[i % msgs.length]);
      setVisible(true);
      i++;
      setTimeout(() => setVisible(false), 4000);
    };
    const t = setTimeout(show, 3000);
    const iv = setInterval(show, 8000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  if (!msg) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 max-w-xs transition-all duration-400"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}>
      <div className="bg-white border border-[#E8E8E8] rounded-xl shadow-lg px-4 py-3 text-xs text-[#444] font-medium">
        {msg}
      </div>
    </div>
  );
}
