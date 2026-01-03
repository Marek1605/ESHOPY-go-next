'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, Package, Users, TrendingUp, ArrowUpRight, 
  ArrowDownRight, Plus, Eye, MoreHorizontal, Sparkles
} from 'lucide-react'
import { useAuthStore, useShopStore } from '@/lib/store'
import { shops as shopsApi, orders, products } from '@/lib/api'

export default function DashboardPage() {
  const { token } = useAuthStore()
  const { currentShop } = useShopStore()
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token && currentShop) {
      loadData()
    }
  }, [token, currentShop])

  const loadData = async () => {
    if (!token || !currentShop) return
    
    setLoading(true)
    try {
      const [statsData, ordersData, productsData] = await Promise.all([
        shopsApi.stats(token, currentShop.id),
        orders.list(token, currentShop.id),
        products.list(token, currentShop.id, { limit: 5 }),
      ])
      
      setStats(statsData)
      setRecentOrders(ordersData.orders?.slice(0, 5) || [])
      setTopProducts(productsData.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Tržby tento mesiac',
      value: `€${stats?.total_revenue?.toFixed(2) || '0.00'}`,
      change: '+12.5%',
      positive: true,
      icon: TrendingUp,
    },
    {
      label: 'Objednávky',
      value: stats?.total_orders || 0,
      change: '+8.2%',
      positive: true,
      icon: ShoppingCart,
    },
    {
      label: 'Produkty',
      value: stats?.total_products || 0,
      change: '0',
      positive: true,
      icon: Package,
    },
    {
      label: 'Zákazníci',
      value: stats?.total_customers || 0,
      change: '+3.1%',
      positive: true,
      icon: Users,
    },
  ]

  if (!currentShop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-brand-400" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-2">
          Žiadny e-shop
        </h2>
        <p className="text-midnight-400 mb-6 max-w-md">
          Vytvor si prvý e-shop a začni predávať online
        </p>
        <Link href="/dashboard/new-shop" className="btn-primary">
          <Plus className="w-5 h-5" />
          Vytvoriť e-shop
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Prehľad
          </h1>
          <p className="text-midnight-400">
            Vitaj späť! Tu je súhrn tvojho e-shopu.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/ai" className="btn-secondary">
            <Sparkles className="w-4 h-4" />
            AI Asistent
          </Link>
          <Link href="/dashboard/products/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Pridať produkt
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-brand-400" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.positive ? 'text-success-400' : 'text-danger-400'
              }`}>
                {stat.positive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="font-display font-bold text-3xl text-white mb-1">
              {loading ? '-' : stat.value}
            </div>
            <div className="text-sm text-midnight-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-white">
              Posledné objednávky
            </h2>
            <Link href="/dashboard/orders" className="text-sm text-brand-400 hover:text-brand-300">
              Zobraziť všetky
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-midnight-800/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 text-midnight-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Zatiaľ žiadne objednávky</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-midnight-800">
                    <th className="table-header text-left pb-4">Objednávka</th>
                    <th className="table-header text-left pb-4">Zákazník</th>
                    <th className="table-header text-left pb-4">Suma</th>
                    <th className="table-header text-left pb-4">Status</th>
                    <th className="table-header text-right pb-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="table-row">
                      <td className="table-cell font-medium text-white">
                        #{order.order_number}
                      </td>
                      <td className="table-cell text-midnight-300">
                        {order.billing_email || '-'}
                      </td>
                      <td className="table-cell text-white">
                        €{order.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${
                          order.status === 'delivered' ? 'badge-success' :
                          order.status === 'pending' ? 'badge-warning' :
                          order.status === 'cancelled' ? 'badge-danger' :
                          'badge-brand'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        <Link 
                          href={`/dashboard/orders/${order.id}`}
                          className="p-2 text-midnight-400 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-white">
              Top produkty
            </h2>
            <Link href="/dashboard/products" className="text-sm text-brand-400 hover:text-brand-300">
              Všetky
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-midnight-800/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-12 text-midnight-400">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Žiadne produkty</p>
              <Link href="/dashboard/products/new" className="text-brand-400 hover:text-brand-300 text-sm mt-2 block">
                Pridať prvý produkt
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-midnight-800 flex items-center justify-center text-midnight-400 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-sm text-midnight-400">
                      €{product.price?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className="text-sm text-midnight-400">
                    {product.quantity} ks
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-display font-bold text-xl text-white mb-6">
          Rýchle akcie
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: '/dashboard/products/new', icon: Package, label: 'Pridať produkt', color: 'brand' },
            { href: '/dashboard/ai', icon: Sparkles, label: 'AI generátor', color: 'success' },
            { href: '/dashboard/orders', icon: ShoppingCart, label: 'Objednávky', color: 'warning' },
            { href: '/dashboard/settings', icon: Plus, label: 'Nastavenia', color: 'brand' },
          ].map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex items-center gap-4 p-4 rounded-xl bg-midnight-800/50 hover:bg-midnight-800 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-lg bg-${action.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-5 h-5 text-${action.color}-400`} />
              </div>
              <span className="font-medium text-white">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
