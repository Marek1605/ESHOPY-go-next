'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Store, DollarSign, Database, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, ExternalLink, ArrowRight,
  Package, ShoppingCart, Activity, Server, HardDrive, Cpu,
  RefreshCw, MoreHorizontal, Eye
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════════

const stats = [
  { label: 'Používatelia', value: '1,247', change: 8.5, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Aktívne obchody', value: '856', change: 12.3, icon: Store, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Mesačné tržby', value: '€48,750', change: 15.2, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Aktívne feedy', value: '342', change: -2.8, icon: Database, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

const recentShops = [
  { id: '1', name: 'TechShop.sk', owner: 'Ján Novák', email: 'jan@techshop.sk', products: 456, orders: 89, status: 'active', plan: 'Pro', slug: 'techshop' },
  { id: '2', name: 'ModaDnes.sk', owner: 'Mária Kováčová', email: 'maria@modadnes.sk', products: 892, orders: 234, status: 'active', plan: 'Business', slug: 'modadnes' },
  { id: '3', name: 'BioFood.sk', owner: 'Peter Horváth', email: 'peter@biofood.sk', products: 234, orders: 45, status: 'pending', plan: 'Free', slug: 'biofood' },
  { id: '4', name: 'SportZone.sk', owner: 'Anna Szabová', email: 'anna@sportzone.sk', products: 567, orders: 123, status: 'active', plan: 'Pro', slug: 'sportzone' },
];

const systemAlerts = [
  { type: 'warning', title: 'Vysoké využitie RAM', message: 'Server EU-1 využíva 87% RAM', time: 'pred 10 min' },
  { type: 'info', title: 'Nová verzia API', message: 'API 2.5.0 je dostupná na aktualizáciu', time: 'pred 1 hod' },
  { type: 'success', title: 'Záloha dokončená', message: 'Denná záloha databázy úspešná', time: 'pred 3 hod' },
];

const serverStats = [
  { label: 'CPU', value: 45, max: 100, unit: '%', icon: Cpu },
  { label: 'RAM', value: 12.4, max: 16, unit: 'GB', icon: Server },
  { label: 'Disk', value: 234, max: 500, unit: 'GB', icon: HardDrive },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Prehľad celej platformy EshopBuilder</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary text-sm py-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Obnoviť
          </button>
          <Link href="/admin/shops/new" className="btn-primary text-sm py-2">
            <Store className="w-4 h-4" />
            Nový obchod
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
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

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Shops - 2 columns */}
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Posledné obchody</h2>
              <p className="text-sm text-gray-400">Nedávno vytvorené alebo aktualizované</p>
            </div>
            <Link href="/admin/shops" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Všetky obchody <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Obchod</th>
                  <th className="pb-3 font-medium">Produkty</th>
                  <th className="pb-3 font-medium">Objednávky</th>
                  <th className="pb-3 font-medium">Plán</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {recentShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {shop.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{shop.name}</p>
                          <p className="text-xs text-gray-500">{shop.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-300">{shop.products}</td>
                    <td className="py-4 text-gray-300">{shop.orders}</td>
                    <td className="py-4">
                      <span className={`badge ${
                        shop.plan === 'Business' ? 'badge-pro' : 
                        shop.plan === 'Pro' ? 'badge-info' : 'badge-success'
                      }`}>
                        {shop.plan}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`badge ${
                        shop.status === 'active' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {shop.status === 'active' ? 'Aktívny' : 'Čaká'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <Link 
                          href={`/store/${shop.slug}`} 
                          target="_blank"
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Zobraziť obchod"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </Link>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* System Alerts */}
          <div className="stat-card">
            <h3 className="font-semibold text-white mb-4">Systémové upozornenia</h3>
            <div className="space-y-3">
              {systemAlerts.map((alert, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl ${
                    alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' : 
                    alert.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' : 
                    'bg-blue-500/10 border border-blue-500/20'
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-1 ${
                    alert.type === 'warning' ? 'text-yellow-400' : 
                    alert.type === 'success' ? 'text-emerald-400' : 
                    'text-blue-400'
                  }`}>
                    {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
                     alert.type === 'success' ? <CheckCircle className="w-4 h-4" /> : 
                     <Clock className="w-4 h-4" />}
                    <span className="text-sm font-medium">{alert.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-6">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1 ml-6">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Server Stats */}
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Stav serverov</h3>
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div className="space-y-4">
              {serverStats.map((stat, i) => {
                const percentage = (stat.value / stat.max) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <stat.icon className="w-4 h-4" />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {stat.value} / {stat.max} {stat.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          percentage > 80 ? 'bg-red-500' : 
                          percentage > 60 ? 'bg-yellow-500' : 
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
