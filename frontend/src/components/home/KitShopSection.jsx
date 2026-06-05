import { useState } from 'react';
import { TabFilter } from '../ui';

const KITS = [
  { type: 'home', label: 'Home Kit', color: '#6C1D45', accent: '#F5C842', description: 'Claret & Blue — Season 2024/25', image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400' },
  { type: 'away', label: 'Away Kit', color: '#1a1a2e', accent: '#ffffff', description: 'Dark Navy — Season 2024/25', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
  { type: 'third', label: 'Third Kit', color: '#0f4c75', accent: '#F5C842', description: 'Royal Blue — Season 2024/25', image: 'https://images.unsplash.com/photo-1562751362-404243064652?w=400' },
];

const KIT_TABS = KITS.map((k) => ({ value: k.type, label: k.label }));

const KitShopSection = () => {
  const [active, setActive] = useState('home');
  const kit = KITS.find((k) => k.type === active);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text side */}
        <div>
          <p className="text-claret-400 text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Castore × Burnley FC</p>
          <h2 className="section-title mb-6">Season 24/25<br />Kit Collection</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            Wear your colours. Every stitch tells the story of 140 years of Burnley Football Club.
            Available now in the official Burnley FC store.
          </p>

          <TabFilter tabs={KIT_TABS} active={active} onChange={setActive} className="mb-8" />

          <div className="border-l-2 border-claret-800 pl-5 mb-8">
            <p className="font-display text-2xl text-white uppercase tracking-widest">{kit.label}</p>
            <p className="text-white/40 text-sm mt-1">{kit.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="https://shop.burnleyfc.com" target="_blank" rel="noreferrer"
              className="btn-claret">
              Buy Now
            </a>
            <a href="https://shop.burnleyfc.com" target="_blank" rel="noreferrer"
              className="btn-outline">
              Personalise
            </a>
          </div>
        </div>

        {/* Image side */}
        <div className="relative">
          <div className="absolute inset-0 bg-claret-gradient opacity-10 rounded-full blur-3xl scale-110" />
          <div className="relative aspect-square overflow-hidden bg-dark-700">
            <img
              key={kit.type}
              src={kit.image}
              alt={kit.label}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="bg-dark-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 uppercase tracking-widest font-semibold">
                2024/25 {kit.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitShopSection;
