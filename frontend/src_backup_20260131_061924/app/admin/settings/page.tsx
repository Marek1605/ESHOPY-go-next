'use client';

import React, { useState, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface StoreSettings {
  general: {
    storeName: string;
    storeSlug: string;
    storeUrl: string;
    storeEmail: string;
    storePhone: string;
    storeLogo: string;
    storeFavicon: string;
    storeDescription: string;
    storeKeywords: string;
    defaultLanguage: string;
    defaultCurrency: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
  };
  ecommerce: {
    enableCart: boolean;
    enableWishlist: boolean;
    enableCompare: boolean;
    enableReviews: boolean;
    enableQuestions: boolean;
    reviewModeration: boolean;
    showStock: boolean;
    showSku: boolean;
    showEan: boolean;
    lowStockThreshold: number;
    outOfStockVisibility: 'show' | 'hide' | 'show_disabled';
    priceDisplayMode: 'with_vat' | 'without_vat' | 'both';
    vatRate: number;
    currencyPosition: 'before' | 'after';
    currencySymbol: string;
    thousandSeparator: string;
    decimalSeparator: string;
    decimals: number;
  };
  marketplace: {
    enableMarketplace: boolean;
    enableCpc: boolean;
    defaultCpcRate: number;
    minCpcRate: number;
    maxCpcRate: number;
    commissionRate: number;
    vendorAutoApprove: boolean;
    vendorVerificationRequired: boolean;
    showVendorRating: boolean;
    showVendorReviews: boolean;
    allowVendorContact: boolean;
    vendorMinProducts: number;
  };
  checkout: {
    enableGuestCheckout: boolean;
    requirePhone: boolean;
    requireCompany: boolean;
    enableCoupons: boolean;
    enableGiftCards: boolean;
    orderPrefix: string;
    orderSuffix: string;
    minOrderAmount: number;
    maxOrderAmount: number;
    termsPageId: string;
    privacyPageId: string;
  };
  shipping: {
    enableShipping: boolean;
    freeShippingThreshold: number;
    defaultShippingCost: number;
    enableLocalPickup: boolean;
    localPickupAddress: string;
    enableInternational: boolean;
    allowedCountries: string[];
    excludedCountries: string[];
    weightUnit: 'kg' | 'g' | 'lb' | 'oz';
    dimensionUnit: 'cm' | 'm' | 'in' | 'ft';
  };
  payments: {
    enabledMethods: string[];
    testMode: boolean;
    stripeEnabled: boolean;
    stripePublicKey: string;
    stripeSecretKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalSecret: string;
    codEnabled: boolean;
    codFee: number;
    bankTransferEnabled: boolean;
    bankAccount: string;
    bankIban: string;
    bankSwift: string;
  };
  emails: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    smtpEncryption: 'none' | 'ssl' | 'tls';
    fromEmail: string;
    fromName: string;
    adminEmail: string;
    enableOrderConfirmation: boolean;
    enableShippingNotification: boolean;
    enableReviewRequest: boolean;
    reviewRequestDelay: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    enableSitemap: boolean;
    sitemapFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    enableRobots: boolean;
    robotsContent: string;
    enableCanonical: boolean;
    enableBreadcrumbs: boolean;
    enableStructuredData: boolean;
    googleAnalyticsId: string;
    googleTagManagerId: string;
    facebookPixelId: string;
  };
  appearance: {
    themeId: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    borderRadius: number;
    enableDarkMode: boolean;
    logoPosition: 'left' | 'center' | 'right';
    headerStyle: 'simple' | 'mega' | 'sidebar';
    footerColumns: number;
    showSocialLinks: boolean;
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
      linkedin: string;
    };
  };
  performance: {
    enableCaching: boolean;
    cacheLifetime: number;
    enableLazyLoad: boolean;
    enableImageOptimization: boolean;
    imageQuality: number;
    maxImageWidth: number;
    enableMinification: boolean;
    enableCdn: boolean;
    cdnUrl: string;
    enableCompression: boolean;
  };
  security: {
    enableSsl: boolean;
    enableCaptcha: boolean;
    captchaSiteKey: string;
    captchaSecretKey: string;
    enableRateLimit: boolean;
    rateLimitRequests: number;
    rateLimitWindow: number;
    enableTwoFactor: boolean;
    sessionTimeout: number;
    enableAuditLog: boolean;
    enableIpBlocking: boolean;
    blockedIps: string[];
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const defaultSettings: StoreSettings = {
  general: {
    storeName: 'MegaPrice.sk',
    storeSlug: 'megaprice',
    storeUrl: 'https://megaprice.sk',
    storeEmail: 'info@megaprice.sk',
    storePhone: '+421 900 123 456',
    storeLogo: '/images/logo.png',
    storeFavicon: '/images/favicon.ico',
    storeDescription: 'Najväčší slovenský porovnávač cien elektroniky a spotrebičov',
    storeKeywords: 'porovnanie cien, elektronika, mobily, notebooky, slovensko',
    defaultLanguage: 'sk',
    defaultCurrency: 'EUR',
    timezone: 'Europe/Bratislava',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
  },
  ecommerce: {
    enableCart: true,
    enableWishlist: true,
    enableCompare: true,
    enableReviews: true,
    enableQuestions: true,
    reviewModeration: true,
    showStock: true,
    showSku: true,
    showEan: true,
    lowStockThreshold: 5,
    outOfStockVisibility: 'show_disabled',
    priceDisplayMode: 'with_vat',
    vatRate: 20,
    currencyPosition: 'after',
    currencySymbol: '€',
    thousandSeparator: ' ',
    decimalSeparator: ',',
    decimals: 2,
  },
  marketplace: {
    enableMarketplace: true,
    enableCpc: true,
    defaultCpcRate: 0.15,
    minCpcRate: 0.05,
    maxCpcRate: 1.00,
    commissionRate: 5,
    vendorAutoApprove: false,
    vendorVerificationRequired: true,
    showVendorRating: true,
    showVendorReviews: true,
    allowVendorContact: true,
    vendorMinProducts: 10,
  },
  checkout: {
    enableGuestCheckout: true,
    requirePhone: true,
    requireCompany: false,
    enableCoupons: true,
    enableGiftCards: false,
    orderPrefix: 'ORD-',
    orderSuffix: '',
    minOrderAmount: 0,
    maxOrderAmount: 10000,
    termsPageId: 'terms',
    privacyPageId: 'privacy',
  },
  shipping: {
    enableShipping: true,
    freeShippingThreshold: 50,
    defaultShippingCost: 3.99,
    enableLocalPickup: true,
    localPickupAddress: 'Hlavná 1, 811 01 Bratislava',
    enableInternational: true,
    allowedCountries: ['SK', 'CZ', 'HU', 'PL', 'AT'],
    excludedCountries: [],
    weightUnit: 'kg',
    dimensionUnit: 'cm',
  },
  payments: {
    enabledMethods: ['stripe', 'paypal', 'cod', 'bank_transfer'],
    testMode: true,
    stripeEnabled: true,
    stripePublicKey: 'pk_test_xxxxx',
    stripeSecretKey: 'sk_test_xxxxx',
    paypalEnabled: true,
    paypalClientId: 'client_id_xxxxx',
    paypalSecret: 'secret_xxxxx',
    codEnabled: true,
    codFee: 1.50,
    bankTransferEnabled: true,
    bankAccount: '1234567890/0900',
    bankIban: 'SK89 0900 0000 0012 3456 7890',
    bankSwift: 'GIBASKBX',
  },
  emails: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@megaprice.sk',
    smtpPassword: '********',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@megaprice.sk',
    fromName: 'MegaPrice.sk',
    adminEmail: 'admin@megaprice.sk',
    enableOrderConfirmation: true,
    enableShippingNotification: true,
    enableReviewRequest: true,
    reviewRequestDelay: 7,
  },
  seo: {
    metaTitle: 'MegaPrice.sk - Porovnanie cien elektroniky',
    metaDescription: 'Porovnajte ceny elektroniky od tisícov predajcov. Nájdite najlepšie ponuky na mobily, notebooky, TV a ďalšie produkty.',
    ogImage: '/images/og-image.jpg',
    enableSitemap: true,
    sitemapFrequency: 'daily',
    enableRobots: true,
    robotsContent: 'User-agent: *\nAllow: /\nDisallow: /admin/',
    enableCanonical: true,
    enableBreadcrumbs: true,
    enableStructuredData: true,
    googleAnalyticsId: 'G-XXXXXXXXXX',
    googleTagManagerId: 'GTM-XXXXXXX',
    facebookPixelId: '1234567890',
  },
  appearance: {
    themeId: 'modern-minimal',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    fontFamily: 'Inter',
    fontSize: 16,
    borderRadius: 8,
    enableDarkMode: true,
    logoPosition: 'left',
    headerStyle: 'mega',
    footerColumns: 4,
    showSocialLinks: true,
    socialLinks: {
      facebook: 'https://facebook.com/megaprice',
      instagram: 'https://instagram.com/megaprice',
      twitter: 'https://twitter.com/megaprice',
      youtube: '',
      linkedin: '',
    },
  },
  performance: {
    enableCaching: true,
    cacheLifetime: 3600,
    enableLazyLoad: true,
    enableImageOptimization: true,
    imageQuality: 85,
    maxImageWidth: 1920,
    enableMinification: true,
    enableCdn: false,
    cdnUrl: '',
    enableCompression: true,
  },
  security: {
    enableSsl: true,
    enableCaptcha: true,
    captchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    captchaSecretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    enableRateLimit: true,
    rateLimitRequests: 100,
    rateLimitWindow: 60,
    enableTwoFactor: false,
    sessionTimeout: 1440,
    enableAuditLog: true,
    enableIpBlocking: false,
    blockedIps: [],
  },
};

const themes = [
  { id: 'modern-minimal', name: 'Modern Minimal', preview: '#f8fafc' },
  { id: 'luxury-gold', name: 'Luxury Gold', preview: '#1a1a2e' },
  { id: 'fresh-green', name: 'Fresh Green', preview: '#ecfdf5' },
  { id: 'tech-blue', name: 'Tech Blue', preview: '#0f172a' },
  { id: 'warm-terracotta', name: 'Warm Terracotta', preview: '#fef3e2' },
  { id: 'nordic-calm', name: 'Nordic Calm', preview: '#f1f5f9' },
  { id: 'rose-boutique', name: 'Rose Boutique', preview: '#fdf2f8' },
  { id: 'ocean-deep', name: 'Ocean Deep', preview: '#0c1929' },
  { id: 'vintage-retro', name: 'Vintage Retro', preview: '#fefce8' },
  { id: 'neon-dark', name: 'Neon Dark', preview: '#0a0a0a' },
  { id: 'forest', name: 'Forest', preview: '#14532d' },
  { id: 'sunset-glow', name: 'Sunset Glow', preview: '#fff7ed' },
  { id: 'slate-corporate', name: 'Slate Corporate', preview: '#f8fafc' },
  { id: 'candy-pop', name: 'Candy Pop', preview: '#faf5ff' },
  { id: 'mono', name: 'Mono', preview: '#fafafa' },
];

const languages = [
  { code: 'sk', name: 'Slovenčina' },
  { code: 'cs', name: 'Čeština' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hu', name: 'Magyar' },
  { code: 'pl', name: 'Polski' },
];

const currencies = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'CZK', symbol: 'Kč', name: 'Česká koruna' },
  { code: 'PLN', symbol: 'zł', name: 'Złoty' },
  { code: 'HUF', symbol: 'Ft', name: 'Forint' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
];

const countries = [
  { code: 'SK', name: 'Slovensko' },
  { code: 'CZ', name: 'Česko' },
  { code: 'PL', name: 'Poľsko' },
  { code: 'HU', name: 'Maďarsko' },
  { code: 'AT', name: 'Rakúsko' },
  { code: 'DE', name: 'Nemecko' },
  { code: 'UA', name: 'Ukrajina' },
];

type SettingsTab = 'general' | 'ecommerce' | 'marketplace' | 'checkout' | 'shipping' | 'payments' | 'emails' | 'seo' | 'appearance' | 'performance' | 'security';

// ============================================================================
// COMPONENT
// ============================================================================

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Track changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // Generic update function
  const updateSettings = <K extends keyof StoreSettings>(
    section: K,
    key: keyof StoreSettings[K],
    value: StoreSettings[K][keyof StoreSettings[K]]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Naozaj chcete obnoviť predvolené nastavenia? Všetky zmeny budú stratené.')) {
      setSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  // Tabs configuration
  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: 'general', label: 'Všeobecné', icon: '⚙️' },
    { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { id: 'marketplace', label: 'Marketplace', icon: '🏪' },
    { id: 'checkout', label: 'Pokladňa', icon: '💳' },
    { id: 'shipping', label: 'Doprava', icon: '📦' },
    { id: 'payments', label: 'Platby', icon: '💰' },
    { id: 'emails', label: 'E-maily', icon: '📧' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'appearance', label: 'Vzhľad', icon: '🎨' },
    { id: 'performance', label: 'Výkon', icon: '⚡' },
    { id: 'security', label: 'Bezpečnosť', icon: '🔒' },
  ];

  // ============================================================================
  // RENDER SECTIONS
  // ============================================================================

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Názov obchodu</label>
          <input
            type="text"
            value={settings.general.storeName}
            onChange={e => updateSettings('general', 'storeName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={settings.general.storeSlug}
            onChange={e => updateSettings('general', 'storeSlug', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL obchodu</label>
          <input
            type="url"
            value={settings.general.storeUrl}
            onChange={e => updateSettings('general', 'storeUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            value={settings.general.storeEmail}
            onChange={e => updateSettings('general', 'storeEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefón</label>
          <input
            type="tel"
            value={settings.general.storePhone}
            onChange={e => updateSettings('general', 'storePhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Predvolený jazyk</label>
          <select
            value={settings.general.defaultLanguage}
            onChange={e => updateSettings('general', 'defaultLanguage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Predvolená mena</label>
          <select
            value={settings.general.defaultCurrency}
            onChange={e => updateSettings('general', 'defaultCurrency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {currencies.map(curr => (
              <option key={curr.code} value={curr.code}>{curr.name} ({curr.symbol})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Časová zóna</label>
          <select
            value={settings.general.timezone}
            onChange={e => updateSettings('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Europe/Bratislava">Europe/Bratislava (UTC+1)</option>
            <option value="Europe/Prague">Europe/Prague (UTC+1)</option>
            <option value="Europe/Warsaw">Europe/Warsaw (UTC+1)</option>
            <option value="Europe/Budapest">Europe/Budapest (UTC+1)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Formát dátumu</label>
          <select
            value={settings.general.dateFormat}
            onChange={e => updateSettings('general', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="DD.MM.YYYY">DD.MM.YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Formát času</label>
          <select
            value={settings.general.timeFormat}
            onChange={e => updateSettings('general', 'timeFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="HH:mm">24-hodinový (HH:mm)</option>
            <option value="hh:mm A">12-hodinový (hh:mm AM/PM)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Popis obchodu</label>
        <textarea
          value={settings.general.storeDescription}
          onChange={e => updateSettings('general', 'storeDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kľúčové slová</label>
        <input
          type="text"
          value={settings.general.storeKeywords}
          onChange={e => updateSettings('general', 'storeKeywords', e.target.value)}
          placeholder="oddelené čiarkou"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
              {settings.general.storeLogo ? (
                <span className="text-2xl">📷</span>
              ) : (
                <span className="text-xs text-center">Nahrať logo</span>
              )}
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Vybrať súbor
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
              {settings.general.storeFavicon ? (
                <span className="text-2xl">🌐</span>
              ) : (
                <span className="text-xs text-center">Nahrať favicon</span>
              )}
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Vybrať súbor
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEcommerceSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Funkcie obchodu</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'enableCart', label: 'Košík' },
            { key: 'enableWishlist', label: 'Wishlist' },
            { key: 'enableCompare', label: 'Porovnanie' },
            { key: 'enableReviews', label: 'Recenzie' },
            { key: 'enableQuestions', label: 'Otázky' },
            { key: 'reviewModeration', label: 'Moderácia recenzií' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ecommerce[item.key as keyof typeof settings.ecommerce] as boolean}
                onChange={e => updateSettings('ecommerce', item.key as keyof typeof settings.ecommerce, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">Zobrazenie produktov</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'showStock', label: 'Zobraziť sklad' },
            { key: 'showSku', label: 'Zobraziť SKU' },
            { key: 'showEan', label: 'Zobraziť EAN' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ecommerce[item.key as keyof typeof settings.ecommerce] as boolean}
                onChange={e => updateSettings('ecommerce', item.key as keyof typeof settings.ecommerce, e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prah nízkeho skladu</label>
          <input
            type="number"
            value={settings.ecommerce.lowStockThreshold}
            onChange={e => updateSettings('ecommerce', 'lowStockThreshold', parseInt(e.target.value))}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Produkty bez skladu</label>
          <select
            value={settings.ecommerce.outOfStockVisibility}
            onChange={e => updateSettings('ecommerce', 'outOfStockVisibility', e.target.value as 'show' | 'hide' | 'show_disabled')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="show">Zobraziť</option>
            <option value="hide">Skryť</option>
            <option value="show_disabled">Zobraziť (vypnuté)</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Nastavenia cien</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zobrazenie ceny</label>
            <select
              value={settings.ecommerce.priceDisplayMode}
              onChange={e => updateSettings('ecommerce', 'priceDisplayMode', e.target.value as 'with_vat' | 'without_vat' | 'both')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="with_vat">S DPH</option>
              <option value="without_vat">Bez DPH</option>
              <option value="both">Oboje</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sadzba DPH (%)</label>
            <input
              type="number"
              value={settings.ecommerce.vatRate}
              onChange={e => updateSettings('ecommerce', 'vatRate', parseInt(e.target.value))}
              min={0}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pozícia meny</label>
            <select
              value={settings.ecommerce.currencyPosition}
              onChange={e => updateSettings('ecommerce', 'currencyPosition', e.target.value as 'before' | 'after')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="before">Pred sumou (€100)</option>
              <option value="after">Za sumou (100 €)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symbol meny</label>
            <input
              type="text"
              value={settings.ecommerce.currencySymbol}
              onChange={e => updateSettings('ecommerce', 'currencySymbol', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Oddeľovač tisícov</label>
            <input
              type="text"
              value={settings.ecommerce.thousandSeparator}
              onChange={e => updateSettings('ecommerce', 'thousandSeparator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desatinný oddeľovač</label>
            <input
              type="text"
              value={settings.ecommerce.decimalSeparator}
              onChange={e => updateSettings('ecommerce', 'decimalSeparator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplaceSettings = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-purple-900">Marketplace mód</h3>
            <p className="text-sm text-purple-700">Povoliť viacerých predajcov na platforme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.marketplace.enableMarketplace}
              onChange={e => updateSettings('marketplace', 'enableMarketplace', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {settings.marketplace.enableMarketplace && (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-amber-900">CPC model</h3>
                <p className="text-sm text-amber-700">Platba za kliknutie na ponuku predajcu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marketplace.enableCpc}
                  onChange={e => updateSettings('marketplace', 'enableCpc', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {settings.marketplace.enableCpc && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Predvolená CPC sadzba (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.marketplace.defaultCpcRate}
                    onChange={e => updateSettings('marketplace', 'defaultCpcRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimálna CPC (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.marketplace.minCpcRate}
                    onChange={e => updateSettings('marketplace', 'minCpcRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximálna CPC (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.marketplace.maxCpcRate}
                    onChange={e => updateSettings('marketplace', 'maxCpcRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provízna sadzba (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.marketplace.commissionRate}
                onChange={e => updateSettings('marketplace', 'commissionRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. počet produktov pre predajcu</label>
              <input
                type="number"
                value={settings.marketplace.vendorMinProducts}
                onChange={e => updateSettings('marketplace', 'vendorMinProducts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Nastavenia predajcov</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'vendorAutoApprove', label: 'Automatické schválenie' },
                { key: 'vendorVerificationRequired', label: 'Vyžadovať verifikáciu' },
                { key: 'showVendorRating', label: 'Zobraziť hodnotenie' },
                { key: 'showVendorReviews', label: 'Zobraziť recenzie' },
                { key: 'allowVendorContact', label: 'Povoliť kontakt' },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.marketplace[item.key as keyof typeof settings.marketplace] as boolean}
                    onChange={e => updateSettings('marketplace', item.key as keyof typeof settings.marketplace, e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderCheckoutSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-3">Možnosti pokladne</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'enableGuestCheckout', label: 'Hosťovský nákup' },
            { key: 'requirePhone', label: 'Vyžadovať telefón' },
            { key: 'requireCompany', label: 'Vyžadovať firmu' },
            { key: 'enableCoupons', label: 'Povoliť kupóny' },
            { key: 'enableGiftCards', label: 'Darčekové poukazy' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.checkout[item.key as keyof typeof settings.checkout] as boolean}
                onChange={e => updateSettings('checkout', item.key as keyof typeof settings.checkout, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prefix objednávky</label>
          <input
            type="text"
            value={settings.checkout.orderPrefix}
            onChange={e => updateSettings('checkout', 'orderPrefix', e.target.value)}
            placeholder="napr. ORD-"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suffix objednávky</label>
          <input
            type="text"
            value={settings.checkout.orderSuffix}
            onChange={e => updateSettings('checkout', 'orderSuffix', e.target.value)}
            placeholder="voliteľné"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimálna suma objednávky (€)</label>
          <input
            type="number"
            step="0.01"
            value={settings.checkout.minOrderAmount}
            onChange={e => updateSettings('checkout', 'minOrderAmount', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximálna suma objednávky (€)</label>
          <input
            type="number"
            step="0.01"
            value={settings.checkout.maxOrderAmount}
            onChange={e => updateSettings('checkout', 'maxOrderAmount', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="੧block text-sm font-medium text-gray-700 mb-1">Stránka s podmienkami</label>
          <input
            type="text"
            value={settings.checkout.termsPageId}
            onChange={e => updateSettings('checkout', 'termsPageId', e.target.value)}
            placeholder="napr. terms"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stránka so súkromím</label>
          <input
            type="text"
            value={settings.checkout.privacyPageId}
            onChange={e => updateSettings('checkout', 'privacyPageId', e.target.value)}
            placeholder="napr. privacy"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-emerald-900">Doprava</h3>
            <p className="text-sm text-emerald-700">Povoliť možnosti doručenia</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.shipping.enableShipping}
              onChange={e => updateSettings('shipping', 'enableShipping', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      {settings.shipping.enableShipping && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doprava zadarmo od (€)</label>
              <input
                type="number"
                step="0.01"
                value={settings.shipping.freeShippingThreshold}
                onChange={e => updateSettings('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Predvolená cena dopravy (€)</label>
              <input
                type="number"
                step="0.01"
                value={settings.shipping.defaultShippingCost}
                onChange={e => updateSettings('shipping', 'defaultShippingCost', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jednotka hmotnosti</label>
              <select
                value={settings.shipping.weightUnit}
                onChange={e => updateSettings('shipping', 'weightUnit', e.target.value as 'kg' | 'g' | 'lb' | 'oz')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="kg">Kilogramy (kg)</option>
                <option value="g">Gramy (g)</option>
                <option value="lb">Libry (lb)</option>
                <option value="oz">Unce (oz)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jednotka rozmerov</label>
              <select
                value={settings.shipping.dimensionUnit}
                onChange={e => updateSettings('shipping', 'dimensionUnit', e.target.value as 'cm' | 'm' | 'in' | 'ft')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cm">Centimetre (cm)</option>
                <option value="m">Metre (m)</option>
                <option value="in">Palce (in)</option>
                <option value="ft">Stopy (ft)</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={settings.shipping.enableLocalPickup}
                onChange={e => updateSettings('shipping', 'enableLocalPickup', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Osobný odber</span>
            </label>
            {settings.shipping.enableLocalPickup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresa pre osobný odber</label>
                <input
                  type="text"
                  value={settings.shipping.localPickupAddress}
                  onChange={e => updateSettings('shipping', 'localPickupAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={settings.shipping.enableInternational}
                onChange={e => updateSettings('shipping', 'enableInternational', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Medzinárodná doprava</span>
            </label>
            {settings.shipping.enableInternational && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Povolené krajiny</label>
                <div className="flex flex-wrap gap-2">
                  {countries.map(country => (
                    <label
                      key={country.code}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                        settings.shipping.allowedCountries.includes(country.code)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={settings.shipping.allowedCountries.includes(country.code)}
                        onChange={e => {
                          const newCountries = e.target.checked
                            ? [...settings.shipping.allowedCountries, country.code]
                            : settings.shipping.allowedCountries.filter(c => c !== country.code);
                          updateSettings('shipping', 'allowedCountries', newCountries);
                        }}
                        className="sr-only"
                      />
                      {country.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderPaymentsSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payments.testMode}
            onChange={e => updateSettings('payments', 'testMode', e.target.checked)}
            className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
          />
          <span className="text-sm font-medium text-yellow-800">Testovací režim (sandbox)</span>
        </label>
        <p className="text-xs text-yellow-700 mt-1 ml-6">Žiadne skutočné platby nebudú spracované</p>
      </div>

      {/* Stripe */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-indigo-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <h3 className="font-medium text-indigo-900">Stripe</h3>
              <p className="text-xs text-indigo-700">Kartové platby</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payments.stripeEnabled}
              onChange={e => updateSettings('payments', 'stripeEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        {settings.payments.stripeEnabled && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verejný kľúč</label>
              <input
                type="text"
                value={settings.payments.stripePublicKey}
                onChange={e => updateSettings('payments', 'stripePublicKey', e.target.value)}
                placeholder="pk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tajný kľúč</label>
              <input
                type="password"
                value={settings.payments.stripeSecretKey}
                onChange={e => updateSettings('payments', 'stripeSecretKey', e.target.value)}
                placeholder="sk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* PayPal */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-blue-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🅿️</span>
            <div>
              <h3 className="font-medium text-blue-900">PayPal</h3>
              <p className="text-xs text-blue-700">PayPal platby</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payments.paypalEnabled}
              onChange={e => updateSettings('payments', 'paypalEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {settings.payments.paypalEnabled && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
              <input
                type="text"
                value={settings.payments.paypalClientId}
                onChange={e => updateSettings('payments', 'paypalClientId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret</label>
              <input
                type="password"
                value={settings.payments.paypalSecret}
                onChange={e => updateSettings('payments', 'paypalSecret', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* COD */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-green-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💵</span>
            <div>
              <h3 className="font-medium text-green-900">Dobierka</h3>
              <p className="text-xs text-green-700">Platba pri doručení</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payments.codEnabled}
              onChange={e => updateSettings('payments', 'codEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
        {settings.payments.codEnabled && (
          <div className="p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poplatok za dobierku (€)</label>
              <input
                type="number"
                step="0.01"
                value={settings.payments.codFee}
                onChange={e => updateSettings('payments', 'codFee', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bank Transfer */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏦</span>
            <div>
              <h3 className="font-medium text-gray-900">Bankový prevod</h3>
              <p className="text-xs text-gray-700">Platba prevodom na účet</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payments.bankTransferEnabled}
              onChange={e => updateSettings('payments', 'bankTransferEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
          </label>
        </div>
        {settings.payments.bankTransferEnabled && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Číslo účtu</label>
              <input
                type="text"
                value={settings.payments.bankAccount}
                onChange={e => updateSettings('payments', 'bankAccount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
              <input
                type="text"
                value={settings.payments.bankIban}
                onChange={e => updateSettings('payments', 'bankIban', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT/BIC</label>
              <input
                type="text"
                value={settings.payments.bankSwift}
                onChange={e => updateSettings('payments', 'bankSwift', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEmailsSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-4">SMTP nastavenia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
            <input
              type="text"
              value={settings.emails.smtpHost}
              onChange={e => updateSettings('emails', 'smtpHost', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
            <input
              type="number"
              value={settings.emails.smtpPort}
              onChange={e => updateSettings('emails', 'smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Používateľ</label>
            <input
              type="text"
              value={settings.emails.smtpUser}
              onChange={e => updateSettings('emails', 'smtpUser', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heslo</label>
            <input
              type="password"
              value={settings.emails.smtpPassword}
              onChange={e => updateSettings('emails', 'smtpPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Šifrovanie</label>
            <select
              value={settings.emails.smtpEncryption}
              onChange={e => updateSettings('emails', 'smtpEncryption', e.target.value as 'none' | 'ssl' | 'tls')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">Žiadne</option>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail odosielateľa</label>
          <input
            type="email"
            value={settings.emails.fromEmail}
            onChange={e => updateSettings('emails', 'fromEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meno odosielateľa</label>
          <input
            type="text"
            value={settings.emails.fromName}
            onChange={e => updateSettings('emails', 'fromName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin e-mail</label>
          <input
            type="email"
            value={settings.emails.adminEmail}
            onChange={e => updateSettings('emails', 'adminEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-3">E-mailové notifikácie</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emails.enableOrderConfirmation}
              onChange={e => updateSettings('emails', 'enableOrderConfirmation', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Potvrdenie objednávky</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emails.enableShippingNotification}
              onChange={e => updateSettings('emails', 'enableShippingNotification', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Notifikácia o odoslaní</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emails.enableReviewRequest}
                onChange={e => updateSettings('emails', 'enableReviewRequest', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Žiadosť o recenziu</span>
            </label>
            {settings.emails.enableReviewRequest && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">po</span>
                <input
                  type="number"
                  value={settings.emails.reviewRequestDelay}
                  onChange={e => updateSettings('emails', 'reviewRequestDelay', parseInt(e.target.value))}
                  min={1}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="text-sm text-gray-500">dňoch</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
        <span>📧</span>
        Odoslať testovací e-mail
      </button>
    </div>
  );

  const renderSeoSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta titulok</label>
          <input
            type="text"
            value={settings.seo.metaTitle}
            onChange={e => updateSettings('seo', 'metaTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">{settings.seo.metaTitle.length}/60 znakov</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta popis</label>
          <textarea
            value={settings.seo.metaDescription}
            onChange={e => updateSettings('seo', 'metaDescription', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">{settings.seo.metaDescription.length}/160 znakov</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: 'enableSitemap', label: 'Sitemap' },
          { key: 'enableRobots', label: 'Robots.txt' },
          { key: 'enableCanonical', label: 'Canonical URL' },
          { key: 'enableBreadcrumbs', label: 'Breadcrumbs' },
          { key: 'enableStructuredData', label: 'Structured Data' },
        ].map(item => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.seo[item.key as keyof typeof settings.seo] as boolean}
              onChange={e => updateSettings('seo', item.key as keyof typeof settings.seo, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>

      {settings.seo.enableSitemap && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frekvencia sitemapy</label>
          <select
            value={settings.seo.sitemapFrequency}
            onChange={e => updateSettings('seo', 'sitemapFrequency', e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="always">Vždy</option>
            <option value="hourly">Hodinovo</option>
            <option value="daily">Denne</option>
            <option value="weekly">Týždenne</option>
            <option value="monthly">Mesačne</option>
          </select>
        </div>
      )}

      {settings.seo.enableRobots && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Robots.txt</label>
          <textarea
            value={settings.seo.robotsContent}
            onChange={e => updateSettings('seo', 'robotsContent', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          />
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Analytické nástroje</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
            <input
              type="text"
              value={settings.seo.googleAnalyticsId}
              onChange={e => updateSettings('seo', 'googleAnalyticsId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GTM ID</label>
            <input
              type="text"
              value={settings.seo.googleTagManagerId}
              onChange={e => updateSettings('seo', 'googleTagManagerId', e.target.value)}
              placeholder="GTM-XXXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
            <input
              type="text"
              value={settings.seo.facebookPixelId}
              onChange={e => updateSettings('seo', 'facebookPixelId', e.target.value)}
              placeholder="1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Téma</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => updateSettings('appearance', 'themeId', theme.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                settings.appearance.themeId === theme.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-full h-12 rounded mb-2"
                style={{ backgroundColor: theme.preview }}
              />
              <p className="text-xs text-center text-gray-700 truncate">{theme.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-3">Farby</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'primaryColor', label: 'Primárna' },
            { key: 'secondaryColor', label: 'Sekundárna' },
            { key: 'accentColor', label: 'Accent' },
            { key: 'backgroundColor', label: 'Pozadie' },
            { key: 'textColor', label: 'Text' },
          ].map(item => (
            <div key={item.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.appearance[item.key as keyof typeof settings.appearance] as string}
                  onChange={e => updateSettings('appearance', item.key as keyof typeof settings.appearance, e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance[item.key as keyof typeof settings.appearance] as string}
                  onChange={e => updateSettings('appearance', item.key as keyof typeof settings.appearance, e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
          <select
            value={settings.appearance.fontFamily}
            onChange={e => updateSettings('appearance', 'fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Poppins">Poppins</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Playfair Display">Playfair Display</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Veľkosť písma (px)</label>
          <input
            type="number"
            value={settings.appearance.fontSize}
            onChange={e => updateSettings('appearance', 'fontSize', parseInt(e.target.value))}
            min={12}
            max={24}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zaoblenie rohov (px)</label>
          <input
            type="number"
            value={settings.appearance.borderRadius}
            onChange={e => updateSettings('appearance', 'borderRadius', parseInt(e.target.value))}
            min={0}
            max={32}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pozícia loga</label>
          <select
            value={settings.appearance.logoPosition}
            onChange={e => updateSettings('appearance', 'logoPosition', e.target.value as 'left' | 'center' | 'right')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="left">Vľavo</option>
            <option value="center">V strede</option>
            <option value="right">Vpravo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Štýl hlavičky</label>
          <select
            value={settings.appearance.headerStyle}
            onChange={e => updateSettings('appearance', 'headerStyle', e.target.value as 'simple' | 'mega' | 'sidebar')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="simple">Jednoduchá</option>
            <option value="mega">Mega menu</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stĺpce pätičky</label>
          <select
            value={settings.appearance.footerColumns}
            onChange={e => updateSettings('appearance', 'footerColumns', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={2}>2 stĺpce</option>
            <option value={3}>3 stĺpce</option>
            <option value={4}>4 stĺpce</option>
            <option value={5}>5 stĺpcov</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.appearance.enableDarkMode}
            onChange={e => updateSettings('appearance', 'enableDarkMode', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Povoliť tmavý režim</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.appearance.showSocialLinks}
            onChange={e => updateSettings('appearance', 'showSocialLinks', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Zobraziť sociálne siete</span>
        </label>
      </div>

      {settings.appearance.showSocialLinks && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Sociálne siete</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.appearance.socialLinks).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input
                  type="url"
                  value={value}
                  onChange={e => updateSettings('appearance', 'socialLinks', {
                    ...settings.appearance.socialLinks,
                    [key]: e.target.value,
                  })}
                  placeholder={`https://${key}.com/...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: 'enableCaching', label: 'Kešovanie' },
          { key: 'enableLazyLoad', label: 'Lazy loading' },
          { key: 'enableImageOptimization', label: 'Optimalizácia obrázkov' },
          { key: 'enableMinification', label: 'Minifikácia' },
          { key: 'enableCompression', label: 'Kompresia' },
        ].map(item => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.performance[item.key as keyof typeof settings.performance] as boolean}
              onChange={e => updateSettings('performance', item.key as keyof typeof settings.performance, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>

      {settings.performance.enableCaching && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Životnosť keše (sekundy)</label>
          <input
            type="number"
            value={settings.performance.cacheLifetime}
            onChange={e => updateSettings('performance', 'cacheLifetime', parseInt(e.target.value))}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {settings.performance.enableImageOptimization && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kvalita obrázkov (%)</label>
            <input
              type="number"
              value={settings.performance.imageQuality}
              onChange={e => updateSettings('performance', 'imageQuality', parseInt(e.target.value))}
              min={1}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max. šírka obrázka (px)</label>
            <input
              type="number"
              value={settings.performance.maxImageWidth}
              onChange={e => updateSettings('performance', 'maxImageWidth', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={settings.performance.enableCdn}
            onChange={e => updateSettings('performance', 'enableCdn', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Povoliť CDN</span>
        </label>
        {settings.performance.enableCdn && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CDN URL</label>
            <input
              type="url"
              value={settings.performance.cdnUrl}
              onChange={e => updateSettings('performance', 'cdnUrl', e.target.value)}
              placeholder="https://cdn.example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: 'enableSsl', label: 'SSL/HTTPS' },
          { key: 'enableCaptcha', label: 'CAPTCHA' },
          { key: 'enableRateLimit', label: 'Rate limiting' },
          { key: 'enableTwoFactor', label: 'Dvojfaktorové overenie' },
          { key: 'enableAuditLog', label: 'Audit log' },
        ].map(item => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security[item.key as keyof typeof settings.security] as boolean}
              onChange={e => updateSettings('security', item.key as keyof typeof settings.security, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{item.label}</span>
          </label>
        ))}
      </div>

      {settings.security.enableCaptcha && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">reCAPTCHA nastavenia</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Key</label>
              <input
                type="text"
                value={settings.security.captchaSiteKey}
                onChange={e => updateSettings('security', 'captchaSiteKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
              <input
                type="password"
                value={settings.security.captchaSecretKey}
                onChange={e => updateSettings('security', 'captchaSecretKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {settings.security.enableRateLimit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max. požiadaviek</label>
            <input
              type="number"
              value={settings.security.rateLimitRequests}
              onChange={e => updateSettings('security', 'rateLimitRequests', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Časové okno (sekundy)</label>
            <input
              type="number"
              value={settings.security.rateLimitWindow}
              onChange={e => updateSettings('security', 'rateLimitWindow', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timeout relácie (minúty)</label>
        <input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={e => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
          className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={settings.security.enableIpBlocking}
            onChange={e => updateSettings('security', 'enableIpBlocking', e.target.checked)}
            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
          />
          <span className="text-sm font-medium text-red-800">Blokovanie IP adries</span>
        </label>
        {settings.security.enableIpBlocking && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blokované IP (jedna na riadok)</label>
            <textarea
              value={settings.security.blockedIps.join('\n')}
              onChange={e => updateSettings('security', 'blockedIps', e.target.value.split('\n').filter(Boolean))}
              rows={4}
              placeholder="192.168.1.1&#10;10.0.0.0/8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'ecommerce': return renderEcommerceSettings();
      case 'marketplace': return renderMarketplaceSettings();
      case 'checkout': return renderCheckoutSettings();
      case 'shipping': return renderShippingSettings();
      case 'payments': return renderPaymentsSettings();
      case 'emails': return renderEmailsSettings();
      case 'seo': return renderSeoSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'performance': return renderPerformanceSettings();
      case 'security': return renderSecuritySettings();
      default: return null;
    }
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-gray-500 hover:text-gray-700">
                ← Späť
              </a>
              <h1 className="text-xl font-bold text-gray-900">Nastavenia</h1>
              {hasChanges && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Neuložené zmeny
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Obnoviť predvolené
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  hasChanges
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Ukladám...
                  </>
                ) : (
                  'Uložiť zmeny'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Nastavenia boli uložené
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
