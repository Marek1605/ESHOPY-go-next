'use client';
import { useState } from 'react';
import { Truck, Package, MapPin, Check, ExternalLink, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/lib/store';

export default function ShippingSettingsPage() {
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
          <h1 className="text-2xl font-bold">Doprava</h1>
          <p className="text-gray-500">Nastavte spôsoby dopravy pre váš e-shop</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <span className="spinner" /> : <Check className="w-4 h-4" />}
          Uložiť zmeny
        </button>
      </div>

      <div className="space-y-6">
        {/* DPD */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">DPD</h3>
                  <p className="text-sm text-gray-500">Kuriérska služba s výdajnými miestami</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://www.dpd.sk" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Web <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => settings.updateShipping('dpd', { enabled: !settings.shipping.dpd.enabled })}
                  className={`toggle-switch ${settings.shipping.dpd.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-switch-dot" />
                </button>
              </div>
            </div>
          </div>
          
          {settings.shipping.dpd.enabled && (
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="input-label">API Kľúč</label>
                  <input
                    type="password"
                    value={settings.shipping.dpd.apiKey || ''}
                    onChange={(e) => settings.updateShipping('dpd', { apiKey: e.target.value })}
                    className="input-field"
                    placeholder="Váš DPD API kľúč"
                  />
                </div>
                <div>
                  <label className="input-label">Cena dopravy (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={settings.shipping.dpd.price}
                    onChange={(e) => settings.updateShipping('dpd', { price: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Doprava zadarmo od (€)</label>
                  <input
                    type="number"
                    step="1"
                    value={settings.shipping.dpd.freeFrom}
                    onChange={(e) => settings.updateShipping('dpd', { freeFrom: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={settings.shipping.dpd.showWidget}
                  onChange={(e) => settings.updateShipping('dpd', { showWidget: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <span className="font-medium">Zobraziť widget na výber výdajného miesta</span>
                  <p className="text-sm text-gray-500">Zákazník si môže vybrať DPD ParcelShop priamo v checkout</p>
                </div>
              </label>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Pre aktiváciu widgetu</p>
                    <p className="mt-1">Kontaktujte DPD pre získanie API kľúča a aktiváciu služby ParcelShop widget.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zásielkovňa */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Zásielkovňa</h3>
                  <p className="text-sm text-gray-500">Výdajné miesta Zásielkovňa a Z-BOXy</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://www.zasielkovna.sk" target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  Web <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => settings.updateShipping('zasielkovna', { enabled: !settings.shipping.zasielkovna.enabled })}
                  className={`toggle-switch ${settings.shipping.zasielkovna.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-switch-dot" />
                </button>
              </div>
            </div>
          </div>
          
          {settings.shipping.zasielkovna.enabled && (
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="input-label">API Kľúč *</label>
                  <input
                    type="password"
                    value={settings.shipping.zasielkovna.apiKey || ''}
                    onChange={(e) => settings.updateShipping('zasielkovna', { apiKey: e.target.value })}
                    className="input-field"
                    placeholder="Váš Zásielkovňa API kľúč"
                  />
                </div>
                <div>
                  <label className="input-label">Cena dopravy (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={settings.shipping.zasielkovna.price}
                    onChange={(e) => settings.updateShipping('zasielkovna', { price: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Doprava zadarmo od (€)</label>
                  <input
                    type="number"
                    step="1"
                    value={settings.shipping.zasielkovna.freeFrom}
                    onChange={(e) => settings.updateShipping('zasielkovna', { freeFrom: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Widget Script</h4>
                <code className="text-xs bg-white px-3 py-2 rounded border block overflow-x-auto">
                  {`<script src="https://widget.packeta.com/v6/www/js/library.js"></script>`}
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Slovenská pošta */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Slovenská pošta</h3>
                  <p className="text-sm text-gray-500">Doručenie na adresu alebo poštu</p>
                </div>
              </div>
              <button
                onClick={() => settings.updateShipping('posta', { enabled: !settings.shipping.posta.enabled })}
                className={`toggle-switch ${settings.shipping.posta.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {settings.shipping.posta.enabled && (
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Cena dopravy (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={settings.shipping.posta.price}
                    onChange={(e) => settings.updateShipping('posta', { price: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Doprava zadarmo od (€)</label>
                  <input
                    type="number"
                    step="1"
                    value={settings.shipping.posta.freeFrom}
                    onChange={(e) => settings.updateShipping('posta', { freeFrom: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GLS */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">GLS</h3>
                  <p className="text-sm text-gray-500">Kuriérska služba GLS</p>
                </div>
              </div>
              <button
                onClick={() => settings.updateShipping('gls', { enabled: !settings.shipping.gls.enabled })}
                className={`toggle-switch ${settings.shipping.gls.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {settings.shipping.gls.enabled && (
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="input-label">API Kľúč</label>
                  <input
                    type="password"
                    value={settings.shipping.gls.apiKey || ''}
                    onChange={(e) => settings.updateShipping('gls', { apiKey: e.target.value })}
                    className="input-field"
                    placeholder="Váš GLS API kľúč"
                  />
                </div>
                <div>
                  <label className="input-label">Cena dopravy (€)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={settings.shipping.gls.price}
                    onChange={(e) => settings.updateShipping('gls', { price: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Doprava zadarmo od (€)</label>
                  <input
                    type="number"
                    step="1"
                    value={settings.shipping.gls.freeFrom}
                    onChange={(e) => settings.updateShipping('gls', { freeFrom: parseFloat(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Personal Pickup */}
        <div className="card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Osobný odber</h3>
                  <p className="text-sm text-gray-500">Vyzdvihnutie na vašej prevádzke</p>
                </div>
              </div>
              <button
                onClick={() => settings.updateShipping('personalPickup', { enabled: !settings.shipping.personalPickup.enabled })}
                className={`toggle-switch ${settings.shipping.personalPickup.enabled ? 'active' : ''}`}
              >
                <span className="toggle-switch-dot" />
              </button>
            </div>
          </div>
          
          {settings.shipping.personalPickup.enabled && (
            <div className="p-6 space-y-4">
              <div>
                <label className="input-label">Adresa prevádzky</label>
                <input
                  type="text"
                  value={settings.shipping.personalPickup.address}
                  onChange={(e) => settings.updateShipping('personalPickup', { address: e.target.value })}
                  className="input-field"
                  placeholder="Hlavná 1, 811 01 Bratislava"
                />
              </div>
              <div>
                <label className="input-label">Otváracie hodiny</label>
                <input
                  type="text"
                  value={settings.shipping.personalPickup.openingHours}
                  onChange={(e) => settings.updateShipping('personalPickup', { openingHours: e.target.value })}
                  className="input-field"
                  placeholder="Po-Pi: 9:00-17:00, So: 9:00-12:00"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
