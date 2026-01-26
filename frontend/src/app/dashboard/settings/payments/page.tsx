'use client';

import { useState } from 'react';
import { 
  CreditCard, Check, X, ChevronRight, ExternalLink, Shield, AlertCircle, 
  Plus, Settings, Eye, EyeOff, Loader2, Save, TestTube, Zap, Building2,
  Banknote, Smartphone, Globe, Info
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  enabled: boolean;
  configured: boolean;
  testMode: boolean;
  fees: string;
  popular?: boolean;
  countries: string[];
  settings: Record<string, string>;
  features: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT METHODS DATA - SK/CZ FOCUSED
// ═══════════════════════════════════════════════════════════════════════════════

const initialMethods: PaymentMethod[] = [
  { 
    id: 'gopay', 
    name: 'GoPay', 
    type: 'gateway',
    description: 'Platobné karty, bankové prevody, Apple Pay, Google Pay', 
    icon: '🔵',
    enabled: true, 
    configured: true, 
    testMode: true, 
    fees: '1.9% + €0.25',
    popular: true,
    countries: ['SK', 'CZ'],
    settings: { goId: '1234567890', clientId: 'abc123', clientSecret: '***' },
    features: ['Platobné karty', 'Online banking', 'Apple Pay', 'Google Pay', 'PayPal']
  },
  { 
    id: 'stripe', 
    name: 'Stripe', 
    type: 'gateway',
    description: 'Medzinárodná platobná brána, karty, Apple Pay, Google Pay', 
    icon: '💳',
    enabled: false, 
    configured: false, 
    testMode: true, 
    fees: '1.4% + €0.25 EU / 2.9% + €0.25',
    countries: ['SK', 'CZ', 'EU', 'WORLD'],
    settings: { publishableKey: '', secretKey: '' },
    features: ['Platobné karty', 'Apple Pay', 'Google Pay', 'SEPA', 'iDEAL', 'Bancontact']
  },
  { 
    id: 'comgate', 
    name: 'ComGate', 
    type: 'gateway',
    description: 'Česká platobná brána - karty, prevody, SMS platby', 
    icon: '🟢',
    enabled: false, 
    configured: false, 
    testMode: true, 
    fees: '1.5% + 3 Kč',
    popular: true,
    countries: ['CZ', 'SK'],
    settings: { merchant: '', secret: '' },
    features: ['Platobné karty', 'Online banking', 'SMS platby', 'QR platby']
  },
  { 
    id: 'tatrapay', 
    name: 'TatraPay', 
    type: 'bank',
    description: 'Tatra banka - priame platby z účtu', 
    icon: '🏦',
    enabled: false, 
    configured: false, 
    testMode: true, 
    fees: '0.5% (min €0.10)',
    countries: ['SK'],
    settings: { mid: '', sharedSecret: '' },
    features: ['Priama platba', 'Okamžité potvrdenie']
  },
  { 
    id: 'sporopay', 
    name: 'SporoPay', 
    type: 'bank',
    description: 'Slovenská sporiteľňa - priame platby z účtu', 
    icon: '🏛️',
    enabled: false, 
    configured: false, 
    testMode: true, 
    fees: '0.5% (min €0.10)',
    countries: ['SK'],
    settings: { merchantId: '', password: '' },
    features: ['Priama platba', 'Okamžité potvrdenie']
  },
  { 
    id: 'paypal', 
    name: 'PayPal', 
    type: 'wallet',
    description: 'Medzinárodná peňaženka, platobné karty', 
    icon: '🅿️',
    enabled: false, 
    configured: false, 
    testMode: false, 
    fees: '2.9% + €0.35',
    countries: ['WORLD'],
    settings: { clientId: '', clientSecret: '' },
    features: ['PayPal účet', 'Platobné karty', 'Pay Later']
  },
  { 
    id: 'cod', 
    name: 'Dobierka', 
    type: 'offline',
    description: 'Platba v hotovosti alebo kartou pri prevzatí', 
    icon: '📦',
    enabled: true, 
    configured: true, 
    testMode: false, 
    fees: 'Individuálne (kuriér)',
    countries: ['SK', 'CZ'],
    settings: { maxAmount: '300', fee: '1.50' },
    features: ['Hotovosť', 'Karta pri prevzatí', 'Bez nutnosti online platby']
  },
  { 
    id: 'transfer', 
    name: 'Bankový prevod', 
    type: 'offline',
    description: 'Platba prevodom na účet vopred', 
    icon: '🏧',
    enabled: true, 
    configured: true, 
    testMode: false, 
    fees: 'Zadarmo',
    countries: ['SK', 'CZ', 'EU'],
    settings: { iban: 'SK89...', bankName: 'Tatra banka', swift: 'TATRSKBX', variableSymbol: 'order_number' },
    features: ['Bez poplatkov', 'SEPA prevod', 'Manuálne overenie']
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENTS PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function PaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'enabled' | 'gateway' | 'offline'>('all');

  const toggleMethod = (id: string) => {
    setMethods(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const toggleTestMode = (id: string) => {
    setMethods(methods.map(m => m.id === id ? { ...m, testMode: !m.testMode } : m));
  };

  const openSettings = (method: PaymentMethod) => {
    setEditMethod({ ...method });
    setShowModal(true);
  };

  const saveSettings = async () => {
    if (!editMethod) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setMethods(methods.map(m => m.id === editMethod.id ? { ...editMethod, configured: true } : m));
    setSaving(false);
    setShowModal(false);
    setEditMethod(null);
  };

  const filteredMethods = methods.filter(m => {
    if (filter === 'enabled') return m.enabled;
    if (filter === 'gateway') return m.type === 'gateway';
    if (filter === 'offline') return m.type === 'offline' || m.type === 'bank';
    return true;
  });

  const enabledCount = methods.filter(m => m.enabled).length;
  const configuredCount = methods.filter(m => m.configured).length;
  const testModeCount = methods.filter(m => m.testMode && m.enabled).length;

  const typeIcon = (type: string) => {
    switch (type) {
      case 'gateway': return <Globe className="w-4 h-4" />;
      case 'bank': return <Building2 className="w-4 h-4" />;
      case 'wallet': return <Smartphone className="w-4 h-4" />;
      case 'offline': return <Banknote className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Platobné metódy</h1>
          <p className="text-slate-400 mt-1">Nastavte spôsoby platby pre váš e-shop</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Pridať metódu
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{enabledCount}</div>
          <div className="text-slate-400 text-sm">Aktívne</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{configuredCount}</div>
          <div className="text-slate-400 text-sm">Nakonfigurované</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <TestTube className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{testModeCount}</div>
          <div className="text-slate-400 text-sm">V teste</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{methods.length}</div>
          <div className="text-slate-400 text-sm">Celkom</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'Všetky' },
          { id: 'enabled', label: 'Aktívne' },
          { id: 'gateway', label: 'Online brány' },
          { id: 'offline', label: 'Offline' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Payment Methods List */}
      <div className="space-y-4">
        {filteredMethods.map(method => (
          <div 
            key={method.id} 
            className={`bg-slate-800 border rounded-2xl p-5 transition-all ${
              method.enabled ? 'border-slate-700' : 'border-slate-800 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Icon & Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="text-4xl">{method.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{method.name}</h3>
                    {method.popular && (
                      <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Populárne
                      </span>
                    )}
                    {method.enabled && method.testMode && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">Test</span>
                    )}
                    {!method.configured && (
                      <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">Vyžaduje nastavenie</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mt-0.5">{method.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">{typeIcon(method.type)} {method.type === 'gateway' ? 'Online brána' : method.type === 'offline' ? 'Offline' : method.type === 'bank' ? 'Banka' : 'Peňaženka'}</span>
                    <span>Poplatky: {method.fees}</span>
                    <span className="flex items-center gap-1">
                      {method.countries.slice(0, 3).map(c => (
                        <span key={c} className="px-1.5 py-0.5 bg-slate-700 rounded">{c}</span>
                      ))}
                      {method.countries.length > 3 && <span>+{method.countries.length - 3}</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 ml-auto">
                {/* Test Mode Toggle */}
                {method.enabled && method.type === 'gateway' && (
                  <button
                    onClick={() => toggleTestMode(method.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      method.testMode 
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {method.testMode ? 'Test' : 'Live'}
                  </button>
                )}

                {/* Settings */}
                <button
                  onClick={() => openSettings(method)}
                  className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
                  title="Nastavenia"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Enable Toggle */}
                <button
                  onClick={() => toggleMethod(method.id)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    method.enabled ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    method.enabled ? 'translate-x-8' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Features */}
            {method.enabled && (
              <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap gap-2">
                {method.features.map((feature, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
        <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-400">Bezpečnosť platieb</h4>
          <p className="text-sm text-slate-400 mt-1">
            Všetky platobné údaje sú spracované cez zabezpečené kanály (SSL/TLS). 
            Citlivé údaje nikdy neukladáme. Platobné brány sú certifikované podľa PCI DSS.
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-4 p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl flex items-start gap-4">
        <Zap className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-purple-400">Odporúčanie pre SK/CZ</h4>
          <p className="text-sm text-slate-400 mt-1">
            Pre slovenský a český trh odporúčame <strong>GoPay</strong> alebo <strong>ComGate</strong> - 
            podporujú lokálne platobné metódy, online banking a majú nízke poplatky.
            Pre medzinárodný predaj pridajte <strong>Stripe</strong> alebo <strong>PayPal</strong>.
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      {showModal && editMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-800 flex items-center gap-4">
              <span className="text-3xl">{editMethod.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-white">{editMethod.name}</h2>
                <p className="text-sm text-slate-400">Konfigurácia platobnej metódy</p>
              </div>
              <button onClick={() => setShowModal(false)} className="ml-auto p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* GoPay Settings */}
              {editMethod.id === 'gopay' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">GoID (Merchant ID)</label>
                    <input
                      type="text"
                      value={editMethod.settings.goId || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, goId: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Client ID</label>
                    <input
                      type="text"
                      value={editMethod.settings.clientId || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, clientId: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Client Secret</label>
                    <input
                      type="password"
                      value={editMethod.settings.clientSecret || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, clientSecret: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <a 
                    href="https://admin.gopay.com" 
                    target="_blank" 
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" /> Otvoriť GoPay Dashboard
                  </a>
                </>
              )}

              {/* Stripe Settings */}
              {editMethod.id === 'stripe' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Publishable Key</label>
                    <input
                      type="text"
                      value={editMethod.settings.publishableKey || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, publishableKey: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Secret Key</label>
                    <input
                      type="password"
                      value={editMethod.settings.secretKey || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, secretKey: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="sk_test_..."
                    />
                  </div>
                  <a 
                    href="https://dashboard.stripe.com" 
                    target="_blank" 
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" /> Otvoriť Stripe Dashboard
                  </a>
                </>
              )}

              {/* COD Settings */}
              {editMethod.id === 'cod' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Maximálna suma pre dobierku (€)</label>
                    <input
                      type="number"
                      value={editMethod.settings.maxAmount || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, maxAmount: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Poplatok za dobierku (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editMethod.settings.fee || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, fee: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="1.50"
                    />
                  </div>
                </>
              )}

              {/* Bank Transfer Settings */}
              {editMethod.id === 'transfer' && (
                <>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">IBAN</label>
                    <input
                      type="text"
                      value={editMethod.settings.iban || ''}
                      onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, iban: e.target.value } })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="SK89 1100 0000 0012 3456 7890"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Názov banky</label>
                      <input
                        type="text"
                        value={editMethod.settings.bankName || ''}
                        onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, bankName: e.target.value } })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Tatra banka"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">SWIFT/BIC</label>
                      <input
                        type="text"
                        value={editMethod.settings.swift || ''}
                        onChange={(e) => setEditMethod({ ...editMethod, settings: { ...editMethod.settings, swift: e.target.value } })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                        placeholder="TATRSKBX"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-xl">
                    <p className="text-sm text-slate-400">
                      <Info className="w-4 h-4 inline mr-2" />
                      Variabilný symbol bude automaticky vygenerovaný z čísla objednávky.
                    </p>
                  </div>
                </>
              )}

              {/* Generic message for unconfigured */}
              {!['gopay', 'stripe', 'cod', 'transfer'].includes(editMethod.id) && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">
                    Pre nastavenie {editMethod.name} kontaktujte poskytovateľa pre získanie prístupových údajov.
                  </p>
                  <a href="#" className="text-blue-400 text-sm hover:underline mt-2 block">
                    Zobraziť dokumentáciu
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-900 p-6 border-t border-slate-800 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
              >
                Zrušiť
              </button>
              <button 
                onClick={saveSettings}
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Ukladám...' : 'Uložiť'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
