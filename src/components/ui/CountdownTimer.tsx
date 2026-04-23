'use client';

import { useState, useEffect } from 'react';

function getSecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function CountdownTimer({ label = 'Angebot endet in:', dark = false }: { label?: string; dark?: boolean }) {
  const [secs, setSecs] = useState(getSecondsUntilMidnight());

  useEffect(() => {
    const iv = setInterval(() => setSecs(getSecondsUntilMidnight()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = pad(Math.floor(secs / 3600));
  const m = pad(Math.floor((secs % 3600) / 60));
  const s = pad(secs % 60);

  const textColor = dark ? 'text-white' : 'text-black';
  const boxBg = dark ? 'bg-white/10' : 'bg-black';
  const boxText = dark ? 'text-white' : 'text-white';

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-semibold ${dark ? 'text-white/60' : 'text-[#999]'}`}>{label}</span>
      <div className="flex items-center gap-1">
        {[h, m, s].map((val, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className={`${boxBg} ${boxText} font-black text-sm px-2 py-1 rounded font-mono min-w-[32px] text-center`}>
              {val}
            </span>
            {i < 2 && <span className={`font-black text-sm ${textColor}`}>:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
