// ═══════════════════════════════════════════════════════════════════════════════
// API CLIENT - S OPRAVOU URL DUPLIKÁCIE
// ═══════════════════════════════════════════════════════════════════════════════

// OPRAVA: Správne spracovanie URL - zabezpečí že vždy končí na /api/v1
function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  // Ak URL končí na /api/v1, ponecháme ju
  if (envUrl.endsWith('/api/v1')) {
    return envUrl;
  }
  // Inak pridáme /api/v1
  return envUrl.replace(/\/$/, '') + '/api/v1';
}

const API_URL = getApiUrl();

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; refresh_token?: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    if (data.refresh_token && typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    return data;
  }

  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Products
  async getProducts(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<{ products: any[]; total: number; page: number; per_page: number; total_pages: number }>(
      `/products${query ? `?${query}` : ''}`
    );
  }

  async getProduct(slug: string) {
    return this.request<any>(`/products/${slug}`);
  }

  async searchProducts(q: string) {
    return this.request<any[]>(`/search?q=${encodeURIComponent(q)}`);
  }

  // Admin Products
  async adminGetProducts(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<{ products: any[]; total: number; page: number; per_page: number; total_pages: number }>(
      `/admin/products${query ? `?${query}` : ''}`
    );
  }

  async adminGetProduct(id: string) {
    return this.request<any>(`/admin/products/${id}`);
  }

  async createProduct(product: any) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: any) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkProductAction(ids: string[], action: string) {
    return this.request('/admin/products/bulk-action', {
      method: 'POST',
      body: JSON.stringify({ ids, action }),
    });
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async adminGetCategories() {
    return this.request<any[]>('/admin/categories');
  }

  async createCategory(category: any) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: any) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Feeds
  async getFeeds() {
    return this.request<any[]>('/admin/feeds');
  }

  async getFeed(id: string) {
    return this.request<any>(`/admin/feeds/${id}`);
  }

  async createFeed(feed: any) {
    return this.request('/admin/feeds', {
      method: 'POST',
      body: JSON.stringify(feed),
    });
  }

  async updateFeed(id: string, feed: any) {
    return this.request(`/admin/feeds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feed),
    });
  }

  async deleteFeed(id: string) {
    return this.request(`/admin/feeds/${id}`, {
      method: 'DELETE',
    });
  }

  async previewFeed(url: string, type: string, xmlItemPath?: string, csvDelimiter?: string) {
    return this.request<{
      items: any[];
      fields: string[];
      total_count: number;
      item_path: string;
      feed_type: string;
    }>('/admin/feeds/preview', {
      method: 'POST',
      body: JSON.stringify({ url, type, xml_item_path: xmlItemPath, csv_delimiter: csvDelimiter }),
    });
  }

  async autoMapping(fields: string[]) {
    return this.request<{ source_field: string; target_field: string; confidence: number }[]>(
      '/admin/feeds/auto-mapping',
      {
        method: 'POST',
        body: JSON.stringify({ fields }),
      }
    );
  }

  async startImport(feedId: string) {
    return this.request<{ status: string; feed_id: string }>(`/admin/feeds/${feedId}/import`, {
      method: 'POST',
    });
  }

  async stopImport(feedId: string) {
    return this.request(`/admin/feeds/${feedId}/stop`, {
      method: 'POST',
    });
  }

  async getImportProgress(feedId: string) {
    return this.request<{
      feed_id: string;
      history_id: string;
      status: string;
      percent: number;
      total: number;
      processed: number;
      created: number;
      updated: number;
      skipped: number;
      errors: number;
      message: string;
      elapsed: number;
      eta: number;
      speed: number;
      logs: { time: string; level: string; message: string }[];
    }>(`/admin/feeds/${feedId}/progress`);
  }

  async getImportHistory(feedId: string) {
    return this.request<any[]>(`/admin/feeds/${feedId}/history`);
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<{
      total_products: number;
      total_categories: number;
      total_feeds: number;
      total_views: number;
      total_clicks: number;
    }>('/admin/stats');
  }

  async getRecentActivity() {
    return this.request<any[]>('/admin/recent-activity');
  }

  // Shop Config
  async getShopConfig() {
    return this.request<any>('/admin/shop-config');
  }

  async updateShopConfig(config: any) {
    return this.request('/admin/shop-config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }
}

export const api = new ApiClient();
export default api;

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL EXPORTS FOR COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════════════

// TokenManager for dashboard/layout.tsx
export const TokenManager = {
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  setUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
  isAuthenticated: () => !!TokenManager.getToken(),
  getCurrentShop: (): Shop | null => {
    if (typeof window !== 'undefined') {
      const shop = localStorage.getItem('currentShop');
      return shop ? JSON.parse(shop) : null;
    }
    return null;
  },
  setCurrentShop: (shop: Shop | null) => {
    if (typeof window !== 'undefined') {
      if (shop) {
        localStorage.setItem('currentShop', JSON.stringify(shop));
      } else {
        localStorage.removeItem('currentShop');
      }
    }
  },
};

// Shop interface
export interface Shop {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logo?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// AuthAPI for register/page.tsx
export const AuthAPI = {
  login: async (email: string, password: string) => {
    return api.login(email, password);
  },
  register: async (email: string, password: string, name: string) => {
    return api.register(email, password, name);
  },
  logout: () => {
    api.clearToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('refresh_token');
    }
  },
};
