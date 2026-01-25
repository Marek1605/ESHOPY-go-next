'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Package, Edit, Trash2, Eye } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Wireless Headphones', sku: 'WH-001', price: 89.99, stock: 45, status: 'active', image: null },
    { id: 2, name: 'Smart Watch Pro', sku: 'SW-002', price: 199.99, stock: 12, status: 'active', image: null },
    { id: 3, name: 'Phone Case Premium', sku: 'PC-003', price: 29.99, stock: 156, status: 'active', image: null },
    { id: 4, name: 'USB-C Cable 2m', sku: 'UC-004', price: 14.99, stock: 0, status: 'out_of_stock', image: null },
    { id: 5, name: 'Bluetooth Speaker', sku: 'BS-005', price: 59.99, stock: 23, status: 'draft', image: null },
  ]);
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Produkty</h1>
          <p className="text-gray-400">Spravujte vaše produkty</p>
        </div>
        <button className="btn-primary"><Plus className="w-5 h-5" />Pridať produkt</button>
      </div>

      <div className="stat-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hľadať produkty..." className="input-field pl-10" />
          </div>
          <button className="btn-secondary"><Filter className="w-5 h-5" />Filtre</button>
        </div>
      </div>

      <div className="stat-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Produkt</th>
              <th>SKU</th>
              <th>Cena</th>
              <th>Sklad</th>
              <th>Stav</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="text-gray-400">{product.sku}</td>
                <td className="font-semibold">€{product.price}</td>
                <td>
                  <span className={product.stock === 0 ? 'text-red-400' : product.stock < 20 ? 'text-yellow-400' : 'text-green-400'}>
                    {product.stock} ks
                  </span>
                </td>
                <td>
                  <span className={`badge ${product.status === 'active' ? 'badge-success' : product.status === 'out_of_stock' ? 'badge-error' : 'badge-warning'}`}>
                    {product.status === 'active' ? 'Aktívny' : product.status === 'out_of_stock' ? 'Vypredané' : 'Koncept'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4 text-gray-400" /></button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg"><Edit className="w-4 h-4 text-gray-400" /></button>
                    <button className="p-2 hover:bg-slate-700 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
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
