'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Palette, LogOut, Menu, X, Bell, Search, ChevronDown, Store, CreditCard, Truck, HelpCircle } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [shopName] = useState('Môj obchod');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <aside className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40 transition-all hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg">EshopBuilder</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {sidebarOpen && (
          <div className="p-4 border-b border-slate-800">
            <button className="w-full flex items-center justify-between p-3 bg-slate-800 rounded-xl hover:bg-slate-700">
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium truncate">{shopName}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
        <nav className="p-4 space-y-1">
          <Link href="/dashboard" className={`sidebar-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span>Prehľad</span>}
          </Link>
          <Link href="/dashboard/products" className={`sidebar-item ${pathname === '/dashboard/products' ? 'active' : ''}`}>
            <Package className="w-5 h-5" />
            {sidebarOpen && <span>Produkty</span>}
          </Link>
          <Link href="/dashboard/orders" className={`sidebar-item ${pathname === '/dashboard/orders' ? 'active' : ''}`}>
            <ShoppingCart className="w-5 h-5" />
            {sidebarOpen && <><span className="flex-1">Objednávky</span><span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">3</span></>}
          </Link>
          <Link href="/dashboard/customers" className={`sidebar-item ${pathname === '/dashboard/customers' ? 'active' : ''}`}>
            <Users className="w-5 h-5" />
            {sidebarOpen && <span>Zákazníci</span>}
          </Link>
          <Link href="/dashboard/analytics" className={`sidebar-item ${pathname === '/dashboard/analytics' ? 'active' : ''}`}>
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span>Analytika</span>}
          </Link>
          <div className="h-px bg-slate-800 my-4" />
          <Link href="/dashboard/templates" className={`sidebar-item ${pathname === '/dashboard/templates' ? 'active' : ''}`}>
            <Palette className="w-5 h-5" />
            {sidebarOpen && <span>Šablóny</span>}
          </Link>
          <Link href="/dashboard/settings" className={`sidebar-item ${pathname === '/dashboard/settings' ? 'active' : ''}`}>
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Nastavenia</span>}
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="font-semibold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || 'Používateľ'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-lg">
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full p-2 hover:bg-slate-800 rounded-lg flex justify-center">
              <LogOut className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </aside>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold">EshopBuilder</span>
        </Link>
        <button className="p-2 hover:bg-slate-800 rounded-lg relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </header>
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-72 bg-slate-900">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <span className="font-bold text-lg">EshopBuilder</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <LayoutDashboard className="w-5 h-5" /><span>Prehľad</span>
              </Link>
              <Link href="/dashboard/products" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <Package className="w-5 h-5" /><span>Produkty</span>
              </Link>
              <Link href="/dashboard/orders" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <ShoppingCart className="w-5 h-5" /><span>Objednávky</span>
              </Link>
              <Link href="/dashboard/customers" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <Users className="w-5 h-5" /><span>Zákazníci</span>
              </Link>
              <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <Settings className="w-5 h-5" /><span>Nastavenia</span>
              </Link>
            </nav>
          </aside>
        </div>
      )}
      <main className={`min-h-screen pt-16 lg:pt-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Hľadať produkty, objednávky..." className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg">
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </button>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 text-sm">
              <Store className="w-4 h-4" />
              Zobraziť obchod
            </a>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
