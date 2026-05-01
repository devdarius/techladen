import Link from 'next/link';
import { Magnet, Smartphone, Zap, Cable, Shield, Battery, Gamepad2, Watch, Headphones } from 'lucide-react';

const CATEGORIES = [
  { name: 'MagSafe',    href: '/?kategorie=MagSafe',    desc: 'Kabellos laden',   icon: Magnet },
  { name: 'Hüllen',     href: '/?kategorie=Hüllen',     desc: 'Schutz & Style',   icon: Smartphone },
  { name: 'Ladegeräte', href: '/?kategorie=Ladegeräte', desc: 'GaN Schnellladen', icon: Zap },
  { name: 'Kabel',      href: '/?kategorie=Kabel',      desc: 'USB-C & mehr',     icon: Cable },
  { name: 'Schutzglas', href: '/?kategorie=Schutzglas', desc: '9H Härtegrad',     icon: Shield },
  { name: 'Powerbanks', href: '/?kategorie=Powerbanks', desc: 'Bis 20.000 mAh',   icon: Battery },
  { name: 'Gaming',     href: '/?kategorie=Gaming',     desc: 'Mobile Gaming',    icon: Gamepad2 },
  { name: 'Smartwatch', href: '/?kategorie=Smartwatch', desc: 'Bänder & Zubehör', icon: Watch },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-[#F8FAFF] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-[#2563EB] mb-3">Sortiment</p>
          <h2 className="font-display text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
            Was suchst du?
          </h2>
          <p className="text-[#64748B] mt-2 text-base">Entdecke unsere kuratierten Kategorien</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map(({ name, href, desc, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className="group flex items-center gap-4 bg-white border border-[#E2E8F0] rounded-xl p-4 transition-colors hover:border-[#2563EB] hover:bg-[#F8FAFF]"
            >
              <div className="w-10 h-10 bg-[#F1F5FF] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB] transition-colors">
                <Icon className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-[#0F172A] text-sm leading-tight group-hover:text-[#2563EB] transition-colors">
                  {name}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
