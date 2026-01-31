'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, TrendingDown, ShoppingCart, Package, Users, Euro,
  ArrowUpRight, ArrowRight, Eye, Clock, AlertCircle, CheckCircle,
  BarChart3, Calendar, Zap, Star, Bell, ExternalLink, Plus,
  Layers, Palette, FileText, HelpCircle, Sparkles, Store,
  CreditCard, Truck, ShoppingBag, RefreshCw
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface StatCard {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface RecentOrder {
  id: string;
  number: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  time: string;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
  stock: number;
  trend: number;
}

interface QuickAction {
  label: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  badge?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════════

const stats: StatCard[] = [
  { 
    label: 'Tržby dnes', 
    value: '€2,847', 
    change: 12.5, 
    changeLabel: 'vs. včera', 
    icon: Euro, 
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10'
  },
  { 
    label: 'Objednávky', 
    value: '48', 
    change: 8.2, 
    changeLabel: 'vs. včera', 
    icon: ShoppingCart, 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  { 
    label: 'Návštevníci', 
    value: '1,284', 
    change: -2.4, 
    changeLabel: 'vs. včera', 
    icon: Users, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  { 
    label: 'Konverzia', 
    value: '3.74%', 
    change: 0.8, 
    changeLabel: 'vs. včera', 
    icon: TrendingUp, 
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10'
  },
];

const recentOrders: RecentOrder[] = [
  { id: '1', number: 'ORD-2024-0148', customer: 'Ján Novák', email: 'jan@email.sk', total: 189.99, items: 3, status: 'pending', date: '27.01.2024', time: '14:32' },
  { id: '2', number: 'ORD-2024-0147', customer: 'Mária Kováčová', email: 'maria@email.sk', total: 256.50, items: 2, status: 'processing', date: '27.01.2024', time: '13:15' },
  { id: '3', number: 'ORD-2024-0146', customer: 'Peter Horváth', email: 'peter@email.sk', total: 89.99, items: 1, status: 'shipped', date: '27.01.2024', time: '11:48' },
  { id: '4', number: 'ORD-2024-0145', customer: 'Eva Szabová', email: 'eva@email.sk', total: 434.00, items: 5, status: 'delivered', date: '26.01.2024', time: '16:22' },
  { id: '5', number: 'ORD-2024-0144', customer: 'Tomáš Varga', email: 'tomas@email.sk', total: 78.50, items: 2, status: 'delivered', date: '26.01.2024', time: '09:05' },
];

const topProducts: TopProduct[] = [
  { id: '1', name: 'Bezdrôtové slúchadlá Pro Max', image: '🎧', sales: 124, revenue: 14879, stock: 45, trend: 12 },
  { id: '2', name: 'USB-C Hub 7v1 Aluminium', image: '🔌', sales: 98, revenue: 5879, stock: 23, trend: 8 },
  { id: '3', name: 'Mechanická klávesnica RGB', image: '⌨️', sales: 87, revenue: 13049, stock: 12, trend: -3 },
  { id: '4', name: 'Ergonomická myš Vertical', image: '🖱️', sales: 76, revenue: 5319, stock: 67, trend: 5 },
  { id: '5', name: 'Monitor stojan s USB', image: '🖥️', sales: 65, revenue: 4549, stock: 8, trend: -8 },
];

const quickActions: QuickAction[] = [
  { label: 'Shop Builder', description: 'Upraviť dizajn obchodu', icon: Layers, href: '/dashboard/shop-builder', color: 'bg-purple-500', badge: 'PRO' },
  { label: 'Nový produkt', description: 'Pridať do katalógu', icon: Plus, href: '/dashboard/products/new', color: 'bg-blue-500' },
  { label: 'Objednávky', description: '3 čakajú na spracovanie', icon: ShoppingBag, href: '/dashboard/orders', color: 'bg-orange-500', badge: '3' },
  { label: 'Analytika', description: 'Štatistiky a reporty', icon: BarChart3, href: '/dashboard/analytics', color: 'bg-emerald-500' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Čaká', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  processing: { label: 'Spracováva sa', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  shipped: { label: 'Odoslané', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  delivered: { label: 'Doručené', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  cancelled: { label: 'Zrušené', color: 'text-red-400', bg: 'bg-red-400/10' },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(price);
};

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Vitajte späť! Tu je prehľad vášho obchodu.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1">
            {(['today', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {p === 'today' ? 'Dnes' : p === 'week' ? 'Týždeň' : 'Mesiac'}
              </button>
            ))}
          </div>
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            title="Obnoviť dáta"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 hover:bg-slate-800 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              {action.badge && (
                <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                  action.badge === 'PRO' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {action.badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white mb-1">{action.label}</h3>
            <p className="text-sm text-gray-400">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders - 2 columns */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Posledné objednávky</h2>
              <p className="text-sm text-gray-400">Aktualizované pred 2 minútami</p>
            </div>
            <Link 
              href="/dashboard/orders" 
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Zobraziť všetky <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-700/50">
            {recentOrders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <div 
                  key={order.id} 
                  className="p-4 flex items-center gap-4 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {order.customer.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white text-sm">{order.customer}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{order.number} • {order.items} položiek</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatPrice(order.total)}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products - 1 column */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Top produkty</h2>
            <Link 
              href="/dashboard/products" 
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Všetky <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-gray-400">
                  {i + 1}
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-xl">
                  {product.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} predaných</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white text-sm">{formatPrice(product.revenue)}</p>
                  <p className={`text-xs flex items-center gap-0.5 justify-end ${
                    product.trend >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {product.trend >= 0 ? '↑' : '↓'} {Math.abs(product.trend)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Low Stock Alert */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-400 mb-1">Nízky sklad</h3>
              <p className="text-sm text-gray-300 mb-3">
                <strong>3 produkty</strong> majú menej ako 15 kusov na sklade
              </p>
              <Link 
                href="/dashboard/products?filter=low_stock" 
                className="text-sm text-orange-400 hover:text-orange-300 font-medium"
              >
                Zobraziť produkty →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Orders Alert */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-400 mb-1">Čakajúce objednávky</h3>
              <p className="text-sm text-gray-300 mb-3">
                <strong>3 objednávky</strong> čakajú na spracovanie viac ako 24 hodín
              </p>
              <Link 
                href="/dashboard/orders?filter=pending" 
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Spracovať teraz →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Help Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2">Potrebujete pomoc?</h3>
          <p className="text-white/80 mb-4 max-w-md">
            Pozrite si našu dokumentáciu alebo kontaktujte podporu. Sme tu pre vás 24/7.
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white text-blue-600 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
              <FileText className="w-4 h-4" /> Dokumentácia
            </button>
            <button className="px-4 py-2 bg-white/20 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-white/30 transition-colors">
              <HelpCircle className="w-4 h-4" /> Podpora
            </button>
          </div>
        </div>
        <Zap className="w-32 h-32 text-white/10 absolute right-8 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
