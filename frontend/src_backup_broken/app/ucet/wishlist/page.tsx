'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  vendor: string;
  vendorSlug: string;
  inStock: boolean;
  stockCount?: number;
  rating: number;
  reviewCount: number;
  addedAt: string;
  priceDropped?: boolean;
  previousPrice?: number;
}

// Mock user
const mockUser = {
  name: 'Ján Novák',
  email: 'jan.novak@email.sk',
  avatar: null,
};

// Mock wishlist items
const mockWishlistItems: WishlistItem[] = [
  {
    id: 'w1',
    productId: 'p1',
    name: 'iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'iphone-15-pro-max-256gb',
    image: '/products/iphone15.jpg',
    price: 1299.00,
    originalPrice: 1449.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 234,
    addedAt: '2026-01-15T10:30:00Z',
    priceDropped: true,
    previousPrice: 1399.00,
  },
  {
    id: 'w2',
    productId: 'p2',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    image: '/products/samsung-s24.jpg',
    price: 1449.00,
    vendor: 'Samsung Shop',
    vendorSlug: 'samsung-shop',
    inStock: true,
    stockCount: 8,
    rating: 4.8,
    reviewCount: 189,
    addedAt: '2026-01-20T14:15:00Z',
  },
  {
    id: 'w3',
    productId: 'p3',
    name: 'Sony WH-1000XM5 Bezdrôtové slúchadlá',
    slug: 'sony-wh-1000xm5',
    image: '/products/sony-headphones.jpg',
    price: 349.00,
    originalPrice: 399.00,
    vendor: 'Audio Expert',
    vendorSlug: 'audio-expert',
    inStock: true,
    stockCount: 23,
    rating: 4.7,
    reviewCount: 567,
    addedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'w4',
    productId: 'p4',
    name: 'MacBook Pro 14" M3 Pro 18GB/512GB',
    slug: 'macbook-pro-14-m3-pro',
    image: '/products/macbook-pro.jpg',
    price: 2199.00,
    vendor: 'Apple Store SK',
    vendorSlug: 'apple-store-sk',
    inStock: false,
    rating: 4.9,
    reviewCount: 145,
    addedAt: '2026-01-08T16:45:00Z',
  },
  {
    id: 'w5',
    productId: 'p5',
    name: 'DJI Mini 4 Pro Fly More Combo',
    slug: 'dji-mini-4-pro-combo',
    image: '/products/dji-mini4.jpg',
    price: 1099.00,
    originalPrice: 1199.00,
    vendor: 'Drone World',
    vendorSlug: 'drone-world',
    inStock: true,
    stockCount: 5,
    rating: 4.6,
    reviewCount: 89,
    addedAt: '2026-01-25T11:20:00Z',
    priceDropped: true,
    previousPrice: 1149.00,
  },
];

// Account Sidebar Component
function AccountSidebar({ activePage }: { activePage: string }) {
  const menuItems = [
    { id: 'dashboard', label: 'Prehľad', href: '/ucet', icon: 'dashboard' },
    { id: 'orders', label: 'Objednávky', href: '/ucet/objednavky', icon: 'orders', badge: 3 },
    { id: 'wishlist', label: 'Wishlist', href: '/ucet/wishlist', icon: 'heart', badge: 5 },
    { id: 'addresses', label: 'Adresy', href: '/ucet/adresy', icon: 'location' },
    { id: 'settings', label: 'Nastavenia', href: '/ucet/nastavenia', icon: 'settings' },
  ];

  const icons: Record<string, JSX.Element> = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    orders: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    heart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    location: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          {mockUser.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{mockUser.name}</h3>
          <p className="text-sm text-gray-500">{mockUser.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              activePage === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {icons[item.icon]}
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                activePage === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Odhlásiť sa</span>
        </button>
      </div>
    </aside>
  );
}

// Wishlist Item Card Component
function WishlistItemCard({
  item,
  onRemove,
  onAddToCart,
  isSelected,
  onToggleSelect,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <div className={`bg-white rounded-xl border transition-all ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="p-4">
        {/* Header with checkbox and actions */}
        <div className="flex items-start justify-between mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(item.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-500">Vybrať</span>
          </label>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Odstrániť z wishlistu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/product/${item.slug}`} className="block mb-3">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded">
                  -{discount}%
                </span>
              )}
              {item.priceDropped && (
                <span className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Cena klesla
                </span>
              )}
            </div>

            {/* Out of stock overlay */}
            {!item.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="px-3 py-1.5 bg-white text-gray-900 font-medium rounded-lg text-sm">
                  Vypredané
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-2">
          <Link
            href={`/product/${item.slug}`}
            className="block font-medium text-gray-900 hover:text-blue-600 line-clamp-2 text-sm leading-snug"
          >
            {item.name}
          </Link>

          <Link
            href={`/predajca/${item.vendorSlug}`}
            className="text-xs text-gray-500 hover:text-blue-600"
          >
            {item.vendor}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {item.rating} ({item.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>

          {/* Price drop info */}
          {item.priceDropped && item.previousPrice && (
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span>Ušetríte {formatPrice(item.previousPrice - item.price)}</span>
            </div>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-1.5 text-xs">
            {item.inStock ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-green-600">
                  Skladom {item.stockCount && item.stockCount < 10 ? `(${item.stockCount} ks)` : ''}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-red-600">Vypredané</span>
              </>
            )}
          </div>

          {/* Added date */}
          <p className="text-xs text-gray-400">
            Pridané {formatDate(item.addedAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <button
            onClick={() => onAddToCart(item.id)}
            disabled={!item.inStock}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              item.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {item.inStock ? 'Pridať do košíka' : 'Nedostupné'}
          </button>
          
          {!item.inStock && (
            <button className="w-full py-2 px-4 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Sledovať dostupnosť
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty Wishlist Component
function EmptyWishlist() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Váš wishlist je prázdny
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Pridajte si produkty do wishlistu kliknutím na ikonu srdca pri produkte.
        Budeme vás informovať o zmenách cien.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Prechádzať produkty
      </Link>
    </div>
  );
}

// Sort options
type SortOption = 'added_desc' | 'added_asc' | 'price_asc' | 'price_desc' | 'name_asc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'added_desc', label: 'Naposledy pridané' },
  { value: 'added_asc', label: 'Najstaršie' },
  { value: 'price_asc', label: 'Najlacnejšie' },
  { value: 'price_desc', label: 'Najdrahšie' },
  { value: 'name_asc', label: 'Názov A-Z' },
];

// Main Page Component
export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>(mockWishlistItems);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>('added_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showOnlyPriceDropped, setShowOnlyPriceDropped] = useState(false);

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      if (showOnlyInStock && !item.inStock) return false;
      if (showOnlyPriceDropped && !item.priceDropped) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'added_desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'added_asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name, 'sk');
        default:
          return 0;
      }
    });

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleAddToCart = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      console.log('Adding to cart:', item.name);
      // In real app, add to cart and optionally remove from wishlist
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const handleBulkAddToCart = () => {
    const inStockSelected = filteredItems.filter(
      item => selectedItems.has(item.id) && item.inStock
    );
    console.log('Adding to cart:', inStockSelected.map(i => i.name));
    // In real app, add all to cart
  };

  const handleBulkRemove = () => {
    setItems(items.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  };

  // Stats
  const inStockCount = items.filter(i => i.inStock).length;
  const priceDroppedCount = items.filter(i => i.priceDropped).length;
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ESHOPY
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/kategorie" className="text-gray-600 hover:text-gray-900">
                Kategórie
              </Link>
              <Link href="/akcie" className="text-gray-600 hover:text-gray-900">
                Akcie
              </Link>
              <Link href="/novinky" className="text-gray-600 hover:text-gray-900">
                Novinky
              </Link>
            </nav>
            <div className="flex items-center gap-4">
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
            <Link href="/ucet" className="text-gray-500 hover:text-gray-700">
              Môj účet
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <AccountSidebar activePage="wishlist" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Môj wishlist</h1>
              <p className="text-gray-500">
                {items.length} {items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktov'} v hodnote{' '}
                {new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(totalValue)}
              </p>
            </div>

            {items.length === 0 ? (
              <EmptyWishlist />
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-gray-900">{items.length}</div>
                    <div className="text-sm text-gray-500">Celkom produktov</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-green-600">{inStockCount}</div>
                    <div className="text-sm text-gray-500">Skladom</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-blue-600">{priceDroppedCount}</div>
                    <div className="text-sm text-gray-500">Cena klesla</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-gray-900">{items.length - inStockCount}</div>
                    <div className="text-sm text-gray-500">Vypredané</div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyInStock}
                          onChange={(e) => setShowOnlyInStock(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Len skladom ({inStockCount})</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyPriceDropped}
                          onChange={(e) => setShowOnlyPriceDropped(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Cena klesla ({priceDroppedCount})</span>
                      </label>
                    </div>

                    {/* Sort and View */}
                    <div className="flex items-center gap-3">
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

                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
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

                  {/* Bulk Actions */}
                  {selectedItems.size > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Vybrané: <strong>{selectedItems.size}</strong> {selectedItems.size === 1 ? 'produkt' : 'produkty'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleBulkAddToCart}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Pridať do košíka
                        </button>
                        <button
                          onClick={handleBulkRemove}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Odstrániť
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Select All */}
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Vybrať všetky ({filteredItems.length})</span>
                  </label>
                  <span className="text-sm text-gray-500">
                    Zobrazené: {filteredItems.length} z {items.length}
                  </span>
                </div>

                {/* Product Grid/List */}
                {filteredItems.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">Žiadne produkty nezodpovedajú filtrom.</p>
                    <button
                      onClick={() => {
                        setShowOnlyInStock(false);
                        setShowOnlyPriceDropped(false);
                      }}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Zrušiť filtre
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredItems.map(item => (
                      <WishlistItemCard
                        key={item.id}
                        item={item}
                        onRemove={handleRemove}
                        onAddToCart={handleAddToCart}
                        isSelected={selectedItems.has(item.id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                  </div>
                )}

                {/* Price Alert Notice */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Upozornenia na zmenu ceny
                      </h3>
                      <p className="text-sm text-blue-700">
                        Automaticky vás upozorníme, keď sa cena produktov v wishlist zníži.
                        Sledujeme ceny každý deň a posielame notifikácie na email.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

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
