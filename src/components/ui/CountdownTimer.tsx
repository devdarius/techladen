'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface Props {
  label?: string;
  dark?: boolean;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function CountdownTimer({ label = 'Angebot endet in:', dark = false }: Props) {
  const [secs, setSecs] = useState(getSecondsUntilMidnight());

  useEffect(() => {
    const iv = setInterval(() => setSecs(getSecondsUntilMidnight()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  const units = [
    { val: pad(h), label: 'Std' },
    { val: pad(m), label: 'Min' },
    { val: pad(s), label: 'Sek' },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        <Timer className="w-3.5 h-3.5 text-amber-500" />
        {label}
      </div>
      <div className="flex items-center gap-1">
        {units.map(({ val, label: ul }, i) => (
          <div key={ul} className="flex items-center gap-1">
            <div className={`flex flex-col items-center ${dark ? 'bg-white/10 border border-white/20' : 'bg-amber-50 border border-amber-200'} rounded-lg px-2.5 py-1.5 min-w-[40px]`}>
              <span className={`font-black text-base font-mono leading-none ${dark ? 'text-amber-300' : 'text-amber-700'}`}>{val}</span>
              <span className={`text-[9px] font-semibold mt-0.5 ${dark ? 'text-slate-500' : 'text-amber-500'}`}>{ul}</span>
            </div>
            {i < 2 && <span className={`font-black text-lg ${dark ? 'text-slate-600' : 'text-amber-400'}`}>:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
