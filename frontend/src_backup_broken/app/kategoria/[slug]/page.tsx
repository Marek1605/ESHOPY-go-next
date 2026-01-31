'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Types
interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  vendor: string;
  vendorSlug: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  freeShipping?: boolean;
  deliveryDays: number;
  specs?: Record<string, string>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  children?: Category[];
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface Filter {
  id: string;
  name: string;
  type: 'checkbox' | 'range' | 'rating';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

// Mock category data
const mockCategory: Category = {
  id: 'cat1',
  name: 'Mobilné telefóny',
  slug: 'mobilne-telefony',
  description: 'Najnovšie smartfóny od popredných značiek. Vyberte si z ponuky iPhone, Samsung, Xiaomi a ďalších.',
  image: '/categories/phones.jpg',
  productCount: 156,
  children: [
    { id: 'cat1-1', name: 'iPhone', slug: 'iphone', description: '', image: '', productCount: 24 },
    { id: 'cat1-2', name: 'Samsung', slug: 'samsung', description: '', image: '', productCount: 32 },
    { id: 'cat1-3', name: 'Xiaomi', slug: 'xiaomi', description: '', image: '', productCount: 28 },
    { id: 'cat1-4', name: 'Google Pixel', slug: 'google-pixel', description: '', image: '', productCount: 8 },
    { id: 'cat1-5', name: 'OnePlus', slug: 'oneplus', description: '', image: '', productCount: 12 },
  ],
};

// Mock filters
const mockFilters: Filter[] = [
  {
    id: 'brand',
    name: 'Značka',
    type: 'checkbox',
    options: [
      { id: 'apple', label: 'Apple', count: 24 },
      { id: 'samsung', label: 'Samsung', count: 32 },
      { id: 'xiaomi', label: 'Xiaomi', count: 28 },
      { id: 'google', label: 'Google', count: 8 },
      { id: 'oneplus', label: 'OnePlus', count: 12 },
      { id: 'huawei', label: 'Huawei', count: 15 },
    ],
  },
  {
    id: 'price',
    name: 'Cena',
    type: 'range',
    min: 0,
    max: 2000,
  },
  {
    id: 'rating',
    name: 'Hodnotenie',
    type: 'rating',
  },
  {
    id: 'memory',
    name: 'Pamäť',
    type: 'checkbox',
    options: [
      { id: '64gb', label: '64 GB', count: 18 },
      { id: '128gb', label: '128 GB', count: 45 },
      { id: '256gb', label: '256 GB', count: 52 },
      { id: '512gb', label: '512 GB', count: 28 },
      { id: '1tb', label: '1 TB', count: 13 },
    ],
  },
  {
    id: 'color',
    name: 'Farba',
    type: 'checkbox',
    options: [
      { id: 'black', label: 'Čierna', count: 89 },
      { id: 'white', label: 'Biela', count: 45 },
      { id: 'blue', label: 'Modrá', count: 32 },
      { id: 'gold', label: 'Zlatá', count: 18 },
      { id: 'purple', label: 'Fialová', count: 12 },
    ],
  },
  {
    id: 'availability',
    name: 'Dostupnosť',
    type: 'checkbox',
    options: [
      { id: 'instock', label: 'Skladom', count: 124 },
      { id: 'preorder', label: 'Na objednávku', count: 32 },
    ],
  },
];

// Mock products
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'iphone-15-pro-max-256gb',
    image: '/products/iphone15.jpg',
    price: 1299.00,
    originalPrice: 1449.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    isNew: true,
    freeShipping: true,
    deliveryDays: 1,
    specs: { memory: '256 GB', color: 'Natural Titanium' },
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    image: '/products/samsung-s24.jpg',
    price: 1449.00,
    vendor: 'Samsung Shop',
    vendorSlug: 'samsung-shop',
    rating: 4.8,
    reviewCount: 189,
    inStock: true,
    isBestseller: true,
    freeShipping: true,
    deliveryDays: 1,
    specs: { memory: '512 GB', color: 'Titanium Black' },
  },
  {
    id: 'p3',
    name: 'Xiaomi 14 Ultra 512GB Black',
    slug: 'xiaomi-14-ultra-512gb',
    image: '/products/xiaomi-14.jpg',
    price: 1199.00,
    originalPrice: 1299.00,
    vendor: 'Mi Store',
    vendorSlug: 'mi-store',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    freeShipping: true,
    deliveryDays: 2,
    specs: { memory: '512 GB', color: 'Black' },
  },
  {
    id: 'p4',
    name: 'Google Pixel 8 Pro 256GB Obsidian',
    slug: 'google-pixel-8-pro-256gb',
    image: '/products/pixel-8.jpg',
    price: 999.00,
    vendor: 'Google Store',
    vendorSlug: 'google-store',
    rating: 4.6,
    reviewCount: 98,
    inStock: true,
    isNew: true,
    deliveryDays: 3,
    specs: { memory: '256 GB', color: 'Obsidian' },
  },
  {
    id: 'p5',
    name: 'OnePlus 12 256GB Silky Black',
    slug: 'oneplus-12-256gb',
    image: '/products/oneplus-12.jpg',
    price: 899.00,
    originalPrice: 999.00,
    vendor: 'OnePlus SK',
    vendorSlug: 'oneplus-sk',
    rating: 4.5,
    reviewCount: 67,
    inStock: true,
    deliveryDays: 2,
    specs: { memory: '256 GB', color: 'Silky Black' },
  },
  {
    id: 'p6',
    name: 'iPhone 15 128GB Blue',
    slug: 'iphone-15-128gb-blue',
    image: '/products/iphone15-blue.jpg',
    price: 899.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    isBestseller: true,
    freeShipping: true,
    deliveryDays: 1,
    specs: { memory: '128 GB', color: 'Blue' },
  },
  {
    id: 'p7',
    name: 'Samsung Galaxy A54 128GB Awesome Graphite',
    slug: 'samsung-galaxy-a54-128gb',
    image: '/products/samsung-a54.jpg',
    price: 399.00,
    originalPrice: 449.00,
    vendor: 'Samsung Shop',
    vendorSlug: 'samsung-shop',
    rating: 4.4,
    reviewCount: 456,
    inStock: true,
    isBestseller: true,
    deliveryDays: 1,
    specs: { memory: '128 GB', color: 'Graphite' },
  },
  {
    id: 'p8',
    name: 'Xiaomi Redmi Note 13 Pro 256GB Black',
    slug: 'xiaomi-redmi-note-13-pro-256gb',
    image: '/products/redmi-note-13.jpg',
    price: 349.00,
    vendor: 'Mi Store',
    vendorSlug: 'mi-store',
    rating: 4.3,
    reviewCount: 234,
    inStock: true,
    deliveryDays: 2,
    specs: { memory: '256 GB', color: 'Black' },
  },
  {
    id: 'p9',
    name: 'iPhone 14 Pro 256GB Space Black',
    slug: 'iphone-14-pro-256gb',
    image: '/products/iphone14-pro.jpg',
    price: 999.00,
    originalPrice: 1199.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    rating: 4.9,
    reviewCount: 567,
    inStock: false,
    deliveryDays: 5,
    specs: { memory: '256 GB', color: 'Space Black' },
  },
  {
    id: 'p10',
    name: 'Samsung Galaxy Z Fold5 512GB Phantom Black',
    slug: 'samsung-galaxy-z-fold5-512gb',
    image: '/products/z-fold5.jpg',
    price: 1899.00,
    vendor: 'Samsung Shop',
    vendorSlug: 'samsung-shop',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    isNew: true,
    freeShipping: true,
    deliveryDays: 2,
    specs: { memory: '512 GB', color: 'Phantom Black' },
  },
  {
    id: 'p11',
    name: 'Google Pixel 7a 128GB Charcoal',
    slug: 'google-pixel-7a-128gb',
    image: '/products/pixel-7a.jpg',
    price: 449.00,
    originalPrice: 499.00,
    vendor: 'Google Store',
    vendorSlug: 'google-store',
    rating: 4.5,
    reviewCount: 178,
    inStock: true,
    deliveryDays: 3,
    specs: { memory: '128 GB', color: 'Charcoal' },
  },
  {
    id: 'p12',
    name: 'OnePlus Nord 3 256GB Tempest Gray',
    slug: 'oneplus-nord-3-256gb',
    image: '/products/oneplus-nord3.jpg',
    price: 449.00,
    vendor: 'OnePlus SK',
    vendorSlug: 'oneplus-sk',
    rating: 4.4,
    reviewCount: 123,
    inStock: true,
    deliveryDays: 2,
    specs: { memory: '256 GB', color: 'Tempest Gray' },
  },
];

// Sort options
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'bestseller';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevantnosť' },
  { value: 'price_asc', label: 'Cena: najnižšia' },
  { value: 'price_desc', label: 'Cena: najvyššia' },
  { value: 'rating', label: 'Hodnotenie' },
  { value: 'newest', label: 'Najnovšie' },
  { value: 'bestseller', label: 'Najpredávanejšie' },
];

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square p-4">
        <div className="absolute inset-4 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded">
              Novinka
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 z-10">
          <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 pt-0">
        {/* Vendor */}
        <Link href={`/predajca/${product.vendorSlug}`} className="text-xs text-gray-500 hover:text-blue-600">
          {product.vendor}
        </Link>

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="block font-medium text-gray-900 hover:text-blue-600 mt-1 line-clamp-2 text-sm leading-snug min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock & Delivery */}
        <div className="flex items-center justify-between mt-2 text-xs">
          {product.inStock ? (
            <span className="text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Skladom
            </span>
          ) : (
            <span className="text-orange-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
              Na objednávku
            </span>
          )}
          {product.freeShipping && (
            <span className="text-blue-600">Doprava zdarma</span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          disabled={!product.inStock}
          className={`w-full mt-3 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Do košíka
        </button>
      </div>
    </div>
  );
}

// Filter Sidebar Component
function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  onClearFilters,
}: {
  filters: Filter[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, optionId: string, checked: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}) {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(filters.map(f => f.id))
  );

  const toggleFilter = (filterId: string) => {
    setExpandedFilters(prev => {
      const next = new Set(prev);
      if (next.has(filterId)) {
        next.delete(filterId);
      } else {
        next.add(filterId);
      }
      return next;
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(v => v.length > 0) || 
    minRating > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 2000;

  return (
    <div className="space-y-4">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Zrušiť filtre
        </button>
      )}

      {filters.map((filter) => (
        <div key={filter.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleFilter(filter.id)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
          >
            <span className="font-medium text-gray-900">{filter.name}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedFilters.has(filter.id) ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedFilters.has(filter.id) && (
            <div className="px-4 pb-4">
              {filter.type === 'checkbox' && filter.options && (
                <div className="space-y-2">
                  {filter.options.map((option) => (
                    <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters[filter.id]?.includes(option.id) || false}
                        onChange={(e) => onFilterChange(filter.id, option.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                      <span className="text-xs text-gray-400">({option.count})</span>
                    </label>
                  ))}
                </div>
              )}

              {filter.type === 'range' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Od"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Do"
                    />
                  </div>
                  <input
                    type="range"
                    min={filter.min}
                    max={filter.max}
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{filter.min} €</span>
                    <span>{filter.max} €</span>
                  </div>
                </div>
              )}

              {filter.type === 'rating' && (
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => onMinRatingChange(rating)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-1">a viac</span>
                      </div>
                    </label>
                  ))}
                  {minRating > 0 && (
                    <button
                      onClick={() => onMinRatingChange(0)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Zrušiť filter
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Mobile Filter Modal
function MobileFilterModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Filtre</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zobraziť výsledky
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function CategoryPage() {
  const params = useParams();
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filter products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }
      // Availability filter
      if (selectedFilters.availability?.length > 0) {
        if (selectedFilters.availability.includes('instock') && !product.inStock) {
          return false;
        }
      }
      return true;
    });
  }, [selectedFilters, priceRange, minRating]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'bestseller':
        return sorted.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleFilterChange = (filterId: string, optionId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const current = prev[filterId] || [];
      if (checked) {
        return { ...prev, [filterId]: [...current, optionId] };
      }
      return { ...prev, [filterId]: current.filter(id => id !== optionId) };
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setPriceRange([0, 2000]);
    setMinRating(0);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ESHOPY
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Hľadať produkty..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/ucet/wishlist" className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              <Link href="/kosik" className="relative p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link href="/ucet" className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Domov
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/kategorie" className="text-gray-500 hover:text-gray-700">
              Kategórie
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{mockCategory.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockCategory.name}</h1>
          <p className="text-gray-600 max-w-3xl">{mockCategory.description}</p>
          
          {/* Subcategories */}
          {mockCategory.children && mockCategory.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {mockCategory.children.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/kategoria/${sub.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  {sub.name}
                  <span className="text-gray-400 ml-1">({sub.productCount})</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={mockFilters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                priceRange={priceRange}
                onPriceRangeChange={(range) => {
                  setPriceRange(range);
                  setCurrentPage(1);
                }}
                minRating={minRating}
                onMinRatingChange={(rating) => {
                  setMinRating(rating);
                  setCurrentPage(1);
                }}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtre
                  </button>

                  <span className="text-sm text-gray-600">
                    {sortedProducts.length} {sortedProducts.length === 1 ? 'produkt' : 'produktov'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* View Mode */}
                  <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {Object.entries(selectedFilters).some(([_, v]) => v.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(selectedFilters).map(([filterId, optionIds]) =>
                  optionIds.map(optionId => {
                    const filter = mockFilters.find(f => f.id === filterId);
                    const option = filter?.options?.find(o => o.id === optionId);
                    if (!option) return null;
                    return (
                      <button
                        key={`${filterId}-${optionId}`}
                        onClick={() => handleFilterChange(filterId, optionId, false)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100"
                      >
                        {option.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Product Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Žiadne produkty</h3>
                <p className="text-gray-500 mb-4">Skúste zmeniť filtre alebo vyhľadávanie.</p>
                <button
                  onClick={handleClearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Zrušiť všetky filtre
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      <MobileFilterModal isOpen={showMobileFilters} onClose={() => setShowMobileFilters(false)}>
        <FilterSidebar
          filters={mockFilters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          priceRange={priceRange}
          onPriceRangeChange={(range) => {
            setPriceRange(range);
            setCurrentPage(1);
          }}
          minRating={minRating}
          onMinRatingChange={(rating) => {
            setMinRating(rating);
            setCurrentPage(1);
          }}
          onClearFilters={handleClearFilters}
        />
      </MobileFilterModal>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2026 ESHOPY. Všetky práva vyhradené.
          </div>
        </div>
      </footer>
    </div>
  );
}
