'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Check, Truck, CreditCard, Package, Building, Banknote, MapPin, 
  Sparkles, ChevronRight, Shield, Lock, Clock, User, Mail, Phone, Home,
  AlertCircle, Info, Loader2
} from 'lucide-react';
import { useCart, useEditor, useSettings, formatPrice } from '@/lib/store';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface FormData {
  // Contact
  email: string;
  phone: string;
  // Billing
  firstName: string;
  lastName: string;
  company: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  // Shipping (if different)
  shippingDifferent: boolean;
  shippingFirstName: string;
  shippingLastName: string;
  shippingCompany: string;
  shippingStreet: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  // Other
  note: string;
  newsletter: boolean;
  terms: boolean;
}

const initialFormData: FormData = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  company: '',
  street: '',
  city: '',
  zip: '',
  country: 'SK',
  shippingDifferent: false,
  shippingFirstName: '',
  shippingLastName: '',
  shippingCompany: '',
  shippingStreet: '',
  shippingCity: '',
  shippingZip: '',
  shippingCountry: 'SK',
  note: '',
  newsletter: false,
  terms: false,
};

const steps = [
  { id: 1, name: 'Kontakt', icon: User },
  { id: 2, name: 'Doprava', icon: Truck },
  { id: 3, name: 'Platba', icon: CreditCard },
  { id: 4, name: 'Súhrn', icon: Check },
];

const countries = [
  { code: 'SK', name: 'Slovensko' },
  { code: 'CZ', name: 'Česká republika' },
  { code: 'HU', name: 'Maďarsko' },
  { code: 'PL', name: 'Poľsko' },
  { code: 'AT', name: 'Rakúsko' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SHIPPING METHODS
// ═══════════════════════════════════════════════════════════════════════════════

const shippingMethods = [
  { 
    id: 'dpd', 
    name: 'DPD Kuriér', 
    description: 'Doručenie na adresu',
    price: 4.90, 
    freeFrom: 50,
    time: '1-2 pracovné dni', 
    icon: Truck,
    features: ['Sledovanie zásielky', 'SMS notifikácie'],
  },
  { 
    id: 'zasielkovna', 
    name: 'Zásielkovňa', 
    description: 'Výdajné miesto',
    price: 2.90, 
    freeFrom: 50,
    time: '2-3 pracovné dni', 
    icon: Package,
    features: ['1000+ výdajných miest', 'Výber miesta na mape'],
  },
  { 
    id: 'posta', 
    name: 'Slovenská pošta', 
    description: 'Doručenie poštou',
    price: 3.50, 
    freeFrom: 50,
    time: '3-5 pracovných dní', 
    icon: Building,
    features: ['Doručenie do schránky'],
  },
  { 
    id: 'pickup', 
    name: 'Osobný odber', 
    description: 'Hlavná 1, Bratislava',
    price: 0, 
    freeFrom: 0,
    time: 'Ihneď k dispozícii', 
    icon: MapPin,
    features: ['Bez čakania', 'Po-Pi: 9:00-17:00'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT METHODS
// ═══════════════════════════════════════════════════════════════════════════════

const paymentMethods = [
  { 
    id: 'card', 
    name: 'Platobná karta', 
    description: 'Visa, Mastercard, Maestro',
    icon: CreditCard,
    fee: 0,
    features: ['Okamžité spracovanie', '3D Secure'],
  },
  { 
    id: 'bank', 
    name: 'Bankový prevod', 
    description: 'Platba vopred na účet',
    icon: Building,
    fee: 0,
    features: ['Faktúra s QR kódom', 'Splatnosť 7 dní'],
  },
  { 
    id: 'cod', 
    name: 'Dobierka', 
    description: 'Platba pri prevzatí',
    icon: Banknote,
    fee: 1.50,
    features: ['Platba v hotovosti', 'Príplatok +€1.50'],
  },
  { 
    id: 'paypal', 
    name: 'PayPal', 
    description: 'Rýchla platba PayPal',
    icon: CreditCard,
    fee: 0,
    features: ['Ochrana kupujúceho', 'Bez registrácie'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const cart = useCart();
  const { shopSettings } = useEditor();
  const theme = shopSettings.theme;
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [shipping, setShipping] = useState('dpd');
  const [payment, setPayment] = useState('card');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const cartTotal = cart.total();
  const selectedShipping = shippingMethods.find(s => s.id === shipping);
  const selectedPayment = paymentMethods.find(p => p.id === payment);
  
  const shippingPrice = selectedShipping 
    ? (cartTotal >= selectedShipping.freeFrom ? 0 : selectedShipping.price)
    : 0;
  const paymentFee = selectedPayment?.fee || 0;
  const finalTotal = cartTotal + shippingPrice + paymentFee;

  // Validation
  const validateStep = (stepNum: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (stepNum === 1) {
      if (!form.email) newErrors.email = 'Email je povinný';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Neplatný email';
      if (!form.phone) newErrors.phone = 'Telefón je povinný';
      if (!form.firstName) newErrors.firstName = 'Meno je povinné';
      if (!form.lastName) newErrors.lastName = 'Priezvisko je povinné';
      if (!form.street) newErrors.street = 'Ulica je povinná';
      if (!form.city) newErrors.city = 'Mesto je povinné';
      if (!form.zip) newErrors.zip = 'PSČ je povinné';
    }

    if (stepNum === 4 && !form.terms) {
      newErrors.terms = 'Musíte súhlasiť s obchodnými podmienkami';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    router.push(`/store/${slug}/order/success`);
  };

  const updateForm = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push(`/store/${slug}`);
    }
  }, [cart.items.length, router, slug]);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: theme.fontFamily }}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href={`/store/${slug}`} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Späť do obchodu</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">{shopSettings.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Zabezpečená platba</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      s.id < step ? 'text-white' : s.id === step ? 'text-white ring-4 ring-opacity-30' : 'bg-gray-200 text-gray-500'
                    }`}
                    style={s.id <= step ? { backgroundColor: theme.primaryColor, '--tw-ring-color': theme.primaryColor } as any : {}}
                  >
                    {s.id < step ? <Check className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${s.id <= step ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.name}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div 
                    className={`w-20 h-1 mx-3 rounded ${s.id < step ? '' : 'bg-gray-200'}`}
                    style={s.id < step ? { backgroundColor: theme.primaryColor } : {}}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Step 1: Contact & Address */}
              {step === 1 && (
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <User className="w-6 h-6" style={{ color: theme.primaryColor }} />
                    Kontaktné údaje
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <Input
                      label="Email *"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      error={errors.email}
                      icon={<Mail className="w-5 h-5" />}
                      placeholder="vas@email.sk"
                    />
                    <Input
                      label="Telefón *"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      error={errors.phone}
                      icon={<Phone className="w-5 h-5" />}
                      placeholder="+421 9XX XXX XXX"
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    Fakturačná adresa
                  </h3>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Meno *"
                        value={form.firstName}
                        onChange={(e) => updateForm('firstName', e.target.value)}
                        error={errors.firstName}
                        placeholder="Ján"
                      />
                      <Input
                        label="Priezvisko *"
                        value={form.lastName}
                        onChange={(e) => updateForm('lastName', e.target.value)}
                        error={errors.lastName}
                        placeholder="Novák"
                      />
                    </div>
                    
                    <Input
                      label="Firma (voliteľné)"
                      value={form.company}
                      onChange={(e) => updateForm('company', e.target.value)}
                      placeholder="Názov spoločnosti"
                    />
                    
                    <Input
                      label="Ulica a číslo *"
                      value={form.street}
                      onChange={(e) => updateForm('street', e.target.value)}
                      error={errors.street}
                      placeholder="Hlavná 1"
                    />
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        label="Mesto *"
                        value={form.city}
                        onChange={(e) => updateForm('city', e.target.value)}
                        error={errors.city}
                        placeholder="Bratislava"
                        className="md:col-span-2"
                      />
                      <Input
                        label="PSČ *"
                        value={form.zip}
                        onChange={(e) => updateForm('zip', e.target.value)}
                        error={errors.zip}
                        placeholder="811 01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Krajina</label>
                      <select
                        value={form.country}
                        onChange={(e) => updateForm('country', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Different shipping address */}
                  <label className="flex items-center gap-3 mt-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.shippingDifferent}
                      onChange={(e) => updateForm('shippingDifferent', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300"
                      style={{ accentColor: theme.primaryColor }}
                    />
                    <span className="text-sm">Doručiť na inú adresu</span>
                  </label>

                  {form.shippingDifferent && (
                    <div className="mt-6 pt-6 border-t space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Truck className="w-5 h-5" style={{ color: theme.primaryColor }} />
                        Doručovacia adresa
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Meno"
                          value={form.shippingFirstName}
                          onChange={(e) => updateForm('shippingFirstName', e.target.value)}
                        />
                        <Input
                          label="Priezvisko"
                          value={form.shippingLastName}
                          onChange={(e) => updateForm('shippingLastName', e.target.value)}
                        />
                      </div>
                      <Input
                        label="Ulica a číslo"
                        value={form.shippingStreet}
                        onChange={(e) => updateForm('shippingStreet', e.target.value)}
                      />
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          label="Mesto"
                          value={form.shippingCity}
                          onChange={(e) => updateForm('shippingCity', e.target.value)}
                          className="md:col-span-2"
                        />
                        <Input
                          label="PSČ"
                          value={form.shippingZip}
                          onChange={(e) => updateForm('shippingZip', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Truck className="w-6 h-6" style={{ color: theme.primaryColor }} />
                    Spôsob dopravy
                  </h2>

                  <div className="space-y-3">
                    {shippingMethods.map((method) => {
                      const isFree = cartTotal >= method.freeFrom;
                      const price = isFree ? 0 : method.price;
                      
                      return (
                        <label
                          key={method.id}
                          className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            shipping === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={shipping === method.id ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` } : {}}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shipping === method.id}
                            onChange={() => setShipping(method.id)}
                            className="mt-1 w-5 h-5"
                            style={{ accentColor: theme.primaryColor }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <method.icon className="w-5 h-5 text-gray-500" />
                              <span className="font-semibold">{method.name}</span>
                              {isFree && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                  ZADARMO
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {method.time}
                              </span>
                              {method.features.map((f, i) => (
                                <span key={i} className="flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> {f}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className={`font-bold ${isFree ? 'text-green-600' : ''}`}>
                            {price === 0 ? 'Zadarmo' : formatPrice(price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" style={{ color: theme.primaryColor }} />
                    Spôsob platby
                  </h2>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          payment === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={payment === method.id ? { borderColor: theme.primaryColor, backgroundColor: `${theme.primaryColor}10` } : {}}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={payment === method.id}
                          onChange={() => setPayment(method.id)}
                          className="mt-1 w-5 h-5"
                          style={{ accentColor: theme.primaryColor }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <method.icon className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold">{method.name}</span>
                            {method.fee > 0 && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                +{formatPrice(method.fee)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{method.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            {method.features.map((f, i) => (
                              <span key={i} className="flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Security Info */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">Bezpečná platba</p>
                      <p>Všetky platby sú šifrované pomocou SSL certifikátu. Vaše údaje sú v bezpečí.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Summary */}
              {step === 4 && (
                <div className="p-6 md:p-8">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Check className="w-6 h-6" style={{ color: theme.primaryColor }} />
                    Súhrn objednávky
                  </h2>

                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Kontakt
                      </h3>
                      <p className="text-sm text-gray-600">{form.firstName} {form.lastName}</p>
                      <p className="text-sm text-gray-600">{form.email}</p>
                      <p className="text-sm text-gray-600">{form.phone}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Home className="w-4 h-4" /> Adresa
                      </h3>
                      <p className="text-sm text-gray-600">{form.street}</p>
                      <p className="text-sm text-gray-600">{form.zip} {form.city}</p>
                      <p className="text-sm text-gray-600">{countries.find(c => c.code === form.country)?.name}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Doprava
                      </h3>
                      <p className="text-sm text-gray-600">{selectedShipping?.name}</p>
                      <p className="text-sm text-gray-600">{selectedShipping?.time}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Platba
                      </h3>
                      <p className="text-sm text-gray-600">{selectedPayment?.name}</p>
                      <p className="text-sm text-gray-600">{selectedPayment?.description}</p>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Poznámka k objednávke (voliteľné)
                    </label>
                    <textarea
                      value={form.note}
                      onChange={(e) => updateForm('note', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                      placeholder="Napr. čas doručenia, kód na zvonček..."
                    />
                  </div>

                  {/* Terms */}
                  <div className="space-y-3 mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.terms}
                        onChange={(e) => updateForm('terms', e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300"
                        style={{ accentColor: theme.primaryColor }}
                      />
                      <span className="text-sm text-gray-600">
                        Súhlasím s{' '}
                        <a href="/obchodne-podmienky" target="_blank" className="underline" style={{ color: theme.primaryColor }}>
                          obchodnými podmienkami
                        </a>{' '}
                        a{' '}
                        <a href="/gdpr" target="_blank" className="underline" style={{ color: theme.primaryColor }}>
                          ochranou osobných údajov
                        </a>
                        {' '}*
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.terms}
                      </p>
                    )}
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.newsletter}
                        onChange={(e) => updateForm('newsletter', e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300"
                        style={{ accentColor: theme.primaryColor }}
                      />
                      <span className="text-sm text-gray-600">
                        Chcem dostávať novinky a špeciálne ponuky emailom
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="p-6 md:p-8 border-t bg-gray-50 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                  >
                    Späť
                  </button>
                ) : (
                  <div />
                )}
                
                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 rounded-xl font-semibold text-white transition-colors flex items-center gap-2"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Pokračovať <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl font-semibold text-white transition-colors flex items-center gap-2 disabled:opacity-70"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Spracúvam...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" /> Dokončiť objednávku
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Vaša objednávka</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Množstvo: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Medzisúčet</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Doprava</span>
                  <span className={shippingPrice === 0 ? 'text-green-600' : ''}>
                    {shippingPrice === 0 ? 'Zadarmo' : formatPrice(shippingPrice)}
                  </span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Poplatok za platbu</span>
                    <span>{formatPrice(paymentFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl pt-3 border-t">
                  <span>Celkom</span>
                  <span style={{ color: theme.primaryColor }}>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4 text-green-600" /> Bezpečná platba
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Truck className="w-4 h-4 text-green-600" /> Rýchle doručenie
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <RotateCcw className="w-4 h-4 text-green-600" /> 30 dní na vrátenie
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
