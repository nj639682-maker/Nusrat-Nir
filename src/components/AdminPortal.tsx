import React, { useState } from 'react';
import { Product, MerchantSettings, AuthUser, Order, OrderStatus } from '../types';

interface AdminPortalProps {
  products: Product[];
  orders: Order[];
  merchantSettings: MerchantSettings;
  onUpdateMerchantSettings: (settings: MerchantSettings) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'views'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleStock: (productId: string) => void;
  onUpdateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    courierName?: string,
    consignmentId?: string
  ) => void;
  onNavigateTab: (tab: string) => void;
  onNavigateTrackOrder: (orderId: string) => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: (role?: 'customer' | 'admin') => void;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  orders,
  merchantSettings,
  onUpdateMerchantSettings,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleStock,
  onUpdateOrderStatus,
  onNavigateTab,
  onNavigateTrackOrder,
  currentUser,
  onOpenAuthModal,
  onLogin,
  onLogout,
}) => {
  // Main admin section switcher: 'products' | 'orders' | 'whatsapp'
  const [adminTab, setAdminTab] = useState<'products' | 'orders' | 'whatsapp'>('products');

  // Product filters and form states
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<'lips' | 'face' | 'eyes' | 'skincare' | 'apparel' | 'organic' | 'decor' | 'leather'>('lips');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formInStock, setFormInStock] = useState(true);

  // Orders pipeline filter & search
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // WhatsApp setup states
  const [waPhone, setWaPhone] = useState(merchantSettings.displayPhone.replace('+880', '').trim());
  const [waMessageTemplate, setWaMessageTemplate] = useState(merchantSettings.defaultOrderMessageTemplate);

  // Embedded login states (when not logged in)
  const [embeddedEmail, setEmbeddedEmail] = useState('nj639682@gmail.com');
  const [embeddedPassword, setEmbeddedPassword] = useState('admin123');


  // Modals & Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleEmbeddedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser: AuthUser = {
      id: 'admin-01',
      name: 'nir',
      email: embeddedEmail.trim() || 'nj639682@gmail.com',
      phone: merchantSettings.displayPhone,
      role: 'admin',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCCSSfzpZ5464Gj8p7Noe19DkBd-iD59KvkyI5itPuDPZspasm_CPcDAhRn5CtYr8-p9rqNyjiVQ8R3RHxgxlzkXEiWHxHT_Jxy8Zmal6kNFm0A0-bhVLC8DNe46LKoQWzZS74XRWybqz4oa094umrU486siXA1YY8VIrlKtCaXKfUOS4r9qXRlZPpt5G78pFhTGixfCarG0jVHFB_YUt8dTwF1_SlgRzI8XsDOv_SsRIYSvDHVJKkkXA',
      address: merchantSettings.storeAddress,
    };
    onLogin(adminUser);
    showToast('মার্চেন্ট হিসেবে লগইন সফল হয়েছে!');
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormPrice('');
    setFormCategory('lips');
    setFormImage(
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
    );
    setFormDescription('');
    setFormInStock(true);
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setFormTitle(prod.title);
    setFormPrice(prod.price.toString());
    setFormCategory(prod.category);
    setFormImage(prod.image);
    setFormDescription(prod.description);
    setFormInStock(prod.inStock);
    setIsFormOpen(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formPrice) return;

    const categoryLabels: Record<string, string> = {
      lips: 'Lipstick & Lip Care',
      face: 'Face & Foundation',
      eyes: 'Eyes & Palettes',
      skincare: 'Skincare & Cleansers',
      apparel: 'Clothing',
      organic: 'Food & Grocery',
      decor: 'Home Decor',
      leather: 'Accessories',
    };

    if (editingProduct) {
      onEditProduct({
        ...editingProduct,
        title: formTitle,
        price: Number(formPrice),
        category: formCategory,
        categoryLabel: categoryLabels[formCategory] || 'Cosmetics',
        image: formImage.trim() || editingProduct.image,
        description: formDescription,
        inStock: formInStock,
      });
      showToast('Product updated successfully!');
    } else {
      onAddProduct({
        title: formTitle,
        price: Number(formPrice),
        category: formCategory,
        categoryLabel: categoryLabels[formCategory] || 'Cosmetics',
        image:
          formImage.trim() ||
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        description: formDescription,
        inStock: formInStock,
        rating: 5.0,
        reviewsCount: 1,
        sku: `NJ-${Math.floor(100 + Math.random() * 900)}`,
      });
      showToast('Product saved successfully!');
    }

    setIsFormOpen(false);
  };

  const handleSaveWhatsAppSettings = () => {
    const rawClean = waPhone.replace(/[^0-9]/g, '');
    const newSettings: MerchantSettings = {
      ...merchantSettings,
      whatsappNumber: '880' + (rawClean.startsWith('880') ? rawClean.slice(3) : rawClean),
      displayPhone: `+880 ${waPhone.trim()}`,
      defaultOrderMessageTemplate: waMessageTemplate,
    };
    onUpdateMerchantSettings(newSettings);
    showToast('WhatsApp settings saved!');
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (activeCategoryFilter === 'all') return true;
    return p.category === activeCategoryFilter;
  });

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      orderSearchQuery === '' ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerPhone.includes(orderSearchQuery) ||
      o.productTitle.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalItemsCount = products.length;
  const activeItemsCount = products.filter((p) => p.inStock).length;
  const inTransitOrdersCount = orders.filter((o) => o.status === 'shipped' || o.status === 'out_for_delivery').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  // If user is not logged in as Admin, show embedded Merchant Login Box
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex flex-col w-full px-4 pt-6 pb-32 items-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#5dfd8a]/20 text-[#006d2f] flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">lock_person</span>
          </div>

          <div>
            <span className="font-label-sm text-[10px] text-[#006d2f] uppercase font-bold tracking-wider">
              Emerald Shop Admin
            </span>
            <h2 className="font-headline-md text-lg text-[#131b2e] font-bold mt-0.5">
              Admin Panel Log In (মার্চেন্ট লগইন)
            </h2>
            <p className="font-body-sm text-[12px] text-[#3d4946] mt-1 leading-relaxed">
              প্রোডাক্ট ইনভেন্টরি, অর্ডার ট্র্যাকিং এবং হোয়াটসঅ্যাপ চ্যানেল সেটিংস পরিচালনা করার জন্য মার্চেন্ট অ্যাকাউন্টে লগইন করুন।
            </p>
          </div>

          {/* Embedded Direct Login Form */}
          <form onSubmit={handleEmbeddedLogin} className="w-full flex flex-col gap-3 text-left">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Merchant Email (মার্চেন্ট ইমেইল)
              </label>
              <input
                type="text"
                required
                value={embeddedEmail}
                onChange={(e) => setEmbeddedEmail(e.target.value)}
                className="bg-[#faf8ff] rounded-lg border border-[#eaedff] p-2.5 outline-none font-body-md text-[13px] text-[#131b2e] focus:border-[#00685d]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                Admin Password (পাসওয়ার্ড)
              </label>
              <input
                type="password"
                required
                value={embeddedPassword}
                onChange={(e) => setEmbeddedPassword(e.target.value)}
                className="bg-[#faf8ff] rounded-lg border border-[#eaedff] p-2.5 outline-none font-body-md text-[13px] text-[#131b2e] focus:border-[#00685d]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00685d] hover:bg-[#008376] text-white rounded-xl font-label-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-1"
            >
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
              <span>Log In as Merchant (লগইন করুন)</span>
            </button>
          </form>

          {/* 1-Click Fast Verified Access */}
          <button
            type="button"
            onClick={() => {
              const adminUser: AuthUser = {
                id: 'admin-01',
                name: merchantSettings.merchantName,
                email: 'shanto@emeraldshop.bd',
                phone: merchantSettings.displayPhone,
                role: 'admin',
                avatar:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCCSSfzpZ5464Gj8p7Noe19DkBd-iD59KvkyI5itPuDPZspasm_CPcDAhRn5CtYr8-p9rqNyjiVQ8R3RHxgxlzkXEiWHxHT_Jxy8Zmal6kNFm0A0-bhVLC8DNe46LKoQWzZS74XRWybqz4oa094umrU486siXA1YY8VIrlKtCaXKfUOS4r9qXRlZPpt5G78pFhTGixfCarG0jVHFB_YUt8dTwF1_SlgRzI8XsDOv_SsRIYSvDHVJKkkXA',
                address: merchantSettings.storeAddress,
              };
              onLogin(adminUser);
              showToast('মার্চেন্ট শান্ত রহমান হিসেবে প্রবেশ করা হয়েছে');
            }}
            className="w-full py-2.5 bg-[#5dfd8a]/20 hover:bg-[#5dfd8a]/35 text-[#006d2f] border border-[#5dfd8a]/40 rounded-xl font-label-md text-[12px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>1-Click Fast Login: Shanto Rahman</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('catalog')}
            className="text-[#00685d] font-label-sm text-[12px] font-semibold hover:underline cursor-pointer"
          >
            ← Back to Store Catalog (ক্যাটালগে ফিরুন)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Toast Notification */}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#006d2f] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 transition-all duration-300 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}
      >
        <span className="material-symbols-outlined text-lg">check_circle</span>
        <span className="font-label-sm text-[12px] font-bold">{toastMessage}</span>
      </div>

      {/* Top Banner / Merchant Greeting Card with Clear Log Out Button */}
      <section className="px-4 pt-4 pb-2">
        <div className="bg-[#eaedff] rounded-xl p-4 shadow-xs relative overflow-hidden border border-[#dae2fd]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  alt="Store Owner"
                  className="w-14 h-14 rounded-full object-cover shadow-xs border-2 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCSSfzpZ5464Gj8p7Noe19DkBd-iD59KvkyI5itPuDPZspasm_CPcDAhRn5CtYr8-p9rqNyjiVQ8R3RHxgxlzkXEiWHxHT_Jxy8Zmal6kNFm0A0-bhVLC8DNe46LKoQWzZS74XRWybqz4oa094umrU486siXA1YY8VIrlKtCaXKfUOS4r9qXRlZPpt5G78pFhTGixfCarG0jVHFB_YUt8dTwF1_SlgRzI8XsDOv_SsRIYSvDHVJKkkXA"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#006d2f] rounded-full border-2 border-white"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-[10px] text-[#006d2f] font-bold uppercase tracking-wider">
                  {merchantSettings.merchantRole} (লগইন আছেন)
                </span>
                <h1 className="font-headline-md text-lg text-[#131b2e] truncate font-bold">
                  Store Admin Panel
                </h1>
                <span className="font-body-sm text-[12px] text-[#3d4946] truncate">
                  প্রোডাক্ট ড্যাশবোর্ড • {currentUser?.name || merchantSettings.merchantName} ({currentUser?.email || 'nj639682@gmail.com'})
                </span>
              </div>
            </div>

            {/* Customer Live View & Prominent Red Log Out Button */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => onNavigateTab('catalog')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-[#dae2fd] transition-colors text-[#00685d] shadow-xs cursor-pointer border border-[#eaedff]"
                title="Switch to Customer Storefront"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
                <span className="font-label-sm text-[10px] mt-0.5 font-bold">Live View</span>
              </button>

              <button
                onClick={() => {
                  onLogout();
                  showToast('অ্যাডমিন প্যানেল থেকে সফলভাবে লগআউট হয়েছে');
                }}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] shadow-xs cursor-pointer border border-[#ffdad6] transition-colors"
                title="Log out of Admin"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                <span className="font-label-sm text-[10px] mt-0.5 font-bold">Log Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Counters */}
          <div className="grid grid-cols-4 gap-1.5 mt-3.5">
            <div className="bg-white rounded-lg p-2 shadow-xs flex flex-col items-center text-center border border-[#eaedff]">
              <span className="font-headline-sm text-sm text-[#131b2e] font-bold">
                {totalItemsCount}
              </span>
              <span className="font-label-sm text-[9px] text-[#3d4946] leading-tight mt-0.5">
                Total Products
              </span>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-xs flex flex-col items-center text-center border border-[#eaedff]">
              <span className="font-headline-sm text-sm text-[#00685d] font-bold">
                {orders.length}
              </span>
              <span className="font-label-sm text-[9px] text-[#3d4946] leading-tight mt-0.5">
                Total Orders
              </span>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-xs flex flex-col items-center text-center border border-[#eaedff]">
              <span className="font-headline-sm text-sm text-[#006d2f] font-bold">
                {inTransitOrdersCount}
              </span>
              <span className="font-label-sm text-[9px] text-[#3d4946] leading-tight mt-0.5">
                In Transit
              </span>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-xs flex flex-col items-center text-center border border-[#eaedff]">
              <span className="font-headline-sm text-xs text-[#006d2f] font-bold truncate">
                ৳{totalRevenue.toLocaleString()}
              </span>
              <span className="font-label-sm text-[9px] text-[#3d4946] leading-tight mt-0.5">
                Revenue
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Section Tabs: Products | Orders & Tracking | WhatsApp Settings */}
      <section className="px-4 py-2">
        <div className="flex bg-[#eaedff] p-1 rounded-xl gap-1 border border-[#dae2fd]">
          <button
            onClick={() => setAdminTab('products')}
            className={`flex-1 py-2 rounded-lg font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              adminTab === 'products'
                ? 'bg-white text-[#00685d] shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">inventory_2</span>
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`flex-1 py-2 rounded-lg font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              adminTab === 'orders'
                ? 'bg-white text-[#00685d] shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            <span>Orders & Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('whatsapp')}
            className={`py-2 px-3 rounded-lg font-label-md text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              adminTab === 'whatsapp'
                ? 'bg-white text-[#006d2f] shadow-xs'
                : 'text-[#3d4946] hover:text-[#131b2e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">settings</span>
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 1: PRODUCT MANAGEMENT */}
      {/* ============================================================== */}
      {adminTab === 'products' && (
        <>
          {/* Quick Action & Toggle Section */}
          <section className="px-4 py-1">
            {!isFormOpen ? (
              <button
                onClick={openAddForm}
                className="w-full bg-[#00685d] hover:bg-[#008376] text-white font-label-lg text-sm py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">add_box</span>
                <span>+ Add New Product (নতুন প্রোডাক্ট যুক্ত করুন)</span>
              </button>
            ) : null}
          </section>

          {/* Add / Edit Product Collapsible Panel */}
          {isFormOpen && (
            <section className="px-4 py-2 transition-all duration-300">
              <div className="bg-[#f2f3ff] rounded-xl p-4 shadow-sm border border-[#dae2fd]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#eaedff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00685d] text-xl">
                      {editingProduct ? 'edit_note' : 'post_add'}
                    </span>
                    <h2 className="font-headline-sm text-sm text-[#131b2e] font-bold">
                      {editingProduct ? 'Update Product Card' : 'Create Product Card'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-[#3d4946] hover:text-[#131b2e] p-1 rounded-full hover:bg-[#eaedff] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Pure Sundarban Honey 500g"
                      className="bg-white text-[#131b2e] font-body-md text-[13px] rounded-lg p-2.5 outline-none border border-[#eaedff] focus:border-[#00685d] shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                        Price in BDT (৳) *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-[#006d2f] font-currency-display text-sm font-bold">
                          ৳
                        </span>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="650"
                          className="bg-white text-[#131b2e] font-body-md text-[13px] rounded-lg pl-8 pr-2.5 py-2.5 outline-none border border-[#eaedff] focus:border-[#00685d] shadow-2xs w-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                        Category *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) =>
                          setFormCategory(
                            e.target.value as 'lips' | 'face' | 'eyes' | 'skincare' | 'apparel' | 'organic' | 'decor' | 'leather'
                          )
                        }
                        className="bg-white text-[#131b2e] font-body-md text-[13px] rounded-lg p-2.5 outline-none border border-[#eaedff] focus:border-[#00685d] shadow-2xs h-[42px]"
                      >
                        <option value="lips">Lipsticks & Lip Care (লিপস্টিক ও লিপ গ্লস)</option>
                        <option value="face">Face & Foundation (ফাউন্ডেশন ও কনসিলার)</option>
                        <option value="eyes">Eyes & Palettes (আইশ্যাডো ও মাশকারা)</option>
                        <option value="skincare">Skincare & Cleansers (স্কিনকেয়ার ও সিরাম)</option>
                        <option value="apparel">Apparel & Traditional Wear</option>
                        <option value="organic">Organic Nutrition</option>
                        <option value="decor">Decor & Crafts</option>
                        <option value="leather">Leather Accessories</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                      Product Image URL *
                    </label>
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://..."
                      className="bg-white text-[#131b2e] font-body-sm text-[12px] rounded-lg p-2.5 outline-none border border-[#eaedff] focus:border-[#00685d] shadow-2xs w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                      Description & Highlights
                    </label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Product highlights..."
                      className="bg-white text-[#131b2e] font-body-md text-[13px] rounded-lg p-2.5 outline-none border border-[#eaedff] focus:border-[#00685d] shadow-2xs resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg p-2.5 shadow-xs border border-[#eaedff]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#006d2f] text-base">
                        inventory
                      </span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[11px] text-[#131b2e] font-bold">
                          Stock Availability
                        </span>
                        <span
                          className={`font-body-sm text-[11px] ${
                            formInStock ? 'text-[#006d2f]' : 'text-[#ba1a1a]'
                          }`}
                        >
                          {formInStock ? 'Ready in Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormInStock(!formInStock)}
                      className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                        formInStock ? 'bg-[#006d2f]' : 'bg-[#d2d9f4]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                          formInStock ? 'ml-auto' : 'mr-auto'
                        }`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 bg-[#006d2f] hover:bg-[#005322] text-white py-2.5 px-4 rounded-xl font-label-lg text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">publish</span>
                      <span>Publish to Store</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="bg-[#eaedff] hover:bg-[#dae2fd] text-[#3d4946] py-2.5 px-4 rounded-xl font-label-md text-[13px] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </section>
          )}

          {/* Catalog Filter Chips */}
          <section className="px-4 pt-3 pb-1 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00685d] text-xl">
                  inventory
                </span>
                <h2 className="font-headline-sm text-sm text-[#131b2e] font-bold">
                  Active Store Inventory
                </h2>
              </div>
              <span className="font-label-sm text-[10px] text-[#3d4946] bg-[#eaedff] px-2 py-0.5 rounded-full font-semibold">
                {filteredProducts.length} Items Loaded
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`rounded-full px-3 py-1 font-label-sm text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#00685d] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#3d4946] hover:bg-[#e2e7ff]'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('lips')}
                className={`rounded-full px-3 py-1 font-label-sm text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === 'lips'
                    ? 'bg-[#00685d] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#3d4946] hover:bg-[#e2e7ff]'
                }`}
              >
                Lipsticks ({products.filter((p) => p.category === 'lips').length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('face')}
                className={`rounded-full px-3 py-1 font-label-sm text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === 'face'
                    ? 'bg-[#00685d] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#3d4946] hover:bg-[#e2e7ff]'
                }`}
              >
                Face & Base ({products.filter((p) => p.category === 'face').length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('eyes')}
                className={`rounded-full px-3 py-1 font-label-sm text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === 'eyes'
                    ? 'bg-[#00685d] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#3d4946] hover:bg-[#e2e7ff]'
                }`}
              >
                Eyes & Palettes ({products.filter((p) => p.category === 'eyes').length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('skincare')}
                className={`rounded-full px-3 py-1 font-label-sm text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  activeCategoryFilter === 'skincare'
                    ? 'bg-[#00685d] text-white shadow-xs'
                    : 'bg-[#eaedff] text-[#3d4946] hover:bg-[#e2e7ff]'
                }`}
              >
                Skincare ({products.filter((p) => p.category === 'skincare').length})
              </button>
            </div>
          </section>

          {/* Products List Cards */}
          <section className="px-4 flex flex-col gap-2.5 pb-4">
            {filteredProducts.map((prod) => (
              <article
                key={prod.id}
                className="bg-white rounded-xl p-2.5 shadow-xs flex items-center justify-between gap-3 border border-[#eaedff] hover:border-[#dae2fd] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-[#eaedff] border border-[#eaedff]"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleStock(prod.id)}
                        className={`font-label-sm text-[10px] px-1.5 py-0.5 rounded-md font-bold cursor-pointer transition-colors ${
                          prod.inStock
                            ? 'bg-[#5dfd8a]/40 text-[#007232] hover:bg-[#5dfd8a]/60'
                            : 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]/80'
                        }`}
                        title="Click to toggle stock"
                      >
                        {prod.inStock ? 'In Stock (Active)' : 'Out of Stock'}
                      </button>
                      <span className="font-label-sm text-[11px] text-[#3d4946] flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">visibility</span>{' '}
                        {prod.views}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-[13px] text-[#131b2e] font-semibold truncate mt-0.5">
                      {prod.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-currency-display text-sm font-bold text-[#006d2f]">
                        ৳{prod.price.toLocaleString()}
                      </span>
                      <span className="font-label-sm text-[11px] text-[#3d4946]">
                        • {prod.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => openEditForm(prod)}
                    title="Edit Product"
                    className="w-8 h-8 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#00685d] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setProductToDelete(prod)}
                    title="Delete Product"
                    className="w-8 h-8 rounded-lg bg-[#ffdad6]/40 hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: ORDERS & REAL-TIME ORDER TRACKING MANAGEMENT */}
      {/* ============================================================== */}
      {adminTab === 'orders' && (
        <section className="px-4 py-2 flex flex-col gap-3">
          {/* Order Search & Filters */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 bg-white rounded-xl border border-[#dae2fd] flex items-center">
                <span className="material-symbols-outlined text-[#6d7a77] text-base pl-3">
                  search
                </span>
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search order by ID, customer name, or phone..."
                  className="w-full bg-transparent p-2.5 outline-none font-body-sm text-[12px] text-[#131b2e]"
                />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery('')}
                    className="p-2 text-[#6d7a77] hover:text-[#131b2e] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-[11px]">
              <button
                onClick={() => setOrderStatusFilter('all')}
                className={`rounded-full px-3 py-1 font-label-sm font-semibold transition-all cursor-pointer ${
                  orderStatusFilter === 'all'
                    ? 'bg-[#00685d] text-white shadow-2xs'
                    : 'bg-[#eaedff] text-[#3d4946]'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('shipped')}
                className={`rounded-full px-3 py-1 font-label-sm font-semibold transition-all cursor-pointer ${
                  orderStatusFilter === 'shipped'
                    ? 'bg-[#00685d] text-white shadow-2xs'
                    : 'bg-[#eaedff] text-[#3d4946]'
                }`}
              >
                Shipped ({orders.filter((o) => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('out_for_delivery')}
                className={`rounded-full px-3 py-1 font-label-sm font-semibold transition-all cursor-pointer ${
                  orderStatusFilter === 'out_for_delivery'
                    ? 'bg-[#00685d] text-white shadow-2xs'
                    : 'bg-[#eaedff] text-[#3d4946]'
                }`}
              >
                Out for Delivery ({orders.filter((o) => o.status === 'out_for_delivery').length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('delivered')}
                className={`rounded-full px-3 py-1 font-label-sm font-semibold transition-all cursor-pointer ${
                  orderStatusFilter === 'delivered'
                    ? 'bg-[#00685d] text-white shadow-2xs'
                    : 'bg-[#eaedff] text-[#3d4946]'
                }`}
              >
                Delivered ({orders.filter((o) => o.status === 'delivered').length})
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="flex flex-col gap-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-[#6d7a77] border border-[#eaedff]">
                <span className="material-symbols-outlined text-3xl mb-1 text-[#dae2fd]">
                  inbox
                </span>
                <p className="font-body-sm text-[13px]">No orders matching your search.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-xs flex flex-col gap-3"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-sm font-bold text-[#131b2e] font-mono">
                        #{order.id}
                      </span>
                      <span className="font-body-sm text-[11px] text-[#6d7a77]">
                        {order.createdAt}
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigateTrackOrder(order.id)}
                      className="flex items-center gap-1 text-[#00685d] hover:underline font-label-sm text-[11px] font-bold cursor-pointer"
                    >
                      <span>Public Tracker</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  </div>

                  {/* Customer & Product info row */}
                  <div className="flex items-start gap-3">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-14 h-14 rounded-lg object-cover bg-[#faf8ff] border border-[#eaedff] flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <h4 className="font-headline-sm text-[13px] text-[#131b2e] font-bold truncate">
                        {order.productTitle}
                      </h4>
                      <span className="font-body-sm text-[11px] text-[#131b2e] font-medium">
                        Customer: {order.customerName} ({order.customerPhone})
                      </span>
                      <span className="font-body-sm text-[11px] text-[#6d7a77] line-clamp-1">
                        Address: {order.customerAddress}
                      </span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="font-currency-display text-sm font-bold text-[#006d2f]">
                        ৳{order.totalAmount.toLocaleString()}
                      </span>
                      <span className="font-label-sm text-[10px] text-[#6d7a77]">
                        COD Total
                      </span>
                    </div>
                  </div>

                  {/* Tracking Status Update Bar */}
                  <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#eaedff] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                        Update Tracking Status:
                      </span>
                      <span className="font-label-sm text-[10px] text-[#6d7a77]">
                        Live update for customer
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* Status Dropdown */}
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as OrderStatus;
                          onUpdateOrderStatus(order.id, newStatus, order.courierName, order.consignmentId);
                          showToast(`Order #${order.id} status updated to ${newStatus}`);
                        }}
                        className="bg-white text-[#131b2e] font-body-sm text-[12px] rounded-lg p-2 border border-[#dae2fd] outline-none font-semibold"
                      >
                        <option value="placed">1. Placed (গৃহীত)</option>
                        <option value="confirmed">2. Confirmed (নিশ্চিত)</option>
                        <option value="packaging">3. Packaging (প্যাকিং)</option>
                        <option value="shipped">4. Shipped (কুরিয়ারে)</option>
                        <option value="out_for_delivery">5. Out for Delivery</option>
                        <option value="delivered">6. Delivered (ডেলিভারড)</option>
                        <option value="cancelled">Cancelled (বাতিল)</option>
                      </select>

                      {/* Courier Partner */}
                      <select
                        value={order.courierName || 'Steadfast Courier'}
                        onChange={(e) => {
                          onUpdateOrderStatus(order.id, order.status, e.target.value, order.consignmentId);
                          showToast('Courier partner updated');
                        }}
                        className="bg-white text-[#131b2e] font-body-sm text-[12px] rounded-lg p-2 border border-[#dae2fd] outline-none"
                      >
                        <option value="Steadfast Courier">Steadfast Courier</option>
                        <option value="Pathao Express">Pathao Express</option>
                        <option value="RedX Delivery">RedX Delivery</option>
                        <option value="Paperfly">Paperfly</option>
                        <option value="In-House Dhaka Rider">In-House Rider</option>
                      </select>

                      {/* Consignment ID */}
                      <input
                        type="text"
                        value={order.consignmentId || ''}
                        placeholder="Consignment (e.g. SF-984210)"
                        onChange={(e) => {
                          onUpdateOrderStatus(order.id, order.status, order.courierName, e.target.value);
                        }}
                        className="bg-white text-[#131b2e] font-body-sm text-[12px] rounded-lg p-2 border border-[#dae2fd] outline-none font-mono"
                      />
                    </div>

                    {/* WhatsApp Update Link to Customer */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-body-sm text-[11px] text-[#6d7a77]">
                        Notify customer directly:
                      </span>
                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${order.customerName}! Your Emerald Shop order #${order.id} for "${order.productTitle}" is now: ${order.status.toUpperCase()}.\nCourier: ${order.courierName || 'Steadfast'}\nConsignment ID: ${order.consignmentId || 'Pending'}\nTrack link: ${window.location.origin}/track?id=${order.id}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#006d2f] hover:underline font-label-sm text-[11px] font-bold"
                      >
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          chat
                        </span>
                        <span>Send WhatsApp Tracking Alert</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: STORE WHATSAPP SETUP */}
      {/* ============================================================== */}
      {adminTab === 'whatsapp' && (
        <section className="px-4 py-2">
          <div className="bg-[#eaedff] rounded-xl p-4 shadow-xs border border-[#dae2fd]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006d2f] text-2xl">
                  mark_chat_unread
                </span>
                <div>
                  <h3 className="font-headline-sm text-sm text-[#131b2e] font-bold">
                    Store WhatsApp Setup
                  </h3>
                  <span className="font-body-sm text-[11px] text-[#3d4946]">
                    Customer Order Channel Configuration
                  </span>
                </div>
              </div>
              <span className="bg-[#5dfd8a] text-[#007232] px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#006d2f] animate-pulse"></span> Live
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                  Business Phone (WhatsApp)
                </label>
                <div className="flex items-center bg-white rounded-lg p-2 border border-[#dae2fd] shadow-2xs">
                  <span className="font-label-md text-xs text-[#00685d] font-bold mr-2">
                    +880
                  </span>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="1712-345678"
                    className="font-body-md text-[13px] text-[#131b2e] outline-none w-full bg-transparent"
                  />
                  <span className="material-symbols-outlined text-[#006d2f] text-base">
                    verified
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-[11px] text-[#3d4946] font-bold">
                  Default Pre-filled Order Message
                </label>
                <div className="bg-white rounded-lg p-2.5 border border-[#dae2fd] shadow-2xs">
                  <textarea
                    rows={2}
                    value={waMessageTemplate}
                    onChange={(e) => setWaMessageTemplate(e.target.value)}
                    className="w-full font-body-sm text-[12px] text-[#131b2e] bg-transparent outline-none resize-none font-mono"
                  />
                </div>
                <span className="text-[10px] text-[#6d7a77]">
                  Tags available: {'{PRODUCT_TITLE}'}, {'{PRICE}'}
                </span>
              </div>

              <button
                onClick={handleSaveWhatsAppSettings}
                className="w-full bg-[#dae2fd] hover:bg-[#d2d9f4] text-[#131b2e] font-label-lg text-sm py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-lg text-[#006d2f]">save</span>
                <span>Update WhatsApp Settings</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm flex flex-col items-center text-center border border-[#eaedff]">
            <div className="w-14 h-14 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
            </div>
            <h3 className="font-headline-sm text-base text-[#131b2e] font-bold">
              Delete Product?
            </h3>
            <p className="font-body-sm text-[12px] text-[#3d4946] mt-1 mb-4 leading-relaxed">
              Are you sure you want to remove{' '}
              <strong className="text-[#131b2e] font-semibold">
                "{productToDelete.title}"
              </strong>{' '}
              from the live storefront? This action cannot be undone.
            </p>
            <div className="flex w-full gap-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-[#eaedff] text-[#3d4946] py-2.5 rounded-xl font-label-md text-[13px] hover:bg-[#dae2fd] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  showToast('Item removed from catalog');
                  setProductToDelete(null);
                }}
                className="flex-1 bg-[#ba1a1a] text-white py-2.5 rounded-xl font-label-md text-[13px] font-bold shadow-sm active:opacity-90 transition-opacity cursor-pointer"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
