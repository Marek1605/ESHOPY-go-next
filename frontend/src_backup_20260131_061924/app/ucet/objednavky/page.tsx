'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  trackingNumber?: string;
  deliveryAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-20',
    status: 'delivered',
    items: [
      { id: '1', name: 'Apple iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro', price: 1299, quantity: 1 },
    ],
    subtotal: 1299,
    shipping: 0,
    total: 1299,
    trackingNumber: 'SK123456789',
    deliveryAddress: { name: 'Ján Novák', street: 'Hlavná 123', city: 'Bratislava', postalCode: '811 01' },
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'shipped',
    items: [
      { id: '2', name: 'Apple AirPods Pro 2nd Generation', slug: 'airpods-pro-2', price: 279, quantity: 2 },
    ],
    subtotal: 558,
    shipping: 4.99,
    total: 562.99,
    trackingNumber: 'SK987654321',
    deliveryAddress: { name: 'Ján Novák', street: 'Hlavná 123', city: 'Bratislava', postalCode: '811 01' },
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-15',
    status: 'pending',
    items: [
      { id: '3', name: 'Samsung Galaxy S24 Ultra 512GB', slug: 'samsung-s24', price: 1199, quantity: 1 },
      { id: '4', name: 'Samsung 45W Fast Charger', slug: 'samsung-charger', price: 39, quantity: 1 },
    ],
    subtotal: 1238,
    shipping: 0,
    total: 1238,
    deliveryAddress: { name: 'Ján Novák', street: 'Hlavná 123', city: 'Bratislava', postalCode: '811 01' },
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-01-10',
    status: 'cancelled',
    items: [
      { id: '5', name: 'MacBook Pro 14"', slug: 'macbook-pro', price: 2499, quantity: 1 },
    ],
    subtotal: 2499,
    shipping: 0,
    total: 2499,
    deliveryAddress: { name: 'Ján Novák', street: 'Hlavná 123', city: 'Bratislava', postalCode: '811 01' },
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    date: '2024-01-05',
    status: 'delivered',
    items: [
      { id: '6', name: 'Apple Watch Series 9', slug: 'apple-watch-9', price: 449, quantity: 1 },
    ],
    subtotal: 449,
    shipping: 4.99,
    total: 453.99,
    trackingNumber: 'SK111222333',
    deliveryAddress: { name: 'Ján Novák', street: 'Hlavná 123', city: 'Bratislava', postalCode: '811 01' },
  },
];

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronUp: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  filter: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  truck: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  package: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  refresh: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  externalLink: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  empty: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
};

// ============================================================================
// STATUS CONFIG
// ============================================================================

const statusConfig: Record<OrderStatus, { label: string; class: string; bgClass: string }> = {
  pending: { label: 'Čaká na spracovanie', class: 'text-yellow-800', bgClass: 'bg-yellow-100' },
  processing: { label: 'Spracováva sa', class: 'text-blue-800', bgClass: 'bg-blue-100' },
  shipped: { label: 'Odoslané', class: 'text-purple-800', bgClass: 'bg-purple-100' },
  delivered: { label: 'Doručené', class: 'text-green-800', bgClass: 'bg-green-100' },
  cancelled: { label: 'Zrušené', class: 'text-red-800', bgClass: 'bg-red-100' },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function AccountSidebar() {
  const menuItems = [
    { id: 'dashboard', label: 'Prehľad', href: '/ucet', icon: Icons.user },
    { id: 'orders', label: 'Objednávky', href: '/ucet/objednavky', icon: Icons.orders, active: true },
    { id: 'wishlist', label: 'Wishlist', href: '/ucet/wishlist', icon: Icons.heart },
    { id: 'addresses', label: 'Adresy', href: '/ucet/adresy', icon: Icons.location },
    { id: 'settings', label: 'Nastavenia', href: '/ucet/nastavenia', icon: Icons.settings },
  ];

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <nav className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`
              flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0
              transition-colors
              ${item.active
                ? 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {Icons.chevronRight}
          </Link>
        ))}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors">
          {Icons.logout}
          <span>Odhlásiť sa</span>
        </button>
      </nav>
    </aside>
  );
}

function OrderCard({ order, isExpanded, onToggle }: { order: Order; isExpanded: boolean; onToggle: () => void }) {
  const status = statusConfig[order.status];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Order Header */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              {Icons.package}
            </div>
            <div>
              <p className="font-medium text-gray-900">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.class}`}>
              {status.label}
            </span>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
              <p className="text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? 'položka' : 'položky'}</p>
            </div>
            <button className="text-gray-400">
              {isExpanded ? Icons.chevronUp : Icons.chevronDown}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          {/* Items */}
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <Link href={`/product/${item.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500">{item.quantity}× {formatPrice(item.price)}</p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Medzisúčet</span>
              <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Doprava</span>
              <span className="text-gray-900">{order.shipping === 0 ? 'Zadarmo' : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900">Celkom</span>
              <span className="text-gray-900">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Delivery Info & Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Doručovacia adresa</h4>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress.name}<br />
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
              </p>
            </div>
            {order.trackingNumber && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sledovanie zásielky</h4>
                <p className="text-sm text-gray-600 mb-2">{order.trackingNumber}</p>
                <a
                  href={`https://tracking.example.com/${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Sledovať zásielku {Icons.externalLink}
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4 mt-4">
            <Link
              href={`/ucet/objednavky/${order.id}`}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zobraziť detail
            </Link>
            {order.status === 'delivered' && (
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Objednať znova
              </button>
            )}
            {(order.status === 'pending' || order.status === 'processing') && (
              <button className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors">
                Zrušiť objednávku
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyOrders({ statusFilter }: { statusFilter: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div className="text-gray-300 flex justify-center mb-4">
        {Icons.empty}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Žiadne objednávky
      </h3>
      <p className="text-gray-600 mb-6">
        {statusFilter === 'all'
          ? 'Zatiaľ nemáte žiadne objednávky. Začnite nakupovať!'
          : 'Žiadne objednávky v tejto kategórii.'}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Začať nakupovať
      </Link>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ESHOPY
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-blue-600">Domov</Link>
              <span className="text-gray-300">/</span>
              <Link href="/ucet" className="text-gray-600 hover:text-blue-600">Môj účet</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Objednávky</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Moje objednávky</h1>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                {Icons.refresh}
                Obnoviť
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {Icons.search}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Hľadať podľa čísla objednávky alebo produktu..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{Icons.filter}</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Všetky ({stats.all})</option>
                    <option value="pending">Čakajúce ({stats.pending})</option>
                    <option value="processing">Spracováva sa ({stats.processing})</option>
                    <option value="shipped">Odoslané ({stats.shipped})</option>
                    <option value="delivered">Doručené ({stats.delivered})</option>
                    <option value="cancelled">Zrušené ({stats.cancelled})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Status Tabs (Mobile) */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 lg:hidden">
              {[
                { value: 'all', label: 'Všetky' },
                { value: 'pending', label: 'Čakajúce' },
                { value: 'shipped', label: 'Odoslané' },
                { value: 'delivered', label: 'Doručené' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`
                    px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
                    ${statusFilter === tab.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab.label} ({stats[tab.value as keyof typeof stats]})
                </button>
              ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <EmptyOrders statusFilter={statusFilter} />
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrderId === order.id}
                    onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Placeholder */}
            {filteredOrders.length > 0 && (
              <div className="mt-6 flex justify-center">
                <p className="text-sm text-gray-500">
                  Zobrazených {filteredOrders.length} z {orders.length} objednávok
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          © 2025 ESHOPY. Všetky práva vyhradené.
        </div>
      </footer>
    </div>
  );
}
