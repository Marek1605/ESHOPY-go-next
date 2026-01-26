'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, Settings, TrendingUp,
  DollarSign, Eye, ShoppingCart, ArrowUpRight, ArrowDownRight, Plus,
  Sparkles, ChevronRight, MoreHorizontal, Calendar, Clock, Bell,
  FileText, BarChart2, Layers, Palette, Truck, CreditCard, Zap,
  HelpCircle, ExternalLink, Store
} from 'lucide-react';
import { useEditor, formatPrice, demoProducts } from '@/lib/store';

// Quick Stats Cards
const stats = [
  { 
    label: 'Tržby dnes', 
    value: '€1,234', 
    change: '+12.5%', 
    up: true, 
    icon: DollarSign,
    color: 'bg-green-500',
  },
  { 
    label: 'Objednávky', 
    value: '23', 
    change: '+5.2%', 
    up: true, 
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  { 
    label: 'Návštevníci', 
    value: '1,847', 
    change: '-2.4%', 
    up: false, 
    icon: Eye,
    color: 'bg-purple-500',
  },
  { 
    label: 'Konverzia', 
    value: '3.2%', 
    change: '+0.8%', 
    up: true, 
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

// Recent Orders
const recentOrders = [
  { id: 'ORD-001', customer: 'Ján Novák', total: 89.99, status: 'completed', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Mária Kováčová', total: 156.50, status: 'processing', date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Peter Horváth', total: 45.00, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Anna Szabóová', total: 234.99, status: 'shipped', date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Tomáš Varga', total: 67.50, status: 'completed', date: '2024-01-13' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Čaká',
  processing: 'Spracováva sa',
  shipped: 'Odoslané',
  completed: 'Dokončené',
  cancelled: 'Zrušené',
};

export default function DashboardPage() {
  const { shopSettings } = useEditor();
  const theme = shopSettings.theme;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 text-white flex flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold block">EshopBuilder</span>
              <span className="text-xs text-gray-400">Pro verzia</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800 text-white">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/dashboard/shop-builder" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Layers className="w-5 h-5" /> Shop Builder
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Package className="w-5 h-5" /> Produkty
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" /> Objednávky
            <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">3</span>
          </Link>
          <Link href="/dashboard/customers" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <Users className="w-5 h-5" /> Zákazníci
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <BarChart2 className="w-5 h-5" /> Analytika
          </Link>
          
          <div className="pt-4 mt-4 border-t border-gray-800">
            <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Nastavenia</p>
            <Link href="/dashboard/settings/general" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Settings className="w-5 h-5" /> Všeobecné
            </Link>
            <Link href="/dashboard/settings/shipping" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <Truck className="w-5 h-5" /> Doprava
            </Link>
            <Link href="/dashboard/settings/payments" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" /> Platby
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="font-bold">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">Marek</p>
              <p className="text-xs text-gray-400 truncate">admin@shop.sk</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-500">Vitajte späť! Tu je prehľad vášho obchodu.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <a
                href={`/store/${shopSettings.slug || 'demo'}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
              >
                <Store className="w-4 h-4" /> Zobraziť obchod
              </a>
              <Link
                href="/dashboard/shop-builder"
                className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Palette className="w-4 h-4" /> Upraviť dizajn
              </Link>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Link
              href="/dashboard/products/new"
              className="bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow border"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Nový produkt</p>
                <p className="text-xs text-gray-500">Pridať do ponuky</p>
              </div>
            </Link>
            <Link
              href="/dashboard/orders"
              className="bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow border"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Objednávky</p>
                <p className="text-xs text-gray-500">3 čakajú</p>
              </div>
            </Link>
            <Link
              href="/dashboard/shop-builder"
              className="bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow border"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Shop Builder</p>
                <p className="text-xs text-gray-500">Upraviť stránku</p>
              </div>
            </Link>
            <Link
              href="/dashboard/templates"
              className="bg-white rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow border"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Šablóny</p>
                <p className="text-xs text-gray-500">7 dostupných</p>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg">Posledné objednávky</h2>
                <Link href="/dashboard/orders" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                  Zobraziť všetky <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                        {order.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="font-bold text-lg">Top produkty</h2>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {demoProducts.slice(0, 5).map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.reviewCount} predaných</p>
                    </div>
                    <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Potrebujete pomoc?</h3>
              <p className="text-white/80 mb-4">Pozrite si našu dokumentáciu alebo nás kontaktujte.</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white text-blue-600 rounded-xl font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Dokumentácia
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-xl font-medium flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Podpora
                </button>
              </div>
            </div>
            <Zap className="w-24 h-24 text-white/20" />
          </div>
        </div>
      </main>
    </div>
  );
}
