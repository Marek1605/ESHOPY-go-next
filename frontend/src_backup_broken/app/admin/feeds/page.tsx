'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Feed,
  FeedMapping,
  FeedPreview,
  FeedRunResult,
  FeedImportProgress,
  FeedType,
  FeedStatus,
  Vendor,
  Category,
} from '@/types';

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'TechStore SK',
    slug: 'techstore-sk',
    email: 'info@techstore.sk',
    phone: '+421 900 123 456',
    logo: '/vendors/techstore.png',
    rating: 4.8,
    reviewCount: 1250,
    productCount: 5420,
    isActive: true,
    isVerified: true,
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
    rating: 4.5,
    reviewCount: 890,
    productCount: 3200,
    isActive: true,
    isVerified: true,
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
    rating: 4.2,
    reviewCount: 450,
    productCount: 1800,
    isActive: true,
    isVerified: false,
    createdAt: '2023-06-10T14:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
  },
];

// Mock categories for mapping
const mockCategories: Category[] = [
  { id: '1', name: 'Elektronika', slug: 'elektronika', parentId: null, level: 0, productCount: 15000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '2', name: 'Mobilné telefóny', slug: 'mobilne-telefony', parentId: '1', level: 1, productCount: 5000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '3', name: 'Notebooky', slug: 'notebooky', parentId: '1', level: 1, productCount: 3000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '4', name: 'Televízory', slug: 'televizory', parentId: '1', level: 1, productCount: 2000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '5', name: 'Domácnosť', slug: 'domacnost', parentId: null, level: 0, productCount: 8000, isActive: true, createdAt: '', updatedAt: '' },
  { id: '6', name: 'Spotrebiče', slug: 'spotrebice', parentId: '5', level: 1, productCount: 4000, isActive: true, createdAt: '', updatedAt: '' },
];

// Mock feeds
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
    settings: {
      encoding: 'UTF-8',
      rootElement: 'products',
      itemElement: 'product',
      skipInvalid: true,
      updateExisting: true,
      deactivateMissing: true,
      priceMultiplier: 1,
      stockThreshold: 0,
    },
    mapping: [
      { sourceField: 'id', targetField: 'externalId', isRequired: true, transform: null },
      { sourceField: 'name', targetField: 'name', isRequired: true, transform: null },
      { sourceField: 'price', targetField: 'price', isRequired: true, transform: 'parseFloat' },
      { sourceField: 'ean', targetField: 'ean', isRequired: false, transform: null },
      { sourceField: 'stock', targetField: 'stock', isRequired: false, transform: 'parseInt' },
      { sourceField: 'category', targetField: 'categoryId', isRequired: false, transform: 'mapCategory' },
      { sourceField: 'image', targetField: 'imageUrl', isRequired: false, transform: null },
      { sourceField: 'url', targetField: 'url', isRequired: true, transform: null },
    ],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'ElektroMax - CSV Export',
    vendorId: '2',
    type: 'csv',
    url: 'https://elektromax.sk/export/produkty.csv',
    status: 'active',
    lastRun: '2024-01-20T12:00:00Z',
    lastSuccess: '2024-01-20T12:00:00Z',
    nextRun: '2024-01-21T00:00:00Z',
    schedule: 'daily',
    productCount: 3200,
    errorCount: 3,
    settings: {
      encoding: 'UTF-8',
      delimiter: ';',
      hasHeader: true,
      skipInvalid: true,
      updateExisting: true,
      deactivateMissing: false,
      priceMultiplier: 1,
      stockThreshold: 0,
    },
    mapping: [
      { sourceField: 'kod', targetField: 'externalId', isRequired: true, transform: null },
      { sourceField: 'nazov', targetField: 'name', isRequired: true, transform: null },
      { sourceField: 'cena', targetField: 'price', isRequired: true, transform: 'parseFloat' },
      { sourceField: 'ean_kod', targetField: 'ean', isRequired: false, transform: null },
      { sourceField: 'sklad', targetField: 'stock', isRequired: false, transform: 'parseInt' },
      { sourceField: 'kategoria', targetField: 'categoryId', isRequired: false, transform: 'mapCategory' },
      { sourceField: 'obrazok', targetField: 'imageUrl', isRequired: false, transform: null },
      { sourceField: 'link', targetField: 'url', isRequired: true, transform: null },
    ],
    createdAt: '2023-03-20T08:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
  },
  {
    id: '3',
    name: 'MobilWorld - JSON API',
    vendorId: '3',
    type: 'json',
    url: 'https://api.mobilworld.sk/v1/products',
    status: 'error',
    lastRun: '2024-01-19T18:00:00Z',
    lastSuccess: '2024-01-18T18:00:00Z',
    nextRun: '2024-01-20T18:00:00Z',
    schedule: 'daily',
    productCount: 1756,
    errorCount: 44,
    settings: {
      encoding: 'UTF-8',
      rootElement: 'data.products',
      skipInvalid: true,
      updateExisting: true,
      deactivateMissing: true,
      priceMultiplier: 1,
      stockThreshold: 0,
      authHeader: 'Bearer xxx',
    },
    mapping: [
      { sourceField: 'product_id', targetField: 'externalId', isRequired: true, transform: null },
      { sourceField: 'title', targetField: 'name', isRequired: true, transform: null },
      { sourceField: 'price_with_vat', targetField: 'price', isRequired: true, transform: 'parseFloat' },
      { sourceField: 'ean_code', targetField: 'ean', isRequired: false, transform: null },
      { sourceField: 'availability', targetField: 'stock', isRequired: false, transform: 'mapStock' },
      { sourceField: 'category_path', targetField: 'categoryId', isRequired: false, transform: 'mapCategory' },
      { sourceField: 'images[0]', targetField: 'imageUrl', isRequired: false, transform: null },
      { sourceField: 'detail_url', targetField: 'url', isRequired: true, transform: null },
    ],
    createdAt: '2023-06-10T14:00:00Z',
    updatedAt: '2024-01-19T18:00:00Z',
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
    settings: {
      encoding: 'UTF-8',
      rootElement: 'sale_products',
      itemElement: 'item',
      skipInvalid: true,
      updateExisting: true,
      deactivateMissing: false,
      priceMultiplier: 1,
      stockThreshold: 0,
    },
    mapping: [
      { sourceField: 'id', targetField: 'externalId', isRequired: true, transform: null },
      { sourceField: 'name', targetField: 'name', isRequired: true, transform: null },
      { sourceField: 'sale_price', targetField: 'price', isRequired: true, transform: 'parseFloat' },
      { sourceField: 'original_price', targetField: 'originalPrice', isRequired: false, transform: 'parseFloat' },
      { sourceField: 'ean', targetField: 'ean', isRequired: false, transform: null },
      { sourceField: 'url', targetField: 'url', isRequired: true, transform: null },
    ],
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// Feed type options
const feedTypes: { value: FeedType; label: string; icon: string }[] = [
  { value: 'xml', label: 'XML Feed', icon: '📄' },
  { value: 'csv', label: 'CSV Export', icon: '📊' },
  { value: 'json', label: 'JSON API', icon: '🔗' },
  { value: 'heureka', label: 'Heureka XML', icon: '🛒' },
  { value: 'google', label: 'Google Merchant', icon: '🔍' },
];

// Schedule options
const scheduleOptions = [
  { value: 'manual', label: 'Manuálne' },
  { value: 'hourly', label: 'Každú hodinu' },
  { value: 'every_6_hours', label: 'Každých 6 hodín' },
  { value: 'every_12_hours', label: 'Každých 12 hodín' },
  { value: 'daily', label: 'Denne' },
  { value: 'weekly', label: 'Týždenne' },
];

// Transform options
const transformOptions = [
  { value: '', label: 'Žiadna' },
  { value: 'parseFloat', label: 'Číslo (desatinné)' },
  { value: 'parseInt', label: 'Číslo (celé)' },
  { value: 'mapCategory', label: 'Mapovať kategóriu' },
  { value: 'mapStock', label: 'Mapovať dostupnosť' },
  { value: 'trim', label: 'Odstrániť medzery' },
  { value: 'lowercase', label: 'Malé písmená' },
  { value: 'uppercase', label: 'Veľké písmená' },
];

// Standard target fields
const targetFields = [
  { value: 'externalId', label: 'Externé ID', required: true },
  { value: 'name', label: 'Názov', required: true },
  { value: 'price', label: 'Cena', required: true },
  { value: 'url', label: 'URL', required: true },
  { value: 'ean', label: 'EAN', required: false },
  { value: 'sku', label: 'SKU', required: false },
  { value: 'stock', label: 'Skladom', required: false },
  { value: 'categoryId', label: 'Kategória', required: false },
  { value: 'imageUrl', label: 'Obrázok', required: false },
  { value: 'description', label: 'Popis', required: false },
  { value: 'brand', label: 'Značka', required: false },
  { value: 'originalPrice', label: 'Pôvodná cena', required: false },
  { value: 'deliveryTime', label: 'Dodacia doba', required: false },
  { value: 'deliveryPrice', label: 'Cena dopravy', required: false },
];

export default function AdminFeedsPage() {
  // State
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Feed>>({
    name: '',
    vendorId: '',
    type: 'xml',
    url: '',
    schedule: 'daily',
    settings: {
      encoding: 'UTF-8',
      skipInvalid: true,
      updateExisting: true,
      deactivateMissing: true,
      priceMultiplier: 1,
      stockThreshold: 0,
    },
    mapping: [],
  });
  
  // Preview state
  const [previewData, setPreviewData] = useState<FeedPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  // Import progress state
  const [importProgress, setImportProgress] = useState<FeedImportProgress | null>(null);
  
  // Run history
  const [runHistory, setRunHistory] = useState<FeedRunResult[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeeds(mockFeeds);
      setVendors(mockVendors);
      setCategories(mockCategories);
      setLoading(false);
    };
    loadData();
  }, []);

  // Filter feeds
  const filteredFeeds = useMemo(() => {
    return feeds.filter(feed => {
      const matchesSearch = feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || feed.status === statusFilter;
      const matchesVendor = vendorFilter === 'all' || feed.vendorId === vendorFilter;
      const matchesType = typeFilter === 'all' || feed.type === typeFilter;
      return matchesSearch && matchesStatus && matchesVendor && matchesType;
    });
  }, [feeds, searchQuery, statusFilter, vendorFilter, typeFilter]);

  // Get vendor by ID
  const getVendor = useCallback((vendorId: string) => {
    return vendors.find(v => v.id === vendorId);
  }, [vendors]);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status: FeedStatus) => {
    const styles: Record<FeedStatus, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aktívny' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pozastavený' },
      error: { bg: 'bg-red-100', text: 'text-red-800', label: 'Chyba' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Spracováva sa' },
    };
    const style = styles[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  // Get feed type icon
  const getFeedTypeIcon = (type: FeedType) => {
    const feedType = feedTypes.find(t => t.value === type);
    return feedType?.icon || '📄';
  };

  // Open create modal
  const handleCreate = () => {
    setFormData({
      name: '',
      vendorId: vendors[0]?.id || '',
      type: 'xml',
      url: '',
      schedule: 'daily',
      settings: {
        encoding: 'UTF-8',
        skipInvalid: true,
        updateExisting: true,
        deactivateMissing: true,
        priceMultiplier: 1,
        stockThreshold: 0,
      },
      mapping: [],
    });
    setShowCreateModal(true);
  };

  // Open edit modal
  const handleEdit = (feed: Feed) => {
    setSelectedFeed(feed);
    setFormData({
      name: feed.name,
      vendorId: feed.vendorId,
      type: feed.type,
      url: feed.url,
      schedule: feed.schedule,
      settings: { ...feed.settings },
      mapping: [...feed.mapping],
    });
    setShowEditModal(true);
  };

  // Save feed
  const handleSave = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (showCreateModal) {
      const newFeed: Feed = {
        id: String(Date.now()),
        name: formData.name || '',
        vendorId: formData.vendorId || '',
        type: formData.type || 'xml',
        url: formData.url || '',
        status: 'paused',
        schedule: formData.schedule || 'daily',
        productCount: 0,
        errorCount: 0,
        settings: formData.settings || {},
        mapping: formData.mapping || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setFeeds([...feeds, newFeed]);
      setShowCreateModal(false);
    } else if (showEditModal && selectedFeed) {
      const updatedFeeds = feeds.map(f => {
        if (f.id === selectedFeed.id) {
          return {
            ...f,
            name: formData.name || f.name,
            vendorId: formData.vendorId || f.vendorId,
            type: formData.type || f.type,
            url: formData.url || f.url,
            schedule: formData.schedule || f.schedule,
            settings: formData.settings || f.settings,
            mapping: formData.mapping || f.mapping,
            updatedAt: new Date().toISOString(),
          };
        }
        return f;
      });
      setFeeds(updatedFeeds);
      setShowEditModal(false);
    }
  };

  // Delete feed
  const handleDelete = async (feed: Feed) => {
    if (!confirm(`Naozaj chcete vymazať feed "${feed.name}"?`)) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    setFeeds(feeds.filter(f => f.id !== feed.id));
  };

  // Toggle feed status
  const handleToggleStatus = async (feed: Feed) => {
    const newStatus: FeedStatus = feed.status === 'active' ? 'paused' : 'active';
    const updatedFeeds = feeds.map(f => {
      if (f.id === feed.id) {
        return { ...f, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    setFeeds(updatedFeeds);
  };

  // Preview feed
  const handlePreview = async (feed: Feed) => {
    setSelectedFeed(feed);
    setPreviewLoading(true);
    setShowPreviewModal(true);
    
    // Simulate API call to fetch and parse feed
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock preview data
    setPreviewData({
      feedId: feed.id,
      totalItems: 5420,
      sampleItems: [
        {
          id: 'P001',
          name: 'Samsung Galaxy S24 Ultra 256GB',
          price: '1299.00',
          ean: '8806095359878',
          stock: '15',
          category: 'Mobilné telefóny > Samsung',
          image: 'https://example.com/s24.jpg',
          url: 'https://techstore.sk/samsung-galaxy-s24-ultra',
        },
        {
          id: 'P002',
          name: 'Apple iPhone 15 Pro 128GB',
          price: '1199.00',
          ean: '194253939054',
          stock: '8',
          category: 'Mobilné telefóny > Apple',
          image: 'https://example.com/iphone15.jpg',
          url: 'https://techstore.sk/apple-iphone-15-pro',
        },
        {
          id: 'P003',
          name: 'Sony PlayStation 5 Slim',
          price: '549.00',
          ean: '711719577195',
          stock: '0',
          category: 'Gaming > Konzoly',
          image: 'https://example.com/ps5.jpg',
          url: 'https://techstore.sk/ps5-slim',
        },
        {
          id: 'P004',
          name: 'MacBook Pro 14" M3 Pro 512GB',
          price: '2199.00',
          ean: '194253394150',
          stock: '5',
          category: 'Notebooky > Apple',
          image: 'https://example.com/macbook.jpg',
          url: 'https://techstore.sk/macbook-pro-14-m3',
        },
        {
          id: 'P005',
          name: 'Samsung 65" OLED 4K TV',
          price: '1899.00',
          ean: '8806095040158',
          stock: '3',
          category: 'Televízory > Samsung',
          image: 'https://example.com/tv.jpg',
          url: 'https://techstore.sk/samsung-65-oled',
        },
      ],
      detectedFields: ['id', 'name', 'price', 'ean', 'stock', 'category', 'image', 'url', 'description', 'brand'],
      errors: [],
    });
    
    setPreviewLoading(false);
  };

  // Open mapping modal
  const handleMapping = (feed: Feed) => {
    setSelectedFeed(feed);
    setFormData({
      ...formData,
      mapping: [...feed.mapping],
    });
    setShowMappingModal(true);
  };

  // Save mapping
  const handleSaveMapping = async () => {
    if (!selectedFeed) return;
    
    const updatedFeeds = feeds.map(f => {
      if (f.id === selectedFeed.id) {
        return {
          ...f,
          mapping: formData.mapping || [],
          updatedAt: new Date().toISOString(),
        };
      }
      return f;
    });
    setFeeds(updatedFeeds);
    setShowMappingModal(false);
  };

  // Add mapping row
  const handleAddMapping = () => {
    const newMapping: FeedMapping = {
      sourceField: '',
      targetField: '',
      isRequired: false,
      transform: null,
    };
    setFormData({
      ...formData,
      mapping: [...(formData.mapping || []), newMapping],
    });
  };

  // Remove mapping row
  const handleRemoveMapping = (index: number) => {
    const newMapping = [...(formData.mapping || [])];
    newMapping.splice(index, 1);
    setFormData({
      ...formData,
      mapping: newMapping,
    });
  };

  // Update mapping row
  const handleUpdateMapping = (index: number, field: keyof FeedMapping, value: any) => {
    const newMapping = [...(formData.mapping || [])];
    newMapping[index] = {
      ...newMapping[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      mapping: newMapping,
    });
  };

  // Run feed import
  const handleRunImport = async (feed: Feed) => {
    setSelectedFeed(feed);
    setShowRunModal(true);
    setImportProgress({
      feedId: feed.id,
      status: 'running',
      totalItems: 0,
      processedItems: 0,
      newItems: 0,
      updatedItems: 0,
      skippedItems: 0,
      errorItems: 0,
      startedAt: new Date().toISOString(),
    });
    
    // Simulate import progress
    const totalItems = feed.productCount || 5000;
    let processed = 0;
    let newItems = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    const interval = setInterval(() => {
      const batch = Math.min(Math.floor(Math.random() * 200) + 100, totalItems - processed);
      processed += batch;
      newItems += Math.floor(batch * 0.1);
      updated += Math.floor(batch * 0.7);
      skipped += Math.floor(batch * 0.15);
      errors += Math.floor(batch * 0.05);
      
      if (processed >= totalItems) {
        processed = totalItems;
        clearInterval(interval);
        
        setImportProgress({
          feedId: feed.id,
          status: 'completed',
          totalItems,
          processedItems: processed,
          newItems,
          updatedItems: updated,
          skippedItems: skipped,
          errorItems: errors,
          startedAt: new Date(Date.now() - 30000).toISOString(),
          completedAt: new Date().toISOString(),
        });
        
        // Update feed
        const updatedFeeds = feeds.map(f => {
          if (f.id === feed.id) {
            return {
              ...f,
              status: errors > totalItems * 0.1 ? 'error' as FeedStatus : 'active' as FeedStatus,
              lastRun: new Date().toISOString(),
              lastSuccess: errors > totalItems * 0.1 ? f.lastSuccess : new Date().toISOString(),
              productCount: processed - skipped - errors,
              errorCount: errors,
              updatedAt: new Date().toISOString(),
            };
          }
          return f;
        });
        setFeeds(updatedFeeds);
      } else {
        setImportProgress({
          feedId: feed.id,
          status: 'running',
          totalItems,
          processedItems: processed,
          newItems,
          updatedItems: updated,
          skippedItems: skipped,
          errorItems: errors,
          startedAt: new Date(Date.now() - (processed / totalItems) * 30000).toISOString(),
        });
      }
    }, 200);
  };

  // Show run history/logs
  const handleShowLogs = (feed: Feed) => {
    setSelectedFeed(feed);
    
    // Mock run history
    setRunHistory([
      {
        feedId: feed.id,
        status: 'completed',
        totalItems: feed.productCount || 5000,
        processedItems: feed.productCount || 5000,
        newItems: 120,
        updatedItems: 4800,
        skippedItems: 50,
        errorItems: feed.errorCount || 0,
        startedAt: feed.lastRun || new Date().toISOString(),
        completedAt: feed.lastRun || new Date().toISOString(),
        errors: feed.errorCount ? [
          { line: 1523, field: 'price', message: 'Neplatná hodnota ceny: "N/A"', value: 'N/A' },
          { line: 2847, field: 'ean', message: 'Neplatný EAN kód', value: '123456' },
          { line: 3102, field: 'url', message: 'Prázdna URL adresa', value: '' },
        ] : [],
      },
      {
        feedId: feed.id,
        status: 'completed',
        totalItems: feed.productCount || 5000,
        processedItems: feed.productCount || 5000,
        newItems: 85,
        updatedItems: 4850,
        skippedItems: 45,
        errorItems: 2,
        startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 45000).toISOString(),
        errors: [],
      },
      {
        feedId: feed.id,
        status: 'completed',
        totalItems: feed.productCount || 5000,
        processedItems: feed.productCount || 5000,
        newItems: 150,
        updatedItems: 4750,
        skippedItems: 60,
        errorItems: 5,
        startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000 + 52000).toISOString(),
        errors: [],
      },
    ]);
    
    setShowLogsModal(true);
  };

  // Stats
  const stats = useMemo(() => {
    const active = feeds.filter(f => f.status === 'active').length;
    const paused = feeds.filter(f => f.status === 'paused').length;
    const error = feeds.filter(f => f.status === 'error').length;
    const totalProducts = feeds.reduce((sum, f) => sum + (f.productCount || 0), 0);
    const totalErrors = feeds.reduce((sum, f) => sum + (f.errorCount || 0), 0);
    return { active, paused, error, totalProducts, totalErrors };
  }, [feeds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Načítavam feedy...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">Import feedov</h1>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Pridať feed
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Celkom feedov</p>
            <p className="text-2xl font-bold text-gray-900">{feeds.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Aktívne</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Pozastavené</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.paused}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">S chybou</p>
            <p className="text-2xl font-bold text-red-600">{stats.error}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Produktov</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalProducts.toLocaleString()}</p>
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
                  placeholder="Hľadať feed..."
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
              <option value="active">Aktívne</option>
              <option value="paused">Pozastavené</option>
              <option value="error">S chybou</option>
            </select>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Všetci vendori</option>
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Všetky typy</option>
              {feedTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Feeds Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stav</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produkty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posledný beh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ďalší beh</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFeeds.map(feed => {
                  const vendor = getVendor(feed.vendorId);
                  return (
                    <tr key={feed.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{feed.name}</span>
                          <span className="text-sm text-gray-500 truncate max-w-xs">{feed.url}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {vendor?.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-900">{vendor?.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>{getFeedTypeIcon(feed.type)}</span>
                          <span className="text-gray-600 uppercase text-sm">{feed.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(feed.status)}
                        {feed.errorCount > 0 && (
                          <span className="ml-2 text-xs text-red-600">
                            ({feed.errorCount} chýb)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {(feed.productCount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {formatDate(feed.lastRun)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {feed.status === 'active' ? formatDate(feed.nextRun) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRunImport(feed)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Spustiť import"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handlePreview(feed)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Náhľad"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleMapping(feed)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Mapovanie"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleShowLogs(feed)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="História"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(feed)}
                            className={`p-2 rounded-lg transition-colors ${
                              feed.status === 'active'
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={feed.status === 'active' ? 'Pozastaviť' : 'Aktivovať'}
                          >
                            {feed.status === 'active' ? (
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
                            onClick={() => handleEdit(feed)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Upraviť"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(feed)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Vymazať"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredFeeds.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">Žiadne feedy nenájdené</p>
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-900">
                  {showCreateModal ? 'Nový feed' : 'Upraviť feed'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Názov feedu *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Napr. TechStore - Hlavný feed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
                  <select
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Vyberte vendora</option>
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Typ feedu *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as FeedType })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {feedTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plánovanie</label>
                    <select
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {scheduleOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL feedu *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/feed.xml"
                  />
                </div>
                
                {/* Feed type specific settings */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Nastavenia feedu</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Kódovanie</label>
                      <select
                        value={formData.settings?.encoding || 'UTF-8'}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, encoding: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="UTF-8">UTF-8</option>
                        <option value="ISO-8859-2">ISO-8859-2 (Latin-2)</option>
                        <option value="Windows-1250">Windows-1250</option>
                      </select>
                    </div>
                    
                    {(formData.type === 'xml' || formData.type === 'heureka' || formData.type === 'google') && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Root element</label>
                          <input
                            type="text"
                            value={formData.settings?.rootElement || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, rootElement: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="products"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Item element</label>
                          <input
                            type="text"
                            value={formData.settings?.itemElement || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, itemElement: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="product"
                          />
                        </div>
                      </>
                    )}
                    
                    {formData.type === 'csv' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Oddeľovač</label>
                          <select
                            value={formData.settings?.delimiter || ';'}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, delimiter: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value=";">Bodkočiarka (;)</option>
                            <option value=",">Čiarka (,)</option>
                            <option value="\t">Tabulátor</option>
                            <option value="|">Pipe (|)</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="hasHeader"
                            checked={formData.settings?.hasHeader !== false}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, hasHeader: e.target.checked }
                            })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <label htmlFor="hasHeader" className="text-sm text-gray-600">Má hlavičku</label>
                        </div>
                      </>
                    )}
                    
                    {formData.type === 'json' && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Cesta k dátam</label>
                        <input
                          type="text"
                          value={formData.settings?.rootElement || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            settings: { ...formData.settings, rootElement: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="data.products"
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Násobič ceny</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.settings?.priceMultiplier || 1}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, priceMultiplier: parseFloat(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min. skladom</label>
                      <input
                        type="number"
                        value={formData.settings?.stockThreshold || 0}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, stockThreshold: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.skipInvalid !== false}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, skipInvalid: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600">Preskočiť neplatné položky</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.updateExisting !== false}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, updateExisting: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600">Aktualizovať existujúce produkty</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.deactivateMissing !== false}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, deactivateMissing: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-600">Deaktivovať chýbajúce produkty</span>
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

      {/* Preview Modal */}
      {showPreviewModal && selectedFeed && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowPreviewModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Náhľad feedu: {selectedFeed.name}</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {previewLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Načítavam feed...</p>
                  </div>
                ) : previewData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600">Celkom položiek</p>
                        <p className="text-2xl font-bold text-blue-700">{previewData.totalItems.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600">Detekované polia</p>
                        <p className="text-2xl font-bold text-green-700">{previewData.detectedFields.length}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm text-red-600">Chyby</p>
                        <p className="text-2xl font-bold text-red-700">{previewData.errors.length}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Detekované polia:</h3>
                      <div className="flex flex-wrap gap-2">
                        {previewData.detectedFields.map(field => (
                          <span key={field} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Ukážka dát ({previewData.sampleItems.length} položiek):</h3>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {previewData.detectedFields.slice(0, 8).map(field => (
                                <th key={field} className="px-4 py-2 text-left font-medium text-gray-600">
                                  {field}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {previewData.sampleItems.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                {previewData.detectedFields.slice(0, 8).map(field => (
                                  <td key={field} className="px-4 py-2 text-gray-900 max-w-xs truncate">
                                    {(item as any)[field] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">Nie sú dostupné žiadne dáta</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mapping Modal */}
      {showMappingModal && selectedFeed && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMappingModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Mapovanie polí: {selectedFeed.name}</h2>
                <button
                  onClick={() => setShowMappingModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                <p className="text-sm text-gray-600 mb-4">
                  Namapujte polia z feedu na systémové polia. Povinné polia sú označené *.
                </p>
                
                <div className="space-y-3">
                  {(formData.mapping || []).map((map, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Zdrojové pole</label>
                        <input
                          type="text"
                          value={map.sourceField}
                          onChange={(e) => handleUpdateMapping(index, 'sourceField', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="napr. product_name"
                        />
                      </div>
                      <div className="flex items-center justify-center w-8 text-gray-400">
                        →
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Cieľové pole</label>
                        <select
                          value={map.targetField}
                          onChange={(e) => handleUpdateMapping(index, 'targetField', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="">Vyberte pole</option>
                          {targetFields.map(field => (
                            <option key={field.value} value={field.value}>
                              {field.label}{field.required ? ' *' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-40">
                        <label className="block text-xs text-gray-500 mb-1">Transformácia</label>
                        <select
                          value={map.transform || ''}
                          onChange={(e) => handleUpdateMapping(index, 'transform', e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          {transformOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={map.isRequired}
                            onChange={(e) => handleUpdateMapping(index, 'isRequired', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-xs text-gray-500">Povinné</span>
                        </label>
                        <button
                          onClick={() => handleRemoveMapping(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleAddMapping}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Pridať mapovanie
                </button>
              </div>
              
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowMappingModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Zrušiť
                </button>
                <button
                  onClick={handleSaveMapping}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Uložiť mapovanie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Run Import Modal */}
      {showRunModal && selectedFeed && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50"></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Import: {selectedFeed.name}</h2>
                
                {importProgress && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {importProgress.status === 'running' ? 'Prebieha import...' : 'Import dokončený'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {importProgress.processedItems.toLocaleString()} / {importProgress.totalItems.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          importProgress.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${(importProgress.processedItems / importProgress.totalItems) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-700">{importProgress.newItems.toLocaleString()}</p>
                        <p className="text-xs text-green-600">Nové</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-700">{importProgress.updatedItems.toLocaleString()}</p>
                        <p className="text-xs text-blue-600">Aktualizované</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-lg font-bold text-yellow-700">{importProgress.skippedItems.toLocaleString()}</p>
                        <p className="text-xs text-yellow-600">Preskočené</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-lg font-bold text-red-700">{importProgress.errorItems.toLocaleString()}</p>
                        <p className="text-xs text-red-600">Chyby</p>
                      </div>
                    </div>
                    
                    {importProgress.status === 'completed' && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">Import úspešne dokončený</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex justify-end">
                <button
                  onClick={() => { setShowRunModal(false); setImportProgress(null); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={importProgress?.status === 'running'}
                >
                  {importProgress?.status === 'running' ? 'Čakajte...' : 'Zavrieť'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && selectedFeed && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowLogsModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">História importov: {selectedFeed.name}</h2>
                <button
                  onClick={() => setShowLogsModal(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="space-y-4">
                  {runHistory.map((run, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            run.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {run.status === 'completed' ? 'Dokončené' : 'Chyba'}
                          </span>
                          <span className="text-sm text-gray-600">{formatDate(run.startedAt)}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {run.processedItems.toLocaleString()} položiek
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Nové:</span>
                            <span className="ml-2 font-medium text-green-600">{run.newItems.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Aktualizované:</span>
                            <span className="ml-2 font-medium text-blue-600">{run.updatedItems.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Preskočené:</span>
                            <span className="ml-2 font-medium text-yellow-600">{run.skippedItems.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Chyby:</span>
                            <span className="ml-2 font-medium text-red-600">{run.errorItems.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {run.errors && run.errors.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Chyby ({run.errors.length}):</p>
                            <div className="bg-red-50 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                              {run.errors.map((error, eIdx) => (
                                <div key={eIdx} className="text-sm text-red-700">
                                  <span className="font-mono">Riadok {error.line}</span>
                                  <span className="mx-2">•</span>
                                  <span className="font-medium">{error.field}:</span>
                                  <span className="ml-1">{error.message}</span>
                                  {error.value && (
                                    <span className="ml-2 font-mono text-red-500">"{error.value}"</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
