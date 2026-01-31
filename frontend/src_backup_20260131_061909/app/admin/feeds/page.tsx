'use client';
import { Search, Filter, Play, RefreshCw, CheckCircle, XCircle, Clock, Database } from 'lucide-react';

export default function AdminFeedsPage() {
  const feeds = [
    { id: 1, name: 'Heureka XML', shop: 'TechShop.sk', type: 'XML', products: 456, lastImport: '24.01 08:00', status: 'success', schedule: 'Denne' },
    { id: 2, name: 'Google Shopping', shop: 'ModaDnes.sk', type: 'XML', products: 892, lastImport: '24.01 06:00', status: 'success', schedule: '4x denne' },
    { id: 3, name: 'Custom CSV', shop: 'BioFood.sk', type: 'CSV', products: 234, lastImport: '23.01 22:00', status: 'error', schedule: 'Týždenne' },
    { id: 4, name: 'Supplier Feed', shop: 'SportZone.sk', type: 'XML', products: 678, lastImport: '24.01 07:30', status: 'running', schedule: 'Denne' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Feed Import</h1>
        <p className="text-gray-400">Správa feed importov</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{ l: 'Aktívne', v: '342' }, { l: 'Úspešnosť', v: '98.5%' }, { l: 'Bežiace', v: '12' }, { l: 'Chybné', v: '5' }].map((s, i) => (
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
            <input type="text" placeholder="Hľadať feedy..." className="input-field pl-10" />
          </div>
          <button className="btn-secondary"><Filter className="w-5 h-5" />Filtre</button>
        </div>
      </div>

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Feed</th><th>Obchod</th><th>Typ</th><th>Produkty</th><th>Posledný import</th><th>Plán</th><th>Stav</th><th>Akcie</th></tr></thead>
          <tbody>
            {feeds.map(f => (
              <tr key={f.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Database className="w-5 h-5 text-blue-400" /></div>
                    <span className="font-medium">{f.name}</span>
                  </div>
                </td>
                <td className="text-gray-400">{f.shop}</td>
                <td><span className="badge badge-info">{f.type}</span></td>
                <td>{f.products.toLocaleString()}</td>
                <td className="text-gray-400">{f.lastImport}</td>
                <td className="text-gray-400">{f.schedule}</td>
                <td>
                  <span className={`badge flex items-center gap-1 ${f.status === 'success' ? 'badge-success' : f.status === 'error' ? 'badge-error' : 'badge-warning'}`}>
                    {f.status === 'success' ? <CheckCircle className="w-3 h-3" /> : f.status === 'error' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {f.status === 'success' ? 'OK' : f.status === 'error' ? 'Chyba' : 'Beží'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-slate-700 rounded-lg" title="Spustiť"><Play className="w-4 h-4 text-green-400" /></button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg" title="Refresh"><RefreshCw className="w-4 h-4 text-gray-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
