'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// Types
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  vendorId: string;
  vendorName: string;
}

interface OrderCustomer {
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'transfer' | 'cod' | 'paypal';
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-0001',
    customer: {
      name: 'Ján Novák',
      email: 'jan.novak@email.sk',
      phone: '+421 900 111 222',
      address: {
        street: 'Hlavná 123',
        city: 'Bratislava',
        zip: '81101',
        country: 'SK',
      },
    },
    items: [
      {
        id: '1',
        productId: 'p1',
        productName: 'Samsung Galaxy S24 Ultra 256GB',
        productImage: '/products/s24.jpg',
        quantity: 1,
        price: 1299,
        vendorId: '1',
        vendorName: 'TechStore SK',
      },
      {
        id: '2',
        productId: 'p2',
        productName: 'Samsung Galaxy Buds3 Pro',
        productImage: '/products/buds.jpg',
        quantity: 1,
        price: 249,
        vendorId: '1',
        vendorName: 'TechStore SK',
      },
    ],
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 1548,
    shipping: 0,
    discount: 50,
    total: 1498,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-0002',
    customer: {
      name: 'Mária Kováčová',
      email: 'maria.kovacova@email.sk',
      phone: '+421 900 333 444',
      address: {
        street: 'Obchodná 45',
        city: 'Košice',
        zip: '04001',
        country: 'SK',
      },
    },
    items: [
      {
        id: '3',
        productId: 'p3',
        productName: 'MacBook Pro 14" M3 Pro 512GB',
        productImage: '/products/macbook.jpg',
        quantity: 1,
        price: 2199,
        vendorId: '2',
        vendorName: 'ElektroMax',
      },
    ],
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'transfer',
    subtotal: 2199,
    shipping: 0,
    discount: 0,
    total: 2199,
    trackingNumber: 'SK123456789',
    createdAt: '2024-01-19T15:45:00Z',
    updatedAt: '2024-01-20T09:00:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-0003',
    customer: {
      name: 'Peter Horváth',
      email: 'peter.horvath@email.sk',
      address: {
        street: 'Stromová 8',
        city: 'Žilina',
        zip: '01001',
        country: 'SK',
      },
    },
    items: [
      {
        id: '4',
        productId: 'p4',
        productName: 'Sony PlayStation 5 Slim',
        productImage: '/products/ps5.jpg',
        quantity: 1,
        price: 549,
        vendorId: '4',
        vendorName: 'GameZone',
      },
      {
        id: '5',
        productId: 'p5',
        productName: 'DualSense Controller',
        productImage: '/products/dualsense.jpg',
        quantity: 2,
        price: 69,
        vendorId: '4',
        vendorName: 'GameZone',
      },
    ],
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    subtotal: 687,
    shipping: 4.99,
    discount: 0,
    total: 691.99,
    createdAt: '2024-01-20T16:20:00Z',
    updatedAt: '2024-01-20T16:20:00Z',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-0004',
    customer: {
      name: 'Anna Szabóová',
      email: 'anna.szaboova@email.sk',
      phone: '+421 900 555 666',
      address: {
        street: 'Kvetná 22',
        city: 'Nitra',
        zip: '94901',
        country: 'SK',
      },
    },
    items: [
      {
        id: '6',
        productId: 'p6',
        productName: 'Apple iPhone 15 Pro 256GB',
        productImage: '/products/iphone.jpg',
        quantity: 1,
        price: 1299,
        vendorId: '3',
        vendorName: 'MobilWorld',
      },
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    subtotal: 1299,
    shipping: 0,
    discount: 100,
    total: 1199,
    trackingNumber: 'SK987654321',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-0005',
    customer: {
      name: 'Martin Varga',
      email: 'martin.varga@email.sk',
      address: {
        street: 'Lesná 5',
        city: 'Trenčín',
        zip: '91101',
        country: 'SK',
      },
    },
    items: [
      {
        id: '7',
        productId: 'p7',
        productName: 'ASUS ROG Strix G16',
        productImage: '/products/rog.jpg',
        quantity: 1,
        price: 1899,
        vendorId: '5',
        vendorName: 'ByteShop',
      },
    ],
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'card',
    subtotal: 1899,
    shipping: 0,
    discount: 0,
    total: 1899,
    notes: 'Zákazník zrušil objednávku - našiel lacnejšie inde',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
  },
];

// Status config
const orderStatusConfig = {
  pending: { label: 'Čaká na potvrdenie', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Potvrdená', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  processing: { label: 'Spracováva sa', color: 'bg-indigo-100 text-indigo-800', icon: '⚙️' },
  shipped: { label: 'Odoslaná', color: 'bg-purple-100 text-purple-800', icon: '📦' },
  delivered: { label: 'Doručená', color: 'bg-green-100 text-green-800', icon: '✅' },
  cancelled: { label: 'Zrušená', color: 'bg-red-100 text-red-800', icon: '❌' },
  refunded: { label: 'Vrátená', color: 'bg-gray-100 text-gray-800', icon: '↩️' },
};

const paymentStatusConfig = {
  pending: { label: 'Čaká na platbu', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Zaplatené', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Zlyhalo', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Vrátené', color: 'bg-gray-100 text-gray-800' },
};

const paymentMethodLabels = {
  card: 'Karta',
  transfer: 'Bankový prevod',
  cod: 'Dobierka',
  paypal: 'PayPal',
};

export default function AdminOrdersPage() {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrders(mockOrders);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let result = orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      
      let matchesDate = true;
      if (dateRange.from) {
        matchesDate = matchesDate && new Date(order.createdAt) >= new Date(dateRange.from);
      }
      if (dateRange.to) {
        matchesDate = matchesDate && new Date(order.createdAt) <= new Date(dateRange.to + 'T23:59:59');
      }
      
      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });

    result.sort((a, b) => {
      let compare = 0;
      switch (sortBy) {
        case 'date':
          compare = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'total':
          compare = a.total - b.total;
          break;
        case 'customer':
          compare = a.customer.name.localeCompare(b.customer.name);
          break;
      }
      return sortOrder === 'asc' ? compare : -compare;
    });

    return result;
  }, [orders, searchQuery, statusFilter, paymentFilter, dateRange, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalRevenue / orders.filter(o => o.paymentStatus === 'paid').length || 0;
    
    return {
      total: orders.length,
      todayCount: todayOrders.length,
      pendingCount: pendingOrders.length,
      totalRevenue,
      avgOrderValue,
    };
  }, [orders]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // View order detail
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Change status
  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  // Save new status
  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedOrders = orders.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    setOrders(updatedOrders);
    setShowStatusModal(false);
  };

  // Export orders
  const handleExport = () => {
    const csv = [
      ['Číslo objednávky', 'Zákazník', 'Email', 'Celkom', 'Stav', 'Platba', 'Dátum'].join(';'),
      ...filteredOrders.map(o => [
        o.orderNumber,
        o.customer.name,
        o.customer.email,
        o.total,
        orderStatusConfig[o.status].label,
        paymentStatusConfig[o.paymentStatus].label,
        formatDate(o.createdAt),
      ].join(';'))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `objednavky-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Načítavam objednávky...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Objednávky</h1>
            </div>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Celkom objednávok</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Dnes</p>
            <p className="text-2xl font-bold text-blue-600">{stats.todayCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Čaká na spracovanie</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Celkový obrat</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Priemerná objednávka</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.avgOrderValue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Hľadať objednávku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Všetky stavy</option>
              {Object.entries(orderStatusConfig).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Všetky platby</option>
              {Object.entries(paymentStatusConfig).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Podľa dátumu</option>
              <option value="total">Podľa sumy</option>
              <option value="customer">Podľa zákazníka</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objednávka</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zákazník</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produkty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stav</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platba</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Celkom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dátum</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-blue-600">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{paymentMethodLabels[order.paymentMethod]}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{order.items.length} položiek</span>
                        <span className="text-xs text-gray-500">
                          ({order.items.reduce((sum, item) => sum + item.quantity, 0)} ks)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${orderStatusConfig[order.status].color}`}>
                        <span>{orderStatusConfig[order.status].icon}</span>
                        {orderStatusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusConfig[order.paymentStatus].color}`}>
                        {paymentStatusConfig[order.paymentStatus].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                      {order.discount > 0 && (
                        <p className="text-xs text-green-600">-{formatCurrency(order.discount)} zľava</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Detail"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleChangeStatus(order)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Zmeniť stav"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Tlačiť"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="text-gray-500">Žiadne objednávky nenájdené</p>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Objednávka {selectedOrder.orderNumber}</h2>
                    <p className="text-sm text-gray-500">Vytvorená {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${orderStatusConfig[selectedOrder.status].color}`}>
                      {orderStatusConfig[selectedOrder.status].icon}
                      {orderStatusConfig[selectedOrder.status].label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Zákazník</h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                      <p className="text-gray-600">{selectedOrder.customer.email}</p>
                      {selectedOrder.customer.phone && (
                        <p className="text-gray-600">{selectedOrder.customer.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Doručovacia adresa</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{selectedOrder.customer.address.street}</p>
                      <p>{selectedOrder.customer.address.zip} {selectedOrder.customer.address.city}</p>
                      <p>{selectedOrder.customer.address.country}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Položky objednávky</h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Produkt</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Predajca</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Množstvo</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Cena</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Celkom</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                <span className="text-sm font-medium text-gray-900">{item.productName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.vendorName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="flex justify-end">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Medzisúčet</span>
                      <span className="text-gray-900">{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Doprava</span>
                      <span className="text-gray-900">{selectedOrder.shipping === 0 ? 'Zadarmo' : formatCurrency(selectedOrder.shipping)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Zľava</span>
                        <span className="text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Celkom</span>
                      <span className="text-gray-900">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Platba</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Spôsob:</span>
                        <span className="font-medium">{paymentMethodLabels[selectedOrder.paymentMethod]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Stav:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusConfig[selectedOrder.paymentStatus].color}`}>
                          {paymentStatusConfig[selectedOrder.paymentStatus].label}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Sledovanie zásielky</h3>
                      <p className="text-sm font-mono text-blue-600">{selectedOrder.trackingNumber}</p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">Poznámky</h3>
                    <p className="text-sm text-yellow-800">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-between">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Zavrieť
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Tlačiť faktúru
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleChangeStatus(selectedOrder);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Zmeniť stav
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowStatusModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Zmeniť stav objednávky</h2>
                <p className="text-sm text-gray-500 mb-6">Objednávka: {selectedOrder.orderNumber}</p>

                <div className="space-y-2">
                  {Object.entries(orderStatusConfig).map(([value, { label, color, icon }]) => (
                    <label
                      key={value}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        newStatus === value ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={value}
                        checked={newStatus === value}
                        onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                        className="sr-only"
                      />
                      <span className="text-lg">{icon}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  onClick={handleSaveStatus}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Uložiť
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
