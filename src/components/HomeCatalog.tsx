import React, { useState } from 'react';
import { Product, MerchantSettings } from '../types';

interface HomeCatalogProps {
  products: Product[];
  merchantSettings: MerchantSettings;
  onSelectProduct: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
  onTriggerOrder: (product: Product) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeCatalog: React.FC<HomeCatalogProps> = ({
  products,
  merchantSettings,
  onSelectProduct,
  onOpenQuickView,
  onTriggerOrder,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Products (সকল)', icon: 'tune' },
    { id: 'lips', label: 'Lipsticks & Lip Care' },
    { id: 'face', label: 'Foundation & Face' },
    { id: 'eyes', label: 'Eyes & Palettes' },
    { id: 'skincare', label: 'Skincare & Cleansers' },
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.bengaliTitle && prod.bengaliTitle.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const cleanPhone = merchantSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Value Proposition Ticker / Trust Banner */}
      <div className="w-full bg-[#eaedff] px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shadow-xs border-b border-[#dae2fd]">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="material-symbols-outlined text-[#006d2f] text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold">
            সহজ অর্ডার মেসেজে
          </span>
        </div>
        <span className="text-[#bdc9c5]">•</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="material-symbols-outlined text-[#00685d] text-sm">
            local_shipping
          </span>
          <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold">
            ক্যাশ অন ডেলিভারি
          </span>
        </div>
        <span className="text-[#bdc9c5]">•</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className="material-symbols-outlined text-[#006d2f] text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="font-label-sm text-[11px] text-[#131b2e] font-semibold">
            ১০০% আসল ও অরিজিনাল কসমেটিকস
          </span>
        </div>
      </div>

      {/* Hero Presentation Section */}
      <section className="px-4 pt-4 pb-2">
        <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#00685d] via-[#18675d] to-[#008376] text-white p-4 sm:p-6 shadow-md overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 pointer-events-none blur-2xl"></div>
          <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-white">
              local_mall
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-1">
            <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white">
              <span className="w-2 h-2 rounded-full bg-[#66ff8e] animate-pulse"></span>
              <span className="font-label-sm text-[11px] font-semibold tracking-wide uppercase">
                NJ Makeup Store BD
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-[24px] sm:text-[28px] text-white font-bold mt-1.5 leading-tight">
              100% Authentic Makeup & Cosmetics BD
            </h1>
            <p className="font-body-sm text-[13px] text-[#f4fffb] opacity-95 max-w-sm mt-0.5">
              Direct ordering via WhatsApp • Cash on Delivery across Bangladesh
              (সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি)
            </p>
          </div>

          <div className="relative z-10 pt-4 flex flex-wrap items-center gap-2">
            <a
              className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-full bg-white text-[#00685d] font-label-lg text-sm font-bold shadow-sm active:scale-95 hover:bg-[#f4fffb] transition-all cursor-pointer"
              href="#product-catalog"
            >
              <span>Shop Now</span>
              <span className="material-symbols-outlined text-base">arrow_downward</span>
            </a>
            <a
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#5dfd8a]/25 text-white backdrop-blur-sm hover:bg-[#5dfd8a]/40 active:scale-95 transition-all font-label-sm text-[12px] font-semibold border border-white/20"
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span
                className="material-symbols-outlined text-base text-[#66ff8e]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
              <span>Help {merchantSettings.displayPhone}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Category Filter Chips */}
      <section className="w-full pt-1 pb-2">
        <div className="flex items-center justify-between px-4 mb-2">
          <span className="font-label-sm text-[11px] font-bold text-[#3d4946] uppercase tracking-wider">
            Browse Categories
          </span>
          <span className="font-label-sm text-[11px] text-[#00685d] font-semibold">
            {filteredProducts.length} Items
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 no-scrollbar pb-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-btn px-3.5 py-1.5 rounded-full font-label-sm text-[12px] whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#00685d] text-white shadow-sm'
                    : 'bg-[#eaedff] text-[#3d4946] hover:bg-[#e2e7ff]'
                }`}
              >
                {cat.icon && (
                  <span className="material-symbols-outlined text-xs">{cat.icon}</span>
                )}
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section className="px-4 pt-1 pb-4" id="product-catalog">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-headline-sm text-base text-[#131b2e] font-bold">
            Featured Catalog
          </h2>
          <div className="flex items-center gap-1.5 text-[#006d2f] font-label-sm text-[11px] font-medium bg-[#5dfd8a]/20 px-2 py-0.5 rounded-full border border-[#5dfd8a]/40">
            <span className="w-2 h-2 rounded-full bg-[#006d2f] animate-pulse"></span>
            Fast Dispatch
          </div>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-2 gap-3 w-full" id="product-list">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="product-item flex flex-col justify-between bg-white rounded-xl shadow-sm p-2.5 overflow-hidden transition-all hover:shadow-md border border-[#eaedff] hover:border-[#bdc9c5]"
            >
              <div>
                {/* Product Image Frame */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative w-full aspect-square rounded-lg bg-[#eaedff] overflow-hidden group cursor-pointer"
                >
                  <img
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={product.image}
                  />
                  {product.inStock && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#5dfd8a] text-[#007232] font-label-sm text-[10px] font-bold shadow-xs">
                      {product.isLowStock
                        ? `Low Stock (${product.stockCount || 2})`
                        : 'In Stock'}
                    </span>
                  )}
                  {/* Quick View Button */}
                  <button
                    aria-label="Quick View"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickView(product);
                    }}
                    className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 text-[#131b2e] flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </div>

                {/* Metadata */}
                <div className="pt-2 flex flex-col gap-0.5">
                  <span className="font-label-sm text-[10px] text-[#18675d] uppercase font-semibold tracking-wider">
                    {product.categoryLabel}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-headline-sm text-[14px] text-[#131b2e] font-semibold line-clamp-1 hover:text-[#00685d] cursor-pointer transition-colors"
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 text-[#3d4946] font-label-sm text-[11px]">
                    <span
                      className="material-symbols-outlined text-xs text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-bold text-[#131b2e]">{product.rating}</span>
                    <span className="text-[#6d7a77]">({product.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="pt-2 mt-auto flex flex-col gap-1.5">
                <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#5dfd8a]/20 text-[#006d2f] w-fit">
                  <span className="font-headline-sm text-sm font-bold">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>
                <button
                  aria-label={`Order ${product.title} on WhatsApp`}
                  onClick={() => onTriggerOrder(product)}
                  className="w-full py-2 px-2 rounded-lg bg-[#006d2f] hover:bg-[#005322] active:scale-95 text-white font-label-sm text-[12px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    chat
                  </span>
                  <span>Order</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Value Proposition Highlight Cards */}
      <section className="px-4 py-2">
        <div className="rounded-2xl bg-[#e2e7ff] p-4 flex flex-col gap-3 border border-[#dae2fd]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00685d] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-xl">forum</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-headline-sm text-base text-[#131b2e] font-bold">
                সরাসরি হোয়াটসঅ্যাপে অর্ডার
              </h4>
              <p className="font-body-sm text-[12px] text-[#3d4946]">
                No complex registration or forgotten passwords. Just chat and confirm delivery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-xs border border-[#eaedff]">
              <span className="material-symbols-outlined text-[#006d2f] text-lg">
                local_shipping
              </span>
              <span className="font-label-lg text-[13px] text-[#131b2e] font-bold">
                ডেলিভারি চার্জ
              </span>
              <span className="font-body-sm text-[11px] text-[#3d4946]">
                Dhaka: ৳{merchantSettings.deliveryInsideDhaka} • Nationwide: ৳
                {merchantSettings.deliveryOutsideDhaka}
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-xs border border-[#eaedff]">
              <span className="material-symbols-outlined text-[#18675d] text-lg">
                payments
              </span>
              <span className="font-label-lg text-[13px] text-[#131b2e] font-bold">
                ক্যাশ অন ডেলিভারি
              </span>
              <span className="font-body-sm text-[11px] text-[#3d4946]">
                Pay after checking your parcel
              </span>
            </div>
          </div>

          {/* Quick Track Order CTA */}
          <button
            onClick={() => onNavigateTab('tracking')}
            className="w-full py-2.5 px-3 bg-white hover:bg-[#faf8ff] text-[#00685d] rounded-xl border border-[#dae2fd] font-label-md text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs mt-1"
          >
            <span className="material-symbols-outlined text-base text-[#006d2f]">
              local_shipping
            </span>
            <span>Track Live Order Status (পার্সেল ট্র্যাকিং করুন)</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </section>


      {/* Informative Boutique Footer */}
      <footer className="mt-4 px-4 pt-6 pb-8 bg-[#eaedff] rounded-t-3xl flex flex-col gap-4 border-t border-[#dae2fd]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#00685d] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-xs">shopping_bag</span>
            </div>
            <span className="font-headline-sm text-base text-[#00685d] font-bold">
              {merchantSettings.storeName}
            </span>
            <span className="font-label-sm text-[11px] text-[#3d4946]">
              | {merchantSettings.storeBengaliName}
            </span>
          </div>
          <p className="font-body-sm text-[12px] text-[#3d4946] mt-0.5">
            Curated lifestyle crafts, pure groceries & traditional apparel delivered
            reliably to your doorstep.
          </p>
        </div>

        {/* Contact & Store Info */}
        <div className="flex flex-col gap-2.5 bg-white p-3.5 rounded-xl shadow-xs border border-[#eaedff]">
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-2 text-[#131b2e] hover:text-[#00685d] transition-colors"
          >
            <span className="material-symbols-outlined text-[#006d2f] text-base">
              call
            </span>
            <span className="font-label-lg text-[13px] font-semibold">
              {merchantSettings.displayPhone} (Hotline & WhatsApp)
            </span>
          </a>
          <div className="flex items-center gap-2 text-[#3d4946]">
            <span className="material-symbols-outlined text-base">pin_drop</span>
            <span className="font-body-sm text-[12px]">
              {merchantSettings.storeAddress}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#3d4946]">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span className="font-body-sm text-[12px]">
              Customer Care: {merchantSettings.customerCareHours}
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 pt-1 font-label-sm text-[11px] text-[#3d4946]">
          <button
            onClick={() => onNavigateTab('wa-help')}
            className="hover:text-[#00685d] transition-colors cursor-pointer"
          >
            Delivery Terms & Conditions
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateTab('wa-help')}
            className="hover:text-[#00685d] transition-colors cursor-pointer"
          >
            Exchange Policy
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateTab('tracking')}
            className="hover:text-[#00685d] font-bold text-[#00685d] transition-colors cursor-pointer"
          >
            Track Order (ট্র্যাকিং)
          </button>
          <span>•</span>
          <button
            onClick={() => onNavigateTab('admin')}
            className="hover:text-[#00685d] font-bold text-[#00685d] transition-colors cursor-pointer"
          >
            Merchant Portal
          </button>

        </div>

        <div className="text-center font-label-sm text-[11px] text-[#6d7a77] pt-1">
          © 2025 Emerald Shop Bangladesh. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
