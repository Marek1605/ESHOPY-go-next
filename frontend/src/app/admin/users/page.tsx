'use client';
import { Search, Filter, MoreVertical, Shield, Mail, Store } from 'lucide-react';

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: 'Ján Novák', email: 'jan@email.sk', role: 'merchant', shop: 'TechShop.sk', status: 'active', date: '15.01.2026' },
    { id: 2, name: 'Mária Kováčová', email: 'maria@email.sk', role: 'merchant', shop: 'ModaDnes.sk', status: 'active', date: '10.01.2026' },
    { id: 3, name: 'Peter Horváth', email: 'peter@email.sk', role: 'merchant', shop: 'BioFood.sk', status: 'suspended', date: '05.01.2026' },
    { id: 4, name: 'Admin', email: 'admin@example.com', role: 'admin', shop: '-', status: 'active', date: '01.12.2025' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Používatelia</h1>
        <p className="text-gray-400">Spravujte používateľov platformy</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{ l: 'Celkom', v: '1,247' }, { l: 'Aktívnych', v: '1,189' }, { l: 'Suspendovaných', v: '58' }, { l: 'Adminov', v: '3' }].map((s, i) => (
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
            <input type="text" placeholder="Hľadať..." className="input-field pl-10" />
          </div>
          <button className="btn-secondary"><Filter className="w-5 h-5" />Filtre</button>
        </div>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Používateľ</th><th>Rola</th><th>Obchod</th><th>Stav</th><th>Registrácia</th><th></th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${u.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                      {u.role === 'admin' ? <Shield className="w-5 h-5" /> : u.name.charAt(0)}
                    </div>
                    <div><div className="font-medium">{u.name}</div><div className="text-gray-400 text-sm flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</div></div>
                  </div>
                </td>
                <td><span className={`badge ${u.role === 'admin' ? 'badge-error' : 'badge-info'}`}>{u.role === 'admin' ? 'Admin' : 'Obchodník'}</span></td>
                <td>{u.shop !== '-' ? <div className="flex items-center gap-2"><Store className="w-4 h-4 text-gray-400" />{u.shop}</div> : '-'}</td>
                <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-error'}`}>{u.status === 'active' ? 'Aktívny' : 'Suspendovaný'}</span></td>
                <td className="text-gray-400">{u.date}</td>
                <td><button className="p-2 hover:bg-slate-700 rounded-lg"><MoreVertical className="w-4 h-4 text-gray-400" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
