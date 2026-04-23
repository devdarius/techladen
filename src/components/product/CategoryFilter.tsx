'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  categories: string[];
  active: string;
}

export default function CategoryFilter({ categories, active }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'Alle') {
      params.delete('kategorie');
    } else {
      params.set('kategorie', cat);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            active === cat
              ? 'text-black'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
          style={active === cat ? { backgroundColor: '#00D4FF' } : {}}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
