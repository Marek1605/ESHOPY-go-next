'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Store, BarChart3, Settings, LogOut, Menu, X, Bell, Search, Shield, Database, FileText, Zap, Globe, CreditCard } from 'lucide-react';

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
      if (parsed.role !== 'admin') router.push('/dashboard');
      setUser(parsed);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <aside className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40 transition-all hidden lg:block ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg">Admin</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/admin" className={`sidebar-item ${pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link href="/admin/users" className={`sidebar-item ${pathname === '/admin/users' ? 'active' : ''}`}>
            <Users className="w-5 h-5" />
            {sidebarOpen && <span>Používatelia</span>}
          </Link>
          <Link href="/admin/feeds" className={`sidebar-item ${pathname === '/admin/feeds' ? 'active' : ''}`}>
            <Database className="w-5 h-5" />
            {sidebarOpen && <span>Feed Import</span>}
          </Link>
          <Link href="/admin/analytics" className={`sidebar-item ${pathname === '/admin/analytics' ? 'active' : ''}`}>
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span>Analytika</span>}
          </Link>
          <div className="h-px bg-slate-800 my-4" />
          <Link href="/admin/settings" className={`sidebar-item ${pathname === '/admin/settings' ? 'active' : ''}`}>
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Nastavenia</span>}
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="sidebar-item w-full">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Odhlásiť</span>}
          </button>
        </div>
      </aside>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold">Admin Panel</span>
        <button className="p-2 hover:bg-slate-800 rounded-lg">
          <Bell className="w-6 h-6" />
        </button>
      </header>
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-72 bg-slate-900">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <span className="font-bold text-lg">Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <LayoutDashboard className="w-5 h-5" /><span>Dashboard</span>
              </Link>
              <Link href="/admin/users" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <Users className="w-5 h-5" /><span>Používatelia</span>
              </Link>
              <Link href="/admin/feeds" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
                <Database className="w-5 h-5" /><span>Feed Import</span>
              </Link>
              <Link href="/admin/settings" onClick={() => setMobileMenuOpen(false)} className="sidebar-item">
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
            <input type="text" placeholder="Hľadať..." className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
