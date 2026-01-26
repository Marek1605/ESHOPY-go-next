'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Eye, BarChart3,
  Package, Users, ArrowRight, Plus, ExternalLink, Palette, MoreHorizontal,
  CheckCircle, Clock, AlertTriangle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════

function StatCard({ 
  title, value, change, changeType, icon: Icon, color 
}: { 
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: any;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; iconBg: string }> = {
    green: { bg: 'from-green-500/20', text: 'text-green-400', iconBg: 'bg-green-500/20' },
    blue: { bg: 'from-blue-500/20', text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
    purple: { bg: 'from-purple-500/20', text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
    orange: { bg: 'from-orange-500/20', text: 'text-orange-400', iconBg: 'bg-orange-500/20' },
  };

  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`bg-gradient-to-br ${c.bg} to-transparent bg-gray-900 border border-gray-800 rounded-2xl p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {changeType === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function QuickActions() {
  const actions = [
    { icon: Plus, label: 'Pridať do ponuky', href: '/dashboard/products/new', color: 'blue' },
    { icon: Package, label: '3 čakajú', href: '/dashboard/orders', color: 'orange', badge: true },
    { icon: Palette, label: 'Upraviť stránku', href: '/dashboard/shop-builder', color: 'purple' },
    { icon: ExternalLink, label: '7 dostupných', href: '/dashboard/templates', color: 'green' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, i) => (
        <Link
          key={i}
          href={action.href}
          className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all group"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${action.color}-500/20`}>
            <action.icon className={`w-5 h-5 text-${action.color}-400`} />
          </div>
          <span className="text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECENT ORDERS
// ═══════════════════════════════════════════════════════════════════════════════

function RecentOrders() {
  const orders = [
    { id: 'ORD-001', customer: 'Ján Novák', total: 89.99, status: 'completed', items: 2 },
    { id: 'ORD-002', customer: 'Mária K.', total: 249.50, status: 'processing', items: 5 },
    { id: 'ORD-003', customer: 'Peter S.', total: 34.99, status: 'pending', items: 1 },
    { id: 'ORD-004', customer: 'Anna M.', total: 159.00, status: 'completed', items: 3 },
    { id: 'ORD-005', customer: 'Tomáš H.', total: 79.99, status: 'processing', items: 2 },
  ];

  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    completed: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle, label: 'Dokončené' },
    processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock, label: 'Spracováva sa' },
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle, label: 'Čaká' },
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h2 className="font-semibold text-white">Posledné objednávky</h2>
        <Link href="/dashboard/orders" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
          Zobraziť všetky <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="divide-y divide-gray-800">
        {orders.map(order => {
          const status = statusConfig[order.status];
          return (
            <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer} · {order.items} položiek</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                  <status.icon className="w-3.5 h-3.5" />
                  {status.label}
                </span>
                <span className="font-semibold text-white">€{order.total.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOP PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════

function TopProducts() {
  const products = [
    { name: 'Bezdrôtové slúchadlá Pro', sold: 124, revenue: 11151.76 },
    { name: 'Smart Watch Ultra', sold: 89, revenue: 17799.11 },
    { name: 'Prémiový obal na telefón', sold: 256, revenue: 7679.44 },
    { name: 'USB-C Hub 7v1', sold: 178, revenue: 8899.22 },
    { name: 'Bluetooth reproduktor', sold: 145, revenue: 8699.55 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl">
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <h2 className="font-semibold text-white">Top produkty</h2>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        {products.map((product, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="w-6 text-center text-gray-500 font-medium">{i + 1}</span>
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{product.name}</p>
              <p className="text-sm text-gray-500">{product.sold} predaných</p>
            </div>
            <span className="font-semibold text-white">€{product.revenue.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Vitajte späť! 👋</h1>
          <p className="text-gray-400 mt-1">Tu je prehľad vášho obchodu.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/store/demo"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Zobraziť obchod
          </Link>
          <Link
            href="/dashboard/shop-builder"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Palette className="w-4 h-4" />
            Upraviť dizajn
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tržby dnes"
          value="€1,234"
          change="+12.5%"
          changeType="up"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Objednávky"
          value="28"
          change="+5.2%"
          changeType="up"
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Návštevníci"
          value="1,847"
          change="-2.4%"
          changeType="down"
          icon={Eye}
          color="purple"
        />
        <StatCard
          title="Konverzia"
          value="3.2%"
          change="+0.8%"
          changeType="up"
          icon={BarChart3}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}
