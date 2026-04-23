import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

const HERO_IMAGES = [
  'https://picsum.photos/seed/case1/300/300',
  'https://picsum.photos/seed/cable1/300/300',
  'https://picsum.photos/seed/charger1/300/300',
  'https://picsum.photos/seed/power1/300/300',
];

export default function HeroSection() {
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-red-50 border border-red-100 px-3 py-1.5 rounded-full mb-5">
            ⚡ Neu eingetroffen
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main leading-tight mb-4">
            Premium<br />
            <span className="text-primary">Handy-Zubehör</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-6 max-w-md">
            Hochwertige Hüllen, Ladegeräte und Kabel für dein Smartphone. Schnelle Lieferung, faire Preise.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['Schnelle Lieferung', '14 Tage Rückgabe', 'Sichere Zahlung'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-success flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>

          <Link
            href="/#produkte"
            className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 text-base"
          >
            Jetzt shoppen <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Right — 2x2 image grid */}
        <div className="grid grid-cols-2 gap-3">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={i}
              className={`relative aspect-square bg-surface rounded-card overflow-hidden border border-border shadow-card ${
                i % 2 === 0 ? 'mt-0' : 'mt-4'
              }`}
            >
              <Image
                src={src}
                alt={`Produkt ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
