'use client';
import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ revenue: 2847, orders: 156, visitors: 3421, conversion: 4.6 });
  const [recentOrders, setRecentOrders] = useState([
    { id: '#1234', customer: 'Ján Novák', amount: 89.99, status: 'completed', date: 'Pred 2 hod' },
    { id: '#1233', customer: 'Mária Kováčová', amount: 156.50, status: 'processing', date: 'Pred 3 hod' },
    { id: '#1232', customer: 'Peter Horváth', amount: 45.00, status: 'pending', date: 'Pred 5 hod' },
    { id: '#1231', customer: 'Anna Szabóová', amount: 234.00, status: 'completed', date: 'Včera' },
  ]);
  const [topProducts, setTopProducts] = useState([
    { name: 'Wireless Headphones', sales: 45, revenue: 4050 },
    { name: 'Smart Watch', sales: 32, revenue: 6400 },
    { name: 'Phone Case', sales: 89, revenue: 1335 },
    { name: 'USB Cable', sales: 156, revenue: 1560 },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Prehľad vášho e-shopu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Tržby', value: `€${stats.revenue.toLocaleString()}`, change: '+12.5%', up: true, icon: DollarSign },
          { label: 'Objednávky', value: stats.orders, change: '+8.2%', up: true, icon: ShoppingCart },
          { label: 'Návštevníci', value: stats.visitors.toLocaleString(), change: '+23.1%', up: true, icon: Users },
          { label: 'Konverzia', value: `${stats.conversion}%`, change: '+0.5%', up: true, icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className={`flex items-center gap-1 text-sm ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-semibold mb-4">Posledné objednávky</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <span className="font-medium">{order.id}</span>
                  <span className="text-gray-400 text-sm ml-2">{order.customer}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge ${order.status === 'completed' ? 'badge-success' : order.status === 'processing' ? 'badge-warning' : 'badge-info'}`}>
                    {order.status === 'completed' ? 'Dokončená' : order.status === 'processing' ? 'Spracováva sa' : 'Čaká'}
                  </span>
                  <span className="font-semibold">€{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4">Top produkty</h3>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">€{product.revenue}</div>
                  <div className="text-gray-400 text-sm">{product.sales} predajov</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
