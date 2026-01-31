'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Vendor, VendorStats, Feed } from '@/types';

// Mock vendor data
const mockVendors: (Vendor & { stats?: VendorStats })[] = [
  {
    id: '1',
    name: 'TechStore SK',
    slug: 'techstore-sk',
    email: 'info@techstore.sk',
    phone: '+421 900 123 456',
    logo: '/vendors/techstore.png',
    description: 'Najväčší e-shop s elektronikou na Slovensku. Ponúkame široký sortiment mobilov, notebookov, televízorov a príslušenstva.',
    website: 'https://techstore.sk',
    rating: 4.8,
    reviewCount: 1250,
    productCount: 5420,
    isActive: true,
    isVerified: true,
    address: {
      street: 'Hlavná 123',
      city: 'Bratislava',
      zip: '81101',
      country: 'SK',
    },
    settings: {
      cpcRate: 0.15,
      minCpc: 0.05,
      maxCpc: 0.50,
      commissionRate: 3.5,
      autoApprove: true,
      deliveryTime: '1-2 dni',
      freeDeliveryThreshold: 49,
      returnDays: 14,
    },
    stats: {
      totalClicks: 125000,
      totalOrders: 8500,
      totalRevenue: 1250000,
      conversionRate: 6.8,
      averageOrderValue: 147,
      period: 'all_time',
    },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'ElektroMax',
    slug: 'elektromax',
    email: 'kontakt@elektromax.sk',
    phone: '+421 900 654 321',
    logo: '/vendors/elektromax.png',
    description: 'Elektronika za najlepšie ceny. Rýchle dodanie a kvalitný servis.',
    website: 'https://elektromax.sk',
    rating: 4.5,
    reviewCount: 890,
    productCount: 3200,
    isActive: true,
    isVerified: true,
    address: {
      street: 'Priemyselná 45',
      city: 'Košice',
      zip: '04001',
      country: 'SK',
    },
    settings: {
      cpcRate: 0.12,
      minCpc: 0.04,
      maxCpc: 0.40,
      commissionRate: 4.0,
      autoApprove: true,
      deliveryTime: '2-3 dni',
      freeDeliveryThreshold: 59,
      returnDays: 14,
    },
    stats: {
      totalClicks: 85000,
      totalOrders: 5200,
      totalRevenue: 780000,
      conversionRate: 6.1,
      averageOrderValue: 150,
      period: 'all_time',
    },
    createdAt: '2023-03-20T08:00:00Z',
    updatedAt: '2024-01-19T12:00:00Z',
  },
  {
    id: '3',
    name: 'MobilWorld',
    slug: 'mobilworld',
    email: 'shop@mobilworld.sk',
    phone: '+421 900 111 222',
    logo: '/vendors/mobilworld.png',
    description: 'Špecializovaný e-shop na mobilné telefóny a príslušenstvo. Originálne produkty a záruky.',
    website: 'https://mobilworld.sk',
    rating: 4.2,
    reviewCount: 450,
    productCount: 1800,
    isActive: true,
    isVerified: false,
    address: {
      street: 'Obchodná 78',
      city: 'Žilina',
      zip: '01001',
      country: 'SK',
    },
    settings: {
      cpcRate: 0.10,
      minCpc: 0.03,
      maxCpc: 0.35,
      commissionRate: 5.0,
      autoApprove: false,
      deliveryTime: '2-4 dni',
      freeDeliveryThreshold: 69,
      returnDays: 30,
    },
    stats: {
      totalClicks: 42000,
      totalOrders: 2100,
      totalRevenue: 315000,
      conversionRate: 5.0,
      averageOrderValue: 150,
      period: 'all_time',
    },
    createdAt: '2023-06-10T14:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
  },
  {
    id: '4',
    name: 'GameZone',
    slug: 'gamezone',
    email: 'info@gamezone.sk',
    phone: '+421 900 333 444',
    logo: '/vendors/gamezone.png',
    description: 'Všetko pre hráčov - konzoly, hry, príslušenstvo a gaming hardware.',
    website: 'https://gamezone.sk',
    rating: 4.6,
    reviewCount: 620,
    productCount: 2400,
    isActive: true,
    isVerified: true,
    address: {
      street: 'Gamerská 12',
      city: 'Nitra',
      zip: '94901',
      country: 'SK',
    },
    settings: {
      cpcRate: 0.18,
      minCpc: 0.06,
      maxCpc: 0.55,
      commissionRate: 3.0,
      autoApprove: true,
      deliveryTime: '1-3 dni',
      freeDeliveryThreshold: 39,
      returnDays: 14,
    },
    stats: {
      totalClicks: 68000,
      totalOrders: 4800,
      totalRevenue: 520000,
      conversionRate: 7.1,
      averageOrderValue: 108,
      period: 'all_time',
    },
    createdAt: '2023-04-05T11:00:00Z',
    updatedAt: '2024-01-20T08:45:00Z',
  },
  {
    id: '5',
    name: 'ByteShop',
    slug: 'byteshop',
    email: 'obchod@byteshop.sk',
    phone: '+421 900 555 666',
    logo: '/vendors/byteshop.png',
    description: 'IT komponenty a zostavy na mieru. Pre nadšencov aj profesionálov.',
    website: 'https://byteshop.sk',
    rating: 4.4,
    reviewCount: 380,
    productCount: 4500,
    isActive: false,
    isVerified: true,
    address: {
      street: 'Digitálna 99',
      city: 'Trenčín',
      zip: '91101',
      country: 'SK',
    },
    settings: {
      cpcRate: 0.14,
      minCpc: 0.05,
      maxCpc: 0.45,
      commissionRate: 3.5,
      autoApprove: true,
      deliveryTime: '3-5 dní',
      freeDeliveryThreshold: 79,
      returnDays: 14,
    },
    stats: {
      totalClicks: 35000,
      totalOrders: 1800,
      totalRevenue: 420000,
      conversionRate: 5.1,
      averageOrderValue: 233,
      period: 'all_time',
    },
    createdAt: '2023-07-22T09:30:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
  },
];

// Mock feeds for vendor detail
const mockFeeds: Feed[] = [
  {
    id: '1',
    name: 'TechStore - Hlavný feed',
    vendorId: '1',
    type: 'xml',
    url: 'https://techstore.sk/feed/products.xml',
    status: 'active',
    lastRun: '2024-01-20T15:30:00Z',
    lastSuccess: '2024-01-20T15:30:00Z',
    nextRun: '2024-01-20T21:30:00Z',
    schedule: 'every_6_hours',
    productCount: 5420,
    errorCount: 0,
    settings: {},
    mapping: [],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '4',
    name: 'TechStore - Akciový feed',
    vendorId: '1',
    type: 'xml',
    url: 'https://techstore.sk/feed/sale.xml',
    status: 'paused',
    lastRun: '2024-01-15T10:00:00Z',
    lastSuccess: '2024-01-15T10:00:00Z',
    schedule: 'weekly',
    productCount: 320,
    errorCount: 0,
    settings: {},
    mapping: [],
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export default function AdminVendorsPage() {
  // State
  const [vendors, setVendors] = useState<(Vendor & { stats?: VendorStats })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<(Vendor & { stats?: VendorStats }) | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    slug: '',
    email: '',
    phone: '',
    description: '',
    website: '',
    address: {
      street: '',
      city: '',
      zip: '',
      country: 'SK',
    },
    settings: {
      cpcRate: 0.10,
      minCpc: 0.03,
      maxCpc: 0.30,
      commissionRate: 5.0,
      autoApprove: false,
      deliveryTime: '2-4 dni',
      freeDeliveryThreshold: 49,
      returnDays: 14,
    },
    isActive: true,
    isVerified: false,
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setVendors(mockVendors);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    let result = vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && vendor.isActive) ||
        (statusFilter === 'inactive' && !vendor.isActive);
      const matchesVerified = verifiedFilter === 'all' ||
        (verifiedFilter === 'verified' && vendor.isVerified) ||
        (verifiedFilter === 'unverified' && !vendor.isVerified);
      return matchesSearch && matchesStatus && matchesVerified;
    });
    
    // Sort
    result.sort((a, b) => {
      let compare = 0;
      switch (sortBy) {
        case 'name':
          compare = a.name.localeCompare(b.name);
          break;
        case 'products':
          compare = (a.productCount || 0) - (b.productCount || 0);
          break;
        case 'rating':
          compare = (a.rating || 0) - (b.rating || 0);
          break;
        case 'revenue':
          compare = (a.stats?.totalRevenue || 0) - (b.stats?.totalRevenue || 0);
          break;
        case 'created':
          compare = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? compare : -compare;
    });
    
    return result;
  }, [vendors, searchQuery, statusFilter, verifiedFilter, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const active = vendors.filter(v => v.isActive).length;
    const verified = vendors.filter(v => v.isVerified).length;
    const totalProducts = vendors.reduce((sum, v) => sum + (v.productCount || 0), 0);
    const totalRevenue = vendors.reduce((sum, v) => sum + (v.stats?.totalRevenue || 0), 0);
    return { total: vendors.length, active, verified, totalProducts, totalRevenue };
  }, [vendors]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate slug
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Open create modal
  const handleCreate = () => {
    setFormData({
      name: '',
      slug: '',
      email: '',
      phone: '',
      description: '',
      website: '',
      address: {
        street: '',
        city: '',
        zip: '',
        country: 'SK',
      },
      settings: {
        cpcRate: 0.10,
        minCpc: 0.03,
        maxCpc: 0.30,
        commissionRate: 5.0,
        autoApprove: false,
        deliveryTime: '2-4 dni',
        freeDeliveryThreshold: 49,
        returnDays: 14,
      },
      isActive: true,
      isVerified: false,
    });
    setShowCreateModal(true);
  };

  // Open edit modal
  const handleEdit = (vendor: Vendor & { stats?: VendorStats }) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      slug: vendor.slug,
      email: vendor.email,
      phone: vendor.phone,
      description: vendor.description,
      website: vendor.website,
      address: { ...vendor.address },
      settings: { ...vendor.settings },
      isActive: vendor.isActive,
      isVerified: vendor.isVerified,
    });
    setShowEditModal(true);
  };

  // Save vendor
  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (showCreateModal) {
      const newVendor: Vendor & { stats?: VendorStats } = {
        id: String(Date.now()),
        name: formData.name || '',
        slug: formData.slug || generateSlug(formData.name || ''),
        email: formData.email || '',
        phone: formData.phone,
        description: formData.description,
        website: formData.website,
        logo: undefined,
        rating: 0,
        reviewCount: 0,
        productCount: 0,
        isActive: formData.isActive ?? true,
        isVerified: formData.isVerified ?? false,
        address: formData.address,
        settings: formData.settings,
        stats: {
          totalClicks: 0,
          totalOrders: 0,
          totalRevenue: 0,
          conversionRate: 0,
          averageOrderValue: 0,
          period: 'all_time',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVendors([...vendors, newVendor]);
      setShowCreateModal(false);
    } else if (showEditModal && selectedVendor) {
      const updatedVendors = vendors.map(v => {
        if (v.id === selectedVendor.id) {
          return {
            ...v,
            name: formData.name || v.name,
            slug: formData.slug || v.slug,
            email: formData.email || v.email,
            phone: formData.phone,
            description: formData.description,
            website: formData.website,
            address: formData.address,
            settings: formData.settings,
            isActive: formData.isActive ?? v.isActive,
            isVerified: formData.isVerified ?? v.isVerified,
            updatedAt: new Date().toISOString(),
          };
        }
        return v;
      });
      setVendors(updatedVendors);
      setShowEditModal(false);
    }
  };

  // Delete vendor
  const handleDelete = async (vendor: Vendor) => {
    if (!confirm(`Naozaj chcete vymazať vendora "${vendor.name}"? Táto akcia vymaže aj všetky jeho produkty a feedy.`)) return;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setVendors(vendors.filter(v => v.id !== vendor.id));
  };

  // Toggle vendor status
  const handleToggleStatus = async (vendor: Vendor & { stats?: VendorStats }) => {
    const updatedVendors = vendors.map(v => {
      if (v.id === vendor.id) {
        return { ...v, isActive: !v.isActive, updatedAt: new Date().toISOString() };
      }
      return v;
    });
    setVendors(updatedVendors);
  };

  // Toggle verified status
  const handleToggleVerified = async (vendor: Vendor & { stats?: VendorStats }) => {
    const updatedVendors = vendors.map(v => {
      if (v.id === vendor.id) {
        return { ...v, isVerified: !v.isVerified, updatedAt: new Date().toISOString() };
      }
      return v;
    });
    setVendors(updatedVendors);
  };

  // View vendor detail
  const handleViewDetail = (vendor: Vendor & { stats?: VendorStats }) => {
    setSelectedVendor(vendor);
    setShowDetailModal(true);
  };

  // View vendor stats
  const handleViewStats = (vendor: Vendor & { stats?: VendorStats }) => {
    setSelectedVendor(vendor);
    setShowStatsModal(true);
  };

  // Get vendor feeds
  const getVendorFeeds = (vendorId: string) => {
    return mockFeeds.filter(f => f.vendorId === vendorId);
  };

  // Rating stars
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalf && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Načítavam vendorov...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">Správa vendorov</h1>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Pridať vendora
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Celkom vendorov</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Aktívni</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Overení</p>
            <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Produktov</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalProducts.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Celkový obrat</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Hľadať vendora..."
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
              <option value="active">Aktívni</option>
              <option value="inactive">Neaktívni</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Všetky overenia</option>
              <option value="verified">Overení</option>
              <option value="unverified">Neoverení</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Podľa názvu</option>
              <option value="products">Podľa produktov</option>
              <option value="rating">Podľa hodnotenia</option>
              <option value="revenue">Podľa obratu</option>
              <option value="created">Podľa dátumu</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={sortOrder === 'asc' ? 'Vzostupne' : 'Zostupne'}
            >
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map(vendor => (
            <div key={vendor.id} className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${!vendor.isActive ? 'opacity-60' : ''}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {vendor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                        {vendor.isVerified && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{vendor.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vendor.isActive ? 'Aktívny' : 'Neaktívny'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  {renderRatingStars(vendor.rating || 0)}
                  <span className="text-sm text-gray-600">{vendor.rating?.toFixed(1)} ({vendor.reviewCount} recenzií)</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Produkty</p>
                    <p className="text-lg font-semibold text-gray-900">{(vendor.productCount || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Obrat</p>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(vendor.stats?.totalRevenue || 0)}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>CPC: {vendor.settings?.cpcRate?.toFixed(2)}€</span>
                  <span>Provízia: {vendor.settings?.commissionRate}%</span>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetail(vendor)}
                    className="flex-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleViewStats(vendor)}
                    className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Štatistiky
                  </button>
                  <button
                    onClick={() => handleEdit(vendor)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Upraviť"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(vendor)}
                    className={`p-2 rounded-lg transition-colors ${
                      vendor.isActive ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={vendor.isActive ? 'Deaktivovať' : 'Aktivovať'}
                  >
                    {vendor.isActive ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(vendor)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Vymazať"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredVendors.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500">Žiadni vendori nenájdení</p>
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">
                  {showCreateModal ? 'Nový vendor' : 'Upraviť vendora'}
                </h2>
                <button
                  onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Základné informácie</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Názov *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: showCreateModal ? generateSlug(e.target.value) : formData.slug,
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Názov obchodu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="nazov-obchodu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@obchod.sk"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefón</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+421 900 123 456"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Webstránka</label>
                      <input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://obchod.sk"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Popis</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Krátky popis obchodu..."
                      />
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Adresa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ulica</label>
                      <input
                        type="text"
                        value={formData.address?.street || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Hlavná 123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mesto</label>
                      <input
                        type="text"
                        value={formData.address?.city || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Bratislava"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PSČ</label>
                      <input
                        type="text"
                        value={formData.address?.zip || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, zip: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="81101"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Business Settings */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Obchodné nastavenia</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CPC sadzba (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.settings?.cpcRate || 0.10}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, cpcRate: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min CPC (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.settings?.minCpc || 0.03}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, minCpc: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max CPC (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.settings?.maxCpc || 0.30}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, maxCpc: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Provízia (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.settings?.commissionRate || 5.0}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, commissionRate: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dodacia doba</label>
                      <input
                        type="text"
                        value={formData.settings?.deliveryTime || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, deliveryTime: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2-4 dni"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Free shipping od (€)</label>
                      <input
                        type="number"
                        value={formData.settings?.freeDeliveryThreshold || 49}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, freeDeliveryThreshold: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.autoApprove ?? false}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, autoApprove: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600">Automaticky schvaľovať produkty</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive ?? true}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600">Aktívny vendor</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isVerified ?? false}
                        onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600">Overený vendor</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showCreateModal ? 'Vytvoriť' : 'Uložiť'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                    {selectedVendor.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">{selectedVendor.name}</h2>
                      {selectedVendor.isVerified && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{selectedVendor.website}</p>
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
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600">Produkty</p>
                    <p className="text-2xl font-bold text-blue-700">{(selectedVendor.productCount || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-green-600">Objednávky</p>
                    <p className="text-2xl font-bold text-green-700">{(selectedVendor.stats?.totalOrders || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-purple-600">Konverzia</p>
                    <p className="text-2xl font-bold text-purple-700">{selectedVendor.stats?.conversionRate || 0}%</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-emerald-600">Obrat</p>
                    <p className="text-2xl font-bold text-emerald-700">{formatCurrency(selectedVendor.stats?.totalRevenue || 0)}</p>
                  </div>
                </div>
                
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Kontaktné údaje</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedVendor.email}
                      </p>
                      {selectedVendor.phone && (
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {selectedVendor.phone}
                        </p>
                      )}
                      {selectedVendor.address && (
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {selectedVendor.address.street}, {selectedVendor.address.zip} {selectedVendor.address.city}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Obchodné nastavenia</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">CPC sadzba:</span>
                        <span className="font-medium">{selectedVendor.settings?.cpcRate?.toFixed(2)}€</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Provízia:</span>
                        <span className="font-medium">{selectedVendor.settings?.commissionRate}%</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Dodacia doba:</span>
                        <span className="font-medium">{selectedVendor.settings?.deliveryTime}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Free shipping od:</span>
                        <span className="font-medium">{selectedVendor.settings?.freeDeliveryThreshold}€</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                {selectedVendor.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Popis</h3>
                    <p className="text-sm text-gray-600">{selectedVendor.description}</p>
                  </div>
                )}
                
                {/* Feeds */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Feedy ({getVendorFeeds(selectedVendor.id).length})</h3>
                  {getVendorFeeds(selectedVendor.id).length > 0 ? (
                    <div className="space-y-2">
                      {getVendorFeeds(selectedVendor.id).map(feed => (
                        <div key={feed.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{feed.name}</p>
                            <p className="text-sm text-gray-500">{feed.productCount?.toLocaleString()} produktov</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            feed.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {feed.status === 'active' ? 'Aktívny' : 'Pozastavený'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Žiadne feedy</p>
                  )}
                </div>
                
                {/* Dates */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <span>Vytvorené: {formatDate(selectedVendor.createdAt)}</span>
                  <span>Aktualizované: {formatDate(selectedVendor.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && selectedVendor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowStatsModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">Štatistiky: {selectedVendor.name}</h2>
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Main Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <p className="text-blue-100 text-sm">Celkové kliknutia</p>
                    <p className="text-3xl font-bold">{(selectedVendor.stats?.totalClicks || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <p className="text-green-100 text-sm">Celkové objednávky</p>
                    <p className="text-3xl font-bold">{(selectedVendor.stats?.totalOrders || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <p className="text-purple-100 text-sm">Celkový obrat</p>
                    <p className="text-3xl font-bold">{formatCurrency(selectedVendor.stats?.totalRevenue || 0)}</p>
                  </div>
                </div>
                
                {/* Secondary Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Konverzný pomer</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedVendor.stats?.conversionRate || 0}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Priemerná objednávka</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedVendor.stats?.averageOrderValue || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Hodnotenie</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">{selectedVendor.rating?.toFixed(1)}</p>
                      <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Počet recenzií</p>
                    <p className="text-2xl font-bold text-gray-900">{(selectedVendor.reviewCount || 0).toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Chart placeholder */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Vývoj obratu (posledných 12 mesiacov)</h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>Graf bude zobrazený po prepojení s API</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
