'use client';
import { CreditCard, Building, Banknote, Save } from 'lucide-react';
import { useSettings } from '@/lib/store';

export default function PaymentsSettingsPage() {
  const settings = useSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nastavenia platieb</h1>
        <p className="text-gray-400">Konfigurácia platobných metód</p>
      </div>
      <div className="grid gap-6">
        {/* Comgate */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">Comgate</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.payments.comgate.enabled} onChange={(e) => settings.updatePayments('comgate', { enabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {settings.payments.comgate.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Merchant ID</label>
                <input type="text" value={settings.payments.comgate.merchantId} onChange={(e) => settings.updatePayments('comgate', { merchantId: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Secret</label>
                <input type="password" value={settings.payments.comgate.secret} onChange={(e) => settings.updatePayments('comgate', { secret: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={settings.payments.comgate.testMode} onChange={(e) => settings.updatePayments('comgate', { testMode: e.target.checked })} className="w-5 h-5 rounded" />
                <label className="text-sm">Testovací režim</label>
              </div>
            </div>
          )}
        </div>

        {/* GoPay */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold">GoPay</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.payments.gopay.enabled} onChange={(e) => settings.updatePayments('gopay', { enabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {settings.payments.gopay.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">GoID</label>
                <input type="text" value={settings.payments.gopay.goId} onChange={(e) => settings.updatePayments('gopay', { goId: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Client ID</label>
                <input type="text" value={settings.payments.gopay.clientId} onChange={(e) => settings.updatePayments('gopay', { clientId: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Client Secret</label>
                <input type="password" value={settings.payments.gopay.clientSecret} onChange={(e) => settings.updatePayments('gopay', { clientSecret: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={settings.payments.gopay.testMode} onChange={(e) => settings.updatePayments('gopay', { testMode: e.target.checked })} className="w-5 h-5 rounded" />
                <label className="text-sm">Testovací režim</label>
              </div>
            </div>
          )}
        </div>

        {/* Bankový prevod */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold">Bankový prevod</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.payments.bankTransfer.enabled} onChange={(e) => settings.updatePayments('bankTransfer', { enabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {settings.payments.bankTransfer.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">IBAN</label>
                <input type="text" value={settings.payments.bankTransfer.iban} onChange={(e) => settings.updatePayments('bankTransfer', { iban: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="SK00 0000 0000 0000 0000 0000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Názov banky</label>
                <input type="text" value={settings.payments.bankTransfer.bankName} onChange={(e) => settings.updatePayments('bankTransfer', { bankName: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
            </div>
          )}
        </div>

        {/* Dobierka */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold">Dobierka</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.payments.cod.enabled} onChange={(e) => settings.updatePayments('cod', { enabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {settings.payments.cod.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Poplatok (€)</label>
                <input type="number" step="0.01" value={settings.payments.cod.fee} onChange={(e) => settings.updatePayments('cod', { fee: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
            </div>
          )}
        </div>

        <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Uložiť nastavenia
        </button>
      </div>
    </div>
  );
}
