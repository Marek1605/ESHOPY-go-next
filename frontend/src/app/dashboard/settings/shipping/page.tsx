'use client';

import { useState } from 'react';
import { Truck, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShippingSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [shipping, setShipping] = useState({
    dpd: { enabled: true, apiKey: '', price: 4.90, freeFrom: 50, showWidget: true },
    zasielkovna: { enabled: true, apiKey: '', price: 2.90, freeFrom: 50 },
    posta: { enabled: true, price: 3.50, freeFrom: 50 },
    gls: { enabled: false, apiKey: '', price: 4.50, freeFrom: 50 },
    personalPickup: { enabled: true, address: '', openingHours: 'Po-Pi: 9:00-17:00' },
  });

  const updateShipping = (key: string, value: any) => {
    setShipping(prev => ({ ...prev, [key]: { ...(prev as any)[key], ...value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Nastavenia dopravy ulozene');
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
          <h1 className="text-2xl font-bold text-white">Nastavenia dopravy</h1>
          <p className="text-gray-400">Konfiguracia dopravcov a cien</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Ulozit
        </button>
      </div>

      {/* DPD */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="font-semibold text-white">DPD</h3>
              <p className="text-sm text-gray-400">Kurierska sluzba DPD</p>
            </div>
          </div>
          <button onClick={() => updateShipping('dpd', { enabled: !shipping.dpd.enabled })} className={`w-12 h-6 rounded-full transition-colors ${shipping.dpd.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${shipping.dpd.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {shipping.dpd.enabled && (
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm text-gray-400 mb-1">API kluc</label>
              <input type="text" value={shipping.dpd.apiKey} onChange={(e) => updateShipping('dpd', { apiKey: e.target.value })} className="input" placeholder="Zadajte API kluc" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cena (EUR)</label>
              <input type="number" step="0.01" value={shipping.dpd.price} onChange={(e) => updateShipping('dpd', { price: parseFloat(e.target.value) })} className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Zadarmo od (EUR)</label>
              <input type="number" step="0.01" value={shipping.dpd.freeFrom} onChange={(e) => updateShipping('dpd', { freeFrom: parseFloat(e.target.value) })} className="input" />
            </div>
          </div>
        )}
      </div>

      {/* Zasielkovna */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="font-semibold text-white">Zasielkovna</h3>
              <p className="text-sm text-gray-400">Vyberove miesta Zasielkovne</p>
            </div>
          </div>
          <button onClick={() => updateShipping('zasielkovna', { enabled: !shipping.zasielkovna.enabled })} className={`w-12 h-6 rounded-full transition-colors ${shipping.zasielkovna.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${shipping.zasielkovna.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {shipping.zasielkovna.enabled && (
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm text-gray-400 mb-1">API kluc</label>
              <input type="text" value={shipping.zasielkovna.apiKey} onChange={(e) => updateShipping('zasielkovna', { apiKey: e.target.value })} className="input" placeholder="Zadajte API kluc" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cena (EUR)</label>
              <input type="number" step="0.01" value={shipping.zasielkovna.price} onChange={(e) => updateShipping('zasielkovna', { price: parseFloat(e.target.value) })} className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Zadarmo od (EUR)</label>
              <input type="number" step="0.01" value={shipping.zasielkovna.freeFrom} onChange={(e) => updateShipping('zasielkovna', { freeFrom: parseFloat(e.target.value) })} className="input" />
            </div>
          </div>
        )}
      </div>

      {/* Slovenska posta */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="font-semibold text-white">Slovenska posta</h3>
              <p className="text-sm text-gray-400">Dorucenie Slovenskou postou</p>
            </div>
          </div>
          <button onClick={() => updateShipping('posta', { enabled: !shipping.posta.enabled })} className={`w-12 h-6 rounded-full transition-colors ${shipping.posta.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${shipping.posta.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {shipping.posta.enabled && (
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cena (EUR)</label>
              <input type="number" step="0.01" value={shipping.posta.price} onChange={(e) => updateShipping('posta', { price: parseFloat(e.target.value) })} className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Zadarmo od (EUR)</label>
              <input type="number" step="0.01" value={shipping.posta.freeFrom} onChange={(e) => updateShipping('posta', { freeFrom: parseFloat(e.target.value) })} className="input" />
            </div>
          </div>
        )}
      </div>

      {/* Osobny odber */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-white">Osobny odber</h3>
              <p className="text-sm text-gray-400">Vyzdvihnutie na predajni</p>
            </div>
          </div>
          <button onClick={() => updateShipping('personalPickup', { enabled: !shipping.personalPickup.enabled })} className={`w-12 h-6 rounded-full transition-colors ${shipping.personalPickup.enabled ? 'bg-brand-500' : 'bg-gray-600'}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${shipping.personalPickup.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {shipping.personalPickup.enabled && (
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Adresa predajne</label>
              <input type="text" value={shipping.personalPickup.address} onChange={(e) => updateShipping('personalPickup', { address: e.target.value })} className="input" placeholder="Ulica, mesto" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Otvaracie hodiny</label>
              <input type="text" value={shipping.personalPickup.openingHours} onChange={(e) => updateShipping('personalPickup', { openingHours: e.target.value })} className="input" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
