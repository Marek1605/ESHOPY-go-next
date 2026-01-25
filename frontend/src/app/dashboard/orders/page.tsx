'use client';
import { useState } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders] = useState([
    { id: '#1234', customer: 'Ján Novák', email: 'jan@email.sk', items: 3, total: 189.99, status: 'completed', date: '2026-01-24' },
    { id: '#1233', customer: 'Mária Kováčová', email: 'maria@email.sk', items: 1, total: 156.50, status: 'processing', date: '2026-01-24' },
    { id: '#1232', customer: 'Peter Horváth', email: 'peter@email.sk', items: 2, total: 45.00, status: 'pending', date: '2026-01-23' },
    { id: '#1231', customer: 'Anna Szabóová', email: 'anna@email.sk', items: 5, total: 234.00, status: 'shipped', date: '2026-01-23' },
    { id: '#1230', customer: 'Tomáš Molnár', email: 'tomas@email.sk', items: 1, total: 89.99, status: 'completed', date: '2026-01-22' },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Dokončená';
      case 'shipped': return 'Odoslaná';
      case 'processing': return 'Spracováva sa';
      default: return 'Čaká';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Objednávky</h1>
        <p className="text-gray-400">Spravujte objednávky vášho e-shopu</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Všetky', count: 156, color: 'blue' },
          { label: 'Čakajúce', count: 12, color: 'yellow' },
          { label: 'Spracovávané', count: 8, color: 'purple' },
          { label: 'Dokončené', count: 136, color: 'green' },
        ].map((stat, i) => (
          <div key={i} className="stat-card text-center py-4">
            <div className="text-2xl font-bold">{stat.count}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="stat-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Hľadať objednávky..." className="input-field pl-10" />
          </div>
          <button className="btn-secondary"><Filter className="w-5 h-5" />Filtre</button>
        </div>
      </div>

      <div className="stat-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Objednávka</th>
              <th>Zákazník</th>
              <th>Položky</th>
              <th>Suma</th>
              <th>Stav</th>
              <th>Dátum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-semibold">{order.id}</td>
                <td>
                  <div>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-gray-400 text-sm">{order.email}</div>
                  </div>
                </td>
                <td>{order.items} ks</td>
                <td className="font-semibold">€{order.total}</td>
                <td>
                  <span className={`badge flex items-center gap-1 ${
                    order.status === 'completed' ? 'badge-success' : 
                    order.status === 'shipped' ? 'badge-info' : 
                    order.status === 'processing' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="text-gray-400">{order.date}</td>
                <td>
                  <button className="p-2 hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-gray-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
