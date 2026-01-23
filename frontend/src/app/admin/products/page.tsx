'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  image_url: string | null;
  stock_status: string;
  is_active: boolean;
  created_at: string;
  feed_id: string | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const perPage = 20;

  useEffect(() => {
    loadProducts();
  }, [page, search, status]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        per_page: String(perPage),
      };
      if (search) params.search = search;
      if (status) params.status = status;

      const data = await api.adminGetProducts(params);
      setProducts(data.products || []);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) {
      toast.error('No products selected');
      return;
    }

    if (action === 'delete' && !confirm(`Delete ${selectedIds.length} products?`)) {
      return;
    }

    try {
      await api.bulkProductAction(selectedIds, action);
      toast.success(`${action} completed`);
      setSelectedIds([]);
      loadProducts();
    } catch (error) {
      toast.error('Bulk action failed');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">{total.toLocaleString()} products total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-12"
                placeholder="Search products..."
              />
            </div>
          </form>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="input w-full md:w-48"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">{selectedIds.length} selected</span>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-2 text-sm rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-2 text-sm rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-2 text-sm rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No products found</h2>
            <p className="text-gray-400 mb-6">
              {search ? 'Try different search terms' : 'Add your first product or import from a feed'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/admin/products/new" className="btn-primary">
                Add Product
              </Link>
              <Link href="/admin/feeds" className="btn-secondary">
                Import from Feed
              </Link>
            </div>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="w-12 py-4 px-4">
                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-white">
                      {selectedIds.length === products.length ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Product</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-medium">Price</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-center py-4 px-4 text-gray-400 font-medium">Source</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleSelect(product.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        {selectedIds.includes(product.id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{product.title}</p>
                          <p className="text-gray-400 text-sm truncate">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-white font-medium">
                        €{product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.feed_id
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {product.feed_id ? 'Feed' : 'Manual'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-white px-3">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
