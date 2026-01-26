'use client';

import { useState } from 'react';
import { CreditCard, Check, X, ChevronRight, ExternalLink, Shield, AlertCircle, Plus, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  configured: boolean;
  testMode: boolean;
  fees: string;
  settings: Record<string, string>;
}

const initialMethods: PaymentMethod[] = [
  { id: 'stripe', name: 'Stripe', description: 'Platobné karty, Apple Pay, Google Pay', icon: '💳', enabled: true, configured: true, testMode: true, fees: '1.4% + €0.25', settings: { publicKey: 'pk_test_...', secretKey: 'sk_test_...' }},
  { id: 'paypal', name: 'PayPal', description: 'PayPal účet, platobné karty', icon: '🅿️', enabled: true, configured: true, testMode: false, fees: '2.9% + €0.35', settings: { clientId: 'AaBbCc...', clientSecret: '...' }},
  { id: 'gopay', name: 'GoPay', description: 'Slovenské platobné metódy', icon: '🏦', enabled: false, configured: false, testMode: true, fees: '1.9% + €0.15', settings: { goId: '', clientId: '', clientSecret: '' }},
  { id: 'tatrapay', name: 'TatraPay', description: 'Tatra banka priame platby', icon: '🏛️', enabled: false, configured: false, testMode: true, fees: '0.9%', settings: { mid: '', sharedSecret: '' }},
  { id: 'cod', name: 'Dobierka', description: 'Platba pri prevzatí', icon: '📦', enabled: true, configured: true, testMode: false, fees: '€0', settings: { maxAmount: '500' }},
  { id: 'transfer', name: 'Bankový prevod', description: 'Platba prevodom na účet', icon: '🏧', enabled: true, configured: true, testMode: false, fees: '€0', settings: { iban: 'SK89...', bankName: 'Tatra banka' }},
];

export default function PaymentsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleMethod = (id: string) => {
    setMethods(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const toggleTestMode = (id: string) => {
    setMethods(methods.map(m => m.id === id ? { ...m, testMode: !m.testMode } : m));
  };

  const openSettings = (method: PaymentMethod) => {
    setEditMethod(method);
    setShowModal(true);
  };

  const saveSettings = (settings: Record<string, string>) => {
    if (!editMethod) return;
    setMethods(methods.map(m => m.id === editMethod.id ? { ...m, settings, configured: true } : m));
    setShowModal(false);
    setEditMethod(null);
  };

  const enabledCount = methods.filter(m => m.enabled).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Platobné metódy</h1>
          <p className="text-gray-400 mt-1">Nastavte spôsoby platby pre váš obchod</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{enabledCount}</div>
          <div className="text-gray-400 text-sm">Aktívne metódy</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{methods.filter(m => m.configured).length}</div>
          <div className="text-gray-400 text-sm">Nakonfigurované</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold">{methods.filter(m => m.testMode && m.enabled).length}</div>
          <div className="text-gray-400 text-sm">V testovacom režime</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {methods.map(method => (
          <div key={method.id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${method.enabled ? 'border-gray-700' : 'border-gray-800 opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className="text-3xl">{method.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-white">{method.name}</h3>
                  {method.enabled && method.testMode && (
                    <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">Test</span>
                  )}
                  {!method.configured && (
                    <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">Vyžaduje nastavenie</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-0.5">{method.description}</p>
                <p className="text-gray-500 text-xs mt-1">Poplatky: {method.fees}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Test Mode Toggle */}
                {method.enabled && method.id !== 'cod' && method.id !== 'transfer' && (
                  <button
                    onClick={() => toggleTestMode(method.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      method.testMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {method.testMode ? 'Test' : 'Live'}
                  </button>
                )}

                {/* Settings */}
                <button
                  onClick={() => openSettings(method)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Enable Toggle */}
                <button
                  onClick={() => toggleMethod(method.id)}
                  className={`w-12 h-6 rounded-full transition-colors ${method.enabled ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${method.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-400">Bezpečnosť platieb</h4>
          <p className="text-sm text-gray-400 mt-1">
            Všetky platobné údaje sú spracované cez zabezpečené kanály. Citlivé údaje nikdy neukladáme na našich serveroch.
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      {showModal && editMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl w-full max-w-lg border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editMethod.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">{editMethod.name}</h2>
                  <p className="text-sm text-gray-400">Nastavenia platobnej metódy</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {editMethod.id === 'stripe' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Publishable Key</label>
                    <input type="text" defaultValue={editMethod.settings.publicKey} 
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="pk_test_..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Secret Key</label>
                    <input type="password" defaultValue={editMethod.settings.secretKey}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="sk_test_..." />
                  </div>
                  <a href="https://dashboard.stripe.com" target="_blank" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                    <ExternalLink className="w-4 h-4" /> Otvoriť Stripe Dashboard
                  </a>
                </>
              )}
              {editMethod.id === 'paypal' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Client ID</label>
                    <input type="text" defaultValue={editMethod.settings.clientId}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Client Secret</label>
                    <input type="password" defaultValue={editMethod.settings.clientSecret}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
                  </div>
                </>
              )}
              {editMethod.id === 'cod' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Maximálna suma pre dobierku (€)</label>
                  <input type="number" defaultValue={editMethod.settings.maxAmount}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
                </div>
              )}
              {editMethod.id === 'transfer' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">IBAN</label>
                    <input type="text" defaultValue={editMethod.settings.iban}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="SK89..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Názov banky</label>
                    <input type="text" defaultValue={editMethod.settings.bankName}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
                  </div>
                </>
              )}
              {(editMethod.id === 'gopay' || editMethod.id === 'tatrapay') && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Kontaktujte {editMethod.name} pre získanie prístupových údajov.</p>
                  <a href="#" className="text-blue-400 text-sm hover:underline mt-2 block">Zobraziť dokumentáciu</a>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-gray-800 text-white rounded-xl">Zrušiť</button>
              <button onClick={() => saveSettings(editMethod.settings)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl">Uložiť</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
