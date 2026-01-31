'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, ShoppingCart, Truck, CreditCard, MapPin, User, Phone, Mail, Building2,
  Package, Shield, Check, AlertCircle, Loader2, ChevronRight, Info, X, Home, Store
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  freeFrom?: number;
  estimatedDays: string;
  type: 'courier' | 'pickup' | 'packeta' | 'store' | 'post';
  logo?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank_transfer' | 'cod' | 'gopay';
  description: string;
  fee?: number;
  logo?: string;
}

interface CustomerInfo {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface BillingInfo {
  sameAsShipping: boolean;
  company?: string;
  ico?: string;
  dic?: string;
  icDph?: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA - SK/CZ optimalizované
// ═══════════════════════════════════════════════════════════════════════════════

const shippingMethods: ShippingMethod[] = [
  { id: 'packeta', name: 'Zásielkovňa', description: 'Výdajné miesto Z-Point', price: 2.49, freeFrom: 40, estimatedDays: '1-2 pracovné dni', type: 'packeta' },
  { id: 'gls', name: 'GLS kuriér', description: 'Doručenie na adresu', price: 4.49, freeFrom: 60, estimatedDays: '1-2 pracovné dni', type: 'courier' },
  { id: 'dpd', name: 'DPD kuriér', description: 'Doručenie na adresu', price: 4.99, freeFrom: 60, estimatedDays: '1-2 pracovné dni', type: 'courier' },
  { id: 'posta', name: 'Slovenská pošta', description: 'Doručenie poštou', price: 3.49, freeFrom: 50, estimatedDays: '2-4 pracovné dni', type: 'post' },
  { id: 'store', name: 'Osobný odber', description: 'Odber na predajni zadarmo', price: 0, estimatedDays: 'Ihneď po potvrdení', type: 'store' },
];

const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Platobná karta', type: 'card', description: 'Visa, Mastercard, Maestro' },
  { id: 'gopay', name: 'GoPay', type: 'gopay', description: 'Rôzne platobné metódy' },
  { id: 'transfer', name: 'Bankový prevod', type: 'bank_transfer', description: 'Platba vopred na účet' },
  { id: 'cod', name: 'Dobierka', type: 'cod', description: 'Platba pri prevzatí', fee: 1.50 },
];

const countries = [
  { code: 'SK', name: 'Slovensko' },
  { code: 'CZ', name: 'Česká republika' },
  { code: 'HU', name: 'Maďarsko' },
  { code: 'AT', name: 'Rakúsko' },
  { code: 'PL', name: 'Poľsko' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cart (demo data)
  const [cart] = useState<CartItem[]>([
    { id: '1', name: 'Bezdrôtové slúchadlá Pro', price: 89.99, quantity: 1 },
    { id: '2', name: 'USB-C Hub 7v1', price: 49.99, quantity: 2 },
  ]);

  // Customer info
  const [customer, setCustomer] = useState<CustomerInfo>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
  });

  // Shipping
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    postalCode: '',
    country: 'SK',
  });
  const [selectedShipping, setSelectedShipping] = useState<string>('packeta');

  // Payment
  const [selectedPayment, setSelectedPayment] = useState<string>('card');

  // Billing
  const [billing, setBilling] = useState<BillingInfo>({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'SK',
  });
  const [wantInvoice, setWantInvoice] = useState(false);

  // Terms
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingMethod = shippingMethods.find(m => m.id === selectedShipping);
  const shippingCost = shippingMethod?.freeFrom && subtotal >= shippingMethod.freeFrom ? 0 : (shippingMethod?.price || 0);
  const paymentMethod = paymentMethods.find(m => m.id === selectedPayment);
  const paymentFee = paymentMethod?.fee || 0;
  const total = subtotal + shippingCost + paymentFee;

  // Validation
  const validateStep1 = () => {
    if (!customer.email || !customer.phone || !customer.firstName || !customer.lastName) {
      setError('Vyplňte všetky povinné údaje');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setError('Zadajte platnú emailovú adresu');
      return false;
    }
    if (!/^(\+421|\+420|0)[0-9]{9}$/.test(customer.phone.replace(/\s/g, ''))) {
      setError('Zadajte platné telefónne číslo (SK/CZ formát)');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      setError('Vyplňte všetky údaje adresy');
      return false;
    }
    // SK/CZ postal code validation
    if (shippingAddress.country === 'SK' && !/^[0-9]{3}\s?[0-9]{2}$/.test(shippingAddress.postalCode)) {
      setError('Zadajte platné PSČ (formát: 811 01)');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!acceptTerms) {
      setError('Musíte súhlasiť s obchodnými podmienkami');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError('');
    let valid = false;
    
    switch (step) {
      case 1: valid = validateStep1(); break;
      case 2: valid = validateStep2(); break;
      case 3: valid = validateStep3(); break;
    }

    if (valid && step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitOrder = async () => {
    setError('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 2000));

      // Redirect to success page
      router.push(`/store/${slug}/order/success?order=ORD-${Date.now()}`);
    } catch (err) {
      setError('Nastala chyba pri spracovaní objednávky. Skúste to znova.');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Späť do obchodu</span>
          </Link>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Demo Shop</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Zabezpečená platba</span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Kontakt', icon: User },
              { num: 2, label: 'Doručenie', icon: Truck },
              { num: 3, label: 'Platba', icon: CreditCard },
              { num: 4, label: 'Súhrn', icon: Check },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => step > s.num && setStep(s.num)}
                  disabled={step < s.num}
                  className={`flex items-center gap-2 ${step >= s.num ? 'text-blue-600' : 'text-gray-400'} ${step > s.num ? 'cursor-pointer' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step > s.num ? 'bg-green-500 text-white' : step === s.num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="hidden md:inline text-sm font-medium">{s.label}</span>
                </button>
                {i < 3 && <ChevronRight className="w-5 h-5 text-gray-300 mx-2 md:mx-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
                <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Step 1: Contact Info */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  Kontaktné údaje
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meno *</label>
                    <input
                      type="text"
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Ján"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priezvisko *</label>
                    <input
                      type="text"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Novák"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="jan.novak@email.sk"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefón *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="+421 900 123 456"
                      />
                    </div>
                  </div>
                </div>

                {/* Marketing consent */}
                <label className="flex items-start gap-3 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptMarketing}
                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span className="text-sm text-gray-600">
                    Chcem dostávať informácie o novinkách a akciách
                  </span>
                </label>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl border p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    Adresa doručenia
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ulica a číslo *</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Hlavná 123/45"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mesto *</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Bratislava"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PSČ *</label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="811 01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Krajina *</label>
                        <select
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        >
                          {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Methods */}
                <div className="bg-white rounded-2xl border p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-blue-600" />
                    Spôsob doručenia
                  </h2>

                  <div className="space-y-3">
                    {shippingMethods.map(method => {
                      const isFree = method.freeFrom && subtotal >= method.freeFrom;
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedShipping === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShipping === method.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{method.name}</span>
                              {method.type === 'packeta' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Odporúčané</span>}
                            </div>
                            <p className="text-sm text-gray-500">{method.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{method.estimatedDays}</p>
                          </div>
                          <div className="text-right">
                            {isFree ? (
                              <div>
                                <span className="text-green-600 font-semibold">Zadarmo</span>
                                <p className="text-xs text-gray-400 line-through">€{method.price.toFixed(2)}</p>
                              </div>
                            ) : method.price === 0 ? (
                              <span className="text-green-600 font-semibold">Zadarmo</span>
                            ) : (
                              <div>
                                <span className="font-semibold">€{method.price.toFixed(2)}</span>
                                {method.freeFrom && (
                                  <p className="text-xs text-gray-400">Zadarmo od €{method.freeFrom}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="bg-white rounded-2xl border p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    Spôsob platby
                  </h2>

                  <div className="space-y-3">
                    {paymentMethods.map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPayment === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <div className="flex-1">
                          <span className="font-semibold">{method.name}</span>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        {method.fee && method.fee > 0 && (
                          <span className="text-sm text-gray-500">+€{method.fee.toFixed(2)}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Invoice */}
                <div className="bg-white rounded-2xl border p-6 md:p-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantInvoice}
                      onChange={(e) => setWantInvoice(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold">Chcem faktúru na firmu</span>
                      <p className="text-sm text-gray-500">Zadajte firemné údaje pre faktúru</p>
                    </div>
                  </label>

                  {wantInvoice && (
                    <div className="mt-6 space-y-4 pt-6 border-t">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Názov firmy</label>
                          <input
                            type="text"
                            value={billing.company || ''}
                            onChange={(e) => setBilling({ ...billing, company: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                            placeholder="Firma s.r.o."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IČO</label>
                          <input
                            type="text"
                            value={billing.ico || ''}
                            onChange={(e) => setBilling({ ...billing, ico: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                            placeholder="12345678"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">DIČ</label>
                          <input
                            type="text"
                            value={billing.dic || ''}
                            onChange={(e) => setBilling({ ...billing, dic: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                            placeholder="2012345678"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IČ DPH</label>
                          <input
                            type="text"
                            value={billing.icDph || ''}
                            onChange={(e) => setBilling({ ...billing, icDph: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                            placeholder="SK2012345678"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="bg-white rounded-2xl border p-6 md:p-8">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-gray-600">
                      Súhlasím s{' '}
                      <a href="#" className="text-blue-600 hover:underline">obchodnými podmienkami</a>{' '}
                      a{' '}
                      <a href="#" className="text-blue-600 hover:underline">ochranou osobných údajov</a> *
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Summary */}
            {step === 4 && (
              <div className="bg-white rounded-2xl border p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-600" />
                  Súhrn objednávky
                </h2>

                {/* Customer Info Summary */}
                <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Kontaktné údaje</h3>
                    <p className="text-gray-600">{customer.firstName} {customer.lastName}</p>
                    <p className="text-gray-600">{customer.email}</p>
                    <p className="text-gray-600">{customer.phone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Adresa doručenia</h3>
                    <p className="text-gray-600">{shippingAddress.street}</p>
                    <p className="text-gray-600">{shippingAddress.postalCode} {shippingAddress.city}</p>
                    <p className="text-gray-600">{countries.find(c => c.code === shippingAddress.country)?.name}</p>
                  </div>
                </div>

                {/* Selected Methods */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">{shippingMethod?.name}</p>
                      <p className="text-sm text-gray-500">{shippingMethod?.estimatedDays}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">{paymentMethod?.name}</p>
                      <p className="text-sm text-gray-500">{paymentMethod?.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Späť
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Pokračovať
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={submitOrder}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Spracovávam...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Objednať za €{total.toFixed(2)}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Vaša objednávka
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">Množstvo: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Medzisúčet</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Doprava ({shippingMethod?.name})</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'Zadarmo' : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Poplatok za dobierku</span>
                    <span>€{paymentFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-bold text-lg">Celkom</span>
                <span className="font-bold text-2xl text-blue-600">€{total.toFixed(2)}</span>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Zabezpečená platba SSL</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Doprava zadarmo od €40</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-purple-600" />
                  <span>30 dní na vrátenie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
