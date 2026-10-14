/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, MerchantSettings, AuthUser, Order, OrderStatus } from './types';
import { initialProducts, initialMerchantSettings, initialOrders } from './data/initialProducts';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeCatalog } from './components/HomeCatalog';
import { ProductDetails } from './components/ProductDetails';
import { AdminPortal } from './components/AdminPortal';
import { CategoriesView } from './components/CategoriesView';
import { WAHelpView } from './components/WAHelpView';
import { WhatsAppOrderModal } from './components/WhatsAppOrderModal';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';
import { UserAccountMenu } from './components/UserAccountMenu';
import { OrderTrackingView } from './components/OrderTrackingView';

export default function App() {
  // Load products from localStorage or use initial set
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('emerald_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].sku?.startsWith('NJ-') || parsed[0].category === 'lips' || parsed[0].category === 'face')) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialProducts;
  });

  // Load orders from localStorage or use initial set
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('emerald_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id?.startsWith('NJ-')) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialOrders;
  });

  // Load merchant settings from localStorage or initial
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(() => {
    try {
      const saved = localStorage.getItem('emerald_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            ...parsed,
            storeName: 'NJ Makeup Products Shop BD',
            storeBengaliName: 'এনজে মেকআপ শপ বিডি',
            merchantName: 'nir',
          };
        }
      }
    } catch {
      // ignore
    }
    return {
      ...initialMerchantSettings,
      storeName: 'NJ Makeup Products Shop BD',
      storeBengaliName: 'এনজে মেকআপ শপ বিডি',
      merchantName: 'nir',
    };
  });


  // Authentication State (defaults to nir / nj639682@gmail.com)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('emerald_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return {
            ...parsed,
            name: 'nir',
            email: 'nj639682@gmail.com',
          };
        }
      }
    } catch {
      // ignore
    }
    return {
      id: 'admin-01',
      name: 'nir',
      email: 'nj639682@gmail.com',
      phone: '+880 1712-345678',
      role: 'admin',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCSSfzpZ5464Gj8p7Noe19DkBd-iD59KvkyI5itPuDPZspasm_CPcDAhRn5CtYr8-p9rqNyjiVQ8R3RHxgxlzkXEiWHxHT_Jxy8Zmal6kNFm0A0-bhVLC8DNe46LKoQWzZS74XRWybqz4oa094umrU486siXA1YY8VIrlKtCaXKfUOS4r9qXRlZPpt5G78pFhTGixfCarG0jVHFB_YUt8dTwF1_SlgRzI8XsDOv_SsRIYSvDHVJKkkXA',
      address: 'House 42, Road 9/A, Dhanmondi, Dhaka - 1209',
    };
  });


  // Auth UI & Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'customer' | 'admin'>('customer');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Navigation states
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('NJ-8492');

  // Modal states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('emerald_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('emerald_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('emerald_settings', JSON.stringify(merchantSettings));
    } catch {
      // ignore
    }
  }, [merchantSettings]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('emerald_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('emerald_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setIsUserMenuOpen(false);
    showToast(
      `স্বাগতম ${user.name}! ${
        user.role === 'admin'
          ? 'মার্চেন্ট প্যানেলে লগইন সফল।'
          : 'কাস্টমার অ্যাকাউন্টে লগইন সফল।'
      }`
    );
  };

  const handleLogout = () => {
    const prevName = currentUser?.name || 'ব্যবহারকারী';
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    showToast(`${prevName}, সফলভাবে লগআউট হয়েছে (Logged out successfully)`);
  };

  const handleOpenAuthModal = (role: 'customer' | 'admin' = 'customer') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  // Product CRUD actions
  const handleAddProduct = (newProdData: Omit<Product, 'id' | 'views'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now().toString().slice(-4)}`,
      views: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleToggleStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Order CRUD & Tracking Actions
  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    showToast(`অর্ডার #${newOrder.id} তৈরি হয়েছে! ট্র্যাকিং ট্যাবে স্ট্যাটাস দেখতে পারেন।`);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    courierName?: string,
    consignmentId?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              ...(courierName ? { courierName } : {}),
              ...(consignmentId !== undefined ? { consignmentId } : {}),
            }
          : o
      )
    );
  };

  const handleNavigateTrackOrder = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setSelectedProduct(null);
    setCurrentTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setSelectedProduct(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen flex flex-col font-sans selection:bg-[#5dfd8a]/40 selection:text-[#00685d]">
      {/* Toast Notification Banner */}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#00685d] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 pointer-events-none border border-[#8ff4e3]/30 ${
          toastMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'
        }`}
      >
        <span className="material-symbols-outlined text-lg text-[#66ff8e]">
          verified
        </span>
        <span className="font-label-sm text-[12px] font-bold">{toastMessage}</span>
      </div>

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        isProductDetails={Boolean(selectedProduct)}
        onBack={() => setSelectedProduct(null)}
        onNavigateTab={handleTabChange}
        merchantSettings={merchantSettings}
        currentUser={currentUser}
        onOpenAuthModal={() => handleOpenAuthModal('customer')}
        onToggleUserMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
      />

      {/* User Account / Profile Dropdown Menu */}
      {currentUser && (
        <UserAccountMenu
          user={currentUser}
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
          onLogout={handleLogout}
          onNavigateTab={handleTabChange}
          onOpenSwitchLogin={() =>
            handleOpenAuthModal(currentUser.role === 'admin' ? 'customer' : 'admin')
          }
        />
      )}

      {/* Main Screen Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto pt-16 flex flex-col">
        {selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            merchantSettings={merchantSettings}
            onBack={() => setSelectedProduct(null)}
            onNavigateTab={handleTabChange}
            onOrderCreated={handleCreateOrder}
            currentUser={currentUser}
          />

        ) : (
          <>
            {currentTab === 'catalog' && (
              <HomeCatalog
                products={products}
                merchantSettings={merchantSettings}
                onSelectProduct={handleSelectProduct}
                onOpenQuickView={(p) => setQuickViewProduct(p)}
                onTriggerOrder={(p) => setOrderModalProduct(p)}
                onNavigateTab={handleTabChange}
              />
            )}

            {currentTab === 'categories' && (
              <CategoriesView
                products={products}
                onSelectCategory={(_cat) => {
                  setCurrentTab('catalog');
                  window.scrollTo({ top: 200, behavior: 'smooth' });
                }}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentTab === 'tracking' && (
              <OrderTrackingView
                orders={orders}
                merchantSettings={merchantSettings}
                defaultOrderId={activeTrackingOrderId}
                onNavigateTab={handleTabChange}
              />
            )}

            {currentTab === 'wa-help' && (
              <WAHelpView
                merchantSettings={merchantSettings}
                onNavigateTab={handleTabChange}
              />
            )}

            {currentTab === 'admin' && (
              <AdminPortal
                products={products}
                orders={orders}
                merchantSettings={merchantSettings}
                onUpdateMerchantSettings={setMerchantSettings}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onToggleStock={handleToggleStock}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onNavigateTab={handleTabChange}
                onNavigateTrackOrder={handleNavigateTrackOrder}
                currentUser={currentUser}
                onOpenAuthModal={handleOpenAuthModal}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      {!selectedProduct && (
        <Navigation currentTab={currentTab} onTabChange={handleTabChange} />
      )}

      {/* Login & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        merchantSettings={merchantSettings}
        initialRole={authModalRole}
      />

      {/* WhatsApp Order Modal Simulation */}
      <WhatsAppOrderModal
        product={orderModalProduct}
        merchantSettings={merchantSettings}
        onClose={() => setOrderModalProduct(null)}
        onOrderCreated={handleCreateOrder}
        currentUser={currentUser}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenOrder={(p) => setOrderModalProduct(p)}
        onViewFullDetails={handleSelectProduct}
      />
    </div>
  );
}
