import React, { useState } from 'react';
import { AuthUser, MerchantSettings } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  merchantSettings: MerchantSettings;
  initialRole?: 'customer' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  merchantSettings,
  initialRole = 'customer',
}) => {
  const [tab, setTab] = useState<'customer' | 'admin' | 'register'>(
    initialRole === 'admin' ? 'admin' : 'customer'
  );

  // Customer login states
  const [customerIdentifier, setCustomerIdentifier] = useState('01799-887766');
  const [customerPassword, setCustomerPassword] = useState('123456');

  // Admin login states
  const [adminEmail, setAdminEmail] = useState('nj639682@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin123');


  // Register states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerIdentifier.trim()) {
      setErrorMsg('মোবাইল নম্বর বা ইমেইল দিন (Please enter phone or email)');
      return;
    }
    setErrorMsg(null);
    const user: AuthUser = {
      id: 'cust-101',
      name: 'Tanvir Ahmed',
      email: customerIdentifier.includes('@') ? customerIdentifier : 'tanvir.ahmed@example.com',
      phone: customerIdentifier.includes('@') ? '+880 1799-887766' : customerIdentifier,
      role: 'customer',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      address: 'House 14, Road 4, Sector 7, Uttara, Dhaka',
    };
    onLogin(user);
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) {
      setErrorMsg('মার্চেন্ট ইমেইল বা আইডি দিন (Please enter merchant email)');
      return;
    }
    setErrorMsg(null);
    const adminUser: AuthUser = {
      id: 'admin-01',
      name: 'nir',
      email: adminEmail.trim() || 'nj639682@gmail.com',
      phone: merchantSettings.displayPhone,
      role: 'admin',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCSSfzpZ5464Gj8p7Noe19DkBd-iD59KvkyI5itPuDPZspasm_CPcDAhRn5CtYr8-p9rqNyjiVQ8R3RHxgxlzkXEiWHxHT_Jxy8Zmal6kNFm0A0-bhVLC8DNe46LKoQWzZS74XRWybqz4oa094umrU486siXA1YY8VIrlKtCaXKfUOS4r9qXRlZPpt5G78pFhTGixfCarG0jVHFB_YUt8dTwF1_SlgRzI8XsDOv_SsRIYSvDHVJKkkXA',
      address: merchantSettings.storeAddress,
    };
    onLogin(adminUser);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setErrorMsg('নাম ও মোবাইল নম্বর আবশ্যক (Name and Phone are required)');
      return;
    }
    setErrorMsg(null);
    const newUser: AuthUser = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: regName.trim(),
      email: regEmail.trim() || `${regPhone.replace(/[^0-9]/g, '')}@emeraldshop.bd`,
      phone: regPhone.startsWith('+880') ? regPhone : `+880 ${regPhone}`,
      role: 'customer',
      address: regAddress.trim() || 'Dhaka, Bangladesh',
    };
    onLogin(newUser);
    onClose();
  };

  const quickDemoCustomer = () => {
    const user: AuthUser = {
      id: 'cust-demo',
      name: 'Rahim Chowdhury',
      email: 'rahim.customer@gmail.com',
      phone: '+880 1812-998877',
      role: 'customer',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      address: 'Flat 4B, Shantinagar, Dhaka - 1217',
    };
    onLogin(user);
    onClose();
  };

  const quickDemoMerchant = () => {
    const adminUser: AuthUser = {
      id: 'admin-01',
      name: 'nir',
      email: 'nj639682@gmail.com',
      phone: merchantSettings.displayPhone,
      role: 'admin',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCSSfzpZ5464Gj8p7Noe19DkBd-iD59KvkyI5itPuDPZspasm_CPcDAhRn5CtYr8-p9rqNyjiVQ8R3RHxgxlzkXEiWHxHT_Jxy8Zmal6kNFm0A0-bhVLC8DNe46LKoQWzZS74XRWybqz4oa094umrU486siXA1YY8VIrlKtCaXKfUOS4r9qXRlZPpt5G78pFhTGixfCarG0jVHFB_YUt8dTwF1_SlgRzI8XsDOv_SsRIYSvDHVJKkkXA',
      address: merchantSettings.storeAddress,
    };
    onLogin(adminUser);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 border border-[#eaedff] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00685d] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">account_circle</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-base text-[#131b2e] font-bold">
                {tab === 'customer'
                  ? 'Customer Login (কাস্টমার লগইন)'
                  : tab === 'admin'
                  ? 'Merchant Portal Login (মার্চেন্ট লগইন)'
                  : 'Create Customer Account (নতুন রেজিস্ট্রেশন)'}
              </h2>
              <span className="font-label-sm text-[11px] text-[#3d4946]">
                {merchantSettings.storeName} Bangladesh
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[#131b2e] flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-[#eaedff] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setTab('customer');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg font-label-md text-[12px] font-semibold transition-all cursor-pointer text-center ${
              tab === 'customer'
                ? 'bg-white text-[#00685d] shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e]'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('admin');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg font-label-md text-[12px] font-semibold transition-all cursor-pointer text-center ${
              tab === 'admin'
                ? 'bg-white text-[#00685d] shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e]'
            }`}
          >
            Merchant
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-lg font-label-md text-[12px] font-semibold transition-all cursor-pointer text-center ${
              tab === 'register'
                ? 'bg-white text-[#00685d] shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a] font-body-sm text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: Customer Login */}
        {tab === 'customer' && (
          <form onSubmit={handleCustomerLogin} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Phone Number or Email (মোবাইল নম্বর বা ইমেইল) *
              </label>
              <div className="relative flex items-center bg-[#faf8ff] rounded-lg border border-[#eaedff] focus-within:border-[#00685d]">
                <span className="material-symbols-outlined text-[#6d7a77] text-lg pl-3">
                  phone_iphone
                </span>
                <input
                  type="text"
                  required
                  value={customerIdentifier}
                  onChange={(e) => setCustomerIdentifier(e.target.value)}
                  placeholder="01712-345678"
                  className="w-full bg-transparent p-2.5 outline-none font-body-md text-[13px] text-[#131b2e]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Password (পাসওয়ার্ড) *
              </label>
              <div className="relative flex items-center bg-[#faf8ff] rounded-lg border border-[#eaedff] focus-within:border-[#00685d]">
                <span className="material-symbols-outlined text-[#6d7a77] text-lg pl-3">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent p-2.5 outline-none font-body-md text-[13px] text-[#131b2e]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00685d] hover:bg-[#008376] text-white rounded-xl font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              <span>Log In as Customer (লগইন করুন)</span>
            </button>

            {/* Quick Demo Customer Button */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#eaedff]"></div>
              <span className="flex-shrink mx-2 text-[#6d7a77] font-label-sm text-[11px]">
                or 1-Click Fast Access
              </span>
              <div className="flex-grow border-t border-[#eaedff]"></div>
            </div>

            <button
              type="button"
              onClick={quickDemoCustomer}
              className="w-full py-2.5 bg-[#eaedff] hover:bg-[#dae2fd] text-[#00685d] rounded-xl font-label-md text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">bolt</span>
              <span>Instant Customer Demo Login (রহিম চৌধুরী)</span>
            </button>
          </form>
        )}

        {/* TAB 2: Merchant Admin Login */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="flex flex-col gap-3">
            <div className="p-3 bg-[#5dfd8a]/20 rounded-xl border border-[#5dfd8a]/40 flex items-start gap-2 text-[#006d2f]">
              <span className="material-symbols-outlined text-lg flex-shrink-0 mt-0.5">
                verified_user
              </span>
              <p className="font-body-sm text-[11px] text-[#131b2e] leading-snug">
                This login grants administrative access to add products, adjust pricing, toggle inventory, and update WhatsApp configuration.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Merchant Email / Username *
              </label>
              <div className="relative flex items-center bg-[#faf8ff] rounded-lg border border-[#eaedff] focus-within:border-[#00685d]">
                <span className="material-symbols-outlined text-[#6d7a77] text-lg pl-3">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="shanto@emeraldshop.bd"
                  className="w-full bg-transparent p-2.5 outline-none font-body-md text-[13px] text-[#131b2e]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Admin Password *
              </label>
              <div className="relative flex items-center bg-[#faf8ff] rounded-lg border border-[#eaedff] focus-within:border-[#00685d]">
                <span className="material-symbols-outlined text-[#6d7a77] text-lg pl-3">
                  key
                </span>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent p-2.5 outline-none font-body-md text-[13px] text-[#131b2e]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#006d2f] hover:bg-[#005322] text-white rounded-xl font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              <span>Log In to Admin Portal (প্রবেশ করুন)</span>
            </button>

            <button
              type="button"
              onClick={quickDemoMerchant}
              className="w-full py-2.5 bg-[#eaedff] hover:bg-[#dae2fd] text-[#00685d] rounded-xl font-label-md text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">store</span>
              <span>1-Click Verified Merchant Login (Shanto Rahman)</span>
            </button>
          </form>
        )}

        {/* TAB 3: New Customer Sign Up */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Full Name (আপনার পূর্ণ নাম) *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Asif Karim"
                className="bg-[#faf8ff] rounded-lg border border-[#eaedff] p-2.5 outline-none font-body-md text-[13px] text-[#131b2e] focus:border-[#00685d]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                  Mobile (মোবাইল নম্বর) *
                </label>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01712-345678"
                  className="bg-[#faf8ff] rounded-lg border border-[#eaedff] p-2.5 outline-none font-body-md text-[13px] text-[#131b2e] focus:border-[#00685d]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                  Email (ইমেইল)
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="asif@gmail.com"
                  className="bg-[#faf8ff] rounded-lg border border-[#eaedff] p-2.5 outline-none font-body-md text-[13px] text-[#131b2e] focus:border-[#00685d]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Delivery Address (ডেলিভারি ঠিকানা)
              </label>
              <textarea
                rows={2}
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="House, Road, Area, City..."
                className="bg-[#faf8ff] rounded-lg border border-[#eaedff] p-2.5 outline-none font-body-md text-[13px] text-[#131b2e] focus:border-[#00685d] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Password (পাসওয়ার্ড) *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create password"
                className="bg-[#faf8ff] rounded-lg border border-[#eaedff] p-2.5 outline-none font-body-md text-[13px] text-[#131b2e] focus:border-[#00685d]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00685d] hover:bg-[#008376] text-white rounded-xl font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              <span>Register & Sign In (অ্যাকাউন্ট তৈরি করুন)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
