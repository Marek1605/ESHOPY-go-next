'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================

interface OrderDetails {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping: {
    name: string;
    price: number;
  };
  payment: {
    name: string;
    status: 'paid' | 'pending' | 'awaiting';
  };
  address: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    email: string;
    phone: string;
  };
  total: number;
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  checkCircle: (
    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  truck: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
  mail: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  printer: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  copy: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('sk-SK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============================================================================
// MOCK DATA
// ============================================================================

function getMockOrder(orderId: string): OrderDetails {
  return {
    orderId,
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium', quantity: 1, price: 1299.00 },
      { name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black', quantity: 1, price: 1199.00 },
      { name: 'Apple AirPods Pro 2nd Generation', quantity: 2, price: 279.00 },
    ],
    shipping: {
      name: 'Kuriér na adresu',
      price: 4.99,
    },
    payment: {
      name: 'Platobná karta',
      status: 'paid',
    },
    address: {
      name: 'Ján Novák',
      street: 'Hlavná 123',
      city: 'Bratislava',
      postalCode: '811 01',
      country: 'Slovensko',
      email: 'jan.novak@email.sk',
      phone: '+421 900 123 456',
    },
    total: 3060.99,
  };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function OrderTimeline() {
  const steps = [
    { id: 1, label: 'Objednávka prijatá', completed: true, current: true },
    { id: 2, label: 'Spracovanie', completed: false, current: false },
    { id: 3, label: 'Odoslané', completed: false, current: false },
    { id: 4, label: 'Doručené', completed: false, current: false },
  ];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center
              ${step.completed ? 'bg-green-600 text-white' : step.current ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}
            `}>
              {step.completed ? Icons.check : step.id}
            </div>
            <span className={`mt-2 text-xs sm:text-sm ${step.current ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || 'ORD-' + Date.now();
  const [order] = useState<OrderDetails>(() => getMockOrder(orderId));
  const [copied, setCopied] = useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ESHOPY
          </Link>
        </div>
      </div>

      {/* Success Message */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="text-green-500 flex justify-center mb-4">
            {Icons.checkCircle}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ďakujeme za vašu objednávku!
          </h1>
          <p className="text-lg text-gray-600">
            Vaša objednávka bola úspešne prijatá a spracovaná.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 text-center">
          <p className="text-sm text-blue-600 mb-1">Číslo objednávky</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-blue-900">{order.orderId}</span>
            <button
              onClick={handleCopyOrderId}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
              title="Kopírovať"
            >
              {copied ? Icons.check : Icons.copy}
            </button>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            Potvrdenie sme odoslali na <strong>{order.address.email}</strong>
          </p>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Stav objednávky</h2>
          <OrderTimeline />
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-blue-600">{Icons.truck}</div>
              <div>
                <p className="text-sm text-gray-600">Predpokladané doručenie</p>
                <p className="font-medium text-gray-900">{formatDate(order.estimatedDelivery)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Položky objednávky</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity}× {formatPrice(item.price)}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Doprava ({order.shipping.name})</span>
                <span className="text-gray-900">{formatPrice(order.shipping.price)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">Celkom</span>
                <span className="text-gray-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Doručovacia adresa</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.address.name}</p>
                <p>{order.address.street}</p>
                <p>{order.address.postalCode} {order.address.city}</p>
                <p>{order.address.country}</p>
                <p className="mt-2">{order.address.phone}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Platba</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{order.payment.name}</span>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${order.payment.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : order.payment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                `}>
                  {order.payment.status === 'paid' ? 'Zaplatené' : 
                   order.payment.status === 'pending' ? 'Čaká na platbu' : 'Dobierka'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            {Icons.printer}
            Vytlačiť potvrdenie
          </button>
          <Link
            href="/ucet/objednavky"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            {Icons.download}
            Moje objednávky
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {Icons.home}
            Pokračovať v nákupe
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Potrebujete pomoc?
          </h3>
          <p className="text-gray-600 mb-6">
            Ak máte akékoľvek otázky k vašej objednávke, neváhajte nás kontaktovať.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="mailto:podpora@eshopy.sk"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              {Icons.mail}
              podpora@eshopy.sk
            </a>
            <a
              href="tel:+421123456789"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              {Icons.phone}
              +421 123 456 789
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          © 2025 ESHOPY. Všetky práva vyhradené.
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
