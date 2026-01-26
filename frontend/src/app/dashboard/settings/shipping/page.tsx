'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, Save, ChevronRight, Check, Package, MapPin, Building,
  Plus, Trash2, ExternalLink, Eye, EyeOff, AlertCircle, Clock
} from 'lucide-react';
import { useSettings } from '@/lib/store';

export default function ShippingSettingsPage() {
  const { shipping, updateShipping } = useSettings();
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const shippingProviders = [
    {
      id: 'dpd',
      name: 'DPD',
      description: 'Expresné doručenie kuriérom',
      icon: Truck,
      color: '#dc0032',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password' },
        { key: 'username', label: 'Username', type: 'text' },
        { key: 'password', label: 'Password', type: 'password' },
      ],
      hasWidget: true,
      docsUrl: 'https://www.dpd.sk',
    },
    {
      id: 'zasielkovna',
      name: 'Zásielkovňa',
      description: 'Výdajné miesta a Z-BOXy',
      icon: Package,
      color: '#ba1b02',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password' },
      ],
      hasWidget: true,
      docsUrl: 'https://client.packeta.com',
    },
    {
      id: 'slovakPost',
      name: 'Slovenská pošta',
      description: 'Doručenie poštou',
      icon: Building,
      color: '#ffd200',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password' },
      ],
      hasWidget: false,
      docsUrl: 'https://www.posta.sk',
    },
    {
      id: 'gls',
      name: 'GLS',
      description: 'Medzinárodná preprava',
      icon: Truck,
      color: '#0066b3',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password' },
        { key: 'clientNumber', label: 'Client Number', type: 'text' },
      ],
      hasWidget: false,
      docsUrl: 'https://gls-group.com',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/dashboard/settings" className="hover:text-gray-700">Nastavenia</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Doprava</span>
            </div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Truck className="w-6 h-6 text-blue-500" /> Spôsoby dopravy
            </h1>
          </div>
          <button
            onClick={handleSave}
            className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              saved ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Uložené!' : 'Uložiť zmeny'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Shipping Providers */}
        {shippingProviders.map(provider => {
          const data = (shipping as any)[provider.id] || {};
          
          return (
            <div key={provider.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: provider.color }}
                  >
                    <provider.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold flex items-center gap-2">
                      {provider.name}
                      <a href={provider.docsUrl} target="_blank" className="text-blue-500 hover:text-blue-600">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </h2>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                  </div>
                </div>
                <div
                  onClick={() => updateShipping(provider.id, { enabled: !data.enabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    data.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                    data.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>

              {data.enabled && (
                <div className="p-6 bg-gray-50 space-y-4">
                  {/* Pricing */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Cena dopravy (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={data.price || 0}
                        onChange={(e) => updateShipping(provider.id, { price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Zadarmo od (€)</label>
                      <input
                        type="number"
                        value={data.freeFrom || 0}
                        onChange={(e) => updateShipping(provider.id, { freeFrom: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <p className="mt-1 text-xs text-gray-500">0 = nikdy zadarmo</p>
                    </div>
                  </div>

                  {/* API Fields */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium text-sm">API nastavenia</h3>
                    {provider.fields.map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                        <div className="relative">
                          <input
                            type={field.type === 'password' && !showSecrets[`${provider.id}-${field.key}`] ? 'password' : 'text'}
                            value={data[field.key] || ''}
                            onChange={(e) => updateShipping(provider.id, { [field.key]: e.target.value })}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
                          />
                          {field.type === 'password' && (
                            <button
                              onClick={() => setShowSecrets(prev => ({ ...prev, [`${provider.id}-${field.key}`]: !prev[`${provider.id}-${field.key}`] }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showSecrets[`${provider.id}-${field.key}`] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Widget Toggle */}
                  {provider.hasWidget && (
                    <div className="pt-4 border-t">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium text-sm">Zobraziť widget výberu</p>
                          <p className="text-xs text-gray-500">Zákazník si môže vybrať presné miesto na mape</p>
                        </div>
                        <div
                          onClick={() => updateShipping(provider.id, { showWidget: !data.showWidget })}
                          className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                            data.showWidget ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                            data.showWidget ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Personal Pickup */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold">Osobný odber</h2>
                <p className="text-sm text-gray-500">Zákazník si vyzdvihne tovar osobne</p>
              </div>
            </div>
            <div
              onClick={() => updateShipping('personalPickup', { enabled: !shipping.personalPickup?.enabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                shipping.personalPickup?.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow ${
                shipping.personalPickup?.enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </div>
          </div>

          {shipping.personalPickup?.enabled && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Výdajné miesta
              </h3>
              
              {(shipping.personalPickup?.locations || []).map((location: any, index: number) => (
                <div key={location.id} className="p-4 border rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{location.name || `Miesto ${index + 1}`}</span>
                    <button
                      onClick={() => {
                        const locations = [...(shipping.personalPickup?.locations || [])];
                        locations.splice(index, 1);
                        updateShipping('personalPickup', { locations });
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={location.name}
                    onChange={(e) => {
                      const locations = [...(shipping.personalPickup?.locations || [])];
                      locations[index] = { ...location, name: e.target.value };
                      updateShipping('personalPickup', { locations });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Názov miesta"
                  />
                  <input
                    type="text"
                    value={location.address}
                    onChange={(e) => {
                      const locations = [...(shipping.personalPickup?.locations || [])];
                      locations[index] = { ...location, address: e.target.value };
                      updateShipping('personalPickup', { locations });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Adresa"
                  />
                  <input
                    type="text"
                    value={location.openingHours}
                    onChange={(e) => {
                      const locations = [...(shipping.personalPickup?.locations || [])];
                      locations[index] = { ...location, openingHours: e.target.value };
                      updateShipping('personalPickup', { locations });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Otváracie hodiny (napr. Po-Pi: 9:00-17:00)"
                  />
                </div>
              ))}

              <button
                onClick={() => {
                  const locations = [...(shipping.personalPickup?.locations || [])];
                  locations.push({
                    id: Date.now().toString(),
                    name: '',
                    address: '',
                    openingHours: 'Po-Pi: 9:00-17:00',
                  });
                  updateShipping('personalPickup', { locations });
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" /> Pridať výdajné miesto
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tip: Nastavte automatickú dopravu zadarmo</p>
            <p>Zákazníci nakupujú viac, keď vidia, že sú blízko k doprave zadarmo. Odporúčame nastaviť limit na €50.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
