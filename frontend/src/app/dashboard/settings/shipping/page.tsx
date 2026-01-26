'use client';
import { Truck, Package, MapPin, Save } from 'lucide-react';
import { useSettings } from '@/lib/store';

export default function ShippingSettingsPage() {
  const settings = useSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nastavenia dopravy</h1>
        <p className="text-gray-400">Konfigurácia dopravných metód</p>
      </div>
      <div className="grid gap-6">
        {/* DPD */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-semibold">DPD</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.shipping.dpd.enabled} onChange={(e) => settings.updateShipping('dpd', { enabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {settings.shipping.dpd.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">API kľúč</label>
                <input type="text" value={settings.shipping.dpd.apiKey} onChange={(e) => settings.updateShipping('dpd', { apiKey: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="Váš DPD API kľúč" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cena (€)</label>
                <input type="number" step="0.01" value={settings.shipping.dpd.price} onChange={(e) => settings.updateShipping('dpd', { price: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Zadarmo od (€)</label>
                <input type="number" step="0.01" value={settings.shipping.dpd.freeFrom} onChange={(e) => settings.updateShipping('dpd', { freeFrom: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={settings.shipping.dpd.showWidget} onChange={(e) => settings.updateShipping('dpd', { showWidget: e.target.checked })} className="w-5 h-5 rounded" />
                <label className="text-sm">Zobraziť widget pre výber pobočky</label>
              </div>
            </div>
          )}
        </div>

        {/* Zásielkovňa */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-semibold">Zásielkovňa</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.shipping.zasielkovna.enabled} onChange={(e) => settings.updateShipping('zasielkovna', { enabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {settings.shipping.zasielkovna.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">API kľúč</label>
                <input type="text" value={settings.shipping.zasielkovna.apiKey} onChange={(e) => settings.updateShipping('zasielkovna', { apiKey: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="Váš Zásielkovňa API kľúč" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cena (€)</label>
                <input type="number" step="0.01" value={settings.shipping.zasielkovna.price} onChange={(e) => settings.updateShipping('zasielkovna', { price: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Zadarmo od (€)</label>
                <input type="number" step="0.01" value={settings.shipping.zasielkovna.freeFrom} onChange={(e) => settings.updateShipping('zasielkovna', { freeFrom: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={settings.shipping.zasielkovna.showWidget} onChange={(e) => settings.updateShipping('zasielkovna', { showWidget: e.target.checked })} className="w-5 h-5 rounded" />
                <label className="text-sm">Zobraziť widget pre výber Z-Boxu</label>
              </div>
            </div>
          )}
        </div>

        {/* Osobný odber */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">Osobný odber</h2>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.shipping.personalPickup.enabled} onChange={(e) => settings.updateShipping('personalPickup', { enabled: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
          {settings.shipping.personalPickup.enabled && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Adresa</label>
                <input type="text" value={settings.shipping.personalPickup.address} onChange={(e) => settings.updateShipping('personalPickup', { address: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" placeholder="Ulica 123, Mesto" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Otváracie hodiny</label>
                <input type="text" value={settings.shipping.personalPickup.openingHours} onChange={(e) => settings.updateShipping('personalPickup', { openingHours: e.target.value })} className="w-full px-4 py-3 bg-gray-700 rounded-lg" />
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
