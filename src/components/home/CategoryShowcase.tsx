import Link from 'next/link';

const CATEGORIES = [
  { name: 'MagSafe',    href: '/?kategorie=MagSafe',    desc: 'Kabellos laden' },
  { name: 'Hüllen',     href: '/?kategorie=Hüllen',     desc: 'Schutz & Style' },
  { name: 'Ladegeräte', href: '/?kategorie=Ladegeräte', desc: 'GaN Schnellladen' },
  { name: 'Kabel',      href: '/?kategorie=Kabel',      desc: 'USB-C & mehr' },
  { name: 'Schutzglas', href: '/?kategorie=Schutzglas', desc: '9H Härtegrad' },
  { name: 'Powerbanks', href: '/?kategorie=Powerbanks', desc: 'Bis 20.000 mAh' },
  { name: 'Gaming',     href: '/?kategorie=Gaming',     desc: 'Mobile Gaming' },
  { name: 'Smartwatch', href: '/?kategorie=Smartwatch', desc: 'Bänder & Zubehör' },
];

export default function CategoryShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <p className="text-xs font-bold tracking-[3px] uppercase text-[#999] mb-2">Sortiment</p>
      <h2 className="text-2xl font-black text-black mb-8">Alle Kategorien</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(({ name, href, desc }) => (
          <Link key={name} href={href}
            className="group border border-[#E8E8E8] rounded-xl p-5 hover:border-black hover:bg-[#F7F7F7] transition-all duration-150">
            <p className="font-bold text-sm text-black mb-1">{name}</p>
            <p className="text-xs text-[#999] group-hover:text-[#666] transition-colors">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
