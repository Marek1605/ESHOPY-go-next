'use client';

import { useState, useMemo } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'editor' | 'vendor' | 'customer';
  status: 'active' | 'inactive' | 'banned' | 'pending';
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  lastActivity?: string;
  ordersCount: number;
  totalSpent: number;
  addresses: Address[];
  notes?: string;
  vendorId?: string;
  permissions: string[];
}

interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

// ============================================================================
// ROLE & PERMISSION DEFINITIONS
// ============================================================================

const roleLabels: Record<string, { name: string; color: string; icon: string }> = {
  admin: { name: 'Administrátor', color: 'bg-red-100 text-red-700', icon: '👑' },
  manager: { name: 'Manažér', color: 'bg-purple-100 text-purple-700', icon: '👔' },
  editor: { name: 'Editor', color: 'bg-blue-100 text-blue-700', icon: '✏️' },
  vendor: { name: 'Predajca', color: 'bg-green-100 text-green-700', icon: '🏪' },
  customer: { name: 'Zákazník', color: 'bg-gray-100 text-gray-700', icon: '👤' }
};

const statusLabels: Record<string, { name: string; color: string }> = {
  active: { name: 'Aktívny', color: 'bg-green-100 text-green-700' },
  inactive: { name: 'Neaktívny', color: 'bg-gray-100 text-gray-700' },
  banned: { name: 'Zablokovaný', color: 'bg-red-100 text-red-700' },
  pending: { name: 'Čaká na overenie', color: 'bg-yellow-100 text-yellow-700' }
};

const allPermissions = [
  { id: 'products.view', name: 'Zobraziť produkty', group: 'Produkty' },
  { id: 'products.create', name: 'Vytvoriť produkty', group: 'Produkty' },
  { id: 'products.edit', name: 'Upraviť produkty', group: 'Produkty' },
  { id: 'products.delete', name: 'Zmazať produkty', group: 'Produkty' },
  { id: 'orders.view', name: 'Zobraziť objednávky', group: 'Objednávky' },
  { id: 'orders.edit', name: 'Upraviť objednávky', group: 'Objednávky' },
  { id: 'orders.cancel', name: 'Zrušiť objednávky', group: 'Objednávky' },
  { id: 'orders.refund', name: 'Vrátiť platby', group: 'Objednávky' },
  { id: 'users.view', name: 'Zobraziť používateľov', group: 'Používatelia' },
  { id: 'users.create', name: 'Vytvoriť používateľov', group: 'Používatelia' },
  { id: 'users.edit', name: 'Upraviť používateľov', group: 'Používatelia' },
  { id: 'users.delete', name: 'Zmazať používateľov', group: 'Používatelia' },
  { id: 'vendors.view', name: 'Zobraziť predajcov', group: 'Predajcovia' },
  { id: 'vendors.manage', name: 'Spravovať predajcov', group: 'Predajcovia' },
  { id: 'categories.manage', name: 'Spravovať kategórie', group: 'Katalóg' },
  { id: 'feeds.manage', name: 'Spravovať feedy', group: 'Katalóg' },
  { id: 'settings.view', name: 'Zobraziť nastavenia', group: 'Systém' },
  { id: 'settings.edit', name: 'Upraviť nastavenia', group: 'Systém' },
  { id: 'reports.view', name: 'Zobraziť reporty', group: 'Reporty' },
  { id: 'reports.export', name: 'Exportovať dáta', group: 'Reporty' }
];

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUsers: User[] = [
  {
    id: 'usr_001',
    email: 'admin@megaprice.sk',
    firstName: 'Marek',
    lastName: 'Novák',
    phone: '+421 900 111 222',
    avatar: undefined,
    role: 'admin',
    status: 'active',
    emailVerified: true,
    createdAt: '2023-01-15T10:00:00Z',
    lastLogin: '2026-01-30T08:30:00Z',
    lastActivity: '2026-01-30T09:45:00Z',
    ordersCount: 0,
    totalSpent: 0,
    addresses: [],
    permissions: allPermissions.map(p => p.id)
  },
  {
    id: 'usr_002',
    email: 'peter.kovac@megaprice.sk',
    firstName: 'Peter',
    lastName: 'Kováč',
    phone: '+421 900 222 333',
    role: 'manager',
    status: 'active',
    emailVerified: true,
    createdAt: '2023-03-20T14:00:00Z',
    lastLogin: '2026-01-29T16:20:00Z',
    lastActivity: '2026-01-29T17:00:00Z',
    ordersCount: 0,
    totalSpent: 0,
    addresses: [],
    permissions: ['products.view', 'products.create', 'products.edit', 'orders.view', 'orders.edit', 'users.view', 'vendors.view', 'reports.view']
  },
  {
    id: 'usr_003',
    email: 'anna.editor@megaprice.sk',
    firstName: 'Anna',
    lastName: 'Horváthová',
    phone: '+421 900 333 444',
    role: 'editor',
    status: 'active',
    emailVerified: true,
    createdAt: '2023-06-10T09:00:00Z',
    lastLogin: '2026-01-30T07:15:00Z',
    lastActivity: '2026-01-30T08:00:00Z',
    ordersCount: 0,
    totalSpent: 0,
    addresses: [],
    permissions: ['products.view', 'products.create', 'products.edit', 'categories.manage']
  },
  {
    id: 'usr_004',
    email: 'elektro-svet@gmail.com',
    firstName: 'Ján',
    lastName: 'Elektro',
    phone: '+421 900 444 555',
    role: 'vendor',
    status: 'active',
    emailVerified: true,
    createdAt: '2023-08-01T11:00:00Z',
    lastLogin: '2026-01-28T14:00:00Z',
    lastActivity: '2026-01-28T15:30:00Z',
    ordersCount: 156,
    totalSpent: 0,
    vendorId: 'vnd_001',
    addresses: [
      {
        id: 'addr_001',
        type: 'billing',
        firstName: 'Ján',
        lastName: 'Elektro',
        company: 'Elektro Svet s.r.o.',
        street: 'Priemyselná 123',
        city: 'Bratislava',
        zip: '821 09',
        country: 'SK',
        phone: '+421 900 444 555',
        isDefault: true
      }
    ],
    permissions: ['products.view', 'products.create', 'products.edit', 'orders.view']
  },
  {
    id: 'usr_005',
    email: 'maria.zakaznik@email.sk',
    firstName: 'Mária',
    lastName: 'Zákazníková',
    phone: '+421 900 555 666',
    role: 'customer',
    status: 'active',
    emailVerified: true,
    createdAt: '2024-02-14T18:00:00Z',
    lastLogin: '2026-01-25T10:00:00Z',
    lastActivity: '2026-01-25T10:30:00Z',
    ordersCount: 12,
    totalSpent: 3456.78,
    addresses: [
      {
        id: 'addr_002',
        type: 'shipping',
        firstName: 'Mária',
        lastName: 'Zákazníková',
        street: 'Hlavná 45',
        city: 'Košice',
        zip: '040 01',
        country: 'SK',
        isDefault: true
      }
    ],
    permissions: []
  },
  {
    id: 'usr_006',
    email: 'jozef.banned@email.sk',
    firstName: 'Jozef',
    lastName: 'Problémový',
    phone: '+421 900 666 777',
    role: 'customer',
    status: 'banned',
    emailVerified: true,
    createdAt: '2024-05-20T12:00:00Z',
    lastLogin: '2025-11-15T09:00:00Z',
    ordersCount: 3,
    totalSpent: 156.90,
    addresses: [],
    notes: 'Zablokovaný pre podvodné správanie - falošné reklamácie',
    permissions: []
  },
  {
    id: 'usr_007',
    email: 'novy.zakaznik@email.sk',
    firstName: 'Tomáš',
    lastName: 'Nový',
    phone: '+421 900 777 888',
    role: 'customer',
    status: 'pending',
    emailVerified: false,
    createdAt: '2026-01-29T22:00:00Z',
    ordersCount: 0,
    totalSpent: 0,
    addresses: [],
    permissions: []
  },
  {
    id: 'usr_008',
    email: 'tech-shop@gmail.com',
    firstName: 'Milan',
    lastName: 'Tech',
    phone: '+421 900 888 999',
    role: 'vendor',
    status: 'inactive',
    emailVerified: true,
    createdAt: '2023-12-01T10:00:00Z',
    lastLogin: '2025-06-01T12:00:00Z',
    ordersCount: 45,
    totalSpent: 0,
    vendorId: 'vnd_002',
    addresses: [],
    notes: 'Dočasne pozastavený - aktualizácia zmluvy',
    permissions: ['products.view', 'products.create', 'products.edit', 'orders.view']
  },
  {
    id: 'usr_009',
    email: 'lucia.nakupovac@email.sk',
    firstName: 'Lucia',
    lastName: 'Nakupovač',
    phone: '+421 900 999 000',
    role: 'customer',
    status: 'active',
    emailVerified: true,
    createdAt: '2024-08-10T15:00:00Z',
    lastLogin: '2026-01-30T06:00:00Z',
    lastActivity: '2026-01-30T06:45:00Z',
    ordersCount: 28,
    totalSpent: 8945.50,
    addresses: [
      {
        id: 'addr_003',
        type: 'shipping',
        firstName: 'Lucia',
        lastName: 'Nakupovač',
        street: 'Štúrova 78',
        city: 'Nitra',
        zip: '949 01',
        country: 'SK',
        isDefault: true
      },
      {
        id: 'addr_004',
        type: 'billing',
        firstName: 'Lucia',
        lastName: 'Nakupovač',
        company: 'Lucia s.r.o.',
        street: 'Obchodná 12',
        city: 'Nitra',
        zip: '949 01',
        country: 'SK',
        isDefault: true
      }
    ],
    permissions: []
  },
  {
    id: 'usr_010',
    email: 'support@megaprice.sk',
    firstName: 'Support',
    lastName: 'Team',
    phone: '+421 900 123 456',
    role: 'editor',
    status: 'active',
    emailVerified: true,
    createdAt: '2023-02-01T08:00:00Z',
    lastLogin: '2026-01-30T08:00:00Z',
    lastActivity: '2026-01-30T09:30:00Z',
    ordersCount: 0,
    totalSpent: 0,
    addresses: [],
    permissions: ['orders.view', 'orders.edit', 'users.view', 'products.view']
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log_001',
    userId: 'usr_001',
    action: 'login',
    details: 'Úspešné prihlásenie',
    ip: '89.173.45.123',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    createdAt: '2026-01-30T08:30:00Z'
  },
  {
    id: 'log_002',
    userId: 'usr_001',
    action: 'settings_update',
    details: 'Zmena nastavení obchodu',
    ip: '89.173.45.123',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    createdAt: '2026-01-30T09:00:00Z'
  },
  {
    id: 'log_003',
    userId: 'usr_005',
    action: 'order_placed',
    details: 'Vytvorená objednávka #ORD-2026-0158',
    ip: '193.87.12.45',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/605.1',
    createdAt: '2026-01-25T10:15:00Z'
  },
  {
    id: 'log_004',
    userId: 'usr_004',
    action: 'product_update',
    details: 'Aktualizovaných 25 produktov',
    ip: '147.232.78.90',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
    createdAt: '2026-01-28T15:00:00Z'
  },
  {
    id: 'log_005',
    userId: 'usr_006',
    action: 'account_banned',
    details: 'Účet zablokovaný administrátorom',
    ip: '0.0.0.0',
    userAgent: 'System',
    createdAt: '2025-11-15T10:00:00Z'
  }
];

// ============================================================================
// ADMIN USERS PAGE
// ============================================================================

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user =>
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'lastLogin':
          const aLogin = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          const bLogin = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          comparison = aLogin - bLogin;
          break;
        case 'orders':
          comparison = a.ordersCount - b.ordersCount;
          break;
        case 'spent':
          comparison = a.totalSpent - b.totalSpent;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [users, searchQuery, roleFilter, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      banned: users.filter(u => u.status === 'banned').length,
      admins: users.filter(u => u.role === 'admin').length,
      vendors: users.filter(u => u.role === 'vendor').length,
      customers: users.filter(u => u.role === 'customer').length,
      totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0)
    };
  }, [users]);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Nikdy';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Práve teraz';
    if (diffMins < 60) return `Pred ${diffMins} min`;
    if (diffHours < 24) return `Pred ${diffHours} hod`;
    if (diffDays < 7) return `Pred ${diffDays} dňami`;
    return formatDate(dateString);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  // Handle select user
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Bulk actions
  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case 'activate':
        setUsers(prev =>
          prev.map(u =>
            selectedUsers.includes(u.id) ? { ...u, status: 'active' as const } : u
          )
        );
        break;
      case 'deactivate':
        setUsers(prev =>
          prev.map(u =>
            selectedUsers.includes(u.id) ? { ...u, status: 'inactive' as const } : u
          )
        );
        break;
      case 'ban':
        if (confirm(`Naozaj chcete zablokovať ${selectedUsers.length} používateľov?`)) {
          setUsers(prev =>
            prev.map(u =>
              selectedUsers.includes(u.id) ? { ...u, status: 'banned' as const } : u
            )
          );
        }
        break;
      case 'delete':
        if (confirm(`Naozaj chcete zmazať ${selectedUsers.length} používateľov?`)) {
          setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        }
        break;
    }
    setSelectedUsers([]);
  };

  // Change user status
  const changeUserStatus = (userId: string, status: User['status']) => {
    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, status } : u)
    );
    if (viewingUser?.id === userId) {
      setViewingUser({ ...viewingUser, status });
    }
  };

  // Save user
  const saveUser = (user: User) => {
    if (users.some(u => u.id === user.id)) {
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    } else {
      setUsers(prev => [...prev, user]);
    }
    setEditingUser(null);
    setShowCreateModal(false);
  };

  // Export users
  const exportUsers = () => {
    const csv = [
      ['ID', 'Email', 'Meno', 'Priezvisko', 'Telefón', 'Rola', 'Stav', 'Registrácia', 'Posledné prihlásenie', 'Objednávky', 'Útraty'].join(';'),
      ...filteredUsers.map(u => [
        u.id,
        u.email,
        u.firstName,
        u.lastName,
        u.phone,
        roleLabels[u.role].name,
        statusLabels[u.status].name,
        formatDate(u.createdAt),
        formatDate(u.lastLogin),
        u.ordersCount,
        u.totalSpent.toFixed(2)
      ].join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pouzivatelia-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get user activity logs
  const getUserActivityLogs = (userId: string) => {
    return mockActivityLogs.filter(log => log.userId === userId);
  };

  // Get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-gray-500 hover:text-gray-700">
                ← Späť
              </a>
              <h1 className="text-xl font-bold text-gray-900">Používatelia</h1>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                {filteredUsers.length} z {users.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportUsers}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                📥 Export CSV
              </button>
              <button
                onClick={() => {
                  setEditingUser({
                    id: `usr_${Date.now()}`,
                    email: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    role: 'customer',
                    status: 'pending',
                    emailVerified: false,
                    createdAt: new Date().toISOString(),
                    ordersCount: 0,
                    totalSpent: 0,
                    addresses: [],
                    permissions: []
                  });
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                + Nový používateľ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                👥
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Celkom používateľov</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                ✓
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-500">Aktívnych</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                🏪
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.vendors}</p>
                <p className="text-sm text-gray-500">Predajcov</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                💰
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRevenue.toLocaleString('sk-SK', { minimumFractionDigits: 0 })} €
                </p>
                <p className="text-sm text-gray-500">Celkové útraty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Hľadať podľa mena, emailu alebo telefónu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Všetky role</option>
              <option value="admin">Administrátor</option>
              <option value="manager">Manažér</option>
              <option value="editor">Editor</option>
              <option value="vendor">Predajca</option>
              <option value="customer">Zákazník</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Všetky stavy</option>
              <option value="active">Aktívny</option>
              <option value="inactive">Neaktívny</option>
              <option value="pending">Čaká na overenie</option>
              <option value="banned">Zablokovaný</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Podľa registrácie</option>
              <option value="name">Podľa mena</option>
              <option value="email">Podľa emailu</option>
              <option value="lastLogin">Podľa prihlásenia</option>
              <option value="orders">Podľa objednávok</option>
              <option value="spent">Podľa útrat</option>
            </select>

            {/* Sort order */}
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑ Vzostupne' : '↓ Zostupne'}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              Vybraných: {selectedUsers.length} používateľov
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
              >
                ✓ Aktivovať
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                ⏸ Deaktivovať
              </button>
              <button
                onClick={() => handleBulkAction('ban')}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                🚫 Zablokovať
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                🗑 Zmazať
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕ Zrušiť výber
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Používateľ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rola</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stav</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Registrácia</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Posledné prihlásenie</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Objednávky</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Útraty</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.emailVerified && (
                              <span className="text-green-500 text-xs" title="Email overený">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${roleLabels[user.role].color}`}>
                        {roleLabels[user.role].icon} {roleLabels[user.role].name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[user.status].color}`}>
                        {statusLabels[user.status].name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatRelativeTime(user.lastLogin)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                      {user.ordersCount > 0 ? user.ordersCount : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      {user.totalSpent > 0 ? `${user.totalSpent.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingUser(user)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Zobraziť detail"
                        >
                          👁
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Upraviť"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setShowActivityLog(user.id)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Aktivita"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Zobrazených {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} z {filteredUsers.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Späť
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ďalej →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(viewingUser.firstName, viewingUser.lastName)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {viewingUser.firstName} {viewingUser.lastName}
                    </h2>
                    <p className="text-gray-500">{viewingUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${roleLabels[viewingUser.role].color}`}>
                        {roleLabels[viewingUser.role].icon} {roleLabels[viewingUser.role].name}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[viewingUser.status].color}`}>
                        {statusLabels[viewingUser.status].name}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Kontaktné údaje</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      {viewingUser.email}
                      {viewingUser.emailVerified && <span className="text-green-500">✓</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Telefón</p>
                    <p className="font-medium">{viewingUser.phone || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Activity Info */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Aktivita</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Registrácia</p>
                    <p className="font-medium">{formatDate(viewingUser.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Posledné prihlásenie</p>
                    <p className="font-medium">{formatRelativeTime(viewingUser.lastLogin)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Posledná aktivita</p>
                    <p className="font-medium">{formatRelativeTime(viewingUser.lastActivity)}</p>
                  </div>
                </div>
              </div>

              {/* Order Stats */}
              {viewingUser.role === 'customer' && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Štatistiky nákupov</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-gray-900">{viewingUser.ordersCount}</p>
                      <p className="text-sm text-gray-500">Objednávok</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {viewingUser.totalSpent.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €
                      </p>
                      <p className="text-sm text-gray-500">Celkové útraty</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses */}
              {viewingUser.addresses.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Adresy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {viewingUser.addresses.map(addr => (
                      <div key={addr.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            addr.type === 'billing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {addr.type === 'billing' ? 'Fakturačná' : 'Doručovacia'}
                          </span>
                          {addr.isDefault && (
                            <span className="text-xs text-gray-500">Predvolená</span>
                          )}
                        </div>
                        <p className="font-medium text-sm">{addr.firstName} {addr.lastName}</p>
                        {addr.company && <p className="text-sm text-gray-600">{addr.company}</p>}
                        <p className="text-sm text-gray-600">{addr.street}</p>
                        <p className="text-sm text-gray-600">{addr.zip} {addr.city}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {viewingUser.notes && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Poznámky</h3>
                  <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    {viewingUser.notes}
                  </p>
                </div>
              )}

              {/* Permissions */}
              {viewingUser.permissions.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Oprávnenia</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingUser.permissions.map(perm => (
                      <span key={perm} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {allPermissions.find(p => p.id === perm)?.name || perm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div className="flex gap-2">
                {viewingUser.status === 'active' && (
                  <button
                    onClick={() => changeUserStatus(viewingUser.id, 'inactive')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    ⏸ Deaktivovať
                  </button>
                )}
                {viewingUser.status === 'inactive' && (
                  <button
                    onClick={() => changeUserStatus(viewingUser.id, 'active')}
                    className="px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
                  >
                    ✓ Aktivovať
                  </button>
                )}
                {viewingUser.status !== 'banned' && (
                  <button
                    onClick={() => changeUserStatus(viewingUser.id, 'banned')}
                    className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200"
                  >
                    🚫 Zablokovať
                  </button>
                )}
                {viewingUser.status === 'banned' && (
                  <button
                    onClick={() => changeUserStatus(viewingUser.id, 'active')}
                    className="px-4 py-2 text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
                  >
                    ✓ Odblokovať
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingUser(viewingUser);
                    setViewingUser(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ✏️ Upraviť
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {showCreateModal ? 'Nový používateľ' : 'Upraviť používateľa'}
                </h2>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setShowCreateModal(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meno</label>
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priezvisko</label>
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefón</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rola</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="customer">Zákazník</option>
                    <option value="vendor">Predajca</option>
                    <option value="editor">Editor</option>
                    <option value="manager">Manažér</option>
                    <option value="admin">Administrátor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stav</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as User['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Aktívny</option>
                    <option value="inactive">Neaktívny</option>
                    <option value="pending">Čaká na overenie</option>
                    <option value="banned">Zablokovaný</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poznámky</label>
                <textarea
                  value={editingUser.notes || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Permissions */}
              {editingUser.role !== 'customer' && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Oprávnenia</h3>
                  <div className="space-y-4">
                    {['Produkty', 'Objednávky', 'Používatelia', 'Predajcovia', 'Katalóg', 'Systém', 'Reporty'].map(group => {
                      const groupPerms = allPermissions.filter(p => p.group === group);
                      return (
                        <div key={group}>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">{group}</h4>
                          <div className="flex flex-wrap gap-2">
                            {groupPerms.map(perm => (
                              <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingUser.permissions.includes(perm.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setEditingUser({
                                        ...editingUser,
                                        permissions: [...editingUser.permissions, perm.id]
                                      });
                                    } else {
                                      setEditingUser({
                                        ...editingUser,
                                        permissions: editingUser.permissions.filter(p => p !== perm.id)
                                      });
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">{perm.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingUser(null);
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Zrušiť
              </button>
              <button
                onClick={() => saveUser(editingUser)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showCreateModal ? 'Vytvoriť' : 'Uložiť'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  História aktivity
                </h2>
                <button
                  onClick={() => setShowActivityLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {getUserActivityLogs(showActivityLog).length > 0 ? (
                <div className="space-y-4">
                  {getUserActivityLogs(showActivityLog).map(log => (
                    <div key={log.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{log.action.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-gray-600">{log.details}</p>
                        </div>
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
                        <span>IP: {log.ip}</span>
                        <span className="truncate max-w-[200px]" title={log.userAgent}>
                          {log.userAgent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Žiadne záznamy aktivity
                </p>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowActivityLog(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Zavrieť
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
