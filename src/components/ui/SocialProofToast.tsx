'use client';

import { useState, useEffect } from 'react';

const NAMES = ['Max', 'Anna', 'Thomas', 'Sarah', 'Michael', 'Lisa', 'Stefan', 'Julia', 'Andreas', 'Laura'];
const CITIES = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf', 'Leipzig'];
const PRODUCTS = ['iPhone Hülle', 'MagSafe Ladegerät', 'USB-C Kabel', 'Schutzglas', 'Powerbank', 'Smartwatch Band'];

function rand(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMessages(): string[] {
  return [
    `🛒 ${rand(NAMES)} aus ${rand(CITIES)} hat gerade gekauft: ${rand(PRODUCTS)}`,
    `👀 ${12 + Math.floor(Math.random() * 22)} Personen schauen sich das gerade an`,
    `🛒 ${rand(NAMES)} aus ${rand(CITIES)} hat gerade gekauft: ${rand(PRODUCTS)}`,
    `⭐ ${rand(NAMES)} aus ${rand(CITIES)} hat gerade eine Bewertung hinterlassen`,
  ];
}

export default function SocialProofToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const messages = getMessages();
    let i = 0;

    const show = () => {
      setMessage(messages[i % messages.length]);
      setVisible(true);
      i++;
      setTimeout(() => setVisible(false), 4000);
    };

    const timeout = setTimeout(show, 3000);
    const interval = setInterval(show, 8000);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-20 left-4 z-40 max-w-xs transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
    >
      <div className="bg-white border border-border rounded-card shadow-card-hover px-4 py-3 text-sm text-text-main">
        {message}
      </div>
    </div>
  );
}
