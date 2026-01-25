'use client';
import { Users, Store, DollarSign, Database, TrendingUp, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Používatelia', value: '1,247', change: '+8.5%', icon: Users },
    { label: 'Obchody', value: '856', change: '+12.3%', icon: Store },
    { label: 'Mesačné tržby', value: '€48,750', change: '+15.2%', icon: DollarSign },
    { label: 'Aktívne feedy', value: '342', change: '+5.8%', icon: Database },
  ];

  const recentShops = [
    { name: 'TechShop.sk', owner: 'Ján Novák', products: 456, status: 'active', slug: 'techshop' },
    { name: 'ModaDnes.sk', owner: 'Mária K.', products: 892, status: 'active', slug: 'modadnes' },
    { name: 'BioFood.sk', owner: 'Peter H.', products: 234, status: 'pending', slug: 'biofood' },
  ];

  const alerts = [
    { type: 'warning', msg: 'Vysoké využitie RAM na EU-1', time: 'pred 10 min' },
    { type: 'info', msg: 'Nová verzia API 2.5', time: 'pred 1 hod' },
    { type: 'success', msg: 'Záloha dokončená', time: 'pred 3 hod' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Prehľad celej platformy EshopBuilder</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><s.icon className="w-6 h-6 text-blue-400" /></div>
              <span className="flex items-center gap-1 text-sm text-green-400"><TrendingUp className="w-4 h-4" />{s.change}</span>
            </div>
            <div className="text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Posledné obchody</h3>
            <a href="/admin/shops" className="text-blue-400 text-sm hover:underline">Všetky</a>
          </div>
          <div className="space-y-3">
            {recentShops.map((shop, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{shop.name}</div>
                    <div className="text-sm text-gray-400">{shop.owner} • {shop.products} produktov</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${shop.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {shop.status === 'active' ? 'Aktívny' : 'Čaká'}
                  </span>
                  <a href={`/store/${shop.slug}`} target="_blank" className="p-2 hover:bg-slate-700 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4">Upozornenia</h3>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={`p-3 rounded-lg ${a.type === 'warning' ? 'bg-yellow-500/10' : a.type === 'success' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                <div className={`flex items-center gap-2 ${a.type === 'warning' ? 'text-yellow-400' : a.type === 'success' ? 'text-green-400' : 'text-blue-400'}`}>
                  {a.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : a.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span className="text-sm">{a.msg}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
