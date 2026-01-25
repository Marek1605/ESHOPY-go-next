'use client';
import { useState } from 'react';
import { Search, Filter, ExternalLink, MoreVertical, Store, Package, ShoppingCart, Users } from 'lucide-react';

export default function AdminShopsPage() {
  const [shops] = useState([
    { id: 1, name: 'TechShop.sk', owner: 'Ján Novák', products: 456, orders: 1234, revenue: 45600, status: 'active', plan: 'Business' },
    { id: 2, name: 'ModaDnes.sk', owner: 'Mária Kováčová', products: 892, orders: 2341, revenue: 89200, status: 'active', plan: 'Enterprise' },
    { id: 3, name: 'BioFood.sk', owner: 'Peter Horváth', products: 234, orders: 567, revenue: 23400, status: 'suspended', plan: 'Starter' },
    { id: 4, name: 'SportZone.sk', owner: 'Anna Szabóová', products: 678, orders: 1890, revenue: 67800, status: 'active', plan: 'Business' },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Obchody</h1>
        <p className="text-gray-400">Spravujte všetky obchody na platforme</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Celkom obchodov', value: '856', icon: Store },
          { label: 'Produktov', value: '125,432', icon: Package },
          { label: 'Objednávok', value: '45,678', icon: ShoppingCart },
          { label: 'Aktívnych dnes', value: '234', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="stat-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Hľadať obchody..." className="input-field pl-10" />
          </div>
          <button className="btn-secondary"><Filter className="w-5 h-5" />Filtre</button>
        </div>
      </div>

      <div className="stat-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Obchod</th>
              <th>Majiteľ</th>
              <th>Produkty</th>
              <th>Objednávky</th>
              <th>Tržby</th>
              <th>Plán</th>
              <th>Stav</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{shop.name}</div>
                      <a href="#" className="text-blue-400 text-sm flex items-center gap-1 hover:underline">
                        Otvoriť <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="text-gray-400">{shop.owner}</td>
                <td>{shop.products.toLocaleString()}</td>
                <td>{shop.orders.toLocaleString()}</td>
                <td className="font-semibold">€{shop.revenue.toLocaleString()}</td>
                <td>
                  <span className={`badge ${shop.plan === 'Enterprise' ? 'badge-warning' : shop.plan === 'Business' ? 'badge-info' : 'badge-success'}`}>
                    {shop.plan}
                  </span>
                </td>
                <td>
                  <span className={`badge ${shop.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                    {shop.status === 'active' ? 'Aktívny' : 'Suspendovaný'}
                  </span>
                </td>
                <td>
                  <button className="p-2 hover:bg-slate-700 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
