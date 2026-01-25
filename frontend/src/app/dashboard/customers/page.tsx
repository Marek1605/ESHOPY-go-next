'use client';
import { useState } from 'react';
import { Search, Filter, Mail, Phone, ShoppingCart, User } from 'lucide-react';

export default function CustomersPage() {
  const [customers] = useState([
    { id: 1, name: 'Ján Novák', email: 'jan@email.sk', phone: '+421 900 123 456', orders: 12, spent: 1250.00, lastOrder: '2026-01-24' },
    { id: 2, name: 'Mária Kováčová', email: 'maria@email.sk', phone: '+421 900 234 567', orders: 8, spent: 890.50, lastOrder: '2026-01-23' },
    { id: 3, name: 'Peter Horváth', email: 'peter@email.sk', phone: '+421 900 345 678', orders: 3, spent: 245.00, lastOrder: '2026-01-20' },
    { id: 4, name: 'Anna Szabóová', email: 'anna@email.sk', phone: '+421 900 456 789', orders: 15, spent: 2100.00, lastOrder: '2026-01-22' },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Zákazníci</h1>
        <p className="text-gray-400">Spravujte vašich zákazníkov</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Celkom', value: '1,247' },
          { label: 'Noví tento mesiac', value: '89' },
          { label: 'Vracajúci sa', value: '68%' },
          { label: 'Priemerná útrata', value: '€156' },
        ].map((stat, i) => (
          <div key={i} className="stat-card text-center py-4">
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="stat-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Hľadať zákazníkov..." className="input-field pl-10" />
          </div>
          <button className="btn-secondary"><Filter className="w-5 h-5" />Filtre</button>
        </div>
      </div>

      <div className="stat-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Zákazník</th>
              <th>Kontakt</th>
              <th>Objednávky</th>
              <th>Útrata</th>
              <th>Posledná objednávka</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                </td>
                <td>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 text-sm"><Mail className="w-4 h-4" />{customer.email}</div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm"><Phone className="w-4 h-4" />{customer.phone}</div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                    {customer.orders}
                  </div>
                </td>
                <td className="font-semibold">€{customer.spent.toFixed(2)}</td>
                <td className="text-gray-400">{customer.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
