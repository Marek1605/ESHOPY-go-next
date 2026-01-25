'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, LayoutDashboard, Users, Store, Database, Settings, LogOut, Menu, X, Bell, Search, Globe } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const p = JSON.parse(u);
      if (p.role !== 'admin') router.push('/dashboard');
      setUser(p);
    } else router.push('/login');
  }, [router]);

  const logout = () => { localStorage.clear(); router.push('/login'); };

  const menu = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Používatelia' },
    { href: '/admin/shops', icon: Store, label: 'Obchody' },
    { href: '/admin/feeds', icon: Database, label: 'Feed Import' },
    { href: '/admin/settings', icon: Settings, label: 'Nastavenia' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <aside className={`fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 z-40 transition-all hidden lg:block ${open ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {open && <span className="font-bold text-lg">Admin</span>}
          </Link>
          <button onClick={() => setOpen(!open)} className="p-2 hover:bg-slate-800 rounded-lg"><Menu className="w-5 h-5 text-gray-400" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {menu.map(item => (
            <Link key={item.href} href={item.href} className={`sidebar-item ${pathname === item.href ? 'active' : ''}`}>
              <item.icon className="w-5 h-5" />{open && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          {open ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center"><Shield className="w-5 h-5" /></div>
              <div className="flex-1"><p className="font-medium">{user?.name || 'Admin'}</p><p className="text-xs text-gray-400">Super Admin</p></div>
              <button onClick={logout} className="p-2 hover:bg-slate-800 rounded-lg"><LogOut className="w-5 h-5 text-gray-400" /></button>
            </div>
          ) : (
            <button onClick={logout} className="w-full p-2 hover:bg-slate-800 rounded-lg flex justify-center"><LogOut className="w-5 h-5 text-gray-400" /></button>
          )}
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <button onClick={() => setMobile(true)} className="p-2"><Menu className="w-6 h-6" /></button>
        <span className="font-bold">Admin</span>
        <button className="p-2"><Bell className="w-6 h-6" /></button>
      </header>

      {mobile && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <aside className="absolute top-0 left-0 h-full w-72 bg-slate-900">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <span className="font-bold">Admin</span>
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
            <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Online
            </span>
            <Link href="/" className="btn-secondary text-sm py-2"><Globe className="w-4 h-4" />Web</Link>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
