'use client';

import { useState } from 'react';
import { 
  Truck, Package, MapPin, Plus, Edit2, Trash2, Check, X, Clock, 
  Euro, GripVertical, Save, Loader2, ChevronDown, ChevronUp, Settings,
  Building2, Globe, Zap, AlertCircle, ExternalLink, Info
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  freeFrom: number | null;
  estimatedDays: string;
  enabled: boolean;
  type: 'courier' | 'pickup' | 'store' | 'post' | 'packeta';
  carrier?: string;
  countries: string[];
  order: number;
  settings?: Record<string, any>;
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  methods: string[];
  isDefault: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHIPPING DATA - SK/CZ FOCUSED
// ═══════════════════════════════════════════════════════════════════════════════

const initialMethods: ShippingMethod[] = [
  { 
    id: 'packeta', 
    name: 'Zásielkovňa', 
    description: 'Výdajné miesta Z-Point, Z-BOX, AlzaBoxy', 
    price: 2.49, 
    freeFrom: 40, 
    estimatedDays: '1-2 pracovné dni', 
    enabled: true, 
    type: 'packeta',
    carrier: 'Packeta',
    countries: ['SK', 'CZ'],
    order: 1,
    settings: { apiKey: '', apiPassword: '' }
  },
  { 
    id: 'packeta-home', 
    name: 'Zásielkovňa domov', 
    description: 'Doručenie na adresu cez Zásielkovňu', 
    price: 3.99, 
    freeFrom: 50, 
    estimatedDays: '1-2 pracovné dni', 
    enabled: true, 
    type: 'courier',
    carrier: 'Packeta',
    countries: ['SK', 'CZ'],
    order: 2
  },
  { 
    id: 'gls', 
    name: 'GLS kuriér', 
    description: 'Expresné doručenie na adresu', 
    price: 4.49, 
    freeFrom: 60, 
    estimatedDays: '1-2 pracovné dni', 
    enabled: true, 
    type: 'courier',
    carrier: 'GLS',
    countries: ['SK', 'CZ', 'HU', 'PL'],
    order: 3
  },
  { 
    id: 'dpd', 
    name: 'DPD kuriér', 
    description: 'Doručenie na adresu s možnosťou presmerovanie', 
    price: 4.99, 
    freeFrom: 60, 
    estimatedDays: '1-2 pracovné dni', 
    enabled: true, 
    type: 'courier',
    carrier: 'DPD',
    countries: ['SK', 'CZ', 'AT', 'DE', 'PL'],
    order: 4
  },
  { 
    id: 'posta-sk', 
    name: 'Slovenská pošta', 
    description: 'Doručenie Slovenskou poštou', 
    price: 3.49, 
    freeFrom: 50, 
    estimatedDays: '2-4 pracovné dni', 
    enabled: false, 
    type: 'post',
    carrier: 'Slovenská pošta',
    countries: ['SK'],
    order: 5
  },
  { 
    id: 'posta-cz', 
    name: 'Česká pošta', 
    description: 'Doručenie Českou poštou', 
    price: 89, 
    freeFrom: 1000, 
    estimatedDays: '2-3 pracovné dni', 
    enabled: false, 
    type: 'post',
    carrier: 'Česká pošta',
    countries: ['CZ'],
    order: 6
  },
  { 
    id: 'balikovna', 
    name: 'Balíkovna', 
    description: 'Česká pošta - výdajné miesta', 
    price: 59, 
    freeFrom: 800, 
    estimatedDays: '1-2 pracovné dni', 
    enabled: true, 
    type: 'pickup',
    carrier: 'Česká pošta',
    countries: ['CZ'],
    order: 7
  },
  { 
    id: 'store', 
    name: 'Osobný odber', 
    description: 'Odber na predajni zadarmo', 
    price: 0, 
    freeFrom: null, 
    estimatedDays: 'Ihneď po potvrdení', 
    enabled: true, 
    type: 'store',
    countries: ['SK'],
    order: 8,
    settings: { address: 'Hlavná 1, 811 01 Bratislava', openHours: 'Po-Pia 9:00-18:00' }
  },
];

const initialZones: ShippingZone[] = [
  { id: 'sk', name: 'Slovensko', countries: ['SK'], methods: ['packeta', 'packeta-home', 'gls', 'dpd', 'posta-sk', 'store'], isDefault: true },
  { id: 'cz', name: 'Česká republika', countries: ['CZ'], methods: ['packeta', 'packeta-home', 'gls', 'dpd', 'balikovna', 'posta-cz'], isDefault: false },
  { id: 'eu', name: 'EÚ', countries: ['AT', 'DE', 'PL', 'HU'], methods: ['dpd', 'gls'], isDefault: false },
];

const carriers = [
  { id: 'packeta', name: 'Zásielkovňa / Packeta', logo: '📦', popular: true },
  { id: 'gls', name: 'GLS', logo: '🟡', popular: true },
  { id: 'dpd', name: 'DPD', logo: '🔴', popular: true },
  { id: 'posta-sk', name: 'Slovenská pošta', logo: '🇸🇰' },
  { id: 'posta-cz', name: 'Česká pošta', logo: '🇨🇿' },
  { id: 'sps', name: 'SPS', logo: '🔵' },
  { id: 'toptrans', name: 'TOPTRANS', logo: '🟢' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SHIPPING PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function ShippingPage() {
  const [methods, setMethods] = useState<ShippingMethod[]>(initialMethods);
  const [zones, setZones] = useState<ShippingZone[]>(initialZones);
  const [activeTab, setActiveTab] = useState<'methods' | 'zones' | 'carriers'>('methods');
  const [editMethod, setEditMethod] = useState<ShippingMethod | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleMethod = (id: string) => {
    setMethods(methods.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const openEdit = (method: ShippingMethod) => {
    setEditMethod({ ...method });
    setShowModal(true);
  };

  const saveMethod = async () => {
    if (!editMethod) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setMethods(methods.map(m => m.id === editMethod.id ? editMethod : m));
    setSaving(false);
    setShowModal(false);
    setEditMethod(null);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'courier': return <Truck className="w-5 h-5" />;
      case 'pickup': case 'packeta': return <Package className="w-5 h-5" />;
      case 'store': return <Building2 className="w-5 h-5" />;
      case 'post': return <MapPin className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'courier': return 'bg-blue-500/20 text-blue-400';
      case 'pickup': case 'packeta': return 'bg-purple-500/20 text-purple-400';
      case 'store': return 'bg-green-500/20 text-green-400';
      case 'post': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const enabledMethods = methods.filter(m => m.enabled);
  const minPrice = Math.min(...enabledMethods.map(m => m.price));
  const avgFreeFrom = enabledMethods.filter(m => m.freeFrom).reduce((sum, m) => sum + (m.freeFrom || 0), 0) / enabledMethods.filter(m => m.freeFrom).length || 0;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Doprava a doručenie</h1>
          <p className="text-slate-400 mt-1">Nastavte spôsoby doručenia pre váš e-shop</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Pridať metódu
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="text-2xl font-bold">{enabledMethods.length}</div>
          <div className="text-slate-400 text-sm">Aktívne metódy</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="text-2xl font-bold">{zones.length}</div>
          <div className="text-slate-400 text-sm">Doručovacie zóny</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="text-2xl font-bold">€{minPrice.toFixed(2)}</div>
          <div className="text-slate-400 text-sm">Najnižšia cena</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <div className="text-2xl font-bold">€{avgFreeFrom.toFixed(0)}</div>
          <div className="text-slate-400 text-sm">Ø doprava zadarmo</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4">
        {[
          { id: 'methods', label: 'Metódy doručenia', icon: Truck },
          { id: 'zones', label: 'Doručovacie zóny', icon: Globe },
          { id: 'carriers', label: 'Prepravcovia', icon: Package },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-4">
          {methods.sort((a, b) => a.order - b.order).map(method => {
            const isFree = method.freeFrom && method.freeFrom > 0;
            return (
              <div 
                key={method.id} 
                className={`bg-slate-800 border rounded-2xl p-5 transition-all ${
                  method.enabled ? 'border-slate-700' : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Drag Handle & Type Icon */}
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-slate-600 cursor-grab hidden md:block" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColor(method.type)}`}>
                      {typeIcon(method.type)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{method.name}</h3>
                      {method.type === 'packeta' && (
                        <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Odporúčané
                        </span>
                      )}
                      {method.price === 0 && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">Zadarmo</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{method.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {method.estimatedDays}
                      </span>
                      {method.carrier && (
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" /> {method.carrier}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        {method.countries.slice(0, 3).map(c => (
                          <span key={c} className="px-1.5 py-0.5 bg-slate-700 rounded">{c}</span>
                        ))}
                        {method.countries.length > 3 && <span>+{method.countries.length - 3}</span>}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[120px]">
                    {method.price === 0 ? (
                      <span className="text-lg font-bold text-green-400">Zadarmo</span>
                    ) : (
                      <span className="text-lg font-bold">€{method.price.toFixed(2)}</span>
                    )}
                    {isFree && (
                      <p className="text-xs text-slate-500">Zadarmo od €{method.freeFrom}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(method)}
                      className="p-2.5 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleMethod(method.id)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        method.enabled ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        method.enabled ? 'translate-x-8' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zones Tab */}
      {activeTab === 'zones' && (
        <div className="space-y-4">
          {zones.map(zone => (
            <div key={zone.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {zone.name}
                      {zone.isDefault && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">Predvolená</span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-400">{zone.countries.join(', ')}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {zone.methods.map(methodId => {
                  const method = methods.find(m => m.id === methodId);
                  if (!method) return null;
                  return (
                    <span 
                      key={methodId} 
                      className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
                        method.enabled ? 'bg-slate-700 text-slate-300' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {typeIcon(method.type)}
                      {method.name}
                      {!method.enabled && <span className="text-xs text-red-400">(vypnuté)</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-slate-700 rounded-2xl text-slate-500 hover:text-white hover:border-slate-600 flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-5 h-5" /> Pridať zónu
          </button>
        </div>
      )}

      {/* Carriers Tab */}
      {activeTab === 'carriers' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-400">Integrácia prepravcov</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Pre automatické generovanie štítkov a sledovanie zásielok pripojte API prepravcov.
                </p>
              </div>
            </div>
          </div>

          {carriers.map(carrier => (
            <div key={carrier.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
              <div className="text-3xl">{carrier.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{carrier.name}</h3>
                  {carrier.popular && (
                    <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                      Populárne
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">API integrácia</p>
              </div>
              <button className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors text-sm">
                Pripojiť
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div className="mt-8 p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl flex items-start gap-4">
        <Zap className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-purple-400">Odporúčanie pre SK/CZ</h4>
          <p className="text-sm text-slate-400 mt-1">
            Pre slovenský a český trh odporúčame <strong>Zásielkovňu</strong> - má najväčšiu sieť výdajných miest, 
            nízke ceny a vysokú spokojnosť zákazníkov. Ako doplnok pridajte <strong>GLS</strong> alebo <strong>DPD</strong> 
            pre expresné doručenie na adresu.
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Upraviť metódu dopravy</h2>
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Názov</label>
                <input
                  type="text"
                  value={editMethod.name}
                  onChange={(e) => setEditMethod({ ...editMethod, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Popis</label>
                <input
                  type="text"
                  value={editMethod.description}
                  onChange={(e) => setEditMethod({ ...editMethod, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Cena (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editMethod.price}
                    onChange={(e) => setEditMethod({ ...editMethod, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Zadarmo od (€)</label>
                  <input
                    type="number"
                    value={editMethod.freeFrom || ''}
                    onChange={(e) => setEditMethod({ ...editMethod, freeFrom: parseFloat(e.target.value) || null })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Nevyžaduje sa"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Odhadovaný čas doručenia</label>
                <input
                  type="text"
                  value={editMethod.estimatedDays}
                  onChange={(e) => setEditMethod({ ...editMethod, estimatedDays: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  placeholder="1-2 pracovné dni"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-900 p-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700">
                Zrušiť
              </button>
              <button onClick={saveMethod} disabled={saving} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Ukladám...' : 'Uložiť'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
