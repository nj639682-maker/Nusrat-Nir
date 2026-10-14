import React from 'react';
import { MerchantSettings, AuthUser } from '../types';

interface HeaderProps {
  currentTab: string;
  isProductDetails: boolean;
  onBack: () => void;
  onNavigateTab: (tab: string) => void;
  merchantSettings: MerchantSettings;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onToggleUserMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  isProductDetails,
  onBack,
  onNavigateTab,
  merchantSettings,
  currentUser,
  onOpenAuthModal,
  onToggleUserMenu,
}) => {
  const getSubtitle = () => {
    if (isProductDetails) return merchantSettings.storeName;
    if (currentTab === 'admin') return 'Admin Portal';
    if (currentTab === 'tracking') return 'Order Tracking';
    if (currentTab === 'categories') return 'Category Catalog';
    if (currentTab === 'wa-help') return 'WhatsApp Helpdesk';
    return 'Home Catalog';
  };


  const getTitle = () => {
    if (isProductDetails) return 'Product Details';
    return merchantSettings.storeName;
  };

  const cleanPhone = merchantSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="fixed top-0 w-full z-50 bg-[#faf8ff]/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#eaedff]">
      <div className="h-16 max-w-4xl mx-auto px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isProductDetails ? (
            <button
              aria-label="Go Back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center text-[#131b2e] rounded-full hover:bg-[#eaedff] active:scale-95 transition-all mr-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
            </button>
          ) : null}

          {/* Logo icon */}
          <button
            onClick={() => onNavigateTab('catalog')}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <img
              alt="Shop Logo"
              className="h-8 w-8 object-contain flex-shrink-0 rounded-lg group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XlNBxRPgY_K5-1xa0Yx0ZMJoTx8X-VquBXK01pClNz6anhT6R23AiR49BA26R_NEUZK6KlLnCFH-DcEqlNY3CIzLKZkT6LYnYxaAGiy680JJY0a-veCmQXvvM43OaHTU3NIdsnoxfPkKkJiYG5u44TXldI-78K3jCnZJrHUvpt05JnlPK2LCMtCxBeCS9d4R9ZRVDbcUr3yYtTGB5lBn9dAV746xyCzY3p7PfmmyKyg6USoI3HnWnD9JVk"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-base sm:text-[17px] text-[#00685d] font-extrabold tracking-tight truncate">
                  {getTitle()}
                </span>

                {!isProductDetails && (
                  <span className="font-label-sm text-[11px] text-[#3d4946] font-normal hidden xs:inline">
                    {merchantSettings.storeBengaliName}
                  </span>
                )}
              </div>
              <span className="font-label-sm text-[11px] text-[#3d4946] truncate">
                {getSubtitle()}
              </span>
            </div>
          </button>
        </div>

        {/* WhatsApp Helpline pill and Profile / Login button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            aria-label={`WhatsApp Helpline ${merchantSettings.displayPhone}`}
            className="flex items-center gap-1.5 bg-[#5dfd8a]/20 px-3 py-1.5 rounded-full text-[#006d2f] hover:bg-[#5dfd8a]/35 active:scale-95 transition-all min-h-[40px] border border-[#5dfd8a]/40"
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className="material-symbols-outlined text-[#006d2f] text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat
            </span>
            <div className="flex flex-col text-left pr-0.5 hidden sm:flex">
              <span className="font-label-sm text-[11px] text-[#006d2f] font-bold leading-none">
                Help
              </span>
              <span className="font-label-sm text-[10px] text-[#007232] leading-none mt-0.5">
                {merchantSettings.displayPhone}
              </span>
            </div>
            <span className="sm:hidden font-label-sm text-[11px] font-bold">Help</span>
          </a>

          {/* User profile avatar or Login Button */}
          {currentUser ? (
            <button
              onClick={onToggleUserMenu}
              title={`Logged in as ${currentUser.name} (${currentUser.role})`}
              className="relative cursor-pointer group flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-[#00685d]/30 transition-all"
            >
              {currentUser.avatar ? (
                <img
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-[#00685d]/20 group-hover:ring-[#00685d] transition-all"
                  src={currentUser.avatar}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#00685d] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#00685d]/20">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-1 ring-white ${
                  currentUser.role === 'admin' ? 'bg-[#006d2f]' : 'bg-[#00685d]'
                }`}
              ></span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1 bg-[#eaedff] hover:bg-[#dae2fd] text-[#00685d] px-3 py-1.5 rounded-full font-label-sm text-[12px] font-bold border border-[#dae2fd] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

