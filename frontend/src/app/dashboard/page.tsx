'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, Users, Euro,
  ArrowUpRight, ArrowRight, Eye, Clock, AlertCircle, CheckCircle,
  BarChart3, Calendar, Zap, Star, Bell, ExternalLink
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
}

interface RecentOrder {
  id: string;
  number: string;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  time: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════════

const stats: StatCard[] = [
  { label: 'Tržby dnes', value: '€1,284', change: 12.5, changeLabel: 'vs. včera', icon: Euro, color: 'blue' },
  { label: 'Objednávky', value: '48', change: 8.2, changeLabel: 'vs. včera', icon: ShoppingCart, color: 'green' },
  { label: 'Produkty', value: '156', change: -2.4, changeLabel: 'skladom', icon: Package, color: 'purple' },
  { label: 'Zákazníci', value: '2,847', change: 15.3, changeLabel: 'tento mesiac', icon: Users, color: 'orange' },
];

const recentOrders: RecentOrder[] = [
  { id: '1', number: 'ORD-2024-001', customer: 'Ján Novák', total: 89.99, status: 'pending', time: 'Pred 5 min' },
  { id: '2', number: 'ORD-2024-002', customer: 'Mária Kováčová', total: 156.50, status: 'processing', time: 'Pred 15 min' },
  { id: '3', number: 'ORD-2024-003', customer: 'Peter Horváth', total: 49.99, status: 'shipped', time: 'Pred 1 hod' },
  { id: '4', number: 'ORD-2024-004', customer: 'Eva Szabová', total: 234.00, status: 'delivered', time: 'Pred 2 hod' },
  { id: '5', number: 'ORD-2024-005', customer: 'Tomáš Varga', total: 78.50, status: 'processing', time: 'Pred 3 hod' },
];

const topProducts: TopProduct[] = [
  { id: '1', name: 'Bezdrôtové slúchadlá Pro', sales: 124, revenue: 11159, stock: 45 },
  { id: '2', name: 'USB-C Hub 7v1', sales: 98, revenue: 4899, stock: 23 },
  { id: '3', name: 'Mechanická klávesnica RGB', sales: 87, revenue: 11309, stock: 12 },
  { id: '4', name: 'Ergonomická myš', sales: 76, revenue: 4559, stock: 67 },
  { id: '5', name: 'Monitor stojan', sales: 65, revenue: 3244, stock: 8 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'shipped': return 'bg-purple-500/20 text-purple-400';
      case 'delivered': return 'bg-green-500/20 text-green-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Čaká';
      case 'processing': return 'Spracováva sa';
      case 'shipped': return 'Odoslané';
      case 'delivered': return 'Doručené';
      default: return status;
    }
  };

  const colorClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/20 text-blue-400';
      case 'green': return 'bg-green-500/20 text-green-400';
      case 'purple': return 'bg-purple-500/20 text-purple-400';
      case 'orange': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prehľad</h1>
          <p className="text-slate-400 mt-1">Vitajte späť! Tu je prehľad vášho obchodu.</p>
        </div>
        <div className="flex items-center gap-2">
          {(['today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'today' ? 'Dnes' : p === 'week' ? 'Týždeň' : 'Mesiac'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Tržby</h2>
            <Link href="/dashboard/analytics" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Zobraziť všetko <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500">Graf tržieb</p>
              <p className="text-xs text-slate-600">Pripojte sa k API pre živé dáta</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Rýchle akcie</h2>
          <div className="space-y-3">
            <Link href="/dashboard/products/new" className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Pridať produkt</p>
                <p className="text-xs text-slate-400">Nový produkt do katalógu</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400" />
            </Link>
            <Link href="/dashboard/orders" className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Objednávky</p>
                <p className="text-xs text-slate-400">3 čakajú na spracovanie</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400" />
            </Link>
            <Link href="/dashboard/shop-builder" className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Shop Builder</p>
                <p className="text-xs text-slate-400">Upraviť dizajn obchodu</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Posledné objednávky</h2>
            <Link href="/dashboard/orders" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Všetky <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{order.number}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${statusColor(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{order.total.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Top produkty</h2>
            <Link href="/dashboard/products" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Všetky <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-400">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.sales} predaných</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">€{product.revenue.toLocaleString()}</p>
                  <p className={`text-xs ${product.stock < 15 ? 'text-red-400' : 'text-slate-500'}`}>
                    {product.stock} ks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts / Notifications */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-400">Upozornenia</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>• <strong>3 produkty</strong> majú nízky sklad (menej ako 10 ks)</li>
              <li>• <strong>2 objednávky</strong> čakajú na spracovanie viac ako 24 hodín</li>
              <li>• Vaša skúšobná verzia vyprší o <strong>7 dní</strong></li>
            </ul>
          </div>
          <Link href="/dashboard/settings" className="text-sm text-orange-400 hover:underline whitespace-nowrap">
            Vyriešiť →
          </Link>
        </div>
      </div>
    </div>
  );
}
