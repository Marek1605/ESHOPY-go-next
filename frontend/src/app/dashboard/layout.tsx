'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Palette, LogOut, Menu, X, Bell, Search, Store, ExternalLink } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const p = JSON.parse(u);
      if (p.role === 'admin') router.push('/admin');
      setUser(p);
    } else router.push('/login');
  }, [router]);

  const logout = () => { localStorage.clear(); router.push('/login'); };

  const menu = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Prehľad' },
    { href: '/dashboard/products', icon: Package, label: 'Produkty' },
    { href: '/dashboard/orders', icon: ShoppingCart, label: 'Objednávky', badge: 3 },
    { href: '/dashboard/customers', icon: Users, label: 'Zákazníci' },
    { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytika' },
    { href: '/dashboard/templates', icon: Palette, label: 'Šablóny' },
    { href: '/dashboard/settings', icon: Settings, label: 'Nastavenia' },
  ];

  const shopSlug = user?.shopSlug || 'demo';

  return (
    <div className="min-h-screen bg-slate-950">
      <aside className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40 transition-all hidden lg:block ${open ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {open && <span className="font-bold text-lg">EshopBuilder</span>}
          </Link>
          <button onClick={() => setOpen(!open)} className="p-2 hover:bg-slate-800 rounded-lg"><Menu className="w-5 h-5 text-gray-400" /></button>
        </div>
        {open && (
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Môj obchod</span>
              </div>
            </div>
          </div>
        )}
        <nav className="p-4 space-y-1">
          {menu.map(item => (
            <Link key={item.href} href={item.href} className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}>
              <item.icon className="w-5 h-5" />
              {open && <><span className="flex-1">{item.label}</span>{item.badge && <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{item.badge}</span>}</>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          {open ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">{user?.name?.charAt(0) || 'U'}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="p-2 hover:bg-slate-800 rounded-lg"><LogOut className="w-5 h-5 text-gray-400" /></button>
            </div>
          ) : (
            <button onClick={logout} className="w-full p-2 hover:bg-slate-800 rounded-lg flex justify-center"><LogOut className="w-5 h-5 text-gray-400" /></button>
          )}
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <button onClick={() => setMobile(true)} className="p-2"><Menu className="w-6 h-6" /></button>
        <span className="font-bold">EshopBuilder</span>
        <button className="p-2 relative"><Bell className="w-6 h-6" /></button>
      </header>

      {mobile && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <aside className="absolute top-0 left-0 h-full w-72 bg-slate-900">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <span className="font-bold">Menu</span>
              <button onClick={() => setMobile(false)} className="p-2"><X className="w-6 h-6" /></button>
            </div>
            <nav className="p-4 space-y-1">
              {menu.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobile(false)} className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}>
                  <item.icon className="w-5 h-5" /><span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className={`min-h-screen pt-16 lg:pt-0 ${open ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Hľadať..." className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg relative"><Bell className="w-5 h-5 text-gray-400" /></button>
            <Link href={`/store/${shopSlug}`} target="_blank" className="btn-secondary text-sm py-2">
              <ExternalLink className="w-4 h-4" />Zobraziť obchod
            </Link>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
