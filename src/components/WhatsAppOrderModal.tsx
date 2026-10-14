import React from 'react';
import { Product, MerchantSettings, Order, AuthUser } from '../types';

interface WhatsAppOrderModalProps {
  product: Product | null;
  merchantSettings: MerchantSettings;
  onClose: () => void;
  onOrderCreated?: (order: Order) => void;
  currentUser?: AuthUser | null;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  product,
  merchantSettings,
  onClose,
  onOrderCreated,
  currentUser,
}) => {
  if (!product) return null;

  const cleanPhone = merchantSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const productUrl = `${window.location.origin}/product/${product.id}`;
  const generatedOrderId = `NJ-${Math.floor(1000 + Math.random() * 9000)}`;

  const customerName = currentUser?.name || 'Customer';
  const customerPhone = currentUser?.phone || '01712-345678';
  const customerAddress = currentUser?.address || 'Dhaka, Bangladesh';

  const message = `Hello ${merchantSettings.storeName}! I would like to place an order.\n\nOrder ID: #${generatedOrderId}\nProduct: ${product.title}\nPrice: ৳${product.price.toLocaleString()}\nDelivery Charge: ৳${merchantSettings.deliveryInsideDhaka}\nTotal COD: ৳${(product.price + merchantSettings.deliveryInsideDhaka).toLocaleString()}\nProduct Link: ${productUrl}\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\n\nPlease confirm availability and delivery schedule!`;
  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

  const handleLaunchWhatsApp = () => {
    if (onOrderCreated) {
      const newOrder: Order = {
        id: generatedOrderId,
        createdAt: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        customerName,
        customerPhone,
        customerAddress,
        productId: product.id,
        productTitle: product.title,
        productImage: product.image,
        price: product.price,
        deliveryCharge: merchantSettings.deliveryInsideDhaka,
        totalAmount: product.price + merchantSettings.deliveryInsideDhaka,
        status: 'placed',
        estimatedDeliveryDate: 'Within 24 to 48 Hours',
        notes: 'Order initiated via WhatsApp storefront.',
      };
      onOrderCreated(newOrder);
    }
    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3.5 transform transition-transform border border-[#eaedff]"
      >
        <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#006d2f] flex items-center justify-center text-white shadow-xs">
              <span
                className="material-symbols-outlined text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-sm text-[#131b2e] font-bold leading-tight">
                Emerald Helpdesk
              </h3>
              <span className="font-label-sm text-[11px] text-[#006d2f] font-medium">
                {merchantSettings.displayPhone} • Online
              </span>
            </div>
          </div>
          <button
            aria-label="Close dialog"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] flex items-center justify-center text-[#131b2e] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="bg-[#f2f3ff] rounded-xl p-3 flex flex-col gap-2 border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[10px] text-[#3d4946] uppercase font-bold tracking-wider">
              Preview Generated WhatsApp Message
            </span>
            <span className="font-mono text-[10px] text-[#00685d] font-bold">
              #{generatedOrderId}
            </span>
          </div>
          <div className="bg-white p-3 rounded-lg text-[#131b2e] font-mono text-[11px] leading-relaxed shadow-2xs border border-[#eaedff] whitespace-pre-line max-h-48 overflow-y-auto">
            {message}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={handleLaunchWhatsApp}
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#128C7E] active:scale-[0.98] text-white font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
            <span>Open in WhatsApp App (অর্ডার পাঠান)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] font-label-sm text-[12px] font-semibold transition-colors cursor-pointer"
          >
            Cancel & Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
