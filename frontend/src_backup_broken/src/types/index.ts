export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  category_id?: string;
  stock?: number;
  is_active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  product_count?: number;
  is_active?: boolean;
  children?: Category[];
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  is_active?: boolean;
}

export interface Feed {
  id: string;
  name: string;
  url: string;
  type: string;
  vendor_id?: string;
  status?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export function getRatingStars(rating: number): string {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '*'.repeat(full) + '-'.repeat(empty);
}

export function getStockLabel(stock: number): string {
  if (stock <= 0) return 'Out of stock';
  if (stock < 10) return 'Low stock';
  return 'In stock';
}

export function getStockIcon(stock: number): string {
  if (stock <= 0) return 'X';
  if (stock < 10) return '!';
  return 'OK';
}

export function getDiscountPercentage(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}
