'use client';

import { useState } from 'react';
import Link from 'next/link';

// Types
interface Address {
  id: string;
  type: 'billing' | 'shipping';
  isDefault: boolean;
  name: string;
  company?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  note?: string;
}

// Mock user
const mockUser = {
  name: 'Ján Novák',
  email: 'jan.novak@email.sk',
};

// Mock addresses
const mockAddresses: Address[] = [
  {
    id: 'addr1',
    type: 'shipping',
    isDefault: true,
    name: 'Ján Novák',
    street: 'Hlavná 123',
    city: 'Bratislava',
    postalCode: '811 01',
    country: 'Slovensko',
    phone: '+421 900 123 456',
    note: 'Zvoniť 2x',
  },
  {
    id: 'addr2',
    type: 'billing',
    isDefault: true,
    name: 'Ján Novák',
    company: 'Novák s.r.o.',
    street: 'Obchodná 45',
    city: 'Bratislava',
    postalCode: '811 06',
    country: 'Slovensko',
    phone: '+421 900 123 456',
  },
  {
    id: 'addr3',
    type: 'shipping',
    isDefault: false,
    name: 'Ján Novák',
    street: 'Tatranská 78',
    city: 'Poprad',
    postalCode: '058 01',
    country: 'Slovensko',
    phone: '+421 900 123 456',
    note: 'Chata - víkendy',
  },
];

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

// Address Form Modal
function AddressFormModal({
  address,
  onClose,
  onSave,
}: {
  address: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}) {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: address?.type || 'shipping',
    isDefault: address?.isDefault || false,
    name: address?.name || '',
    company: address?.company || '',
    street: address?.street || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'Slovensko',
    phone: address?.phone || '',
    note: address?.note || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Meno je povinné';
    if (!formData.street.trim()) newErrors.street = 'Ulica je povinná';
    if (!formData.city.trim()) newErrors.city = 'Mesto je povinné';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'PSČ je povinné';
    if (!formData.phone.trim()) newErrors.phone = 'Telefón je povinný';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        id: address?.id || `addr_${Date.now()}`,
        ...formData,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {address ? 'Upraviť adresu' : 'Nová adresa'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ adresy
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="shipping"
                      checked={formData.type === 'shipping'}
                      onChange={() => setFormData({ ...formData, type: 'shipping' })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Doručovacia</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="billing"
                      checked={formData.type === 'billing'}
                      onChange={() => setFormData({ ...formData, type: 'billing' })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Fakturačná</span>
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meno a priezvisko <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ján Novák"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spoločnosť
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Novák s.r.o."
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ulica a číslo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Hlavná 123"
                />
                {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Bratislava"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PSČ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="811 01"
                  />
                  {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>}
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Krajina
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Slovensko">Slovensko</option>
                  <option value="Česko">Česko</option>
                  <option value="Maďarsko">Maďarsko</option>
                  <option value="Poľsko">Poľsko</option>
                  <option value="Rakúsko">Rakúsko</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefón <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+421 900 123 456"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poznámka pre kuriéra
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Zvoniť 2x, vedľajší vchod..."
                />
              </div>

              {/* Default */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Nastaviť ako predvolenú {formData.type === 'shipping' ? 'doručovaciu' : 'fakturačnú'} adresu
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zrušiť
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {address ? 'Uložiť zmeny' : 'Pridať adresu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Address Card Component
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  return (
    <div className={`bg-white rounded-xl border-2 transition-all ${
      address.isDefault ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              address.type === 'shipping'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {address.type === 'shipping' ? 'Doručovacia' : 'Fakturačná'}
            </span>
            {address.isDefault && (
              <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                Predvolená
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(address)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Upraviť"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(address.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Odstrániť"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-1.5">
          <p className="font-semibold text-gray-900">{address.name}</p>
          {address.company && (
            <p className="text-sm text-gray-600">{address.company}</p>
          )}
          <p className="text-sm text-gray-600">{address.street}</p>
          <p className="text-sm text-gray-600">
            {address.postalCode} {address.city}
          </p>
          <p className="text-sm text-gray-600">{address.country}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {address.phone}
          </p>
          {address.note && (
            <p className="text-sm text-gray-500 italic mt-2 flex items-start gap-1.5">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {address.note}
            </p>
          )}
        </div>

        {/* Set Default Button */}
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="mt-4 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
          >
            Nastaviť ako predvolenú
          </button>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyAddresses({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Zatiaľ nemáte žiadne adresy
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Pridajte si doručovacie a fakturačné adresy pre rýchlejšie objednávanie.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Pridať adresu
      </button>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onCancel} />
        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Odstrániť adresu?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Táto akcia je nevratná. Adresa bude natrvalo odstránená.
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zrušiť
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Odstrániť
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'shipping' | 'billing'>('all');

  const filteredAddresses = addresses.filter(addr => {
    if (filter === 'all') return true;
    return addr.type === filter;
  });

  const shippingAddresses = addresses.filter(a => a.type === 'shipping');
  const billingAddresses = addresses.filter(a => a.type === 'billing');

  const handleSave = (address: Address) => {
    if (editingAddress) {
      // Update existing
      setAddresses(addresses.map(a => {
        if (a.id === address.id) return address;
        // If this becomes default, remove default from others of same type
        if (address.isDefault && a.type === address.type && a.id !== address.id) {
          return { ...a, isDefault: false };
        }
        return a;
      }));
    } else {
      // Add new
      let newAddresses = [...addresses];
      if (address.isDefault) {
        newAddresses = newAddresses.map(a => 
          a.type === address.type ? { ...a, isDefault: false } : a
        );
      }
      newAddresses.push(address);
      setAddresses(newAddresses);
    }
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setAddresses(addresses.filter(a => a.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleSetDefault = (id: string) => {
    const address = addresses.find(a => a.id === id);
    if (address) {
      setAddresses(addresses.map(a => {
        if (a.id === id) return { ...a, isDefault: true };
        if (a.type === address.type) return { ...a, isDefault: false };
        return a;
      }));
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
            <span className="text-gray-900 font-medium">Adresy</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <AccountSidebar activePage="addresses" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Moje adresy</h1>
                <p className="text-gray-500">
                  Spravujte doručovacie a fakturačné adresy
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Pridať adresu
              </button>
            </div>

            {addresses.length === 0 ? (
              <EmptyAddresses onAdd={() => setShowForm(true)} />
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{addresses.length}</div>
                    <div className="text-sm text-gray-500">Celkom adries</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{shippingAddresses.length}</div>
                    <div className="text-sm text-gray-500">Doručovacích</div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{billingAddresses.length}</div>
                    <div className="text-sm text-gray-500">Fakturačných</div>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6 inline-flex">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      filter === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Všetky ({addresses.length})
                  </button>
                  <button
                    onClick={() => setFilter('shipping')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      filter === 'shipping'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Doručovacie ({shippingAddresses.length})
                  </button>
                  <button
                    onClick={() => setFilter('billing')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      filter === 'billing'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Fakturačné ({billingAddresses.length})
                  </button>
                </div>

                {/* Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAddresses.map(address => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onSetDefault={handleSetDefault}
                    />
                  ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Tip pre rýchlejšie objednávanie
                      </h3>
                      <p className="text-sm text-blue-700">
                        Nastavte si predvolenú doručovaciu a fakturačnú adresu. Pri objednávke sa automaticky vyplnia
                        a ušetríte čas.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
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

      {/* Address Form Modal */}
      {showForm && (
        <AddressFormModal
          address={editingAddress}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
