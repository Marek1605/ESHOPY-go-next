'use client';

import { useState } from 'react';
import { 
  Plus, Search, Filter, Package, Edit, Trash2, Eye, X, Upload, 
  MoreVertical, Grid, List, ChevronDown, Image as ImageIcon,
  Tag, Box, AlertTriangle, CheckCircle, Clock, ArrowUpDown
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════════

const initialProducts: Product[] = [
  { id: 1, name: 'Bezdrôtové slúchadlá Pro', sku: 'WH-001', price: 89.99, comparePrice: 119.99, stock: 45, category: 'Audio', status: 'active', image: '/products/headphones.jpg' },
  { id: 2, name: 'Smart Watch Ultra', sku: 'SW-002', price: 199.99, stock: 12, category: 'Hodinky', status: 'active', image: '/products/watch.jpg' },
  { id: 3, name: 'Prémiový obal na telefón', sku: 'PC-003', price: 29.99, comparePrice: 39.99, stock: 156, category: 'Príslušenstvo', status: 'active' },
  { id: 4, name: 'USB-C kábel 2m', sku: 'UC-004', price: 14.99, stock: 0, category: 'Káble', status: 'out_of_stock' },
  { id: 5, name: 'Bluetooth reproduktor', sku: 'BS-005', price: 59.99, stock: 23, category: 'Audio', status: 'draft' },
  { id: 6, name: 'Powerbanka 20000mAh', sku: 'PB-006', price: 49.99, stock: 67, category: 'Nabíjanie', status: 'active' },
];

const categories = ['Všetky', 'Audio', 'Hodinky', 'Príslušenstvo', 'Káble', 'Nabíjanie'];

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: Product['status'] }) {
  const config = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle, label: 'Aktívny' },
    draft: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock, label: 'Koncept' },
    out_of_stock: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertTriangle, label: 'Vypredané' },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <config.icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function ProductModal({ 
  product, 
  onClose, 
  onSave 
}: { 
  product: Product | null; 
  onClose: () => void; 
  onSave: (data: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    stock: product?.stock || 0,
    category: product?.category || 'Audio',
    status: product?.status || 'draft' as Product['status'],
    description: product?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Upraviť produkt' : 'Nový produkt'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Obrázok produktu</label>
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors cursor-pointer">
                <ImageIcon className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Kliknite pre nahranie alebo pretiahnite súbor</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP do 5MB</p>
              </div>
            </div>

            {/* Name & SKU */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Názov produktu *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Zadajte názov produktu"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="napr. PROD-001"
                />
              </div>
            </div>

            {/* Prices */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cena (€) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Porovnávacia cena (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData({ ...formData, comparePrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skladom (ks)</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category & Status */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kategória</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {categories.filter(c => c !== 'Všetky').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stav</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Product['status'] })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="active">Aktívny</option>
                  <option value="draft">Koncept</option>
                  <option value="out_of_stock">Vypredané</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Popis produktu</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
                placeholder="Popíšte váš produkt..."
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Zrušiť
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            {product ? 'Uložiť zmeny' : 'Vytvoriť produkt'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Všetky');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const openAdd = () => { setEditProduct(null); setShowModal(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setShowModal(true); };

  const handleDelete = (id: number) => {
    if (confirm('Naozaj chcete zmazať tento produkt?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (data: Partial<Product>) => {
    if (editProduct) {
      setProducts(products.map(p => p.id === editProduct.id ? { ...p, ...data } : p));
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
    }
    setShowModal(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Všetky' || p.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 20).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Produkty</h1>
          <p className="text-gray-400 mt-1">Spravujte váš katalóg produktov</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Pridať produkt
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Celkom produktov', value: stats.total, icon: Package, color: 'blue' },
          { label: 'Aktívnych', value: stats.active, icon: CheckCircle, color: 'green' },
          { label: 'Nízky sklad', value: stats.lowStock, icon: AlertTriangle, color: 'yellow' },
          { label: 'Vypredané', value: stats.outOfStock, icon: Box, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Hľadať produkty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors min-w-[160px]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors min-w-[140px]"
          >
            <option value="all">Všetky stavy</option>
            <option value="active">Aktívne</option>
            <option value="draft">Koncepty</option>
            <option value="out_of_stock">Vypredané</option>
          </select>

          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all group"
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                    -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                  </span>
                )}
                <div className="absolute top-3 right-3">
                  <StatusBadge status={product.status} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-700" />
                </div>
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="p-3 bg-white rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-3 bg-red-500/20 rounded-xl text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-white line-clamp-2">{product.name}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-3">{product.sku}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">€{product.price.toFixed(2)}</span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">€{product.comparePrice.toFixed(2)}</span>
                    )}
                  </div>
                  <span className={`text-sm ${product.stock > 20 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {product.stock} ks
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-sm font-medium text-gray-400">Produkt</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">SKU</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Kategória</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Cena</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Sklad</th>
                <th className="text-center p-4 text-sm font-medium text-gray-400">Stav</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Akcie</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-600" />
                      </div>
                      <span className="font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{product.sku}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-gray-800 rounded-lg text-sm text-gray-300">{product.category}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-semibold text-white">€{product.price.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="block text-sm text-gray-500 line-through">€{product.comparePrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className={`p-4 text-right font-medium ${product.stock > 20 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {product.stock} ks
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Žiadne produkty</h3>
          <p className="text-gray-400 mb-6">Zatiaľ nemáte žiadne produkty. Začnite pridaním prvého.</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Pridať prvý produkt
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
