'use client';

import { useState } from 'react';
import { CreditCard, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentsSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [payments, setPayments] = useState({
    comgate: { enabled: false, testMode: true, merchantId: '', secret: '' },
    gopay: { enabled: false, testMode: true, goId: '', clientId: '', clientSecret: '' },
    bankTransfer: { enabled: true, iban: '', swift: '', bankName: '' },
    cod: { enabled: true, fee: 1.50 },
  });

  const updatePayments = (key: string, value: any) => {
    setPayments(prev => ({ ...prev, [key]: { ...(prev as any)[key], ...value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Nastavenia platieb ulozene');
    } catch (error) {
      toast.error('Chyba pri ukladani');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nastavenia platieb</h1>
          <p className="text-gray-400">Konfiguracia platobnych metod</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Ulozit
        </button>
      </div>

      {/* Comgate */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="font-semibold text-white">Comgate</h3>
              <p className="text-sm text-gray-400">Platobna brana Comgate</p>
            </div>
          </div>
          <button onClick={() => updatePayments('comgate', { enabled: !payments.comgate.enabled })} className={`w-12 h-6 rounded-full transition-colors ${payments.comgate.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${payments.comgate.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {payments.comgate.enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={payments.comgate.testMode} onChange={(e) => updatePayments('comgate', { testMode: e.target.checked })} className="rounded" />
              <span className="text-sm text-gray-400">Testovaci rezim</span>
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Merchant ID</label>
                <input type="text" value={payments.comgate.merchantId} onChange={(e) => updatePayments('comgate', { merchantId: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Secret</label>
                <input type="password" value={payments.comgate.secret} onChange={(e) => updatePayments('comgate', { secret: e.target.value })} className="input" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GoPay */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-white">GoPay</h3>
              <p className="text-sm text-gray-400">Platobna brana GoPay</p>
            </div>
          </div>
          <button onClick={() => updatePayments('gopay', { enabled: !payments.gopay.enabled })} className={`w-12 h-6 rounded-full transition-colors ${payments.gopay.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${payments.gopay.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {payments.gopay.enabled && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={payments.gopay.testMode} onChange={(e) => updatePayments('gopay', { testMode: e.target.checked })} className="rounded" />
              <span className="text-sm text-gray-400">Testovaci rezim</span>
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">GoID</label>
                <input type="text" value={payments.gopay.goId} onChange={(e) => updatePayments('gopay', { goId: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Client ID</label>
                <input type="text" value={payments.gopay.clientId} onChange={(e) => updatePayments('gopay', { clientId: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Client Secret</label>
                <input type="password" value={payments.gopay.clientSecret} onChange={(e) => updatePayments('gopay', { clientSecret: e.target.value })} className="input" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bank Transfer */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="font-semibold text-white">Bankovy prevod</h3>
              <p className="text-sm text-gray-400">Platba prevodom na ucet</p>
            </div>
          </div>
          <button onClick={() => updatePayments('bankTransfer', { enabled: !payments.bankTransfer.enabled })} className={`w-12 h-6 rounded-full transition-colors ${payments.bankTransfer.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${payments.bankTransfer.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {payments.bankTransfer.enabled && (
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm text-gray-400 mb-1">IBAN</label>
              <input type="text" value={payments.bankTransfer.iban} onChange={(e) => updatePayments('bankTransfer', { iban: e.target.value })} className="input" placeholder="SK..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">SWIFT/BIC</label>
              <input type="text" value={payments.bankTransfer.swift} onChange={(e) => updatePayments('bankTransfer', { swift: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nazov banky</label>
              <input type="text" value={payments.bankTransfer.bankName} onChange={(e) => updatePayments('bankTransfer', { bankName: e.target.value })} className="input" />
            </div>
          </div>
        )}
      </div>

      {/* COD */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-white">Dobierka</h3>
              <p className="text-sm text-gray-400">Platba pri prevzati</p>
            </div>
          </div>
          <button onClick={() => updatePayments('cod', { enabled: !payments.cod.enabled })} className={`w-12 h-6 rounded-full transition-colors ${payments.cod.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${payments.cod.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {payments.cod.enabled && (
          <div className="pt-4 border-t border-gray-700">
            <div className="max-w-xs">
              <label className="block text-sm text-gray-400 mb-1">Poplatok za dobierku (EUR)</label>
              <input type="number" step="0.01" value={payments.cod.fee} onChange={(e) => updatePayments('cod', { fee: parseFloat(e.target.value) })} className="input" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
