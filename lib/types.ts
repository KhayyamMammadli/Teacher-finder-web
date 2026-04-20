export type UserRole = "customer" | "shop_owner" | "admin";

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: string;
  // joined
  shopName?: string;
  instagramUrl?: string | null;
  whatsapp?: string | null;
  shopLocation?: string | null;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  slug: string | null;
  description: string | null;
  category: string;
  instagramUrl: string | null;
  whatsapp: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  location: string | null;
  deliveryInfo: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  productCount?: number;
  products?: Product[];
}

export type OrderStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  shopId: string;
  productId: string | null;
  productName: string | null;
  customerName: string;
  customerPhone: string | null;
  customerInstagram: string | null;
  note: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  authProvider?: string | null;
  instagramUsername?: string | null;
  profileImageUrl?: string | null;
}

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
}
