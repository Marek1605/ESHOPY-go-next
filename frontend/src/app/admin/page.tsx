'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Store, Package, ShoppingCart, DollarSign, TrendingUp,
  Search, Filter, MoreVertical, Eye, Edit, Trash2, Key, 
  CheckCircle, XCircle, Globe, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface PlatformStats {
  total_users: number;
  total_shops: number;
  active_shops: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  monthly_revenue: number;
  new_users_this_month: number;
  new_shops_this_month: number;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  plan: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  shops_count: number;
  total_revenue: number;
}

interface Shop {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  custom_domain: string | null;
  domain_verified: boolean;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  user_email: string;
  user_name: string | null;
  products_count: number;
  orders_count: number;
  customers_count: number;
  revenue: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'shops' | 'templates'>('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (activeTab === 'overview' || !stats) {
        const statsRes = await fetch('/api/v1/admin/stats', { headers });
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activeTab === 'users') {
        const usersRes = await fetch(`/api/v1/admin/users?search=${searchTerm}`, { headers });
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
      }

      if (activeTab === 'shops') {
        const shopsRes = await fetch(`/api/v1/admin/shops?search=${searchTerm}`, { headers });
        const shopsData = await shopsRes.json();
        setShops(shopsData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    
    const token = localStorage.getItem('token');
    await fetch('/api/v1/admin/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: selectedUser.id, new_password: newPassword }),
    });
    
    setShowResetModal(false);
    setNewPassword('');
    setSelectedUser(null);
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/v1/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: !isActive }),
    });
    fetchData();
  };

  const handleToggleShopStatus = async (shopId: string, field: 'is_active' | 'is_published', value: boolean) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/v1/admin/shops/${shopId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [field]: !value }),
    });
    fetchData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sk-SK');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Super Admin Panel</h1>
            <p className="text-gray-400 text-sm">Správa platformy EshopBuilder</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-purple-600 rounded-full text-sm">Super Admin</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="flex gap-1">
          {[
            { id: 'overview', label: 'Prehľad', icon: TrendingUp },
            { id: 'users', label: 'Používatelia', icon: Users },
            { id: 'shops', label: 'E-shopy', icon: Store },
            { id: 'templates', label: 'Šablóny', icon: Package },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Celkové tržby"
                value={formatCurrency(stats.total_revenue)}
                icon={DollarSign}
                trend={12.5}
                color="green"
              />
              <StatCard
                title="Aktívne e-shopy"
                value={stats.active_shops.toString()}
                subtitle={`z ${stats.total_shops} celkom`}
                icon={Store}
                color="blue"
              />
              <StatCard
                title="Používatelia"
                value={stats.total_users.toString()}
                subtitle={`+${stats.new_users_this_month} tento mesiac`}
                icon={Users}
                color="purple"
              />
              <StatCard
                title="Objednávky"
                value={stats.total_orders.toString()}
                icon={ShoppingCart}
                color="orange"
              />
            </div>

            {/* Monthly Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Mesačné tržby</h3>
                <div className="text-3xl font-bold text-green-500">
                  {formatCurrency(stats.monthly_revenue)}
                </div>
                <p className="text-gray-400 text-sm mt-1">Tento mesiac</p>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Nové registrácie</h3>
                <div className="flex gap-8">
                  <div>
                    <div className="text-3xl font-bold text-blue-500">{stats.new_users_this_month}</div>
                    <p className="text-gray-400 text-sm">Používatelia</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-500">{stats.new_shops_this_month}</div>
                    <p className="text-gray-400 text-sm">E-shopy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Súhrn platformy</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">{stats.total_products}</div>
                  <div className="text-gray-400 text-sm">Produkty</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">{stats.total_shops}</div>
                  <div className="text-gray-400 text-sm">E-shopy</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">{stats.active_shops}</div>
                  <div className="text-gray-400 text-sm">Publikované</div>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold">{stats.total_orders}</div>
                  <div className="text-gray-400 text-sm">Objednávky</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Hľadať používateľov..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Hľadať
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Používateľ</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Plán</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">E-shopy</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Tržby</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Stav</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Registrácia</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Akcie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{user.name || 'Bez mena'}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.plan === 'enterprise' ? 'bg-purple-600' :
                          user.plan === 'business' ? 'bg-blue-600' :
                          'bg-gray-600'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3">{user.shops_count}</td>
                      <td className="px-4 py-3">{formatCurrency(user.total_revenue)}</td>
                      <td className="px-4 py-3">
                        {user.is_active ? (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="w-4 h-4" /> Aktívny
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="w-4 h-4" /> Neaktívny
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowResetModal(true);
                            }}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Reset hesla"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title={user.is_active ? 'Deaktivovať' : 'Aktivovať'}
                          >
                            {user.is_active ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                          </button>
                          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Detail">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shops Tab */}
        {activeTab === 'shops' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Hľadať e-shopy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Hľadať
              </button>
            </div>

            {/* Shops Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">E-shop</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Vlastník</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Doména</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Produkty</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Objednávky</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Tržby</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Stav</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Akcie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{shop.name}</div>
                          <div className="text-sm text-gray-400">{shop.slug}.eshopbuilder.sk</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{shop.user_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        {shop.custom_domain ? (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>{shop.custom_domain}</span>
                            {shop.domain_verified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{shop.products_count}</td>
                      <td className="px-4 py-3">{shop.orders_count}</td>
                      <td className="px-4 py-3">{formatCurrency(shop.revenue)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs ${shop.is_active ? 'text-green-500' : 'text-red-500'}`}>
                            {shop.is_active ? 'Aktívny' : 'Neaktívny'}
                          </span>
                          <span className={`text-xs ${shop.is_published ? 'text-blue-500' : 'text-gray-500'}`}>
                            {shop.is_published ? 'Publikovaný' : 'Skrytý'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleShopStatus(shop.id, 'is_published', shop.is_published)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title={shop.is_published ? 'Skryť' : 'Publikovať'}
                          >
                            {shop.is_published ? <XCircle className="w-4 h-4 text-yellow-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                          </button>
                          <a
                            href={`/s/${shop.slug}`}
                            target="_blank"
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Zobraziť"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="text-center py-12 text-gray-400">
            Správa šablón - Tu môžete pridávať a upravovať šablóny e-shopov
          </div>
        )}
      </main>

      {/* Reset Password Modal */}
      {showResetModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Reset hesla</h3>
            <p className="text-gray-400 mb-4">
              Resetovať heslo pre: <strong>{selectedUser.email}</strong>
            </p>
            <input
              type="password"
              placeholder="Nové heslo"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setNewPassword('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Zrušiť
              </button>
              <button
                onClick={handleResetPassword}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Resetovať
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color 
}: { 
  title: string; 
  value: string; 
  subtitle?: string;
  icon: any; 
  trend?: number;
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
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(trend)}% oproti minulému mesiacu
        </div>
      )}
    </div>
  );
}
