'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

interface OrderSummary {
  total: number;
  pending: number;
  shipped: number;
  delivered: number;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUser: User = {
  id: 'user-1',
  firstName: 'Ján',
  lastName: 'Novák',
  email: 'jan.novak@email.sk',
  phone: '+421 900 123 456',
  createdAt: '2024-01-15',
};

const mockOrderSummary: OrderSummary = {
  total: 12,
  pending: 1,
  shipped: 2,
  delivered: 9,
};

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
  package: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  truck: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  check: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function AccountSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Prehľad', href: '/ucet', icon: Icons.user },
    { id: 'orders', label: 'Objednávky', href: '/ucet/objednavky', icon: Icons.orders, badge: 3 },
    { id: 'wishlist', label: 'Wishlist', href: '/ucet/wishlist', icon: Icons.heart, badge: 5 },
    { id: 'addresses', label: 'Adresy', href: '/ucet/adresy', icon: Icons.location },
    { id: 'settings', label: 'Nastavenia', href: '/ucet/nastavenia', icon: Icons.settings },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* User Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0
                transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-l-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
                {Icons.chevronRight}
              </div>
            </Link>
          );
        })}
        <button
          onClick={() => console.log('Logout')}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
        >
          {Icons.logout}
          <span>Odhlásiť sa</span>
        </button>
      </nav>
    </aside>
  );
}

function OrderStatsCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'yellow' | 'purple' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function RecentOrders() {
  const orders = [
    { id: 'ORD-2024-001', date: '2024-01-20', status: 'delivered', total: 1299.00, items: 1 },
    { id: 'ORD-2024-002', date: '2024-01-18', status: 'shipped', total: 279.00, items: 2 },
    { id: 'ORD-2024-003', date: '2024-01-15', status: 'pending', total: 599.00, items: 1 },
  ];

  const statusLabels: Record<string, { label: string; class: string }> = {
    pending: { label: 'Čaká na spracovanie', class: 'bg-yellow-100 text-yellow-800' },
    shipped: { label: 'Odoslané', class: 'bg-blue-100 text-blue-800' },
    delivered: { label: 'Doručené', class: 'bg-green-100 text-green-800' },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Posledné objednávky</h3>
        <Link href="/ucet/objednavky" className="text-sm text-blue-600 hover:text-blue-800">
          Zobraziť všetky
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/ucet/objednavky/${order.id}`}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString('sk-SK')} • {order.items} {order.items === 1 ? 'položka' : 'položky'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(order.total)}
              </p>
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${statusLabels[order.status].class}`}>
                {statusLabels[order.status].label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'Upraviť profil', href: '/ucet/nastavenia', icon: Icons.edit },
    { label: 'Pridať adresu', href: '/ucet/adresy', icon: Icons.location },
    { label: 'Zobraziť wishlist', href: '/ucet/wishlist', icon: Icons.heart },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Rýchle akcie</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            {action.icon}
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AccountInfo({ user }: { user: User }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Údaje o účte</h3>
        <Link href="/ucet/nastavenia" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
          {Icons.edit} Upraviť
        </Link>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Meno</span>
          <span className="text-gray-900">{user.firstName} {user.lastName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">E-mail</span>
          <span className="text-gray-900">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Telefón</span>
          <span className="text-gray-900">{user.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Člen od</span>
          <span className="text-gray-900">{new Date(user.createdAt).toLocaleDateString('sk-SK')}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AccountPage() {
  const [user] = useState<User>(mockUser);
  const [orderSummary] = useState<OrderSummary>(mockOrderSummary);

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
              <span className="text-gray-900">Môj účet</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Môj účet</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AccountSidebar user={user} />

          {/* Main Content */}
          <main className="flex-1">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Vitajte späť, {user.firstName}!
              </h2>
              <p className="text-blue-100">
                Spravujte svoje objednávky, adresy a nastavenia účtu na jednom mieste.
              </p>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <OrderStatsCard
                icon={Icons.package}
                label="Celkom objednávok"
                value={orderSummary.total}
                color="blue"
              />
              <OrderStatsCard
                icon={Icons.clock}
                label="Čakajúce"
                value={orderSummary.pending}
                color="yellow"
              />
              <OrderStatsCard
                icon={Icons.truck}
                label="Odoslané"
                value={orderSummary.shipped}
                color="purple"
              />
              <OrderStatsCard
                icon={Icons.check}
                label="Doručené"
                value={orderSummary.delivered}
                color="green"
              />
            </div>

            {/* Recent Orders & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentOrders />
              </div>
              <div className="space-y-6">
                <AccountInfo user={user} />
                <QuickActions />
              </div>
            </div>
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
