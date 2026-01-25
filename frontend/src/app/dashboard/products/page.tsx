'use client';
import { useState } from 'react';
import { Plus, Search, Filter, Package, Edit, Trash2, Eye, X, Upload, Image as ImageIcon, MoreVertical, Grid, List, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  category: string;
  status: 'active' | 'draft' | 'out_of_stock';
  image?: string;
  description?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Bezdrôtové slúchadlá Pro', sku: 'WH-001', price: 89.99, comparePrice: 119.99, stock: 45, category: 'Audio', status: 'active' },
    { id: 2, name: 'Smart Watch Ultra', sku: 'SW-002', price: 199.99, stock: 12, category: 'Hodinky', status: 'active' },
    { id: 3, name: 'Prémiový obal na telefón', sku: 'PC-003', price: 29.99, comparePrice: 39.99, stock: 156, category: 'Príslušenstvo', status: 'active' },
    { id: 4, name: 'USB-C kábel 2m', sku: 'UC-004', price: 14.99, stock: 0, category: 'Káble', status: 'out_of_stock' },
    { id: 5, name: 'Bluetooth reproduktor', sku: 'BS-005', price: 59.99, stock: 23, category: 'Audio', status: 'draft' },
    { id: 6, name: 'Powerbanka 20000mAh', sku: 'PB-006', price: 49.99, stock: 67, category: 'Nabíjanie', status: 'active' },
  ]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['Audio', 'Hodinky', 'Príslušenstvo', 'Káble', 'Nabíjanie'];

  const openAdd = () => { setEditProduct(null); setShowModal(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setShowModal(true); };
  
  const handleDelete = (id: number) => {
    if (confirm('Naozaj chcete zmazať tento produkt?')) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Produkt zmazaný');
    }
  };

  const handleSave = (data: Partial<Product>) => {
    if (editProduct) {
      setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...data } : p));
      toast.success('Produkt aktualizovaný');
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: data.name || '',
        sku: data.sku || `SKU-${Date.now()}`,
        price: data.price || 0,
        comparePrice: data.comparePrice,
        stock: data.stock || 0,
        category: data.category || 'Ostatné',
        status: data.status || 'draft',
        description: data.description,
      };
      setProducts([newProduct, ...products]);
      toast.success('Produkt vytvorený');
    }
    setShowModal(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter || p.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Produkty</h1>
          <p className="text-gray-400">Spravujte váš katalóg produktov</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-5 h-5" />Pridať produkt
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Celkom produktov', value: products.length },
          { label: 'Aktívnych', value: products.filter(p => p.status === 'active').length },
          { label: 'Nízky sklad', value: products.filter(p => p.stock > 0 && p.stock < 20).length },
          { label: 'Vypredané', value: products.filter(p => p.stock === 0).length },
        ].map((s, i) => (
          <div key={i} className="stat-card text-center py-4">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="stat-card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Hľadať produkty..." 
              className="input-field pl-10" 
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">Všetky stavy</option>
              <option value="active">Aktívne</option>
              <option value="draft">Koncepty</option>
              <option value="out_of_stock">Vypredané</option>
            </select>
            <select 
              onChange={e => setFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">Všetky kategórie</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex border border-slate-700 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid/List */}
      {viewMode === 'grid' ? (
        <div className="product-grid">
          {filtered.map(product => (
            <div key={product.id} className="product-card">
              <div className="aspect-square bg-slate-800 relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-16 h-16 text-slate-600" />
                </div>
                {product.comparePrice && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                    -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`badge ${product.status === 'active' ? 'badge-success' : product.status === 'out_of_stock' ? 'badge-error' : 'badge-warning'}`}>
                    {product.status === 'active' ? 'Aktívny' : product.status === 'out_of_stock' ? 'Vypredané' : 'Koncept'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(product)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">{product.category} • {product.sku}</div>
                <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-400">€{product.price}</span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">€{product.comparePrice}</span>
                    )}
                  </div>
                  <span className={`text-sm ${product.stock === 0 ? 'text-red-400' : product.stock < 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {product.stock} ks
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stat-card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produkt</th>
                <th>SKU</th>
                <th>Kategória</th>
                <th>Cena</th>
                <th>Sklad</th>
                <th>Stav</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="text-gray-400">{product.sku}</td>
                  <td><span className="badge badge-info">{product.category}</span></td>
                  <td>
                    <span className="font-semibold">€{product.price}</span>
                    {product.comparePrice && (
                      <span className="text-gray-500 text-sm line-through ml-2">€{product.comparePrice}</span>
                    )}
                  </td>
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
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(product)} className="p-2 hover:bg-slate-700 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-slate-700 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal 
          product={editProduct} 
          categories={categories}
          onClose={() => setShowModal(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}

function ProductModal({ product, categories, onClose, onSave }: { 
  product: Product | null; 
  categories: string[];
  onClose: () => void; 
  onSave: (data: Partial<Product>) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    stock: product?.stock || 0,
    category: product?.category || categories[0],
    status: product?.status || 'draft',
    description: product?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">{product ? 'Upraviť produkt' : 'Nový produkt'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Názov produktu *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">SKU</label>
              <input type="text" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="form-label">Kategória</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="form-label">Cena (€) *</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="input-field" required />
            </div>
            <div>
              <label className="form-label">Pôvodná cena</label>
              <input type="number" step="0.01" value={form.comparePrice || ''} onChange={e => setForm({ ...form, comparePrice: parseFloat(e.target.value) || 0 })} className="input-field" placeholder="Voliteľné" />
            </div>
            <div>
              <label className="form-label">Sklad</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} className="input-field" />
            </div>
          </div>

          <div>
            <label className="form-label">Stav</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })} className="input-field">
              <option value="draft">Koncept</option>
              <option value="active">Aktívny</option>
              <option value="out_of_stock">Vypredané</option>
            </select>
          </div>

          <div>
            <label className="form-label">Popis</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field min-h-[100px]" />
          </div>

          <div>
            <label className="form-label">Obrázok</label>
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Klikni alebo pretiahni obrázok</p>
              <p className="text-gray-500 text-sm mt-1">PNG, JPG do 5MB</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Zrušiť</button>
            <button type="submit" className="btn-primary flex-1">{product ? 'Uložiť' : 'Vytvoriť'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
