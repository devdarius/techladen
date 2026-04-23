'use client';

import { useState, useEffect } from 'react';

interface Props {
  label?: string;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function CountdownTimer({ label = 'Angebot endet in:' }: Props) {
  const [seconds, setSeconds] = useState(getSecondsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-urgency">
      <span>⏰</span>
      <span>{label}</span>
      <span className="font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-sm">
        {formatTime(seconds)}
      </span>
    </div>
  );
}
