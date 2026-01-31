'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================

type CheckoutStep = 'delivery' | 'payment' | 'review';

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  company?: string;
  ico?: string;
  dic?: string;
  icDph?: string;
}

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: 'truck' | 'store' | 'box' | 'express';
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: 'card' | 'bank' | 'cod' | 'paypal' | 'gpay' | 'applepay';
  fee?: number;
}

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  vendorName: string;
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  paymentFee: number;
  discount: number;
  total: number;
  itemCount: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockCartItems: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'apple-iphone-15-pro-max-256gb',
    price: 1299.00,
    quantity: 1,
    vendorName: 'iStyle Slovakia',
  },
  {
    id: 'cart-2',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    price: 1199.00,
    quantity: 1,
    vendorName: 'Alza.sk',
  },
  {
    id: 'cart-3',
    name: 'Apple AirPods Pro 2nd Generation',
    slug: 'apple-airpods-pro-2',
    price: 279.00,
    quantity: 2,
    vendorName: 'iStyle Slovakia',
  },
];

const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'courier',
    name: 'Kuriér na adresu',
    description: 'Doručenie priamo k vám domov alebo do práce',
    price: 4.99,
    estimatedDays: '2-3 pracovné dni',
    icon: 'truck',
  },
  {
    id: 'packeta',
    name: 'Packeta Z-BOX',
    description: 'Vyzdvihnutie v najbližšom Z-BOXe',
    price: 2.99,
    estimatedDays: '2-3 pracovné dni',
    icon: 'box',
  },
  {
    id: 'pickup',
    name: 'Osobný odber',
    description: 'Vyzdvihnite si tovar na predajni',
    price: 0,
    estimatedDays: '1-2 pracovné dni',
    icon: 'store',
  },
  {
    id: 'express',
    name: 'Expresné doručenie',
    description: 'Doručenie do 24 hodín',
    price: 9.99,
    estimatedDays: 'Do 24 hodín',
    icon: 'express',
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Platobná karta',
    description: 'Visa, Mastercard, Maestro',
    icon: 'card',
  },
  {
    id: 'bank',
    name: 'Bankový prevod',
    description: 'Platba vopred na účet',
    icon: 'bank',
  },
  {
    id: 'cod',
    name: 'Dobierka',
    description: 'Platba pri prevzatí',
    icon: 'cod',
    fee: 1.50,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Bezpečná platba cez PayPal',
    icon: 'paypal',
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    description: 'Rýchla platba cez Google Pay',
    icon: 'gpay',
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    description: 'Rýchla platba cez Apple Pay',
    icon: 'applepay',
  },
];

const countries = [
  { code: 'SK', name: 'Slovensko' },
  { code: 'CZ', name: 'Česko' },
  { code: 'HU', name: 'Maďarsko' },
  { code: 'PL', name: 'Poľsko' },
  { code: 'AT', name: 'Rakúsko' },
];

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  truck: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  store: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  box: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  express: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  card: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  bank: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  cod: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  paypal: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19a1.87 1.87 0 0 0-1.852 1.588l-1.12 7.106-.001.009a.97.97 0 0 0 .955 1.123h4.036a1.57 1.57 0 0 0 1.555-1.334l.058-.323.906-5.75.06-.32a1.57 1.57 0 0 1 1.553-1.333h.979c3.478 0 6.198-1.415 6.994-5.505.302-1.553.185-2.859-.727-3.756z"/>
    </svg>
  ),
  gpay: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
    </svg>
  ),
  applepay: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.72 7.56c-.33-.43-.84-.77-1.46-.93-.68-.18-1.37-.18-2.05-.04-.46.1-.89.27-1.27.5l-.18.1-.18-.1c-.38-.23-.81-.4-1.27-.5-.68-.14-1.37-.14-2.05.04-.62.16-1.13.5-1.46.93-.69.9-.85 2.04-.49 3.44.36 1.4 1.06 2.86 2.06 4.06 1 1.2 2.11 2.1 3.21 2.44.27.08.54.14.81.16h.16c.27-.02.54-.08.81-.16 1.1-.34 2.21-1.24 3.21-2.44 1-1.2 1.7-2.66 2.06-4.06.36-1.4.2-2.54-.49-3.44zm-5.72-4.56c1.28 0 2.39-.77 2.99-1.82.14-.25.26-.51.35-.79-1.18.07-2.31.7-2.99 1.71-.65.94-.87 2.04-.87 2.9h.1c.14 0 .28-.01.42 0z"/>
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  lock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatPrice(price: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

function calculateSummary(items: CartItem[], shippingPrice: number, paymentFee: number): OrderSummary {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = 0; // Can be applied from cart
  const total = subtotal + shippingPrice + paymentFee - discount;

  return {
    subtotal,
    shipping: shippingPrice,
    paymentFee,
    discount,
    total,
    itemCount,
  };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Step Indicator
function StepIndicator({ currentStep }: { currentStep: CheckoutStep }) {
  const steps = [
    { id: 'delivery', label: 'Doručenie', number: 1 },
    { id: 'payment', label: 'Platba', number: 2 },
    { id: 'review', label: 'Zhrnutie', number: 3 },
  ];

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${index < currentIndex 
                ? 'bg-green-600 text-white' 
                : index === currentIndex 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }
            `}>
              {index < currentIndex ? Icons.check : step.number}
            </div>
            <span className={`text-sm ${index === currentIndex ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 ${index < currentIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Address Form
function AddressForm({
  address,
  onChange,
  errors,
  showCompany,
  onToggleCompany,
}: {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  errors: Partial<Record<keyof Address, string>>;
  showCompany: boolean;
  onToggleCompany: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meno <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ján"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priezvisko <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Novák"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={address.email}
            onChange={(e) => onChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="jan.novak@email.sk"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefón <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={address.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="+421 900 123 456"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ulica a číslo domu <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={address.street}
          onChange={(e) => onChange('street', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Hlavná 123"
        />
        {errors.street && <p className="mt-1 text-sm text-red-500">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PSČ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="811 01"
          />
          {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mesto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Bratislava"
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Krajina <span className="text-red-500">*</span>
        </label>
        <select
          value={address.country}
          onChange={(e) => onChange('country', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Company Info Toggle */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onToggleCompany}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showCompany ? '− Skryť firemné údaje' : '+ Nakupujem na firmu'}
        </button>

        {showCompany && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Názov firmy
              </label>
              <input
                type="text"
                value={address.company || ''}
                onChange={(e) => onChange('company', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Firma s.r.o."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IČO
                </label>
                <input
                  type="text"
                  value={address.ico || ''}
                  onChange={(e) => onChange('ico', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DIČ
                </label>
                <input
                  type="text"
                  value={address.dic || ''}
                  onChange={(e) => onChange('dic', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2020123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IČ DPH
                </label>
                <input
                  type="text"
                  value={address.icDph || ''}
                  onChange={(e) => onChange('icDph', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="SK2020123456"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Delivery Method Selector
function DeliveryMethodSelector({
  methods,
  selectedId,
  onSelect,
}: {
  methods: DeliveryMethod[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const iconMap = {
    truck: Icons.truck,
    store: Icons.store,
    box: Icons.box,
    express: Icons.express,
  };

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`
            flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all
            ${selectedId === method.id
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <input
            type="radio"
            name="delivery"
            value={method.id}
            checked={selectedId === method.id}
            onChange={() => onSelect(method.id)}
            className="sr-only"
          />
          <div className={`text-gray-600 ${selectedId === method.id ? 'text-blue-600' : ''}`}>
            {iconMap[method.icon]}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{method.name}</div>
            <div className="text-sm text-gray-500">{method.description}</div>
            <div className="text-sm text-gray-500">{method.estimatedDays}</div>
          </div>
          <div className="text-right">
            <div className={`font-medium ${method.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {method.price === 0 ? 'Zadarmo' : formatPrice(method.price)}
            </div>
          </div>
          {selectedId === method.id && (
            <div className="text-blue-600">{Icons.check}</div>
          )}
        </label>
      ))}
    </div>
  );
}

// Payment Method Selector
function PaymentMethodSelector({
  methods,
  selectedId,
  onSelect,
}: {
  methods: PaymentMethod[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const iconMap = {
    card: Icons.card,
    bank: Icons.bank,
    cod: Icons.cod,
    paypal: Icons.paypal,
    gpay: Icons.gpay,
    applepay: Icons.applepay,
  };

  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <label
          key={method.id}
          className={`
            flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all
            ${selectedId === method.id
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <input
            type="radio"
            name="payment"
            value={method.id}
            checked={selectedId === method.id}
            onChange={() => onSelect(method.id)}
            className="sr-only"
          />
          <div className={`text-gray-600 ${selectedId === method.id ? 'text-blue-600' : ''}`}>
            {iconMap[method.icon]}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900">{method.name}</div>
            <div className="text-sm text-gray-500">{method.description}</div>
          </div>
          {method.fee && (
            <div className="text-sm text-gray-500">
              +{formatPrice(method.fee)}
            </div>
          )}
          {selectedId === method.id && (
            <div className="text-blue-600">{Icons.check}</div>
          )}
        </label>
      ))}
    </div>
  );
}

// Order Summary Sidebar
function OrderSummarySidebar({
  items,
  summary,
  deliveryMethod,
  paymentMethod,
}: {
  items: CartItem[];
  summary: OrderSummary;
  deliveryMethod?: DeliveryMethod;
  paymentMethod?: PaymentMethod;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Vaša objednávka
      </h2>

      {/* Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {item.name}
              </p>
              <p className="text-sm text-gray-500">
                {item.quantity}× {formatPrice(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Medzisúčet</span>
          <span className="text-gray-900">{formatPrice(summary.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Doprava {deliveryMethod && `(${deliveryMethod.name})`}
          </span>
          <span className={summary.shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
            {summary.shipping === 0 ? 'Zadarmo' : formatPrice(summary.shipping)}
          </span>
        </div>
        {summary.paymentFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Poplatok za platbu</span>
            <span className="text-gray-900">{formatPrice(summary.paymentFee)}</span>
          </div>
        )}
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Zľava</span>
            <span className="text-green-600">-{formatPrice(summary.discount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-gray-900">Celkom</span>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">{formatPrice(summary.total)}</div>
            <div className="text-xs text-gray-500">vrátane DPH</div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-600">{Icons.shield}</span>
          <span>Bezpečná platba</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-blue-600">{Icons.lock}</span>
          <span>SSL šifrovanie</span>
        </div>
      </div>
    </div>
  );
}

// Review Section
function ReviewSection({
  address,
  deliveryMethod,
  paymentMethod,
  note,
  onNoteChange,
  onEditAddress,
  onEditDelivery,
  onEditPayment,
}: {
  address: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  note: string;
  onNoteChange: (note: string) => void;
  onEditAddress: () => void;
  onEditDelivery: () => void;
  onEditPayment: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Delivery Address */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Doručovacia adresa</h3>
          <button onClick={onEditAddress} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            {Icons.edit} Upraviť
          </button>
        </div>
        <div className="text-gray-600">
          <p className="font-medium text-gray-900">{address.firstName} {address.lastName}</p>
          {address.company && <p>{address.company}</p>}
          <p>{address.street}</p>
          <p>{address.postalCode} {address.city}</p>
          <p>{countries.find(c => c.code === address.country)?.name}</p>
          <p className="mt-2">{address.email}</p>
          <p>{address.phone}</p>
        </div>
      </div>

      {/* Delivery Method */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Spôsob doručenia</h3>
          <button onClick={onEditDelivery} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            {Icons.edit} Upraviť
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-blue-600">
            {Icons[deliveryMethod.icon as keyof typeof Icons]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{deliveryMethod.name}</p>
            <p className="text-sm text-gray-500">{deliveryMethod.estimatedDays}</p>
          </div>
          <div className="ml-auto font-medium">
            {deliveryMethod.price === 0 ? 'Zadarmo' : formatPrice(deliveryMethod.price)}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Spôsob platby</h3>
          <button onClick={onEditPayment} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            {Icons.edit} Upraviť
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-blue-600">
            {Icons[paymentMethod.icon as keyof typeof Icons]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{paymentMethod.name}</p>
            <p className="text-sm text-gray-500">{paymentMethod.description}</p>
          </div>
          {paymentMethod.fee && (
            <div className="ml-auto text-sm text-gray-500">
              +{formatPrice(paymentMethod.fee)}
            </div>
          )}
        </div>
      </div>

      {/* Note */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Poznámka k objednávke</h3>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Voliteľná poznámka pre kuriéra alebo predajcu..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* Terms */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <span className="text-sm text-gray-600">
            Súhlasím s{' '}
            <Link href="/obchodne-podmienky" className="text-blue-600 hover:underline">
              obchodnými podmienkami
            </Link>{' '}
            a{' '}
            <Link href="/ochrana-osobnych-udajov" className="text-blue-600 hover:underline">
              zásadami ochrany osobných údajov
            </Link>
            .
          </span>
        </label>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'SK',
  });
  const [showCompany, setShowCompany] = useState(false);
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const [selectedDelivery, setSelectedDelivery] = useState(deliveryMethods[0].id);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [orderNote, setOrderNote] = useState('');

  // Get selected methods
  const deliveryMethod = deliveryMethods.find(m => m.id === selectedDelivery)!;
  const paymentMethod = paymentMethods.find(m => m.id === selectedPayment)!;

  // Calculate summary
  const summary = calculateSummary(
    mockCartItems,
    deliveryMethod.price,
    paymentMethod.fee || 0
  );

  // Validate address
  const validateAddress = (): boolean => {
    const errors: Partial<Record<keyof Address, string>> = {};

    if (!address.firstName.trim()) errors.firstName = 'Zadajte meno';
    if (!address.lastName.trim()) errors.lastName = 'Zadajte priezvisko';
    if (!address.email.trim()) errors.email = 'Zadajte e-mail';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errors.email = 'Neplatný e-mail';
    if (!address.phone.trim()) errors.phone = 'Zadajte telefón';
    if (!address.street.trim()) errors.street = 'Zadajte ulicu';
    if (!address.city.trim()) errors.city = 'Zadajte mesto';
    if (!address.postalCode.trim()) errors.postalCode = 'Zadajte PSČ';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle address change
  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (addressErrors[field]) {
      setAddressErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Navigation
  const goToStep = (step: CheckoutStep) => {
    if (step === 'payment' && !validateAddress()) return;
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (currentStep === 'payment') setCurrentStep('delivery');
    else if (currentStep === 'review') setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Order
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Redirect to success page
    router.push('/objednavka/dakujeme?order=ORD-' + Date.now());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ESHOPY
            </Link>
            <Link href="/kosik" className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
              {Icons.arrowLeft} Späť do košíka
            </Link>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            {/* Delivery Step */}
            {currentStep === 'delivery' && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Doručovacia adresa
                  </h2>
                  <AddressForm
                    address={address}
                    onChange={handleAddressChange}
                    errors={addressErrors}
                    showCompany={showCompany}
                    onToggleCompany={() => setShowCompany(!showCompany)}
                  />
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Spôsob doručenia
                  </h2>
                  <DeliveryMethodSelector
                    methods={deliveryMethods}
                    selectedId={selectedDelivery}
                    onSelect={setSelectedDelivery}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => goToStep('payment')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    Pokračovať k platbe
                    {Icons.arrowRight}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Spôsob platby
                  </h2>
                  <PaymentMethodSelector
                    methods={paymentMethods}
                    selectedId={selectedPayment}
                    onSelect={setSelectedPayment}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={goBack}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  >
                    {Icons.arrowLeft}
                    Späť
                  </button>
                  <button
                    onClick={() => goToStep('review')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    Pokračovať k zhrnutiu
                    {Icons.arrowRight}
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                <ReviewSection
                  address={address}
                  deliveryMethod={deliveryMethod}
                  paymentMethod={paymentMethod}
                  note={orderNote}
                  onNoteChange={setOrderNote}
                  onEditAddress={() => setCurrentStep('delivery')}
                  onEditDelivery={() => setCurrentStep('delivery')}
                  onEditPayment={() => setCurrentStep('payment')}
                />

                <div className="flex justify-between">
                  <button
                    onClick={goBack}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  >
                    {Icons.arrowLeft}
                    Späť
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Spracúvam...
                      </>
                    ) : (
                      <>
                        Objednať s povinnosťou platby
                        {Icons.lock}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummarySidebar
              items={mockCartItems}
              summary={summary}
              deliveryMethod={deliveryMethod}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
