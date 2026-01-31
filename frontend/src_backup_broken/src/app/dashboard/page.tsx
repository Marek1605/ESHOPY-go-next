'use client';
import { useState } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Tržby', value: '€2,847', change: '+12.5%', icon: DollarSign, color: 'emerald' },
    { label: 'Objednávky', value: '156', change: '+8.2%', icon: ShoppingCart, color: 'blue' },
    { label: 'Návštevníci', value: '3,421', change: '+23.1%', icon: Users, color: 'purple' },
    { label: 'Konverzia', value: '4.6%', change: '+0.5%', icon: TrendingUp, color: 'orange' },
  ];

  const orders = [
    { id: '#1234', customer: 'Ján Novák', amount: 89.99, status: 'completed' },
    { id: '#1233', customer: 'Mária K.', amount: 156.50, status: 'processing' },
    { id: '#1232', customer: 'Peter H.', amount: 45.00, status: 'pending' },
  ];

  const products = [
    { name: 'Premium Slúchadlá X1', sales: 48, revenue: 4799.52 },
    { name: 'Bezdrôtová klávesnica', sales: 35, revenue: 2449.65 },
    { name: 'USB-C Hub 7v1', sales: 29, revenue: 1449.71 },
    { name: 'Webkamera HD', sales: 24, revenue: 1679.76 },
  ];

  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const chartData = [65, 45, 78, 52, 90, 68, 42];
  const max = Math.max(...chartData);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Prehľad</h1>
          <p className="text-gray-400">Vitajte späť! Tu je prehľad vášho obchodu.</p>
        </div>
        <div className="flex gap-2">
          {['Dnes', 'Týždeň', 'Mesiac', 'Rok'].map((t, i) => (
            <button key={t} className={`px-4 py-2 rounded-lg text-sm ${i === 0 ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/20 flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 text-${s.color}-400`} />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-400">
                <ArrowUpRight className="w-4 h-4" />{s.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Prehľad predajov</h3>
            <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
              <option>Posledných 7 dní</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-48">
            {chartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: `${(val / max) * 100}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-lg" />
                </div>
                <span className="text-xs text-gray-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top produkty</h3>
            <a href="/dashboard/products" className="text-blue-400 text-sm hover:underline">Zobraziť všetky</a>
          </div>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.sales} predaných</div>
                </div>
                <div className="text-green-400 font-semibold">€{p.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
