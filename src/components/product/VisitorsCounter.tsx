'use client';

import { useState, useEffect } from 'react';

export default function VisitorsCounter() {
  const [count, setCount] = useState(18);

  useEffect(() => {
    setCount(12 + Math.floor(Math.random() * 23));
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(12, Math.min(34, c + delta));
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <span>👀</span>
      <span><strong className="text-text-main">{count} Personen</strong> schauen sich das gerade an</span>
    </div>
  );
}
