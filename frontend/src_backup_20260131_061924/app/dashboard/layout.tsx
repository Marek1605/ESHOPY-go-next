'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Settings, Layers, LogOut, Menu, X, Bell, Search, Store, ExternalLink,
  ChevronDown, Truck, CreditCard, FileText, HelpCircle, Moon, Sun,
  ChevronRight, Home, Palette
} from 'lucide-react';

// Navigation items
const mainNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Prehľad' },
  { href: '/dashboard/shop-builder', icon: Layers, label: 'Shop Builder', badge: 'PRO' },
  { href: '/dashboard/products', icon: Package, label: 'Produkty' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'Objednávky', badgeCount: 3 },
  { href: '/dashboard/customers', icon: Users, label: 'Zákazníci' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytika' },
];

const settingsNav = [
  { href: '/dashboard/settings', icon: Settings, label: 'Všeobecné' },
  { href: '/dashboard/settings/shipping', icon: Truck, label: 'Doprava' },
  { href: '/dashboard/settings/payments', icon: CreditCard, label: 'Platby' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const parsed = JSON.parse(u);
      if (parsed.role === 'admin' || parsed.role === 'superadmin') {
        router.push('/admin');
        return;
      }
      setUser(parsed);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Auto-expand settings if on settings page
    if (pathname.startsWith('/dashboard/settings')) {
      setSettingsExpanded(true);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const shopSlug = user?.shopSlug || 'demo';

  const NavItem = ({ item, collapsed = false }: { item: typeof mainNav[0]; collapsed?: boolean }) => {
    const isActive = pathname === item.href || 
      (item.href !== '/dashboard' && pathname.startsWith(item.href));
    
    return (
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
            : 'text-gray-400 hover:bg-slate-800 hover:text-white'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-lg">
                {item.badge}
              </span>
            )}
            {item.badgeCount && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                {item.badgeCount}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Desktop Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40 
          transition-all duration-300 hidden lg:flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-white block">EshopBuilder</span>
                <span className="text-xs text-gray-500">Pro verzia</span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Shop Selector */}
        {sidebarOpen && (
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Store className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Môj obchod</p>
                <p className="text-xs text-gray-500 truncate">{shopSlug}.eshopbuilder.sk</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNav.map((item) => (
            <NavItem key={item.href} item={item} collapsed={!sidebarOpen} />
          ))}

          {/* Settings Section */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            {sidebarOpen ? (
              <>
                <button
                  onClick={() => setSettingsExpanded(!settingsExpanded)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <span className="text-xs uppercase tracking-wider font-medium">Nastavenia</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${settingsExpanded ? 'rotate-90' : ''}`} />
                </button>
                {settingsExpanded && (
                  <div className="space-y-1 mt-1">
                    {settingsNav.map((item) => (
                      <NavItem key={item.href} item={item} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              settingsNav.map((item) => (
                <NavItem key={item.href} item={item} collapsed />
              ))
            )}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{user?.name || 'Používateľ'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                title="Odhlásiť sa"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors flex justify-center"
              title="Odhlásiť sa"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">EshopBuilder</span>
        </Link>
        <button className="p-2 hover:bg-slate-800 rounded-lg relative">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <aside className="absolute top-0 left-0 h-full w-72 bg-slate-900 shadow-2xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <span className="font-bold text-white">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${pathname === item.href 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badgeCount && (
                    <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <p className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Nastavenia</p>
                {settingsNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                      ${pathname === item.href 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`
        min-h-screen pt-16 lg:pt-0 transition-all duration-300
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        {/* Desktop Top Bar */}
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-30">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Hľadať produkty, objednávky..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-800 rounded-lg relative transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <a
              href={`/store/${shopSlug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium text-gray-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Zobraziť obchod
            </a>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
