import React from 'react';
import { Product } from '../types';

interface CategoriesViewProps {
  products: Product[];
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  onSelectCategory,
  onSelectProduct,
}) => {
  const categoriesList = [
    {
      id: 'lips',
      title: 'Lipsticks & Lip Care',
      bengaliTitle: 'লিপস্টিক ও লিপ কেয়ার কালেকশন',
      description: 'Long-lasting matte inks, hydrating balms, and pigmented liquid lipsticks from top global brands.',
      image:
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      icon: 'palette',
    },
    {
      id: 'face',
      title: 'Foundation, Concealer & Face',
      bengaliTitle: 'ফাউন্ডেশন, কনসিলার ও ফেস পাউডার',
      description: 'Flawless coverage liquid bases, lightweight mousse foundations, highlighters and correctors.',
      image:
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      icon: 'face_retouching_natural',
    },
    {
      id: 'eyes',
      title: 'Eyeshadow & Eye Makeup',
      bengaliTitle: 'আইশ্যাডো প্যালেট, মাশকারা ও লাইনার',
      description: 'Vibrant and buttery matte & shimmer palettes, waterproof liners and lash volume essentials.',
      image:
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      icon: 'visibility',
    },
    {
      id: 'skincare',
      title: 'Skincare & Cleansers',
      bengaliTitle: 'ফেস ওয়াশ, সিরাম ও ময়েশ্চারাইজার',
      description: 'Dermatologist-recommended hydrating cleansers, barrier repair lotions and sunblocks.',
      image:
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      icon: 'spa',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Category Header */}
      <section className="px-4 pt-4 pb-2">
        <div className="bg-[#eaedff] rounded-2xl p-4 border border-[#dae2fd]">
          <span className="font-label-sm text-[11px] text-[#00685d] font-bold uppercase tracking-wider">
            Explore Collections
          </span>
          <h1 className="font-headline-lg-mobile text-xl text-[#131b2e] font-bold mt-1">
            Makeup & Beauty Departments
          </h1>
          <p className="font-body-sm text-[12px] text-[#3d4946] mt-1">
            Browse through 100% authentic cosmetics, dermatologist-approved skincare, and glamour essentials.
          </p>
        </div>
      </section>

      {/* Categories Cards */}
      <section className="px-4 py-2 flex flex-col gap-4">
        {categoriesList.map((cat) => {
          const categoryProducts = products.filter((p) => p.category === cat.id);
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5dfd8a]/20 text-[#006d2f] flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-base text-[#131b2e] font-bold">
                      {cat.title}
                    </h2>
                    <span className="font-label-sm text-[11px] text-[#18675d]">
                      {cat.bengaliTitle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="px-3 py-1 bg-[#eaedff] hover:bg-[#dae2fd] text-[#00685d] rounded-full font-label-sm text-[11px] font-bold transition-colors cursor-pointer"
                >
                  View All ({categoryProducts.length})
                </button>
              </div>

              <p className="font-body-sm text-[12px] text-[#3d4946]">
                {cat.description}
              </p>

              {/* Horizontal Product Preview row */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
                {categoryProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="flex-shrink-0 w-28 bg-[#faf8ff] rounded-xl p-2 border border-[#eaedff] hover:border-[#bdc9c5] cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-headline-sm text-[12px] text-[#131b2e] line-clamp-1 font-semibold">
                      {p.title}
                    </span>
                    <span className="font-label-sm text-[11px] text-[#006d2f] font-bold">
                      ৳{p.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
