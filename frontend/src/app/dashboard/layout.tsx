'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings,
  Store, Palette, ChevronLeft, ChevronRight, Bell, Search, User,
  LogOut, Menu, X, Sun, Moon, CreditCard, Truck, FileText, HelpCircle,
  ChevronDown, ExternalLink, Plus, Sparkles, Globe, Zap
} from 'lucide-react';
import { TokenManager, Shop } from '@/lib/api';

// ═══════════════════════════════════════════════════════════════════════════════
// THEME CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION ITEMS
// ═══════════════════════════════════════════════════════════════════════════════

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Prehľad' },
  { href: '/dashboard/shop-builder', icon: Palette, label: 'Shop Builder', badge: 'NEW' },
  { href: '/dashboard/products', icon: Package, label: 'Produkty' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'Objednávky' },
  { href: '/dashboard/customers', icon: Users, label: 'Zákazníci' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytika' },
];

const settingsNavItems = [
  { href: '/dashboard/settings/general', icon: Store, label: 'Všeobecné' },
  { href: '/dashboard/settings/payments', icon: CreditCard, label: 'Platby' },
  { href: '/dashboard/settings/shipping', icon: Truck, label: 'Doprava' },
  { href: '/dashboard/settings/legal', icon: FileText, label: 'Právne' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(pathname.includes('/settings'));
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [shopSelectorOpen, setShopSelectorOpen] = useState(false);
  
  const [user, setUser] = useState(TokenManager.getUser());
  const [currentShop, setCurrentShop] = useState<Shop | null>(TokenManager.getCurrentShop());

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard_theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Auth check
  useEffect(() => {
    if (!TokenManager.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('dashboard_theme', newTheme);
  };

  const handleLogout = () => {
    TokenManager.clear();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  // Theme classes
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-slate-900' : 'bg-gray-50';
  const bgSidebar = isDark ? 'bg-slate-950' : 'bg-white';
  const bgCard = isDark ? 'bg-slate-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-slate-500' : 'text-gray-400';
  const borderColor = isDark ? 'border-slate-800' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen ${bgMain} ${textPrimary} transition-colors duration-200`}>
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 bottom-0 z-50 ${bgSidebar} border-r ${borderColor} transition-all duration-300 flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        >
          {/* Logo */}
          <div className={`h-16 flex items-center ${sidebarOpen ? 'px-5' : 'px-4 justify-center'} border-b ${borderColor}`}>
            {sidebarOpen ? (
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg">E-Shop</span>
                  <span className={`text-xs block ${textMuted}`}>Builder</span>
                </div>
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Shop Selector */}
          {sidebarOpen && (
            <div className="p-3 border-b border-slate-800">
              <button
                onClick={() => setShopSelectorOpen(!shopSelectorOpen)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl ${hoverBg} transition-colors`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm truncate">{currentShop?.name || 'Vyberte obchod'}</p>
                  <p className={`text-xs ${textMuted} truncate`}>{currentShop?.slug || 'Žiadny obchod'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 ${textMuted} transition-transform ${shopSelectorOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className={`${sidebarOpen ? 'px-3' : 'px-2'} space-y-1`}>
              {mainNavItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 ${sidebarOpen ? 'px-4' : 'px-3 justify-center'} py-3 rounded-xl transition-all ${
                    isActive(item.href)
                      ? 'bg-blue-600 text-white'
                      : `${textSecondary} ${hoverBg} hover:text-white`
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              ))}

              {/* Settings Accordion */}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`w-full flex items-center gap-3 ${sidebarOpen ? 'px-4' : 'px-3 justify-center'} py-3 rounded-xl ${textSecondary} ${hoverBg} hover:text-white transition-all`}
                >
                  <Settings className="w-5 h-5" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">Nastavenia</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                
                {settingsOpen && sidebarOpen && (
                  <div className="mt-1 ml-4 space-y-1">
                    {settingsNavItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                          isActive(item.href)
                            ? 'bg-blue-600/20 text-blue-400'
                            : `${textMuted} ${hoverBg} hover:text-white`
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className={`p-3 border-t ${borderColor}`}>
            {sidebarOpen ? (
              <div className="space-y-2">
                <Link
                  href={`/store/${currentShop?.slug || 'demo'}`}
                  target="_blank"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${textSecondary} ${hoverBg} hover:text-white transition-all text-sm`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Zobraziť obchod</span>
                </Link>
                <Link
                  href="/help"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${textSecondary} ${hoverBg} hover:text-white transition-all text-sm`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Pomocník</span>
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`w-full flex justify-center py-3 ${textMuted} ${hoverBg} rounded-xl transition-colors`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Collapse Button (Desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden lg:flex absolute -right-3 top-20 w-6 h-6 ${bgCard} border ${borderColor} rounded-full items-center justify-center shadow-md hover:shadow-lg transition-shadow`}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </aside>

        {/* Main Content */}
        <div className={`${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
          {/* Top Header */}
          <header className={`sticky top-0 z-30 ${bgSidebar} border-b ${borderColor} h-16`}>
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 ${hoverBg} rounded-xl`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Search */}
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                  <input
                    type="text"
                    placeholder="Hľadať produkty, objednávky..."
                    className={`w-full pl-10 pr-4 py-2.5 ${isDark ? 'bg-slate-800' : 'bg-gray-100'} border ${borderColor} rounded-xl focus:outline-none focus:border-blue-500 ${textPrimary} placeholder:${textMuted}`}
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-2.5 ${hoverBg} rounded-xl transition-colors`}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`p-2.5 ${hoverBg} rounded-xl transition-colors relative`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  </button>

                  {notificationsOpen && (
                    <div className={`absolute right-0 mt-2 w-80 ${bgCard} border ${borderColor} rounded-xl shadow-xl py-2`}>
                      <div className="px-4 py-2 border-b border-slate-700">
                        <h3 className="font-semibold">Notifikácie</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className={`px-4 py-3 ${hoverBg} cursor-pointer`}>
                          <p className="text-sm">Nová objednávka #1234</p>
                          <p className={`text-xs ${textMuted}`}>Pred 5 minútami</p>
                        </div>
                        <div className={`px-4 py-3 ${hoverBg} cursor-pointer`}>
                          <p className="text-sm">Produkt je na sklade</p>
                          <p className={`text-xs ${textMuted}`}>Pred 1 hodinou</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-3 p-1.5 pr-3 ${hoverBg} rounded-xl transition-colors`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium">{user?.name || 'User'}</span>
                    <ChevronDown className={`w-4 h-4 ${textMuted}`} />
                  </button>

                  {userMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-56 ${bgCard} border ${borderColor} rounded-xl shadow-xl py-2`}>
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="font-medium">{user?.name}</p>
                        <p className={`text-sm ${textMuted}`}>{user?.email}</p>
                      </div>
                      <Link href="/dashboard/profile" className={`flex items-center gap-3 px-4 py-2.5 ${hoverBg}`}>
                        <User className="w-4 h-4" />
                        <span>Môj profil</span>
                      </Link>
                      <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-2.5 ${hoverBg}`}>
                        <Settings className="w-4 h-4" />
                        <span>Nastavenia</span>
                      </Link>
                      <div className="border-t border-slate-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className={`flex items-center gap-3 px-4 py-2.5 ${hoverBg} w-full text-red-400`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Odhlásiť sa</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
