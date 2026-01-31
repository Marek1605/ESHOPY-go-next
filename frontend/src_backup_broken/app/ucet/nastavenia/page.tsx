'use client';

import { useState } from 'react';
import Link from 'next/link';

// Types
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  avatar?: string;
}

interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  priceAlerts: boolean;
  newsletter: boolean;
  sms: boolean;
  pushNotifications: boolean;
}

interface PrivacySettings {
  showProfile: boolean;
  showOrders: boolean;
  allowAnalytics: boolean;
  allowPersonalization: boolean;
}

// Mock user data
const mockUser = {
  name: 'Ján Novák',
  email: 'jan.novak@email.sk',
};

const mockProfile: UserProfile = {
  firstName: 'Ján',
  lastName: 'Novák',
  email: 'jan.novak@email.sk',
  phone: '+421 900 123 456',
  birthDate: '1990-05-15',
  gender: 'male',
};

const mockNotifications: NotificationSettings = {
  orderUpdates: true,
  promotions: true,
  priceAlerts: true,
  newsletter: false,
  sms: false,
  pushNotifications: true,
};

const mockPrivacy: PrivacySettings = {
  showProfile: false,
  showOrders: false,
  allowAnalytics: true,
  allowPersonalization: true,
};

// Account Sidebar Component
function AccountSidebar({ activePage }: { activePage: string }) {
  const menuItems = [
    { id: 'dashboard', label: 'Prehľad', href: '/ucet', icon: 'dashboard' },
    { id: 'orders', label: 'Objednávky', href: '/ucet/objednavky', icon: 'orders', badge: 3 },
    { id: 'wishlist', label: 'Wishlist', href: '/ucet/wishlist', icon: 'heart', badge: 5 },
    { id: 'addresses', label: 'Adresy', href: '/ucet/adresy', icon: 'location' },
    { id: 'settings', label: 'Nastavenia', href: '/ucet/nastavenia', icon: 'settings' },
  ];

  const icons: Record<string, JSX.Element> = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    orders: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    heart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    location: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          {mockUser.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{mockUser.name}</h3>
          <p className="text-sm text-gray-500">{mockUser.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              activePage === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {icons[item.icon]}
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                activePage === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Odhlásiť sa</span>
        </button>
      </div>
    </aside>
  );
}

// Toggle Switch Component
function Toggle({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between py-4">
      <div className="flex-1 pr-4">
        <label className="font-medium text-gray-900 block">{label}</label>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

// Settings Tabs
type SettingsTab = 'profile' | 'password' | 'notifications' | 'privacy' | 'delete';

// Main Page Component
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotifications);
  const [privacy, setPrivacy] = useState<PrivacySettings>(mockPrivacy);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete account state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profil', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'password' as SettingsTab, label: 'Heslo', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
    { id: 'notifications' as SettingsTab, label: 'Notifikácie', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
    { id: 'privacy' as SettingsTab, label: 'Súkromie', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { id: 'delete' as SettingsTab, label: 'Zmazať účet', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )},
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSavedMessage('Profil bol úspešne uložený');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleChangePassword = async () => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Zadajte aktuálne heslo';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'Zadajte nové heslo';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Heslo musí mať aspoň 8 znakov';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Heslá sa nezhodujú';
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSaving(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSavedMessage('Heslo bolo úspešne zmenené');
      setTimeout(() => setSavedMessage(null), 3000);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setSavedMessage('Nastavenia notifikácií boli uložené');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setSavedMessage('Nastavenia súkromia boli uložené');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText === 'ZMAZAŤ') {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, would delete account and redirect
      console.log('Account deleted');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              ESHOPY
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/kategorie" className="text-gray-600 hover:text-gray-900">
                Kategórie
              </Link>
              <Link href="/akcie" className="text-gray-600 hover:text-gray-900">
                Akcie
              </Link>
              <Link href="/novinky" className="text-gray-600 hover:text-gray-900">
                Novinky
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/kosik" className="relative p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link href="/ucet" className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Domov
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/ucet" className="text-gray-500 hover:text-gray-700">
              Môj účet
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Nastavenia</span>
          </nav>
        </div>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {savedMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <AccountSidebar activePage="settings" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Nastavenia účtu</h1>
              <p className="text-gray-500">
                Spravujte svoj profil, heslo a preferencie
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } ${tab.id === 'delete' ? 'text-red-500 hover:text-red-600' : ''}`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </div>
                      <div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                          Zmeniť fotku
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG alebo GIF. Max 2MB.
                        </p>
                      </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meno
                        </label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priezvisko
                        </label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefón
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Birth Date and Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dátum narodenia
                        </label>
                        <input
                          type="date"
                          value={profile.birthDate || ''}
                          onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pohlavie
                        </label>
                        <select
                          value={profile.gender || ''}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value as UserProfile['gender'] })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Nešpecifikované</option>
                          <option value="male">Muž</option>
                          <option value="female">Žena</option>
                          <option value="other">Iné</option>
                          <option value="prefer_not_to_say">Nechcem uviesť</option>
                        </select>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Ukladám...
                          </>
                        ) : (
                          'Uložiť zmeny'
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                  <div className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aktuálne heslo
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                            passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nové heslo
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 ${
                            passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Minimálne 8 znakov
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Potvrdiť nové heslo
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleChangePassword}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mením heslo...
                          </>
                        ) : (
                          'Zmeniť heslo'
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-0 divide-y divide-gray-200">
                    <Toggle
                      enabled={notifications.orderUpdates}
                      onChange={(v) => setNotifications({ ...notifications, orderUpdates: v })}
                      label="Aktualizácie objednávok"
                      description="Informácie o stave vašej objednávky"
                    />
                    <Toggle
                      enabled={notifications.priceAlerts}
                      onChange={(v) => setNotifications({ ...notifications, priceAlerts: v })}
                      label="Upozornenia na ceny"
                      description="Keď sa zmení cena produktu vo vašom wishlist"
                    />
                    <Toggle
                      enabled={notifications.promotions}
                      onChange={(v) => setNotifications({ ...notifications, promotions: v })}
                      label="Akcie a zľavy"
                      description="Informácie o špeciálnych ponukách"
                    />
                    <Toggle
                      enabled={notifications.newsletter}
                      onChange={(v) => setNotifications({ ...notifications, newsletter: v })}
                      label="Newsletter"
                      description="Týždenný prehľad noviniek a tipov"
                    />
                    <Toggle
                      enabled={notifications.sms}
                      onChange={(v) => setNotifications({ ...notifications, sms: v })}
                      label="SMS notifikácie"
                      description="Dôležité upozornenia cez SMS"
                    />
                    <Toggle
                      enabled={notifications.pushNotifications}
                      onChange={(v) => setNotifications({ ...notifications, pushNotifications: v })}
                      label="Push notifikácie"
                      description="Notifikácie v prehliadači"
                    />

                    <div className="pt-6">
                      <button
                        onClick={handleSaveNotifications}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Uložiť nastavenia
                      </button>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div className="space-y-0 divide-y divide-gray-200">
                    <Toggle
                      enabled={privacy.showProfile}
                      onChange={(v) => setPrivacy({ ...privacy, showProfile: v })}
                      label="Verejný profil"
                      description="Povoliť ostatným vidieť váš profil"
                    />
                    <Toggle
                      enabled={privacy.showOrders}
                      onChange={(v) => setPrivacy({ ...privacy, showOrders: v })}
                      label="Verejné recenzie"
                      description="Zobraziť vaše meno pri recenziách"
                    />
                    <Toggle
                      enabled={privacy.allowAnalytics}
                      onChange={(v) => setPrivacy({ ...privacy, allowAnalytics: v })}
                      label="Analytické cookies"
                      description="Pomôžte nám zlepšovať služby"
                    />
                    <Toggle
                      enabled={privacy.allowPersonalization}
                      onChange={(v) => setPrivacy({ ...privacy, allowPersonalization: v })}
                      label="Personalizácia"
                      description="Odporúčania na základe vašich preferencií"
                    />

                    <div className="pt-6">
                      <button
                        onClick={handleSavePrivacy}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Uložiť nastavenia
                      </button>
                    </div>

                    {/* Data Export */}
                    <div className="pt-6">
                      <h3 className="font-medium text-gray-900 mb-2">Vaše údaje</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Stiahnite si kópiu všetkých vašich údajov v čitateľnom formáte.
                      </p>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        Exportovať údaje
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Account Tab */}
                {activeTab === 'delete' && (
                  <div className="max-w-lg">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-red-800 mb-1">Upozornenie</h3>
                          <p className="text-sm text-red-700">
                            Zmazanie účtu je nevratná akcia. Stratíte prístup ku všetkým objednávkam,
                            wishlistom a uloženým údajom.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-medium text-gray-900 mb-2">
                      Čo sa stane po zmazaní účtu:
                    </h3>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Stratíte prístup k histórii objednávok
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Všetky uložené adresy budú zmazané
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Wishlist bude natrvalo odstránený
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Nebudete môcť obnoviť účet
                      </li>
                    </ul>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Chcem zmazať účet
                      </button>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-3">
                          Pre potvrdenie napíšte <strong>ZMAZAŤ</strong>:
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                          placeholder="ZMAZAŤ"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteConfirmText('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Zrušiť
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmText !== 'ZMAZAŤ' || isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Natrvalo zmazať účet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2026 ESHOPY. Všetky práva vyhradené.
          </div>
        </div>
      </footer>
    </div>
  );
}
