export interface Product {
  id: string;
  title: string;
  bengaliTitle?: string;
  category: 'lips' | 'face' | 'eyes' | 'skincare' | 'apparel' | 'organic' | 'decor' | 'leather';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  galleryImages?: string[];
  inStock: boolean;
  stockCount?: number;
  isLowStock?: boolean;
  views: number;
  sku: string;
  description: string;
  bengaliDesc?: string;
  specifications?: Record<string, string>;
  sizeDimensions?: Array<{
    size: string;
    chest: string;
    length: string;
    sleeve: string;
  }>;
  sizes?: Array<{
    code: string;
    label: string;
  }>;
}

export interface MerchantSettings {
  whatsappNumber: string;
  displayPhone: string;
  defaultOrderMessageTemplate: string;
  storeName: string;
  storeBengaliName: string;
  storeAddress: string;
  customerCareHours: string;
  merchantName: string;
  merchantRole: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar?: string;
  address?: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packaging'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderTrackingStep {
  title: string;
  bengaliTitle: string;
  time?: string;
  completed: boolean;
  current?: boolean;
  description: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productSize?: string;
  price: number;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  courierName?: string;
  consignmentId?: string;
  estimatedDeliveryDate?: string;
  notes?: string;
}


