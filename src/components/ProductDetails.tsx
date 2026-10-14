import React, { useState } from 'react';
import { Product, MerchantSettings, Order, AuthUser } from '../types';

interface ProductDetailsProps {
  product: Product;
  merchantSettings: MerchantSettings;
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
  onOrderCreated?: (order: Order) => void;
  currentUser?: AuthUser | null;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  merchantSettings,
  onBack,
  onNavigateTab,
  onOrderCreated,
  currentUser,
}) => {
  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[1]?.code || product.sizes[0]?.code : '40 (L)'
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'delivery' | 'care'>('specs');
  const [copyToast, setCopyToast] = useState(false);

  // Dynamic WhatsApp order message computation
  const cleanPhone = merchantSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const productUrl = `${window.location.origin}/product/${product.id}`;
  
  const sizeText = product.sizes && product.sizes.length > 0 ? ` (Shade/Size: ${selectedSize})` : '';
  const generatedOrderId = `NJ-${Math.floor(1000 + Math.random() * 9000)}`;

  const customerName = currentUser?.name || 'Customer';
  const customerPhone = currentUser?.phone || '01712-345678';
  const customerAddress = currentUser?.address || 'Dhaka, Bangladesh';

  const waMessage = `Hello ${merchantSettings.storeName}! I am interested in ordering this product.\nOrder ID: #${generatedOrderId}\nProduct: ${product.title}${sizeText}\nPrice: ৳${product.price.toLocaleString()}\nProduct Link: ${productUrl}\n\nPlease confirm availability and delivery schedule!`;
  const encodedWaMessage = encodeURIComponent(waMessage);
  const waOrderUrl = `https://wa.me/${cleanPhone}?text=${encodedWaMessage}`;

  const handleOrderClick = () => {
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
        productTitle: `${product.title}${sizeText}`,
        productImage: product.image,
        productSize: selectedSize,
        price: product.price,
        deliveryCharge: merchantSettings.deliveryInsideDhaka,
        totalAmount: product.price + merchantSettings.deliveryInsideDhaka,
        status: 'placed',
        estimatedDeliveryDate: 'Within 24 to 48 Hours',
        notes: `Order created from product page. Size: ${selectedSize}`,
      };
      onOrderCreated(newOrder);
    }
    window.open(waOrderUrl, '_blank');
  };


  const copyProductLink = () => {
    navigator.clipboard.writeText(productUrl).then(() => {
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    });
  };

  const calculateDiscountPercent = () => {
    if (!product.originalPrice || product.originalPrice <= product.price) return null;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const discountPercent = calculateDiscountPercent();

  return (
    <div className="flex flex-col w-full pb-36">
      {/* Breadcrumb Navigation */}
      <nav className="px-4 py-2.5 bg-[#faf8ff] flex items-center gap-1.5 text-[#3d4946] font-label-md text-[12px] overflow-x-auto whitespace-nowrap border-b border-[#eaedff]">
        <button
          onClick={onBack}
          className="hover:text-[#00685d] transition-colors cursor-pointer"
        >
          Home
        </button>
        <span className="material-symbols-outlined text-sm text-[#bdc9c5]">
          chevron_right
        </span>
        <button
          onClick={() => onNavigateTab('catalog')}
          className="hover:text-[#00685d] transition-colors cursor-pointer"
        >
          {product.categoryLabel}
        </button>
        <span className="material-symbols-outlined text-sm text-[#bdc9c5]">
          chevron_right
        </span>
        <span className="text-[#131b2e] font-semibold truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Product Image Gallery Section */}
      <section className="px-4 pt-3 flex flex-col gap-2.5">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#eaedff] shadow-sm border border-[#dae2fd]">
          {/* Main Active Image */}
          <img
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300"
            src={images[activeImageIndex] || product.image}
          />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
            {product.inStock && (
              <span className="bg-[#006d2f] text-white font-label-sm text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                In Stock (স্টকে আছে)
              </span>
            )}
            <span className="bg-white/90 backdrop-blur-md text-[#131b2e] font-label-sm text-[11px] px-2 py-1 rounded-full shadow-xs border border-white/40">
              SKU: {product.sku}
            </span>
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3">
            <button
              aria-label="Save to Wishlist"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#00685d] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/40"
            >
              <span
                className={`material-symbols-outlined text-xl transition-colors ${
                  isWishlisted ? 'text-[#ba1a1a]' : 'text-[#00685d]'
                }`}
                style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>

          {/* Carousel Progress Dot Pills */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeImageIndex === idx
                    ? 'w-6 bg-[#00685d]'
                    : 'w-1.5 bg-white/80'
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
            {images.slice(0, 4).map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-square rounded-xl overflow-hidden bg-[#eaedff] shadow-xs transition-all cursor-pointer border-2 ${
                  activeImageIndex === idx
                    ? 'border-[#00685d] scale-102 ring-2 ring-[#00685d]/20'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Product Title & Price Meta */}
      <section className="px-4 pt-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-amber-500 text-sm">
            <span
              className="material-symbols-outlined text-[17px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-label-lg text-sm font-bold text-[#131b2e] ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-[#3d4946] font-body-sm text-[12px]">
            • ({product.reviewsCount} verified customer reviews)
          </span>
        </div>

        <h1 className="font-headline-lg-mobile text-[22px] sm:text-[26px] text-[#131b2e] font-semibold tracking-tight leading-snug">
          {product.title}
        </h1>

        {product.bengaliTitle && (
          <span className="font-body-sm text-[13px] text-[#18675d] font-medium">
            {product.bengaliTitle}
          </span>
        )}

        {/* Price Section with Emerald Badge */}
        <div className="flex items-baseline gap-2 pt-1">
          <div className="flex items-center bg-[#5dfd8a]/25 px-3 py-1 rounded-full text-[#006d2f] border border-[#5dfd8a]/40">
            <span className="font-currency-display text-xl font-bold">
              ৳{product.price.toLocaleString()}
            </span>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-body-md text-sm text-[#6d7a77] line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
          {discountPercent && (
            <span className="bg-[#ffdad6] text-[#93000a] font-label-sm text-[11px] px-2 py-0.5 rounded-full font-bold">
              Save {discountPercent}%
            </span>
          )}
        </div>
      </section>

      {/* Size Selection (if product has sizes) */}
      {product.sizes && product.sizes.length > 0 && (
        <section className="px-4 pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-lg text-[13px] text-[#131b2e] font-semibold">
              Select Size (সাইজ নির্বাচন করুন):
            </span>
            <button
              onClick={() => {
                setActiveTab('specs');
                const el = document.getElementById('specs-container');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#00685d] font-label-md text-[12px] flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">straighten</span>
              Size Chart
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.sizes.map((s) => {
              const isSelected = selectedSize === s.code;
              return (
                <button
                  key={s.code}
                  onClick={() => setSelectedSize(s.code)}
                  className={`size-btn py-2.5 px-1 rounded-xl text-center font-label-lg transition-all shadow-xs flex flex-col items-center cursor-pointer border ${
                    isSelected
                      ? 'bg-[#00685d] text-white border-[#00685d] shadow-sm'
                      : 'bg-white text-[#131b2e] border-[#eaedff] hover:bg-[#eaedff]'
                  }`}
                >
                  <span className="text-sm font-bold">{s.code.split(' ')[0]}</span>
                  <span
                    className={`font-label-sm text-[10px] font-normal ${
                      isSelected ? 'text-white' : 'text-[#3d4946]'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Fabric & Spec Highlights Box */}
      <section className="px-4 pt-3">
        <div className="p-3 bg-[#f2f3ff] rounded-xl flex flex-col gap-2 border border-[#eaedff]">
          <div className="flex items-center gap-2 text-[#131b2e]">
            <span className="material-symbols-outlined text-[#00685d] text-lg">
              verified
            </span>
            <span className="font-body-sm text-[12px]">
              100% Breathable Combed Cotton (১০০% সুতি কাপড়)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#131b2e]">
            <span className="material-symbols-outlined text-[#00685d] text-lg">
              check_circle
            </span>
            <span className="font-body-sm text-[12px]">
              Structured Mandarin Band Collar with sleek stitching
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#131b2e]">
            <span className="material-symbols-outlined text-[#00685d] text-lg">
              diamond
            </span>
            <span className="font-body-sm text-[12px]">
              Custom engraved metallic antique buttons
            </span>
          </div>
        </div>
      </section>

      {/* Prominent WhatsApp Order Call-To-Action (Hero Card) */}
      <section className="px-4 pt-5 flex flex-col">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col gap-3.5 border border-[#eaedff]">
          {/* Agent status badge */}
          <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5dfd8a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#006d2f]"></span>
              </span>
              <span className="font-label-sm text-[11px] text-[#006d2f] font-bold">
                WhatsApp Helpline Active Now
              </span>
            </div>
            <span className="font-label-sm text-[10px] text-[#3d4946] bg-[#eaedff] px-2 py-0.5 rounded-full font-medium">
              Avg reply ~5 mins
            </span>
          </div>

          {/* Huge WhatsApp Primary Button */}
          <button
            type="button"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#128C7E] active:scale-[0.98] text-white rounded-xl font-headline-sm text-base font-bold flex items-center justify-center gap-2 shadow-[0_8px_18px_-4px_rgba(37,211,102,0.4)] transition-all cursor-pointer"
            onClick={handleOrderClick}
            id="whatsapp-order-btn"
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <span>Order on WhatsApp (হোয়াটসঅ্যাপে অর্ডার)</span>
          </button>


          {/* WhatsApp Live Message Preview Box */}
          <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-1.5 relative border border-[#eaedff]">
            <div className="flex items-center justify-between text-[#3d4946] font-label-sm text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-[#18675d]">
                <span className="material-symbols-outlined text-sm">outgoing_mail</span>
                Pre-filled Message Preview
              </span>
              <span className="text-[10px]">Tap send in chat</span>
            </div>
            <p className="font-body-sm text-[12px] text-[#131b2e] bg-white p-2.5 rounded-lg shadow-xs font-mono whitespace-pre-line leading-relaxed border border-[#eaedff]">
              {waMessage}
            </p>
          </div>

          {/* Trust & COD Reassurance */}
          <div className="flex items-start gap-2 p-3 bg-[#5dfd8a]/20 rounded-xl text-[#131b2e] border border-[#5dfd8a]/30">
            <span
              className="material-symbols-outlined text-[#006d2f] text-xl flex-shrink-0 mt-0.5"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-[12px] font-bold text-[#006d2f]">
                100% Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </span>
              <span className="font-body-sm text-[11px] text-[#3d4946] mt-0.5 leading-relaxed">
                No credit card or online payment needed. Discuss delivery address, size
                confirmation, and pay Cash on Delivery at your doorstep!
              </span>
            </div>
          </div>

          {/* Business Phone Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[#3d4946] font-label-md text-[12px]">
            <span>Direct Contact:</span>
            <a
              className="font-bold text-[#00685d] hover:underline"
              href={`tel:${cleanPhone}`}
            >
              {merchantSettings.displayPhone}
            </a>
          </div>
        </div>
      </section>

      {/* Specifications & Accordions Tabs */}
      <section className="px-4 pt-5 flex flex-col gap-2" id="specs-container">
        {/* Tabs Header */}
        <div className="flex gap-1 bg-[#eaedff] p-1 rounded-xl">
          <button
            className={`flex-1 py-2 rounded-lg font-label-md text-[12px] text-center transition-all cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-white text-[#00685d] font-bold shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e] font-medium'
            }`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-label-md text-[12px] text-center transition-all cursor-pointer ${
              activeTab === 'delivery'
                ? 'bg-white text-[#00685d] font-bold shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e] font-medium'
            }`}
            onClick={() => setActiveTab('delivery')}
          >
            Delivery Info
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-label-md text-[12px] text-center transition-all cursor-pointer ${
              activeTab === 'care'
                ? 'bg-white text-[#00685d] font-bold shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e] font-medium'
            }`}
            onClick={() => setActiveTab('care')}
          >
            Care Guide
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="bg-white p-4 rounded-xl shadow-xs flex flex-col gap-3 border border-[#eaedff]">
            <h3 className="font-headline-sm text-sm text-[#131b2e] font-semibold">
              Garment Specifications
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3 font-body-sm text-[12px]">
              {product.specifications ? (
                Object.entries(product.specifications).map(([key, val]) => (
                  <React.Fragment key={key}>
                    <span className="text-[#3d4946]">{key}:</span>
                    <span className="font-semibold text-[#131b2e]">{val}</span>
                  </React.Fragment>
                ))
              ) : (
                <>
                  <span className="text-[#3d4946]">Category:</span>
                  <span className="font-semibold text-[#131b2e]">{product.categoryLabel}</span>
                  <span className="text-[#3d4946]">SKU:</span>
                  <span className="font-semibold text-[#131b2e]">{product.sku}</span>
                </>
              )}
            </div>

            {/* Size Dimensions Table */}
            {product.sizeDimensions && product.sizeDimensions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#eaedff]">
                <span className="font-label-md text-[12px] text-[#131b2e] font-bold block mb-2">
                  Size Dimensions (Inches):
                </span>
                <div className="overflow-x-auto rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                  <table className="w-full text-left font-body-sm text-[12px]">
                    <thead className="bg-[#eaedff] font-label-sm text-[11px] text-[#131b2e]">
                      <tr>
                        <th className="p-2">Size</th>
                        <th className="p-2">Chest</th>
                        <th className="p-2">Length</th>
                        <th className="p-2">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaedff] text-[#3d4946]">
                      {product.sizeDimensions.map((row) => (
                        <tr
                          key={row.size}
                          className={selectedSize === row.size ? 'bg-[#5dfd8a]/20' : ''}
                        >
                          <td className="p-2 font-bold text-[#131b2e]">{row.size}</td>
                          <td className="p-2">{row.chest}</td>
                          <td className="p-2">{row.length}</td>
                          <td className="p-2">{row.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Delivery */}
        {activeTab === 'delivery' && (
          <div className="bg-white p-4 rounded-xl shadow-xs flex flex-col gap-3 border border-[#eaedff]">
            <h3 className="font-headline-sm text-sm text-[#131b2e] font-semibold">
              Shipping & Delivery
            </h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                <span className="material-symbols-outlined text-[#006d2f] text-2xl flex-shrink-0">
                  local_shipping
                </span>
                <div className="flex flex-col">
                  <span className="font-label-lg text-[13px] font-bold text-[#131b2e]">
                    Inside Dhaka City (৳{merchantSettings.deliveryInsideDhaka})
                  </span>
                  <span className="font-body-sm text-[11px] text-[#3d4946] mt-0.5">
                    Delivered within 24 to 48 hours directly to your doorstep.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
                <span className="material-symbols-outlined text-[#18675d] text-2xl flex-shrink-0">
                  distance
                </span>
                <div className="flex flex-col">
                  <span className="font-label-lg text-[13px] font-bold text-[#131b2e]">
                    Outside Dhaka (৳{merchantSettings.deliveryOutsideDhaka})
                  </span>
                  <span className="font-body-sm text-[11px] text-[#3d4946] mt-0.5">
                    Delivered within 48 to 72 hours via Steadfast / RedX courier.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#5dfd8a]/20 border border-[#5dfd8a]/40">
                <span className="material-symbols-outlined text-[#006d2f] text-2xl flex-shrink-0">
                  assignment_return
                </span>
                <div className="flex flex-col">
                  <span className="font-label-lg text-[13px] font-bold text-[#006d2f]">
                    7 Days Hassle-Free Exchange
                  </span>
                  <span className="font-body-sm text-[11px] text-[#131b2e] mt-0.5">
                    If size doesn't fit, simply message us on WhatsApp for an instant replacement.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Care Guide */}
        {activeTab === 'care' && (
          <div className="bg-white p-4 rounded-xl shadow-xs flex flex-col gap-3 border border-[#eaedff]">
            <h3 className="font-headline-sm text-sm text-[#131b2e] font-semibold">
              Wash & Fabric Care
            </h3>
            <ul className="space-y-2.5 font-body-sm text-[12px] text-[#3d4946]">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685d] text-base">
                  wash
                </span>
                Gentle hand wash or mild machine wash cold with similar colors.
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685d] text-base">
                  do_not_disturb_on
                </span>
                Do not bleach or use chlorine-based detergents.
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685d] text-base">
                  iron
                </span>
                Warm steam iron inside out for optimal fabric longevity.
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685d] text-base">
                  wb_sunny
                </span>
                Dry flat under shade to maintain vibrant organic tone.
              </li>
            </ul>
          </div>
        )}
      </section>

      {/* Shareable Link & Inquiry Box */}
      <section className="px-4 pt-5 flex flex-col gap-2">
        <div className="bg-white p-4 rounded-xl shadow-xs flex flex-col gap-3 border border-[#eaedff]">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-sm text-[#131b2e] font-semibold">
              Share & Inquire
            </span>
            <span
              className={`font-label-sm text-[11px] text-[#006d2f] font-bold transition-opacity ${
                copyToast ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Link Copied!
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f2f3ff] p-1.5 rounded-lg border border-[#eaedff]">
            <span className="material-symbols-outlined text-[#6d7a77] text-base ml-1">
              link
            </span>
            <input
              className="bg-transparent border-0 outline-none text-[#131b2e] font-body-sm text-[12px] flex-1 truncate px-1"
              readOnly
              type="text"
              value={productUrl}
            />
            <button
              onClick={copyProductLink}
              className="px-3 py-1.5 bg-[#00685d] hover:bg-[#008376] text-white rounded-lg font-label-md text-[12px] font-semibold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Copy
            </button>
          </div>

          <a
            className="w-full py-2.5 px-3 bg-[#eaedff] text-[#00685d] hover:bg-[#dae2fd] rounded-lg font-label-lg text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors"
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello! I have a question regarding the ${product.title}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-lg">help_outline</span>
            <span>Ask a Question about this Product on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Floating Sticky WhatsApp CTA (Mobile Thumb-Zone Anchor) */}
      <aside className="fixed bottom-0 inset-x-0 bg-[#faf8ff]/95 backdrop-blur-xl p-3 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] border-t border-[#eaedff]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex flex-col pl-1 flex-shrink-0">
            <span className="font-label-sm text-[10px] text-[#3d4946]">Price:</span>
            <span className="font-currency-display text-xl font-bold text-[#006d2f]">
              ৳{product.price.toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={handleOrderClick}
            className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#128C7E] active:scale-[0.98] text-white rounded-full font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <span>Order via WhatsApp (অর্ডার করুন)</span>
          </button>

        </div>
      </aside>
    </div>
  );
};
