import React, { useState } from 'react';
import { MerchantSettings } from '../types';

interface WAHelpViewProps {
  merchantSettings: MerchantSettings;
  onNavigateTab?: (tab: string) => void;
}

export const WAHelpView: React.FC<WAHelpViewProps> = ({ merchantSettings, onNavigateTab }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const cleanPhone = merchantSettings.whatsappNumber.replace(/[^0-9]/g, '');

  const openWhatsAppWithMessage = (msg: string) => {
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };


  const faqs = [
    {
      q: 'কিভাবে হোয়াটসঅ্যাপে অর্ডার কনফার্ম করব? (How do I order?)',
      a: 'ক্যাটালগ থেকে পছন্দের প্রোডাক্টের নিচে "Order" অথবা "Order on WhatsApp" বাটনে ক্লিক করুন। আপনার জন্য স্বয়ংক্রিয়ভাবে প্রোডাক্টের নাম ও মূল্যসহ মেসেজ তৈরি হয়ে যাবে। মেসেজটি সেন্ড করে আপনার নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা লিখে দিন। আমাদের কাস্টমার কেয়ার টিম তাৎক্ষণিকভাবে নিশ্চিত করবে।',
    },
    {
      q: 'ক্যাশ অন ডেলিভারি (COD) সুবিধা আছে কি?',
      a: 'হ্যাঁ! ঢাকা শহর এবং সমগ্র বাংলাদেশের যেকোনো জেলায় ১০০% ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। পার্সেল হাতে পেয়ে দেখে নেওয়ার পর ডেলিভারিম্যানকে মূল্য পরিশোধ করতে পারবেন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।',
    },
    {
      q: 'ডেলিভারি চার্জ এবং সময় কত লাগবে?',
      a: `ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৳${merchantSettings.deliveryInsideDhaka} (২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি)। ঢাকার বাইরে সমগ্র বাংলাদেশে ডেলিভারি চার্জ ৳${merchantSettings.deliveryOutsideDhaka} (৪৮-৭২ ঘণ্টার মধ্যে নির্ভরযোগ্য কুরিয়ারে ডেলিভারি)।`,
    },
    {
      q: 'সাইজ না মিললে বা ত্রুটিপূর্ণ পণ্য পেলে কি এক্সচেঞ্জ সম্ভব?',
      a: 'অবশ্যই! পার্সেল পাওয়ার ৭ দিনের মধ্যে যেকোনো সাইজ পরিবর্তন বা সমস্যার ক্ষেত্রে আমাদের এই হোয়াটসঅ্যাপ নম্বরে মেসেজ করলেই কোনো ঝামেলা ছাড়াই দ্রুত এক্সচেঞ্জ পার্সেল পাঠিয়ে দেওয়া হবে।',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Helpdesk Hero Banner */}
      <section className="px-4 pt-4 pb-2">
        <div className="rounded-2xl bg-gradient-to-br from-[#00685d] via-[#18675d] to-[#008376] text-white p-5 shadow-sm flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#66ff8e] animate-pulse"></span>
            <span className="font-label-sm text-[11px] font-bold tracking-wider uppercase text-[#f4fffb]">
              24/7 WhatsApp Customer Care
            </span>
          </div>

          <h1 className="font-headline-lg-mobile text-xl font-bold">
            Customer Support & Order Assistance
          </h1>

          <p className="font-body-sm text-[12px] text-[#f4fffb] opacity-90 leading-relaxed">
            কোনো জটিল রেজিস্ট্রেশন বা পাসওয়ার্ড ছাড়াই সরাসরি আমাদের হোয়াটসঅ্যাপ প্রতিনিধির সাথে চ্যাট করে অর্ডার করুন।
          </p>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${merchantSettings.storeName}! I need help with an order / cosmetics inquiry.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#128C7E] active:scale-[0.98] text-white rounded-xl font-headline-sm text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-1"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <span>Chat Live on WhatsApp ({merchantSettings.displayPhone})</span>
          </a>
        </div>
      </section>

      {/* Quick Action Assistance Chips */}
      <section className="px-4 py-2">
        <span className="font-label-sm text-[11px] text-[#3d4946] uppercase font-bold tracking-wider mb-2 block">
          Quick Inquiries (এক ক্লিকে মেসেজ করুন)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab('tracking');
              } else {
                openWhatsAppWithMessage('Hello! I would like to track my order status. My phone number is: ');
              }
            }}
            className="bg-white p-3 rounded-xl border border-[#eaedff] hover:border-[#00685d] transition-all flex flex-col items-start gap-1 text-left shadow-2xs cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[#006d2f] text-xl group-hover:scale-110 transition-transform">
              local_shipping
            </span>
            <span className="font-label-md text-[12px] text-[#131b2e] font-bold group-hover:text-[#00685d]">
              Track Order Status
            </span>
            <span className="font-body-sm text-[11px] text-[#3d4946]">
              লাইভ পার্সেল ট্র্যাকিং দেখুন
            </span>
          </button>


          <button
            onClick={() =>
              openWhatsAppWithMessage(
                'Hello! I need assistance regarding size selection or exchange.'
              )
            }
            className="bg-white p-3 rounded-xl border border-[#eaedff] hover:border-[#00685d] transition-all flex flex-col items-start gap-1 text-left shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#00685d] text-xl">
              straighten
            </span>
            <span className="font-label-md text-[12px] text-[#131b2e] font-bold">
              Size & Exchange
            </span>
            <span className="font-body-sm text-[11px] text-[#3d4946]">
              সাইজ পরিবর্তন বা সহায়তা
            </span>
          </button>

          <button
            onClick={() =>
              openWhatsAppWithMessage(
                `Hello ${merchantSettings.storeName}! I am interested in wholesale / bulk cosmetic orders.`
              )
            }
            className="bg-white p-3 rounded-xl border border-[#eaedff] hover:border-[#00685d] transition-all flex flex-col items-start gap-1 text-left shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#18675d] text-xl">
              featured_seasonal_and_gifts
            </span>
            <span className="font-label-md text-[12px] text-[#131b2e] font-bold">
              Corporate / Wholesale
            </span>
            <span className="font-body-sm text-[11px] text-[#3d4946]">
              পাইকারি বা করপোরেট অর্ডার
            </span>
          </button>

          <a
            href={`tel:${cleanPhone}`}
            className="bg-white p-3 rounded-xl border border-[#eaedff] hover:border-[#00685d] transition-all flex flex-col items-start gap-1 text-left shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#006d2f] text-xl">
              call
            </span>
            <span className="font-label-md text-[12px] text-[#131b2e] font-bold">
              Direct Phone Call
            </span>
            <span className="font-body-sm text-[11px] text-[#3d4946]">
              {merchantSettings.displayPhone}
            </span>
          </a>
        </div>
      </section>

      {/* Delivery Rates & Guarantee Card */}
      <section className="px-4 py-2">
        <div className="bg-[#eaedff] rounded-2xl p-4 border border-[#dae2fd] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006d2f] text-2xl">
              verified_user
            </span>
            <div>
              <h2 className="font-headline-sm text-sm text-[#131b2e] font-bold">
                ডেলিভারি ও ক্যাশ অন ডেলিভারি পলিসি
              </h2>
              <span className="font-body-sm text-[11px] text-[#3d4946]">
                Safe, Transparent & Reliable
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-xl border border-[#eaedff] flex flex-col gap-0.5">
              <span className="font-label-sm text-[11px] text-[#00685d] font-bold">
                ঢাকা সিটি
              </span>
              <span className="font-currency-display text-lg font-bold text-[#131b2e]">
                ৳{merchantSettings.deliveryInsideDhaka}
              </span>
              <span className="font-body-sm text-[11px] text-[#3d4946]">
                ২৪-৪৮ ঘণ্টা হোম ডেলিভারি
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#eaedff] flex flex-col gap-0.5">
              <span className="font-label-sm text-[11px] text-[#18675d] font-bold">
                সারাদেশে
              </span>
              <span className="font-currency-display text-lg font-bold text-[#131b2e]">
                ৳{merchantSettings.deliveryOutsideDhaka}
              </span>
              <span className="font-body-sm text-[11px] text-[#3d4946]">
                ৪৮-৭২ ঘণ্টা কুরিয়ার সার্ভিস
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#eaedff] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#006d2f] text-xl">
              lock
            </span>
            <p className="font-body-sm text-[11px] text-[#131b2e] leading-snug">
              পণ্য হাতে পেয়ে দেখে নেওয়ার পর মূল্য পরিশোধের নিশ্চয়তা। অগ্রিম কোনো টাকা দিতে হবে না।
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="px-4 py-2 flex flex-col gap-2">
        <span className="font-label-sm text-[11px] text-[#3d4946] uppercase font-bold tracking-wider">
          Frequently Asked Questions (সাধারণ জিজ্ঞাসা)
        </span>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#eaedff] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3 text-left flex items-center justify-between gap-2 cursor-pointer hover:bg-[#faf8ff]"
                >
                  <span className="font-headline-sm text-[13px] text-[#131b2e] font-semibold">
                    {faq.q}
                  </span>
                  <span className="material-symbols-outlined text-base text-[#6d7a77] flex-shrink-0">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {isOpen && (
                  <div className="p-3 pt-0 text-[12px] font-body-sm text-[#3d4946] leading-relaxed border-t border-[#eaedff]/60 bg-[#faf8ff]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Physical Store Location */}
      <section className="px-4 pt-2">
        <div className="bg-white p-3.5 rounded-xl border border-[#eaedff] flex flex-col gap-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-[#131b2e]">
            <span className="material-symbols-outlined text-[#00685d] text-lg">
              storefront
            </span>
            <span className="font-label-lg text-[13px] font-bold">
              {merchantSettings.storeName} Flagship Display Center
            </span>
          </div>
          <span className="font-body-sm text-[12px] text-[#3d4946] pl-6">
            {merchantSettings.storeAddress}
          </span>
          <span className="font-body-sm text-[11px] text-[#6d7a77] pl-6">
            Open daily {merchantSettings.customerCareHours}
          </span>
        </div>
      </section>
    </div>
  );
};
