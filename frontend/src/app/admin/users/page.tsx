'use client';
import { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, User, Mail, Store, Ban, CheckCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 1, name: 'Ján Novák', email: 'jan@email.sk', role: 'merchant', shop: 'TechShop.sk', status: 'active', created: '2026-01-15' },
    { id: 2, name: 'Mária Kováčová', email: 'maria@email.sk', role: 'merchant', shop: 'ModaDnes.sk', status: 'active', created: '2026-01-10' },
    { id: 3, name: 'Peter Horváth', email: 'peter@email.sk', role: 'merchant', shop: 'BioFood.sk', status: 'suspended', created: '2026-01-05' },
    { id: 4, name: 'Admin User', email: 'admin@example.com', role: 'admin', shop: '-', status: 'active', created: '2025-12-01' },
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Používatelia</h1>
        <p className="text-gray-400">Spravujte všetkých používateľov platformy</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Celkom', value: '1,247' },
          { label: 'Aktívnych', value: '1,189' },
          { label: 'Suspendovaných', value: '58' },
          { label: 'Adminov', value: '3' },
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
            <input type="text" placeholder="Hľadať používateľov..." className="input-field pl-10" />
          </div>
          <button className="btn-secondary"><Filter className="w-5 h-5" />Filtre</button>
        </div>
      </div>

      <div className="stat-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Používateľ</th>
              <th>Rola</th>
              <th>Obchod</th>
              <th>Stav</th>
              <th>Registrácia</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                      {user.role === 'admin' ? <Shield className="w-5 h-5" /> : user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-error' : 'badge-info'}`}>
                    {user.role === 'admin' ? 'Admin' : 'Obchodník'}
                  </span>
                </td>
                <td>
                  {user.shop !== '-' ? (
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" />
                      {user.shop}
                    </div>
                  ) : '-'}
                </td>
                <td>
                  <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                    {user.status === 'active' ? 'Aktívny' : 'Suspendovaný'}
                  </span>
                </td>
                <td className="text-gray-400">{user.created}</td>
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
