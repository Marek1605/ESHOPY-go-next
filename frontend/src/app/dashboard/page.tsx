'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, ShoppingCart, Users, Package, 
  CreditCard, ArrowRight, Eye, Clock, AlertCircle, CheckCircle,
  MoreHorizontal, ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const [period, setPeriod] = useState('today');
  const [stats, setStats] = useState({
    revenue: 2847,
    revenueChange: 12.5,
    orders: 156,
    ordersChange: 8.2,
    visitors: 3421,
    visitorsChange: 23.1,
    conversion: 4.6,
    conversionChange: 0.5,
  });

  const recentOrders = [
    { id: '#12847', customer: 'Martin Kováč', amount: 129.90, status: 'completed', time: 'pred 5 min' },
    { id: '#12846', customer: 'Jana Nováková', amount: 89.50, status: 'processing', time: 'pred 12 min' },
    { id: '#12845', customer: 'Peter Horváth', amount: 249.00, status: 'pending', time: 'pred 25 min' },
    { id: '#12844', customer: 'Eva Szabová', amount: 59.90, status: 'completed', time: 'pred 1 hod' },
    { id: '#12843', customer: 'Tomáš Molnár', amount: 199.00, status: 'completed', time: 'pred 2 hod' },
  ];

  const topProducts = [
    { name: 'Premium Slúchadlá X1', sales: 48, revenue: 4799.52, image: '🎧' },
    { name: 'Bezdrôtová klávesnica', sales: 35, revenue: 2449.65, image: '⌨️' },
    { name: 'USB-C Hub 7v1', sales: 29, revenue: 1449.71, image: '🔌' },
    { name: 'Webkamera HD', sales: 24, revenue: 1679.76, image: '📷' },
  ];

  const statusColors: Record<string, string> = {
    completed: 'badge-success',
    processing: 'badge-info',
    pending: 'badge-warning',
    cancelled: 'badge-error',
  };

  const statusLabels: Record<string, string> = {
    completed: 'Dokončená',
    processing: 'Spracováva sa',
    pending: 'Čaká na platbu',
    cancelled: 'Zrušená',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prehľad</h1>
          <p className="text-gray-400">Vitajte späť! Tu je prehľad vášho obchodu.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
          {['today', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === p 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {p === 'today' ? 'Dnes' : p === 'week' ? 'Týždeň' : p === 'month' ? 'Mesiac' : 'Rok'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-green-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.revenueChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.revenueChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">€{stats.revenue.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-1">Tržby</p>
        </div>

        {/* Orders */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.ordersChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.ordersChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.ordersChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.orders}</p>
          <p className="text-gray-400 text-sm mt-1">Objednávky</p>
        </div>

        {/* Visitors */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.visitorsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.visitorsChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.visitorsChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.visitors.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-1">Návštevníci</p>
        </div>

        {/* Conversion */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.conversionChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.conversionChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.conversionChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.conversion}%</p>
          <p className="text-gray-400 text-sm mt-1">Konverzia</p>
        </div>
      </div>

      {/* Charts & Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Prehľad predajov</h2>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Posledných 7 dní</option>
              <option>Posledných 30 dní</option>
              <option>Posledných 90 dní</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((day, i) => {
              const height = [40, 65, 45, 80, 55, 90, 70][i];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-400">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Top produkty</h2>
            <Link href="/dashboard/products" className="text-blue-400 text-sm hover:text-blue-300 transition">
              Zobraziť všetky
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl">
                  {product.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.sales} predaných</p>
                </div>
                <p className="font-semibold text-green-400">€{product.revenue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold">Posledné objednávky</h2>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition">
            Zobraziť všetky
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Objednávka</th>
                <th>Zákazník</th>
                <th>Suma</th>
                <th>Stav</th>
                <th>Čas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="font-medium">{order.id}</span>
                  </td>
                  <td>{order.customer}</td>
                  <td className="font-semibold">€{order.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="text-gray-400">{order.time}</td>
                  <td>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/products/new" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/50 transition flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition">
            <Package className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="font-medium">Pridať produkt</p>
            <p className="text-sm text-gray-400">Nový produkt do katalógu</p>
          </div>
        </Link>

        <Link href="/dashboard/orders" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-green-500/50 transition flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition">
            <ShoppingCart className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="font-medium">Spracovať objednávky</p>
            <p className="text-sm text-gray-400">3 čakajúce objednávky</p>
          </div>
        </Link>

        <Link href="/dashboard/templates" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500/50 transition flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition">
            <Eye className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="font-medium">Upraviť vzhľad</p>
            <p className="text-sm text-gray-400">Zmeniť šablónu obchodu</p>
          </div>
        </Link>

        <Link href="/dashboard/analytics" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 transition flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition">
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <p className="font-medium">Analytika</p>
            <p className="text-sm text-gray-400">Detailné štatistiky</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
