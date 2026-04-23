'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, RotateCcw, Truck, Star, Zap } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';

const TRUST = [
  { icon: Truck,       label: 'Schnelle Lieferung' },
  { icon: RotateCcw,   label: '14 Tage Rückgabe' },
  { icon: ShieldCheck, label: 'Sichere Zahlung' },
  { icon: Star,        label: 'Trusted Shop' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #4F46E5 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            {/* Flash sale badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5" />
              Flash Sale — Bis zu 40% Rabatt
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.08] mb-5">
              Premium<br />
              <span className="gradient-text">Handy-Zubehör</span><br />
              <span className="text-slate-900">für Deutschland</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-6 max-w-lg">
              Hochwertige MagSafe-Produkte, Ladegeräte und Hüllen. Geprüfte Qualität, faire Preise — direkt zu dir nach Hause.
            </p>

            {/* Countdown */}
            <div className="mb-7">
              <CountdownTimer label="Sale endet in:" />
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {TRUST.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                  <Icon className="w-3.5 h-3.5 text-emerald-500" />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn-cta px-7 py-3.5 text-base gap-2">
                Jetzt shoppen <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/?kategorie=MagSafe" className="btn-primary px-7 py-3.5 text-base gap-2">
                MagSafe entdecken
              </Link>
            </div>

            {/* Social proof numbers */}
            <div className="flex gap-6 mt-8 pt-6 border-t border-slate-100">
              {[
                { value: '15.000+', label: 'Kunden' },
                { value: '4.8★', label: 'Bewertung' },
                { value: '99%', label: 'Zufrieden' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-xl font-extrabold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — product showcase */}
          <div className="relative">
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { seed: 'magsafe1', label: 'MagSafe Ladegerät', price: '24,99 €', badge: 'Bestseller', badgeColor: 'bg-indigo-600' },
                  { seed: 'case2',    label: 'iPhone 15 Hülle',   price: '12,99 €', badge: 'Neu',        badgeColor: 'bg-emerald-600' },
                  { seed: 'cable3',   label: 'USB-C Kabel 2m',    price: '7,99 €',  badge: '-30%',       badgeColor: 'bg-red-500' },
                  { seed: 'power4',   label: 'Powerbank 20000',   price: '29,99 €', badge: 'Top',        badgeColor: 'bg-amber-500' },
                ].map(({ seed, label, price, badge, badgeColor }, i) => (
                  <div
                    key={seed}
                    className={`bg-white rounded-2xl p-4 shadow-md border border-white/80 ${i === 1 ? 'mt-4' : ''} ${i === 3 ? '-mt-4' : ''}`}
                  >
                    <div className="relative aspect-square bg-slate-50 rounded-xl mb-3 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${seed}/200/200`}
                        alt={label}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-2 left-2 ${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-md`}>
                        {badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">{label}</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{price}</p>
                  </div>
                ))}
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg pulse-soft">
                Sale läuft!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
