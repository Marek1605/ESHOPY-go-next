'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Shield, LayoutDashboard, Users, Store, Database, Settings, 
  LogOut, Menu, X, Bell, Search, Globe, ChevronDown, Package,
  CreditCard, BarChart3, FileText, AlertTriangle
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const mainNav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/users', icon: Users, label: 'Používatelia' },
  { href: '/admin/shops', icon: Store, label: 'Obchody' },
  { href: '/admin/products', icon: Package, label: 'Produkty' },
  { href: '/admin/categories', icon: FileText, label: 'Kategórie' },
  { href: '/admin/feeds', icon: Database, label: 'Feed Import' },
];

const settingsNav = [
  { href: '/admin/settings', icon: Settings, label: 'Nastavenia' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN LAYOUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const parsed = JSON.parse(u);
      // Len admin a superadmin môžu pristúpiť
      if (parsed.role !== 'admin' && parsed.role !== 'superadmin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsed);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Check if nav item is active
  const isActive = (item: typeof mainNav[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
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
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-white block">Admin Panel</span>
                <span className="text-xs text-gray-500">EshopBuilder</span>
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                sidebar-item
                ${isActive(item) ? 'active' : ''}
                ${!sidebarOpen ? 'justify-center px-3' : ''}
              `}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}

          {/* Divider */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            {sidebarOpen && (
              <p className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">Systém</p>
            )}
            {settingsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  sidebar-item
                  ${pathname.startsWith(item.href) ? 'active' : ''}
                  ${!sidebarOpen ? 'justify-center px-3' : ''}
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-orange-400 truncate">Super Admin</p>
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">Admin</span>
        </div>
        <button className="p-2 hover:bg-slate-800 rounded-lg relative">
          <Bell className="w-6 h-6 text-white" />
          <span className="notification-dot" />
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
              <span className="font-bold text-white">Admin Menu</span>
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
                  className={`sidebar-item ${isActive(item) ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-800">
                {settingsNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`sidebar-item ${pathname.startsWith(item.href) ? 'active' : ''}`}
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
              placeholder="Hľadať používateľov, obchody..." 
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Systém OK
            </span>
            <button className="p-2 hover:bg-slate-800 rounded-lg relative transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="notification-dot" />
            </button>
            <Link 
              href="/" 
              target="_blank"
              className="btn-secondary text-sm py-2"
            >
              <Globe className="w-4 h-4" /> Web
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
