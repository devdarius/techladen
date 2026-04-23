import Link from 'next/link';
import { ArrowRight, ShieldCheck, RotateCcw, Truck, Star, Zap, ChevronRight } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';

const STATS = [
  { value: '15.000+', label: 'Kunden' },
  { value: '4.8 / 5', label: 'Bewertung' },
  { value: '99%',     label: 'Zufrieden' },
];

const TRUST = [
  { icon: Truck,       label: 'Schnelle Lieferung' },
  { icon: RotateCcw,   label: '14 Tage Rückgabe' },
  { icon: ShieldCheck, label: 'Sichere Zahlung' },
  { icon: Star,        label: 'Trusted Shop' },
];

const FEATURED = [
  { seed: 'magsafe1', label: 'MagSafe Ladegerät', price: '24,99 €', badge: 'Bestseller', color: 'bg-indigo-600' },
  { seed: 'case2',    label: 'iPhone 15 Hülle',   price: '12,99 €', badge: 'Neu',        color: 'bg-emerald-600' },
  { seed: 'cable3',   label: 'USB-C Kabel 2m',    price: '7,99 €',  badge: '-30%',       color: 'bg-red-500' },
  { seed: 'power4',   label: 'Powerbank 20000',   price: '29,99 €', badge: 'Top',        color: 'bg-amber-500' },
];

export default function HeroSection() {
  return (
    <section className="hero-dark relative overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* ── LEFT ── */}
          <div className="slide-up">
            {/* Flash sale pill */}
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              Flash Sale — Bis zu 40% Rabatt
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.04] tracking-tight mb-6">
              Premium<br />
              <span className="gradient-text">Handy-</span><br />
              <span className="gradient-text">Zubehör</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-6 max-w-md">
              Geprüfte MagSafe-Produkte, GaN-Ladegeräte und Hüllen — direkt zu dir. Faire Preise, schnelle Lieferung.
            </p>

            {/* Countdown */}
            <div className="mb-8">
              <CountdownTimer label="Sale endet in:" dark />
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {TRUST.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link href="/#produkte" className="btn-cta px-8 py-4 text-base">
                Jetzt shoppen <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/?kategorie=MagSafe"
                className="inline-flex items-center gap-2 px-7 py-4 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all">
                MagSafe <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6 border-t border-white/10">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — product grid ── */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {FEATURED.map(({ seed, label, price, badge, color }, i) => (
                <div
                  key={seed}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 ${i % 2 === 1 ? 'mt-6' : ''}`}
                >
                  <div className="relative aspect-square bg-white/5 rounded-xl mb-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://picsum.photos/seed/${seed}/200/200`} alt={label}
                      className="w-full h-full object-cover opacity-90" />
                    <span className={`absolute top-2 left-2 ${color} text-white text-[10px] font-bold px-2 py-0.5 rounded-md`}>
                      {badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300 line-clamp-1">{label}</p>
                  <p className="text-sm font-black text-white mt-0.5">{price}</p>
                </div>
              ))}
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl pulse-soft">
              Sale läuft!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
