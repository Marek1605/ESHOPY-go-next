'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles, LayoutDashboard, Users, Store, BarChart3, Settings,
  LogOut, Menu, X, Bell, Search, Shield, Database, FileText,
  Zap, Globe, CreditCard
} from 'lucide-react';

type MenuItem = {
  href?: string;
  icon?: any;
  label?: string;
  divider?: boolean;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'admin') {
        router.push('/dashboard');
      }
      setUser(parsed);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const menuItems: MenuItem[] = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Používatelia' },
    { href: '/admin/shops', icon: Store, label: 'Obchody' },
    { href: '/admin/feeds', icon: Database, label: 'Feed Import' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytika' },
    { divider: true },
    { href: '/admin/subscriptions', icon: CreditCard, label: 'Predplatné' },
    { href: '/admin/templates', icon: FileText, label: 'Šablóny' },
    { href: '/admin/integrations', icon: Zap, label: 'Integrácie' },
    { divider: true },
    { href: '/admin/settings', icon: Settings, label: 'Nastavenia' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar - Desktop */}
      <aside className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40 transition-all duration-300 hidden lg:block ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="font-bold text-lg">Admin</span>
                <p className="text-xs text-gray-400">EshopBuilder</p>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {menuItems.map((item, i) => (
            item.divider ? (
              <div key={i} className="h-px bg-slate-800 my-4" />
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
              >
                {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="flex-1">{item.label}</span>}
              </Link>
            )
          ))}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">Super Admin</p>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-lg transition" title="Odhlásiť">
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full p-2 hover:bg-slate-800 rounded-lg transition flex justify-center">
              <LogOut className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold">Admin Panel</span>
        </Link>
        <button className="p-2 hover:bg-slate-800 rounded-lg relative">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-72 bg-slate-900 animate-slideIn">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg">Admin</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item, i) => (
                item.divider ? (
                  <div key={i} className="h-px bg-slate-800 my-4" />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                )
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 pt-16 lg:pt-0 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Top Bar */}
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Hľadať používateľov, obchody..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Systém OK
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition text-sm">
              <Globe className="w-4 h-4" />
              Hlavná stránka
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
