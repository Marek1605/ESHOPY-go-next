// ═══════════════════════════════════════════════════════════════════════════════
// PROFESIONÁLNA API VRSTVA - E-SHOP BUILDER
// Error handling, token management, typed responses
// ═══════════════════════════════════════════════════════════════════════════════

// Získanie base URL bez duplikácie /api/v1
function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || '';
  // Odstráň trailing /api/v1 ak existuje
  return envUrl.replace(/\/api\/v1\/?$/, '') || 'http://localhost:8080';
}

const BASE_URL = getBaseUrl();

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin';
  plan: 'starter' | 'pro' | 'enterprise';
  isActive: boolean;
  shopsCount?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  status: 'active' | 'inactive' | 'suspended';
  template: string;
  settings: ShopSettings;
  stats?: ShopStats;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSettings {
  currency: string;
  language: string;
  timezone: string;
  taxRate: number;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: number;
  };
}

export interface ShopStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  sku: string;
  barcode?: string;
  stock: number;
  weight?: number;
  categoryId?: string;
  category?: Category;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  tags: string[];
  seo?: {
    title: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  order: number;
  productsCount?: number;
}

export interface Order {
  id: string;
  shopId: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    ico?: string;
    dic?: string;
    icDph?: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface ShippingMethod {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  freeFrom?: number;
  estimatedDays: string;
  type: 'courier' | 'pickup' | 'store' | 'packeta' | 'post';
  carrier?: string;
  enabled: boolean;
  countries: string[];
  order: number;
}

export interface PaymentMethod {
  id: string;
  shopId: string;
  name: string;
  type: 'card' | 'bank_transfer' | 'cod' | 'gopay' | 'stripe' | 'comgate' | 'paypal';
  description: string;
  enabled: boolean;
  testMode: boolean;
  fees?: string;
  settings: Record<string, any>;
  order: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  ok: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(user));
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('current_shop');
  },

  isAuthenticated: (): boolean => {
    return !!TokenManager.getToken();
  },

  getCurrentShop: (): Shop | null => {
    if (typeof window === 'undefined') return null;
    try {
      const shop = localStorage.getItem('current_shop');
      return shop ? JSON.parse(shop) : null;
    } catch {
      return null;
    }
  },

  setCurrentShop: (shop: Shop): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('current_shop', JSON.stringify(shop));
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// API REQUEST HELPER
// ═══════════════════════════════════════════════════════════════════════════════

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Ensure endpoint starts with /api/v1
  const path = endpoint.startsWith('/api/v1') ? endpoint : `/api/v1${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = TokenManager.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('JSON Parse Error:', text);
          return {
            status: response.status,
            ok: false,
            error: 'Server vrátil neplatnú odpoveď',
          };
        }
      }
    } else {
      const text = await response.text();
      if (!response.ok) {
        return {
          status: response.status,
          ok: false,
          error: text || `HTTP Error: ${response.status}`,
        };
      }
      data = { message: text };
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        // Retry request with new token
        return apiRequest<T>(endpoint, options);
      } else {
        TokenManager.clear();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    if (!response.ok) {
      return {
        status: response.status,
        ok: false,
        error: data?.error || data?.message || `Chyba: ${response.status}`,
      };
    }

    return {
      status: response.status,
      ok: true,
      data,
    };
  } catch (error: any) {
    console.error('API Error:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        status: 0,
        ok: false,
        error: 'Nepodarilo sa pripojiť k serveru. Skontrolujte internetové pripojenie.',
      };
    }

    return {
      status: 0,
      ok: false,
      error: error.message || 'Nastala neočakávaná chyba',
    };
  }
}

async function refreshAuthToken(): Promise<boolean> {
  const refreshToken = TokenManager.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    TokenManager.setToken(data.token);
    TokenManager.setRefreshToken(data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH API
// ═══════════════════════════════════════════════════════════════════════════════

export const AuthAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok && response.data) {
      TokenManager.setToken(response.data.token);
      TokenManager.setRefreshToken(response.data.refresh_token);
      TokenManager.setUser(response.data.user);
    }

    return response;
  },

  register: async (email: string, password: string, name: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.ok && response.data) {
      TokenManager.setToken(response.data.token);
      TokenManager.setRefreshToken(response.data.refresh_token);
      TokenManager.setUser(response.data.user);
    }

    return response;
  },

  logout: (): void => {
    TokenManager.clear();
  },

  me: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/me');
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHOPS API
// ═══════════════════════════════════════════════════════════════════════════════

export const ShopsAPI = {
  list: async (): Promise<ApiResponse<Shop[]>> => {
    return apiRequest<Shop[]>('/shops');
  },

  get: async (id: string): Promise<ApiResponse<Shop>> => {
    return apiRequest<Shop>(`/shops/${id}`);
  },

  create: async (shop: Partial<Shop>): Promise<ApiResponse<Shop>> => {
    return apiRequest<Shop>('/shops', {
      method: 'POST',
      body: JSON.stringify(shop),
    });
  },

  update: async (id: string, shop: Partial<Shop>): Promise<ApiResponse<Shop>> => {
    return apiRequest<Shop>(`/shops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(shop),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/shops/${id}`, { method: 'DELETE' });
  },

  getStats: async (shopId: string): Promise<ApiResponse<ShopStats>> => {
    return apiRequest<ShopStats>(`/shops/${shopId}/stats`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCTS API
// ═══════════════════════════════════════════════════════════════════════════════

export const ProductsAPI = {
  list: async (shopId: string, params?: Record<string, string>): Promise<ApiResponse<{ products: Product[]; total: number }>> => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/shops/${shopId}/products${query}`);
  },

  get: async (shopId: string, id: string): Promise<ApiResponse<Product>> => {
    return apiRequest<Product>(`/shops/${shopId}/products/${id}`);
  },

  create: async (shopId: string, product: Partial<Product>): Promise<ApiResponse<Product>> => {
    return apiRequest<Product>(`/shops/${shopId}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (shopId: string, id: string, product: Partial<Product>): Promise<ApiResponse<Product>> => {
    return apiRequest<Product>(`/shops/${shopId}/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: async (shopId: string, id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/shops/${shopId}/products/${id}`, { method: 'DELETE' });
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ORDERS API
// ═══════════════════════════════════════════════════════════════════════════════

export const OrdersAPI = {
  list: async (shopId: string, params?: Record<string, string>): Promise<ApiResponse<{ orders: Order[]; total: number }>> => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/shops/${shopId}/orders${query}`);
  },

  get: async (shopId: string, id: string): Promise<ApiResponse<Order>> => {
    return apiRequest<Order>(`/shops/${shopId}/orders/${id}`);
  },

  update: async (shopId: string, id: string, order: Partial<Order>): Promise<ApiResponse<Order>> => {
    return apiRequest<Order>(`/shops/${shopId}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  },

  cancel: async (shopId: string, id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/shops/${shopId}/orders/${id}`, { method: 'DELETE' });
  },

  createPublic: async (shopSlug: string, order: any): Promise<ApiResponse<Order>> => {
    return apiRequest<Order>(`/shop/${shopSlug}/orders`, {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHIPPING API
// ═══════════════════════════════════════════════════════════════════════════════

export const ShippingAPI = {
  list: async (shopId: string): Promise<ApiResponse<ShippingMethod[]>> => {
    return apiRequest<ShippingMethod[]>(`/shops/${shopId}/shipping-methods`);
  },

  create: async (shopId: string, method: Partial<ShippingMethod>): Promise<ApiResponse<ShippingMethod>> => {
    return apiRequest<ShippingMethod>(`/shops/${shopId}/shipping-methods`, {
      method: 'POST',
      body: JSON.stringify(method),
    });
  },

  update: async (shopId: string, id: string, method: Partial<ShippingMethod>): Promise<ApiResponse<ShippingMethod>> => {
    return apiRequest<ShippingMethod>(`/shops/${shopId}/shipping-methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(method),
    });
  },

  delete: async (shopId: string, id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/shops/${shopId}/shipping-methods/${id}`, { method: 'DELETE' });
  },

  getPublic: async (shopSlug: string): Promise<ApiResponse<ShippingMethod[]>> => {
    return apiRequest<ShippingMethod[]>(`/shop/${shopSlug}/shipping-methods`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS API
// ═══════════════════════════════════════════════════════════════════════════════

export const PaymentsAPI = {
  list: async (shopId: string): Promise<ApiResponse<PaymentMethod[]>> => {
    return apiRequest<PaymentMethod[]>(`/shops/${shopId}/payment-methods`);
  },

  create: async (shopId: string, method: Partial<PaymentMethod>): Promise<ApiResponse<PaymentMethod>> => {
    return apiRequest<PaymentMethod>(`/shops/${shopId}/payment-methods`, {
      method: 'POST',
      body: JSON.stringify(method),
    });
  },

  update: async (shopId: string, id: string, method: Partial<PaymentMethod>): Promise<ApiResponse<PaymentMethod>> => {
    return apiRequest<PaymentMethod>(`/shops/${shopId}/payment-methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(method),
    });
  },

  delete: async (shopId: string, id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/shops/${shopId}/payment-methods/${id}`, { method: 'DELETE' });
  },

  getPublic: async (shopSlug: string): Promise<ApiResponse<PaymentMethod[]>> => {
    return apiRequest<PaymentMethod[]>(`/shop/${shopSlug}/payment-methods`);
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES API
// ═══════════════════════════════════════════════════════════════════════════════

export const CategoriesAPI = {
  list: async (shopId: string): Promise<ApiResponse<Category[]>> => {
    return apiRequest<Category[]>(`/shops/${shopId}/categories`);
  },

  create: async (shopId: string, category: Partial<Category>): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(`/shops/${shopId}/categories`, {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  update: async (shopId: string, id: string, category: Partial<Category>): Promise<ApiResponse<Category>> => {
    return apiRequest<Category>(`/shops/${shopId}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  delete: async (shopId: string, id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/shops/${shopId}/categories/${id}`, { method: 'DELETE' });
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS API
// ═══════════════════════════════════════════════════════════════════════════════

export const SettingsAPI = {
  get: async (shopId: string): Promise<ApiResponse<ShopSettings>> => {
    return apiRequest<ShopSettings>(`/shops/${shopId}/settings`);
  },

  update: async (shopId: string, settings: Partial<ShopSettings>): Promise<ApiResponse<ShopSettings>> => {
    return apiRequest<ShopSettings>(`/shops/${shopId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC SHOP API (for storefront)
// ═══════════════════════════════════════════════════════════════════════════════

export const PublicShopAPI = {
  getShop: async (slug: string): Promise<ApiResponse<Shop>> => {
    return apiRequest<Shop>(`/shop/${slug}`);
  },

  getProducts: async (slug: string, params?: Record<string, string>): Promise<ApiResponse<{ products: Product[]; total: number }>> => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/shop/${slug}/products${query}`);
  },

  getProduct: async (slug: string, productSlug: string): Promise<ApiResponse<Product>> => {
    return apiRequest<Product>(`/shop/${slug}/product/${productSlug}`);
  },

  getCategories: async (slug: string): Promise<ApiResponse<Category[]>> => {
    return apiRequest<Category[]>(`/shop/${slug}/categories`);
  },
};

export default apiRequest;
