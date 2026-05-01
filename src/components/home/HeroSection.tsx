import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, ShieldCheck, RefreshCcw, Star, Percent } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';

const STATS = [
  { value: '10.000+', label: 'Kunden' },
  { value: '4,9 / 5', label: 'Trustpilot' },
  { value: '3–7 Tage', label: 'Lieferzeit' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(150deg, #FFFFFF 0%, #F0F7FF 40%, #F5F0FF 100%)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT SIDE ── */}
          <div>
            {/* Label */}
            <p className="text-xs font-bold tracking-widest uppercase text-[#2563EB] mb-3">
              Flash Sale · Heute
            </p>

            {/* Headline */}
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-black text-[#0F172A] leading-[1.04] tracking-tight mb-5">
              Das Beste<br />
              für dein{' '}
              <span className="gradient-text">iPhone</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#64748B] text-lg leading-relaxed mb-6 max-w-lg">
              Premium-Zubehör für dein Smartphone — MagSafe, Hüllen, Ladegeräte und mehr.
              Schnelle Lieferung direkt nach Deutschland
            </p>

            {/* Countdown */}
            <div className="mb-7">
              <CountdownTimer label="Flash Sale endet in:" />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/#produkte" className="btn-primary px-7 py-3.5 text-base">
                Jetzt shoppen <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/?badge=Angebote" className="btn-secondary px-7 py-3.5 text-base">
                <Percent className="w-4 h-4" /> Sale Angebote
              </Link>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#2563EB]" /> Schneller Versand
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> Sicherer Checkout
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCcw className="w-4 h-4 text-[#2563EB]" /> 30 Tage Rückgabe
              </span>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-[#E2E8F0]">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-black text-[#0F172A]">{value}</p>
                  <p className="text-xs text-[#94A3B8] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT SIDE — Product showcase ── */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-md">

                {/* Product image */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-5 bg-[#F8FAFF]">
                  <Image
                    src="/hero-product.png"
                    alt="Premium Smartphone Zubehör — MagSafe, Hüllen, Kabel"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 0px, 400px"
                  />
                  <span className="badge-new absolute top-3 left-3">NEU</span>
                </div>

                {/* Product info */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-display font-bold text-[#0F172A] text-base leading-tight">
                      Pro Wireless Charger 3-in-1
                    </h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="stars text-sm">★★★★★</span>
                      <span className="text-xs text-[#64748B] font-medium">(4,9 · 2.847 Bewertungen)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-black text-[#0F172A]">€49,99</p>
                    <p className="price-original">€69,99</p>
                  </div>
                </div>

                {/* Add to cart mini button */}
                <button className="w-full mt-4 btn-primary py-3 text-sm">
                  In den Warenkorb <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
