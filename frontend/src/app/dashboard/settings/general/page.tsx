'use client';
import { Store, Globe, Save } from 'lucide-react';
import { useSettings } from '@/lib/store';

export default function GeneralSettingsPage() {
  const settings = useSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Všeobecné nastavenia</h1>
        <p className="text-gray-400">Základné informácie o vašom obchode</p>
      </div>
      <div className="grid gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Informácie o obchode</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Názov obchodu</label>
              <input type="text" value={settings.general.shopName} onChange={(e) => settings.updateGeneral({ shopName: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={settings.general.email} onChange={(e) => settings.updateGeneral({ email: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefón</label>
              <input type="text" value={settings.general.phone} onChange={(e) => settings.updateGeneral({ phone: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold">Lokalizácia</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mena</label>
              <select value={settings.general.currency} onChange={(e) => settings.updateGeneral({ currency: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg">
                <option value="EUR">EUR (€)</option>
                <option value="CZK">CZK (Kč)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jazyk</label>
              <select value={settings.general.language} onChange={(e) => settings.updateGeneral({ language: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg">
                <option value="sk">Slovenčina</option>
                <option value="cs">Čeština</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Časová zóna</label>
              <select value={settings.general.timezone} onChange={(e) => settings.updateGeneral({ timezone: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg">
                <option value="Europe/Bratislava">Europe/Bratislava</option>
                <option value="Europe/Prague">Europe/Prague</option>
              </select>
            </div>
          </div>
        </div>
        <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Uložiť nastavenia
        </button>
      </div>
    </div>
  );
}
