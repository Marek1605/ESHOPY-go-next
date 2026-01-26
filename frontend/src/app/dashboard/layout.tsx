'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, 
  Palette, Moon, Sun, Menu, X, Bell, Search, ChevronDown, LogOut,
  Store, ExternalLink, HelpCircle, Sparkles, CreditCard, Truck, Globe
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// THEME CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const mainNav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/shop-builder', icon: Palette, label: 'Shop Builder' },
  { href: '/dashboard/products', icon: Package, label: 'Produkty' },
  { href: '/dashboard/orders', icon: ShoppingCart, label: 'Objednávky', badge: 3 },
  { href: '/dashboard/customers', icon: Users, label: 'Zákazníci' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytika' },
];

const settingsNav = [
  { href: '/dashboard/settings/general', icon: Settings, label: 'Všeobecné' },
  { href: '/dashboard/settings/shipping', icon: Truck, label: 'Doprava' },
  { href: '/dashboard/settings/payments', icon: CreditCard, label: 'Platby' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const NavLink = ({ href, icon: Icon, label, badge }: { href: string; icon: any; label: string; badge?: number }) => {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
          ${isActive 
            ? theme === 'dark' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 z-50 
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
        border-r
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`h-16 flex items-center justify-between px-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  EshopBuilder
                </span>
                <span className={`block text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Pro verzia
                </span>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Main Nav */}
            <div className="space-y-1">
              {mainNav.map(item => (
                <NavLink key={item.href} {...item} />
              ))}
            </div>

            {/* Settings Section */}
            <div>
              <h3 className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Nastavenia
              </h3>
              <div className="space-y-1">
                {settingsNav.map(item => (
                  <NavLink key={item.href} {...item} />
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-3
                ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              <span className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {theme === 'dark' ? 'Tmavý režim' : 'Svetlý režim'}
              </span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </button>

            {/* User Info */}
            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                M
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Marek</p>
                <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>admin@shop.sk</p>
              </div>
              <button className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className={`
      h-16 border-b flex items-center justify-between px-4 lg:px-6
      ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
    `}>
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className={`
          hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl w-64
          ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}
        `}>
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Hľadať..."
            className={`bg-transparent outline-none text-sm w-full ${theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* View Store */}
        <Link
          href="/store/demo"
          target="_blank"
          className={`
            hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
        >
          <ExternalLink className="w-4 h-4" />
          Zobraziť obchod
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              relative p-2 rounded-xl transition-colors
              ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}
            `}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className={`
              absolute right-0 top-12 w-80 rounded-xl shadow-xl border z-50
              ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            `}>
              <div className={`p-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifikácie</h3>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {[
                  { title: 'Nová objednávka #1234', time: 'pred 5 min', type: 'order' },
                  { title: 'Produkt "iPhone 15" je vypredaný', time: 'pred 1 hod', type: 'stock' },
                  { title: 'Nový zákazník sa registroval', time: 'pred 2 hod', type: 'user' },
                ].map((notif, i) => (
                  <div key={i} className={`p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{notif.title}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="lg:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
