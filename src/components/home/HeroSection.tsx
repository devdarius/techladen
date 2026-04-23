import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-[#999] mb-5">
              Premium Handy-Zubehör
            </p>
            <h1 className="text-5xl lg:text-6xl font-black text-black leading-[1.05] tracking-tight mb-6">
              Das Beste<br />für dein<br />Smartphone.
            </h1>
            <p className="text-base text-[#666] leading-relaxed mb-8 max-w-sm">
              Geprüfte Qualität. Faire Preise. Schnelle Lieferung direkt nach Deutschland.
            </p>

            <div className="mb-8">
              <CountdownTimer label="Flash Sale endet in:" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/#produkte"
                className="inline-flex items-center gap-2 bg-black text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#222] transition-colors text-sm">
                Jetzt shoppen <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/?kategorie=MagSafe"
                className="inline-flex items-center gap-2 border border-[#E8E8E8] text-black font-semibold px-7 py-3.5 rounded-lg hover:bg-[#F7F7F7] transition-colors text-sm">
                MagSafe
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-[#E8E8E8]">
              {[
                { v: '15.000+', l: 'Kunden' },
                { v: '4.8 / 5', l: 'Bewertung' },
                { v: '14 Tage', l: 'Rückgabe' },
              ].map(({ v, l }) => (
                <div key={l}>
                  <p className="text-xl font-black text-black">{v}</p>
                  <p className="text-xs text-[#999] mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — clean product grid */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            {[
              { seed: 'magsafe1', label: 'MagSafe Ladegerät', price: '24,99 €', tag: 'Bestseller' },
              { seed: 'case2',    label: 'iPhone 15 Hülle',   price: '12,99 €', tag: 'Neu' },
              { seed: 'cable3',   label: 'USB-C Kabel 2m',    price: '7,99 €',  tag: '-30%' },
              { seed: 'power4',   label: 'Powerbank 20000',   price: '29,99 €', tag: 'Top' },
            ].map(({ seed, label, price, tag }, i) => (
              <div key={seed}
                className={`bg-[#F7F7F7] rounded-xl p-4 border border-[#E8E8E8] ${i % 2 === 1 ? 'mt-5' : ''}`}>
                <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/seed/${seed}/200/200`} alt={label}
                    className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {tag}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#333] line-clamp-1">{label}</p>
                <p className="text-sm font-black text-black mt-0.5">{price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
