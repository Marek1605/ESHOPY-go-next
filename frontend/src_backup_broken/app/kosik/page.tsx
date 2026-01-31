'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================

interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  vendorId: string;
  vendorName: string;
  ean?: string;
  sku?: string;
  variant?: {
    id: string;
    name: string;
    value: string;
  };
  inStock: boolean;
  deliveryDays: number;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
  appliedCoupon?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
}

interface SuggestedProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockCartItems: CartItem[] = [
  {
    id: 'cart-1',
    productId: 'prod-1',
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'apple-iphone-15-pro-max-256gb',
    image: '/images/products/iphone15.jpg',
    price: 1299.00,
    originalPrice: 1399.00,
    quantity: 1,
    maxQuantity: 5,
    vendorId: 'vendor-1',
    vendorName: 'iStyle Slovakia',
    ean: '194253401234',
    inStock: true,
    deliveryDays: 2,
  },
  {
    id: 'cart-2',
    productId: 'prod-2',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    image: '/images/products/samsung-s24.jpg',
    price: 1199.00,
    quantity: 1,
    maxQuantity: 10,
    vendorId: 'vendor-2',
    vendorName: 'Alza.sk',
    ean: '887276789012',
    inStock: true,
    deliveryDays: 1,
  },
  {
    id: 'cart-3',
    productId: 'prod-3',
    name: 'Apple AirPods Pro 2nd Generation',
    slug: 'apple-airpods-pro-2',
    image: '/images/products/airpods-pro.jpg',
    price: 279.00,
    originalPrice: 299.00,
    quantity: 2,
    maxQuantity: 5,
    vendorId: 'vendor-1',
    vendorName: 'iStyle Slovakia',
    ean: '194253456789',
    inStock: true,
    deliveryDays: 2,
  },
];

const mockSuggestedProducts: SuggestedProduct[] = [
  {
    id: 'sug-1',
    name: 'Apple MagSafe Charger',
    slug: 'apple-magsafe-charger',
    image: '/images/products/magsafe.jpg',
    price: 45.00,
  },
  {
    id: 'sug-2',
    name: 'Samsung 45W Fast Charger',
    slug: 'samsung-45w-charger',
    image: '/images/products/samsung-charger.jpg',
    price: 39.00,
    originalPrice: 49.00,
  },
  {
    id: 'sug-3',
    name: 'Spigen Ultra Hybrid Case',
    slug: 'spigen-ultra-hybrid-case',
    image: '/images/products/spigen-case.jpg',
    price: 29.00,
  },
  {
    id: 'sug-4',
    name: 'Anker PowerCore 20000mAh',
    slug: 'anker-powercore-20000',
    image: '/images/products/anker-powerbank.jpg',
    price: 59.00,
    originalPrice: 69.00,
  },
];

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  trash: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  minus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  tag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  truck: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  shoppingBag: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

function calculateSummary(items: CartItem[], coupon?: { code: string; discount: number; type: 'percentage' | 'fixed' }): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Free shipping over 50€
  const shipping = subtotal >= 50 ? 0 : 4.99;
  
  // Calculate discount
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = subtotal * (coupon.discount / 100);
    } else {
      discount = coupon.discount;
    }
  }
  
  const total = subtotal + shipping - discount;
  
  return {
    subtotal,
    shipping,
    discount,
    total: Math.max(0, total),
    itemCount,
    appliedCoupon: coupon,
  };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Cart Item Component
function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist: (id: string) => void;
}) {
  const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link href={`/product/${item.slug}`} className="flex-shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link 
                href={`/product/${item.slug}`}
                className="text-sm sm:text-base font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
              >
                {item.name}
              </Link>
              
              <p className="mt-1 text-sm text-gray-500">
                Predáva: <span className="text-gray-700">{item.vendorName}</span>
              </p>
              
              {item.variant && (
                <p className="mt-1 text-sm text-gray-500">
                  {item.variant.name}: <span className="text-gray-700">{item.variant.value}</span>
                </p>
              )}
              
              {item.ean && (
                <p className="mt-1 text-xs text-gray-400">EAN: {item.ean}</p>
              )}

              {/* Stock Status */}
              <div className="mt-2 flex items-center gap-2">
                {item.inStock ? (
                  <span className="inline-flex items-center gap-1 text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Skladom
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Nedostupné
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  • Doručenie do {item.deliveryDays} {item.deliveryDays === 1 ? 'dňa' : 'dní'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </div>
              {item.originalPrice && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(item.originalPrice * item.quantity)}
                </div>
              )}
              {savings > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  Ušetríte {formatPrice(savings)}
                </div>
              )}
              {item.quantity > 1 && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatPrice(item.price)} / ks
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Množstvo:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                >
                  {Icons.minus}
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= item.maxQuantity) {
                      onUpdateQuantity(item.id, val);
                    }
                  }}
                  className="w-12 text-center border-x border-gray-300 py-2 focus:outline-none"
                  min={1}
                  max={item.maxQuantity}
                />
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.min(item.maxQuantity, item.quantity + 1))}
                  disabled={item.quantity >= item.maxQuantity}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                >
                  {Icons.plus}
                </button>
              </div>
            </div>

            {/* Remove / Wishlist */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMoveToWishlist(item.id)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {Icons.heart}
                <span className="hidden sm:inline">Uložiť</span>
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                {Icons.trash}
                <span className="hidden sm:inline">Odstrániť</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty Cart Component
function EmptyCart() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div className="text-gray-300 mb-4 flex justify-center">
        {Icons.shoppingBag}
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Váš košík je prázdny
      </h2>
      <p className="text-gray-600 mb-6">
        Vyzerá to, že ste si ešte nič nevybrali. Pozrite si naše produkty a nájdite niečo pre seba.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Pokračovať v nákupe
        {Icons.arrowRight}
      </Link>
    </div>
  );
}

// Order Summary Component
function OrderSummary({
  summary,
  couponCode,
  couponError,
  couponLoading,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
}: {
  summary: CartSummary;
  couponCode: string;
  couponError: string;
  couponLoading: boolean;
  onCouponChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onCheckout: () => void;
}) {
  const freeShippingThreshold = 50;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - summary.subtotal);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Súhrn objednávky
      </h2>

      {/* Free Shipping Progress */}
      {summary.shipping > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            Do dopravy zadarmo vám chýba <strong>{formatPrice(amountToFreeShipping)}</strong>
          </p>
          <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (summary.subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Coupon Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zľavový kód
        </label>
        {summary.appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              {Icons.tag}
              <span className="font-medium text-green-800">
                {summary.appliedCoupon.code}
              </span>
              <span className="text-green-600">
                (-{summary.appliedCoupon.type === 'percentage' 
                  ? `${summary.appliedCoupon.discount}%` 
                  : formatPrice(summary.appliedCoupon.discount)})
              </span>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-green-600 hover:text-green-800"
            >
              {Icons.x}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
              placeholder="Zadajte kód"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            />
            <button
              onClick={onApplyCoupon}
              disabled={!couponCode || couponLoading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {couponLoading ? 'Načítavam...' : 'Použiť'}
            </button>
          </div>
        )}
        {couponError && (
          <p className="mt-2 text-sm text-red-600">{couponError}</p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 py-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Medzisúčet ({summary.itemCount} {summary.itemCount === 1 ? 'položka' : summary.itemCount < 5 ? 'položky' : 'položiek'})</span>
          <span className="text-gray-900">{formatPrice(summary.subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Doprava</span>
          <span className={summary.shipping === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
            {summary.shipping === 0 ? 'Zadarmo' : formatPrice(summary.shipping)}
          </span>
        </div>
        
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Zľava</span>
            <span className="text-green-600 font-medium">-{formatPrice(summary.discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between py-4 border-t border-gray-200">
        <span className="text-lg font-semibold text-gray-900">Celkom</span>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">{formatPrice(summary.total)}</div>
          <div className="text-xs text-gray-500">vrátane DPH</div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        Pokračovať k objednávke
        {Icons.arrowRight}
      </button>

      {/* Trust Badges */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="text-green-600">{Icons.shield}</span>
          <span>Bezpečná platba</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="text-blue-600">{Icons.truck}</span>
          <span>Rýchle doručenie do 2-3 dní</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="text-green-600">{Icons.check}</span>
          <span>14 dní na vrátenie bez udania dôvodu</span>
        </div>
      </div>
    </div>
  );
}

// Suggested Products Component
function SuggestedProducts({ products }: { products: SuggestedProduct[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Mohlo by vás zaujímať
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(mockCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const summary = calculateSummary(items, appliedCoupon);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToWishlist = (id: string) => {
    // TODO: Implement wishlist functionality
    console.log('Move to wishlist:', id);
    handleRemove(id);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    setCouponLoading(true);
    setCouponError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock coupon validation
    const validCoupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
      'ZLAVA10': { discount: 10, type: 'percentage' },
      'ZLAVA20': { discount: 20, type: 'percentage' },
      'DOPRAVA': { discount: 4.99, type: 'fixed' },
    };
    
    const coupon = validCoupons[couponCode];
    if (coupon) {
      setAppliedCoupon({ code: couponCode, ...coupon });
      setCouponCode('');
    } else {
      setCouponError('Neplatný zľavový kód');
    }
    
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined);
  };

  const handleCheckout = () => {
    router.push('/objednavka');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-6 h-40"></div>
                ))}
              </div>
              <div className="bg-white rounded-lg p-6 h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ESHOPY
            </Link>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                Košík
              </span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400">Doručenie</span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400">Platba</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Domov</Link>
          <span>/</span>
          <span className="text-gray-900">Nákupný košík</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Nákupný košík {items.length > 0 && `(${summary.itemCount})`}
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                  onMoveToWishlist={handleMoveToWishlist}
                />
              ))}

              {/* Continue Shopping */}
              <div className="flex justify-between items-center pt-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {Icons.arrowLeft}
                  Pokračovať v nákupe
                </Link>
                <button
                  onClick={() => setItems([])}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Vyprázdniť košík
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                summary={summary}
                couponCode={couponCode}
                couponError={couponError}
                couponLoading={couponLoading}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        {/* Suggested Products */}
        {items.length > 0 && (
          <SuggestedProducts products={mockSuggestedProducts} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-blue-600 mb-2 flex justify-center">{Icons.truck}</div>
              <h3 className="font-medium text-gray-900">Rýchle doručenie</h3>
              <p className="text-sm text-gray-500">Do 2-3 pracovných dní</p>
            </div>
            <div>
              <div className="text-blue-600 mb-2 flex justify-center">{Icons.shield}</div>
              <h3 className="font-medium text-gray-900">Bezpečný nákup</h3>
              <p className="text-sm text-gray-500">SSL šifrovanie</p>
            </div>
            <div>
              <div className="text-green-600 mb-2 flex justify-center">{Icons.check}</div>
              <h3 className="font-medium text-gray-900">Vrátenie tovaru</h3>
              <p className="text-sm text-gray-500">14 dní bez udania dôvodu</p>
            </div>
            <div>
              <div className="text-blue-600 mb-2 flex justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Zákaznícka podpora</h3>
              <p className="text-sm text-gray-500">Po-Pi 9:00-17:00</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
