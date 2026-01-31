export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  is_active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  product_count?: number;
  is_active?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  is_active?: boolean;
}

export interface Feed {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
