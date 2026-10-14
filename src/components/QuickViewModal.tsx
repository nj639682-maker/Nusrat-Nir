import React from 'react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenOrder: (product: Product) => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onOpenOrder,
  onViewFullDetails,
}) => {
  if (!product) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3.5 border border-[#eaedff]"
      >
        <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
          <span className="font-label-sm text-[11px] text-[#00685d] font-bold uppercase tracking-wider">
            Product Highlights
          </span>
          <button
            aria-label="Close details"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] flex items-center justify-center text-[#131b2e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Thumbnail + info */}
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt={product.title}
            className="w-16 h-16 rounded-xl object-cover bg-[#eaedff] border border-[#eaedff]"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="font-headline-md text-base text-[#131b2e] font-bold truncate">
              {product.title}
            </h3>
            <span className="font-headline-sm text-[#006d2f] font-bold text-base">
              ৳{product.price.toLocaleString()}
            </span>
            <span className="font-label-sm text-[11px] text-[#18675d]">
              {product.categoryLabel}
            </span>
          </div>
        </div>

        <p className="font-body-md text-[13px] text-[#3d4946] leading-relaxed">
          {product.description}
        </p>

        {product.bengaliDesc && (
          <p className="font-body-sm text-[12px] text-[#18675d] bg-[#f2f3ff] p-2 rounded-lg">
            {product.bengaliDesc}
          </p>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenOrder(product);
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#006d2f] hover:bg-[#005322] text-white font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <span>Order This on WhatsApp</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onViewFullDetails(product);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#00685d] font-label-md text-[12px] font-semibold transition-colors cursor-pointer"
          >
            View Full Product Page & Specs
          </button>
        </div>
      </div>
    </div>
  );
};
