'use client';
import { Search, Filter, Eye, Truck, CheckCircle, Clock, Package } from 'lucide-react';

export default function OrdersPage() {
  const orders = [
    { id: '#1234', customer: 'Ján Novák', email: 'jan@email.sk', items: 3, total: 189.99, status: 'completed', date: '24.01.2026' },
    { id: '#1233', customer: 'Mária Kováčová', email: 'maria@email.sk', items: 1, total: 156.50, status: 'processing', date: '24.01.2026' },
    { id: '#1232', customer: 'Peter Horváth', email: 'peter@email.sk', items: 2, total: 45.00, status: 'pending', date: '23.01.2026' },
    { id: '#1231', customer: 'Anna Szabóová', email: 'anna@email.sk', items: 5, total: 234.00, status: 'shipped', date: '23.01.2026' },
  ];

  const getStatus = (s: string) => {
    switch (s) {
      case 'completed': return { icon: CheckCircle, label: 'Dokončená', class: 'badge-success' };
      case 'shipped': return { icon: Truck, label: 'Odoslaná', class: 'badge-info' };
      case 'processing': return { icon: Package, label: 'Spracováva sa', class: 'badge-warning' };
      default: return { icon: Clock, label: 'Čaká', class: 'badge-error' };
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Objednávky</h1>
        <p className="text-gray-400">Spravujte objednávky vášho e-shopu</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{ l: 'Všetky', v: 156 }, { l: 'Čakajúce', v: 12 }, { l: 'Odoslané', v: 8 }, { l: 'Dokončené', v: 136 }].map((s, i) => (
          <div key={i} className="stat-card text-center py-4">
            <div className="text-2xl font-bold">{s.v}</div>
            <div className="text-gray-400 text-sm">{s.l}</div>
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

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Objednávka</th><th>Zákazník</th><th>Položky</th><th>Suma</th><th>Stav</th><th>Dátum</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const st = getStatus(o.status);
              return (
                <tr key={o.id}>
                  <td className="font-semibold">{o.id}</td>
                  <td><div className="font-medium">{o.customer}</div><div className="text-gray-400 text-sm">{o.email}</div></td>
                  <td>{o.items} ks</td>
                  <td className="font-semibold">€{o.total}</td>
                  <td><span className={`badge flex items-center gap-1 ${st.class}`}><st.icon className="w-3 h-3" />{st.label}</span></td>
                  <td className="text-gray-400">{o.date}</td>
                  <td><button className="p-2 hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-gray-400" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
