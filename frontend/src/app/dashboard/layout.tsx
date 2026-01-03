'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  ShoppingBag, LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Settings, LogOut, Plus, ChevronDown, Store,
  CreditCard, Bell, Search, Menu, X, Sparkles
} from 'lucide-react'
import { useAuthStore, useShopStore } from '@/lib/store'
import { shops as shopsApi } from '@/lib/api'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { token, user, logout, isAuthenticated } = useAuthStore()
  const { currentShop, shops, setCurrentShop, setShops } = useShopStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Load shops
  useEffect(() => {
    if (token) {
      shopsApi.list(token).then((data) => {
        setShops(data.shops || [])
        if (data.shops?.length > 0 && !currentShop) {
          setCurrentShop(data.shops[0])
        }
      }).catch(console.error)
    }
  }, [token, setShops, setCurrentShop, currentShop])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Prehľad' },
    { href: '/dashboard/products', icon: Package, label: 'Produkty' },
    { href: '/dashboard/orders', icon: ShoppingCart, label: 'Objednávky' },
    { href: '/dashboard/customers', icon: Users, label: 'Zákazníci' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytika' },
    { href: '/dashboard/ai', icon: Sparkles, label: 'AI Asistent' },
    { href: '/dashboard/payments', icon: CreditCard, label: 'Platby' },
    { href: '/dashboard/settings', icon: Settings, label: 'Nastavenia' },
  ]

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 
        glass-dark border-r border-midnight-800
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-midnight-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Eshop<span className="text-brand-400">Builder</span>
              </span>
            </Link>
          </div>

          {/* Shop Selector */}
          <div className="p-4 border-b border-midnight-800">
            <div className="relative">
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-midnight-800/50 hover:bg-midnight-800 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                  <Store className="w-5 h-5 text-brand-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white text-sm truncate">
                    {currentShop?.name || 'Vyber e-shop'}
                  </div>
                  <div className="text-xs text-midnight-500">
                    {currentShop?.slug ? `/${currentShop.slug}` : 'Žiadny e-shop'}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-midnight-400 transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 py-2 glass rounded-xl z-50">
                  {shops.map((shop) => (
                    <button
                      key={shop.id}
                      onClick={() => {
                        setCurrentShop(shop)
                        setShopDropdownOpen(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                        currentShop?.id === shop.id ? 'text-brand-400' : 'text-midnight-300'
                      }`}
                    >
                      {shop.name}
                    </button>
                  ))}
                  <div className="border-t border-midnight-700 mt-2 pt-2">
                    <Link
                      href="/dashboard/new-shop"
                      onClick={() => setShopDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left text-sm text-brand-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Vytvoriť nový e-shop
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-midnight-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                <span className="text-brand-400 font-semibold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">
                  {user?.name || 'Používateľ'}
                </div>
                <div className="text-xs text-midnight-500 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-midnight-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Odhlásiť sa
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 glass-dark border-b border-midnight-800 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-midnight-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-midnight-800/50">
              <Search className="w-4 h-4 text-midnight-500" />
              <input
                type="text"
                placeholder="Hľadať..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-midnight-500 w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-midnight-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
