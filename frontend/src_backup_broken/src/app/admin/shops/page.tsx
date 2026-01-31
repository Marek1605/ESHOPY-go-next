'use client';
import { Search, Filter, ExternalLink, MoreVertical, Store, Package, ShoppingCart, Eye } from 'lucide-react';

export default function AdminShopsPage() {
  const shops = [
    { id: 1, name: 'TechShop.sk', slug: 'techshop', owner: 'Ján Novák', products: 456, orders: 1234, revenue: 45600, status: 'active', plan: 'Business', template: 'modern' },
    { id: 2, name: 'ModaDnes.sk', slug: 'modadnes', owner: 'Mária K.', products: 892, orders: 2341, revenue: 89200, status: 'active', plan: 'Enterprise', template: 'fashion' },
    { id: 3, name: 'BioFood.sk', slug: 'biofood', owner: 'Peter H.', products: 234, orders: 567, revenue: 23400, status: 'pending', plan: 'Starter', template: 'organic' },
    { id: 4, name: 'SportZone.sk', slug: 'sportzone', owner: 'Anna S.', products: 678, orders: 1890, revenue: 67800, status: 'active', plan: 'Business', template: 'tech' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Obchody</h1>
        <p className="text-gray-400">Spravujte všetky obchody na platforme</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { l: 'Obchodov', v: '856', icon: Store },
          { l: 'Produktov', v: '125K', icon: Package },
          { l: 'Objednávok', v: '45K', icon: ShoppingCart },
          { l: 'Aktívnych dnes', v: '234', icon: Eye },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><s.icon className="w-5 h-5 text-blue-400" /></div>
              <div><div className="text-xl font-bold">{s.v}</div><div className="text-gray-400 text-xs">{s.l}</div></div>
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

      <div className="stat-card overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Obchod</th><th>Majiteľ</th><th>Produkty</th><th>Tržby</th><th>Plán</th><th>Šablóna</th><th>Stav</th><th>Akcie</th></tr></thead>
          <tbody>
            {shops.map(shop => (
              <tr key={shop.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{shop.name}</div>
                      <div className="text-gray-500 text-xs">{shop.slug}.eshopbuilder.sk</div>
                    </div>
                  </div>
                </td>
                <td className="text-gray-400">{shop.owner}</td>
                <td>{shop.products.toLocaleString()}</td>
                <td className="font-semibold">€{shop.revenue.toLocaleString()}</td>
                <td><span className={`badge ${shop.plan === 'Enterprise' ? 'badge-warning' : shop.plan === 'Business' ? 'badge-info' : 'badge-success'}`}>{shop.plan}</span></td>
                <td><span className="text-gray-400 text-sm capitalize">{shop.template}</span></td>
                <td><span className={`badge ${shop.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{shop.status === 'active' ? 'Aktívny' : 'Čaká'}</span></td>
                <td>
                  <div className="flex items-center gap-1">
                    <a href={`/store/${shop.slug}`} target="_blank" className="p-2 hover:bg-slate-700 rounded-lg" title="Zobraziť e-shop">
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                    </a>
                    <button className="p-2 hover:bg-slate-700 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
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
