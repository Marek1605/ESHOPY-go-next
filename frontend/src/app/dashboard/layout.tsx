'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles, LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, Palette, LogOut, Menu, X, Bell, Search, ChevronDown,
  Store, CreditCard, Truck, HelpCircle
} from 'lucide-react';

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

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Prehľad' },
    { href: '/dashboard/products', icon: Package, label: 'Produkty' },
    { href: '/dashboard/orders', icon: ShoppingCart, label: 'Objednávky', badge: 3 },
    { href: '/dashboard/customers', icon: Users, label: 'Zákazníci' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytika' },
  ];

  const menuItems2 = [
    { href: '/dashboard/templates', icon: Palette, label: 'Šablóny' },
    { href: '/dashboard/payments', icon: CreditCard, label: 'Platby' },
    { href: '/dashboard/shipping', icon: Truck, label: 'Doprava' },
    { href: '/dashboard/settings', icon: Settings, label: 'Nastavenia' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const IconComponent = ({ icon: Icon, className }: { icon: any; className: string }) => (
    <Icon className={className} />
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <aside className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40 transition-all duration-300 hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg">EshopBuilder</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        {sidebarOpen && (
          <div className="p-4 border-b border-slate-800">
            <button className="w-full flex items-center justify-between p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium truncate">{shopName}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}>
              <IconComponent icon={item.icon} className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{item.badge}</span>}
                </>
              )}
            </Link>
          ))}
          <div className="h-px bg-slate-800 my-4" />
          {menuItems2.map((item) => (
            <Link key={item.href} href={item.href} className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}>
              <IconComponent icon={item.icon} className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="flex-1">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="font-semibold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || 'Používateľ'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
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
          <aside className="absolute top-0 left-0 h-full w-72 bg-slate-900 animate-slideIn">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <span className="font-bold text-lg">EshopBuilder</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {[...menuItems, ...menuItems2].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}>
                  <IconComponent icon={item.icon} className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
      <main className={`min-h-screen transition-all duration-300 pt-16 lg:pt-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Hľadať produkty, objednávky..." className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition">
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </button>
            <a href="#" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition text-sm">
              <Store className="w-4 h-4" />
              Zobraziť obchod
            </a>
          </div>
        </div>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
