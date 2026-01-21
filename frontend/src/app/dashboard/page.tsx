'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Store, Package, ShoppingCart, Users, Settings, 
  BarChart3, Globe, ExternalLink, MoreVertical, Trash2,
  Eye, Edit, Copy, CheckCircle, XCircle, AlertCircle,
  TrendingUp, DollarSign, Sparkles
} from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  is_active: boolean;
  is_published: boolean;
  custom_domain: string | null;
  domain_verified: boolean;
  created_at: string;
}

interface ShopStats {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  pending_orders: number;
  monthly_revenue: number;
  monthly_orders: number;
}

export default function CustomerDashboard() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [stats, setStats] = useState<ShopStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (selectedShop) {
      fetchStats(selectedShop.id);
    }
  }, [selectedShop]);

  const fetchShops = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/v1/shops', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setShops(data.shops || []);
      if (data.shops?.length > 0) {
        setSelectedShop(data.shops[0]);
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    }
    setLoading(false);
  };

  const fetchStats = async (shopId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/v1/shops/${shopId}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    if (!confirm('Naozaj chcete zmazať tento e-shop? Táto akcia je nevratná.')) return;
    
    const token = localStorage.getItem('token');
    await fetch(`/api/v1/shops/${shopId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    fetchShops();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // No shops - show create prompt
  if (shops.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Vitajte v EshopBuilder!</h1>
          <p className="text-gray-400 mb-8">
            Vytvorte si svoj prvý e-shop za pár minút s pomocou AI
          </p>
          <Link
            href="/dashboard/shop-builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Vytvoriť e-shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">EshopBuilder</span>
          </div>
        </div>

        {/* Shop Selector */}
        <div className="p-4 border-b border-gray-800">
          <label className="text-xs text-gray-400 uppercase tracking-wider">Aktívny obchod</label>
          <select
            value={selectedShop?.id || ''}
            onChange={(e) => {
              const shop = shops.find(s => s.id === e.target.value);
              if (shop) setSelectedShop(shop);
            }}
            className="w-full mt-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>{shop.name}</option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem href="/dashboard" icon={BarChart3} label="Prehľad" active />
          <NavItem href={`/dashboard/orders?shop=${selectedShop?.id}`} icon={ShoppingCart} label="Objednávky" badge={stats?.pending_orders} />
          <NavItem href={`/dashboard/products?shop=${selectedShop?.id}`} icon={Package} label="Produkty" />
          <NavItem href={`/dashboard/customers?shop=${selectedShop?.id}`} icon={Users} label="Zákazníci" />
          <NavItem href={`/dashboard/settings?shop=${selectedShop?.id}`} icon={Settings} label="Nastavenia" />
          
          <div className="pt-4 mt-4 border-t border-gray-800">
            <NavItem href={`/dashboard/design?shop=${selectedShop?.id}`} icon={Sparkles} label="Dizajn & AI" />
            <NavItem href={`/dashboard/domain?shop=${selectedShop?.id}`} icon={Globe} label="Doména" />
          </div>
        </nav>

        {/* Create New Shop */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/dashboard/shop-builder"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nový e-shop
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{selectedShop?.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <a 
                href={`/s/${selectedShop?.slug}`} 
                target="_blank"
                className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
              >
                {selectedShop?.slug}.eshopbuilder.sk
                <ExternalLink className="w-3 h-3" />
              </a>
              {selectedShop?.is_published ? (
                <span className="flex items-center gap-1 text-green-500 text-sm">
                  <CheckCircle className="w-4 h-4" /> Publikovaný
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-500 text-sm">
                  <AlertCircle className="w-4 h-4" /> Koncept
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a
              href={`/s/${selectedShop?.slug}`}
              target="_blank"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Zobraziť obchod
            </a>
            <Link
              href={`/dashboard/settings?shop=${selectedShop?.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Nastavenia
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Tržby tento mesiac"
              value={formatCurrency(stats.monthly_revenue)}
              icon={DollarSign}
              color="green"
            />
            <StatCard
              title="Objednávky"
              value={stats.total_orders.toString()}
              subtitle={`${stats.pending_orders} čakajúcich`}
              icon={ShoppingCart}
              color="blue"
            />
            <StatCard
              title="Produkty"
              value={stats.total_products.toString()}
              icon={Package}
              color="purple"
            />
            <StatCard
              title="Zákazníci"
              value={stats.total_customers.toString()}
              icon={Users}
              color="orange"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="Pridať produkt"
            description="Vytvorte nový produkt pomocou AI"
            icon={Package}
            href={`/dashboard/products/new?shop=${selectedShop?.id}`}
            color="blue"
          />
          <QuickActionCard
            title="Upraviť dizajn"
            description="Prispôsobte farby a layout"
            icon={Sparkles}
            href={`/dashboard/design?shop=${selectedShop?.id}`}
            color="purple"
          />
          <QuickActionCard
            title="Nastaviť doménu"
            description="Pripojte vlastnú doménu"
            icon={Globe}
            href={`/dashboard/domain?shop=${selectedShop?.id}`}
            color="green"
          />
        </div>

        {/* All Shops */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold">Vaše e-shopy</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {shops.map((shop) => (
              <div 
                key={shop.id} 
                className={`p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors ${
                  selectedShop?.id === shop.id ? 'bg-blue-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    {shop.logo ? (
                      <img src={shop.logo} alt={shop.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Store className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{shop.name}</div>
                    <div className="text-sm text-gray-400">{shop.slug}.eshopbuilder.sk</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {shop.is_published ? (
                      <span className="text-green-500 text-sm">Publikovaný</span>
                    ) : (
                      <span className="text-yellow-500 text-sm">Koncept</span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === shop.id ? null : shop.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showMenu === shop.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setSelectedShop(shop);
                            setShowMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> Spravovať
                        </button>
                        <a
                          href={`/s/${shop.slug}`}
                          target="_blank"
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" /> Otvoriť
                        </a>
                        <Link
                          href={`/dashboard/settings?shop=${shop.id}`}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" /> Nastavenia
                        </Link>
                        <button
                          onClick={() => {
                            handleDeleteShop(shop.id);
                            setShowMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center gap-2 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" /> Zmazať
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ 
  href, 
  icon: Icon, 
  label, 
  active, 
  badge 
}: { 
  href: string; 
  icon: any; 
  label: string; 
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string; 
  subtitle?: string;
  icon: any; 
  color: string;
}) {
  const colorClasses = {
    green: 'bg-green-600/20 text-green-500',
    blue: 'bg-blue-600/20 text-blue-500',
    purple: 'bg-purple-600/20 text-purple-500',
    orange: 'bg-orange-600/20 text-orange-500',
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <div className="text-gray-400 text-sm mt-1">{subtitle}</div>}
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/30 hover:border-blue-500',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/30 hover:border-purple-500',
    green: 'from-green-600/20 to-green-600/5 border-green-500/30 hover:border-green-500',
  };

  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl bg-gradient-to-br border transition-all hover:scale-105 ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <Icon className="w-8 h-8 mb-3" />
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}
