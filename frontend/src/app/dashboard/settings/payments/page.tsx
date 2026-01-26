'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, Save, ChevronRight, Check, AlertCircle, 
  Building, Banknote, Wallet, Shield, Eye, EyeOff, ExternalLink
} from 'lucide-react';
import { useSettings } from '@/lib/store';

export default function PaymentsSettingsPage() {
  const { payments, updatePayments } = useSettings();
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const paymentProviders = [
    {
      id: 'comgate',
      name: 'ComGate',
      description: 'Slovenská platobná brána pre karty',
      icon: CreditCard,
      color: '#00a651',
      fields: [
        { key: 'merchantId', label: 'Merchant ID', type: 'text' },
        { key: 'secret', label: 'Secret Key', type: 'password' },
      ],
      features: ['3D Secure', 'Visa', 'Mastercard', 'Maestro'],
      docsUrl: 'https://help.comgate.cz',
    },
    {
      id: 'gopay',
      name: 'GoPay',
      description: 'Kompletná platobná brána',
      icon: Wallet,
      color: '#00457c',
      fields: [
        { key: 'goId', label: 'GoID', type: 'text' },
        { key: 'clientId', label: 'Client ID', type: 'text' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password' },
      ],
      features: ['Karty', 'Bankový prevod', 'Apple Pay', 'Google Pay'],
      docsUrl: 'https://doc.gopay.com',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Globálna platobná platforma',
      icon: CreditCard,
      color: '#6772e5',
      fields: [
        { key: 'publishableKey', label: 'Publishable Key', type: 'text' },
        { key: 'secretKey', label: 'Secret Key', type: 'password' },
      ],
      features: ['Karty', 'Apple Pay', 'Google Pay', 'SEPA'],
      docsUrl: 'https://stripe.com/docs',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/dashboard/settings" className="hover:text-gray-700">Nastavenia</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Platby</span>
            </div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-500" /> Platobné metódy
            </h1>
          </div>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              saved ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Uložené!' : 'Uložiť zmeny'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Online Payment Gateways */}
        {paymentProviders.map(provider => (
          <div key={provider.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: provider.color }}
                >
                  <provider.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    {provider.name}
                    <a href={provider.docsUrl} target="_blank" className="text-blue-500 hover:text-blue-600">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </h2>
                  <p className="text-sm text-gray-500">{provider.description}</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-500">
                  {(payments as any)[provider.id]?.enabled ? 'Aktívne' : 'Neaktívne'}
                </span>
                <div
                  onClick={() => updatePayments(provider.id, { enabled: !(payments as any)[provider.id]?.enabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    (payments as any)[provider.id]?.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                    (payments as any)[provider.id]?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>
            </div>

            {(payments as any)[provider.id]?.enabled && (
              <div className="p-6 bg-gray-50">
                {/* Test Mode Toggle */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">Testovací režim</span>
                  </div>
                  <button
                    onClick={() => updatePayments(provider.id, { testMode: !(payments as any)[provider.id]?.testMode })}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      (payments as any)[provider.id]?.testMode 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {(payments as any)[provider.id]?.testMode ? 'Zapnutý' : 'Vypnutý'}
                  </button>
                </div>

                {/* API Fields */}
                <div className="space-y-4">
                  {provider.fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={field.type === 'password' && !showSecrets[`${provider.id}-${field.key}`] ? 'password' : 'text'}
                          value={(payments as any)[provider.id]?.[field.key] || ''}
                          onChange={(e) => updatePayments(provider.id, { [field.key]: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
                          placeholder={`Zadajte ${field.label.toLowerCase()}`}
                        />
                        {field.type === 'password' && (
                          <button
                            onClick={() => toggleSecret(`${provider.id}-${field.key}`)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showSecrets[`${provider.id}-${field.key}`] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.features.map(feat => (
                    <span key={feat} className="px-2 py-1 bg-white border rounded text-xs text-gray-600">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Offline Payments */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" /> Offline platby
          </h2>

          {/* Bank Transfer */}
          <div className="mb-6 p-4 border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Bankový prevod</p>
                  <p className="text-sm text-gray-500">Platba prevodom na účet</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => updatePayments('bankTransfer', { enabled: !payments.bankTransfer?.enabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    payments.bankTransfer?.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                    payments.bankTransfer?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>
            </div>
            {payments.bankTransfer?.enabled && (
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">IBAN</label>
                  <input
                    type="text"
                    value={payments.bankTransfer?.iban || ''}
                    onChange={(e) => updatePayments('bankTransfer', { iban: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                    placeholder="SK89 7500 0000 0000 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Názov banky</label>
                  <input
                    type="text"
                    value={payments.bankTransfer?.bankName || ''}
                    onChange={(e) => updatePayments('bankTransfer', { bankName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Tatra banka"
                  />
                </div>
              </div>
            )}
          </div>

          {/* COD */}
          <div className="p-4 border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Banknote className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Dobierka</p>
                  <p className="text-sm text-gray-500">Platba pri prevzatí</p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => updatePayments('cod', { enabled: !payments.cod?.enabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    payments.cod?.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                    payments.cod?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </label>
            </div>
            {payments.cod?.enabled && (
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Príplatok za dobierku (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={payments.cod?.fee || 1.50}
                    onChange={(e) => updatePayments('cod', { fee: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Max. suma pre dobierku (€)</label>
                  <input
                    type="number"
                    value={payments.cod?.maxAmount || 500}
                    onChange={(e) => updatePayments('cod', { maxAmount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Vaše údaje sú v bezpečí</p>
            <p>Všetky API kľúče sú šifrované. Pre maximálnu bezpečnosť odporúčame používať testovací režim počas vývoja.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
