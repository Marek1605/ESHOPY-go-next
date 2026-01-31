'use client';
import { useState } from 'react';
import { CreditCard, Building2, Package, Check, ExternalLink, TestTube } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/lib/store';

export default function PaymentSettingsPage() {
  const settings = useSettings();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Nastavenia uložené!');
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Platobné metódy</h1>
          <p className="text-gray-500">Nastavte platobné brány pre váš e-shop</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <span className="spinner" /> : <Check className="w-4 h-4" />}
          Uložiť zmeny
        </button>
      </div>

      <div className="space-y-6">
        {/* Comgate */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Comgate</h3>
                  <p className="text-sm text-gray-500">Platby kartou, Apple Pay, Google Pay</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://www.comgate.cz" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Dokumentácia <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => settings.updatePayments('comgate', { enabled: !settings.payments.comgate.enabled })}
                  className={`toggle-switch ${settings.payments.comgate.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-switch-dot" />
                </button>
              </div>
            </div>
          </div>
          
          {settings.payments.comgate.enabled && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <TestTube className="w-5 h-5 text-yellow-600" />
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={settings.payments.comgate.testMode}
                    onChange={(e) => settings.updatePayments('comgate', { testMode: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-yellow-800">Testovacie prostredie (sandbox)</span>
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Merchant ID *</label>
                  <input
                    type="text"
                    value={settings.payments.comgate.merchantId || ''}
                    onChange={(e) => settings.updatePayments('comgate', { merchantId: e.target.value })}
                    className="input-field"
                    placeholder="Váš Comgate Merchant ID"
                  />
                </div>
                <div>
                  <label className="input-label">Secret Key *</label>
                  <input
                    type="password"
                    value={settings.payments.comgate.secret || ''}
                    onChange={(e) => settings.updatePayments('comgate', { secret: e.target.value })}
                    className="input-field"
                    placeholder="Váš tajný kľúč"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Webhook URL</h4>
                <code className="text-sm bg-white px-3 py-2 rounded border block">
                  https://vas-eshop.sk/api/webhooks/comgate
                </code>
              </div>
            </div>
          )}
        </div>

        {/* GoPay */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">GoPay</h3>
                  <p className="text-sm text-gray-500">Platby kartou, bankový prevod, Apple Pay</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://help.gopay.com" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Dokumentácia <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => settings.updatePayments('gopay', { enabled: !settings.payments.gopay.enabled })}
                  className={`toggle-switch ${settings.payments.gopay.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-switch-dot" />
                </button>
              </div>
            </div>
          </div>
          
          {settings.payments.gopay.enabled && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <TestTube className="w-5 h-5 text-yellow-600" />
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={settings.payments.gopay.testMode}
                    onChange={(e) => settings.updatePayments('gopay', { testMode: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-yellow-800">Testovacie prostredie (sandbox)</span>
                </label>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="input-label">GoID *</label>
                  <input
                    type="text"
                    value={settings.payments.gopay.goId || ''}
                    onChange={(e) => settings.updatePayments('gopay', { goId: e.target.value })}
                    className="input-field"
                    placeholder="Váš GoPay GoID"
                  />
                </div>
                <div>
                  <label className="input-label">Client ID *</label>
                  <input
                    type="text"
                    value={settings.payments.gopay.clientId || ''}
                    onChange={(e) => settings.updatePayments('gopay', { clientId: e.target.value })}
                    className="input-field"
                    placeholder="Client ID"
                  />
                </div>
                <div>
                  <label className="input-label">Client Secret *</label>
                  <input
                    type="password"
                    value={settings.payments.gopay.clientSecret || ''}
                    onChange={(e) => settings.updatePayments('gopay', { clientSecret: e.target.value })}
                    className="input-field"
                    placeholder="Client Secret"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bank Transfer */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Bankový prevod</h3>
                  <p className="text-sm text-gray-500">Platba prevodom na účet</p>
                </div>
              </div>
              <button
                onClick={() => settings.updatePayments('bankTransfer', { enabled: !settings.payments.bankTransfer.enabled })}
                className={`toggle-switch ${settings.payments.bankTransfer.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {settings.payments.bankTransfer.enabled && (
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="input-label">IBAN *</label>
                  <input
                    type="text"
                    value={settings.payments.bankTransfer.iban}
                    onChange={(e) => settings.updatePayments('bankTransfer', { iban: e.target.value })}
                    className="input-field"
                    placeholder="SK89 0900 0000 0001 2345 6789"
                  />
                </div>
                <div>
                  <label className="input-label">SWIFT/BIC</label>
                  <input
                    type="text"
                    value={settings.payments.bankTransfer.swift}
                    onChange={(e) => settings.updatePayments('bankTransfer', { swift: e.target.value })}
                    className="input-field"
                    placeholder="GIBASKBX"
                  />
                </div>
                <div>
                  <label className="input-label">Názov banky</label>
                  <input
                    type="text"
                    value={settings.payments.bankTransfer.bankName}
                    onChange={(e) => settings.updatePayments('bankTransfer', { bankName: e.target.value })}
                    className="input-field"
                    placeholder="Slovenská sporiteľňa"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cash on Delivery */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dobierka</h3>
                  <p className="text-sm text-gray-500">Platba pri prevzatí zásielky</p>
                </div>
              </div>
              <button
                onClick={() => settings.updatePayments('cod', { enabled: !settings.payments.cod.enabled })}
                className={`toggle-switch ${settings.payments.cod.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {settings.payments.cod.enabled && (
            <div className="p-6">
              <div className="max-w-xs">
                <label className="input-label">Poplatok za dobierku (€)</label>
                <input
                  type="number"
                  step="0.10"
                  value={settings.payments.cod.fee}
                  onChange={(e) => settings.updatePayments('cod', { fee: parseFloat(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
