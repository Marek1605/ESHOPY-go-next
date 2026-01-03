'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Package, Plus, Search, Filter, MoreHorizontal, Edit, Trash2,
  Eye, ChevronLeft, ChevronRight, Loader2
} from 'lucide-react'
import { useAuthStore, useShopStore } from '@/lib/store'
import { products as productsApi } from '@/lib/api'

export default function ProductsPage() {
  const { token } = useAuthStore()
  const { currentShop } = useShopStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (token && currentShop) {
      loadProducts()
    }
  }, [token, currentShop, page])

  const loadProducts = async () => {
    if (!token || !currentShop) return
    
    setLoading(true)
    try {
      const data = await productsApi.list(token, currentShop.id, { page, limit: 20 })
      setProducts(data.data || [])
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Naozaj chceš zmazať tento produkt?')) return
    if (!token || !currentShop) return
    
    try {
      await productsApi.delete(token, currentShop.id, id)
      loadProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Produkty
          </h1>
          <p className="text-midnight-400">
            Spravuj svoje produkty a zásoby
          </p>
        </div>
        <Link href="/dashboard/products/new" className="btn-primary">
          <Plus className="w-5 h-5" />
          Pridať produkt
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-500" />
            <input
              type="text"
              placeholder="Hľadať produkty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-12"
            />
          </div>
          <button className="btn-secondary">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-midnight-600 mb-4" />
            <h3 className="font-semibold text-white mb-2">Žiadne produkty</h3>
            <p className="text-midnight-400 mb-6">Pridaj svoj prvý produkt</p>
            <Link href="/dashboard/products/new" className="btn-primary">
              <Plus className="w-5 h-5" />
              Pridať produkt
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-midnight-800/50">
                  <tr>
                    <th className="table-header text-left p-4">Produkt</th>
                    <th className="table-header text-left p-4">SKU</th>
                    <th className="table-header text-left p-4">Cena</th>
                    <th className="table-header text-left p-4">Sklad</th>
                    <th className="table-header text-left p-4">Status</th>
                    <th className="table-header text-right p-4">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-midnight-800 flex items-center justify-center">
                            <Package className="w-6 h-6 text-midnight-500" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-sm text-midnight-500 truncate max-w-xs">
                              {product.short_description || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-midnight-400 font-mono text-sm">
                        {product.sku || '-'}
                      </td>
                      <td className="table-cell">
                        <div className="text-white font-medium">
                          €{product.price?.toFixed(2) || '0.00'}
                        </div>
                        {product.compare_price > product.price && (
                          <div className="text-sm text-midnight-500 line-through">
                            €{product.compare_price?.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={`font-medium ${
                          product.quantity > 10 ? 'text-success-400' :
                          product.quantity > 0 ? 'text-warning-400' :
                          'text-danger-400'
                        }`}>
                          {product.quantity} ks
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${
                          product.is_active ? 'badge-success' : 'badge-danger'
                        }`}>
                          {product.is_active ? 'Aktívny' : 'Neaktívny'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/products/${product.id}`}
                            className="p-2 text-midnight-400 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/products/${product.id}/edit`}
                            className="p-2 text-midnight-400 hover:text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-midnight-400 hover:text-danger-400 transition-colors"
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

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-midnight-800">
              <div className="text-sm text-midnight-400">
                Zobrazených {filteredProducts.length} produktov
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-midnight-400" />
                </button>
                <span className="text-midnight-400 text-sm px-4">
                  Strana {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={filteredProducts.length < 20}
                  className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-midnight-400" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
