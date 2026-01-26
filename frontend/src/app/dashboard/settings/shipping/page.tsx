'use client';

import { useState } from 'react';
import { Truck, Package, MapPin, Plus, Edit, Trash2, Check, X, Clock, Euro } from 'lucide-react';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  freeFrom: number | null;
  estimatedDays: string;
  enabled: boolean;
  type: 'courier' | 'pickup' | 'store';
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: string[];
}

const initialMethods: ShippingMethod[] = [
  { id: 'courier-standard', name: 'Kuriér - Štandard', description: 'Doručenie kuriérom GLS/DPD', price: 4.99, freeFrom: 50, estimatedDays: '2-3 pracovné dni', enabled: true, type: 'courier' },
  { id: 'courier-express', name: 'Kuriér - Express', description: 'Doručenie do 24 hodín', price: 9.99, freeFrom: 100, estimatedDays: '1 pracovný deň', enabled: true, type: 'courier' },
  { id: 'packeta', name: 'Zásielkovňa', description: 'Výdajné miesta Zásielkovňa', price: 2.99, freeFrom: 40, estimatedDays: '1-2 pracovné dni', enabled: true, type: 'pickup' },
  { id: 'posta', name: 'Slovenská pošta', description: 'Doručenie Slovenskou poštou', price: 3.49, freeFrom: 60, estimatedDays: '3-5 pracovných dní', enabled: false, type: 'courier' },
  { id: 'store', name: 'Osobný odber', description: 'Odber na predajni', price: 0, freeFrom: null, estimatedDays: 'Ihneď po potvrdení', enabled: true, type: 'store' },
];

const initialZones: ShippingZone[] = [
  { id: 'sk', name: 'Slovensko', countries: ['SK'], methods: ['courier-standard', 'courier-express', 'packeta', 'store'] },
  { id: 'cz', name: 'Česká republika', countries: ['CZ'], methods: ['courier-standard', 'packeta'] },
  { id: 'eu', name: 'EÚ', countries: ['DE', 'AT', 'PL', 'HU'], methods: ['courier-standard'] },
];

export default function ShippingPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>(initialMethods);
  const [zones, setZones] = useState<ShippingZone[]>(initialZones);
  const [activeTab, setActiveTab] = useState<'methods' | 'zones'>('methods');
  const [editMethod, setEditMethod] = useState<ShippingMethod | null>(null);
  const [showModal, setShowModal] = useState(false);

  const toggleMethod = (id: string) => {
    setMethods(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const openEdit = (method: ShippingMethod) => {
    setEditMethod(method);
    setShowModal(true);
  };

  const saveMethod = (data: Partial<ShippingMethod>) => {
    if (!editMethod) return;
    setMethods(methods.map(m => m.id === editMethod.id ? { ...m, ...data } : m));
    setShowModal(false);
    setEditMethod(null);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'courier': return <Truck className="w-5 h-5" />;
      case 'pickup': return <Package className="w-5 h-5" />;
      case 'store': return <MapPin className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Doprava</h1>
          <p className="text-gray-400 mt-1">Nastavte spôsoby doručenia a zóny</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Pridať metódu
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="text-2xl font-bold">{methods.filter(m => m.enabled).length}</div>
          <div className="text-gray-400 text-sm">Aktívne metódy</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="text-2xl font-bold">{zones.length}</div>
          <div className="text-gray-400 text-sm">Doručovacie zóny</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="text-2xl font-bold">€{Math.min(...methods.filter(m => m.enabled).map(m => m.price)).toFixed(2)}</div>
          <div className="text-gray-400 text-sm">Od (najnižšia)</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="text-2xl font-bold">€{methods.find(m => m.id === 'courier-standard')?.freeFrom || 50}</div>
          <div className="text-gray-400 text-sm">Doprava zadarmo od</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('methods')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${activeTab === 'methods' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Metódy doručenia
        </button>
        <button
          onClick={() => setActiveTab('zones')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${activeTab === 'zones' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
        >
          Doručovacie zóny
        </button>
      </div>

      {/* Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-4">
          {methods.map(method => (
            <div key={method.id} className={`bg-gray-900 border rounded-2xl p-5 transition-all ${method.enabled ? 'border-gray-700' : 'border-gray-800 opacity-60'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  method.type === 'courier' ? 'bg-blue-500/20 text-blue-400' :
                  method.type === 'pickup' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {typeIcon(method.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-white">{method.name}</h3>
                    {method.price === 0 && <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">Zadarmo</span>}
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{method.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> {method.price > 0 ? `€${method.price.toFixed(2)}` : 'Zadarmo'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {method.estimatedDays}</span>
                    {method.freeFrom && <span>Zadarmo od €{method.freeFrom}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => openEdit(method)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => toggleMethod(method.id)} className={`w-12 h-6 rounded-full transition-colors ${method.enabled ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${method.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zones Tab */}
      {activeTab === 'zones' && (
        <div className="space-y-4">
          {zones.map(zone => (
            <div key={zone.id} className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{zone.name}</h3>
                  <p className="text-gray-400 text-sm">{zone.countries.join(', ')}</p>
                </div>
                <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {zone.methods.map(methodId => {
                  const method = methods.find(m => m.id === methodId);
                  if (!method) return null;
                  return (
                    <span key={methodId} className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 flex items-center gap-2">
                      {typeIcon(method.type)}
                      {method.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 hover:text-white hover:border-gray-600 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Pridať zónu
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl w-full max-w-lg border border-gray-800">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Upraviť metódu dopravy</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Názov</label>
                <input type="text" defaultValue={editMethod.name}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Popis</label>
                <input type="text" defaultValue={editMethod.description}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Cena (€)</label>
                  <input type="number" step="0.01" defaultValue={editMethod.price}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Zadarmo od (€)</label>
                  <input type="number" defaultValue={editMethod.freeFrom || ''}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" placeholder="Nevyžaduje sa" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Odhadovaný čas doručenia</label>
                <input type="text" defaultValue={editMethod.estimatedDays}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-gray-800 text-white rounded-xl">Zrušiť</button>
              <button onClick={() => saveMethod({})} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl">Uložiť</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
