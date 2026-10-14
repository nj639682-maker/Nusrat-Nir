import React, { useState } from 'react';
import { Order, OrderStatus, MerchantSettings } from '../types';

interface OrderTrackingViewProps {
  orders: Order[];
  merchantSettings: MerchantSettings;
  defaultOrderId?: string;
  onNavigateTab: (tab: string) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  merchantSettings,
  defaultOrderId = '',
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState(defaultOrderId || 'NJ-8492');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (defaultOrderId) {
      return orders.find((o) => o.id.toLowerCase() === defaultOrderId.toLowerCase()) || null;
    }
    return orders[0] || null;
  });
  const [phoneOrders, setPhoneOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(true);

  const cleanPhone = merchantSettings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    setHasSearched(true);

    // Check by Order ID
    const directMatch = orders.find((o) => o.id.toLowerCase() === query);
    if (directMatch) {
      setSearchedOrder(directMatch);
      setPhoneOrders([]);
      return;
    }

    // Check by Phone number
    const cleanQueryPhone = query.replace(/[^0-9]/g, '');
    const phoneMatches = orders.filter((o) => {
      const pClean = o.customerPhone.replace(/[^0-9]/g, '');
      return pClean.includes(cleanQueryPhone) || o.customerName.toLowerCase().includes(query);
    });

    if (phoneMatches.length > 0) {
      setSearchedOrder(phoneMatches[0]);
      setPhoneOrders(phoneMatches);
    } else {
      setSearchedOrder(null);
      setPhoneOrders([]);
    }
  };

  const selectOrder = (order: Order) => {
    setSearchedOrder(order);
    setSearchTerm(order.id);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return {
          label: 'অর্ডার গৃহীত (Order Placed)',
          bg: 'bg-[#eaedff]',
          text: 'text-[#00685d]',
          step: 1,
        };
      case 'confirmed':
        return {
          label: 'অর্ডার নিশ্চিত (Confirmed)',
          bg: 'bg-[#e2e7ff]',
          text: 'text-[#18675d]',
          step: 2,
        };
      case 'packaging':
        return {
          label: 'প্যাকিং চলছে (Packaging)',
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          step: 2,
        };
      case 'shipped':
        return {
          label: 'কুরিয়ারে হস্তান্তর (Shipped / In Transit)',
          bg: 'bg-[#5dfd8a]/30',
          text: 'text-[#006d2f]',
          step: 3,
        };
      case 'out_for_delivery':
        return {
          label: 'ডেলিভারির জন্য বের হয়েছে (Out for Delivery)',
          bg: 'bg-[#5dfd8a]/40',
          text: 'text-[#007232]',
          step: 4,
        };
      case 'delivered':
        return {
          label: 'ডেলিভারি সম্পন্ন (Delivered & COD Collected)',
          bg: 'bg-[#006d2f] text-white',
          text: 'text-white',
          step: 5,
        };
      case 'cancelled':
        return {
          label: 'বাতিল (Cancelled)',
          bg: 'bg-[#ffdad6]',
          text: 'text-[#ba1a1a]',
          step: 0,
        };
    }
  };

  const trackingSteps = [
    {
      step: 1,
      title: 'Order Placed',
      bengaliTitle: 'অর্ডার মেসেজ গৃহীত',
      desc: 'হোয়াটসঅ্যাপের মাধ্যমে অর্ডারের তথ্য ও ঠিকানা জমা নেওয়া হয়েছে।',
      icon: 'receipt_long',
    },
    {
      step: 2,
      title: 'Confirmed & Packaging',
      bengaliTitle: 'অর্ডার নিশ্চিত ও মান যাচাই',
      desc: 'পণ্য কোয়ালিটি চেক ও ওয়াটারপ্রুফ প্যাকেজিং সম্পন্ন করা হয়েছে।',
      icon: 'inventory_2',
    },
    {
      step: 3,
      title: 'Handed to Courier',
      bengaliTitle: 'কুরিয়ারে হস্তান্তর',
      desc: 'কুরিয়ার পার্টনারে পার্সেল জমা দেওয়া হয়েছে এবং ট্র্যাকিং কোড তৈরি হয়েছে।',
      icon: 'local_shipping',
    },
    {
      step: 4,
      title: 'Out for Delivery',
      bengaliTitle: 'ডেলিভারির জন্য বের হয়েছে',
      desc: 'ডেলিভারি রাইডার আপনার গন্তব্যে পৌঁছানোর উদ্দেশ্যে রওনা হয়েছেন।',
      icon: 'directions_bike',
    },
    {
      step: 5,
      title: 'Delivered (ক্যাশ গ্রহণ)',
      bengaliTitle: 'সফলভাবে ডেলিভারি ও ক্যাশ গ্রহণ',
      desc: 'পার্সেল বুঝিয়ে দেওয়া হয়েছে এবং ক্যাশ অন ডেলিভারি সম্পন্ন হয়েছে।',
      icon: 'check_circle',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Search Header Banner */}
      <section className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-[#00685d] via-[#18675d] to-[#008376] text-white p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#66ff8e] animate-pulse"></span>
            <span className="font-label-sm text-[11px] font-bold tracking-wider uppercase text-[#f4fffb]">
              Live Order & Consignment Tracking
            </span>
          </div>

          <h1 className="font-headline-lg-mobile text-xl font-bold">
            Track Your Parcel (অর্ডার ট্র্যাকিং)
          </h1>

          <p className="font-body-sm text-[12px] text-[#f4fffb] opacity-90 leading-relaxed">
            আপনার অর্ডার আইডি (যেমন NJ-8492) বা মোবাইল নম্বর দিয়ে ডেলিভারির বর্তমান অবস্থা জানুন।
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5 mt-1">
            <div className="relative flex-1 flex items-center bg-white rounded-xl shadow-sm">
              <span className="material-symbols-outlined text-[#6d7a77] text-lg pl-3">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Order ID (e.g. NJ-8492) or Phone"
                className="w-full bg-transparent p-3 outline-none text-[#131b2e] font-body-md text-[13px] placeholder:text-[#6d7a77]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-2 text-[#6d7a77] hover:text-[#131b2e] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="py-3 px-4 bg-[#25D366] hover:bg-[#128C7E] active:scale-95 text-white font-label-lg text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex-shrink-0"
            >
              Track
            </button>
          </form>

          {/* Preset Sample Order Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
            <span className="text-[#f4fffb]/80">Quick Check:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchTerm(o.id);
                  selectOrder(o);
                }}
                className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                  searchedOrder?.id === o.id
                    ? 'bg-white text-[#00685d] font-bold border-white'
                    : 'bg-white/20 text-white hover:bg-white/30 border-white/20'
                }`}
              >
                {o.id} ({o.customerName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Multiple Orders for this Phone/Customer */}
      {phoneOrders.length > 1 && (
        <section className="px-4 py-2">
          <div className="bg-[#eaedff] p-3 rounded-xl border border-[#dae2fd]">
            <span className="font-label-sm text-[11px] font-bold text-[#00685d] block mb-2">
              Found {phoneOrders.length} orders for "{searchTerm}":
            </span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {phoneOrders.map((po) => (
                <button
                  key={po.id}
                  onClick={() => selectOrder(po)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left flex-shrink-0 transition-all cursor-pointer ${
                    searchedOrder?.id === po.id
                      ? 'bg-white border-[#00685d] shadow-xs'
                      : 'bg-white/70 border-[#eaedff] hover:bg-white'
                  }`}
                >
                  <img
                    src={po.productImage}
                    alt={po.productTitle}
                    className="w-9 h-9 rounded object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-[11px] text-[#131b2e] font-bold">
                      {po.id}
                    </span>
                    <span className="font-label-sm text-[10px] text-[#006d2f]">
                      ৳{po.totalAmount} • {po.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Searched Order Result Card */}
      {searchedOrder ? (
        <section className="px-4 py-2 flex flex-col gap-3">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaedff] flex flex-col gap-3.5">
            {/* Top Order Meta */}
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div>
                <span className="font-label-sm text-[10px] text-[#6d7a77] uppercase tracking-wider block">
                  Order Identifier
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="font-headline-md text-lg text-[#131b2e] font-bold font-mono">
                    #{searchedOrder.id}
                  </h2>
                  <span className="font-body-sm text-[11px] text-[#6d7a77]">
                    Placed on {searchedOrder.createdAt}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              {(() => {
                const b = getStatusBadge(searchedOrder.status);
                return (
                  <span
                    className={`font-label-sm text-[11px] px-3 py-1 rounded-full font-bold shadow-2xs border ${b.bg} ${b.text}`}
                  >
                    {b.label}
                  </span>
                );
              })()}
            </div>

            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff]">
              <img
                src={searchedOrder.productImage}
                alt={searchedOrder.productTitle}
                className="w-16 h-16 rounded-xl object-cover bg-white border border-[#eaedff] flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-headline-sm text-sm text-[#131b2e] font-bold truncate">
                  {searchedOrder.productTitle}
                </h3>
                {searchedOrder.productSize && (
                  <span className="font-label-sm text-[11px] text-[#18675d]">
                    Size: {searchedOrder.productSize}
                  </span>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-currency-display text-sm font-bold text-[#006d2f]">
                    ৳{searchedOrder.price.toLocaleString()}
                  </span>
                  <span className="text-[#6d7a77] text-xs">+ ৳{searchedOrder.deliveryCharge} delivery</span>
                </div>
              </div>
              <div className="text-right flex flex-col justify-center pl-2 border-l border-[#eaedff]">
                <span className="font-label-sm text-[10px] text-[#6d7a77]">COD Total</span>
                <span className="font-currency-display text-base font-bold text-[#131b2e]">
                  ৳{searchedOrder.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Courier & Consignment Details */}
            {searchedOrder.courierName && (
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#e2e7ff] rounded-xl border border-[#dae2fd]">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] text-[#3d4946] uppercase font-bold">
                    Courier Partner
                  </span>
                  <span className="font-headline-sm text-[13px] text-[#131b2e] font-bold mt-0.5">
                    {searchedOrder.courierName}
                  </span>
                  <span className="font-body-sm text-[11px] text-[#3d4946]">
                    Consignment: {searchedOrder.consignmentId || 'Pending'}
                  </span>
                </div>

                <div className="flex flex-col text-right">
                  <span className="font-label-sm text-[10px] text-[#3d4946] uppercase font-bold">
                    Est. Delivery
                  </span>
                  <span className="font-headline-sm text-[13px] text-[#006d2f] font-bold mt-0.5">
                    {searchedOrder.estimatedDeliveryDate || 'Within 48 Hours'}
                  </span>
                  <span className="font-body-sm text-[11px] text-[#3d4946]">
                    Cash on Delivery (ক্যাশ অন ডেলিভারি)
                  </span>
                </div>
              </div>
            )}

            {/* Graphical Tracking Stepper */}
            <div className="pt-2">
              <span className="font-label-sm text-[11px] text-[#3d4946] font-bold uppercase tracking-wider block mb-3">
                Delivery Milestones (ডেলিভারির ধাপসমূহ)
              </span>

              {(() => {
                const currentStepNumber = getStatusBadge(searchedOrder.status).step;

                return (
                  <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#dae2fd]">
                    {trackingSteps.map((st) => {
                      const isCompleted = currentStepNumber >= st.step;
                      const isCurrent = currentStepNumber === st.step;

                      return (
                        <div key={st.step} className="relative flex items-start gap-3">
                          {/* Circle bullet */}
                          <span
                            className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                              isCompleted
                                ? 'bg-[#006d2f] text-white ring-4 ring-[#5dfd8a]/30'
                                : 'bg-[#dae2fd] text-[#6d7a77]'
                            }`}
                          >
                            <span
                              className="material-symbols-outlined text-[12px]"
                              style={{ fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              {isCompleted ? 'check' : 'radio_button_unchecked'}
                            </span>
                          </span>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-headline-sm text-[13px] font-bold ${
                                  isCurrent
                                    ? 'text-[#006d2f]'
                                    : isCompleted
                                    ? 'text-[#131b2e]'
                                    : 'text-[#6d7a77]'
                                }`}
                              >
                                {st.title}
                              </span>
                              <span className="font-body-sm text-[11px] text-[#3d4946]">
                                ({st.bengaliTitle})
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.2 rounded-full bg-[#5dfd8a] text-[#007232] font-label-sm text-[9px] font-bold">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p className="font-body-sm text-[11px] text-[#3d4946] mt-0.5">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Delivery Address Details */}
            <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2 text-[#131b2e]">
                <span className="material-symbols-outlined text-[#00685d] text-base">
                  pin_drop
                </span>
                <span className="font-label-sm text-[11px] font-bold">
                  Shipping Destination:
                </span>
              </div>
              <span className="font-body-sm text-[12px] text-[#131b2e] font-semibold pl-6">
                {searchedOrder.customerName} ({searchedOrder.customerPhone})
              </span>
              <span className="font-body-sm text-[11px] text-[#3d4946] pl-6">
                {searchedOrder.customerAddress}
              </span>
              {searchedOrder.notes && (
                <span className="font-body-sm text-[10px] text-[#18675d] pl-6 bg-white p-1 rounded mt-1 border border-[#eaedff]">
                  Note: {searchedOrder.notes}
                </span>
              )}
            </div>

            {/* Direct Inquiry Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#eaedff]">
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hello Emerald Shop! I am tracking my Order #${searchedOrder.id} for "${searchedOrder.productTitle}". Please provide an update.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  chat
                </span>
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href={`tel:${cleanPhone}`}
                className="py-3 px-4 bg-[#eaedff] hover:bg-[#dae2fd] text-[#00685d] rounded-xl font-label-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">call</span>
                <span>Call Hotline</span>
              </a>
            </div>
          </div>
        </section>
      ) : hasSearched ? (
        <section className="px-4 py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <h3 className="font-headline-sm text-base text-[#131b2e] font-bold">
            No Order Found for "{searchTerm}"
          </h3>
          <p className="font-body-sm text-[12px] text-[#3d4946] mt-1 max-w-xs leading-relaxed">
            অনুগ্রহ করে সঠিক অর্ডার আইডি (যেমন EMR-8492) অথবা অর্ডার করার সময় যে মোবাইল নম্বর দিয়েছেন তা লিখুন।
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setSearchTerm('EMR-8492');
                setSearchedOrder(orders[0]);
              }}
              className="px-3 py-2 bg-[#00685d] text-white rounded-xl font-label-md text-xs font-bold shadow-xs cursor-pointer"
            >
              Try Sample Order (EMR-8492)
            </button>
            <button
              onClick={() => onNavigateTab('catalog')}
              className="px-3 py-2 bg-[#eaedff] text-[#131b2e] rounded-xl font-label-md text-xs font-semibold cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
};
