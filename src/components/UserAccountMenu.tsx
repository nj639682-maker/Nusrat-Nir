import React from 'react';
import { AuthUser } from '../types';

interface UserAccountMenuProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenSwitchLogin: () => void;
}

export const UserAccountMenu: React.FC<UserAccountMenuProps> = ({
  user,
  isOpen,
  onClose,
  onLogout,
  onNavigateTab,
  onOpenSwitchLogin,
}) => {
  if (!isOpen) return null;

  const isMerchant = user.role === 'admin';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[#131b2e]/20 backdrop-blur-2xs"
      />

      {/* Floating Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-16 right-4 z-50 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#eaedff] p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* User Info Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#eaedff]">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#00685d]/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#00685d] text-white flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isMerchant ? 'bg-[#006d2f]' : 'bg-[#00685d]'
              }`}
            />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-sm sm:text-base text-[#131b2e] font-bold truncate tracking-tight">
                {user.name}
              </span>
            </div>
            <span className="font-body-sm text-[12px] text-[#00685d] font-medium truncate select-all">
              {user.email || user.phone}
            </span>

            <span
              className={`font-label-sm text-[10px] font-bold mt-0.5 px-2 py-0.5 rounded-full w-fit ${
                isMerchant
                  ? 'bg-[#5dfd8a]/30 text-[#006d2f]'
                  : 'bg-[#eaedff] text-[#00685d]'
              }`}
            >
              {isMerchant ? 'Verified Merchant (মার্চেন্ট)' : 'Registered Customer (কাস্টমার)'}
            </span>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-col gap-1 text-[13px] font-body-md text-[#131b2e]">
          {isMerchant ? (
            <button
              onClick={() => {
                onNavigateTab('admin');
                onClose();
              }}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#eaedff] transition-colors text-left cursor-pointer text-[#00685d] font-semibold"
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              <span>Open Store Admin Panel</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onNavigateTab('catalog');
                  onClose();
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#eaedff] transition-colors text-left cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg text-[#00685d]">
                  storefront
                </span>
                <span>Browse Store Catalog</span>
              </button>
              {user.address && (
                <div className="flex items-start gap-2 p-2 bg-[#f2f3ff] rounded-xl text-[11px] text-[#3d4946]">
                  <span className="material-symbols-outlined text-base text-[#00685d] flex-shrink-0 mt-0.5">
                    home
                  </span>
                  <span className="line-clamp-2">{user.address}</span>
                </div>
              )}
              <button
                onClick={() => {
                  onNavigateTab('tracking');
                  onClose();
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#eaedff] transition-colors text-left cursor-pointer text-[#006d2f] font-semibold"
              >
                <span className="material-symbols-outlined text-lg">local_shipping</span>
                <span>Track My Orders (অর্ডার ট্র্যাকিং)</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              onNavigateTab('tracking');
              onClose();
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#eaedff] transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-[#00685d]">
              search
            </span>
            <span>Check Any Parcel Status</span>
          </button>


          <button
            onClick={() => {
              onNavigateTab('wa-help');
              onClose();
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#eaedff] transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-[#006d2f]">
              support_agent
            </span>
            <span>WhatsApp Support & Helpdesk</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenSwitchLogin();
            }}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#eaedff] transition-colors text-left cursor-pointer text-[#3d4946]"
          >
            <span className="material-symbols-outlined text-lg">swap_horiz</span>
            <span>
              {isMerchant
                ? 'Switch to Customer Account'
                : 'Switch / Login as Merchant'}
            </span>
          </button>
        </div>

        {/* Logout Button */}
        <div className="pt-2 border-t border-[#eaedff]">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full py-2.5 px-3 bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Log Out (লগআউট)</span>
          </button>
        </div>
      </div>
    </>
  );
};
