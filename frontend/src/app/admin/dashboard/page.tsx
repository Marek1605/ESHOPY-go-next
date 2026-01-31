'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardStats {
  revenue: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
  };
  orders: {
    today: number;
    yesterday: number;
    thisWeek: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    lowStock: number;
    draft: number;
  };
  vendors: {
    total: number;
    active: number;
    pending: number;
    topPerformers: VendorPerformance[];
  };
  clicks: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    cpcRevenue: number;
  };
  visitors: {
    today: number;
    yesterday: number;
    thisWeek: number;
    uniqueToday: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
}

interface VendorPerformance {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  rating: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  date: string;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'review' | 'vendor' | 'product' | 'user';
  message: string;
  time: string;
  icon: string;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
  views: number;
}

interface ChartData {
  labels: string[];
  revenue: number[];
  orders: number[];
  visitors: number[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockStats: DashboardStats = {
  revenue: {
    today: 2456.80,
    yesterday: 1987.50,
    thisWeek: 15234.60,
    lastWeek: 13456.20,
    thisMonth: 58432.90,
    lastMonth: 52341.00,
    thisYear: 542890.50,
  },
  orders: {
    today: 34,
    yesterday: 28,
    thisWeek: 187,
    pending: 12,
    processing: 23,
    completed: 156,
    cancelled: 8,
  },
  products: {
    total: 4567,
    active: 4123,
    outOfStock: 89,
    lowStock: 156,
    draft: 199,
  },
  vendors: {
    total: 45,
    active: 38,
    pending: 7,
    topPerformers: [
      { id: '1', name: 'TechStore SK', revenue: 23456.80, orders: 342, rating: 4.8 },
      { id: '2', name: 'ElektroMax', revenue: 18234.50, orders: 287, rating: 4.6 },
      { id: '3', name: 'MobilWorld', revenue: 15678.90, orders: 234, rating: 4.7 },
      { id: '4', name: 'GameZone', revenue: 12345.60, orders: 198, rating: 4.5 },
      { id: '5', name: 'ByteShop', revenue: 9876.40, orders: 167, rating: 4.4 },
    ],
  },
  clicks: {
    today: 1234,
    thisWeek: 8765,
    thisMonth: 34567,
    cpcRevenue: 4532.80,
  },
  visitors: {
    today: 3456,
    yesterday: 3123,
    thisWeek: 21456,
    uniqueToday: 2876,
    bounceRate: 42.3,
    avgSessionDuration: 245,
  },
};

const mockRecentOrders: RecentOrder[] = [
  { id: '1', orderNumber: 'ORD-2024-1234', customer: 'Ján Novák', email: 'jan.novak@email.sk', total: 456.80, status: 'pending', items: 3, date: '2024-01-30T14:30:00' },
  { id: '2', orderNumber: 'ORD-2024-1233', customer: 'Mária Kováčová', email: 'maria.k@email.sk', total: 234.50, status: 'processing', items: 2, date: '2024-01-30T13:45:00' },
  { id: '3', orderNumber: 'ORD-2024-1232', customer: 'Peter Horváth', email: 'peter.h@email.sk', total: 789.90, status: 'shipped', items: 5, date: '2024-01-30T12:20:00' },
  { id: '4', orderNumber: 'ORD-2024-1231', customer: 'Anna Szabová', email: 'anna.sz@email.sk', total: 123.00, status: 'delivered', items: 1, date: '2024-01-30T11:00:00' },
  { id: '5', orderNumber: 'ORD-2024-1230', customer: 'Tomáš Varga', email: 'tomas.v@email.sk', total: 567.80, status: 'cancelled', items: 4, date: '2024-01-30T10:15:00' },
];

const mockRecentActivity: RecentActivity[] = [
  { id: '1', type: 'order', message: 'Nová objednávka #ORD-2024-1234 od Ján Novák', time: 'pred 5 min', icon: '🛒' },
  { id: '2', type: 'review', message: 'Nová recenzia (5⭐) pre Samsung Galaxy S24', time: 'pred 12 min', icon: '⭐' },
  { id: '3', type: 'vendor', message: 'TechStore SK aktualizoval 45 produktov', time: 'pred 25 min', icon: '🏪' },
  { id: '4', type: 'product', message: 'iPhone 15 Pro je opäť na sklade', time: 'pred 1 hod', icon: '📦' },
  { id: '5', type: 'user', message: 'Nový používateľ sa zaregistroval', time: 'pred 2 hod', icon: '👤' },
  { id: '6', type: 'order', message: 'Objednávka #ORD-2024-1230 bola zrušená', time: 'pred 3 hod', icon: '❌' },
  { id: '7', type: 'vendor', message: 'ElektroMax podal žiadosť o verifikáciu', time: 'pred 4 hod', icon: '✅' },
  { id: '8', type: 'product', message: 'Nízky sklad: Xiaomi 14 Ultra (3 ks)', time: 'pred 5 hod', icon: '⚠️' },
];

const mockTopProducts: TopProduct[] = [
  { id: '1', name: 'Samsung Galaxy S24 Ultra 256GB', image: '/products/s24.jpg', sales: 234, revenue: 234567.80, views: 12456 },
  { id: '2', name: 'iPhone 15 Pro Max 512GB', image: '/products/iphone15.jpg', sales: 198, revenue: 287654.50, views: 15678 },
  { id: '3', name: 'MacBook Pro 14" M3 Pro', image: '/products/macbook.jpg', sales: 87, revenue: 198765.90, views: 8765 },
  { id: '4', name: 'Sony PlayStation 5 Slim', image: '/products/ps5.jpg', sales: 156, revenue: 78234.00, views: 9876 },
  { id: '5', name: 'Apple Watch Ultra 2', image: '/products/watch.jpg', sales: 123, revenue: 98765.50, views: 7654 },
];

const mockChartData: ChartData = {
  labels: ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'],
  revenue: [2345, 3456, 2876, 4123, 3987, 5234, 4567],
  orders: [23, 34, 28, 41, 39, 52, 45],
  visitors: [1234, 1567, 1345, 1876, 1654, 2345, 2123],
};

type TimePeriod = 'today' | 'week' | 'month' | 'year';

// ============================================================================
// COMPONENT
// ============================================================================

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(mockRecentOrders);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(mockRecentActivity);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(mockTopProducts);
  const [chartData, setChartData] = useState<ChartData>(mockChartData);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [isLoading, setIsLoading] = useState(false);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('sk-SK').format(num);
  };

  // Format time duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Calculate percentage change
  const calcChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(change), isPositive: change >= 0 };
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: RecentOrder['status'] }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Čaká',
      processing: 'Spracováva sa',
      shipped: 'Odoslané',
      delivered: 'Doručené',
      cancelled: 'Zrušené',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Simple bar chart component
  const SimpleBarChart = ({ data, labels, color }: { data: number[]; labels: string[]; color: string }) => {
    const max = Math.max(...data);
    return (
      <div className="flex items-end gap-2 h-32">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full rounded-t transition-all duration-300 ${color}`}
              style={{ height: `${(value / max) * 100}%`, minHeight: '4px' }}
            />
            <span className="text-xs text-gray-500">{labels[index]}</span>
          </div>
        ))}
      </div>
    );
  };

  // Revenue change
  const revenueChange = useMemo(() => calcChange(stats.revenue.today, stats.revenue.yesterday), [stats]);
  const ordersChange = useMemo(() => calcChange(stats.orders.today, stats.orders.yesterday), [stats]);
  const visitorsChange = useMemo(() => calcChange(stats.visitors.today, stats.visitors.yesterday), [stats]);
  const clicksChange = useMemo(() => calcChange(stats.clicks.today, stats.clicks.thisWeek / 7), [stats]);

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('sk-SK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value as TimePeriod)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Dnes</option>
                <option value="week">Tento týždeň</option>
                <option value="month">Tento mesiac</option>
                <option value="year">Tento rok</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <span>📥</span>
                Export
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <span>🔄</span>
                Obnoviť
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-100">Tržby dnes</span>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold mb-2">{formatCurrency(stats.revenue.today)}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded ${revenueChange.isPositive ? 'bg-green-400/30' : 'bg-red-400/30'}`}>
                {revenueChange.isPositive ? '↑' : '↓'} {revenueChange.value.toFixed(1)}%
              </span>
              <span className="text-blue-200">vs včera</span>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-100">Objednávky dnes</span>
              <span className="text-3xl">🛒</span>
            </div>
            <p className="text-3xl font-bold mb-2">{stats.orders.today}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded ${ordersChange.isPositive ? 'bg-green-400/30' : 'bg-red-400/30'}`}>
                {ordersChange.isPositive ? '↑' : '↓'} {ordersChange.value.toFixed(1)}%
              </span>
              <span className="text-emerald-200">vs včera</span>
            </div>
          </div>

          {/* Visitors Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-purple-100">Návštevníci dnes</span>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-3xl font-bold mb-2">{formatNumber(stats.visitors.today)}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded ${visitorsChange.isPositive ? 'bg-green-400/30' : 'bg-red-400/30'}`}>
                {visitorsChange.isPositive ? '↑' : '↓'} {visitorsChange.value.toFixed(1)}%
              </span>
              <span className="text-purple-200">vs včera</span>
            </div>
          </div>

          {/* Clicks Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-amber-100">CPC kliknutia dnes</span>
              <span className="text-3xl">👆</span>
            </div>
            <p className="text-3xl font-bold mb-2">{formatNumber(stats.clicks.today)}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded bg-white/20">
                {formatCurrency(stats.clicks.cpcRevenue)}
              </span>
              <span className="text-amber-200">tento mesiac</span>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Čakajúce</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.orders.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Spracovávané</p>
            <p className="text-2xl font-bold text-blue-600">{stats.orders.processing}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Bez skladu</p>
            <p className="text-2xl font-bold text-red-600">{stats.products.outOfStock}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Nízky sklad</p>
            <p className="text-2xl font-bold text-orange-600">{stats.products.lowStock}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Bounce rate</p>
            <p className="text-2xl font-bold text-gray-700">{stats.visitors.bounceRate}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Avg. session</p>
            <p className="text-2xl font-bold text-gray-700">{formatDuration(stats.visitors.avgSessionDuration)}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Tržby za týždeň</h3>
              <span className="text-sm text-gray-500">{formatCurrency(stats.revenue.thisWeek)}</span>
            </div>
            <SimpleBarChart data={chartData.revenue} labels={chartData.labels} color="bg-blue-500" />
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Objednávky za týždeň</h3>
              <span className="text-sm text-gray-500">{stats.orders.thisWeek} obj.</span>
            </div>
            <SimpleBarChart data={chartData.orders} labels={chartData.labels} color="bg-emerald-500" />
          </div>

          {/* Visitors Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Návštevníci za týždeň</h3>
              <span className="text-sm text-gray-500">{formatNumber(stats.visitors.thisWeek)}</span>
            </div>
            <SimpleBarChart data={chartData.visitors} labels={chartData.labels} color="bg-purple-500" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Posledné objednávky</h3>
              <a href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
                Zobraziť všetky →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objednávka</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zákazník</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suma</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stav</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.items} položiek</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Posledná aktivita</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {recentActivity.map(activity => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Top produkty</h3>
              <a href="/admin/products" className="text-sm text-blue-600 hover:text-blue-700">
                Zobraziť všetky →
              </a>
            </div>
            <div className="divide-y divide-gray-100">
              {topProducts.map((product, index) => (
                <div key={product.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} predajov • {formatNumber(product.views)} zobrazení</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Top predajcovia</h3>
              <a href="/admin/vendors" className="text-sm text-blue-600 hover:text-blue-700">
                Zobraziť všetkých →
              </a>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.vendors.topPerformers.map((vendor, index) => (
                <div key={vendor.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {vendor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{vendor.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{vendor.orders} objednávok</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(vendor.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Celkom produktov</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.products.total)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktívnych</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.products.active)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Predajcov</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vendors.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💵</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tržby tento rok</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.revenue.thisYear)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Rýchle akcie</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <a href="/admin/products/new" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
              <span className="text-2xl block mb-2">➕</span>
              <span className="text-sm">Nový produkt</span>
            </a>
            <a href="/admin/categories" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
              <span className="text-2xl block mb-2">📁</span>
              <span className="text-sm">Kategórie</span>
            </a>
            <a href="/admin/feeds" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
              <span className="text-2xl block mb-2">📥</span>
              <span className="text-sm">Importy</span>
            </a>
            <a href="/admin/vendors" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
              <span className="text-2xl block mb-2">🏪</span>
              <span className="text-sm">Predajcovia</span>
            </a>
            <a href="/admin/orders" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
              <span className="text-2xl block mb-2">🛒</span>
              <span className="text-sm">Objednávky</span>
            </a>
            <a href="/admin/settings" className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors">
              <span className="text-2xl block mb-2">⚙️</span>
              <span className="text-sm">Nastavenia</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
