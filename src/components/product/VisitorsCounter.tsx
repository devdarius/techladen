'use client';

import { useState, useEffect } from 'react';

export default function VisitorsCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(12 + Math.floor(Math.random() * 22));
    const iv = setInterval(() => {
      setCount((c) => Math.max(8, c + (Math.random() > 0.5 ? 1 : -1)));
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  if (!count) return null;
  return (
    <p className="text-xs text-[#666]">
      {count} Personen schauen sich das gerade an
    </p>
  );
}
